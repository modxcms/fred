<?php

namespace Fred\v2\Elements\Event;

class OnTemplateRemove extends Event
{
    public function run()
    {
        /** @var \modTemplate $template */
        $templateId = $template->id;
        if (!empty($templateId)) {
            /** @var \FredThemedTemplate $themedTemplate */
            $themedTemplate = $this->modx->getObject('FredThemedTemplate', ['template' => $templateId]);
            if ($themedTemplate) {
                $themedTemplate->remove();
            }
        }
    }
}
