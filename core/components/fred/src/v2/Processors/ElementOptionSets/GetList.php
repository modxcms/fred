<?php

namespace Fred\v2\Processors\ElementOptionSets;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends \modObjectGetListProcessor
{
    public $classKey = 'FredElementOptionSet';
    public $languageTopics = ['fred:default'];
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.element_option_sets';

    public function beforeIteration(array $list)
    {
        $addAll = (int)$this->getProperty('addEmpty', 0);
        $search = $this->getProperty('search', '');

        if (empty($search) && ($addAll === 1)) {
            $list[] = [
                'id' => 0,
                'name' => $this->modx->lexicon('fred.element_option_sets.no_set')
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

        $complete = $this->getProperty('complete', '');
        if ($complete !== '') {
            $c->where(['complete' => $complete]);
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

        $c->select($this->modx->getSelectColumns('FredElementOptionSet', 'FredElementOptionSet'));
        $c->select($this->modx->getSelectColumns('FredTheme', 'Theme', 'theme_', ['id', 'name']));

        return parent::prepareQueryAfterCount($c);
    }
}
