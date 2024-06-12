<?php

namespace Fred\Processors\MediaSources;

use MODX\Revolution\Processors\Model\UpdateProcessor;
use MODX\Revolution\Sources\modMediaSource;

/**
 * @package fred
 * @subpackage processors
 */

class UpdateFromGrid extends UpdateProcessor
{
    use \Fred\Traits\Processors\MediaSources\UpdateFromGrid;

    public $classKey = modMediaSource::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.media_sources';

    public $object;

    private $fred = false;
    private $fredReadOnly = false;
}
