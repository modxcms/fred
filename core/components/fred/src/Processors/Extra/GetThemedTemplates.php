<?php
namespace Fred\Processors\Extra;

use Fred\Model\FredThemedTemplate;
use MODX\Revolution\modTemplate;
use MODX\Revolution\Processors\Model\GetListProcessor;
use xPDO\Om\xPDOQuery;

/**
 * @package fred
 * @subpackage processors
 */
class GetThemedTemplates extends GetListProcessor
{
    public $classKey = modTemplate::class;
    public $languageTopics = ['template', 'category'];
    public $defaultSortField = 'templatename';

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $theme = (int)$this->getProperty('theme', 0);

        $c->leftJoin(FredThemedTemplate::class, 'ThemedTemplate', 'ThemedTemplate.template = id');

        $query = $this->getProperty('query');

        $where = array();

        $where['ThemedTemplate.theme'] = $theme;

        if (!empty($query)) {
            $valuesqry = $this->getProperty('valuesqry');

            if ($valuesqry == true) {
                $ids = \Fred\Utils::explodeAndClean($query, '|');

                if (!empty($ids)) {
                    $where['id:IN'] = $ids;
                }
            } else {
                $where['templatename:LIKE'] = '%' . $query . '%';

            }
        }

        $c->where($where);

        return $c;
    }

}
