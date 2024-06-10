<?php

namespace Fred\v2\Processors\Extra;

/**
 * @package fred
 * @subpackage processors
 */
class GetCategories extends \modObjectGetListProcessor
{
    public $classKey = 'modCategory';
    public $languageTopics = ['category'];
    public $defaultSortField = 'category';

    public function prepareQueryBeforeCount(\xPDOQuery $c)
    {
        $parent = $this->getProperty('parent', null);
        if ($parent !== null) {
            $parent = intval($parent);

            $c->where([
                'parent' => $parent
            ]);
        }

        $query = $this->getProperty('query');

        $where = array();

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
