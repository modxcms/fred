<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredElementRTEConfig extends \Fred\Model\FredElementRTEConfig
{
    public static $metaMap =  [
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_element_rte_configs',
        'tableMeta' =>
         [
             'engine' => 'InnoDB',
         ],
        'fields' =>
         [
             'name' => null,
             'description' => '',
             'theme' => null,
             'data' => '',
         ],
        'fieldMeta' =>
         [
             'name' =>
             [
                 'dbtype' => 'varchar',
                 'precision' => '128',
                 'phptype' => 'string',
                 'null' => false,
             ],
             'description' =>
             [
                 'dbtype' => 'varchar',
                 'precision' => '255',
                 'phptype' => 'string',
                 'null' => false,
                 'default' => '',
             ],
             'theme' =>
             [
                 'dbtype' => 'int',
                 'attributes' => 'unsigned',
                 'precision' => '10',
                 'phptype' => 'integer',
                 'null' => false,
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
