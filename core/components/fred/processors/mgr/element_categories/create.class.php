<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementCategoriesCreateProcessor extends modObjectCreateProcessor
{
    public $classKey = 'FredElementCategory';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_categories';
    /** @var FredElementCategory $object */
    public $object;

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_category_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

    public function beforeSet()
    {
        $name = $this->getProperty('name');
        $theme = $this->getProperty('theme');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.element_categories_ns_name'));
        } else {
            if ($this->doesAlreadyExist(['name' => $name, 'theme' => $theme])) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.element_categories_ae_name'));
            }
        }

        if (empty($theme)) {
            $this->addFieldError('theme', $this->modx->lexicon('fred.err.element_categories_ns_theme'));
        }

        $rank = $this->getProperty('rank', '');
        if ($rank === '') {
            $c = $this->modx->newQuery($this->classKey);
            $c->where(['theme' => $theme]);
            $c->limit(1);
            $c->sortby('rank', 'DESC');

            $last = 0;

            /** @var FredElementCategory[] $categories */
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

        foreach ($templates as $template) {
            $categoryTemplate = $this->modx->newObject('FredElementCategoryTemplateAccess');
            $categoryTemplate->set('category', $this->object->id);
            $categoryTemplate->set('template', $template);
            $categoryTemplate->save();
        }

        return parent::afterSave();
    }

}

return 'FredElementCategoriesCreateProcessor';
