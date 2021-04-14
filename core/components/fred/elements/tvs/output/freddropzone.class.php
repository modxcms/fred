<?php

use MODX\Revolution\modTemplateVarOutputRender;

if (!class_exists('FredDropZoneOutputRender')) {
    class FredDropZoneOutputRender extends modTemplateVarOutputRender
    {
        public function process($value, array $params = array())
        {
            return $value;
        }
    }
}

return 'FredDropZoneOutputRender';
