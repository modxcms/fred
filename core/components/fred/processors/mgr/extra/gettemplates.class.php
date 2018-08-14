<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredExtraTemplateGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'modTemplate';
    public $languageTopics = array('template', 'category');
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

return 'FredExtraTemplateGetListProcessor';