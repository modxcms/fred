<?php
/**
 * @package fred
 * @subpackage processors
 */

class FredElementCategoriesDuplicateProcessor extends modObjectDuplicateProcessor
{
    public $classKey = 'FredElementCategory';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_categories';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_category_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
    
    public function process() {
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

        /** @var FredElementCategory[] $categories */
        $categories = $this->modx->getIterator($this->classKey, $c);
        foreach ($categories as $category) {
            $last = $category->rank + 1;
            break;
        }
        $this->newObject->set('rank', $last);

        if ($this->saveObject() === false) {
            $this->modx->error->checkValidation($this->newObject);
            return $this->failure($this->modx->lexicon($this->objectType.'_err_duplicate'));
        }

        return $this->success('');
    }
}

return 'FredElementCategoriesDuplicateProcessor';