<?php

namespace Fred\v2\Processors\Themes;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends \modObjectUpdateProcessor
{
    public $classKey = 'FredTheme';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';

    /** @var \FredTheme $object */
    public $object;

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_themes_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

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
