MODx.util.getHeaderBreadCrumbs = function(header, trail) {
    if (typeof header === 'string') {
        header = {
            id: header,
            xtype: 'modx-header'
        };
    }

    if (trail === undefined) trail = [];
    if (!Array.isArray(trail)) trail = [trail];

    return {
        xtype: 'modx-breadcrumbs-panel',
        id: 'modx-header-breadcrumbs',
        cls: 'modx-header-breadcrumbs',
        desc: '',
        bdMarkup: '<ul><tpl for="trail"><li>' +
            '<tpl if="href"><a href="{href}" class="{cls}">{text}</a></tpl>' +
            '<tpl if="!href">{text}</tpl>' +
            '</li></tpl></ul>',
        init: function() {
            this.tpl = new Ext.XTemplate(this.bdMarkup, {compiled: true});
        },
        trail: trail,
        listeners: {
            afterrender: function() {
                this.renderTrail();
            }
        },
        renderTrail: function () {
            this.tpl.overwrite(this.body.dom.lastElementChild, {trail: this.trail});
        },
        updateTrail: function(trail, replace) {
            if (replace === undefined) replace = false;

            if (replace === true) {
                this.trail = (Array.isArray(trail)) ? trail : [trail];
                this.renderTrail();
                return true;
            }

            if (Array.isArray(trail)) {
                for (var i = 0; i < trail.length; i++) {
                    this.trail.push(trail[i]);
                }

                this.renderTrail();
                return true;
            }

            this.trail.push(trail);
            this.renderTrail();
            return true;
        },
        updateHeader: function(text) {
            if (!this.rendered) {
                Ext.getCmp(header.id).html = text;
                return;
            }

            Ext.getCmp(header.id).getEl().update(text);
        },
        items: [header]
    };
};
