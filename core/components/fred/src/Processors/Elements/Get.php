<?php
namespace Fred\Processors\Elements;
use Fred\Model\FredElement;
use Fred\Model\FredElementTemplateAccess;
use MODX\Revolution\Processors\Model\GetProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Get extends GetProcessor
{
    public $classKey = FredElement::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.elements';

    /** @var FredElement $object */
    public $object;

    public function beforeOutput()
    {
        $templatesAccess = $this->modx->getIterator(FredElementTemplateAccess::class, ['element' => $this->object->id]);
        $templates = [];
        foreach ($templatesAccess as $templateAccess) {
            $templates[] = $templateAccess->get('template');
        }

        $templates = join(',', $templates);
        $this->object->set('templates', $templates);

        $category = $this->object->Category;

        if ($category) {
            $theme = $category->Theme;

            if ($theme) {
                $this->object->set('theme', $theme->id);
                $this->object->set('theme_folder', $theme->theme_folder);
            }
        }

        return true;
    }
}
