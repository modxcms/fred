<?php

namespace Fred\v2\Processors\BlueprintCategories;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends \modObjectUpdateProcessor
{
    public $classKey = 'FredBlueprintCategory';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprint_categories';

    /** @var \FredBlueprintCategory $object */
    public $object;

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_blueprint_categories_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

    public function beforeSet()
    {
        $name = $this->getProperty('name');
        $theme = $this->getProperty('theme');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.blueprint_categories_ns_name'));
        } else {
            if ($this->modx->getCount($this->classKey, ['name' => $name, 'theme' => $theme, 'id:!=' => $this->object->id]) > 0) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.blueprint_categories_ae_name'));
            }
        }

        if (empty($theme)) {
            $this->addFieldError('theme', $this->modx->lexicon('fred.err.blueprint_categories_ns_theme'));
        }

        $rank = $this->getProperty('rank', '');
        if ($rank === '') {
            $c = $this->modx->newQuery($this->classKey);
            $c->where(array(
                'id:!=' => $this->object->id,
                'theme' => $theme
            ));
            $c->limit(1);
            $c->sortby('rank', 'DESC');

            $last = 0;

            /** @var \FredBlueprintCategory[] $categories */
            $categories = $this->modx->getIterator($this->classKey, $c);
            foreach ($categories as $category) {
                $last = $category->rank + 1;
                break;
            }

            $this->setProperty('rank', $last);
        }

        $this->setProperty('createdBy', $this->object->get('createdBy'));

        if (!$this->modx->hasPermission('fred_blueprint_categories_create_public')) {
            $this->setProperty('public', $this->object->get('public'));
        }

        return parent::beforeSet();
    }

    public function afterSave()
    {
        $templates = $this->getProperty('templates');
        $templates = array_map('intval', $templates);
        $templates = array_filter($templates);

        $this->modx->removeCollection('FredBlueprintCategoryTemplateAccess', ['category' => $this->object->id]);

        foreach ($templates as $template) {
            $categoryTemplate = $this->modx->newObject('FredBlueprintCategoryTemplateAccess');
            $categoryTemplate->set('category', $this->object->id);
            $categoryTemplate->set('template', $template);
            $categoryTemplate->save();
        }

        return parent::afterSave();
    }
}
