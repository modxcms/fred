<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredCache extends \Fred\Model\FredCache
{
    public static $metaMap = array (
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_cache',
        'extends' => 'xPDO\\Om\\xPDOObject',
        'tableMeta' =>
        array (
            'engine' => 'InnoDB',
        ),
        'fields' =>
        array (
            'resource' => null,
            'element' => null,
            'content' => '',
        ),
        'fieldMeta' =>
        array (
            'resource' =>
            array (
                'dbtype' => 'int',
                'attributes' => 'unsigned',
                'precision' => '11',
                'phptype' => 'integer',
                'null' => false,
                'index' => 'pk',
            ),
            'element' =>
            array (
                'dbtype' => 'int',
                'attributes' => 'unsigned',
                'precision' => '11',
                'phptype' => 'integer',
                'null' => false,
                'index' => 'pk',
            ),
            'content' =>
            array (
                'dbtype' => 'mediumtext',
                'phptype' => 'string',
                'null' => false,
                'default' => '',
            ),
        ),
        'indexes' =>
        array (
            'resource' =>
            array (
                'alias' => 'resource',
                'primary' => false,
                'unique' => false,
                'type' => 'BTREE',
                'columns' =>
                array (
                    'resource' =>
                    array (
                        'length' => '',
                        'collation' => 'A',
                        'null' => false,
                    ),
                ),
            ),
            'element' =>
            array (
                'alias' => 'element',
                'primary' => false,
                'unique' => false,
                'type' => 'BTREE',
                'columns' =>
                array (
                    'element' =>
                    array (
                        'length' => '',
                        'collation' => 'A',
                        'null' => false,
                    ),
                ),
            ),
            'PRIMARY' =>
            array (
                'alias' => 'PRIMARY',
                'primary' => true,
                'unique' => true,
                'type' => 'BTREE',
                'columns' =>
                array (
                    'resource' =>
                    array (
                        'length' => '',
                        'collation' => 'A',
                        'null' => false,
                    ),
                    'element' =>
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
            'Resource' =>
            array (
                'class' => 'MODX\\Revolution\\modResource',
                'local' => 'resource',
                'foreign' => 'id',
                'cardinality' => 'one',
                'owner' => 'foreign',
            ),
            'Element' =>
            array (
                'class' => 'Fred\\Model\\FredElement',
                'local' => 'element',
                'foreign' => 'id',
                'cardinality' => 'one',
                'owner' => 'foreign',
            ),
        ),
    );
}
