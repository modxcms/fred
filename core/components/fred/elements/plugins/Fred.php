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
            
            $beforeRenderResults = $modx->invokeEvent('FredBeforeRender');
            $includes = '';
            $beforeRender = '';
            foreach ($beforeRenderResults as $result) {
                
                if ($result['includes']) {
                    $includes .= $result['includes'];
                }
                
                if ($result['beforeRender']) {
                    $beforeRender .= $result['beforeRender'];
                }
            }
            
            $fredContent = '
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.7.9/tinymce.min.js"></script>
        <script type="text/javascript" src="' . $fred->getOption('webAssetsUrl') . 'fred.min.js"></script>
        <link rel="stylesheet" href="' . $fred->getOption('webAssetsUrl') . 'fred.css" type="text/css" />
        ' . $includes . '
        <script>
            var fred = new Fred({
                assetsUrl: "' . $fred->getOption('webAssetsUrl') . '",
                launcherPosition: "' . $fred->getOption('launcher_position') . '",
                iconEditor: "' . $fred->getOption('icon_editor') . '",
                imageEditor: "' . $fred->getOption('image_editor') . '",
                resource: {
                    "id": ' . $modx->resource->id . '
                },
                beforeRender: function() {
                    ' . $beforeRender . '
                }
            });
        </script>';

            $modx->resource->_output = preg_replace('/(<\/head>(?:<\/head>)?)/i', "{$fredContent}\r\n$1", $modx->resource->_output);
        }
        break;
}

return;