<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredThemedTemplatesGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'FredThemedTemplate';
    public $languageTopics = array('fred:default');
    public $defaultSortField = 'template';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.themed_templates';

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
//        $search = $this->getProperty('search', '');
//        if (!empty($search)) {
//            $c->where(['name:LIKE' => "%{$search}%"]);
//        }
        
        return parent::prepareQueryBeforeCount($c);
    }

    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->leftJoin('FredTheme', 'Theme');
        $c->leftJoin('modTemplate', 'Template');

        $c->select($this->modx->getSelectColumns('FredThemedTemplate', 'FredThemedTemplate'));
        $c->select($this->modx->getSelectColumns('FredTheme', 'Theme', 'theme_', ['name']));
        $c->select($this->modx->getSelectColumns('modTemplate', 'Template', 'template_', ['templatename']));

        return parent::prepareQueryAfterCount($c);
    }
}

return 'FredThemedTemplatesGetListProcessor';