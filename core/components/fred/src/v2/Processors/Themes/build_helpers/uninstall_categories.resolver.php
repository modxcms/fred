<?php

/**
 * @var xPDOTransport $transport
 */

if ($options[xPDOTransport::PACKAGE_ACTION] === xPDOTransport::ACTION_UNINSTALL) {
    /** @var modX $modx */
    $modx =& $transport->xpdo;

    if (!function_exists('removeCategoryIfPossible')) {
        /**
         * @param modX $modx
         * @param modCategory $category
         * @return bool
         */
        function removeCategoryIfPossible(&$modx, $category)
        {
            $noChildCategories = true;

            /** @var modCategory[] $childCategories */
            $childCategories = $category->getMany('Children');
            if (is_array($childCategories)) {
                foreach ($childCategories as $childCategory) {
                    $childRemoved = removeCategoryIfPossible($modx, $childCategory);
                    if ($childRemoved === false) {
                        $noChildCategories = false;
                    }
                }
            }

            if ($noChildCategories === false) {
                return false;
            }

            $hasChunks = $modx->getCount('modChunk', ['category' => $category->get('id')]);
            if ($hasChunks > 0) {
                return false;
            }

            $hasSnippets = $modx->getCount('modSnippet', ['category' => $category->get('id')]);
            if ($hasSnippets > 0) {
                return false;
            }

            $hasPlugins = $modx->getCount('modPlugin', ['category' => $category->get('id')]);
            if ($hasPlugins > 0) {
                return false;
            }

            $hasTemplates = $modx->getCount('modTemplate', ['category' => $category->get('id')]);
            if ($hasTemplates > 0) {
                return false;
            }

            $hasTemplateVars = $modx->getCount('modTemplateVar', ['category' => $category->get('id')]);
            if ($hasTemplateVars > 0) {
                return false;
            }

            $hasPropertySets = $modx->getCount('modPropertySet', ['category' => $category->get('id')]);
            if ($hasPropertySets > 0) {
                return false;
            }

            return $category->remove();
        }
    }

    if (isset($object['rootCategories']) && is_array($object['rootCategories'])) {
        foreach ($object['rootCategories'] as $rootCategoryName) {
            /** @var modCategory $rootCategory */
            $rootCategory = $modx->getObject('modCategory', ['category' => $rootCategoryName, 'parent' => 0]);
            if ($rootCategory) {
                removeCategoryIfPossible($modx, $rootCategory);
            }
        }
    }
}

return true;
