<?php

namespace Fred\v2\Processors\Blueprints;

/**
 * @package fred
 * @subpackage processors
 */
class DDReorder extends \modObjectProcessor
{
    public $classKey = 'FredBlueprint';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprints';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_blueprints_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

    public function process()
    {
        $blueprintId = $this->getProperty('blueprintId');
        $categoryId = $this->getProperty('categoryId');
        $oldIndex = $this->getProperty('oldIndex');
        $newIndex = $this->getProperty('newIndex');

        $c = $this->modx->newQuery($this->classKey);
        $c->where(array(
            'id:!=' => $blueprintId,
            'category' => $categoryId,
            'rank:>=' => min($oldIndex, $newIndex),
            'rank:<=' => max($oldIndex, $newIndex),
        ));

        $c->sortby('rank', 'ASC');

        /** @var \FredBlueprint[] $categories */
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

        $categoryObject = $this->modx->getObject($this->classKey, $blueprintId);
        $categoryObject->set('rank', $newIndex);
        $categoryObject->save();


        return $this->success('', $categoryObject);
    }
}
