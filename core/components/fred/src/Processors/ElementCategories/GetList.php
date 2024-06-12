<?php

namespace Fred\Processors\ElementCategories;

use Fred\Model\FredElement;
use Fred\Model\FredElementCategory;
use Fred\Model\FredElementCategoryTemplateAccess;
use Fred\Model\FredTheme;
use MODX\Revolution\Processors\Model\GetListProcessor;
use xPDO\Om\xPDOQuery;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends GetListProcessor
{
    use \Fred\Traits\Processors\ElementCategories\GetList;

    public $classKey = FredElementCategory::class;
    public $languageTopics = ['fred:default'];
    public $defaultSortField = 'rank';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.element_categories';


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

        $theme = $this->getProperty('theme', null);
        if (!empty($theme)) {
            $c->where(['theme' => $theme]);
        }

        return parent::prepareQueryBeforeCount($c);
    }


    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->leftJoin(FredTheme::class, 'Theme');

        $c->select($this->modx->getSelectColumns(FredElementCategory::class, 'FredElementCategory'));
        $c->select($this->modx->getSelectColumns(FredTheme::class, 'Theme', 'theme_', ['id', 'name']));
        $c->select([
            '(SELECT count(id) FROM ' . $this->modx->getTableName(FredElement::class) . ' WHERE category = FredElementCategory.id) AS elements',
            '(SELECT IFNULL(GROUP_CONCAT(template SEPARATOR \',\'), \'\') FROM ' . $this->modx->getTableName(FredElementCategoryTemplateAccess::class) . ' WHERE category = FredElementCategory.id) AS templates'
        ]);

        return parent::prepareQueryAfterCount($c);
    }
}
