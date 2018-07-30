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
        $complete = $this->getProperty('complete', '');
        if ($complete !== '') {
            $c->where(['complete' => $complete]);
        }
        
        $search = $this->getProperty('search', '');
        if (!empty($search)) {
            $c->where(['name:LIKE' => "%{$search}%"]);
        }
        
        return parent::prepareQueryBeforeCount($c);
    }
}

return 'FredElementRTEConfigsGetListProcessor';