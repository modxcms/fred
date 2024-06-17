<?php

namespace Fred\Traits\Processors\Themes;

/**
 * @package fred
 * @subpackage processors
 */
trait GetList
{
    public function initialize()
    {
        $corePath = $this->modx->getOption('core_path');

        $this->packagesDir = $corePath . 'packages/';

        return parent::initialize();
    }


    public function beforeIteration(array $list)
    {
        $addAll = (int)$this->getProperty('addAll', 0);

        if ($addAll === 1) {
            $list[] = [
                'id' => 0,
                'name' => $this->modx->lexicon('fred.themes.all')
            ];
        }

        return parent::beforeIteration($list);
    }
}
