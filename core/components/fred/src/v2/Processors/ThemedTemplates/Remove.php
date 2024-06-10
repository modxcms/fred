<?php

namespace Fred\v2\Processors\ThemedTemplates;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends \modObjectRemoveProcessor
{
    public $classKey = 'FredThemedTemplate';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.themed_templates';
    public $primaryKeyField = 'template';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_themed_templates_delete')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
}
