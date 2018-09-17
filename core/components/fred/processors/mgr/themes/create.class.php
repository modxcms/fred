<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredThemeCreateProcessor extends modObjectCreateProcessor
{
    public $classKey = 'FredTheme';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.theme';
    /** @var FredTheme $object */
    public $object;

    public function beforeSet()
    {
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.theme_ns_name'));
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

return 'FredThemeCreateProcessor';