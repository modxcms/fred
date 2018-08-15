<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

require_once dirname(dirname(__FILE__)) . '/index.class.php';

/**
 * @package fred
 * @subpackage controllers
 */
class FredMigrateManagerController extends FredBaseManagerController
{
    public function process(array $scriptProperties = array())
    {
        $modx = $this->modx;

        $wipe = isset($_GET['wipe']) ? intval($_GET['wipe']) : 0;
        
        if ($wipe === 1) {
            $modx->removeCollection('FredElementCategory', []);
            $modx->removeCollection('FredElementOptionSet', []);
            $modx->removeCollection('FredElementRTEConfig', []);
            $modx->removeCollection('FredElement', []);
        }

        $defaultTheme = $modx->getObject('FredTheme', ['name' => 'Default']);
        if (!$defaultTheme) {
            $c = $modx->newQuery('FredTheme');
            $c->limit(1);
            $themes = $modx->getIterator('FredTheme', $c);
            $defaultTheme = null;

            foreach ($themes as $theme) {
                $defaultTheme = $theme;
                break;
            }

            if (empty($defaultTheme)) {
                $defaultTheme = $modx->newObject('FredTheme');
                $defaultTheme->set('name', 'Default');
                $defaultTheme->set('description', 'Fred\'s Default Theme');
                $defaultTheme->save();
            }
        }

        $defaultTheme = $defaultTheme->id;

        $optionsMap = [];

        $rootCategory = (int)$modx->getOption('fred.elements_category_id');

        $c = $modx->newQuery('modCategory');
        $c->where([
            'parent' => $rootCategory
        ]);

        /** @var \modCategory[] $categories */
        $categories = $modx->getIterator('modCategory', $c);
        foreach ($categories as $category) {
            $newCategory = $modx->newObject('FredElementCategory');
            $newCategory->set('name', $category->category);
            $newCategory->set('rank', $category->rank);
            $newCategory->set('theme', $defaultTheme);
            $newCategory->save();

            /** @var \modChunk[] $chunks */
            $chunks = $modx->getIterator('modChunk', ['category' => $category->id]);
            foreach ($chunks as $chunk) {
                $matches = [];
                preg_match('/image:([^\n]+)\n?/', $chunk->description, $matches);

                $image = '';
                $options = [];
                $description = $chunk->description;

                if (count($matches) == 2) {
                    $image = $matches[1];
                    $description = str_replace($matches[0], '', $description);
                }

                $matches = [];
                preg_match('/options:([^\n]+)\n?/', $description, $matches);


                $optionSet = 0;
                if (count($matches) == 2) {
                    if (!empty($optionsMap[$matches[1]])) {
                        $optionSet = $optionsMap[$matches[1]];
                    } else {
                        /** @var modChunk $options */
                        $options = $modx->getObject('modChunk', ['name' => $matches[1]]);
                        if ($options) {
                            $optionSetObject = $modx->newObject('FredElementOptionSet');
                            $optionSetObject->set('name', $matches[1]);
                            $optionSetObject->set('data', json_decode($options->content, true));
                            $optionSetObject->set('complete', true);
                            $optionSetObject->set('theme', $defaultTheme);
                            $optionSetObject->save();

                            $optionsMap[$matches[1]] = $optionSetObject->id;
                            $optionSet = $optionSetObject->id;
                        }
                    }

                    $description = str_replace($matches[0], '', $description);
                }

                $newElement = $modx->newObject('FredElement');
                $newElement->set('id', $chunk->id);
                $newElement->set('name', $chunk->name);
                $newElement->set('description', $description);
                $newElement->set('image', $image);
                $newElement->set('content', $chunk->content);
                $newElement->set('category', $newCategory->id);
                $newElement->set('option_set', $optionSet);
                $newElement->save();
            }

        }

        $globalRteConfig = $modx->getOption('fred.rte_config');
        if (!empty($globalRteConfig)) {
            $config = $modx->getChunk($globalRteConfig);
            $config = json_decode($config, true);

            if (!empty($config)) {
                $fredRTEConfig = $modx->newObject('FredElementRTEConfig');
                $fredRTEConfig->set('name', 'TinyMCE');
                $fredRTEConfig->set('data', $config);
                $fredRTEConfig->set('theme', $defaultTheme);
                $fredRTEConfig->save();
            }
        }

        $fredTemplates = $modx->getOption('fred.template_ids');
        $fredTemplates = explode(',', $fredTemplates);

        $cache = [];

        if (!empty($fredTemplates)) {
            foreach ($fredTemplates as $fredTemplate) {
                /** @var FredThemedTemplate $themedTemplate */
                $themedTemplate = $modx->newObject('FredThemedTemplate');
                $themedTemplate->set('template', $fredTemplate);
                $themedTemplate->set('theme', $defaultTheme);
                $themedTemplate->save();
            }

            /** @var modResource[] $fredResources */
            $fredResources = $modx->getIterator('modResource', ['template:IN' => $fredTemplates]);

            foreach ($fredResources as $resource) {
                $data = $resource->getProperty('data', 'fred');
                $this->replaceIdWithUuidOnElements($modx, $cache, $data);
                $resource->setProperty('data', $data, 'fred');
                $resource->save();
            }
        }

        /** @var FredBlueprint[] $blueprints */
        $blueprints = $modx->getIterator('FredBlueprint');
        foreach ($blueprints as $blueprint) {
            $data = $blueprint->get('data');
            $complete = $blueprint->get('complete');

            if ($complete === true) {
                $this->replaceIdWithUuidOnElements($modx, $cache, $data);
            } else {
                $this->iterateElements($modx, $cache, $data);
            }

            $blueprint->set('data', $data);
            $blueprint->save();
        }

        $modx->updateCollection('FredElementCategory', ['theme' => $defaultTheme]);
        $modx->updateCollection('FredBlueprintCategory', ['theme' => $defaultTheme]);
        $modx->updateCollection('FredElementRTEConfig', ['theme' => $defaultTheme]);
        $modx->updateCollection('FredElementOptionSet', ['theme' => $defaultTheme]);
        
        return 'Migrated';
    }

