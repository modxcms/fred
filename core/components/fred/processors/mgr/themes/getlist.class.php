<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredThemeGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'FredTheme';
    public $languageTopics = array('fred:default');
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.theme';

    public function beforeIteration(array $list)
    {
        $addAll = (int)$this->getProperty('addAll', 0);

        if ($addAll === 1) {
            $list[] = [
                'id' => 0,
                'name' => $this->modx->lexicon('fred.themes.all')
            ];
        }

        return parent::beforeIteration($list);
    }
    
    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $search = $this->getProperty('search', '');
        if (!empty($search)) {
            $c->where(['name:LIKE' => "%{$search}%"]);
        }
        
        return parent::prepareQueryBeforeCount($c);
    }
}

return 'FredThemeGetListProcessor';