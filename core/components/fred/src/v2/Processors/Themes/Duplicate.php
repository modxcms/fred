<?php

namespace Fred\v2\Processors\Themes;

/**
 * @package fred
 * @subpackage processors
 */

class Duplicate extends \modObjectDuplicateProcessor
{
    use \Fred\Traits\Processors\Themes\Duplicate;

    public $classKey = 'FredTheme';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';
    public $permissions = ['fred_themes_save'];

    public $object;

    public $newObject;

    protected function duplicateThemeObjects()
    {
        $duplicateThemeObjects = (int)$this->getProperty('duplicate_theme_objects', 0);
        if ($duplicateThemeObjects !== 1) {
            return;
        }

        $optionSetsMap = [];
        $elementsMap = [];

        $optionSets = $this->object->OptionSets;
        foreach ($optionSets as $optionSet) {
            /** @var \FredElementOptionSet $newOptionSet */
            $newOptionSet = $this->modx->newObject('FredElementOptionSet');
            $newOptionSet->fromArray($optionSet->toArray());
            $newOptionSet->set('theme', $this->newObject->id);
            $newOptionSet->save();

            $optionSetsMap[$optionSet->id] = $newOptionSet->id;
        }

        $rteConfigs = $this->object->RTEConfigs;
        foreach ($rteConfigs as $rteConfig) {
            /** @var \FredElementRTEConfig $newRteConfig */
            $newRteConfig = $this->modx->newObject('FredElementRTEConfig');
            $newRteConfig->fromArray($rteConfig->toArray());
            $newRteConfig->set('theme', $this->newObject->id);
            $newRteConfig->save();
        }

        $elementCategories = $this->object->ElementCategories;
        foreach ($elementCategories as $elementCategory) {
            /** @var \FredElementCategory $newElementCategory */
            $newElementCategory = $this->modx->newObject('FredElementCategory');
            $newElementCategory->fromArray($elementCategory->toArray());
            $newElementCategory->set('uuid', '');
            $newElementCategory->set('theme', $this->newObject->id);
            $newElementCategory->save();

            $elements = $elementCategory->Elements;
            foreach ($elements as $element) {
                /** @var \FredElement $newElement */
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
            /** @var \FredBlueprintCategory $newBlueprintCategory */
            $newBlueprintCategory = $this->modx->newObject('FredBlueprintCategory');
            $newBlueprintCategory->fromArray($blueprintCategory->toArray());
            $newBlueprintCategory->set('uuid', '');
            $newBlueprintCategory->set('theme', $this->newObject->id);
            $newBlueprintCategory->save();

            $blueprints = $blueprintCategory->Blueprints;
            foreach ($blueprints as $blueprint) {
                /** @var \FredBlueprint $newBlueprint */
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

        $this->duplicateSystemSettings();
    }

    protected function duplicateTemplates()
    {
        $duplicateTemplates = (int)$this->getProperty('duplicate_templates', 0);

        if ($duplicateTemplates !== 1) {
            return;
        }

        $assignedTemplates = $this->object->Templates;
        foreach ($assignedTemplates as $assignedTemplate) {
            $template = $assignedTemplate->Template;
            if ($template) {
                $newName = "{$template->get('templatename')} ({$this->newObject->get('name')})";
                $cnt = 0;

                $exists = $this->modx->getCount('modTemplate', ['templatename' => $newName]);
                while ($exists > 0) {
                    $cnt++;
                    $newName = "{$template->get('templatename')} ({$this->newObject->get('name')}) #{$cnt}";
                    $exists = $this->modx->getCount('modTemplate', ['templatename' => $newName]);
                }

                /** @var \modTemplate $newTemplate */
                $newTemplate = $this->modx->newObject('modTemplate');
                $newTemplate->fromArray($template->toArray());
                $newTemplate->set('templatename', $newName);
                $newTemplate->save();

                /** @var \modTemplateVarTemplate[] $tvs */
                $tvs = $template->getMany('TemplateVarTemplates');
                foreach ($tvs as $tv) {
                    $newTv = $this->modx->newObject('modTemplateVarTemplate');
                    $newTv->set('tmplvarid', $tv->get('tmplvarid'));
                    $newTv->set('templateid', $newTemplate->get('id'));
                    $newTv->set('rank', $tv->get('rank'));
                    $newTv->save();
                }

                /** @var \FredThemedTemplate $themedTemplate */
                $themedTemplate = $this->modx->newObject('FredThemedTemplate');
                $themedTemplate->set('template', $newTemplate->id);
                $themedTemplate->set('theme', $this->newObject->id);
                $themedTemplate->save();
            }
        }
    }

    protected function duplicateSystemSettings()
    {
        $namespace = $this->object->get('namespace');
        $newNamespace = $this->newObject->get('namespace');

        if (empty($namespace) || empty($newNamespace)) {
            return;
        }

        /** @var \modSystemSetting[] $settings */
        $settings = $this->modx->getIterator('modSystemSetting', [
            'namespace' => $namespace,
            'key:LIKE' => "{$namespace}.%"
        ]);

        $strlen = strlen($namespace);
        foreach ($settings as $setting) {
            $newKey = $newNamespace . substr($setting->key, $strlen);

            $newSetting = $this->modx->newObject('modSystemSetting');
            $newSetting->set('key', $newKey);
            $newSetting->set('value', $setting->get('value'));
            $newSetting->set('xtype', $setting->get('xtype'));
            $newSetting->set('area', $setting->get('area'));
            $newSetting->set('namespace', $newNamespace);
            $newSetting->save();

            /** @var \modLexiconEntry[] $oldLexicons */
            $oldLexicons = $this->modx->getIterator('modLexiconEntry', [
                'namespace' => $namespace,
                'name' => "setting_{$setting->key}"
            ]);

            foreach ($oldLexicons as $oldLexicon) {
                $newLexicon = $this->modx->newObject('modLexiconEntry');
                $newLexicon->set('name', 'setting_' . $newKey);
                $newLexicon->set('value', $oldLexicon->get('value'));
                $newLexicon->set('topic', $oldLexicon->get('topic'));
                $newLexicon->set('language', $oldLexicon->get('language'));
                $newLexicon->set('language', $oldLexicon->get('language'));
                $newLexicon->set('namespace', $newNamespace);
                $newLexicon->save();
            }
        }
    }
}
