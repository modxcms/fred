<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredBlueprintCategoriesGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'FredBlueprintCategory';
    public $languageTopics = array('fred:default');
    public $defaultSortField = 'rank';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.blueprint_categories';

    public function beforeIteration(array $list)
    {
        $addAll = (int)$this->getProperty('addAll', 0);
        
        if ($addAll === 1) {
            $list[] = [
                'id' => 0,
                'name' => $this->modx->lexicon('fred.blueprint_cateogries.all')
            ];
        }
        
        return parent::beforeIteration($list);
    }


    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $search = $this->getProperty('search', '');
        if (!empty($search)) {
            $c->where(['name:LIKE' => "%{$search}%"]);
        }
        
        $public = $this->getProperty('public', '');
        
        if ($public !== '') {
            $c->where(['public' => $public]);
        }
        
        return parent::prepareQueryBeforeCount($c);
    }


    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->leftJoin('modUserProfile', 'UserProfile', 'UserProfile.internalKey = FredBlueprintCategory.createdBy');
        
        $c->select($this->modx->getSelectColumns('FredBlueprintCategory', 'FredBlueprintCategory'));
        $c->select($this->modx->getSelectColumns('modUserProfile', 'UserProfile', 'user_profile_'));
        $c->select([
            '(SELECT count(id) FROM ' . $this->modx->getTableName('FredBlueprint') . ' WHERE category = FredBlueprintCategory.id) AS blueprints'
        ]);

        return parent::prepareQueryAfterCount($c);
    }
}

return 'FredBlueprintCategoriesGetListProcessor';