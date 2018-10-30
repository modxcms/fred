<div id="tv{$tv->id}"></div>

<script type="text/javascript">
    // <![CDATA[
    {literal}
    Ext.onReady(function() {
        MODx.load({
            {/literal}
            xtype: {if $params.hide_input == 1 || $params.hide_input == 'true'}{literal}'hidden'{/literal}{else}{literal}'textarea'{/literal}{/if}
            ,renderTo: 'tv{$tv->id}'
            ,value: '{$tv->get('value')|escape:'javascript'}'
            ,height: 140
            ,width: '99%'
            ,disabled: true
            {literal}
        });
        {/literal}
        {if $params.hide_input == 1 || $params.hide_input == 'true'}
        document.getElementById('tv{$tv->id}-tr').querySelector('label').style.display = 'none';
        {/if}
        {literal}
    });
    {/literal}
    // ]]>
</script>
