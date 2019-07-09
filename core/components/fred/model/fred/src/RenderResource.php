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

use Wa72\HtmlPageDom\HtmlPageCrawler;

final class RenderResource {
    /** @var \modResource */
    private $resource;

    /** @var \FredTheme */
    private $theme;

    /** @var \Twig_Environment */
    private $twig;

    /** @var \modX */
    private $modx;

    /** @var \Fred */
    private $fred;

    /** @var array */
    private $data = [];

    /** @var array */
    private $elementOptions = [];

    /** @var array */
    private $elementCache = [];

    public function __construct(\modResource $resource, \modX $modx)
    {
        $this->resource = $resource;
        $this->modx = $modx;

        $corePath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
        $this->fred = $modx->getService(
            'fred',
            'Fred',
            $corePath . 'model/fred/',
            array(
                'core_path' => $corePath
            )
        );

        $this->theme = $this->fred->getTheme($this->resource->template);

        $this->data = $this->resource->getProperty('data', 'fred');
        if(empty($this->data) && !empty($this->resource->content)){
            $this->setDefaults();
        }
        $elements = [];
        $this->gatherElements($elements, $this->data);

        $this->twig = new \Twig_Environment(new \Twig_Loader_Array($elements));
        $this->twig->setCache(false);
    }

    public function render() {
        $contentData = !empty($this->data['content']) ? $this->data['content'] : [];
        $html = '';

        foreach ($contentData as $item) {
            if (isset($this->elementCache[$item['widget']])) {
                $html .= $this->elementCache[$item['widget']];
            } else {
                try {
                    $html .= $this->renderElement($this->twig->render($item['widget'], $this->mergeSetting(!empty($item['elId']) ? $item['elId'] : '', $item['settings'])), $item, true);
                } catch (\Exception $e) {
                }
            }
        }

        $parser = $this->modx->getParser();
        $html = Utils::htmlDecodeTags($html, $parser);

        $twig = new \Twig_Environment(new \Twig_Loader_Array(['content' => $html]));
        $twig->setCache(false);

        try {
            $this->resource->set('content', $twig->render('content', $this->mergeSetting('')));
        } catch (\Exception $e) {
            $this->resource->set('content', '');
        }

        $c = $this->modx->newQuery('modTemplateVar');
        $c->leftJoin('modTemplateVarTemplate', 'TemplateVarTemplates');

        $c->where([
            'type' => 'freddropzone',
            'TemplateVarTemplates.templateid' => $this->resource->get('template')
        ]);

        /** @var \modTemplateVar[] $tvs */
        $tvs = $this->modx->getIterator('modTemplateVar', $c);
        foreach ($tvs as $tv) {
            $tvName = $tv->get('name');

            if (isset($this->data[$tvName])) {
                $tvContent = '';

                foreach ($this->data[$tvName] as $item) {
                    try {
                        $tvContent .= $this->renderElement($this->twig->render($item['widget'], $this->mergeSetting(!empty($item['elId']) ? $item['elId'] : '', $item['settings'])), $item, true);
                    } catch (\Exception $e) {}
                }

                $tvContent = Utils::htmlDecodeTags($tvContent, $parser);

                $this->resource->setTVValue($tvName, $tvContent);
            }
        }

        $this->data['fingerprint'] = Utils::resourceFingerprint($this->resource);
        $this->resource->setProperty('data', $this->data, 'fred');

        if ($this->resource->save()){
            $this->modx->getCacheManager()->refresh();
            return true;
        }

        return false;
    }

    private function gatherElements(&$elements, $dropZones) {
        foreach ($dropZones as $dropZone) {
            if(!is_array($dropZone)) continue;
            foreach ($dropZone as $element) {
                $elementId = $element['widget'];

                if (!isset($elements[$elementId])) {
                    $elements[$elementId] = $this->getElement($elementId);
                }

                $this->gatherElements($elements, $element['children']);
            }
        }
    }

