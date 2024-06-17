<?php

require_once dirname(__DIR__, 2) . '/vendor/autoload.php';

use Fred\Fred as FredBase;
class Fred extends FredBase
{
    public function __construct(&$modx, array $options = [])
    {
        $corePath = $modx->getOption('fred.core_path', $options, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
        $assetsUrl = $modx->getOption('fred.assets_url', $options, $modx->getOption('assets_url', null, MODX_ASSETS_URL) . 'components/fred/');

        /* loads some default paths for easier management */
        $options = array_merge([
            'modelPath' => $corePath . 'model/',
            'buildHelpers' => $corePath . 'src/Processors/v2/Themes/build_helpers/',
            'connectorUrl' => $assetsUrl . 'connector.php',
        ], $options);
        parent::__construct($modx, $options);
    }
    public function addPackage()
    {
        $this->modx->addPackage('fred', $this->getOption('modelPath'));
    }

    /**
     * @param $template
     * @return \FredTheme|null
     */
    public function getTheme($template)
    {
        /** @var \FredThemedTemplate $themedTemplate */
        $themedTemplate = $this->modx->getObject('FredThemedTemplate', ['template' => $template]);
        if (!$themedTemplate) {
            return null;
        }

        return $themedTemplate->Theme;
    }

    public function getSecret()
    {
        $secret = $this->modx->getOption('fred.secret');

        if (empty($secret)) {
            /** @var \modSystemSetting $secretObject */
            $secretObject = $this->modx->getObject('modSystemSetting', ['key' => 'fred.secret']);
            if (!$secretObject) {
                $secretObject = $this->modx->newObject('modSystemSetting');
                $secretObject->set('key', 'fred.secret');
                $secretObject->set('namespace', 'fred');
                $secretObject->set('xtype', 'text-password');
                $secretObject->set('value', md5(uniqid(rand(), true)) . sha1(md5(uniqid(rand(), true))));
                $secretObject->save();

                $this->modx->reloadConfig();
            } else {
                $secret = $secretObject->get('value');

                if (empty($secret)) {
                    $secretObject->set('value', md5(uniqid(rand(), true)) . sha1(md5(uniqid(rand(), true))));
                    $secretObject->save();

                    $this->modx->reloadConfig();
                }
            }

            $secret = $secretObject->get('value');
        }
        return $secret;
    }

    /**
     * @return array
     */
    public function getFredTemplates()
    {
        $c = $this->modx->newQuery('FredThemedTemplate');
        $c->select($this->modx->getSelectColumns('FredThemedTemplate', 'FredThemedTemplate', '', ['template']));
        $c->prepare();
        $c->stmt->execute();
        $templateIds = $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
        $templateIds = array_map('intval', $templateIds);

        return array_filter($templateIds);
    }
}
