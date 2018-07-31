<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

require_once dirname(dirname(__FILE__)) . '/index.class.php';

/**
 * @package fred
 * @subpackage controllers
 */
class FredElementsManagerController extends FredBaseManagerController
{
    public function process(array $scriptProperties = array())
    {
//        $this->migrate();
    }

    public function getPageTitle()
    {
        return $this->modx->lexicon('fred.menu.elements');
    }

    public function loadCustomCssJs()
    {
        $this->addJavascript($this->fred->getOption('jsUrl') . 'elements/widgets/element_rte_config.window.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'elements/widgets/element_rte_configs.grid.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'elements/widgets/element_option_set.window.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'elements/widgets/element_option_sets.grid.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'elements/widgets/category.window.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'elements/widgets/categories.grid.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'elements/widgets/element.window.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'elements/widgets/elements.grid.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'elements/panel.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'elements/page.js');
        
        $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/griddraganddrop.js');
        $this->addLastJavascript($this->fred->getOption('jsUrl') . 'utils/combos.js');

        $this->addHtml('
        <script type="text/javascript">
            Ext.onReady(function() {
                MODx.load({ xtype: "fred-page-elements"});
            });
        </script>
        ');
    }

    public function getTemplateFile()
    {
        return $this->fred->getOption('templatesPath') . 'elements.tpl';
    }

    private function migrate()
    {
        $this->modx->removeCollection('FredElementCategory', []);
        $this->modx->removeCollection('FredElement', []);
        
        $rootCategory = (int)$this->fred->getOption('elements_category_id');

        $c = $this->modx->newQuery('modCategory');
        $c->where([
            'parent' => $rootCategory
        ]);

        /** @var \modCategory[] $categories */
        $categories = $this->modx->getIterator('modCategory', $c);
        foreach ($categories as $category) {
            $newCategory = $this->modx->newObject('FredElementCategory');
            $newCategory->set('name', $category->category);
            $newCategory->set('rank', $category->rank);
            $newCategory->save();
            
            /** @var \modChunk[] $chunks */
            $chunks = $this->modx->getIterator('modChunk', ['category' => $category->id]);
            foreach ($chunks as $chunk) {
                $matches = [];
                preg_match('/image:([^\n]+)\n?/', $chunk->description, $matches);

                $image = '';
                $options = [];
                $description = $chunk->description;

                if (count($matches) == 2) {
                    $image = $matches[1];
                    $description = str_replace($matches[0], '', $description);
                }

                $matches = [];
                preg_match('/options:([^\n]+)\n?/', $description, $matches);

                if (count($matches) == 2) {
                    $options = $this->modx->getChunk($matches[1]);
                    $options = json_decode($options, true);
                    if (empty($options)) $options = [];

                    $globalRte = $this->fred->getOption('rte_config');
                    if (!empty($globalRte)) {
                        $globalRte = $this->modx->getChunk($globalRte);
                        $globalRte = json_decode($globalRte, true);

                        if (!empty($globalRte)) {
                            $rteConfig = $globalRte;

                            if (!empty($options['rteConfig'])) {
                                $rteConfig = array_merge($rteConfig, $options['rteConfig']);
                            }

                            $options['rteConfig'] = $rteConfig;
                        }
                    }

                    $description = str_replace($matches[0], '', $description);
                }

                $newElement = $this->modx->newObject('FredElement');
                $newElement->set('id', $chunk->id);
                $newElement->set('name', $chunk->name);
                $newElement->set('description', $description);
                $newElement->set('image', $image);
                $newElement->set('content', $chunk->content);
                $newElement->set('category', $newCategory->id);
                $newElement->save();
            }

        }
    }
    
}