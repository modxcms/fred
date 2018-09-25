"use strict";

(function(){
    var jqver = '3.2.1',
        uiver = '1.12.1',

        lang = (function() {
            var locq = window.location.search,
                fullLang, locm, lang;
            if (locq && (locm = locq.match(/lang=([a-zA-Z_-]+)/))) {
                fullLang = locm[1];
            } else {
                fullLang = (navigator.browserLanguage || navigator.language || navigator.userLanguage);
            }
            lang = fullLang.substr(0,2);
            if (lang === 'ja') lang = 'jp';
            else if (lang === 'pt') lang = 'pt_BR';
            else if (lang === 'ug') lang = 'ug_CN';
            else if (lang === 'zh') lang = (fullLang.substr(0,5) === 'zh-TW')? 'zh_TW' : 'zh_CN';
            return lang;
        })(),

        opts = {
            cssAutoLoad : ['../vendor/elfinder-themes/material/css/theme-gray.css'],
            getFileCallback : function(file, fm) {
                if (parent.fredFinderOnChange && (typeof parent.fredFinderOnChange === 'function')) {
                    parent.fredFinderOnChange(file, fm);
                }
            },
            resizable : false,
            width : '100%',
            height : '100%',
            url : '../endpoints/elfinder.php' + location.search,
            lang: lang,
            uiOptions: {
                toolbar: [
                    ['home', 'back', 'forward', 'up', 'reload'],
                    ['mkdir', 'mkfile', 'upload'],
                    ['open', 'download', 'getfile'],
                    ['undo', 'redo'],
                    ['copy', 'cut', 'paste', 'rm', 'empty'],
                    ['duplicate', 'rename', 'edit', 'resize', 'chmod'],
                    ['selectall', 'selectnone', 'selectinvert'],
                    ['quicklook', 'info'],
                    ['search'],
                    ['view', 'sort']
                ]
            },
            contextmenu : {
                navbar : ['open', 'opennew', 'download', '|', 'upload', 'mkdir', '|', 'copy', 'cut', 'paste', 'duplicate', '|', 'rm', 'empty', '|', 'rename', '|', 'places', 'info', 'chmod', 'netunmount'],
                cwd    : ['undo', 'redo', '|', 'back', 'up', 'reload', '|', 'upload', 'mkdir', 'mkfile', 'paste', '|', 'empty', '|', 'view', 'sort', 'selectall', 'colwidth', '|', 'places', 'info', 'chmod', 'netunmount', '|', 'fullscreen', '|', 'preference'],
                files  : ['getfile', '|' ,'open', 'opennew', 'download', 'opendir', 'quicklook', '|', 'upload', 'mkdir', '|', 'copy', 'cut', 'paste', 'duplicate', '|', 'rm', 'empty', '|', 'rename', 'edit', 'resize', '|', 'selectall', 'selectinvert', '|', 'places', 'info', 'chmod', 'netunmount']
            },
        },

        start = function(elFinder) {
            elFinder.prototype.loadCss('//cdnjs.cloudflare.com/ajax/libs/jqueryui/'+uiver+'/themes/smoothness/jquery-ui.css');

            $(function() {
                if (window.Encoding && Encoding.convert) {
                    elFinder.prototype._options.rawStringDecoder = function(s) {
                        return Encoding.convert(s,{to:'UNICODE',type:'string'});
                    };
                }
                
                $('#elfinder').elfinder(opts).elfinder('instance').exec('fullscreen');
            });
        },

        
        load = function() {
            require(
                [
                    'elfinder',
                    (lang !== 'en')? 'elfinder.lang' : null
                ],
                start,
                function(error) {
                    alert(error.message);
                }
            );
        },

        ie8 = (typeof window.addEventListener === 'undefined' && typeof document.getElementsByClassName === 'undefined');

    require.config({
        baseUrl : '../vendor/elfinder/js',
        paths : {
            'jquery'   : '//cdnjs.cloudflare.com/ajax/libs/jquery/'+(ie8? '1.12.4' : jqver)+'/jquery.min',
            'jquery-ui': '//cdnjs.cloudflare.com/ajax/libs/jqueryui/'+uiver+'/jquery-ui.min',
            'elfinder' : 'elfinder.min',
            'elfinder.lang': [
                'i18n/elfinder.'+lang,
                'i18n/elfinder.fallback'
            ]
        },
        waitSeconds : 10
    });

    load();
})();
