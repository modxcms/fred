<?php

namespace Fred\Processors\Extra;

use MODX\Revolution\Processors\Model\GetListProcessor;
use MODX\Revolution\Transport\modTransportPackage;

/**
 * @package fred
 * @subpackage processors
 */
class GetInstalledPackages extends GetListProcessor
{
    use \Fred\Traits\Processors\Extra\GetInstalledPackages;

    public $classKey = modTransportPackage::class;
}
