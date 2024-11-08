<?php

namespace Fred\Traits;

trait User
{
    public function canFred(): bool
    {
        if (!$this->modx->user) {
            return false;
        }
        if (!(
            $this->modx->user->hasSessionContext('mgr') ||
            (
                $this->modx->resource &&
                $this->modx->user->hasSessionContext($this->modx->resource->context_key)
            )
        )) {
            return false;
        }
        if (!$this->modx->hasPermission('fred')) {
            return false;
        }
        return true;
    }
}
