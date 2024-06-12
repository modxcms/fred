<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\Traits\Endpoint\Ajax;

trait LoadContent
{

    protected function gatherElements(&$elements, $dropZones)
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

    protected function getElement($uuid)
    {
        /** @var $element */
        $element = $this->modx->getObject($this->elementClass, ['uuid' => $uuid]);
        if (!$element) {
            $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Element {$uuid} wasn't found.");
            return [];
        }

        $invalidTheme = false;
        if ($this->theme) {
            $categoryId = $element->get('category');
            $elementTheme = null;

            if (!isset($this->categoryThemeMap[$categoryId])) {
                $category = $element->Category;
                if ($category) {
                    $this->categoryThemeMap[$categoryId] = $category->get('theme');
                    $elementTheme = $this->categoryThemeMap[$categoryId];
                }
            } else {
                $elementTheme = $this->categoryThemeMap[$categoryId];
            }

            if ($elementTheme) {
                if ($elementTheme !== $this->theme->id) {
                    $invalidTheme = true;
                }
            }
        }

        return [
            "title" => $element->name,
            "html" => $element->content,
            "invalidTheme" => $invalidTheme,
            "options" => $element->processOptions()
        ];
    }

    /**
     * @param $resource
     * @return array
     */
    protected function gatherTVs($resource)
    {
        $output = [
            'values' => [],
            'def' => []
        ];

        /** @var $tvs */
        $tvs = $resource->getTemplateVars();
        $mTypes = $this->modx->getOption('manipulatable_url_tv_output_types', null, 'image,file');
        $mTypes = explode(',', $mTypes);

        foreach ($tvs as $tv) {
            $props = $tv->getProperties();

            if (isset($props['fred']) && (intval($props['fred']) === 1)) {
                $def = [
                    'name' => $tv->name,
                    'label' => $tv->caption,
                    'type' => 'text'
                ];

                if (!empty($props['fred.options'])) {
                    $def['options'] = json_decode($props['fred.options']);
                    unset($props['fred.options']);
                }
                foreach ($props as $k => $v) {
                    if (substr($k, 0, 5) === "fred.") {
                        $def[substr($k, 5)] = $v;
                    }
                }

                $output['def'][] = $def;
                $value = $tv->value;
                if (in_array($tv->type, $mTypes, true)) {
                    $value = $tv->prepareOutput($tv->value, $resource->id);
                }
                // replace [[++fred.theme.$theme.theme_dir]] with {{theme_dir}}
                $value = str_replace('[[++' . $this->theme->settingsPrefix . '.theme_dir]]', '{{theme_dir}}', $value);
                $output['values'][$tv->name] = $value;
            }
        }

        return $output;
    }
}
