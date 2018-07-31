<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property string $image
 * @property int $category
 * @property int $rank
 * @property int $option_set
 * @property array $options_override
 * @property string $content
 * 
 * @property FredElementCategory $Category
 * 
 * @package fred
 */
class FredElement extends xPDOSimpleObject {
    protected static $optionSetCache = [];
    
    public function processOptions()
    {
        $options = [];

        $optionSet = $this->get('option_set');
        if (!empty($optionSet)) {
            if (!isset(self::$optionSetCache[$optionSet])) {
                /** @var FredElementOptionSet $os */
                $os = $this->xpdo->getObject('FredElementOptionSet', $optionSet);
                
                if ($os) {
                    if ($os->get('complete') === true) {
                        self::$optionSetCache[$optionSet] = $os->processData();
                    }
                }
            }

            if (!empty(self::$optionSetCache[$optionSet])) {
                $options = self::$optionSetCache[$optionSet];
            }
        }

        $override = $this->get('options_override');
        
        if (isset($override['rteConfig']) && is_array($override['rteConfig']) && isset($options['rteConfig']) && is_array($options['rteConfig'])) {
            $override['rteConfig'] = array_merge($options['rteConfig'], $override['rteConfig']);
        }
        
        $options = array_merge($options, $override);
        
        return $options;
    }

    public function getImage()
    {
        $image = 'https://via.placeholder.com/350x150?text=' . urlencode($this->name);

        if (!empty($this->image)) {
            $image = $this->image;
        }
        
        return $image;
    }
}