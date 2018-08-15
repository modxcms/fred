<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementsCreateProcessor extends modObjectCreateProcessor
{
    public $classKey = 'FredElement';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.elements';
    /** @var FredElement $object */
    public $object;

    public function beforeSet()
    {
        $name = $this->getProperty('name');
        $category = $this->getProperty('category');
        $image = $this->getProperty('image');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.elements_ns_name'));
        }
        
        if (empty($category)) {
            $this->addFieldError('category', $this->modx->lexicon('fred.err.elements_ns_category'));
        }

        $rank = $this->getProperty('rank', '');
        if ($rank === '') {
            $c = $this->modx->newQuery($this->classKey);
            $c->where([
                'category' => $this->getProperty('category'),
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

            $this->setProperty('rank', $last);
        }
        
        if (empty($image)) {
            $this->setProperty('image', 'https://via.placeholder.com/300x150?text=' . urlencode($name));
        }

        return parent::beforeSet();
    }

}

return 'FredElementsCreateProcessor';