<?php
if ($object->xpdo) {
    /** @var modX $modx */
    $modx =& $object->xpdo;

    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
        case xPDOTransport::ACTION_UPGRADE:
            /** @var modMediaSource[] $mediaSources */
            $mediaSources = $modx->getIterator('sources.modMediaSource');
            
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

            $assetsPath = $modx->getOption('assets_path');
            $assetsUrl = $modx->getOption('assets_url');
            $basePath = $modx->getOption('base_path');
            $baseUrl = $modx->getOption('base_url');

            /** @var modMediaSource $assetsMS */
            $assetsMS = $modx->getObject('sources.modMediaSource', ['name' => 'Assets']);
            if (!$assetsMS) {
                $assetsMS = $modx->newObject('sources.modMediaSource');
                $assetsMS->set('class_key','sources.modFileMediaSource');
                $assetsMS->set('name','Assets');
                $assetsMS->set('description','Assets');

                $assetsMS->setProperties([
                    'basePath' => ltrim(str_replace($basePath, '', $assetsPath), '/\\'),
                    'baseUrl' => ltrim(str_replace($baseUrl, '', $assetsUrl), '/\\'),
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