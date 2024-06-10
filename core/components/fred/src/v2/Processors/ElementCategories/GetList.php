<?php

namespace Fred\v2\Processors\ElementCategories;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends \modObjectGetListProcessor
{
    public $classKey = 'FredElementCategory';
    public $languageTopics = ['fred:default'];
    public $defaultSortField = 'rank';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.element_categories';

    public function beforeIteration(array $list)
    {
        $addAll = (int)$this->getProperty('addAll', 0);
        $search = $this->getProperty('search', '');

        if (empty($search) && ($addAll === 1)) {
            $list[] = [
                'id' => 0,
                'name' => $this->modx->lexicon('fred.element_cateogries.all')
            ];
        }

        return parent::beforeIteration($list);
    }


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

        $theme = $this->getProperty('theme', null);
        if (!empty($theme)) {
            $c->where(['theme' => $theme]);
        }

        return parent::prepareQueryBeforeCount($c);
    }


    public function prepareQueryAfterCount(\xPDOQuery $c)
    {
        $c->leftJoin('FredTheme', 'Theme');

        $c->select($this->modx->getSelectColumns('FredElementCategory', 'FredElementCategory'));
        $c->select($this->modx->getSelectColumns('FredTheme', 'Theme', 'theme_', ['id', 'name']));
        $c->select([
            '(SELECT count(id) FROM ' . $this->modx->getTableName('FredElement') . ' WHERE category = FredElementCategory.id) AS elements',
            '(SELECT IFNULL(GROUP_CONCAT(template SEPARATOR \',\'), \'\') FROM ' . $this->modx->getTableName('FredElementCategoryTemplateAccess') . ' WHERE category = FredElementCategory.id) AS templates'
        ]);

        return parent::prepareQueryAfterCount($c);
    }
}
