<?php

namespace Fred\Traits\Processors\ElementOptionSets;

/**
 * @package fred
 * @subpackage processors
 */
trait GetList
{
    public function beforeIteration(array $list)
    {
        $addAll = (int)$this->getProperty('addEmpty', 0);
        $search = $this->getProperty('search', '');

        if (empty($search) && ($addAll === 1)) {
            $list[] = [
                'id' => 0,
                'name' => $this->modx->lexicon('fred.element_option_sets.no_set')
            ];
        }

        return parent::beforeIteration($list);
    }
}
