<?php

$xpdo_meta_map =  [
    'version' => '3.0',
    'namespace' => 'Fred\\Model',
    'namespacePrefix' => 'Fred',
    'class_map' =>
     [
         'xPDO\\Om\\xPDOSimpleObject' =>
         [
             0 => 'Fred\\Model\\FredBlueprintCategory',
             1 => 'Fred\\Model\\FredBlueprint',
             2 => 'Fred\\Model\\FredElementCategory',
             3 => 'Fred\\Model\\FredElementOptionSet',
             4 => 'Fred\\Model\\FredElementRTEConfig',
             5 => 'Fred\\Model\\FredElement',
             6 => 'Fred\\Model\\FredTheme',
         ],
         'xPDO\\Om\\xPDOObject' =>
         [
             0 => 'Fred\\Model\\FredThemedTemplate',
             1 => 'Fred\\Model\\FredCache',
             2 => 'Fred\\Model\\FredElementCategoryTemplateAccess',
             3 => 'Fred\\Model\\FredElementTemplateAccess',
             4 => 'Fred\\Model\\FredBlueprintCategoryTemplateAccess',
             5 => 'Fred\\Model\\FredBlueprintTemplateAccess',
         ],
     ],
];
