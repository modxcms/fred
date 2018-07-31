<?php
/**
 * @package fred
 * @subpackage processors
 */

class FredElementOptionSetsDuplicateProcessor extends modObjectDuplicateProcessor
{
    public $classKey = 'FredElementOptionSet';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_option_sets';
    
    public function process() {
        $this->newObject->fromArray($this->object->toArray());
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.element_option_sets_ns_name'));
            return $this->failure();
        } else {
            if ($this->modx->getCount($this->classKey, ['name' => $name]) > 0) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.element_option_sets_ae_name'));
                return $this->failure();
            }
        }

        $this->newObject->set('name', $name);

        if ($this->saveObject() === false) {
            $this->modx->error->checkValidation($this->newObject);
            return $this->failure($this->modx->lexicon($this->objectType.'_err_duplicate'));
        }

        return $this->success('');
    }
}

return 'FredElementOptionSetsDuplicateProcessor';