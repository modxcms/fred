<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementsGetProcessor extends modObjectGetProcessor
{
    public $classKey = 'FredElement';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.elements';
    /** @var FredElement $object */
    public $object;
    
    public function beforeOutput()
    {
        $category = $this->object->Category;
        
        if ($category) {
            $theme = $category->Theme;
            
            if ($theme) {
                $this->object->set('theme', $theme->id);
                $this->object->set('theme_folder', $theme->theme_folder);
            }
        }

        return true;
    }
}

return 'FredElementsGetProcessor';