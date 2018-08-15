<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\Endpoint\Ajax;


class GetTemplates extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    protected $templates = [];
    protected $map = [];
    protected $resources = [];

    /**
     * @return string
     */
    function process()
    {
        $this->identifyTemplates();

        if (empty($this->templates)) {
            return $this->data(['templates' => []]);
        }

        $c = $this->modx->newQuery('modTemplate');
        $c->where([
            'id:IN' => $this->templates
        ]);
        $c->sortby('templatename');
        
        /** @var \modTemplate[] $templates */
        $templates = $this->modx->getIterator('modTemplate', $c);
        $data = [];
        
        foreach ($templates as $template) {
            $data[] = [
                'id' => $template->id,
                'value' => (string)$template->id,
                'name' => $template->templatename,
            ];    
        }

        return $this->data(['templates' => $data]);
    }

    protected function identifyTemplates()
    {
        $c = $this->modx->newQuery('FredThemedTemplate');
        $c->select($this->modx->getSelectColumns('FredThemedTemplate', 'FredThemedTemplate', '', ['template']));

        $c->prepare();
        $c->stmt->execute();

        $templateIds = $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
        $templateIds = array_map('intval', $templateIds);
        $this->templates = array_filter($templateIds);
    }
}
