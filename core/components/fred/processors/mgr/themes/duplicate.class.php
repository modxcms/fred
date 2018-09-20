<?php

use Symfony\Component\Filesystem\Filesystem;

/**
 * @package fred
 * @subpackage processors
 */

class FredThemeDuplicateProcessor extends modObjectDuplicateProcessor
{
    public $classKey = 'FredTheme';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.theme';
    
    /** @var FredTheme */
    public $object;
    
    /** @var FredTheme */
    public $newObject;
    
    public function process() {
        $this->newObject->fromArray($this->object->toArray());
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.theme_ns_name'));
            return $this->failure();
        }

        $this->newObject->set('name', $name);
        $this->newObject->set('uuid', '');
        $this->newObject->set('config', []);
        $this->newObject->set('theme_folder', $name);

        if ($this->saveObject() === false) {
            $this->modx->error->checkValidation($this->newObject);
            return $this->failure($this->modx->lexicon($this->objectType.'_err_duplicate'));
        }

        $this->duplicateThemeObjects();
        $this->createThemeFolder();
        $this->duplicateThemeFolder();
        
        return $this->success('');
    }
    
    protected function duplicateThemeObjects()
    {
        $duplicateThemeObjects = (int)$this->getProperty('duplicate_theme_objects', 0);
        if ($duplicateThemeObjects !== 1) return;

        $optionSetsMap = [];
        $elementsMap = [];

        $optionSets = $this->object->OptionSets;
        foreach ($optionSets as $optionSet) {
            /** @var FredElementOptionSet $newOptionSet */
            $newOptionSet = $this->modx->newObject('FredElementOptionSet');
            $newOptionSet->fromArray($optionSet->toArray());
            $newOptionSet->set('theme', $this->newObject->id);
            $newOptionSet->save();

            $optionSetsMap[$optionSet->id] = $newOptionSet->id;
        }

        $rteConfigs = $this->object->RTEConfigs;
        foreach ($rteConfigs as $rteConfig) {
            /** @var FredElementRTEConfig $newRteConfig */
            $newRteConfig = $this->modx->newObject('FredElementRTEConfig');
            $newRteConfig->fromArray($rteConfig->toArray());
            $newRteConfig->set('theme', $this->newObject->id);
            $newRteConfig->save();
        }
        
        $elementCategories = $this->object->ElementCategories;
        foreach ($elementCategories as $elementCategory) {
            /** @var FredElementCategory $newElementCategory */
            $newElementCategory = $this->modx->newObject('FredElementCategory');
            $newElementCategory->fromArray($elementCategory->toArray());
            $newElementCategory->set('uuid', '');
            $newElementCategory->set('theme', $this->newObject->id);
            $newElementCategory->save();
            
            $elements = $elementCategory->Elements;
            foreach ($elements as $element) {
                /** @var FredElement $newElement */
                $newElement = $this->modx->newObject('FredElement');
                $newElement->fromArray($element->toArray());
                $newElement->set('uuid', '');
                $newElement->set('category', $newElementCategory->id);

                if (!empty($element->option_set)) {
                    if (isset($optionSetsMap[$element->option_set])) {
                        $newElement->set('option_set', $optionSetsMap[$element->option_set]);        
                    }
                }

                $newElement->save();

                $elementsMap[$element->uuid] = $newElement->uuid;
            }
        }

        $blueprintCategories = $this->object->BlueprintCategories;
        foreach ($blueprintCategories as $blueprintCategory) {
            /** @var FredBlueprintCategory $newBlueprintCategory */
            $newBlueprintCategory = $this->modx->newObject('FredBlueprintCategory');
            $newBlueprintCategory->fromArray($blueprintCategory->toArray());
            $newBlueprintCategory->set('uuid', '');
            $newBlueprintCategory->set('theme', $this->newObject->id);
            $newBlueprintCategory->save();

            $blueprints = $blueprintCategory->Blueprints;
            foreach ($blueprints as $blueprint) {
                /** @var FredBlueprint $newBlueprint */
                $newBlueprint = $this->modx->newObject('FredBlueprint');
                $newBlueprint->fromArray($blueprint->toArray());
                $newBlueprint->set('uuid', '');
                $newBlueprint->set('category', $newBlueprintCategory->id);
                
                $data = $blueprint->get('data');
                $complete = $blueprint->get('complete');

                if ($complete === true) {
                    $this->replaceIdWithUuidOnElements($data, $elementsMap);
                } else {
                    $this->iterateElements($data, $elementsMap);
                }

                $newBlueprint->set('data', $data);
                
                $newBlueprint->save();
            }
        }
    }

    protected function replaceIdWithUuidOnElements(&$data, $map)
    {
        foreach ($data as &$dropZone) {
            if(!is_array($dropZone)) continue;

            foreach ($dropZone as &$element) {
                $elementId = $element['widget'];
                
                if ($map[$elementId]) {
                    $element['widget'] = $map[$elementId];
                } else {
                    $element['widget'] = '';
                }
                
                $this->replaceIdWithUuidOnElements($element['children'], $map);
            }
        }
    }

    protected function iterateElements(&$data, $map)
    {
        foreach ($data as &$element) {
            $elementId = $element['widget'];

            if ($map[$elementId]) {
                $element['widget'] = $map[$elementId];
            } else {
                $element['widget'] = '';
            }

            $this->replaceIdWithUuidOnElements($element['children'], $map);
        }
    }

    protected function createThemeFolder()
    {
        $themeFolder = $this->newObject->get('theme_folder');

        if (!empty($themeFolder)) {
            $path = rtrim($this->modx->getOption('assets_path'), '/') . '/themes/' . $themeFolder . '/';

            $nfp = $this->modx->getOption('new_folder_permissions');
            $amode = !empty($nfp) ? octdec($this->modx->getOption('new_folder_permissions')) : 0777;
            if (!is_dir($path)) {
                mkdir($path, $amode, true);
            }
        }
    }

    protected function duplicateThemeFolder()
    {
        $duplicateThemeFolder = (int)$this->getProperty('duplicate_theme_folder', 0);

        if ($duplicateThemeFolder !== 1) return;
        
        try {
            $fs = new Filesystem();

            $originalThemeFolderPath = $this->object->getThemeFolderPath();
            $themeFolderPath = $this->newObject->getThemeFolderPath();

            $fs->mirror($originalThemeFolderPath, $themeFolderPath);
        } catch (Exception $e) {}
    }
}

return 'FredThemeDuplicateProcessor';