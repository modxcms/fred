<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredThemedTemplatesCreateProcessor extends modProcessor
{
    public $classKey = 'FredThemedTemplate';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.themed_templates';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_themed_templates_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
    
    public function process()
    {
        $templates = $this->getProperty('templates');
        $theme = $this->getProperty('theme');

        if (empty($theme)) {
            $this->addFieldError('theme', $this->modx->lexicon('fred.err.themed_templates_ns_theme'));
        }

        if (empty($templates)) {
            $this->addFieldError('templates', $this->modx->lexicon('fred.err.themed_templates_ns_template'));
        }
        
        if ($this->hasErrors()) {
            return $this->failure();
        }
        
        foreach ($templates as $template) {
            $template = intval($template);
            
            if (empty($template)) continue;
            
            $exists = $this->modx->getCount($this->classKey, ['template' => $template]);
            if ($exists > 0) continue;
            
            $themedTemplate = $this->modx->newObject($this->classKey);
            $themedTemplate->set('template', $template);
            $themedTemplate->set('theme', $theme);
            $themedTemplate->save();
        }

        return $this->success();
    }
}

return 'FredThemedTemplatesCreateProcessor';