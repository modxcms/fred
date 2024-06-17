<?php

namespace Fred\v2\Processors\Themes;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends \modObjectGetListProcessor
{
    use \Fred\Traits\Processors\Themes\GetList;

    public $classKey = 'FredTheme';
    public $languageTopics = ['fred:default'];
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.theme';

    protected $packagesDir;

    public function prepareQueryBeforeCount(\xPDOQuery $c)
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

    public function prepareRow(\xPDOObject $object)
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
