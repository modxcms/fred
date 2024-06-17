<?php

namespace Fred\v2\Processors\Extra;

/**
 * @package fred
 * @subpackage processors
 */
class GetTemplates extends \modObjectGetListProcessor
{
    public $classKey = 'modTemplate';
    public $languageTopics = ['template', 'category'];
    public $defaultSortField = 'templatename';

    public function beforeIteration(array $list)
    {
        $addEmpty = $this->getProperty('addEmpty', false);

        if ($addEmpty) {
            $list[] = [
                'id' => 0,
                'templatename' => $this->modx->lexicon('template_empty'),
            ];
        }

        return $list;
    }

    public function prepareQueryBeforeCount(\xPDOQuery $c)
    {
        $hideUsed = (int)$this->getProperty('hideUsed', 0);
        if ($hideUsed === 1) {
            $used = $this->modx->newQuery('FredThemedTemplate');
            $used->select($this->modx->getSelectColumns('FredThemedTemplate', 'FredThemedTemplate', '', ['template']));
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

        $where = [];

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
