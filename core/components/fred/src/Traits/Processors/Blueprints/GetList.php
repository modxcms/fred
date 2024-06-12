<?php

namespace Fred\Traits\Processors\Blueprints;

/**
 * @package fred
 * @subpackage processors
 */
trait GetList
{

    public function beforeIteration(array $list)
    {
        $addNone = (int)$this->getProperty('addNone', 0);

        if ($addNone === 1) {
            $list[] = [
                'id' => 0,
                'name' => $this->modx->lexicon('fred.global.none')
            ];
        }

        return parent::beforeIteration($list);
    }
}
