<?php

if ($object->xpdo) {
    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_UPGRADE:
            $corePath = $object->xpdo->getOption('core_path') . 'components/fred/';
            // check for conflict with guzzlehttp
            if (file_exists($corePath . 'vendor/guzzlehttp')) {
                // remove directory
                $dir = new RecursiveDirectoryIterator($corePath . 'vendor/guzzlehttp', RecursiveDirectoryIterator::SKIP_DOTS);
                $files = new RecursiveIteratorIterator($dir, RecursiveIteratorIterator::CHILD_FIRST);
                foreach ($files as $file) {
                    if ($file->isDir()) {
                        rmdir($file->getRealPath());
                    } else {
                        unlink($file->getRealPath());
                    }
                }
                rmdir($corePath . 'vendor/guzzlehttp');
            }
            break;
    }
}
return true;
