<?php

namespace Fred\v2\Processors\BlueprintCategories;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends \modObjectGetListProcessor
{
    use \Fred\Traits\Processors\BlueprintCategories\GetList;

    public $classKey = 'FredBlueprintCategory';
    public $languageTopics = ['fred:default'];
    public $defaultSortField = '`rank`';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.blueprint_categories';

    public function prepareQueryBeforeCount(\xPDOQuery $c)
    {
        $id = (int)$this->getProperty('id', 0);
        if (!empty($id)) {
            $c->where(['id' => $id]);
        }

        $search = $this->getProperty('search', '');
        if (!empty($search)) {
            $c->where(['name:LIKE' => "%{$search}%"]);
        }

        $public = $this->getProperty('public', '');

        if ($public !== '') {
            $c->where(['public' => $public]);
        }

        $theme = $this->getProperty('theme', null);
        if (!empty($theme)) {
            $c->where(['theme' => $theme]);
        }

        return parent::prepareQueryBeforeCount($c);
    }


    public function prepareQueryAfterCount(\xPDOQuery $c)
    {
        $c->leftJoin('modUserProfile', 'UserProfile', 'UserProfile.internalKey = FredBlueprintCategory.createdBy');
        $c->leftJoin('FredTheme', 'Theme');

        $c->select($this->modx->getSelectColumns('FredBlueprintCategory', 'FredBlueprintCategory'));
        $c->select($this->modx->getSelectColumns('FredTheme', 'Theme', 'theme_', ['id', 'name']));
        $c->select($this->modx->getSelectColumns('modUserProfile', 'UserProfile', 'user_profile_'));
        $c->select([
            '(SELECT count(id) FROM ' . $this->modx->getTableName('FredBlueprint') . ' WHERE category = FredBlueprintCategory.id) AS blueprints',
            '(SELECT IFNULL(GROUP_CONCAT(template SEPARATOR \',\'), \'\') FROM ' . $this->modx->getTableName('FredBlueprintCategoryTemplateAccess') . ' WHERE category = FredBlueprintCategory.id) AS templates'
        ]);

        return parent::prepareQueryAfterCount($c);
    }
}
