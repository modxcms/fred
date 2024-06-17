<?php

namespace Fred\v2\Processors\ThemedTemplates;

/**
 * @package fred
 * @subpackage processors
 */
class GetList extends \modObjectGetListProcessor
{
    public $classKey = 'FredThemedTemplate';
    public $languageTopics = ['fred:default'];
    public $defaultSortField = 'template';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'fred.themed_templates';

    public function prepareQueryAfterCount(\xPDOQuery $c)
    {
        $c->leftJoin('FredTheme', 'Theme');
        $c->leftJoin('modTemplate', 'Template');
        $c->leftJoin('FredBlueprint', 'Blueprint', 'FredThemedTemplate.default_blueprint = Blueprint.id');

        $c->select($this->modx->getSelectColumns('FredThemedTemplate', 'FredThemedTemplate'));
        $c->select($this->modx->getSelectColumns('FredTheme', 'Theme', 'theme_', ['name']));
        $c->select($this->modx->getSelectColumns('modTemplate', 'Template', 'template_', ['templatename']));
        $c->select($this->modx->getSelectColumns('FredBlueprint', 'Blueprint', 'default_blueprint_', ['name']));

        return parent::prepareQueryAfterCount($c);
    }
}
