<?php

namespace Fred\Traits\Processors\ElementCategories;

use Fred\Model\FredElementCategory;
use Fred\Model\FredElementCategoryTemplateAccess;
use MODX\Revolution\Processors\Model\UpdateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
trait Update
{
    use \Fred\Traits\Processors\PermissionCheck;

    public function beforeSet()
    {
        $name = $this->getProperty('name');
        $theme = $this->getProperty('theme');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.element_categories_ns_name'));
        } else {
            if ($this->modx->getCount($this->classKey, ['name' => $name, 'theme' => $theme, 'id:!=' => $this->object->id]) > 0) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.element_categories_ae_name'));
            }
        }

        if (empty($theme)) {
            $this->addFieldError('theme', $this->modx->lexicon('fred.err.element_categories_ns_theme'));
        }

        $rank = $this->getProperty('rank', '');
        if ($rank === '') {
            $c = $this->modx->newQuery($this->classKey);
            $c->where([
                'id:!=' => $this->object->id,
                'theme' => $theme
            ]);
            $c->limit(1);
            $c->sortby('`rank`', 'DESC');

            $last = 0;

            $categories = $this->modx->getIterator($this->classKey, $c);
            foreach ($categories as $category) {
                $last = $category->rank + 1;
                break;
            }

            $this->setProperty('rank', $last);
        }

        return parent::beforeSet();
    }

    public function afterSave()
    {
        $templates = $this->getProperty('templates');
        $templates = array_map('intval', $templates);
        $templates = array_filter($templates);

        $this->modx->removeCollection($this->templateAccessClass, ['category' => $this->object->id]);

        foreach ($templates as $template) {
            $categoryTemplate = $this->modx->newObject($this->templateAccessClass);
            $categoryTemplate->set('category', $this->object->id);
            $categoryTemplate->set('template', $template);
            $categoryTemplate->save();
        }

        return parent::afterSave();
    }
}
