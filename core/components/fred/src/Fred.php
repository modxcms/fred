<?php
namespace Fred;

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Firebase\JWT\Key;
use Fred\Model\FredTheme;
use Fred\Model\FredThemedTemplate;
use MODX\Revolution\modSystemSetting;

/**
 * The main Fred service class.
 *
 * @package fred
 */
class Fred
{
    const VERSION = '1.2.1-pl';

    /** @var \MODX\Revolution\modX */
    public $modx = null;
    public $namespace = 'fred';
    public $cache = null;
    public $options = [];

    public function __construct(\MODX\Revolution\modX &$modx, array $options = [])
    {
        $this->modx =& $modx;

        $corePath = $this->getOption('core_path', $options, $this->modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
        $assetsPath = $this->getOption('assets_path', $options, $this->modx->getOption('assets_path', null, MODX_ASSETS_PATH) . 'components/fred/');
        $assetsUrl = $this->getOption('assets_url', $options, $this->modx->getOption('assets_url', null, MODX_ASSETS_URL) . 'components/fred/');

        /* loads some default paths for easier management */
        $this->options = array_merge([
            'namespace' => $this->namespace,
            'corePath' => $corePath,
            'modelPath' => $corePath . 'src/Mmodel/',
            'buildHelpers' => $corePath . 'src/Processors/Themes/build_helpers/',
            'chunksPath' => $corePath . 'elements/chunks/',
            'snippetsPath' => $corePath . 'elements/snippets/',
            'templatesPath' => $corePath . 'templates/',
            'assetsPath' => $assetsPath,
            'assetsUrl' => $assetsUrl,
            'jsUrl' => $assetsUrl . 'mgr/js/',
            'cssUrl' => $assetsUrl . 'mgr/css/',
            'webAssetsUrl' => $assetsUrl . 'web/',
            'version' => self::VERSION
        ], $options);

        $this->modx->lexicon->load('fred:default');
    }

    /**
     * Get a local configuration option or a namespaced system setting by key.
     *
     * @param string $key The option key to search for.
     * @param array $options An array of options that override local options.
     * @param mixed $default The default value returned if the option is not found locally or as a
     * namespaced system setting; by default this value is null.
     * @return mixed The option value or the default value specified.
     */
    public function getOption($key, $options = [], $default = null)
    {
        $option = $default;
        if (!empty($key) && is_string($key)) {
            if ($options != null && array_key_exists($key, $options)) {
                $option = $options[$key];
            } elseif (array_key_exists($key, $this->options)) {
                $option = $this->options[$key];
            } elseif (array_key_exists("{$this->namespace}.{$key}", $this->modx->config)) {
                $option = $this->modx->getOption("{$this->namespace}.{$key}");
            }
        }
        return $option;
    }

    /**
     * @param $template
     * @return FredTheme|null
     */
    public function getTheme($template)
    {
        /** @var FredThemedTemplate $themedTemplate */
        $themedTemplate = $this->modx->getObject(FredThemedTemplate::class, ['template' => $template]);
        if (!$themedTemplate) {
            return null;
        }

        return $themedTemplate->Theme;
    }

    public function getSecret()
    {
        $secret = $this->modx->getOption('fred.secret');

        if (empty($secret)) {
            /** @var modSystemSetting $secretObject */
            $secretObject = $this->modx->getObject(modSystemSetting::class, ['key' => 'fred.secret']);
            if (!$secretObject) {
                $secretObject = $this->modx->newObject(modSystemSetting::class);
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

    public function getSecretKey()
    {
        return new Key($this->getSecret(), 'HS256');
    }

    /**
     * @return array
     * @throws \Exception
     * @throws \UnexpectedValueException     Provided JWT was invalid
     * @throws \Firebase\JWT\SignatureInvalidException    Provided JWT was invalid because the signature verification failed
     * @throws \Firebase\JWT\BeforeValidException         Provided JWT is trying to be used before it's eligible as defined by 'nbf'
     * @throws \Firebase\JWT\SignatureInvalidException         Provided JWT is trying to be used before it's been created as defined by 'iat'
     * @throws \Firebase\JWT\ExpiredException             Provided JWT has since expired, as defined by the 'exp' claim
     */
    public function getJWTPayload()
    {
        if (empty($_SERVER['HTTP_X_FRED_TOKEN'])) {
            throw new \Exception('Fred Token is missing');
        }

        $payload = \Firebase\JWT\JWT::decode($_SERVER['HTTP_X_FRED_TOKEN'], $this->getSecretKey());
        return (array)$payload;
    }

    /**
     * @return array
     */
    public function getFredTemplates()
    {
        $c = $this->modx->newQuery(FredThemedTemplate::class);
        $c->select($this->modx->getSelectColumns(FredThemedTemplate::class, 'FredThemedTemplate', '', ['template']));
        $c->prepare();
        $c->stmt->execute();
        $templateIds = $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
        $templateIds = array_map('intval', $templateIds);

        return array_filter($templateIds);
    }
}
