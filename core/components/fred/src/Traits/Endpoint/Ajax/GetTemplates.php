<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\Traits\Endpoint\Ajax;


trait GetTemplates
{

    /**
     * @return string
     */
    public function process()
    {
        $c = $this->modx->newQuery($this->themedTemplateClass);
        $c->leftJoin($this->templateClass, 'Template');

        $c->select($this->modx->getSelectColumns($this->themedTemplateClass, 'FredThemedTemplate'));
        $c->select($this->modx->getSelectColumns($this->templateClass, 'Template', 'template_'));

        $c->sortby('template_templatename');

        /** @var $themes */
        $themes = $this->modx->getIterator($this->themedTemplateClass, $c);
        $data = [];

        foreach ($themes as $theme) {
            $data[] = [
                'id' => $theme->template_id,
                'value' => (string)$theme->template_id,
                'name' => $theme->template_templatename,
                'customProperties' => [
                    'theme' => intval($theme->theme),
                    'default_blueprint' => intval($theme->default_blueprint),
                ]
            ];
        }

        return $this->data(['templates' => $data]);
    }
}
