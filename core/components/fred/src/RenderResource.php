<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred;

use Fred\Model\FredElement;
use Fred\Model\FredTheme;
use MODX\Revolution\modResource;
use MODX\Revolution\modRequest;
use MODX\Revolution\modTemplateVar;
use MODX\Revolution\modTemplateVarTemplate;
use MODX\Revolution\modX;
use Wa72\HtmlPageDom\HtmlPageCrawler;

final class RenderResource
{
    /** @var modResource */
    public $resource;

    /** @var FredTheme */
    private $theme;

    /** @var \Twig\Environment */
    private $twig;

    /** @var modX */
    private $modx;

    /** @var Fred */
    private $fred;

    /** @var array */
    public $data = [];

    /** @var array */
    public $pageSettings = [];

    /** @var array */
    private $elementOptions = [];

    /** @var array */
    private $elementCache = [];

    public function __construct(modResource $resource, modX $modx, $data = [], $pageSettings = [])
    {
        $this->resource = $resource;
        $this->modx = $modx;
        $this->fred = $modx->services->get('fred');

        $this->theme = $this->fred->getTheme($this->resource->template);
        if (empty($data)) {
            $this->data = $this->resource->getProperty('data', 'fred');
        } else {
            $this->data = $data;
        }
        if (empty($this->data) && !empty($this->resource->content)) {
            $this->setDefaults();
        }
        $this->pageSettings = $pageSettings;
        if (empty($this->pageSettings)) {
            $this->pageSettings = $this->resource->toArray();
            unset($this->pageSettings['content']);
            $tvs = $this->resource->getTemplateVars();
            foreach ($tvs as $tv) {
                if (isset($this->pageSettings['tv_' . $tv->get('name')])) continue;
                $this->pageSettings['tv_' . $tv->get('name')] = $this->resource->getTVValue($tv->get('name'));
            }
        } else {
            if (!empty($this->pageSettings['tvs'])) {
                foreach ($this->pageSettings['tvs'] as $key => $value) {
                    $this->pageSettings['tv_' . $key] = $value;
                }
            }
        }
        $elements = [];
        $this->gatherElements($elements, $this->data);

        $loader = new \Twig\Loader\ArrayLoader($elements);
        $this->twig = new \Twig\Environment($loader, []);
        $this->twig->setCache(false);
    }

    private function setDefaults()
    {
        if (!$this->theme) {
            return;
        }

        $defElement = explode('|', $this->theme->get('default_element'));
        if (!empty($defElement[0]) && is_numeric($defElement[0]) && !empty($defElement[1])) {
            /** @var FredElement $defaultElement */
            $defaultElement = $this->modx->getObject(FredElement::class, ['id' => $defElement[0]]);
            if (!$defaultElement) {
                $this->modx->log(modX::LOG_LEVEL_ERROR, "[Fred] Element {$defElement[0]} wasn't found.");
                return;
            }

            $this->data = [
                'content' => [
                    [
                        'widget'   => $defaultElement->get('uuid'),
                        'values'   => [
                            $defElement[1] => [
                                '_raw' => [
                                    '_value' => $this->resource->content,
                                ],
                            ],
                        ],
                        'settings' => [],
                        'children' => [],
                    ],
                ],
            ];
            $this->resource->setProperty('data', $this->data, 'fred');
            $this->resource->save();
        }
    }

    private function gatherElements(&$elements, $dropZones)
    {
        foreach ($dropZones as $dropZone) {
            if (!is_array($dropZone)) {
                continue;
            }
            foreach ($dropZone as $element) {
                $elementId = $element['widget'];

                if (!isset($elements[$elementId])) {
                    $elements[$elementId] = $this->getElement($elementId);
                }

                $this->gatherElements($elements, $element['children']);
            }
        }
    }

