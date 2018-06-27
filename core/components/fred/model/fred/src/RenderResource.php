<?php

namespace Fred;

use Wa72\HtmlPageDom\HtmlPageCrawler;

final class RenderResource {
    /** @var \modResource */
    private $resource;

    /** @var \Twig_Environment */
    private $twig;
    
    /** @var \modX */
    private $modx;
    
    /** @var array */
    private $data = [];

    public function __construct(\modResource $resource, \modX $modx)
    {
        $this->resource = $resource;
        $this->modx = $modx;
        
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
        $contentData = $this->data['content'];
        $html = '';

        foreach ($contentData as $item) {
            try {
                $html .= $this->renderElement($this->twig->render($item['widget'], $item['settings']), $item);
            } catch (\Exception $e) {}
        }

        $this->resource->set('content', $html);
        if ($this->resource->save()){
            $this->modx->getCacheManager()->refresh();
            return true;
        }
        
        return false;
    }

    private function gatherElements(&$elements, $dropZones) {
        foreach ($dropZones as $dropZone) {
            foreach ($dropZone as $element) {
                $elementId = intval($element['widget']);

                if (!isset($elements[$elementId])) {
                    $elements[$elementId] = $this->getElement($elementId);
                }

                $this->gatherElements($elements, $element['children']);
            }
        }
    }

    private function getElement($id)
    {
        /** @var \modChunk $chunk */
        $chunk = $this->modx->getObject('modChunk', $id);
        if (!$chunk) {
            $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Chunk {$id} wasn't found.");
            return '';
        }

        return $chunk->content;
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
                    $node->attr('src', $value);
                    break;
                default:
                    $node->html($value);
            }
        });
    }

    private function setDefaults(){
        $defElement = explode('|',$this->modx->getOption('fred.default_element'));
        if(!empty($defElement[0]) && is_numeric($defElement[0]) && !empty($defElement[1])){
            $this->data = array(
                'content' => array(
                    array(
                        'widget' => intval($defElement[0]),
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

    private function renderElement($html, $item)
    {
        $html = HtmlPageCrawler::create($html);

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
                        $node->attr('src', $value);
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
            $node->removeAttr('contenteditable');
            $node->removeAttr('data-fred-media-source');
            $node->removeAttr('data-fred-image-media-source');
        });

        $links = $html->filter('[data-fred-link-type]');
        $links->each(function(HtmlPageCrawler $node, $i) use ($item) {
            $linkType = $node->attr('data-fred-link-type');
            $node->removeAttr('data-fred-link-type');

            if ($linkType === 'page') {
                $resourceId = intval($node->attr('data-fred-link-page'));
                $anchor = $node->attr('data-fred-link-anchor') ? ('#' . $node->attr('data-fred-link-anchor')) : '';

                if ($resourceId > 0) {
                    $node->attr('data-fred-fake-href', "[[~{$resourceId}]]{$anchor}");
                    $node->removeAttr('href');
                } else {
                    $node->attr('href', $anchor);
                }

                $node->removeAttr('data-fred-link-page');
                $node->removeAttr('data-fred-link-anchor');
            }
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
                        $html .= $self->renderElement($self->twig->render($childItem['widget'], $childItem['settings']), $childItem);;
                    } catch (\Exception $e) {}
                }

                $node->html($html);
            }

            $node->removeAttr('data-fred-dropzone');
        });

        $html = $html->saveHTML();

        $html = str_replace(' data-fred-fake-href=', ' href=', $html);

        return $html;
    }
}