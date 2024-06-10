<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredElementCategory extends \Fred\Model\FredElementCategory
{
    public static $metaMap = array (
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_element_categories',
        'tableMeta' =>
        array (
            'engine' => 'InnoDB',
        ),
        'fields' =>
        array (
            'name' => null,
            'uuid' => null,
            'rank' => 0,
            'theme' => null,
        ),
        'fieldMeta' =>
        array (
            'name' =>
            array (
                'dbtype' => 'varchar',
                'precision' => '127',
                'phptype' => 'string',
                'null' => false,
            ),
            'uuid' =>
            array (
                'dbtype' => 'varchar',
                'precision' => '36',
                'phptype' => 'string',
                'null' => false,
                'index' => 'unique',
            ),
            'rank' =>
            array (
                'dbtype' => 'int',
                'attributes' => 'unsigned',
                'precision' => '10',
                'phptype' => 'integer',
                'null' => false,
                'default' => 0,
            ),
            'theme' =>
            array (
                'dbtype' => 'int',
                'attributes' => 'unsigned',
                'precision' => '10',
                'phptype' => 'integer',
                'null' => false,
            ),
        ),
        'indexes' =>
        array (
            'uuid' =>
            array (
                'alias' => 'uuid',
                'primary' => false,
                'unique' => true,
                'type' => 'BTREE',
                'columns' =>
                array (
                    'uuid' =>
                    array (
                        'length' => '',
                        'collation' => 'A',
                        'null' => false,
                    ),
                ),
            ),
            'rank' =>
            array (
                'alias' => 'rank',
                'primary' => false,
                'unique' => false,
                'type' => 'BTREE',
                'columns' =>
                array (
                    'rank' =>
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
            'name_theme' =>
            array (
                'alias' => 'name_theme',
                'primary' => false,
                'unique' => true,
                'type' => 'BTREE',
                'columns' =>
                array (
                    'name' =>
                    array (
                        'length' => '',
                        'collation' => 'A',
                        'null' => false,
                    ),
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
            'Elements' =>
            array (
                'class' => 'Fred\\Model\\FredElement',
                'local' => 'id',
                'foreign' => 'category',
                'cardinality' => 'many',
                'owner' => 'local',
            ),
            'ElementCategoryTemplatesAccess' =>
            array (
                'class' => 'Fred\\Model\\FredElementCategoryTemplateAccess',
                'local' => 'id',
                'foreign' => 'category',
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
        ),
    );
}
