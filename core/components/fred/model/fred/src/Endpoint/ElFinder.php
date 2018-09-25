<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\Endpoint;

class ElFinder extends Endpoint
{
    public function run()
    {
        $modx = $this->modx;
        if (!$modx->user) {
            http_response_code(401);
            return;
        }

        if ($modx->user->sudo !== 1) {
            http_response_code(403);
            return;
        }

        include_once $this->fred->getOption('modelPath') . 'elFinder/autoload.php';

        $roots = [];

        $mediaSourceIDs = $modx->getOption('mediaSource', $_GET, '');
        $mediaSourceIDs = explode(',', $mediaSourceIDs);
        $mediaSourceIDs = array_map('trim', $mediaSourceIDs);
        $mediaSourceIDs = array_map('intval', $mediaSourceIDs);
        $mediaSourceIDs = array_keys(array_flip($mediaSourceIDs));
        $mediaSourceIDs = array_filter($mediaSourceIDs);

        $c = $modx->newQuery('modMediaSource');
        $where = [];

        if (!empty($mediaSourceIDs)) {
            $where['id:IN'] = $mediaSourceIDs;
        }

        $c->where($where);

        /** @var \modMediaSource[] $mediaSources */
        $mediaSources = $modx->getIterator('modMediaSource', $c);
        foreach ($mediaSources as $mediaSource) {
            $mediaSource->initialize();
            $properties = $mediaSource->getProperties();

            if (isset($properties['fred']) && ($properties['fred']['value'] === true)) {
                $bases = $mediaSource->getBases();

                $path = $bases['pathAbsoluteWithPath'];
                $url =  $bases['urlAbsoluteWithPath'];

                $readOnly = false;
                if (isset($properties['fredReadOnly']) && ($properties['fredReadOnly']['value'] === true)) $readOnly = true;

                $roots[] = [
                    'id' => 'ms' . $mediaSource->id,
                    'driver' => 'LocalFileSystem',
                    'alias' => $mediaSource->name,
                    'path' => $path,
                    'URL' => $url,
                    'tmbPath' => '.tmb',
                    'startPath' => $path,
                    'disabled' => $readOnly ? array('rename', 'rm', 'cut', 'copy') : [],
                    'uploadDeny' => ['text/x-php'],
                    'attributes' => [
                        [
                            'pattern' => '/.php/',
                            'read'    => false,
                            'write'   => false,
                            'locked'  => true,
                            'hidden'  => true,
                        ],
                        [
                            'pattern' => '/.*/',
                            'read'    => true,
                            'write'   => !$readOnly,
                            'locked'  => false
                        ]
                    ]
                ];

            }
        }

        $options = ['roots' => $roots];
        $connector = new \elFinderConnector(new \elFinder($options));
        $connector->run();
    }
}