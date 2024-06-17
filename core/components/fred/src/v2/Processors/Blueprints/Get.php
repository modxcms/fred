<?php

namespace Fred\v2\Processors\Blueprints;

/**
 * @package fred
 * @subpackage processors
 */
class Get extends \modObjectGetProcessor
{
    public $classKey = 'FredBlueprint';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprints';

    /** @var \FredBlueprint $object */
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
