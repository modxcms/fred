<div id="tv-input-properties-form{$tv|default}"></div>
{literal}

<script type="text/javascript">
    // <![CDATA[
    var params = {
        {/literal}{foreach from=$params key=k item=v name='p'}
        '{$k}': '{$v|escape:"javascript"}'{if NOT $smarty.foreach.p.last},{/if}
        {/foreach}{literal}
    };
    var oc = {'change':{fn:function(){Ext.getCmp('modx-panel-tv').markDirty();},scope:this}};
    MODx.load({
        xtype: 'panel'
        ,layout: 'form'
        ,autoHeight: true
        ,cls: 'form-with-labels'
        ,labelAlign: 'top'
        ,border: false
        ,items: [{
            xtype: 'combo-boolean'
            ,fieldLabel: _('fred.tvs.dropzone.hide_input')
            ,name: 'inopt_hide_input'
            ,hiddenName: 'inopt_hide_input'
            ,id: 'inopt_hide_input{/literal}{$tv|default}{literal}'
            ,value: params['hide_input'] == 0 || params['hide_input'] == 'false' ? false : true
            ,width: 200
            ,listeners: oc
        }]
        ,renderTo: 'tv-input-properties-form{/literal}{$tv|default}{literal}'
    });
    // ]]>
</script>
{/literal}
