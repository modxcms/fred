<?php
namespace Fred\Processors\MediaSources;
use MODX\Revolution\Processors\Model\GetListProcessor;
use MODX\Revolution\Sources\modFileMediaSource;
use MODX\Revolution\Sources\modMediaSource;
use xPDO\Om\xPDOObject;
use xPDO\Om\xPDOQuery;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends GetListProcessor
{
    public $classKey = modMediaSource::class;
    public $languageTopics = ['fred:default'];
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.theme';

    protected $packagesDir;

    public function getSortClassKey() {
        return modMediaSource::class;
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
        $id = $this->getProperty('id');
        if (!empty($id)) {
            if (is_array($id)) {
                $id = array_map('intval', $id);
                $c->where([
                    'id:IN' => $id
                ]);
            } else {
                $c->where([
                    'id' => (int)$id
                ]);
            }
        }

        $query = $this->getProperty('search');

        $c->where([
            'class_key' => modFileMediaSource::class
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
