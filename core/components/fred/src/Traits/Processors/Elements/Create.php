<?php

namespace Fred\Traits\Processors\Elements;

/**
 * @package fred
 * @subpackage processors
 */
trait Create
{
    use \Fred\Traits\Processors\PermissionCheck;

    public function beforeSet()
    {
        $name = $this->getProperty('name');
        $category = $this->getProperty('category');
        $image = $this->getProperty('image');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.elements_ns_name'));
        } else {
            if ($this->doesAlreadyExist(['name' => $name, 'category' => $category])) {
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
                'category' => $this->getProperty('category'),
            ]);
            $c->limit(1);
            $c->sortby('rank', 'DESC');

            $last = 0;

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

    public function afterSave()
    {
        $templates = $this->getProperty('templates');
        if ($templates === null) {
            return parent::afterSave();
        }

        $templates = array_map('intval', $templates);
        $templates = array_filter($templates);

        $this->modx->removeCollection($this->templateAccessClass, ['element' => $this->object->id]);

        foreach ($templates as $template) {
            $categoryTemplate = $this->modx->newObject($this->templateAccessClass);
            $categoryTemplate->set('element', $this->object->id);
            $categoryTemplate->set('template', $template);
            $categoryTemplate->save();
        }

        return parent::afterSave();
    }
}
