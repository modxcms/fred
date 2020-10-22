<?php
/**
 * @package fred
 */
$xpdo_meta_map['FredElementCategoryTemplateAccess']= array (
  'package' => 'fred',
  'version' => '0.1',
  'table' => 'fred_element_category_templates_access',
  'extends' => 'xPDOObject',
  'tableMeta' => 
  array (
    'engine' => 'InnoDB',
  ),
  'fields' => 
  array (
    'category' => NULL,
    'template' => NULL,
  ),
  'fieldMeta' => 
  array (
    'category' => 
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
        'category' => 
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
    'ElementCategory' => 
    array (
      'class' => 'FredElementCategory',
      'local' => 'category',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
