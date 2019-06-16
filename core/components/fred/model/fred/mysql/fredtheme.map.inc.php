<?php
/**
 * @package fred
 */
$xpdo_meta_map['FredTheme']= array (
  'package' => 'fred',
  'version' => '0.1',
  'table' => 'fred_themes',
  'extends' => 'xPDOSimpleObject',
  'tableMeta' =>
  array (
    'engine' => 'InnoDB',
  ),
  'fields' =>
  array (
    'name' => NULL,
    'namespace' => '',
    'theme_folder' => '',
    'uuid' => NULL,
    'description' => '',
    'config' => '',
    'default_element' => '',
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
    'namespace' =>
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
    ),
    'theme_folder' =>
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
    ),
    'uuid' =>
    array (
      'dbtype' => 'varchar',
      'precision' => '36',
      'phptype' => 'string',
      'null' => false,
      'index' => 'unique',
    ),
    'description' =>
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
    ),
    'config' =>
    array (
      'dbtype' => 'mediumtext',
      'phptype' => 'json',
      'null' => false,
      'default' => '',
    ),
    'default_element' =>
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
    ),
  ),
  'indexes' =>
  array (
    'uuid' =>
    array (
      'alias' => 'uuid',
      'primary' => false,
      'unique' => true,
      'type' => 'BTREE',
      'columns' =>
      array (
        'uuid' =>
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'name' =>
    array (
      'alias' => 'name',
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
      ),
    ),
  ),
  'composites' =>
  array (
    'ElementCategories' =>
    array (
      'class' => 'FredElementCategory',
      'local' => 'id',
      'foreign' => 'theme',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'BlueprintCategories' =>
    array (
      'class' => 'FredBlueprintCategory',
      'local' => 'id',
      'foreign' => 'theme',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'RTEConfigs' =>
    array (
      'class' => 'FredElementRTEConfig',
      'local' => 'id',
      'foreign' => 'theme',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'OptionSets' =>
    array (
      'class' => 'FredElementOptionSet',
      'local' => 'id',
      'foreign' => 'theme',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'Templates' =>
    array (
      'class' => 'FredThemedTemplate',
      'local' => 'id',
      'foreign' => 'theme',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
);
