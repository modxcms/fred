<?php
namespace Fred\Processors\ElementRTEConfigs;
use Fred\Model\FredElementRTEConfig;
use Fred\Model\FredTheme;
use MODX\Revolution\Processors\Model\GetListProcessor;
use xPDO\Om\xPDOQuery;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends GetListProcessor
{
    public $classKey = FredElementRTEConfig::class;
    public $languageTopics = ['fred:default'];
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
        $c->leftJoin(FredTheme::class, 'Theme');

        $c->select($this->modx->getSelectColumns(FredElementRTEConfig::class, 'FredElementRTEConfig'));
        $c->select($this->modx->getSelectColumns(FredTheme::class, 'Theme', 'theme_', ['id', 'name']));

        return parent::prepareQueryAfterCount($c);
    }
}
