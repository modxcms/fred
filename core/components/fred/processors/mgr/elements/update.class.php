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

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
    
    public function beforeSet()
    {
        $name = $this->getProperty('name');
        $category = $this->getProperty('category');
        $image = $this->getProperty('image');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.elements_ns_name'));
        } else {
            if ($this->modx->getCount($this->classKey, ['name' => $name, 'category' => $category, 'id:!=' => $this->object->id]) > 0) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.elements_ae_name'));
            }
        }
        
        if (empty($category)) {
            $this->addFieldError('category', $this->modx->lexicon('fred.err.elements_ns_category'));
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
        
        if (($optionsOverride !== null) && empty($optionsOverride)) {
            $this->setProperty('options_override', '{}');
        }

        if (empty($image)) {
            $this->setProperty('image', 'https://via.placeholder.com/300x150?text=' . urlencode($name));
        }

        return parent::beforeSet();
    }
}

return 'FredElementsUpdateProcessor';