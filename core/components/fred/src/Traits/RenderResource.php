<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\Traits;

use Fred\Utils;
use Twig\Environment;
use Wa72\HtmlPageDom\HtmlPageCrawler;

trait RenderResource
{
    private function setDefaults()
    {
        if (!$this->theme) {
            return;
        }

        $defElement = explode('|', $this->theme->get('default_element'));
        if (!empty($defElement[0]) && is_numeric($defElement[0]) && !empty($defElement[1])) {
            $defaultElement = $this->modx->getObject($this->elementClass, ['id' => $defElement[0]]);
            if (!$defaultElement) {
                if (!is_numeric($defElement[0])) {
                    $c = $this->modx->newQuery($this->elementClass);
                    $c->where(['uuid' => $defElement[0], 'OR:name' => $defElement[0]]);
                    $defaultElement = $this->modx->getObject($this->elementClass, $c);
                    if(!$defaultElement) {
                        $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Default Element {$defElement[0]} wasn't found.");
                        return;
                    }
                } else {
                    $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Element {$defElement[0]} wasn't found.");
                    return;
                }
            }
            // check if the element is part of the theme
            $elementCategory = $defaultElement->getOne('Category');
            if (!$elementCategory || $elementCategory->get('theme') !== $this->theme->id) {
                $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Default Element {$defElement[0]} is not part of the current theme.");
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
        $element = $this->modx->getObject($this->elementClass, ['uuid' => $id]);
        if (!$element) {
            $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Element {$id} wasn't found.");
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
        $element = $this->modx->getObject($this->elementClass, ['uuid' => $id]);
        if (!$element) {
            $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Element {$id} wasn't found.");
            return;
        }
        $element->setCache($this->resource->id, $content);
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
            $this->modx->request = new $this->modRequestClass($this->modx);
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
        foreach ($this->pageSettings as $key => $value) {
            $settings[$key] = $value;
        }
        return $settings;
    }

    public function reversePreparedOutput($tv, $value, $resource)
    {
        if (!empty($value)) {
            $context = !empty($resource) ? $resource->get('context_key') : $this->modx->context->get('key');
            $sourceCache = $tv->getSourceCache($context);
            $classKey = $sourceCache['source_class_key'];
            if (!empty($sourceCache) && !empty($classKey)) {
                if ($this->modx->loadClass($classKey)) {
                    $source = $this->modx->newObject($classKey);
                    if ($source) {
                        $source->fromArray($sourceCache, '', true, true);
                        $source->initialize();
                        $bases = $source->getBases();
                        if (!empty($bases['urlAbsolute'])) {
                            $url = $bases['urlAbsolute'];
                            if (substr($value, 0, strlen($url)) === $url) {
                                return substr($value, strlen($url));
                            }
                        }
                        $properties = $source->getPropertyList();
                        if (!empty($properties['baseUrl'])) {
                            // remove the base url from the front of the value
                            $url = rtrim($properties['baseUrl'], DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
                            if (substr($value, 0, strlen($url)) === $url) {
                                return substr($value, strlen($url));
                            }
                        }
                        //S3 Objects
                        if (!empty($properties['url'])) {
                            $url = rtrim($properties['url'], DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
                            if (substr($value, 0, strlen($url)) === $url) {
                                return substr($value, strlen($url));
                            }
                        }
                    }
                }
            }
        }

        return $value;
    }
}
