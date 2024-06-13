<?php

namespace Fred\v2\Processors\Elements;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends \modObjectGetListProcessor
{
    public $classKey = 'FredElement';
    public $languageTopics = ['fred:default'];
    public $defaultSortField = 'rank';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.elements';

    public function prepareQueryBeforeCount(\xPDOQuery $c)
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

    public function prepareQueryAfterCount(\xPDOQuery $c)
    {
        $c->leftJoin('FredElementCategory', 'Category');
        $c->leftJoin('FredElementOptionSet', 'OptionSet');
        $c->leftJoin('FredTheme', 'Theme', 'Category.theme = Theme.id');

        $c->select($this->modx->getSelectColumns('FredElement', 'FredElement'));
        $c->select($this->modx->getSelectColumns('FredElementCategory', 'Category', 'category_'));
        $c->select($this->modx->getSelectColumns('FredElementOptionSet', 'OptionSet', 'option_set_', ['name']));
        $c->select($this->modx->getSelectColumns('FredTheme', 'Theme', 'theme_', ['id', 'name', 'theme_folder']));
        $c->select(
            [
                '(SELECT IFNULL(GROUP_CONCAT(template SEPARATOR \',\'), \'\') FROM ' . $this->modx->getTableName('FredElementTemplateAccess') . ' WHERE element = FredElement.id) AS templates'
            ]
        );

        return parent::prepareQueryAfterCount($c);
    }

    public function prepareRow(\xPDOObject $object)
    {
        $data = $object->toArray();

        $data['has_override'] = !empty($object->get('options_override'));

        return $data;
    }
}
