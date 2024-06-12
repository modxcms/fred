<?php

namespace Fred\Traits\Processors\Themes;

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

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.theme_ns_name'));
        } else {
            if ($this->modx->getCount($this->classKey, ['name' => $name, 'id:!=' => $this->object->id]) > 0) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.theme_ae_name'));
            }
        }

        return parent::beforeSet();
    }
}