    public function getPageTitle()
    {
        return 'Migration';
    }

    /**
     * @param modX $modx
     * @param array $cache
     * @param array $data
     */
    private function iterateElements($modx, &$cache, &$data)
    {
        foreach ($data as &$element) {
            $elementId = $element['widget'];

            if (!isset($elements[$elementId])) {
                /** @var FredElement $fredElement */
                $fredElement = $modx->getObject('FredElement', ['id' => $elementId]);
                if ($fredElement) {
                    $cache[$elementId] = $fredElement->uuid;
                    $element['widget'] = $cache[$elementId];
                }
            } else {
                $element['widget'] = $cache[$elementId];
            }

            $this->replaceIdWithUuidOnElements($modx, $cache, $element['children']);
        }
    }

    /**
     * @param modX $modx
     * @param array $cache
     * @param array $data
     */
    private function replaceIdWithUuidOnElements($modx, &$cache, &$data)
    {
        foreach ($data as &$dropZone) {
            if(!is_array($dropZone)) continue;

            foreach ($dropZone as &$element) {
                $elementId = intval($element['widget']);

                if (!isset($cache[$elementId])) {
                    /** @var FredElement $fredElement */
                    $fredElement = $modx->getObject('FredElement', ['id' => $elementId]);
                    if ($fredElement) {
                        $cache[$elementId] = $fredElement->uuid;
                        $element['widget'] = $cache[$elementId];
                    }
                } else {
                    $element['widget'] = $cache[$elementId];
                }

                $this->replaceIdWithUuidOnElements($modx, $cache, $element['children']);
            }
        }
    }
}