    private function getElement($id)
    {
        /** @var \FredElement $element */
        $element = $this->modx->getObject('FredElement', ['uuid' => $id]);
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

    private function setValueForBindElements(HtmlPageCrawler &$html, $name, $value)
    {
        $bindElements = $html->filter('[data-fred-bind="' . $name . '"]');
        $bindElements->each(function(HtmlPageCrawler $node, $i) use ($value) {
            switch ($node->nodeName()) {
                case 'i':
                    $node->attr('class', $value);
                    break;
                case 'img':
                    $node->attr('data-fred-fake-src', $value);
                    break;
                default:
                    $node->html($value);
            }
        });
    }

    private function setDefaults(){
        if (!$this->theme) return;

        $defElement = explode('|', $this->theme->get('default_element'));
        if(!empty($defElement[0]) && is_numeric($defElement[0]) && !empty($defElement[1])){
            /** @var \FredElement $defaultElement */
            $defaultElement = $this->modx->getObject('FredElement', ['id' => $defElement[0]]);
            if (!$defaultElement) {
                $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Element {$defElement[0]} wasn't found.");
                return '';
            }

            $this->data = array(
                'content' => array(
                    array(
                        'widget' => $defaultElement->get('uuid'),
                        'values' => array(
                            $defElement[1] => array(
                                '_raw' => array(
                                    '_value' => $this->resource->content
                                )
                            )
                        ),
                        'settings' => array(),
                        'children' => array()
                    )
                )
            );
            $this->resource->setProperty('data', $this->data,'fred');
            $this->resource->save();
        }
    }

    private function renderElement($html, $item, $replaceFakes = false)
    {
        $html = HtmlPageCrawler::create('<div>' . $html . '</div>');

        $renderElements = $html->filter('[data-fred-render]');
        $renderElements->each(function(HtmlPageCrawler $node, $i) use ($item, $html) {
            $render = $node->attr('data-fred-render');
            if ($render === 'false') {
                $node->remove();
            } else {
                $node->removeAttribute('data-fred-render');
            }
        });

        $dzMinHeightElements = $html->filter('[data-fred-min-height]');
        $dzMinHeightElements->each(function(HtmlPageCrawler $node, $i) use ($item, $html) {
            $node->removeAttribute('data-fred-min-height');
        });

        $dzMinWidthElements = $html->filter('[data-fred-min-width]');
        $dzMinWidthElements->each(function(HtmlPageCrawler $node, $i) use ($item, $html) {
            $node->removeAttribute('data-fred-min-width');
        });

        $images = $html->filter('img');
        $images->each(function(HtmlPageCrawler $node, $i) {
            $node->setAttribute('data-fred-fake-src', $node->getAttribute('src'));
            $node->removeAttribute('src');
        });

        $fredLinks = $html->filter('[data-fred-link-type]');
        $fredLinks->each(function(HtmlPageCrawler $node, $i) use ($item) {
            $linkType = $node->attr('data-fred-link-type');
            $node->removeAttr('data-fred-link-type');

            if ($linkType === 'page') {
                $resourceId = intval($node->attr('data-fred-link-page'));
                $anchor = $node->attr('data-fred-link-anchor') ? ('#' . $node->attr('data-fred-link-anchor')) : '';

                if ($resourceId > 0) {
                    $node->attr('data-fred-fake-href', "[[~{$resourceId}]]{$anchor}");
                } else {
                    $node->attr('data-fred-fake-href', $anchor);
                }

                $node->removeAttr('href');

                $node->removeAttr('data-fred-link-page');
                $node->removeAttr('data-fred-link-anchor');
            }
        });

        $links = $html->filter('a');
        $links->each(function(HtmlPageCrawler $node, $i) {
            $node->setAttribute('data-fred-fake-href', $node->getAttribute('href'));
            $node->removeAttribute('href');
        });

        $html = HtmlPageCrawler::create($html->first()->html());

        $elements = $html->filter('[data-fred-name]');
        $elements->each(function(HtmlPageCrawler $node, $i) use ($item, $html) {
            $valueName = $node->attr('data-fred-name');

            $value = null;

            $target = $node->attr('data-fred-target');
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
                        $node->attr('class', $value);
                        break;
                    case 'img':
                        $node->attr('data-fred-fake-src', $value);
                        break;
                    default:
                        $node->html($value);
                }
            }

            $this->setValueForBindElements($html, $valueName, $value);

            $attrs = $node->attr('data-fred-attrs');
            $attrs = explode(',', $attrs);
            foreach ($attrs as $attr) {
                if (isset($item['values'][$valueName]['_raw'][$attr])) {
                    $node->attr($attr, $item['values'][$valueName]['_raw'][$attr]);
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
        });

        $blockClasses = $html->filter('[data-fred-block-class]');
        $blockClasses->each(function(HtmlPageCrawler $node, $i) use ($item) {
            $classes = $node->attr('data-fred-block-class');
            $classes = Utils::explodeAndClean($classes, ' ');

            foreach ($classes as $class) {
                $node->addClass($class);
            }

            $node->removeAttr('data-fred-block-class');
        });

        $fredClasses = $html->filter('[data-fred-class]');
        $fredClasses->each(function(HtmlPageCrawler $node, $i) use ($item) {
            $classes = $node->attr('data-fred-class');
            $classes = Utils::explodeAndClean($classes, ' ');

            foreach ($classes as $class) {
                $node->addClass($class);
            }

            $node->removeAttr('data-fred-class');
        });

        $bindElements = $html->filter('[data-fred-bind]');
        $bindElements->each(function(HtmlPageCrawler $node, $i) use ($item) {
            $node->removeAttr('data-fred-bind');
        });

        $onDrop = $html->filter('[data-fred-on-drop]');
        $onDrop->each(function(HtmlPageCrawler $node, $i) use ($item) {
            $node->removeAttr('data-fred-on-drop');
        });

        $onSettingChange = $html->filter('[data-fred-on-setting-change]');
        $onSettingChange->each(function(HtmlPageCrawler $node, $i) use ($item) {
            $node->removeAttr('data-fred-on-setting-change');
        });

        $dzs = $html->filter('[data-fred-dropzone]');
        $self = $this;

        $dzs->each(function(HtmlPageCrawler $node, $i) use ($item, $self) {
            $dzName = $node->attr('data-fred-dropzone');
            if ($item['children'][$dzName]) {
                $html = '';

                foreach ($item['children'][$dzName] as $childItem) {
                    try {
                        $html .= $self->renderElement($self->twig->render($childItem['widget'], $this->mergeSetting(!empty($childItem['elId']) ? $childItem['elId'] : '', $childItem['settings'])), $childItem);;
                    } catch (\Exception $e) {}
                }

                $node->html($html);
            }

            $node->removeAttr('data-fred-dropzone');
        });

        $html = $html->saveHTML();

        if ($replaceFakes) {
            $html = str_replace(' data-fred-fake-href=', ' href=', $html);
            $html = str_replace(' data-fred-fake-src=', ' src=', $html);
        }

        return $html;
    }

    private function mergeSetting($id, $settings = [])
    {
        $settings['theme_dir'] = '[[++fred.theme_dir]]';
        $settings['template'] = [
            'theme_dir' => '[[++fred.theme_dir]]'
        ];

        $settings['id'] = $id;

        return $settings;
    }
}
