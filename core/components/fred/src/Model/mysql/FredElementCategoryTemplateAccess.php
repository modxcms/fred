<?php
namespace Fred\Model\mysql;

use xPDO\xPDO;

class FredElementCategoryTemplateAccess extends \Fred\Model\FredElementCategoryTemplateAccess
{

    public static $metaMap = array (
        'package' => 'Fred\\Model\\',
        'version' => '3.0',
        'table' => 'fred_element_category_templates_access',
        'extends' => 'xPDO\\Om\\xPDOObject',
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
                'class' => 'Fred\\Model\\FredThemedTemplate',
                'local' => 'template',
                'foreign' => 'template',
                'cardinality' => 'one',
                'owner' => 'foreign',
            ),
            'ElementCategory' => 
            array (
                'class' => 'Fred\\Model\\FredElementCategory',
                'local' => 'category',
                'foreign' => 'id',
                'cardinality' => 'one',
                'owner' => 'foreign',
            ),
        ),
    );

}
