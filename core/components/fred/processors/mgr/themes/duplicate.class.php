<?php
/**
 * @package fred
 * @subpackage processors
 */

class FredThemeDuplicateProcessor extends modObjectDuplicateProcessor
{
    public $classKey = 'FredTheme';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.theme';
    
    public function process() {
        $this->newObject->fromArray($this->object->toArray());
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.theme_ns_name'));
            return $this->failure();
        }

        $this->newObject->set('name', $name);
        $this->newObject->set('uuid', '');

        if ($this->saveObject() === false) {
            $this->modx->error->checkValidation($this->newObject);
            return $this->failure($this->modx->lexicon($this->objectType.'_err_duplicate'));
        }

        return $this->success('');
    }
}

return 'FredThemeDuplicateProcessor';