<?php

namespace Fred\Traits\Processors\ElementCategories;

/**
 * @package fred
 * @subpackage processors
 */
trait GetList
{
    public function beforeIteration(array $list)
    {
        $addAll = (int)$this->getProperty('addAll', 0);
        $search = $this->getProperty('search', '');

        if (empty($search) && ($addAll === 1)) {
            $list[] = [
                'id' => 0,
                'name' => $this->modx->lexicon('fred.element_cateogries.all')
            ];
        }

        return parent::beforeIteration($list);
    }
}
