<?php

namespace Fred\Traits\Processors\Blueprints;

/**
 * @package fred
 * @subpackage processors
 */
trait Update
{
    use \Fred\Traits\Processors\PermissionCheck;

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
            $c->sortby('`rank`', 'DESC');

            $last = 0;

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

    public function beforeSave()
    {
        $data = $this->getProperty('data');
        if (($data !== null) && empty($data)) {
            $this->object->set('data', []);
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

        $this->modx->removeCollection($this->templateAccessClass, ['blueprint' => $this->object->id]);

        foreach ($templates as $template) {
            $categoryTemplate = $this->modx->newObject($this->templateAccessClass);
            $categoryTemplate->set('blueprint', $this->object->id);
            $categoryTemplate->set('template', $template);
            $categoryTemplate->save();
        }

        return parent::afterSave();
    }
}
