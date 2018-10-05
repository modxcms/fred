<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

require_once dirname(dirname(dirname(__FILE__))) . '/index.class.php';

/**
 * @package fred
 * @subpackage controllers
 */
class FredThemeDownloadManagerController extends FredBaseManagerController
{
    public function process(array $scriptProperties = [])
    {
        $themeId = (int)$_GET['theme'];
        if(empty($themeId)){
            die($this->modx->lexicon('fred.err.build_ns_theme'));
        }

        $theme = $this->modx->getObject('FredTheme', ['id' => $themeId]);
        if (!$theme){
            die($this->modx->lexicon('fred.err.build_ns_theme'));
        }

        $config = $theme->get('config');

        if (empty($config) || !is_array($config)) {
            die($this->modx->lexicon('fred.err.theme_no_build'));
        }
        
        if (empty($config['name']) || empty($config['version']) || empty($config['release'])) {
            die($this->modx->lexicon('fred.err.theme_no_build'));
        }
        
        $corePath = $this->modx->getOption('core_path');
        $packagesDir = $corePath . 'packages/';
        $fileName = "{$config['name']}-{$config['version']}-{$config['release']}.transport.zip";

        $absolutePath = $packagesDir . $fileName;
        
        if (!file_exists($absolutePath)) {
            die($this->modx->lexicon('fred.err.theme_no_built_file'));
        }
        
        $fileContent = @file_get_contents($absolutePath);

        if($fileContent !== FALSE) {
            session_write_close();
            ob_clean();

            header('Pragma: public');  // required
            header('Expires: 0');  // no cache
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Cache-Control: private', false);
            header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($absolutePath)) . ' GMT');
            header('Content-Description: File Transfer');
            header('Content-Type:'); //added to fix ZIP file corruption

            header('Content-Type: "application/force-download"');
            header('Content-Disposition: attachment; filename="' . $fileName . '"');
            header('Content-Transfer-Encoding: binary');
            header('Content-Length: ' . (string) (filesize($absolutePath))); // provide file size
            header('Connection: close');

            echo $fileContent;

            die();
        } else {
            die($this->modx->lexicon('fred.err.theme_read_file'));
        }
        
    }

    public function getPageTitle()
    {
        return $this->modx->lexicon('fred.themes.download');
    }

  

}