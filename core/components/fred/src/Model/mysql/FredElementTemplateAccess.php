<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredElementTemplateAccess extends \Fred\Model\FredElementTemplateAccess
{
    public static $metaMap =  [
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_element_templates_access',
        'extends' => 'xPDO\\Om\\xPDOObject',
        'tableMeta' =>
         [
             'engine' => 'InnoDB',
         ],
        'fields' =>
         [
             'element' => null,
             'template' => null,
         ],
        'fieldMeta' =>
         [
             'element' =>
             [
                 'dbtype' => 'int',
                 'attributes' => 'unsigned',
                 'precision' => '10',
                 'phptype' => 'integer',
                 'null' => false,
                 'index' => 'pk',
             ],
             'template' =>
             [
                 'dbtype' => 'int',
                 'attributes' => 'unsigned',
                 'precision' => '10',
                 'phptype' => 'integer',
                 'null' => false,
                 'index' => 'pk',
             ],
         ],
        'indexes' =>
         [
             'PRIMARY' =>
             [
                 'alias' => 'PRIMARY',
                 'primary' => true,
                 'unique' => true,
                 'type' => 'BTREE',
                 'columns' =>
                 [
                     'element' =>
                     [
                         'length' => '',
                         'collation' => 'A',
                         'null' => false,
                     ],
                     'template' =>
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
             'Template' =>
             [
                 'class' => 'Fred\\Model\\FredThemedTemplate',
                 'local' => 'template',
                 'foreign' => 'template',
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
