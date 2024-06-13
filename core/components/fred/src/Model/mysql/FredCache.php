<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredCache extends \Fred\Model\FredCache
{
    public static $metaMap =  [
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_cache',
        'extends' => 'xPDO\\Om\\xPDOObject',
        'tableMeta' =>
         [
             'engine' => 'InnoDB',
         ],
        'fields' =>
         [
             'resource' => null,
             'element' => null,
             'content' => '',
         ],
        'fieldMeta' =>
         [
             'resource' =>
             [
                 'dbtype' => 'int',
                 'attributes' => 'unsigned',
                 'precision' => '11',
                 'phptype' => 'integer',
                 'null' => false,
                 'index' => 'pk',
             ],
             'element' =>
             [
                 'dbtype' => 'int',
                 'attributes' => 'unsigned',
                 'precision' => '11',
                 'phptype' => 'integer',
                 'null' => false,
                 'index' => 'pk',
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
             'resource' =>
             [
                 'alias' => 'resource',
                 'primary' => false,
                 'unique' => false,
                 'type' => 'BTREE',
                 'columns' =>
                 [
                     'resource' =>
                     [
                         'length' => '',
                         'collation' => 'A',
                         'null' => false,
                     ],
                 ],
             ],
             'element' =>
             [
                 'alias' => 'element',
                 'primary' => false,
                 'unique' => false,
                 'type' => 'BTREE',
                 'columns' =>
                 [
                     'element' =>
                     [
                         'length' => '',
                         'collation' => 'A',
                         'null' => false,
                     ],
                 ],
             ],
             'PRIMARY' =>
             [
                 'alias' => 'PRIMARY',
                 'primary' => true,
                 'unique' => true,
                 'type' => 'BTREE',
                 'columns' =>
                 [
                     'resource' =>
                     [
                         'length' => '',
                         'collation' => 'A',
                         'null' => false,
                     ],
                     'element' =>
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
             'Resource' =>
             [
                 'class' => 'MODX\\Revolution\\modResource',
                 'local' => 'resource',
                 'foreign' => 'id',
                 'cardinality' => 'one',
                 'owner' => 'foreign',
             ],
             'Element' =>
             [
                 'class' => 'Fred\\Model\\FredElement',
                 'local' => 'element',
                 'foreign' => 'id',
                 'cardinality' => 'one',
                 'owner' => 'foreign',
             ],
         ],
    ];
}
