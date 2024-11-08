<?php

namespace Fred\Traits\Elements\Event;

use Fred\Traits\User;

trait OnMODXInit
{
    use User;
    public function run()
    {
        if ($_GET['fred'] && intval($_GET['fred']) !== 2) {
            return;
        }
        if (!$this->canFred()) {
            return;
        }

        $params = json_decode(file_get_contents('php://input'), true);

        if (empty($params) || empty($params['themeSettingsPrefix']) || empty($params['themeSettings']) || !is_array($params['themeSettings'])) {
            return;
        }
        $this->modx->setOption('cache_resource', false);
        $this->modx->setOption('pageshrink.cache_resource_shrink', false);
        $this->modx->setOption('pageshrink.resource_shrink', false);

        foreach ($params['themeSettings'] as $name => $value) {
            $key = $params['themeSettingsPrefix'] . '.setting.' . $name;
            $this->modx->setOption($key, $value);
            if($this->modx->context) {
                $this->modx->context->config[$key] = $value;
            }
        }
    }
}
