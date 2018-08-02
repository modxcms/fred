<?php
/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property boolean $complete
 * @property array $data
 * 
 * @package fred
 */
class FredElementOptionSet extends xPDOSimpleObject {
    public function processData()
    {
        $data = $this->get('data');
        $data = \Fred\Utils::modxParseString($this->xpdo, $data);
        
        if ($this->get('complete') === true) {
            if (!empty($data['settings']) && is_array($data['settings'])) {
                $data['settings'] = $this->processSettings($data['settings']);
            }
        } else {
            $wholeDataSettings = false;
            
            foreach ($data as $key => $item) {
                if (($key === 0) && (is_array($item))) {
                    $wholeDataSettings = true;
                    break;
                }
                
                if (($key === 'settings') && (is_array($item))) {
                    $data['settings'] = $this->processSettings($item);
                }
            }

            if ($wholeDataSettings === true) {
                $data = $this->processSettings($data);
            }
        }
        
        return $data;
    }
    
    private function processSettings($settings)
    {
        if (isset($settings['fred-import'])) {
            /** @var FredElementOptionSet $import */
            $import = $this->xpdo->getObject('FredElementOptionSet', ['name' => $settings['fred-import']]);
            
            if ($import) {
                $settings = $import->processData();
            } else {
                $settings = [];
            }
            
            return $settings;
        }
        
        $newSettings = [];

        foreach ($settings as $setting) {
            if (isset($setting['fred-import'])) {
                /** @var FredElementOptionSet $import */
                $import = $this->xpdo->getObject('FredElementOptionSet', ['name' => $setting['fred-import']]);
                if ($import) {
                    $processedImport = $import->processData();
                    
                    if (is_array($processedImport) && isset($processedImport[0])) {
                        foreach ($processedImport as $item) {
                            $newSettings[] = $item;
                        }
                    } else {
                        $newSettings[] = $processedImport;
                    }
                }
            } else {
                if (!empty($setting['group']) && isset($setting['settings']) && is_array($setting['settings'])) {
                    $setting['settings'] = $this->processSettings($setting['settings']);
                }
                
                $newSettings[] = $setting;
            }
        }

        return $newSettings;
    }

    public function remove(array $ancestors= array ())
    {
        $removed = parent::remove($ancestors);
        
        if ($removed) {
            $this->xpdo->updateCollection('FredElement', ['option_set' => 0], ['option_set' => $this->id]);
        }
        
        return $removed;
    }
}