<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementRTEConfigsGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'FredElementRTEConfig';
    public $languageTopics = array('fred:default');
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.element_rte_configs';

    public function prepareQueryBeforeCount(xPDOQuery $c)
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

    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->leftJoin('FredTheme', 'Theme');

        $c->select($this->modx->getSelectColumns('FredElementRTEConfig', 'FredElementRTEConfig'));
        $c->select($this->modx->getSelectColumns('FredTheme', 'Theme', 'theme_', ['id', 'name']));

        return parent::prepareQueryAfterCount($c);
    }
}

return 'FredElementRTEConfigsGetListProcessor';