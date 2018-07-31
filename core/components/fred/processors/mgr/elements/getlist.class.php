<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementsGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'FredElement';
    public $languageTopics = array('fred:default');
    public $defaultSortField = 'rank';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.elements';

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $category = $this->getProperty('category', null);
        if (!empty($category)) {
            $c->where(['category' => $category]);
        }

        $search = $this->getProperty('search', '');
        if (!empty($search)) {
            $c->where(['name:LIKE' => "%{$search}%"]);
        }
        
        return parent::prepareQueryBeforeCount($c);
    }

    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->leftJoin('FredElementCategory', 'Category');
        $c->leftJoin('FredElementOptionSet', 'OptionSet');
        
        $c->select($this->modx->getSelectColumns('FredElement', 'FredElement'));
        $c->select($this->modx->getSelectColumns('FredElementCategory', 'Category', 'category_'));
        $c->select($this->modx->getSelectColumns('FredElementOptionSet', 'OptionSet', 'option_set_', ['name']));

        return parent::prepareQueryAfterCount($c);
    }

    public function prepareRow(xPDOObject $object)
    {
        $data = $object->toArray();
        
        $data['has_override'] = !empty($object->get('options_override'));
        
        return $data;
    }
}

return 'FredElementsGetListProcessor';