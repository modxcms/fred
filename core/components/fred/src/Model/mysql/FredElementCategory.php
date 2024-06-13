<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredElementCategory extends \Fred\Model\FredElementCategory
{
    public static $metaMap =  [
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_element_categories',
        'tableMeta' =>
         [
             'engine' => 'InnoDB',
         ],
        'fields' =>
         [
             'name' => null,
             'uuid' => null,
             'rank' => 0,
             'theme' => null,
         ],
        'fieldMeta' =>
         [
             'name' =>
             [
                 'dbtype' => 'varchar',
                 'precision' => '127',
                 'phptype' => 'string',
                 'null' => false,
             ],
             'uuid' =>
             [
                 'dbtype' => 'varchar',
                 'precision' => '36',
                 'phptype' => 'string',
                 'null' => false,
                 'index' => 'unique',
             ],
             'rank' =>
             [
                 'dbtype' => 'int',
                 'attributes' => 'unsigned',
                 'precision' => '10',
                 'phptype' => 'integer',
                 'null' => false,
                 'default' => 0,
             ],
             'theme' =>
             [
                 'dbtype' => 'int',
                 'attributes' => 'unsigned',
                 'precision' => '10',
                 'phptype' => 'integer',
                 'null' => false,
             ],
         ],
        'indexes' =>
         [
             'uuid' =>
             [
                 'alias' => 'uuid',
                 'primary' => false,
                 'unique' => true,
                 'type' => 'BTREE',
                 'columns' =>
                 [
                     'uuid' =>
                     [
                         'length' => '',
                         'collation' => 'A',
                         'null' => false,
                     ],
                 ],
             ],
             'rank' =>
             [
                 'alias' => 'rank',
                 'primary' => false,
                 'unique' => false,
                 'type' => 'BTREE',
                 'columns' =>
                 [
                     'rank' =>
                     [
                         'length' => '',
                         'collation' => 'A',
                         'null' => false,
                     ],
                 ],
             ],
             'theme' =>
             [
                 'alias' => 'theme',
                 'primary' => false,
                 'unique' => false,
                 'type' => 'BTREE',
                 'columns' =>
                 [
                     'theme' =>
                     [
                         'length' => '',
                         'collation' => 'A',
                         'null' => false,
                     ],
                 ],
             ],
             'name_theme' =>
             [
                 'alias' => 'name_theme',
                 'primary' => false,
                 'unique' => true,
                 'type' => 'BTREE',
                 'columns' =>
                 [
                     'name' =>
                     [
                         'length' => '',
                         'collation' => 'A',
                         'null' => false,
                     ],
                     'theme' =>
                     [
                         'length' => '',
                         'collation' => 'A',
                         'null' => false,
                     ],
                 ],
             ],
         ],
        'composites' =>
         [
             'Elements' =>
             [
                 'class' => 'Fred\\Model\\FredElement',
                 'local' => 'id',
                 'foreign' => 'category',
                 'cardinality' => 'many',
                 'owner' => 'local',
             ],
             'ElementCategoryTemplatesAccess' =>
             [
                 'class' => 'Fred\\Model\\FredElementCategoryTemplateAccess',
                 'local' => 'id',
                 'foreign' => 'category',
                 'cardinality' => 'many',
                 'owner' => 'local',
             ],
         ],
        'aggregates' =>
         [
             'Theme' =>
             [
                 'class' => 'Fred\\Model\\FredTheme',
                 'local' => 'theme',
                 'foreign' => 'id',
                 'cardinality' => 'one',
                 'owner' => 'foreign',
             ],
         ],
    ];
}
