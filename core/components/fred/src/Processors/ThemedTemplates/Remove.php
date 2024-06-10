<?php

namespace Fred\Processors\ThemedTemplates;

use Fred\Model\FredThemedTemplate;
use MODX\Revolution\Processors\Model\RemoveProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends RemoveProcessor
{
    public $classKey = FredThemedTemplate::class;
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
