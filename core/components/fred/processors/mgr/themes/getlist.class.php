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
    
    protected $packagesDir;
    
    public function initialize()
    {
        $corePath = $this->modx->getOption('core_path');

        $this->packagesDir = $corePath . 'packages/';
        
        return parent::initialize();
    }


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
        $id = (int)$this->getProperty('id', 0);
        if (!empty($id)) {
            $c->where(['id' => $id]);
        }
        
        $search = $this->getProperty('search', '');
        if (!empty($search)) {
            $c->where(['name:LIKE' => "%{$search}%"]);
        }
        
        return parent::prepareQueryBeforeCount($c);
    }

    public function prepareRow(xPDOObject $object)
    {
        $data = $object->toArray();

        $data['latest_build'] = false;
        
        if (is_array($data['config'])) {
            if (!empty($data['config']['name']) && !empty($data['config']['version']) && !empty($data['config']['release'])) {
                $fileName = "{$data['config']['name']}-{$data['config']['version']}-{$data['config']['release']}.transport.zip";
                
                if (file_exists($this->packagesDir . $fileName)) {
                    $data['latest_build'] = "{$data['config']['name']}-{$data['config']['version']}-{$data['config']['release']}";
                }
            }
        }
        
        return $data;
    }


}

return 'FredThemeGetListProcessor';