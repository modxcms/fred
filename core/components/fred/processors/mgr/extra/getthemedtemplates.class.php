<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredExtraThemedTemplateGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'modTemplate';
    public $languageTopics = array('template', 'category');
    public $defaultSortField = 'templatename';

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $theme = (int)$this->getProperty('theme', 0);

        $c->leftJoin('FredThemedTemplate', 'ThemedTemplate', 'ThemedTemplate.template = id');

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

return 'FredExtraThemedTemplateGetListProcessor';
