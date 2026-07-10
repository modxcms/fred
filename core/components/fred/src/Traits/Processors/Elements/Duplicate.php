<?php

namespace Fred\Traits\Processors\Elements;

/**
 * @package fred
 * @subpackage processors
 */

trait Duplicate
{
    use \Fred\Traits\Processors\PermissionCheck;

    public function process()
    {
        $this->newObject->fromArray($this->object->toArray());
        $name = $this->getProperty('name');
        $category = $this->getProperty('category');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.elements_ns_name'));
            return $this->failure();
        }

        if (empty($category)) {
            $this->addFieldError('category', $this->modx->lexicon('fred.err.elements_ns_category'));
            return $this->failure();
        }

        $this->newObject->set('name', $name);
        $this->newObject->set('category', $category);
        $this->newObject->set('uuid', '');

        $c = $this->modx->newQuery($this->classKey);
        $c->where([
            'category' => $category,
        ]);
        $c->limit(1);
        $c->sortby('`rank`', 'DESC');

        $lastElement = $this->modx->getObject($this->classKey, $c);
        $last = (!empty($lastElement)) ? $lastElement->get('rank') + 1 : 1;

        $this->newObject->set('rank', $last);

        if ($this->saveObject() === false) {
            $this->modx->error->checkValidation($this->newObject);
            return $this->failure($this->modx->lexicon($this->objectType . '_err_duplicate'));
        }

        return $this->success('');
    }
}
