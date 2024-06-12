<?php

namespace Fred\Traits\Processors\ElementCategories;

use Fred\Model\FredElementCategory;
use Fred\Model\FredElementCategoryTemplateAccess;

/**
 * @package fred
 * @subpackage processors
 */

trait Duplicate
{
    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_category_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

    public function process()
    {
        $this->newObject->fromArray($this->object->toArray());
        $name = $this->getProperty('name');
        $theme = $this->getProperty('theme');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.element_categories_ns_name'));
            return $this->failure();
        }

        if (empty($theme)) {
            $this->addFieldError('theme', $this->modx->lexicon('fred.err.element_categories_ns_theme'));
            return $this->failure();
        }

        $this->newObject->set('name', $name);
        $this->newObject->set('theme', $theme);
        $this->newObject->set('uuid', '');

        $c = $this->modx->newQuery($this->classKey);
        $c->where(['theme' => $theme]);
        $c->limit(1);
        $c->sortby('rank', 'DESC');

        $last = 0;

        $categories = $this->modx->getIterator($this->classKey, $c);
        foreach ($categories as $category) {
            $last = $category->rank + 1;
            break;
        }
        $this->newObject->set('rank', $last);

        if ($this->saveObject() === false) {
            $this->modx->error->checkValidation($this->newObject);
            return $this->failure($this->modx->lexicon($this->objectType . '_err_duplicate'));
        }

        $templates = $this->getProperty('templates');
        $templates = array_map('intval', $templates);
        $templates = array_filter($templates);

        foreach ($templates as $template) {
            $categoryTemplate = $this->modx->newObject($this->templateAccessClass);
            $categoryTemplate->set('category', $this->newObject->id);
            $categoryTemplate->set('template', $template);
            $categoryTemplate->save();
        }

        return $this->success('');
    }
}
