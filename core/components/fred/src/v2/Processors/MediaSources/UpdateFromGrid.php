<?php

namespace Fred\v2\Processors\MediaSources;

/**
 * @package fred
 * @subpackage processors
 */

class UpdateFromGrid extends \modObjectUpdateProcessor
{
    use \Fred\Traits\Processors\MediaSources\UpdateFromGrid;

    public $classKey = 'modMediaSource';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.media_sources';

    public $object;

    private $fred = false;
    private $fredReadOnly = false;
}
