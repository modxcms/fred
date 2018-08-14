<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredThemedTemplatesRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'FredThemedTemplate';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.themed_templates';
    public $primaryKeyField = 'template';

}

return 'FredThemedTemplatesRemoveProcessor';