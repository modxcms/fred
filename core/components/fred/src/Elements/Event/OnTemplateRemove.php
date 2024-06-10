<?php

namespace Fred\Elements\Event;

use Fred\Model\FredThemedTemplate;
use MODX\Revolution\modTemplate;

class OnTemplateRemove extends Event
{
    public function run()
    {
        /** @var modTemplate $template */
        $templateId = $template->id;
        if (!empty($templateId)) {
            /** @var FredThemedTemplate $themedTemplate */
            $themedTemplate = $this->modx->getObject(FredThemedTemplate::class, ['template' => $templateId]);
            if ($themedTemplate) {
                $themedTemplate->remove();
            }
        }
    }
}
