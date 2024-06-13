<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredElementCategoryTemplateAccess extends \Fred\Model\FredElementCategoryTemplateAccess
{
    public static $metaMap =  [
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_element_category_templates_access',
        'extends' => 'xPDO\\Om\\xPDOObject',
        'tableMeta' =>
         [
             'engine' => 'InnoDB',
         ],
        'fields' =>
         [
             'category' => null,
             'template' => null,
         ],
        'fieldMeta' =>
         [
             'category' =>
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
                     'category' =>
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
             'ElementCategory' =>
             [
                 'class' => 'Fred\\Model\\FredElementCategory',
                 'local' => 'category',
                 'foreign' => 'id',
                 'cardinality' => 'one',
                 'owner' => 'foreign',
             ],
         ],
    ];
}
