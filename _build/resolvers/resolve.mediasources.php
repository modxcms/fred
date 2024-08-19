<?php

if ($object->xpdo) {
    /** @var modX $modx */
    $modx =& $object->xpdo;

    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
        case xPDOTransport::ACTION_UPGRADE:
            // check modx version
            if (empty($modx->version)) {
                $modx->getVersionData();
            }
            $version = (int) $modx->version['version'];
            if ($version > 2) {
                $sourceClass = \MODX\Revolution\Sources\modMediaSource::class;
                $fileClass = '\\MODX\\Revolution\\Sources\\modFileMediaSource';
            } else {
                $sourceClass = 'sources.modMediaSource';
                $fileClass = 'sources.modFileMediaSource';
            }
            /** @var modMediaSource[] $mediaSources */
            $mediaSources = $modx->getIterator($sourceClass);

            foreach ($mediaSources as $mediaSource) {
                $properties = $mediaSource->getProperties();

                if (!isset($properties['fred'])) {
                    $properties['fred'] = [
                        'name' => 'fred',
                        'desc' => '',
                        'type' => 'combo-boolean',
                        'value' => false,
                        'lexicon' => null,
                        'name_trans' => 'fred'
                    ];
                }

                if (!isset($properties['fredReadOnly'])) {
                    $properties['fredReadOnly'] = [
                        'name' => 'fredReadOnly',
                        'desc' => '',
                        'type' => 'combo-boolean',
                        'value' => false,
                        'lexicon' => null,
                        'name_trans' => 'fredReadOnly'
                    ];
                }

                $mediaSource->setProperties($properties);
                $mediaSource->save();
            }

            /** @var modMediaSource $assetsMS */
            $assetsMS = $modx->getObject($sourceClass, ['name' => 'Assets']);
            if (!$assetsMS) {
                $assetsPath = $modx->getOption('assets_path');
                $assetsUrl = $modx->getOption('assets_url');
                $basePath = $modx->getOption('base_path');
                $baseUrl = $modx->getOption('base_url');

                $assetsMS = $modx->newObject($fileClass);
                $assetsMS->set('name', 'Assets');
                $assetsMS->set('description', 'Assets');

                if (strpos($assetsPath, $basePath) === 0) {
                    $msAssetsPathRelative = true;
                    $msAssetsPath = trim(str_replace($basePath, '', $assetsPath), '/\\') . '/';
                } else {
                    $msAssetsPathRelative = false;
                    $msAssetsPath = $assetsPath;
                }

                if (strpos($assetsUrl, $baseUrl) === 0) {
                    $msAssetsUrlRelative = true;
                    $msAssetsUrl = trim(str_replace($baseUrl, '', $assetsUrl), '/\\') . '/';
                } else {
                    $msAssetsUrlRelative = false;
                    $msAssetsUrl = $assetsUrl;
                }

                $assetsMS->setProperties($assetsMS->getDefaultProperties());
                $assetsMS->setProperties([
                    'basePath' => $msAssetsPath,
                    'basePathRelative' => $msAssetsPathRelative,
                    'baseUrl' => $msAssetsUrl,
                    'baseUrlRelative' => $msAssetsUrlRelative,
                    'fred' => [
                        'name' => 'fred',
                        'desc' => '',
                        'type' => 'combo-boolean',
                        'value' => true,
                        'lexicon' => null,
                        'name_trans' => 'fred'
                    ],
                    'fredReadOnly' => [
                        'name' => 'fredReadOnly',
                        'desc' => '',
                        'type' => 'combo-boolean',
                        'value' => false,
                        'lexicon' => null,
                        'name_trans' => 'fredReadOnly'
                    ],
                ], true);

                $assetsMS->save();
            }

            break;
    }
}
return true;
