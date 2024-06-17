<?php

namespace Fred\Traits\Elements\Event;

trait OnTemplateRemove
{
    public function run()
    {
        /** @var $template */
        $templateId = $template->id;
        if (!empty($templateId)) {
            /** @var $themedTemplate */
            $themedTemplate = $this->modx->getObject($this->themedTemplateClass, ['template' => $templateId]);
            if ($themedTemplate) {
                $themedTemplate->remove();
            }
        }
    }
}
