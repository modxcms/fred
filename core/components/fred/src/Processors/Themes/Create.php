<?php

namespace Fred\Processors\Themes;

use Fred\Model\FredTheme;
use MODX\Revolution\Processors\Model\CreateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Create extends CreateProcessor
{
    public $classKey = FredTheme::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';

    /** @var FredTheme $object */
    public $object;

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_themes_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

    public function beforeSet()
    {
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.theme_ns_name'));
        } else {
            if ($this->modx->getCount($this->classKey, ['name' => $name, 'id:!=' => $this->object->id]) > 0) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.theme_ae_name'));
            }
        }

        $this->setProperty('theme_folder', $name);

        return parent::beforeSet();
    }

    public function afterSave()
    {
        $themeFolder = $this->object->get('theme_folder');

        if (!empty($themeFolder)) {
            $path = rtrim($this->modx->getOption('assets_path'), '/') . '/themes/' . $themeFolder . '/';

            $nfp = $this->modx->getOption('new_folder_permissions');
            $amode = !empty($nfp) ? octdec($this->modx->getOption('new_folder_permissions')) : 0777;
            if (!is_dir($path)) {
                mkdir($path, $amode, true);
            }
        }

        return parent::afterSave();
    }
}
