<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

$corePath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
/** @var Fred $fred */
$fred = $modx->getService(
    'fred',
    'Fred',
    $corePath . 'model/fred/',
    array(
        'core_path' => $corePath
    )
);

switch ($modx->event->name) {
    case 'OnDocFormPrerender':
        if(!empty($resource) && !empty($fred->getTheme($resource->template))) {
            //Disable ContentBlocks
            $isContentBlocks = $resource->getProperty('_isContentBlocks', 'contentblocks', null);
            if($isContentBlocks !== false){
                $resource->setProperty('_isContentBlocks', false, 'contentblocks');
                $resource->save();
            }

            $data = $resource->getProperty('data', 'fred');
            $fingerprint = !empty($data['fingerprint']) ? $data['fingerprint'] : '';
            
            //Load Open in Fred button
            $modx->lexicon->load('fred:default');
            $modx->controller->addLexiconTopic('fred:default');
            $modx->controller->addHtml("
        <script>
            Ext.ComponentMgr.onAvailable('modx-resource-content', function(right) {
                right.on('beforerender', function() {
                    var content = Ext.getCmp('ta'),
                    contentvalue = content.getValue(),
                    panel = Ext.getCmp('modx-page-update-resource'); 
                    
                    content.destroy();
                     
                    right.insert(0,{
                        xtype: 'button' 
                        ,fieldLabel: _('fred.open_in_fred')
                        ,hideLabel: true
                        ,cls: 'primary-button'
                        ,style: {padding: '10px 15px'}
                        ,html: _('fred.open_in_fred')
                        ,handler: function(){
                            window.open(panel.config.preview_url)
                        }
                    });
                     
                    right.insert(1,{
                        xtype: 'textarea' 
                        ,hideLabel: true
                        ,anchor: '100%'
                        ,grow: true
                        ,style: {marginTop:'15px'}
                        ,disabled: true
                        ,value: contentvalue
                    });
                });
                
                right.on('afterrender', function() {
                    var panel = Ext.getCmp('modx-panel-resource');
                    
                    panel.on('success', function(){
                        location.reload();
                    });
                    
                    var fingerprint = document.createElement('input');
                    fingerprint.setAttribute('type', 'hidden');
                    fingerprint.setAttribute('name', 'fingerprint');
                    fingerprint.setAttribute('value', '" . $fingerprint . "');
                    panel.form.el.dom.appendChild(fingerprint);
                });
            });
            
        </script>");
        }
        break;
    case 'OnLoadWebDocument':
        $theme = $fred->getTheme($modx->resource->template);
        if (!empty($theme)) {
            $themeUri = $theme->getThemeFolderUri();
            $modx->setPlaceholder('+fred.theme_dir', $themeUri);
            $modx->setOption('fred.theme_dir', $themeUri);
        }
        break;
    case 'OnWebPagePrerender':
        $theme = $fred->getTheme($modx->resource->template);
        if (!empty($theme)) {
            if (isset($_GET['fred'])) {
                if (intval($_GET['fred']) === 0) return;
            }
            
            if (!$modx->user) return;
            if (!($modx->user->hasSessionContext('mgr') || $modx->user->hasSessionContext($modx->resource->context_key))) return;
            if (!$modx->hasPermission('fred')) return;


            if (isset($_GET['fred'])) {
                if (intval($_GET['fred']) === 3) {
                    $modx->resource->_output = '';
                    return;
                }
            }
        
            $html = Wa72\HtmlPageDom\HtmlPageCrawler::create($modx->resource->_output);
            $dzs = $html->filter('[data-fred-dropzone]');

            $dzs->each(function(Wa72\HtmlPageDom\HtmlPageCrawler $node, $i)  {
                $node->setInnerHtml('');
            });
            
            $modx->resource->_output = $html->saveHTML();
            
            if (isset($_GET['fred'])) {
                if (intval($_GET['fred']) === 2) return;
            }
            
            $scripts = $html->filter('script');
            $scripts->each(function(Wa72\HtmlPageDom\HtmlPageCrawler $node, $i)  {
                $newNode = Wa72\HtmlPageDom\HtmlPageCrawler::create('<script-fred></script-fred>');
                
                $attrs = $node->getNode(0)->attributes;

                foreach ($attrs as $attr) {
                    $newNode->attr($attr->nodeName, $attr->nodeValue);
                }
                
                $newNode->setAttribute('data-fred-script', $node->getInnerHtml());
                
                $node->replaceWith($newNode);
                
            });

            $modx->resource->_output = $html->saveHTML();
            
            $beforeRenderResults = $modx->invokeEvent('FredBeforeRender');
            $includes = '';
            $beforeRender = '';
            $lexicons = [];
            foreach ($beforeRenderResults as $result) {
                
                if ($result['includes']) {
                    $includes .= $result['includes'];
                }
                
                if ($result['beforeRender']) {
                    $beforeRender .= $result['beforeRender'];
                }
                
                if ($result['lexicons'] && is_array($result['lexicons'])) {
                    $lexicons = array_merge($lexicons, $result['lexicons']);
                }
            }
            
            /** @var FredElementRTEConfig[] $rteConfigs */
            $rteConfigs = $modx->getIterator('FredElementRTEConfig');
            $rteConfigString = [];
            
            foreach ($rteConfigs as $rteConfig) {
                if (empty($rteConfig->get('data'))) continue;
                
                $rteConfigString[] = $rteConfig->name . ':' . $rteConfig->data;
            }

            $rteConfigString = implode(',', $rteConfigString);

            $payload = [
                'iss' => $modx->user->id,
                'resource' => $modx->resource->id
            ];
            
            $jwt = \Firebase\JWT\JWT::encode($payload, $fred->getSecret());
            
            $fredContent = '
        <script type="text/javascript" src="' . $fred->getOption('webAssetsUrl') . 'fred.min.js"></script>
        <link rel="stylesheet" href="' . $fred->getOption('webAssetsUrl') . 'fred.css" type="text/css" />
        ' . $includes . '
        <script>
            var fred = new Fred({
                theme: ' . $theme->id . ',
                assetsUrl: "' . $fred->getOption('webAssetsUrl') . '",
                managerUrl: "' . MODX_MANAGER_URL . '",
                contextKey: "' . $modx->resource->context_key. '",
                launcherPosition: "' . $fred->getOption('launcher_position') . '",
                iconEditor: "' . $fred->getOption('icon_editor') . '",
                imageEditor: "' . $fred->getOption('image_editor') . '",
                rte: "' . $fred->getOption('rte') . '",
                rteConfig: {' . $rteConfigString . '},
                jwt: "' . $jwt . '",
                resource: {
                    "id": ' . $modx->resource->id . ',
                    "previewUrl": "' . str_replace('&amp;', '&', $modx->makeUrl($modx->resource->id, '', ['fred' => 2] , 'abs')) . '",
                    "emptyUrl": "' . str_replace('&amp;', '&', $modx->makeUrl($modx->resource->id, '', ['fred' => 3] , 'abs')) . '",
                },
                permission: {
                    "fred_settings": ' . (int)$modx->hasPermission('fred_settings') . ',
                    "fred_settings_advanced": ' . (int)$modx->hasPermission('fred_settings_advanced') . ',
                    "fred_settings_tags": ' . (int)$modx->hasPermission('fred_settings_tags') . ',
                    "fred_settings_tvs": ' . (int)$modx->hasPermission('fred_settings_tvs') . ',
                    "fred_elements": ' . (int)$modx->hasPermission('fred_elements') . ',
                    "fred_blueprints": ' . (int)$modx->hasPermission('fred_blueprints') . ',
                    "fred_element_screenshot": ' . (int)$modx->hasPermission('fred_element_screenshot') . ',
                    "fred_element_move": ' . (int)$modx->hasPermission('fred_element_move') . ',
                    "fred_element_delete": ' . (int)$modx->hasPermission('fred_element_delete') . ',
                    "fred_blueprint_categories_save": ' . (int)$modx->hasPermission('fred_blueprint_categories_save') . ',
                    "fred_blueprint_categories_create_public": ' . (int)$modx->hasPermission('fred_blueprint_categories_create_public') . ',
                    "fred_blueprints_save": ' . (int)$modx->hasPermission('fred_blueprints_save') . ',
                
                    "save_document": ' . (int)($modx->hasPermission('save_document') && $modx->resource->checkPolicy('save')) . ',
                    "delete_document" : ' . (int)($modx->hasPermission('delete_document') && $modx->resource->checkPolicy('delete')) . ',
                    "undelete_document" : ' . (int)($modx->hasPermission('undelete_document') && $modx->resource->checkPolicy('undelete')) . ',
                    "publish_document" : ' . (int)($modx->hasPermission('publish_document') && $modx->resource->checkPolicy('publish')) . ',
                    "unpublish_document" : ' . (int)($modx->hasPermission('unpublish_document') && $modx->resource->checkPolicy('unpublish')) . ',
                
                    "new_document" : ' . (int)$modx->hasPermission('new_document') . ',
                    "resource_duplicate" : ' . (int)($modx->hasPermission('resource_duplicate') &&  $modx->resource->checkPolicy('save')) . ',
                    "new_document_in_root" : ' . (int)$modx->hasPermission('new_document_in_root') . '
                },
                lexicons: ' . json_encode($lexicons) . ',
                beforeRender: function() {
                    ' . $beforeRender . '
                }
            });
        </script>';

            $modx->resource->_output = preg_replace('/(<\/head>(?:<\/head>)?)/i', "{$fredContent}\r\n$1", $modx->resource->_output);
        }
        break;
    case 'OnBeforeDocFormSave':
        if ($mode !== 'upd') return;

        if (empty($fred->getTheme($resource->template))) return;
        
        $data = $resource->getProperty('data', 'fred');
        if (!empty($data['fingerprint'])) {
            if (empty($resource->fingerprint)) {
                $modx->event->_output = 'No fingerprint was provided.';
                return;
            }

            if ($data['fingerprint'] !== $resource->fingerprint) {
                $modx->event->_output = 'Your page is outdated, please reload the page.'; 
                return;
            }
        }
        
        break;
    case 'OnDocFormSave':
        if ($mode !== 'upd') return;

        if (empty($fred->getTheme($resource->template))) return;
        
        $renderResource = new \Fred\RenderResource($resource, $modx);
        $renderResource->render();
        
        break;
    case 'OnTemplateRemove':
        /** @var modTemplate $template */
        $templateId = $template->id;
        if (!empty($templateId)) {
            /** @var FredThemedTemplate $themedTemplate */
            $themedTemplate = $modx->getObject('FredThemedTemplate', ['template' => $templateId]);
            if ($themedTemplate) {
                $themedTemplate->remove();
            }
        } 
        
        break;
}

return;