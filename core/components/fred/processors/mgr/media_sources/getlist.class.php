<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredMediaSourcesGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'sources.modMediaSource';
    public $languageTopics = array('fred:default');
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.theme';
    
    protected $packagesDir;

    public function getSortClassKey() {
        return 'modMediaSource';
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

    public function prepareQueryBeforeCount(xPDOQuery $c) {
        $query = $this->getProperty('search');

        $c->where([
            'class_key' => 'sources.modFileMediaSource'
        ]);
        
        if (!empty($query)) {
            $c->where(['modMediaSource.name:LIKE' => '%'.$query.'%']);
            $c->orCondition(['modMediaSource.description:LIKE' => '%'.$query.'%']);
        }
        
        return $c;
    }

    public function prepareRow(xPDOObject $object) {
        $objectArray = $object->toArray();

        $props = $object->getPropertyList();

        $objectArray['fred'] = empty($props['fred']) ? false : $props['fred']; 
        $objectArray['fredReadOnly'] = empty($props['fredReadOnly']) ? false : $props['fredReadOnly']; 
        
        return $objectArray;
    }


}

return 'FredMediaSourcesGetListProcessor';