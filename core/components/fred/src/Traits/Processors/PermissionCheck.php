<?php

namespace Fred\Traits\Processors;

/**
 * @package fred
 * @subpackage processors
 */
trait PermissionCheck
{
    public $permissions = [];

    public function initialize()
    {
        foreach ($this->permissions as $permission) {
            if (!$this->modx->hasPermission($permission)) {
                return $this->modx->lexicon('access_denied');
            }
        }
        return parent::initialize();
    }
}
