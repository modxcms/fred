<?php
/**
 * @package fred
 */
$xpdo_meta_map['FredElementRTEConfig']= array (
  'package' => 'fred',
  'version' => '0.1',
  'table' => 'fred_element_rte_configs',
  'extends' => 'xPDOSimpleObject',
  'tableMeta' =>
  array (
    'engine' => 'InnoDB',
  ),
  'fields' =>
  array (
    'name' => NULL,
    'description' => '',
    'theme' => NULL,
    'data' => '',
  ),
  'fieldMeta' =>
  array (
    'name' =>
    array (
      'dbtype' => 'varchar',
      'precision' => '127',
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
    'theme' =>
    array (
      'dbtype' => 'int',
      'attributes' => 'unsigned',
      'precision' => '10',
      'phptype' => 'integer',
      'null' => false,
    ),
    'data' =>
    array (
      'dbtype' => 'mediumtext',
      'phptype' => 'json',
      'null' => false,
      'default' => '',
    ),
  ),
  'fieldAliases' =>
  array (
    'content' => 'data',
  ),
  'indexes' =>
  array (
    'theme' =>
    array (
      'alias' => 'theme',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' =>
      array (
        'theme' =>
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'name_theme' =>
    array (
      'alias' => 'name_theme',
      'primary' => false,
      'unique' => true,
      'type' => 'BTREE',
      'columns' =>
      array (
        'name' =>
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
        'theme' =>
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
    'Theme' =>
    array (
      'class' => 'FredTheme',
      'local' => 'theme',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
