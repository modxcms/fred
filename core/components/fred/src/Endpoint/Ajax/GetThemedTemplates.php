<?php

namespace Fred\Endpoint\Ajax;

use Fred\Model\FredThemedTemplate;
use MODX\Revolution\modTemplate;

class GetThemedTemplates extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];

    public function process()
    {
        $query = !empty($_GET['query']) ? $_GET['query'] : '';

        $data = [];

        $c = $this->modx->newQuery(modTemplate::class);
        $c->leftJoin(FredThemedTemplate::class, 'ThemedTemplate', 'ThemedTemplate.template = id');

        $where = [
            'ThemedTemplate.theme' => $this->getClaim('theme')
        ];

        if (!empty($query)) {
            $where['templatename:LIKE'] = '%' . $query . '%';
        }

        $c->where($where);

        $c->sortby('templatename');

        /** @var modTemplate[] $categories */
        $templates = $this->modx->getIterator(modTemplate::class, $c);

        $currentTemplate = (int)$this->getClaim('template');

        foreach ($templates as $template) {
            $templateId = $template->get('id');
            $isCurrent = $templateId === $currentTemplate;

            $data[] = [
                'id' => $templateId,
                'value' => (string)$template->get('id'),
                'label' => ($isCurrent ? '*' : '') . $template->get('templatename'),
            ];
        }

        return $this->data(['templates' => $data]);
    }
}
