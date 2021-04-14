<?php
namespace Fred\Processors\Blueprints;
use Fred\Model\FredBlueprint;
use Fred\Model\FredBlueprintTemplateAccess;
use MODX\Revolution\Processors\Model\GetProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Get extends GetProcessor
{
    public $classKey = FredBlueprint::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprints';

    /** @var FredBlueprint $object */
    public $object;

    public function beforeOutput()
    {
        $templatesAccess = $this->modx->getIterator(FredBlueprintTemplateAccess::class, ['blueprint' => $this->object->id]);
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
