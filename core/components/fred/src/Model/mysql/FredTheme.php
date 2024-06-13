<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredTheme extends \Fred\Model\FredTheme
{
    public static $metaMap =  [
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_themes',
        'tableMeta' =>
         [
             'engine' => 'InnoDB',
         ],
        'fields' =>
         [
             'name' => null,
             'namespace' => '',
             'settingsPrefix' => '',
             'theme_folder' => '',
             'uuid' => null,
             'description' => '',
             'config' => '',
             'default_element' => '',
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
             'namespace' =>
             [
                 'dbtype' => 'varchar',
                 'precision' => '255',
                 'phptype' => 'string',
                 'null' => false,
                 'default' => '',
             ],
             'settingsPrefix' =>
             [
                 'dbtype' => 'varchar',
                 'precision' => '255',
                 'phptype' => 'string',
                 'null' => false,
                 'default' => '',
             ],
             'theme_folder' =>
             [
                 'dbtype' => 'varchar',
                 'precision' => '255',
                 'phptype' => 'string',
                 'null' => false,
                 'default' => '',
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
             'config' =>
             [
                 'dbtype' => 'mediumtext',
                 'phptype' => 'json',
                 'null' => false,
                 'default' => '',
             ],
             'default_element' =>
             [
                 'dbtype' => 'varchar',
                 'precision' => '255',
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
             'name' =>
             [
                 'alias' => 'name',
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
                 ],
             ],
         ],
        'composites' =>
         [
             'ElementCategories' =>
             [
                 'class' => 'Fred\\Model\\FredElementCategory',
                 'local' => 'id',
                 'foreign' => 'theme',
                 'cardinality' => 'many',
                 'owner' => 'local',
             ],
             'BlueprintCategories' =>
             [
                 'class' => 'Fred\\Model\\FredBlueprintCategory',
                 'local' => 'id',
                 'foreign' => 'theme',
                 'cardinality' => 'many',
                 'owner' => 'local',
             ],
             'RTEConfigs' =>
             [
                 'class' => 'Fred\\Model\\FredElementRTEConfig',
                 'local' => 'id',
                 'foreign' => 'theme',
                 'cardinality' => 'many',
                 'owner' => 'local',
             ],
             'OptionSets' =>
             [
                 'class' => 'Fred\\Model\\FredElementOptionSet',
                 'local' => 'id',
                 'foreign' => 'theme',
                 'cardinality' => 'many',
                 'owner' => 'local',
             ],
             'Templates' =>
             [
                 'class' => 'Fred\\Model\\FredThemedTemplate',
                 'local' => 'id',
                 'foreign' => 'theme',
                 'cardinality' => 'many',
                 'owner' => 'local',
             ],
         ],
    ];
}
