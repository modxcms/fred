<?php

namespace Fred\Processors\BlueprintCategories;

use Fred\Model\FredBlueprintCategory;
use MODX\Revolution\Processors\ModelProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class DDReorder extends ModelProcessor
{
    public $classKey = FredBlueprintCategory::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprint_categories';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_blueprint_categories_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

    public function process()
    {
        $categoryId = $this->getProperty('categoryId');
        $themeId = $this->getProperty('themeId');
        $oldIndex = $this->getProperty('oldIndex');
        $newIndex = $this->getProperty('newIndex');

        $c = $this->modx->newQuery($this->classKey);
        $c->where(array(
            'id:!=' => $categoryId,
            'theme' => $themeId,
            'rank:>=' => min($oldIndex, $newIndex),
            'rank:<=' => max($oldIndex, $newIndex),
        ));

        $c->sortby('rank', 'ASC');

        /** @var FredBlueprintCategory[] $categories */
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

        $categoryObject = $this->modx->getObject($this->classKey, $categoryId);
        $categoryObject->set('rank', $newIndex);
        $categoryObject->save();


        return $this->success('', $categoryObject);
    }
}
