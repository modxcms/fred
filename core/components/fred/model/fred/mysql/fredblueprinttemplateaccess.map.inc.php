<?php
/**
 * @package fred
 */
$xpdo_meta_map['FredBlueprintTemplateAccess']= array (
  'package' => 'fred',
  'version' => '0.1',
  'table' => 'fred_blueprint_templates_access',
  'extends' => 'xPDOObject',
  'tableMeta' => 
  array (
    'engine' => 'InnoDB',
  ),
  'fields' => 
  array (
    'blueprint' => NULL,
    'template' => NULL,
  ),
  'fieldMeta' => 
  array (
    'blueprint' => 
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
        'blueprint' => 
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
      'class' => 'FredThemedTemplate',
      'local' => 'template',
      'foreign' => 'template',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
    'Blueprint' => 
    array (
      'class' => 'FredBlueprint',
      'local' => 'blueprint',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
