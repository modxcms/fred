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
        $this->setDefaultProperties([
            'start' => 0,
            'limit' => 10,
            'workspace' => 1,
            'query' => '',
        ]);
        return true;
    }

    public function getData()
    {
        $data = [];
        $limit = intval($this->getProperty('limit'));
        $start = intval($this->getProperty('start'));
        $pkgList = $this->modx->call($this->classKey, 'listPackages', [
            &$this->modx,
            $this->getProperty('workspace', 1),
            $limit > 0 ? $limit : 0,
            $start,
            $this->getProperty('query', '')
        ]);

        $data['results'] = $pkgList['collection'];
        $data['total'] = $pkgList['total'];

        return $data;
    }
}
