<?php

/**
 * @var xPDOTransport $transport
 */

$halt = false;
if ($options[xPDOTransport::PACKAGE_ACTION] === xPDOTransport::ACTION_UNINSTALL) {
    $modx =& $transport->xpdo;

    $packages = !empty($fileMeta['packages']) ? $fileMeta['packages'] : [];

    foreach ($packages as $package) {
        $componentName = empty($package['componentName']) ? $package['name'] : $package['componentName'];
        $modelName = empty($package['modelName']) ? $package['name'] : $package['modelName'];
        $settingPrefix = empty($package['settingPrefix']) ? $package['name'] : $package['settingPrefix'];

        $service = $modx->getService($package['name'], $package['class'], $modx->getOption($settingPrefix . '.core_path', null, $modx->getOption('core_path') . 'components/' . $componentName . '/') . 'model/' . $modelName . '/', []);
        if (!($service instanceof $package['class'])) {
            $halt = true;
            $modx->log(modX::LOG_LEVEL_ERROR, ' - Could not load ' . $package['name'] . ' service.');
            break;
        }
    }

    if (isset($object['installedTemplates']) && is_array($object['installedTemplates'])) {
        $modx->log(xPDO::LOG_LEVEL_INFO, '<hr>Checking if installed templates are not in use:');
        $unassignedTemplate = false;

        foreach ($object['installedTemplates'] as $templateName) {
            $template = $modx->getObject('modTemplate', ['templatename' => $templateName]);
            if ($template) {
                $templateInUse = $modx->getCount('modResource', ['template' => $template->get('id')]);
                if ($templateInUse > 0) {
                    $modx->log(xPDO::LOG_LEVEL_ERROR, " - {$templateName} ({$template->get('id')}) is still in use.");
                    $halt = true;
                    $unassignedTemplate = true;
                } else {
                    $modx->log(xPDO::LOG_LEVEL_INFO, " - {$templateName} ({$template->get('id')}) is not in use.");
                }
            }
        }

        if ($unassignedTemplate) {
            $modx->log(xPDO::LOG_LEVEL_ERROR, 'Please unassign all resources from theme\'s templates and try the uninstall again.');
        }
    }

    $modx->log(xPDO::LOG_LEVEL_INFO, '<br>');

    if ($halt === true) {
        $modx->log(xPDO::LOG_LEVEL_ERROR, 'Uninstall not allowed.');
    } else {
        $modx->log(xPDO::LOG_LEVEL_INFO, 'Uninstall allowed.');
    }

    $modx->log(xPDO::LOG_LEVEL_INFO, '<hr>');
}

if ($halt === false) {
    $transport->setAttribute('uninstall_allowed', 'OK');
    return true;
}

return false;
