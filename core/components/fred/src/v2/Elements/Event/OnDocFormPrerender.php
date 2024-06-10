<?php

namespace Fred\v2\Elements\Event;

class OnDocFormPrerender extends Event
{
    public function run()
    {
        $resource = $this->sp['resource'] ?? null;
        if (!$resource) {
            return;
        }
        if (!empty($resource) && !empty($this->fred->getTheme($resource->template))) {
            if (in_array($resource->class_key, $this->disabledClassKeys)) {
                return;
            }

            //Disable ContentBlocks
            $isContentBlocks = $resource->getProperty('_isContentBlocks', 'contentblocks', null);
            if ($isContentBlocks !== false) {
                $resource->setProperty('_isContentBlocks', false, 'contentblocks');
                $resource->save();
            }

            $data = $resource->getProperty('data', 'fred');
            $fingerprint = !empty($data['fingerprint']) ? $data['fingerprint'] : '';

            //Load Open in Fred button
            $this->modx->lexicon->load('fred:default');
            $this->modx->controller->addLexiconTopic('fred:default');
            $this->modx->controller->addHtml("
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
    }
}
