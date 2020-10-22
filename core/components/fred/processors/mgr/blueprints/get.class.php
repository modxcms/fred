<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredBlueprintsGetProcessor extends modObjectGetProcessor
{
    public $classKey = 'FredBlueprint';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.blueprints';
    /** @var FredBlueprint $object */
    public $object;

    public function beforeOutput()
    {
        $templatesAccess = $this->modx->getIterator('FredBlueprintTemplateAccess', ['blueprint' => $this->object->id]);
        $templates = [];
        foreach ($templatesAccess as $templateAccess) {
            $templates[] = $templateAccess->get('template');
        }

        $templates = join(',', $templates);
        $this->object->set('templates', $templates);

        $category = $this->object->Category;

        if ($category) {
            $theme = $category->Theme;

            if ($theme) {
                $this->object->set('theme', $theme->id);
                $this->object->set('theme_folder', $theme->theme_folder);
            }
        }

        return true;
    }

}

return 'FredBlueprintsGetProcessor';
