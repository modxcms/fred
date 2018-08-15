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
    'uuid' => NULL,
    'description' => '',
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
