<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredBlueprintTemplateAccess extends \Fred\Model\FredBlueprintTemplateAccess
{
    public static $metaMap = array (
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_blueprint_templates_access',
        'extends' => 'xPDO\\Om\\xPDOObject',
        'tableMeta' =>
        array (
            'engine' => 'InnoDB',
        ),
        'fields' =>
        array (
            'blueprint' => null,
            'template' => null,
        ),
        'fieldMeta' =>
        array (
            'blueprint' =>
            array (
                'dbtype' => 'int',
                'attributes' => 'unsigned',
                'precision' => '10',
                'phptype' => 'integer',
                'null' => false,
                'index' => 'pk',
            ),
            'template' =>
            array (
                'dbtype' => 'int',
                'attributes' => 'unsigned',
                'precision' => '10',
                'phptype' => 'integer',
                'null' => false,
                'index' => 'pk',
            ),
        ),
        'indexes' =>
        array (
            'PRIMARY' =>
            array (
                'alias' => 'PRIMARY',
                'primary' => true,
                'unique' => true,
                'type' => 'BTREE',
                'columns' =>
                array (
                    'blueprint' =>
                    array (
                        'length' => '',
                        'collation' => 'A',
                        'null' => false,
                    ),
                    'template' =>
                    array (
                        'length' => '',
                        'collation' => 'A',
                        'null' => false,
                    ),
                ),
            ),
        ),
        'aggregates' =>
        array (
            'Template' =>
            array (
                'class' => 'Fred\\Model\\FredThemedTemplate',
                'local' => 'template',
                'foreign' => 'template',
                'cardinality' => 'one',
                'owner' => 'foreign',
            ),
            'Blueprint' =>
            array (
                'class' => 'Fred\\Model\\FredBlueprint',
                'local' => 'blueprint',
                'foreign' => 'id',
                'cardinality' => 'one',
                'owner' => 'foreign',
            ),
        ),
    );
}
