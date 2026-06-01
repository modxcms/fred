<?php

namespace Fred\v2\Processors\Generate;

/**
 * @package fred
 * @subpackage processors
 */
class Count extends \modProcessor
{
    public function checkPermissions()
    {
        return $this->modx->hasPermission('empty_cache');
    }

    public function process()
    {
        $theme = (int)$this->getProperty('theme', 0);

        $c = $this->modx->newQuery('FredThemedTemplate');
        $c->select($this->modx->getSelectColumns('FredThemedTemplate', 'FredThemedTemplate', '', ['template']));
        if ($theme > 0) {
            $c->where(['theme' => $theme]);
        }
        $c->prepare();
        $c->stmt->execute();

        $templates = $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
        $templates = array_map('intval', $templates);
        $templates = array_filter($templates);

        if (empty($templates)) {
            return $this->failure($this->modx->lexicon('fred.refresh_fail_template'));
        }

        $count = $this->modx->getCount('modResource', ['template:IN' => $templates]);

        return $this->success('', ['total' => (int)$count]);
    }
}
