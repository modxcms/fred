<?php

namespace Fred\Traits\Elements\Event;

use Firebase\JWT\JWT;
use Wa72\HtmlPageDom\HtmlPageCrawler;

trait OnWebPagePrerender
{
    public function run()
    {
        $theme = $this->fred->getTheme($this->modx->resource->template);
        if (!empty($theme)) {
            if (!$this->modx->user) {
                return;
            }
            if (!($this->modx->user->hasSessionContext('mgr') || $this->modx->user->hasSessionContext($this->modx->resource->context_key))) {
                return;
            }
            if (!$this->modx->hasPermission('fred')) {
                return;
            }

            // Additional check to load unrender resource class key
            $checkSym = $this->modx->getObject('modResource', $this->modx->resource->id);
            if (in_array($checkSym->class_key, $this->disabledClassKeys)) {
                return;
            }

            $this->modx->lexicon->load('fred:fe');

            $fredMode = 1;

            if (isset($_SESSION['fred'])) {
                $fredMode = intval($_SESSION['fred']);
            }

            if (isset($_GET['fred'])) {
                $fredMode = intval($_GET['fred']);
            }

            if ($fredMode === 4) {
                $fredMode = 0;
                $_SESSION['fred'] = 0;
            }

            if ($fredMode === 1) {
                $_SESSION['fred'] = 1;
            }

            $get = $_GET;
            unset($get[$this->modx->getOption('request_param_alias', [], 'q')]);

            if ($fredMode === 0) {
                $button = "<a href=\"" . str_replace('&amp;', '&', $this->modx->makeUrl($this->modx->resource->id, '', array_merge($get, ['fred' => 1]), 'full')) . "\" title=\"" . $this->modx->lexicon('fred.fe.turn_on_fred') . "\" role=\"button\" style=\"display: block; text-decoration: none; background-color: #4D4D4D; background-image: url(&quot;data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='-14.584 -8.583 48 48'%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='2164.318' y1='-2519.043' x2='2047.448' y2='-2442.941' gradientTransform='matrix(.1471 0 0 -.1471 -290.574 -365.794)'%3E%3Cstop offset='0' stop-color='%2380c3e6'/%3E%3Cstop offset='1' stop-color='%233380c2'/%3E%3C/linearGradient%3E%3Cpath fill='url(%23a)' d='M22.035 11.468l9.602-15.406H8.488L5.236 1.17z'/%3E%3Cpath opacity='.15' d='M5.236 1.17l1.702-2.633 15.097 12.931z'/%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='2184.769' y1='-2694.977' x2='2097.394' y2='-2637.275' gradientTransform='matrix(.1471 0 0 -.1471 -290.574 -365.794)'%3E%3Cstop offset='0' stop-color='%23f38649'/%3E%3Cstop offset='.185' stop-color='%23f28147'/%3E%3Cstop offset='.409' stop-color='%23ef7242'/%3E%3Cstop offset='.654' stop-color='%23ea5a3a'/%3E%3Cstop offset='.911' stop-color='%23e4382e'/%3E%3Cstop offset='1' stop-color='%23e12a29'/%3E%3C/linearGradient%3E%3Cpath fill='url(%23b)' d='M27.068 39.416V16.268l-4.957-3.176L11.583 29.74z'/%3E%3Cpath opacity='.15' d='M11.583 29.74l2.632 1.625 7.896-18.273z'/%3E%3ClinearGradient id='c' gradientUnits='userSpaceOnUse' x1='1896.918' y1='-2571.592' x2='2064.08' y2='-2467.137' gradientTransform='matrix(.1471 0 0 -.1471 -290.574 -365.794)'%3E%3Cstop offset='0' stop-color='%2342ab4a'/%3E%3Cstop offset='1' stop-color='%23add155'/%3E%3C/linearGradient%3E%3Cpath fill='url(%23c)' d='M-10.25-8.583v23.148l5.419 3.175 26.866-6.272z'/%3E%3ClinearGradient id='d' gradientUnits='userSpaceOnUse' x1='1933.576' y1='-2758.292' x2='2069.413' y2='-2540.907' gradientTransform='matrix(.1471 0 0 -.1471 -290.574 -365.794)'%3E%3Cstop offset='0' stop-color='%2342ab4a'/%3E%3Cstop offset='1' stop-color='%23add155'/%3E%3C/linearGradient%3E%3Cpath fill='url(%23d)' d='M-4.985 19.52l-9.599 15.093H8.565l13.546-21.521z'/%3E%3C/svg%3E&quot;); height: 48px; width: 48px; border-radius: 50%; outline: 0; border: none; background-repeat: no-repeat; background-size: 60%; background-position: center; box-shadow: rgba(18,55,100,0.34) 0 4px 8px; margin: 0; padding: 0; text-indent: -9999px; cursor: pointer; position: fixed; z-index: 10010; margin: 32px; bottom: 0; left: 0; opacity: 0.8; transition: .3s; box-sizing: border-box;\" onmouseover=\"this.style.transform='scale(1.05)';\" onmouseout=\"this.style.transform='initial'\";>Fred</a>";

                $this->modx->resource->_output = preg_replace('/(<\/body>(?:<\/body>)?)/i', "{$button}\r\n$1", $this->modx->resource->_output);
                return;
            }

            if ($fredMode === 3) {
                $this->modx->resource->_output = '';
                return;
            }

            if ($fredMode === 5) {
                return;
            }

            $html = HtmlPageCrawler::create($this->modx->resource->_output);
            $dzs = $html->filter('[data-fred-dropzone]');

            $dzs->each(function (HtmlPageCrawler $node, $i) {
                $node->setInnerHtml('');
            });

            $this->modx->resource->_output = $html->saveHTML();

            if ($fredMode === 2) {
                return;
            }

            $htmlTag = $html->filter('html');
            $fredActiveClass = $this->modx->getOption('fred.active_class');

            if (!empty($fredActiveClass)) {
                $htmlTag->addClass($fredActiveClass);
            }

            $scripts = $html->filter('script');
            $scripts->each(function (HtmlPageCrawler $node, $i) {
                $newNode = HtmlPageCrawler::create('<script-fred></script-fred>');

                $attrs = $node->getNode(0)->attributes;

                foreach ($attrs as $attr) {
                    $newNode->setAttribute($attr->nodeName, $attr->nodeValue);
                }

                $newNode->setAttribute('data-fred-script', $node->getInnerHtml());

                $node->replaceWith($newNode);
            });

            $this->modx->resource->_output = $html->saveHTML();

            $beforeRenderResults = $this->modx->invokeEvent('FredBeforeRender');
            $includes = '';
            $beforeRender = '';
            $modifyPermissions = '';
            $lexicons = [];
            foreach ($beforeRenderResults as $result) {
                if (!is_array($result)) {
                    continue;
                }

                if (isset($result['includes'])) {
                    $includes .= $result['includes'];
                }

                if (isset($result['beforeRender'])) {
                    $beforeRender .= $result['beforeRender'];
                }

                if (isset($result['modifyPermissions'])) {
                    $modifyPermissions .= $result['modifyPermissions'];
                }

                if (isset($result['lexicons']) && is_array($result['lexicons'])) {
                    $lexicons = array_merge($lexicons, $result['lexicons']);
                }
            }

            $rteConfigs = $this->modx->getIterator($this->elementRTEConfigClass);
            $rteConfigString = [];

            foreach ($rteConfigs as $rteConfig) {
                if (empty($rteConfig->get('data'))) {
                    continue;
                }

                $rteConfigString[$rteConfig->name] = $rteConfig->get('data');
            }

            $rteConfigString = json_encode($rteConfigString);

            $payload = [
                'iss' => $this->modx->user->id,
                'resource' => $this->modx->resource->id,
                'template' => $this->modx->resource->template,
                'theme' => $theme->id,
                'context' => $this->modx->resource->context_key,
                'queryParams' => $_GET,
                'postParams' => $_POST,
                'cookie' => $_COOKIE,
                'requestParams' => $_REQUEST
            ];

            $jwt = JWT::encode($payload, $this->fred->getSecret(), 'HS256');

            $versionHash = substr(md5($this->fredClass::VERSION), 0, 6);
            if (!$this->modx->version) {
                $this->modx->getVersionData();
            }
            $version = (int)$this->modx->version['version'];
            $fredContent = '
        <script type="text/javascript" src="' . $this->fred->getOption('webAssetsUrl') . 'fred.min.js?v=' . $versionHash . '"></script>
        <link rel="stylesheet" href="' . $this->fred->getOption('webAssetsUrl') . 'fred.css?v=' . $versionHash . '" type="text/css" />
        ' . $includes . '
        <script>
            var fred = new Fred({
                theme: ' . $theme->id . ',
                themeDir: "' . $theme->getThemeFolderUri() . '",
                themeNamespace: "' . $theme->get('namespace') . '",
                themeSettingsPrefix: "' . $theme->get('settingsPrefix') . '",
                themeSettings: ' . json_encode($theme->getSettings()) . ',
                assetsUrl: "' . $this->fred->getOption('webAssetsUrl') . '",
                managerUrl: "' . MODX_MANAGER_URL . '",
                fredOffUrl: "' . str_replace('&amp;', '&', $this->modx->makeUrl($this->modx->resource->id, '', array_merge($get, ['fred' => 4]), 'full')) . '",
                logoutUrl: "' . $this->fred->getOption('logout_url') . '",
                contextKey: "' . $this->modx->resource->context_key . '",
                launcherPosition: "' . $this->fred->getOption('launcher_position') . '",
                iconEditor: "' . $this->fred->getOption('icon_editor') . '",
                imageEditor: "' . $this->fred->getOption('image_editor') . '",
                sidebarOpen: ' . (int)$this->fred->getOption('sidebar_open') . ',
                forceSidebar: ' . (int)$this->fred->getOption('force_sidebar') . ',
                rte: "' . $this->fred->getOption('rte') . '",
                rteConfig: ' . $rteConfigString . ',
                modxVersion: ' . $version . ',
                jwt: "' . $jwt . '",
                resource: {
                    "id": ' . $this->modx->resource->id . ',
                    "parent": ' . $this->modx->resource->parent . ',
                    "previewUrl": "' . str_replace('&amp;', '&', $this->modx->makeUrl($this->modx->resource->id, '', array_merge($get, ['fred' => 2]), 'full')) . '",
                    "emptyUrl": "' . str_replace('&amp;', '&', $this->modx->makeUrl($this->modx->resource->id, '', array_merge($get, ['fred' => 3]), 'full')) . '",
                    "save": ' . (int)$this->modx->resource->checkPolicy('save') . ',
                    "delete": ' . (int)$this->modx->resource->checkPolicy('delete') . ',
                    "undelete": ' . (int)$this->modx->resource->checkPolicy('undelete') . ',
                    "publish": ' . (int)$this->modx->resource->checkPolicy('publish') . ',
                    "unpublish": ' . (int)$this->modx->resource->checkPolicy('unpublish') . ',
                },
                permission: {
                    "fred_settings": ' . (int)$this->modx->hasPermission('fred_settings') . ',
                    "fred_settings_advanced": ' . (int)$this->modx->hasPermission('fred_settings_advanced') . ',
                    "fred_settings_tags": ' . (int)$this->modx->hasPermission('fred_settings_tags') . ',
                    "fred_settings_tvs": ' . (int)$this->modx->hasPermission('fred_settings_tvs') . ',
                    "fred_elements": ' . (int)$this->modx->hasPermission('fred_elements') . ',
                    "fred_element_cache_refresh": ' . (int)$this->modx->hasPermission('fred_element_cache_refresh') . ',
                    "fred_blueprints": ' . (int)$this->modx->hasPermission('fred_blueprints') . ',
                    "fred_element_screenshot": ' . (int)$this->modx->hasPermission('fred_element_screenshot') . ',
                    "fred_element_move": ' . (int)$this->modx->hasPermission('fred_element_move') . ',
                    "fred_element_front_end_delete": ' . (int)$this->modx->hasPermission('fred_element_front_end_delete') . ',
                    "fred_blueprint_categories_save": ' . (int)$this->modx->hasPermission('fred_blueprint_categories_save') . ',
                    "fred_blueprint_categories_create_public": ' . (int)$this->modx->hasPermission('fred_blueprint_categories_create_public') . ',
                    "fred_blueprints_save": ' . (int)$this->modx->hasPermission('fred_blueprints_save') . ',
                    "fred_blueprints_create_public": ' . (int)$this->modx->hasPermission('fred_blueprints_create_public') . ',

                    "frames": ' . (int)$this->modx->hasPermission('frames') . ',
                    "save_document": ' . (int)$this->modx->hasPermission('save_document') . ',
                    "delete_document" : ' . (int)$this->modx->hasPermission('delete_document') . ',
                    "undelete_document" : ' . (int)$this->modx->hasPermission('undelete_document') . ',
                    "publish_document" : ' . (int)$this->modx->hasPermission('publish_document') . ',
                    "unpublish_document" : ' . (int)$this->modx->hasPermission('unpublish_document') . ',
                    "new_document" : ' . (int)$this->modx->hasPermission('new_document') . ',
                    "resource_duplicate" : ' . (int)$this->modx->hasPermission('resource_duplicate') . ',
                    "new_document_in_root" : ' . (int)$this->modx->hasPermission('new_document_in_root') . '
                },
                lexicons: ' . json_encode($lexicons) . ',
                beforeRender: function() {
                    ' . $beforeRender . '
                },
                modifyPermissions: function(permissions) {
                    ' . $modifyPermissions . '

                    return permissions;
                }
            });
        </script>';

            $this->modx->resource->_output = preg_replace('/(<\/head>(?:<\/head>)?)/i', "{$fredContent}\r\n$1", $this->modx->resource->_output);
        }
    }
}
