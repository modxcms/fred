<?php

if ($object->xpdo) {
    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_UPGRADE:
            /** @var modX $modx */
            $modx =& $object->xpdo;
            $c = $modx->newQuery('FredElement');
            $c->where(['image:LIKE' => 'https://via.placeholder.com/%']);
            $elements = $modx->getCollection('FredElement', $c);
            foreach ($elements as $element) {
                $image = $element->get('image');
                $image = str_replace('https://via.placeholder.com/', 'https://placehold.co/', $image);
                $element->set('image', $image);
                $element->save();
            }

            $c = $modx->newQuery('FredBlueprint');
            $c->where(['image:LIKE' => 'https://via.placeholder.com/%']);
            $blueprints = $modx->getCollection('FredBlueprint', $c);
            foreach ($blueprints as $blueprint) {
                $image = $blueprint->get('image');
                $image = str_replace('https://via.placeholder.com/', 'https://placehold.co/', $image);
                $blueprint->set('image', $image);
                $blueprint->save();
            }
            break;
    }
}
return true;
