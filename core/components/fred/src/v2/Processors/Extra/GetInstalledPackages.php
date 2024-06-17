<?php

namespace Fred\v2\Processors\Extra;

/**
 * @package fred
 * @subpackage processors
 */
class GetInstalledPackages extends \modObjectGetListProcessor
{
    use \Fred\Traits\Processors\Extra\GetInstalledPackages;

    public $classKey = 'modTransportPackage';
}
