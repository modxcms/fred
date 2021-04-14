<?php
namespace Fred\Processors\ThemedTemplates;
use Fred\Model\FredBlueprint;
use Fred\Model\FredTheme;
use Fred\Model\FredThemedTemplate;
use MODX\Revolution\modTemplate;
use MODX\Revolution\Processors\Model\GetListProcessor;
use xPDO\Om\xPDOQuery;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends GetListProcessor
{
    public $classKey = FredThemedTemplate::Class;
    public $languageTopics = ['fred:default'];
    public $defaultSortField = 'template';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.themed_templates';

    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->leftJoin(FredTheme::class, 'Theme');
        $c->leftJoin(modTemplate::class, 'Template');
        $c->leftJoin(FredBlueprint::class, 'Blueprint', 'FredThemedTemplate.default_blueprint = Blueprint.id');

        $c->select($this->modx->getSelectColumns(FredThemedTemplate::class, 'FredThemedTemplate'));
        $c->select($this->modx->getSelectColumns(FredTheme::class, 'Theme', 'theme_', ['name']));
        $c->select($this->modx->getSelectColumns(modTemplate::class, 'Template', 'template_', ['templatename']));
        $c->select($this->modx->getSelectColumns(FredBlueprint::class, 'Blueprint', 'default_blueprint_', ['name']));

        return parent::prepareQueryAfterCount($c);
    }
}
