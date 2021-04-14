<?php

use MODX\Revolution\modLexiconEntry;
use MODX\Revolution\modSystemSetting;
use xPDO\Transport\xPDOTransport;

if ($options[xPDOTransport::PACKAGE_ACTION] !== xPDOTransport::ACTION_UPGRADE) {
    $modx =& $transport->xpdo;

    $oldNamespace = $object['oldNamespace'];
    $newNamespace = $object['newNamespace'];

    $namespace = $modx->getObject('modNamespace', ['name' => $oldNamespace]);
    if ($namespace) {
        $modx->exec("UPDATE {$modx->getTableName('modNamespace')} SET name = '{$newNamespace}' WHERE name = '{$oldNamespace}'");

        /** @var modSystemSetting[] $settings */
        $settings = $modx->getIterator(modSystemSetting::class, ['namespace' => $oldNamespace]);
        foreach ($settings as $setting) {
            $setting->set('namespace', $newNamespace);
            $setting->save();
        }

        /** @var modLexiconEntry[] $lexicons */
        $lexicons = $modx->getIterator(modLexiconEntry::class, ['namespace' => $oldNamespace]);
        foreach ($lexicons as $lexicon) {
            $lexicon->set('namespace', $newNamespace);
            $lexicon->save();
        }
    }
}
