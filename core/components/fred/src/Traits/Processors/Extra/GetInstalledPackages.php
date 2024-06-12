<?php

namespace Fred\Traits\Processors\Extra;

/**
 * @package fred
 * @subpackage processors
 */
trait GetInstalledPackages
{
    public function initialize()
    {
        $this->setDefaultProperties(array(
            'start' => 0,
            'limit' => 10,
            'workspace' => 1,
            'query' => '',
        ));
        return true;
    }

    public function getData()
    {
        $data = array();
        $limit = intval($this->getProperty('limit'));
        $start = intval($this->getProperty('start'));
        $pkgList = $this->modx->call($this->classKey, 'listPackages', array(
            &$this->modx,
            $this->getProperty('workspace', 1),
            $limit > 0 ? $limit : 0,
            $start,
            $this->getProperty('query', '')
        ));

        $data['results'] = $pkgList['collection'];
        $data['total'] = $pkgList['total'];

        return $data;
    }
}