    private function getElement($id): string
    {
        /** @var FredElement $element */
        $element = $this->modx->getObject(FredElement::class, ['uuid' => $id]);
        if (!$element) {
            $this->modx->log(modX::LOG_LEVEL_ERROR, "[Fred] Element {$id} wasn't found.");
            return '';
        }

        $this->elementOptions[$id] = $element->processOptions();

        if (isset($this->elementOptions[$id]['cacheOutput']) && ($this->elementOptions[$id]['cacheOutput'] === true)) {
            $cache = $element->getCache($this->resource->id);
            if ($cache !== false) {
                $this->elementCache[$id] = $cache;
            }
        }

        return $element->content;
    }

    private function cacheElement($id, $content): void
    {
        /** @var FredElement $element */
        $element = $this->modx->getObject(FredElement::class, ['uuid' => $id]);
        if (!$element) {
            $this->modx->log(modX::LOG_LEVEL_ERROR, "[Fred] Element {$id} wasn't found.");
            return;
        }
        $element->setCache($this->resource->id, $content);
    }

    public function render(): bool
    {
        $contentData = !empty($this->data['content']) ? $this->data['content'] : [];
        $html = '';

        foreach ($contentData as $item) {
            if (isset($this->elementCache[$item['widget']])) {
                try {
                    $html .= $this->renderElement(
                        $this->elementCache[$item['widget']],
                        $item,
                        true,
                        true
                    );
                } catch (\Exception $e) {
                }
            } else {
                try {
                    $elementContent = $this->renderElement(
                        $this->twig->render(
                            $item['widget'],
                            $this->mergeSetting(!empty($item['elId']) ? $item['elId'] : '', $item['settings'])
                        ),
                        $item,
                        true,
                        (isset($this->elementOptions[$item['widget']]['cacheOutput'])) ?
                            $this->elementOptions[$item['widget']]['cacheOutput'] : false
                    );
                    if (isset($this->elementOptions[$item['widget']]['cacheOutput'])
                        && $this->elementOptions[$item['widget']]['cacheOutput'] === true) {
                        $this->cacheElement($item['widget'], $elementContent);
                    }
                    $html .= $elementContent;
                } catch (\Exception $e) {
                    $this->modx->log(modX::LOG_LEVEL_ERROR, "[Fred] Error rendering element {$item['widget']}: {$e->getMessage()}");
                }
            }
        }

        $parser = $this->modx->getParser();
        $html = Utils::htmlDecodeTags($html, $parser);

        $loader = new \Twig\Loader\ArrayLoader(['content' => $html]);
        $twig = new \Twig\Environment($loader, []);
        $twig->setCache(false);

        try {
            $this->resource->set('content', $twig->render('content', $this->mergeSetting('')));
        } catch (\Exception $e) {
            $this->modx->log(modX::LOG_LEVEL_ERROR, "[Fred] Error rendering resource {$this->resource->id}: {$e->getMessage()}");
            $this->modx->log(modX::LOG_LEVEL_ERROR, "[Fred] HTML \n {$html}");
            $this->resource->set('content', '');
        }

        $c = $this->modx->newQuery(modTemplateVar::class);
        $c->leftJoin(modTemplateVarTemplate::class, 'TemplateVarTemplates');

        $c->where(
            [
                'TemplateVarTemplates.templateid' => $this->resource->get('template'),
            ]
        );

        /** @var modTemplateVar[] $tvs */
        $tvs = $this->modx->getIterator(modTemplateVar::class, $c);
        $mTypes = $this->modx->getOption('manipulatable_url_tv_output_types', null, 'image,file');
        $mTypes = explode(',', $mTypes);
        foreach ($tvs as $tv) {
            $tvName = $tv->get('name');
            // check if TV is in base data or pageSettings
            $tvValue = (isset($this->pageSettings['tvs'][$tvName])) ?
                $this->pageSettings['tvs'][$tvName] :
                ($this->data[$tvName] ?? null);
            if (isset($tvValue)) {
                $tvContent = '';
                if ($tv->type === 'freddropzone' || is_array($tvValue)) {
                    foreach ($tvValue as $item) {
                        try {
                            $tvContent .= $this->renderElement(
                                $this->twig->render(
                                    $item['widget'],
                                    $this->mergeSetting(!empty($item['elId']) ? $item['elId'] : '', $item['settings'])
                                ),
                                $item,
                                true
                            );
                        } catch (\Exception $e) {
                        }
                    }
                } else {
                    $tvContent = $tvValue;
                }
                $tvContent = Utils::htmlDecodeTags($tvContent, $parser);
                if (in_array($tv->type, $mTypes, true)) {
                    $this->resource->setTVValue($tvName, $this->reversePreparedOutput($tv, $tvContent, $this->resource));
                } else {
                    $this->resource->setTVValue($tvName, $tvContent);
                }
            }
        }

        $this->data['fingerprint'] = Utils::resourceFingerprint($this->resource);
        $this->resource->setProperty('data', $this->data, 'fred');

        if ($this->resource->save()) {
            $this->modx->getCacheManager()->refresh();
            return true;
        }

        return false;
    }

