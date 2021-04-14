<?php
namespace Fred\Processors\Themes;
use Fred\Model\FredBlueprint;
use Fred\Model\FredBlueprintCategory;
use Fred\Model\FredElement;
use Fred\Model\FredElementCategory;
use Fred\Model\FredElementOptionSet;
use Fred\Model\FredElementRTEConfig;
use Fred\Model\FredTheme;

use Fred\Model\FredThemedTemplate;
use MODX\Revolution\modLexiconEntry;
use MODX\Revolution\modSystemSetting;
use MODX\Revolution\modTemplate;
use MODX\Revolution\modTemplateVarTemplate;
use MODX\Revolution\Processors\Model\DuplicateProcessor;
use Symfony\Component\Filesystem\Filesystem;

/**
 * @package fred
 * @subpackage processors
 */

class Duplicate extends DuplicateProcessor
{
    public $classKey = FredTheme::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';

    /** @var FredTheme */
    public $object;

    /** @var FredTheme */
    public $newObject;

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_themes_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

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
        $this->duplicateTemplates();

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
            $newOptionSet = $this->modx->newObject(FredElementOptionSet::class);
            $newOptionSet->fromArray($optionSet->toArray());
            $newOptionSet->set('theme', $this->newObject->id);
            $newOptionSet->save();

            $optionSetsMap[$optionSet->id] = $newOptionSet->id;
        }

        $rteConfigs = $this->object->RTEConfigs;
        foreach ($rteConfigs as $rteConfig) {
            /** @var FredElementRTEConfig $newRteConfig */
            $newRteConfig = $this->modx->newObject(FredElementRTEConfig::class);
            $newRteConfig->fromArray($rteConfig->toArray());
            $newRteConfig->set('theme', $this->newObject->id);
            $newRteConfig->save();
        }

        $elementCategories = $this->object->ElementCategories;
        foreach ($elementCategories as $elementCategory) {
            /** @var FredElementCategory $newElementCategory */
            $newElementCategory = $this->modx->newObject(FredElementCategory::class);
            $newElementCategory->fromArray($elementCategory->toArray());
            $newElementCategory->set('uuid', '');
            $newElementCategory->set('theme', $this->newObject->id);
            $newElementCategory->save();

            $elements = $elementCategory->Elements;
            foreach ($elements as $element) {
                /** @var FredElement $newElement */
                $newElement = $this->modx->newObject(FredElement::class);
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
            $newBlueprintCategory = $this->modx->newObject(FredBlueprintCategory::class);
            $newBlueprintCategory->fromArray($blueprintCategory->toArray());
            $newBlueprintCategory->set('uuid', '');
            $newBlueprintCategory->set('theme', $this->newObject->id);
            $newBlueprintCategory->save();

            $blueprints = $blueprintCategory->Blueprints;
            foreach ($blueprints as $blueprint) {
                /** @var FredBlueprint $newBlueprint */
                $newBlueprint = $this->modx->newObject(FredBlueprint::class);
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
        } catch (\Exception $e) {}
    }

    protected function duplicateTemplates()
    {
        $duplicateTemplates = (int)$this->getProperty('duplicate_templates', 0);

        if ($duplicateTemplates !== 1) return;

        $assignedTemplates = $this->object->Templates;
        foreach ($assignedTemplates as $assignedTemplate) {
            $template = $assignedTemplate->Template;
            if ($template) {
                $newName = "{$template->get('templatename')} ({$this->newObject->get('name')})";
                $cnt = 0;

                $exists = $this->modx->getCount('modTemplate', ['templatename' => $newName]);
                while($exists > 0) {
                    $cnt++;
                    $newName = "{$template->get('templatename')} ({$this->newObject->get('name')}) #{$cnt}";
                    $exists = $this->modx->getCount('modTemplate', ['templatename' => $newName]);
                }

                /** @var modTemplate $newTemplate */
                $newTemplate = $this->modx->newObject(modTemplate::class);
                $newTemplate->fromArray($template->toArray());
                $newTemplate->set('templatename', $newName);
                $newTemplate->save();

                /** @var modTemplateVarTemplate[] $tvs */
                $tvs = $template->getMany('TemplateVarTemplates');
                foreach ($tvs as $tv) {
                    $newTv = $this->modx->newObject(modTemplateVarTemplate::class);
                    $newTv->set('tmplvarid', $tv->get('tmplvarid'));
                    $newTv->set('templateid', $newTemplate->get('id'));
                    $newTv->set('rank', $tv->get('rank'));
                    $newTv->save();
                }

                /** @var FredThemedTemplate $themedTemplate */
                $themedTemplate = $this->modx->newObject(FredThemedTemplate::class);
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

        if (empty($namespace) || empty($newNamespace)) return;

        /** @var modSystemSetting[] $settings */
        $settings = $this->modx->getIterator(modSystemSetting::class, [
            'namespace' => $namespace,
            'key:LIKE' => "{$namespace}.%"
        ]);

        $strlen = strlen($namespace);
        foreach ($settings as $setting) {
            $newKey = $newNamespace . substr($setting->key, $strlen);

            $newSetting = $this->modx->newObject(modSystemSetting::class);
            $newSetting->set('key', $newKey);
            $newSetting->set('value', $setting->get('value'));
            $newSetting->set('xtype', $setting->get('xtype'));
            $newSetting->set('area', $setting->get('area'));
            $newSetting->set('namespace', $newNamespace);
            $newSetting->save();

            /** @var modLexiconEntry[] $oldLexicons */
            $oldLexicons = $this->modx->getIterator(modLexiconEntry::class, [
                'namespace' => $namespace,
                'name' => "setting_{$setting->key}"
            ]);

            foreach ($oldLexicons as $oldLexicon) {
                $newLexicon = $this->modx->newObject(modLexiconEntry::class);
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
