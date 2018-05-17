<?php
$templates = $modx->getOption('fred.template_ids');
$templates = explode(',', $templates);

switch ($modx->event->name) {
    case 'OnDocFormPrerender':
        $templates =  array_map('intval', $templates);
        if(!empty($resource) && in_array($resource->template,$templates)){
            //Disable ContentBlocks
            $isContentBlocks = $resource->getProperty('_isContentBlocks', 'contentblocks', null);
            if($isContentBlocks !== false){
                $resource->setProperty('_isContentBlocks', false, 'contentblocks');
                $resource->save();
            }
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
                })
            });
            
        </script>");
        }
        break;
    case 'OnWebPagePrerender':
        $templates = array_map('trim', $templates);
        $templates = array_flip($templates);
        if (isset($templates[$modx->resource->template])) {
            if (isset($_GET['fred'])) {
                if (intval($_GET['fred']) === 0) return;
            }
            
            if (!$modx->user) return;
            if (!($modx->user->hasSessionContext('mgr') || $modx->user->hasSessionContext($modx->resource->context_key))) return;
            if ($modx->user->sudo !== 1) return;


            if (isset($_GET['fred'])) {
                if (intval($_GET['fred']) === 3) {
                    $modx->resource->_output = '';
                    return;
                }
            }
            
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

        
            $html = Wa72\HtmlPageDom\HtmlPageCrawler::create($modx->resource->_output);
            $dzs = $html->filter('[data-fred-dropzone]');

            $dzs->each(function(Wa72\HtmlPageDom\HtmlPageCrawler $node, $i)  {
                $node->setInnerHtml('');
            });
            
            $modx->resource->_output = $html->saveHTML();
            
            if (isset($_GET['fred'])) {
                if (intval($_GET['fred']) === 2) return;
            }
            
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
            
            $fredContent = '
        <script type="text/javascript" src="' . $fred->getOption('webAssetsUrl') . 'fred.min.js"></script>
        <link rel="stylesheet" href="' . $fred->getOption('webAssetsUrl') . 'fred.css" type="text/css" />
        ' . $includes . '
        <script>
            var fred = new Fred({
                assetsUrl: "' . $fred->getOption('webAssetsUrl') . '",
                launcherPosition: "' . $fred->getOption('launcher_position') . '",
                iconEditor: "' . $fred->getOption('icon_editor') . '",
                imageEditor: "' . $fred->getOption('image_editor') . '",
                rte: "' . $fred->getOption('rte') . '",
                resource: {
                    "id": ' . $modx->resource->id . ',
                    "previewUrl": "' . str_replace('&amp;', '&', $modx->makeUrl($modx->resource->id, '', ['fred' => 2] , 'abs')) . '",
                    "emptyUrl": "' . str_replace('&amp;', '&', $modx->makeUrl($modx->resource->id, '', ['fred' => 3] , 'abs')) . '",
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
    case 'OnDocFormSave':
        if ($mode !== 'upd') return;

        $templates = array_map('trim', $templates);
        $templates = array_flip($templates);
        if (!isset($templates[$resource->template])) return;
        
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

        $renderResource = new \Fred\RenderResource($resource, $modx);
        $renderResource->render();
        
        break;
}

return;