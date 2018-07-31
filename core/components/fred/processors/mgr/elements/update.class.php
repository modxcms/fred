<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementsUpdateProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'FredElement';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.elements';
    /** @var FredElement $object */
    public $object;

    public function beforeSet()
    {
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.elements_ns_name'));
        }

        $rank = $this->getProperty('rank', '');
        if ($rank === '') {
            $c = $this->modx->newQuery($this->classKey);
            $c->where([
                'id:!=' => $this->object->id,
                'category' => $this->getProperty('category', $this->object->get('category')),
            ]);
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

        $optionsOverride = $this->getProperty('options_override');
        if (empty($optionsOverride)) {
            $this->setProperty('options_override', '{}');
        }

        return parent::beforeSet();
    }
}

return 'FredElementsUpdateProcessor';