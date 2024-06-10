<?php

namespace Fred\Processors\ElementOptionSets;

use Fred\Model\FredElementOptionSet;
use MODX\Revolution\Processors\Model\CreateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Create extends CreateProcessor
{
    public $classKey = FredElementOptionSet::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_option_sets';

    /** @var FredElementOptionSet $object */
    public $object;

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_option_sets_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

    public function beforeSet()
    {
        $name = $this->getProperty('name');
        $theme = $this->getProperty('theme');

        if (empty($theme)) {
            $this->addFieldError('theme', $this->modx->lexicon('fred.err.element_option_sets_ns_theme'));
        }

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.element_option_sets_ns_name'));
        } else {
            if ($this->doesAlreadyExist(['name' => $name, 'theme' => $theme])) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.element_option_sets_ae_name'));
            }
        }

        return parent::beforeSet();
    }
}
