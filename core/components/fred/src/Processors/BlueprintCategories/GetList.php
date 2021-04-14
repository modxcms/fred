<?php
namespace Fred\Processors\BlueprintCategories;
use Fred\Model\FredBlueprint;
use Fred\Model\FredBlueprintCategory;
use Fred\Model\FredBlueprintCategoryTemplateAccess;
use Fred\Model\FredTheme;
use MODX\Revolution\modUserProfile;
use MODX\Revolution\Processors\Model\GetListProcessor;
use xPDO\Om\xPDOQuery;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends GetListProcessor
{
    public $classKey = FredBlueprintCategory::class;
    public $languageTopics = ['fred:default'];
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


    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->leftJoin(modUserProfile::class, 'UserProfile', 'UserProfile.internalKey = FredBlueprintCategory.createdBy');
        $c->leftJoin(FredTheme::class, 'Theme');

        $c->select($this->modx->getSelectColumns(FredBlueprintCategory::class, 'FredBlueprintCategory'));
        $c->select($this->modx->getSelectColumns(FredTheme::class, 'Theme', 'theme_', ['id', 'name']));
        $c->select($this->modx->getSelectColumns(modUserProfile::class, 'UserProfile', 'user_profile_'));
        $c->select([
            '(SELECT count(id) FROM ' . $this->modx->getTableName(FredBlueprint::class) . ' WHERE category = FredBlueprintCategory.id) AS blueprints',
            '(SELECT IFNULL(GROUP_CONCAT(template SEPARATOR \',\'), \'\') FROM ' . $this->modx->getTableName(FredBlueprintCategoryTemplateAccess::class) . ' WHERE category = FredBlueprintCategory.id) AS templates'
        ]);

        return parent::prepareQueryAfterCount($c);
    }
}
