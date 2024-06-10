<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredElementTemplateAccess extends \Fred\Model\FredElementTemplateAccess
{
    public static $metaMap = array (
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_element_templates_access',
        'extends' => 'xPDO\\Om\\xPDOObject',
        'tableMeta' =>
        array (
            'engine' => 'InnoDB',
        ),
        'fields' =>
        array (
            'element' => null,
            'template' => null,
        ),
        'fieldMeta' =>
        array (
            'element' =>
            array (
                'dbtype' => 'int',
                'attributes' => 'unsigned',
                'precision' => '10',
                'phptype' => 'integer',
                'null' => false,
                'index' => 'pk',
            ),
            'template' =>
            array (
                'dbtype' => 'int',
                'attributes' => 'unsigned',
                'precision' => '10',
                'phptype' => 'integer',
                'null' => false,
                'index' => 'pk',
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
                    'element' =>
                    array (
                        'length' => '',
                        'collation' => 'A',
                        'null' => false,
                    ),
                    'template' =>
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
            'Template' =>
            array (
                'class' => 'Fred\\Model\\FredThemedTemplate',
                'local' => 'template',
                'foreign' => 'template',
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
