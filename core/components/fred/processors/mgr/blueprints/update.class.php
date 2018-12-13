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
    /** @var FredBlueprint $object */
    public $object;

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_blueprints_save')) {
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
            $this->addFieldError('name', $this->modx->lexicon('fred.err.blueprints_ns_name'));
        } else {
            if ($this->modx->getCount($this->classKey, ['name' => $name, 'category' => $category, 'id:!=' => $this->object->id]) > 0) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.blueprints_ae_name'));
            }
        }

        if (empty($category)) {
            $this->addFieldError('category', $this->modx->lexicon('fred.err.blueprints_ns_category'));
        }
        
        $rank = $this->getProperty('rank', '');
        if ($rank === '') {
            $c = $this->modx->newQuery($this->classKey);
            
            $c->where([
                'id:!=' => $this->object->id,
                'category' => $category,
            ]);
            
            $c->limit(1);
            $c->sortby('rank', 'DESC');

            $last = 0;

            /** @var FredBlueprint[] $blueprints */
            $blueprints = $this->modx->getIterator($this->classKey, $c);
            foreach ($blueprints as $blueprint) {
                $last = $blueprint->rank + 1;
                break;
            }

            $this->setProperty('rank', $last);
        }

        if (empty($image)) {
            $this->setProperty('image', 'https://via.placeholder.com/300x150?text=' . urlencode($name));
        }

        $this->setProperty('complete', $this->object->get('complete'));
        $this->setProperty('createdBy', $this->object->get('createdBy'));

        if (!$this->modx->hasPermission('fred_blueprints_create_public')) {
            $this->setProperty('public', $this->object->get('public'));
        }
        
        return parent::beforeSet();
    }
}

return 'FredBlueprintsUpdateProcessor';