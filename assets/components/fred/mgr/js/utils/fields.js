fred.field.JSONField = function (config) {
    config = config || {
        name: 'data',
    };

    Ext.applyIf(config, {
        xtype: Ext.ComponentMgr.isRegistered('modx-texteditor') ? 'modx-texteditor' : 'textarea',
        mimeType: 'application/json',
        name: config.name ?? 'data',
        hideLabel: true,
        anchor: '100%',
        height: 400,
        grow: false,
        value: '',
        validator: function(str) {
            if (!str) return true;

            var noError = true;

            try {
                JSON.parse(str);
            } catch (e) {
                noError = e.message;
            }

            if ((this.xtype !== 'modx-texteditor') || (noError === true)) {
                return noError;
            }

            var annotations = this.editor.getSession().getAnnotations();
            var errorMsg = [];

            annotations.forEach(function(annotation){
                if (annotation.type === 'error') {
                    errorMsg.push(_('fred.err.invalid_json', {error: annotation.text, row: annotation.row, column: annotation.column}));
                }
            });

            if (errorMsg.length === 0) return true;

            return errorMsg.join('<br>');
        }
    });

    if (config.xtype === 'modx-texteditor') {
        config.validate = function(){
            if(this.disabled || this.validateValue(this.getValue())){
                this.clearInvalid();
                return true;
            }
            return false;
        };

        config.getErrors = function(value) {
            var errors = Ext.form.TextField.superclass.getErrors.apply(this, arguments);

            value = Ext.isDefined(value) ? value : this.getValue();

            if (Ext.isFunction(this.validator)) {
                var msg = this.validator(value);
                if (msg !== true) {
                    errors.push(msg);
                }
            }

            if (value.length < 1 || value === this.emptyText) {
                if (this.allowBlank) {
                    //if value is blank and allowBlank is true, there cannot be any additional errors
                    return errors;
                } else {
                    errors.push(this.blankText);
                }
            }

            if (!this.allowBlank && (value.length < 1 || value === this.emptyText)) { // if it's blank
                errors.push(this.blankText);
            }

            if (value.length < this.minLength) {
                errors.push(String.format(this.minLengthText, this.minLength));
            }

            if (value.length > this.maxLength) {
                errors.push(String.format(this.maxLengthText, this.maxLength));
            }

            if (this.vtype) {
                var vt = Ext.form.VTypes;
                if(!vt[this.vtype](value, this)){
                    errors.push(this.vtypeText || vt[this.vtype +'Text']);
                }
            }

            if (this.regex && !this.regex.test(value)) {
                errors.push(this.regexText);
            }

            return errors;
        };
    }

    return config;
};
