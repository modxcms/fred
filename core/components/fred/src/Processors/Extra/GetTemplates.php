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
class GetTemplates extends GetListProcessor
{
    public $classKey = modTemplate::class;
    public $languageTopics = ['template', 'category'];
    public $defaultSortField = 'templatename';

    public function beforeIteration(array $list)
    {
        $addEmpty = $this->getProperty('addEmpty', false);

        if ($addEmpty) {
            $list[] = array(
                'id' => 0,
                'templatename' => $this->modx->lexicon('template_empty'),
            );
        }

        return $list;
    }

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $hideUsed = (int)$this->getProperty('hideUsed', 0);
        if ($hideUsed === 1) {
            $used = $this->modx->newQuery(FredThemedTemplate::class);
            $used->select($this->modx->getSelectColumns(FredThemedTemplate::class, 'FredThemedTemplate', '', ['template']));
            $used->prepare();
            $used->stmt->execute();

            $used = $used->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
            $used = array_map('intval', $used);

            if (!empty($used)) {
                $c->where([
                    'id:NOT IN' => $used
                ]);
            }
        }

        $query = $this->getProperty('query');

        $where = array();

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
