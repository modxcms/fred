<?php
/**
 * @var xPDOTransport $transport
 */

$halt = false;
if ($options[xPDOTransport::PACKAGE_ACTION] === xPDOTransport::ACTION_UNINSTALL) {
    $modx =& $transport->xpdo;

    if (isset($object['installedTemplates']) && is_array($object['installedTemplates'])) {
        $modx->log(xPDO::LOG_LEVEL_INFO, '<hr>Checking if installed templates are not in use:');

        foreach ($object['installedTemplates'] as $templateName) {
            $template = $modx->getObject('modTemplate', ['templatename' => $templateName]);
            if ($template) {
                $templateInUse = $modx->getCount('modResource', ['template' => $template->get('id')]);
                if ($templateInUse > 0) {
                    $modx->log(xPDO::LOG_LEVEL_ERROR, " - {$templateName} ({$template->get('id')}) is still in use.");
                    $halt = true;
                } else {
                    $modx->log(xPDO::LOG_LEVEL_INFO, " - {$templateName} ({$template->get('id')}) is not in use.");
                }
            }
        }

        $modx->log(xPDO::LOG_LEVEL_INFO, '<br>');

        if ($halt === true) {
            $modx->log(xPDO::LOG_LEVEL_ERROR, 'Uninstall not allowed.');
            $modx->log(xPDO::LOG_LEVEL_ERROR, 'Please unassign all resources from theme\'s templates and try the uninstall again.');
        } else {
            $modx->log(xPDO::LOG_LEVEL_INFO, 'Uninstall allowed.');
        }

        $modx->log(xPDO::LOG_LEVEL_INFO, '<hr>');
    }
}

if ($halt === false) {
    $transport->setAttribute('uninstall_allowed', 'OK');
    return true;
}

return false;
