<?php
/**
 * @property int $id
 * @property string $name
 * @property string $uuid
 * @property string $description
 * @property array $config
 * @property string $theme_folder
 * @property string $default_element
 * 
 * @property FredElementCategory[] $ElementCategories
 * @property FredBlueprintCategory[] $BlueprintCategories
 * @property FredElementRTEConfig[] $RTEConfigs
 * @property FredElementOptionSet[] $OptionSets
 * @property FredThemedTemplate[] $Templates
 * 
 * @package fred
 */
class FredTheme extends xPDOSimpleObject {
    public function save($cacheFlag = null)
    {
        $uuid = $this->get('uuid');

        if (empty($uuid)) {
            try {
                $this->set('uuid', \Fred\Utils::uuid());
            } catch (Exception $e) {}
        }

        return parent::save($cacheFlag);
    }

    public function set($k, $v = null, $vType = '')
    {
        if ($k === 'theme_folder') {
            $v = strtolower($v);
            $v = str_replace(' ', '_', $v);
            $v = str_replace('.', '', $v);
            $v = str_replace('/', '', $v);
        }
        
        return parent::set($k, $v, $vType);
    }

    public function getThemeFolderPath()
    {
        $themeFolder = $this->get('theme_folder');

        if (empty($themeFolder)) {
            $this->set('theme_folder', $this->get('name'));
            $this->save();

            $themeFolder = $this->get('theme_folder');
        }

        $path = rtrim($this->xpdo->getOption('assets_path'), '/') . '/themes/' . $themeFolder . '/';

        return $path;
    }
    
    public function getThemeFolderUri()
    {
        $themeFolder = $this->get('theme_folder');

        if (empty($themeFolder)) {
            $this->set('theme_folder', $this->get('name'));
            $this->save();

            $themeFolder = $this->get('theme_folder');
        }

        $uri = rtrim($this->xpdo->getOption('assets_url'), '/') . '/themes/' . $themeFolder . '/';

        return $uri;
    }
}