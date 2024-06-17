<?php

namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredBlueprintTemplateAccess extends \Fred\Model\FredBlueprintTemplateAccess
{
    public static $metaMap =  [
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_blueprint_templates_access',
        'extends' => 'xPDO\\Om\\xPDOObject',
        'tableMeta' =>
         [
             'engine' => 'InnoDB',
         ],
        'fields' =>
         [
             'blueprint' => null,
             'template' => null,
         ],
        'fieldMeta' =>
         [
             'blueprint' =>
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
                     'blueprint' =>
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
             'Blueprint' =>
             [
                 'class' => 'Fred\\Model\\FredBlueprint',
                 'local' => 'blueprint',
                 'foreign' => 'id',
                 'cardinality' => 'one',
                 'owner' => 'foreign',
             ],
         ],
    ];
}