    private function renderElement($html, $item, $replaceFakes = false, $parseModx = false)
    {
        $html = HtmlPageCrawler::create('<div>' . $html . '</div>');

        $renderElements = $html->filter('[data-fred-render]');
        $renderElements->each(
            function (HtmlPageCrawler $node, $i) use ($item, $html) {
                $render = $node->getAttribute('data-fred-render');
                if (($render === 'true') || ($render === '1')) {
                    $node->removeAttribute('data-fred-render');
                } else {
                    $node->remove();
                }
            }
        );

        $dzMinHeightElements = $html->filter('[data-fred-min-height]');
        $dzMinHeightElements->each(
            function (HtmlPageCrawler $node, $i) use ($item, $html) {
                $node->removeAttribute('data-fred-min-height');
            }
        );

        $dzMinWidthElements = $html->filter('[data-fred-min-width]');
        $dzMinWidthElements->each(
            function (HtmlPageCrawler $node, $i) use ($item, $html) {
                $node->removeAttribute('data-fred-min-width');
            }
        );

        $images = $html->filter('img');
        $images->each(
            function (HtmlPageCrawler $node, $i) {
                $node->setAttribute('data-fred-fake-src', $node->getAttribute('src'));
                $node->removeAttribute('src');
            }
        );

        $forms = $html->filter('form');
        $forms->each(
            function (HtmlPageCrawler $node, $i) {
                $node->setAttribute('data-fred-fake-action', $node->getAttribute('action'));
                $node->removeAttribute('action');
            }
        );

        $fredLinks = $html->filter('[data-fred-link-type]');
        $fredLinks->each(
            function (HtmlPageCrawler $node, $i) use ($item) {
                $linkType = $node->getAttribute('data-fred-link-type');
                $node->removeAttr('data-fred-link-type');

                if ($linkType === 'page') {
                    $resourceId = intval($node->getAttribute('data-fred-link-page'));
                    $anchor = $node->getAttribute('data-fred-link-anchor') ? ('#' . $node->getAttribute('data-fred-link-anchor')) : '';

                    if ($resourceId > 0) {
                        $node->setAttribute('data-fred-fake-href', "[[~{$resourceId}]]{$anchor}");
                    } else {
                        $node->setAttribute('data-fred-fake-href', $anchor);
                    }

                    $node->removeAttr('href');

                    $node->removeAttr('data-fred-link-page');
                    $node->removeAttr('data-fred-link-anchor');
                }
            }
        );

        $links = $html->filter('a');
        $links->each(
            function (HtmlPageCrawler $node, $i) {
                $href = $node->getAttribute('href');

                if (!empty($href)) {
                    $node->setAttribute('data-fred-fake-href', $href);
                    $node->removeAttribute('href');
                }
            }
        );

        $html = HtmlPageCrawler::create($html->first()->getInnerHtml());

        $elements = $html->filter('[data-fred-name]');
        $elements->each(
            function (HtmlPageCrawler $node, $i) use ($item, $html) {
                $valueName = $node->getAttribute('data-fred-name');

                $value = null;

                $target = $node->getAttribute('data-fred-target');
                if (!empty($target)) {
                    $value = $this->resource->get($target);
                } else {
                    if (isset($item['values'][$valueName]['_raw']['_value'])) {
                        $value = $item['values'][$valueName]['_raw']['_value'];
                    }
                }

                if ($value !== null) {
                    switch ($node->nodeName()) {
                        case 'i':
                            $node->setAttribute('class', $value);
                            break;
                        case 'img':
                            $node->setAttribute('data-fred-fake-src', $value);
                            break;
                        default:
                            $node->setInnerHtml($value);
                    }
                }

                $this->setValueForBindElements($html, $valueName, $value);

                $attrs = $node->getAttribute('data-fred-attrs');
                $attrs = explode(',', $attrs);
                foreach ($attrs as $attr) {
                    if (isset($item['values'][$valueName]['_raw'][$attr])) {
                        $node->setAttribute($attr, $item['values'][$valueName]['_raw'][$attr]);
                    }
                }

                // Cleanup
                $node->removeAttr('data-fred-name');
                $node->removeAttr('data-fred-target');
                $node->removeAttr('data-fred-rte');
                $node->removeAttr('data-fred-rte-config');
                $node->removeAttr('data-fred-attrs');
                $node->removeAttr('data-fred-editable');
                $node->removeAttr('contenteditable');
                $node->removeAttr('data-fred-editable');
                $node->removeAttr('data-fred-media-source');
                $node->removeAttr('data-fred-image-media-source');
            }
        );

        $fredLinks = $html->filter('[data-fred-link-type]');
        $fredLinks->each(
            function (HtmlPageCrawler $node, $i) use ($item) {
                $linkType = $node->getAttribute('data-fred-link-type');
                $node->removeAttr('data-fred-link-type');

                if ($linkType === 'page') {
                    $resourceId = intval($node->getAttribute('data-fred-link-page'));
                    $anchor = $node->getAttribute('data-fred-link-anchor') ? ('#' . $node->getAttribute('data-fred-link-anchor')) : '';

                    if ($resourceId > 0) {
                        $node->setAttribute('data-fred-fake-href', "[[~{$resourceId}]]{$anchor}");
                    } else {
                        $node->setAttribute('data-fred-fake-href', $anchor);
                    }

                    $node->removeAttr('href');

                    $node->removeAttr('data-fred-link-page');
                    $node->removeAttr('data-fred-link-anchor');
                } else {
                    $href = $node->getAttribute('href');
                    $node->removeAttr('href');

                    $node->setAttribute('data-fred-fake-href', $href);
                }
            }
        );

        $links = $html->filter('a');
        $links->each(
            function (HtmlPageCrawler $node, $i) {
                $href = $node->getAttribute('href');

                if (!empty($href)) {
                    $node->setAttribute('data-fred-fake-href', $href);
                    $node->removeAttribute('href');
                }
            }
        );

        $blockClasses = $html->filter('[data-fred-block-class]');
        $blockClasses->each(
            function (HtmlPageCrawler $node, $i) use ($item) {
                $classes = $node->getAttribute('data-fred-block-class');
                $classes = Utils::explodeAndClean($classes, ' ');

                foreach ($classes as $class) {
                    $node->addClass($class);
                }

                $node->removeAttr('data-fred-block-class');
            }
        );

        $fredClasses = $html->filter('[data-fred-class]');
        $fredClasses->each(
            function (HtmlPageCrawler $node, $i) use ($item) {
                $classes = $node->getAttribute('data-fred-class');
                $classes = Utils::explodeAndClean($classes, ' ');

                foreach ($classes as $class) {
                    $node->addClass($class);
                }

                $node->removeAttr('data-fred-class');
            }
        );

        $bindElements = $html->filter('[data-fred-bind]');
        $bindElements->each(
            function (HtmlPageCrawler $node, $i) use ($item) {
                $node->removeAttr('data-fred-bind');
            }
        );

        $onDrop = $html->filter('[data-fred-on-drop]');
        $onDrop->each(
            function (HtmlPageCrawler $node, $i) use ($item) {
                $node->removeAttr('data-fred-on-drop');
            }
        );

        $onSettingChange = $html->filter('[data-fred-on-setting-change]');
        $onSettingChange->each(
            function (HtmlPageCrawler $node, $i) use ($item) {
                $node->removeAttr('data-fred-on-setting-change');
            }
        );

        $dzs = $html->filter('[data-fred-dropzone]');
        $self = $this;

        $dzs->each(
            function (HtmlPageCrawler $node, $i) use ($item, $self) {
                $dzName = $node->getAttribute('data-fred-dropzone');
                if ($item['children'][$dzName]) {
                    $html = '';

                    foreach ($item['children'][$dzName] as $childItem) {
                        try {
                            $html .= $self->renderElement(
                                $self->twig->render(
                                    $childItem['widget'],
                                    $this->mergeSetting(
                                        !empty($childItem['elId']) ? $childItem['elId'] : '',
                                        $childItem['settings']
                                    )
                                ),
                                $childItem
                            );
                        } catch (\Exception $e) {
                        }
                    }

                    $node->setInnerHtml($html);
                }

                $node->removeAttr('data-fred-dropzone');
            }
        );

        $html = $html->saveHTML();

        if ($replaceFakes) {
            $html = str_replace(' data-fred-fake-href=', ' href=', $html);
            $html = str_replace(' data-fred-fake-src=', ' src=', $html);
            $html = str_replace('data-fred-fake-action=', ' action=', $html);
        }

        if ($parseModx) {
            $this->modx->request = new modRequest($this->modx);
            $this->modx->request->sanitizeRequest();

            $this->modx->getParser();
            $maxIterations = empty($maxIterations) || (int) $maxIterations < 1 ? 10 : (int) $maxIterations;

            $this->modx->resource = $this->resource;
            $this->modx->resourceIdentifier = $this->resource->id;
            $this->modx->elementCache = [];

            $this->modx->parser->processElementTags('', $html, false, false, '[[', ']]', [], $maxIterations);
            $this->modx->parser->processElementTags('', $html, true, false, '[[', ']]', [], $maxIterations);
            $this->modx->parser->processElementTags('', $html, true, true, '[[', ']]', [], $maxIterations);
        }

        return $html;
    }

