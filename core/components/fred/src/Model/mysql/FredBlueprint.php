<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredBlueprint extends \Fred\Model\FredBlueprint
{
    public static $metaMap =  [
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_blueprints',
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
             'complete' => 0,
             'public' => 0,
             'createdBy' => 0,
             'data' => '',
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
             'complete' =>
             [
                 'dbtype' => 'tinyint',
                 'attributes' => 'unsigned',
                 'precision' => '1',
                 'phptype' => 'boolean',
                 'null' => false,
                 'default' => 0,
             ],
             'public' =>
             [
                 'dbtype' => 'tinyint',
                 'precision' => '1',
                 'phptype' => 'boolean',
                 'null' => false,
                 'default' => 0,
             ],
             'createdBy' =>
             [
                 'dbtype' => 'int',
                 'attributes' => 'unsigned',
                 'precision' => '10',
                 'phptype' => 'integer',
                 'null' => false,
                 'default' => 0,
             ],
             'data' =>
             [
                 'dbtype' => 'mediumtext',
                 'phptype' => 'json',
                 'null' => false,
                 'default' => '',
             ],
         ],
        'fieldAliases' =>
         [
             'content' => 'data',
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
             'complete' =>
             [
                 'alias' => 'complete',
                 'primary' => false,
                 'unique' => false,
                 'type' => 'BTREE',
                 'columns' =>
                 [
                     'complete' =>
                     [
                         'length' => '',
                         'collation' => 'A',
                         'null' => false,
                     ],
                 ],
             ],
             'createdBy' =>
             [
                 'alias' => 'createdBy',
                 'primary' => false,
                 'unique' => false,
                 'type' => 'BTREE',
                 'columns' =>
                 [
                     'createdBy' =>
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
             'BlueprintTemplatesAccess' =>
             [
                 'class' => 'Fred\\Model\\FredBlueprintTemplateAccess',
                 'local' => 'id',
                 'foreign' => 'blueprint',
                 'cardinality' => 'many',
                 'owner' => 'local',
             ],
         ],
        'aggregates' =>
         [
             'User' =>
             [
                 'class' => 'MODX\\Revolution\\modUser',
                 'local' => 'user',
                 'foreign' => 'id',
                 'cardinality' => 'one',
                 'owner' => 'foreign',
             ],
             'Category' =>
             [
                 'class' => 'Fred\\Model\\FredBlueprintCategory',
                 'local' => 'category',
                 'foreign' => 'id',
                 'cardinality' => 'one',
                 'owner' => 'foreign',
             ],
         ],
    ];
}
