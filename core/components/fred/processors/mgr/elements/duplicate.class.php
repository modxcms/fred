<?php
/**
 * @package fred
 * @subpackage processors
 */

class FredElementsDuplicateProcessor extends modObjectDuplicateProcessor
{
    public $classKey = 'FredElement';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.elements';
    
    public function process() {
        $this->newObject->fromArray($this->object->toArray());
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.elements_ns_name'));
            return $this->failure();
        }

        $this->newObject->set('name', $name);

        $c = $this->modx->newQuery($this->classKey);
        $c->where([
            'category' => $this->object->get('category'),
        ]);
        $c->limit(1);
        $c->sortby('rank', 'DESC');

        $last = 0;

        /** @var FredElementCategory[] $categories */
        $categories = $this->modx->getIterator($this->classKey, $c);
        foreach ($categories as $category) {
            $last = $category->rank + 1;
            break;
        }
        $this->newObject->set('rank', $last);
        
        if ($this->saveObject() === false) {
            $this->modx->error->checkValidation($this->newObject);
            return $this->failure($this->modx->lexicon($this->objectType.'_err_duplicate'));
        }

        return $this->success('');
    }
}

return 'FredElementsDuplicateProcessor';