<?php
if ($object->xpdo) {
    /** @var modX $modx */
    $modx =& $object->xpdo;

    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
        case xPDOTransport::ACTION_UPGRADE:
            /** @var modMediaSource[] $mediaSources */
            $mediaSources = $modx->getIterator('modMediaSource', $c);
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
            
            break;
    }
}
return true;