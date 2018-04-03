<?php

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
        $templateIds = explode(',', $this->fred->getOption('template_ids'));
        $templateIds = array_map('trim', $templateIds);
        $templateIds = array_map('intval', $templateIds);
        $this->templates = array_filter($templateIds);
    }
}
