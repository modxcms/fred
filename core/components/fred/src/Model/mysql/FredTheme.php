<?php
namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredTheme extends \Fred\Model\FredTheme
{

    public static $metaMap = array (
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_themes',
        'tableMeta' => 
        array (
            'engine' => 'InnoDB',
        ),
        'fields' => 
        array (
            'name' => NULL,
            'namespace' => '',
            'settingsPrefix' => '',
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
            'settingsPrefix' => 
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
                'class' => 'Fred\\Model\\FredElementCategory',
                'local' => 'id',
                'foreign' => 'theme',
                'cardinality' => 'many',
                'owner' => 'local',
            ),
            'BlueprintCategories' => 
            array (
                'class' => 'Fred\\Model\\FredBlueprintCategory',
                'local' => 'id',
                'foreign' => 'theme',
                'cardinality' => 'many',
                'owner' => 'local',
            ),
            'RTEConfigs' => 
            array (
                'class' => 'Fred\\Model\\FredElementRTEConfig',
                'local' => 'id',
                'foreign' => 'theme',
                'cardinality' => 'many',
                'owner' => 'local',
            ),
            'OptionSets' => 
            array (
                'class' => 'Fred\\Model\\FredElementOptionSet',
                'local' => 'id',
                'foreign' => 'theme',
                'cardinality' => 'many',
                'owner' => 'local',
            ),
            'Templates' => 
            array (
                'class' => 'Fred\\Model\\FredThemedTemplate',
                'local' => 'id',
                'foreign' => 'theme',
                'cardinality' => 'many',
                'owner' => 'local',
            ),
        ),
    );

}
