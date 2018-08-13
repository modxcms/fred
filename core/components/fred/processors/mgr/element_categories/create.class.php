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
    /** @var FredBlueprintCategory $object */
    public $object;

    public function beforeSet()
    {
        $name = $this->getProperty('name');
        $theme = $this->getProperty('theme');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.element_categories_ns_name'));
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

}

return 'FredElementCategoriesCreateProcessor';