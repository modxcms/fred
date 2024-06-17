<?php

namespace Fred\Traits\Processors\ThemedTemplates;

/**
 * @package fred
 * @subpackage processors
 */
trait Update
{
    use \Fred\Traits\Processors\PermissionCheck;

    public function beforeSet()
    {
        $theme = $this->getProperty('theme');

        if (empty($theme)) {
            $this->addFieldError('theme', $this->modx->lexicon('fred.err.theme_ns_name'));
        }

        return parent::beforeSet();
    }
}
