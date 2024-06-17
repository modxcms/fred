<?php

namespace Fred\Processors\Blueprints;

use Fred\Model\FredBlueprint;
use Fred\Model\FredBlueprintCategory;
use Fred\Model\FredTheme;
use MODX\Revolution\modUserProfile;
use MODX\Revolution\Processors\Model\GetListProcessor;
use xPDO\Om\xPDOObject;
use xPDO\Om\xPDOQuery;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends GetListProcessor
{
    use \Fred\Traits\Processors\Blueprints\GetList;

    public $classKey = FredBlueprint::class;
    public $languageTopics = ['fred:default'];
    public $defaultSortField = '`rank`';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.blueprints';

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $id = (int)$this->getProperty('id', 0);
        if (!empty($id)) {
            $c->where(['id' => $id]);
        }

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
            $c->where([
                'public' => $public,
                'Category.public' => $public
            ]);
        }

        $search = $this->getProperty('search', '');
        if (!empty($search)) {
            $c->where(['name:LIKE' => "%{$search}%"]);
        }

        $theme = $this->getProperty('theme', null);
        if (!empty($theme)) {
            $c->where(['Theme.id' => $theme]);
        }

        return parent::prepareQueryBeforeCount($c);
    }

    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->leftJoin(FredBlueprintCategory::class, 'Category');
        $c->leftJoin(modUserProfile::class, 'UserProfile', 'UserProfile.internalKey = FredBlueprint.createdBy');
        $c->leftJoin(FredTheme::class, 'Theme', 'Category.theme = Theme.id');

        $c->select($this->modx->getSelectColumns(FredBlueprint::class, 'FredBlueprint', '', ['data'], true));
        $c->select($this->modx->getSelectColumns(FredBlueprintCategory::class, 'Category', 'category_', ['name', 'public']));
        $c->select($this->modx->getSelectColumns(modUserProfile::class, 'UserProfile', 'user_profile_', ['fullname']));
        $c->select($this->modx->getSelectColumns(FredTheme::class, 'Theme', 'theme_', ['id', 'name', 'theme_folder']));

        return parent::prepareQueryAfterCount($c);
    }

    public function prepareRow(xPDOObject $object)
    {
        return $object->toArray('', false, true);
    }
}
