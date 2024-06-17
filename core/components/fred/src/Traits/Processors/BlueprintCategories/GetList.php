<?php

namespace Fred\Traits\Processors\BlueprintCategories;

/**
 * @package fred
 * @subpackage processors
 */
trait GetList
{
    public function beforeIteration(array $list)
    {
        $addAll = (int)$this->getProperty('addAll', 0);

        if ($addAll === 1) {
            $list[] = [
                'id' => 0,
                'name' => $this->modx->lexicon('fred.blueprint_cateogries.all')
            ];
        }

        return parent::beforeIteration($list);
    }
}
