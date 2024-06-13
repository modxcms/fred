<?php

// use MODX\Revolution\modTemplateVarInputRender;

if (!class_exists('FredDropZoneInputRender')) {
    class FredDropZoneInputRender extends \modTemplateVarInputRender
    {
        public function getTemplate()
        {
            $corePath = $this->modx->getOption('fred.core_path', null, $this->modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');

            return $corePath . 'elements/tvs/input/tpl/freddropzone.render.tpl';
        }

        public function process($value, array $params = [])
        {
        }

        public function getLexiconTopics()
        {
            return ['fred:default'];
        }
    }
}
return 'FredDropZoneInputRender';
