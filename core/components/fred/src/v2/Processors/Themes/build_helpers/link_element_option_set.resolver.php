<?php

if ($options[xPDOTransport::PACKAGE_ACTION] !== xPDOTransport::ACTION_UNINSTALL) {
    $modx =& $transport->xpdo;

    $map = $object['map'];

    if (!empty($map)) {
        foreach ($map as $uuid => $optionSetName) {
            /** @var FredElement $element */
            $element = $modx->getObject('FredElement', ['uuid' => $uuid]);
            if ($element) {
                $category = $element->getOne('Category');

                if ($category) {
                    $optionSet = $modx->getObject('FredElementOptionSet', ['name' => $optionSetName, 'theme' => $category->get('theme')]);
                    if ($optionSet) {
                        $element->set('option_set', $optionSet->id);
                        $element->save();
                    }
                }
            }
        }
    }
}
