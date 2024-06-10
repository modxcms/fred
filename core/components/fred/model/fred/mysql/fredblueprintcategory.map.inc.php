<?php

/**
 * @package fred
 */

$xpdo_meta_map['FredBlueprintCategory'] = array (
  'package' => 'fred',
  'version' => '2.0',
  'table' => 'fred_blueprint_categories',
  'tableMeta' =>
  array (
    'engine' => 'InnoDB',
  ),
  'fields' =>
  array (
    'name' => null,
    'uuid' => null,
    'rank' => 0,
    'theme' => null,
    'public' => 0,
    'createdBy' => 0,
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
    'uuid' =>
    array (
      'dbtype' => 'varchar',
      'precision' => '36',
      'phptype' => 'string',
      'null' => false,
      'index' => 'unique',
    ),
    'rank' =>
    array (
      'dbtype' => 'int',
      'attributes' => 'unsigned',
      'precision' => '10',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
    ),
    'theme' =>
    array (
      'dbtype' => 'int',
      'attributes' => 'unsigned',
      'precision' => '10',
      'phptype' => 'integer',
      'null' => false,
    ),
    'public' =>
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'phptype' => 'boolean',
      'null' => false,
      'default' => 0,
    ),
    'createdBy' =>
    array (
      'dbtype' => 'int',
      'attributes' => 'unsigned',
      'precision' => '10',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
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
    'public' =>
    array (
      'alias' => 'public',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' =>
      array (
        'public' =>
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'rank' =>
    array (
      'alias' => 'rank',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' =>
      array (
        'rank' =>
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'createdBy' =>
    array (
      'alias' => 'createdBy',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' =>
      array (
        'createdBy' =>
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
  'composites' =>
  array (
    'Blueprints' =>
    array (
      'class' => 'FredBlueprint',
      'local' => 'id',
      'foreign' => 'category',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'BlueprintCategoryTemplatesAccess' =>
    array (
      'class' => 'FredBlueprintCategoryTemplateAccess',
      'local' => 'id',
      'foreign' => 'category',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
  'aggregates' =>
  array (
    'User' =>
    array (
      'class' => 'modUser',
      'local' => 'user',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
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
