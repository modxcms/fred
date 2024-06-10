<?php

namespace Fred\Processors\ThemedTemplates;

use Fred\Model\FredThemedTemplate;
use MODX\Revolution\Processors\Model\UpdateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends UpdateProcessor
{
    public $classKey = FredThemedTemplate::Class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';
    public $primaryKeyField = 'template';

    /** @var FredThemedTemplate $object */
    public $object;

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_themed_templates_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

    public function beforeSet()
    {
        $theme = $this->getProperty('theme');

        if (empty($theme)) {
            $this->addFieldError('theme', $this->modx->lexicon('fred.err.theme_ns_name'));
        }

        return parent::beforeSet();
    }
}
