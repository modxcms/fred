<?php

namespace Fred\Traits\Elements\Event;

use Fred\Traits\User;

trait OnMODXInit
{
    use User;
    public function run()
    {
        if (!$this->canFred()) {
            return;
        }
        if ($_GET['fred'] && intval($_GET['fred']) !== 2) {
            return;
        }

        $params = json_decode(file_get_contents('php://input'), true);

        if (empty($params) || empty($params['themeSettingsPrefix']) || empty($params['themeSettings']) || !is_array($params['themeSettings'])) {
            return;
        }

        foreach ($params['themeSettings'] as $name => $value) {
            $this->modx->setOption($params['themeSettingsPrefix'] . '.setting.' . $name, $value);
        }
    }
}
