<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredBlueprintsGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'FredBlueprint';
    public $languageTopics = array('fred:default');
    public $defaultSortField = 'rank';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.blueprints';

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $category = $this->getProperty('category', null);
        if (!empty($category)) {
            $c->where(['category' => $category]);
        }

        $complete = $this->getProperty('complete', '');
        if ($complete !== '') {
            $c->where(['complete' => $complete]);
        }

        $public = $this->getProperty('public', '');
        if ($public !== '') {
            $c->where(['public' => $public]);
        }

        $search = $this->getProperty('search', '');
        if (!empty($search)) {
            $c->where(['name:LIKE' => "%{$search}%"]);
        }
        
        return parent::prepareQueryBeforeCount($c);
    }


    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->leftJoin('FredBlueprintCategory', 'Category');
        $c->leftJoin('modUserProfile', 'UserProfile', 'UserProfile.internalKey = FredBlueprint.createdBy');
        
        $c->select($this->modx->getSelectColumns('FredBlueprint', 'FredBlueprint'));
        $c->select($this->modx->getSelectColumns('FredBlueprintCategory', 'Category', 'category_'));
        $c->select($this->modx->getSelectColumns('modUserProfile', 'UserProfile', 'user_profile_'));

        return parent::prepareQueryAfterCount($c);
    }


    public function prepareRow(xPDOObject $object)
    {
        $template = $object->toArray();

        return $template;
    }
}

return 'FredBlueprintsGetListProcessor';