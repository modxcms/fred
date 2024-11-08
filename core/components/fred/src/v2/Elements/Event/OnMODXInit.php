<?php
namespace Fred\v2\Elements\Event;

class OnMODXInit extends Event
{

    public function run()
    {
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
