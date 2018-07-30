<?php
/**
 * @package fred
 */
$xpdo_meta_map['FredElementOptionSet']= array (
  'package' => 'fred',
  'version' => '0.1',
  'table' => 'fred_element_option_sets',
  'extends' => 'xPDOSimpleObject',
  'tableMeta' => 
  array (
    'engine' => 'InnoDB',
  ),
  'fields' => 
  array (
    'name' => NULL,
    'description' => '',
    'complete' => 0,
    'data' => '',
  ),
  'fieldMeta' => 
  array (
    'name' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
    ),
    'description' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
    ),
    'complete' => 
    array (
      'dbtype' => 'tinyint',
      'attributes' => 'unsigned',
      'precision' => '1',
      'phptype' => 'boolean',
      'null' => false,
      'default' => 0,
    ),
    'data' => 
    array (
      'dbtype' => 'mediumtext',
      'phptype' => 'json',
      'null' => false,
      'default' => '',
    ),
  ),
);
