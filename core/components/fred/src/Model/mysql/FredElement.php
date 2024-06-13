<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredElement extends \Fred\Model\FredElement
{
    public static $metaMap =  [
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_elements',
        'tableMeta' =>
         [
             'engine' => 'InnoDB',
         ],
        'fields' =>
         [
             'name' => null,
             'uuid' => null,
             'description' => '',
             'image' => '',
             'category' => null,
             'rank' => 0,
             'option_set' => 0,
             'options_override' => '',
             'content' => '',
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
             'description' =>
             [
                 'dbtype' => 'varchar',
                 'precision' => '255',
                 'phptype' => 'string',
                 'null' => false,
                 'default' => '',
             ],
             'image' =>
             [
                 'dbtype' => 'text',
                 'phptype' => 'string',
                 'null' => false,
                 'default' => '',
             ],
             'category' =>
             [
                 'dbtype' => 'int',
                 'attributes' => 'unsigned',
                 'precision' => '10',
                 'phptype' => 'integer',
                 'null' => false,
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
             'option_set' =>
             [
                 'dbtype' => 'int',
                 'attributes' => 'unsigned',
                 'precision' => '10',
                 'phptype' => 'integer',
                 'null' => false,
                 'default' => 0,
             ],
             'options_override' =>
             [
                 'dbtype' => 'mediumtext',
                 'phptype' => 'json',
                 'null' => false,
                 'default' => '',
             ],
             'content' =>
             [
                 'dbtype' => 'mediumtext',
                 'phptype' => 'string',
                 'null' => false,
                 'default' => '',
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
             'category' =>
             [
                 'alias' => 'category',
                 'primary' => false,
                 'unique' => false,
                 'type' => 'BTREE',
                 'columns' =>
                 [
                     'category' =>
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
             'name_category' =>
             [
                 'alias' => 'name_category',
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
                     'category' =>
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
             'Cache' =>
             [
                 'class' => 'Fred\\Model\\FredCache',
                 'local' => 'id',
                 'foreign' => 'element',
                 'cardinality' => 'many',
                 'owner' => 'local',
             ],
             'ElementTemplatesAccess' =>
             [
                 'class' => 'Fred\\Model\\FredElementTemplateAccess',
                 'local' => 'id',
                 'foreign' => 'element',
                 'cardinality' => 'many',
                 'owner' => 'local',
             ],
         ],
        'aggregates' =>
         [
             'Category' =>
             [
                 'class' => 'Fred\\Model\\FredElementCategory',
                 'local' => 'category',
                 'foreign' => 'id',
                 'cardinality' => 'one',
                 'owner' => 'foreign',
             ],
             'OptionSet' =>
             [
                 'class' => 'Fred\\Model\\FredElementOptionSet',
                 'local' => 'option_set',
                 'foreign' => 'id',
                 'cardinality' => 'one',
                 'owner' => 'foreign',
             ],
         ],
    ];
}
