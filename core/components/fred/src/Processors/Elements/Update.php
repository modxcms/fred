<?php

namespace Fred\Processors\Elements;

use Fred\Model\FredBlueprintCategory;
use Fred\Model\FredElement;
use Fred\Model\FredElementTemplateAccess;
use MODX\Revolution\Processors\Model\UpdateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends UpdateProcessor
{
    public $classKey = FredElement::class;
    public $languageTopics = ['fred:default'];
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

            /** @var FredElement[] $categories */
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

    public function beforeSave()
    {
        $data = $this->getProperty('options_override');
        if (($data !== null) && empty($data)) {
            $this->object->set('options_override', []);
        }

        return parent::beforeSave();
    }

    public function afterSave()
    {
        $templates = $this->getProperty('templates');
        if ($templates === null) {
            return parent::afterSave();
        }

        $templates = array_map('intval', $templates);
        $templates = array_filter($templates);

        $this->modx->removeCollection(FredElementTemplateAccess::class, ['element' => $this->object->id]);

        foreach ($templates as $template) {
            $categoryTemplate = $this->modx->newObject(FredElementTemplateAccess::class);
            $categoryTemplate->set('element', $this->object->id);
            $categoryTemplate->set('template', $template);
            $categoryTemplate->save();
        }

        return parent::afterSave();
    }
}
