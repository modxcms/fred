<?php

/**
 * This file is part of the teleport package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred;

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;
use xPDO\Transport\xPDOFileVehicle;
use xPDO\Transport\xPDOTransport;
use xPDO\Transport\xPDOVehicle;
use xPDO\xPDO;

/**
 * A custom \xPDOFileVehicle implementation that uses symfony/finder and symfony/filesystem
 *
 * @package Teleport\Transport
 */
class FredFileVehicle extends xPDOFileVehicle
{
    protected $skipObjectParams = ['in', 'target'];
    public $class = 'FileVehicle';

    /**
     * Put a representation of a MySQL table and it's data into this vehicle.
     *
     * @param xPDOTransport $transport The transport package hosting the vehicle.
     * @param mixed          &$object A reference to the artifact this vehicle will represent.
     * @param array          $attributes Additional attributes represented in the vehicle.
     */
    public function put(&$transport, &$object, $attributes = array ())
    {
        if (!isset($this->payload['class'])) {
            $this->payload['class'] = $this->class;
        }
        if (!isset($object['in']) || !isset($object['target'])) {
            $transport->xpdo->log(xPDO::LOG_LEVEL_ERROR, "Processing FileVehicle failed. You have to specify all required Object parameters: in, target");
            $object = null;
            $this->payload['object'] = $object;
        } else {
            $finder = new Finder();
            $finder->in($object['in']);
            foreach ($object as $method => $data) {
                if (in_array($method, $this->skipObjectParams)) {
                    continue;
                }
                if (method_exists($finder, $method)) {
                    if (is_array($data)) {
                        foreach ($data as $param) {
                            $finder->$method($param);
                        }
                    } else {
                        $finder->$method($data);
                    }
                }
            }
            $object['files'] = iterator_to_array($finder);
            $this->payload['object'] = $object;
        }

        xPDOVehicle :: put($transport, $object, $attributes);
    }
    /**
     * Copies the files into the vehicle and transforms the payload for storage.
     */
    protected function _compilePayload(&$transport)
    {
        xPDOVehicle :: _compilePayload($transport);
        if (isset($this->payload['object']['in']) && isset($this->payload['object']['target'])) {
            $fs = new Filesystem();
            $rootFolder = explode('/', $this->payload['object']['in']);
            $rootFolder = array_pop($rootFolder);
            $this->payload['object']['name'] = $rootFolder;
            $this->payload['object']['source'] = $transport->signature . '/' . $this->payload['class'] . '/' . $this->payload['signature'];
            $filePath = $transport->path . $transport->signature . '/' . $this->payload['class'] . '/' . $this->payload['signature'] . '/' . $rootFolder;

            $fs->mkdir($filePath);
            /** @var SplFileInfo $file */
            foreach ($this->payload['object']['files'] as $file) {
                if ($file->isDir()) {
                    $fs->mkdir($filePath . '/' . $file->getRelativePathname());
                } else {
                    $fs->copy($file->getRealpath(), $filePath . '/' . $file->getRelativePathname());
                }
            }
            unset($this->payload['object']['files']);
        }
    }
}
