<?php
set_time_limit(0);

if (!function_exists('replaceIdWithUuidOnElements')) {
    /**
     * @param modX $modx
     * @param array $cache
     * @param array $data
     */
    function replaceIdWithUuidOnElements($modx, &$cache, &$data)
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

                replaceIdWithUuidOnElements($modx, $cache, $element['children']);
            }
        }
    }
}

if (!function_exists('iterateElements')) {
    /**
     * @param modX $modx
     * @param array $cache
     * @param array $data
     */
    function iterateElements($modx, &$cache, &$data)
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

            replaceIdWithUuidOnElements($modx, $cache, $element['children']);
        }
    }
}

if ($object->xpdo) {
    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_UPGRADE:
            /** @var modX $modx */
            $modx =& $object->xpdo;

            // http://forums.modx.com/thread/88734/package-version-check#dis-post-489104
            $c = $modx->newQuery('transport.modTransportPackage');
            $c->where(array(
                'workspace' => 1,
                "(SELECT
                        `signature`
                      FROM {$modx->getTableName('modTransportPackage')} AS `latestPackage`
                      WHERE `latestPackage`.`package_name` = `modTransportPackage`.`package_name`
                      ORDER BY
                         `latestPackage`.`version_major` DESC,
                         `latestPackage`.`version_minor` DESC,
                         `latestPackage`.`version_patch` DESC,
                         IF(`release` = '' OR `release` = 'ga' OR `release` = 'pl','z',`release`) DESC,
                         `latestPackage`.`release_index` DESC
                      LIMIT 1,1) = `modTransportPackage`.`signature`",
            ));
            $c->where(array(
                'modTransportPackage.package_name' => 'fred',
                'installed:IS NOT' => null
            ));

            /** @var modTransportPackage $oldPackage */
            $oldPackage = $modx->getObject('transport.modTransportPackage', $c);

            $corePath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
            $fred = $modx->getService(
                'fred',
                'Fred',
                $corePath . 'model/fred/',
                array(
                    'core_path' => $corePath
                )
            );

            if ($oldPackage && $oldPackage->compareVersion('1.0.0-beta4', '>')) {
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
                        replaceIdWithUuidOnElements($modx, $cache, $data);
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
                        replaceIdWithUuidOnElements($modx, $cache, $data);
                    } else {
                        iterateElements($modx, $cache, $data);
                    }

                    $blueprint->set('data', $data);
                    $blueprint->save();
                }

                $modx->updateCollection('FredElementCategory', ['theme' => $defaultTheme]);
                $modx->updateCollection('FredBlueprintCategory', ['theme' => $defaultTheme]);
                $modx->updateCollection('FredElementRTEConfig', ['theme' => $defaultTheme]);
                $modx->updateCollection('FredElementOptionSet', ['theme' => $defaultTheme]);
            }

            break;
    }
}
return true;