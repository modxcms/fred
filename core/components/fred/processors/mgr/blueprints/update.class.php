<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredBlueprintsUpdateProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'FredBlueprint';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.blueprints';
    /** @var FredBlueprintCategory $object */
    public $object;

    public function beforeSet()
    {
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.blueprint_categories_ns_name'));
        }

        $rank = $this->getProperty('rank', '');
        if ($rank === '') {
            $c = $this->modx->newQuery($this->classKey);
            $c->where(array(
                'id:!=' => $this->object->id
            ));
            $c->limit(1);
            $c->sortby('rank', 'DESC');

            $last = 0;

            /** @var FredBlueprintCategory[] $categories */
            $categories = $this->modx->getIterator($this->classKey, $c);
            foreach ($categories as $category) {
                $last = $category->rank + 1;
                break;
            }

            $this->setProperty('rank', $last);
        }

        $this->setProperty('complete', $this->object->get('complete'));
        $this->setProperty('createdBy', $this->object->get('createdBy'));

        return parent::beforeSet();
    }
}

return 'FredBlueprintsUpdateProcessor';