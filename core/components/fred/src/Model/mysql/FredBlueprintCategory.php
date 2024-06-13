<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredBlueprintCategory extends \Fred\Model\FredBlueprintCategory
{
    public static $metaMap =  [
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_blueprint_categories',
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
             'public' => 0,
             'createdBy' => 0,
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
             'public' =>
             [
                 'alias' => 'public',
                 'primary' => false,
                 'unique' => false,
                 'type' => 'BTREE',
                 'columns' =>
                 [
                     'public' =>
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
             'Blueprints' =>
             [
                 'class' => 'Fred\\Model\\FredBlueprint',
                 'local' => 'id',
                 'foreign' => 'category',
                 'cardinality' => 'many',
                 'owner' => 'local',
             ],
             'BlueprintCategoryTemplatesAccess' =>
             [
                 'class' => 'Fred\\Model\\FredBlueprintCategoryTemplateAccess',
                 'local' => 'id',
                 'foreign' => 'category',
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
