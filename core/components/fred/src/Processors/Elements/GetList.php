<?php

namespace Fred\Processors\Elements;

use Fred\Model\FredElement;
use Fred\Model\FredElementCategory;
use Fred\Model\FredElementOptionSet;
use Fred\Model\FredElementTemplateAccess;
use Fred\Model\FredTheme;
use MODX\Revolution\Processors\Model\GetListProcessor;
use xPDO\Om\xPDOObject;
use xPDO\Om\xPDOQuery;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends GetListProcessor
{
    public $classKey = FredElement::class;
    public $languageTopics = ['fred:default'];
    public $defaultSortField = '`rank`';
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

        $theme = $this->getProperty('theme', null);
        if (!empty($theme)) {
            $c->where(['Theme.id' => $theme]);
        }

        return parent::prepareQueryBeforeCount($c);
    }

    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->leftJoin(FredElementCategory::class, 'Category');
        $c->leftJoin(FredElementOptionSet::class, 'OptionSet');
        $c->leftJoin(FredTheme::class, 'Theme', 'Category.theme = Theme.id');

        $c->select($this->modx->getSelectColumns(FredElement::class, 'FredElement'));
        $c->select($this->modx->getSelectColumns(FredElementCategory::class, 'Category', 'category_'));
        $c->select($this->modx->getSelectColumns(FredElementOptionSet::class, 'OptionSet', 'option_set_', ['name']));
        $c->select($this->modx->getSelectColumns(FredTheme::class, 'Theme', 'theme_', ['id', 'name', 'theme_folder']));
        $c->select(
            [
                '(SELECT IFNULL(GROUP_CONCAT(template SEPARATOR \',\'), \'\') FROM ' . $this->modx->getTableName(FredElementTemplateAccess::class) . ' WHERE element = FredElement.id) AS templates'
            ]
        );

        return parent::prepareQueryAfterCount($c);
    }

    public function prepareRow(xPDOObject $object)
    {
        $data = $object->toArray();

        $data['has_override'] = !empty($object->get('options_override'));

        return $data;
    }
}
