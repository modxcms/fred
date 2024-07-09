<?php

namespace Fred\v2\Processors\Blueprints;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends \modObjectGetListProcessor
{
    use \Fred\Traits\Processors\Blueprints\GetList;

    public $classKey = 'FredBlueprint';
    public $languageTopics = ['fred:default'];
    public $defaultSortField = '`rank`';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.blueprints';

    public function prepareQueryBeforeCount(\xPDOQuery $c)
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

    public function prepareQueryAfterCount(\xPDOQuery $c)
    {
        $c->leftJoin('FredBlueprintCategory', 'Category');
        $c->leftJoin('modUserProfile', 'UserProfile', 'UserProfile.internalKey = FredBlueprint.createdBy');
        $c->leftJoin('FredTheme', 'Theme', 'Category.theme = Theme.id');

        $c->select($this->modx->getSelectColumns('FredBlueprint', 'FredBlueprint', '', ['data'], true));
        $c->select($this->modx->getSelectColumns('FredBlueprintCategory', 'Category', 'category_', ['name', 'public']));
        $c->select($this->modx->getSelectColumns('modUserProfile', 'UserProfile', 'user_profile_', ['fullname']));
        $c->select($this->modx->getSelectColumns('FredTheme', 'Theme', 'theme_', ['id', 'name', 'theme_folder', 'settingsPrefix']));

        return parent::prepareQueryAfterCount($c);
    }

    public function prepareRow(\xPDOObject $object)
    {
        return $object->toArray('', false, true);
    }
}
