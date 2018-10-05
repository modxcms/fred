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

use Firebase\JWT\JWT;

class ElFinder extends Endpoint
{
    public function run()
    {
        if (!$this->modx->user) {
            http_response_code(401);
            return;
        }

        if ($this->modx->user->sudo !== 1) {
            http_response_code(403);
            return;
        }

        if (empty($_SERVER['HTTP_X_FRED_TOKEN'])) {
            http_response_code(403);
            return;
        }

        try {
            $payload = JWT::decode($_SERVER['HTTP_X_FRED_TOKEN'], $this->fred->getSecret(), ['HS256']);
            $payload = (array)$payload;

            if ($payload['iss'] !== $this->modx->user->id) {
                http_response_code(403);
                return;
            }
        } catch (\Exception $e) {
            http_response_code(403);
            return;
        }

        include_once $this->fred->getOption('modelPath') . 'elFinder/autoload.php';

        $roots = [];

        $mediaSourceIDs = $this->modx->getOption('mediaSource', $_GET, '');
        $mediaSourceIDs = explode(',', $mediaSourceIDs);
        $mediaSourceIDs = array_map('trim', $mediaSourceIDs);
        $mediaSourceIDs = array_keys(array_flip($mediaSourceIDs));
        $mediaSourceIDs = array_filter($mediaSourceIDs);

        $c = $this->modx->newQuery('modMediaSource');
        $where = [
            'class_key' => 'sources.modFileMediaSource'
        ];

        if (!empty($mediaSourceIDs)) {
            $where['name:IN'] = $mediaSourceIDs;
        }

        $c->where($where);

        /** @var \modFileMediaSource[] $mediaSources */
        $mediaSources = $this->modx->getIterator('modMediaSource', $c);
        foreach ($mediaSources as $mediaSource) {
            $mediaSource->initialize();
            if(!$mediaSource->checkPolicy('list')) continue;
            
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