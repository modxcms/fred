<?php

namespace Fred\Processors\Generate;

use Fred\Model\FredThemedTemplate;
use MODX\Revolution\modResource;
use MODX\Revolution\Processors\Processor;

class Count extends Processor
{
    public function checkPermissions()
    {
        return $this->modx->hasPermission('empty_cache');
    }

    public function process()
    {
        $c = $this->modx->newQuery(FredThemedTemplate::class);
        $c->select($this->modx->getSelectColumns(FredThemedTemplate::class, 'FredThemedTemplate', '', ['template']));
        $c->prepare();
        $c->stmt->execute();

        $templates = $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
        $templates = array_map('intval', $templates);
        $templates = array_filter($templates);

        if (empty($templates)) {
            return $this->failure($this->modx->lexicon('fred.refresh_fail_template'));
        }

        $count = $this->modx->getCount(modResource::class, ['template:IN' => $templates]);

        return $this->success('', ['total' => (int)$count]);
    }
}
