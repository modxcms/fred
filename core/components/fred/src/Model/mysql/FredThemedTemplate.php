<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredThemedTemplate extends \Fred\Model\FredThemedTemplate
{
    public static $metaMap = array (
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_themed_templates',
        'extends' => 'xPDO\\Om\\xPDOObject',
        'tableMeta' =>
        array (
            'engine' => 'InnoDB',
        ),
        'fields' =>
        array (
            'template' => null,
            'theme' => null,
            'default_blueprint' => 0,
        ),
        'fieldMeta' =>
        array (
            'template' =>
            array (
                'dbtype' => 'int',
                'attributes' => 'unsigned',
                'precision' => '10',
                'phptype' => 'integer',
                'null' => false,
                'index' => 'pk',
            ),
            'theme' =>
            array (
                'dbtype' => 'int',
                'attributes' => 'unsigned',
                'precision' => '10',
                'phptype' => 'integer',
                'null' => false,
            ),
            'default_blueprint' =>
            array (
                'dbtype' => 'int',
                'attributes' => 'unsigned',
                'precision' => '10',
                'phptype' => 'integer',
                'null' => false,
                'default' => 0,
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
                    'template' =>
                    array (
                        'length' => '',
                        'collation' => 'A',
                        'null' => false,
                    ),
                ),
            ),
            'theme' =>
            array (
                'alias' => 'theme',
                'primary' => false,
                'unique' => false,
                'type' => 'BTREE',
                'columns' =>
                array (
                    'theme' =>
                    array (
                        'length' => '',
                        'collation' => 'A',
                        'null' => false,
                    ),
                ),
            ),
        ),
        'composites' =>
        array (
            'ElementCategoryTemplatesAccess' =>
            array (
                'class' => 'Fred\\Model\\FredElementCategoryTemplateAccess',
                'local' => 'template',
                'foreign' => 'template',
                'cardinality' => 'many',
                'owner' => 'local',
            ),
        ),
        'aggregates' =>
        array (
            'Theme' =>
            array (
                'class' => 'Fred\\Model\\FredTheme',
                'local' => 'theme',
                'foreign' => 'id',
                'cardinality' => 'one',
                'owner' => 'foreign',
            ),
            'Template' =>
            array (
                'class' => 'MODX\\Revolution\\modTemplate',
                'local' => 'template',
                'foreign' => 'id',
                'cardinality' => 'one',
                'owner' => 'foreign',
            ),
        ),
    );
}