    private function setValueForBindElements(HtmlPageCrawler &$html, $name, $value)
    {
        $bindElements = $html->filter('[data-fred-bind="' . $name . '"]');
        $bindElements->each(
            function (HtmlPageCrawler $node, $i) use ($value) {
                switch ($node->nodeName()) {
                    case 'i':
                        $node->setAttribute('class', $value);
                        break;
                    case 'img':
                        $node->setAttribute('data-fred-fake-src', $value);
                        break;
                    default:
                        $node->setInnerHtml($value);
                }
            }
        );
    }

    private function mergeSetting($id, $settings = [])
    {
        $settings['theme_dir'] = "[[++{$this->theme->settingsPrefix}.theme_dir]]";
        $settings['template'] = [
            'theme_dir' => "[[++{$this->theme->settingsPrefix}.theme_dir]]",
        ];

        $settings['id'] = $id;
        foreach($this->pageSettings as $key => $value) {
            $settings[$key] = $value;
        }
        return $settings;
    }

    public function reversePreparedOutput($tv, $value, $resource)
    {
        if (!empty($value)) {
            $context = !empty($resource) ? $resource->get('context_key') : $this->modx->context->get('key');
            $sourceCache = $tv->getSourceCache($context);
            $classKey = $sourceCache['class_key'];
            if (!empty($sourceCache) && !empty($classKey)) {
                if ($this->modx->loadClass($classKey)) {
                    /** @var modMediaSource $source */
                    $source = $this->modx->newObject($classKey);
                    if ($source) {
                        $source->fromArray($sourceCache, '', true, true);
                        $source->initialize();
                        $properties = $source->getPropertyList();
                        if (!empty($properties['baseUrl'])) {
                            return ltrim($value, rtrim($properties['baseUrl'], DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR);
                        }
                        //S3 Objects
                        if (!empty($properties['url'])) {
                            return ltrim($value, rtrim($properties['url'], DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR);
                        }
                    }
                }
            }
        }

        return $value;
    }
}
