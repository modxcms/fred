<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredThemedTemplate extends \Fred\Model\FredThemedTemplate
{
    public static $metaMap =  [
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_themed_templates',
        'extends' => 'xPDO\\Om\\xPDOObject',
        'tableMeta' =>
         [
             'engine' => 'InnoDB',
         ],
        'fields' =>
         [
             'template' => null,
             'theme' => null,
             'default_blueprint' => 0,
         ],
        'fieldMeta' =>
         [
             'template' =>
             [
                 'dbtype' => 'int',
                 'attributes' => 'unsigned',
                 'precision' => '10',
                 'phptype' => 'integer',
                 'null' => false,
                 'index' => 'pk',
             ],
             'theme' =>
             [
                 'dbtype' => 'int',
                 'attributes' => 'unsigned',
                 'precision' => '10',
                 'phptype' => 'integer',
                 'null' => false,
             ],
             'default_blueprint' =>
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
             'PRIMARY' =>
             [
                 'alias' => 'PRIMARY',
                 'primary' => true,
                 'unique' => true,
                 'type' => 'BTREE',
                 'columns' =>
                 [
                     'template' =>
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
         ],
        'composites' =>
         [
             'ElementCategoryTemplatesAccess' =>
             [
                 'class' => 'Fred\\Model\\FredElementCategoryTemplateAccess',
                 'local' => 'template',
                 'foreign' => 'template',
                 'cardinality' => 'many',
                 'owner' => 'local',
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
             'Template' =>
             [
                 'class' => 'MODX\\Revolution\\modTemplate',
                 'local' => 'template',
                 'foreign' => 'id',
                 'cardinality' => 'one',
                 'owner' => 'foreign',
             ],
         ],
    ];
}
