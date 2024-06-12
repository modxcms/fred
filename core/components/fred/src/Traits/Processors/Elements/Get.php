<?php

namespace Fred\Traits\Processors\Elements;

/**
 * @package fred
 * @subpackage processors
 */
trait Get
{

    public function beforeOutput()
    {
        $templatesAccess = $this->modx->getIterator($this->templateAccessClass, ['element' => $this->object->id]);
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
