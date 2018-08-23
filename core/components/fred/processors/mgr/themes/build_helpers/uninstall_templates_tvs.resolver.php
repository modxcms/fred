<?php
/**
 * @var xPDOTransport $transport
 */

if ($options[xPDOTransport::PACKAGE_ACTION] === xPDOTransport::ACTION_UNINSTALL) {
    $modx =& $transport->xpdo;
    
    if (isset($object['installedTemplates']) && is_array($object['installedTemplates'])) {
        foreach ($object['installedTemplates'] as $templateName) {
            $template = $modx->getObject('modTemplate', ['templatename' => $templateName]);
            if ($template) {
                $template->remove();
            }
        }
    }

    if (isset($object['installedTVs']) && is_array($object['installedTVs'])) {
        foreach ($object['installedTVs'] as $tvName) {
            $tv = $modx->getObject('modTemplateVar', ['name' => $tvName]);
            if ($tv) {
                $isLinked = $modx->getCount('modTemplateVarTemplate', ['tmplvarid' => $tv->get('id')]);
                
                if ($isLinked === 0) {
                    $tv->remove();
                }
            }
        }
    }
}

return true;