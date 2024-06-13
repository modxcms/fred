<?php

namespace Fred\Processors\Extra;

use MODX\Revolution\modCategory;
use MODX\Revolution\Processors\Model\GetListProcessor;
use xPDO\Om\xPDOQuery;

/**
 * @package fred
 * @subpackage processors
 */
class GetCategories extends GetListProcessor
{
    public $classKey = modCategory::class;
    public $languageTopics = ['category'];
    public $defaultSortField = 'category';

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $parent = $this->getProperty('parent', null);
        if ($parent !== null) {
            $parent = intval($parent);

            $c->where([
                'parent' => $parent
            ]);
        }

        $query = $this->getProperty('query');

        $where = [];

        if (!empty($query)) {
            $valuesqry = $this->getProperty('valuesqry');

            if ($valuesqry == true) {
                $ids = \Fred\Utils::explodeAndClean($query, '|');

                if (!empty($ids)) {
                    $where['category:IN'] = $ids;
                }
            } else {
                $where['category:LIKE'] = '%' . $query . '%';
            }
        }

        $c->where($where);

        return $c;
    }
}
