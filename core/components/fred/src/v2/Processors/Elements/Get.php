<?php

namespace Fred\v2\Processors\Elements;

/**
 * @package fred
 * @subpackage processors
 */
class Get extends \modObjectGetProcessor
{
    public $classKey = 'FredElement';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.elements';

    /** @var \FredElement $object */
    public $object;

    public function beforeOutput()
    {
        $templatesAccess = $this->modx->getIterator('FredElementTemplateAccess', ['element' => $this->object->id]);
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
