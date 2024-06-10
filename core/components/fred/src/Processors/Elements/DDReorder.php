<?php

namespace Fred\Processors\Elements;

use Fred\Model\FredElement;
use MODX\Revolution\Processors\ModelProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class DDReorder extends ModelProcessor
{
    public $classKey = FredElement::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.elements';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

    public function process()
    {
        $elementId = $this->getProperty('elementId');
        $categoryId = $this->getProperty('categoryId');
        $oldIndex = $this->getProperty('oldIndex');
        $newIndex = $this->getProperty('newIndex');

        $c = $this->modx->newQuery($this->classKey);
        $c->where(array(
            'id:!=' => $elementId,
            'category' => $categoryId,
            'rank:>=' => min($oldIndex, $newIndex),
            'rank:<=' => max($oldIndex, $newIndex),
        ));

        $c->sortby('rank', 'ASC');

        /** @var FredElement[] $categories */
        $categories = $this->modx->getIterator($this->classKey, $c);

        if (min($oldIndex, $newIndex) == $newIndex) {
            foreach ($categories as $category) {
                $categoryObject = $this->modx->getObject($this->classKey, $category->get('id'));
                $categoryObject->set('rank', $categoryObject->get('rank') + 1);
                $categoryObject->save();
            }
        } else {
            foreach ($categories as $category) {
                $categoryObject = $this->modx->getObject($this->classKey, $category->get('id'));
                $categoryObject->set('rank', $categoryObject->get('rank') - 1);
                $categoryObject->save();
            }
        }

        $categoryObject = $this->modx->getObject($this->classKey, $elementId);
        $categoryObject->set('rank', $newIndex);
        $categoryObject->save();


        return $this->success('', $categoryObject);
    }
}
