<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\Endpoint\Ajax;

class TaggerGetGroup extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    
    public function process()
    {
        $group = isset($_GET['group']) ? intval($_GET['group']) : 0;
        $includeTags = isset($_GET['includeTags']) ? intval($_GET['includeTags']) : -1;

        if (empty($group)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.tagger_ns_group'));
        }

        $this->loadTagger();

        if (!$this->taggerLoaded) return [];

        /** @var \TaggerGroup $groups */
        $group = $this->modx->getObject('TaggerGroup', ['id' => $group]);

        if (!$group) {
            return $this->failure($this->modx->lexicon('fred.fe.err.tagger_ns_group'));
        }

        $groupArray = $group->toArray();
        
        switch ($includeTags) {
            case -1:
                $groupArray['tags'] = ($group->show_autotag === 1) ? $this->taggerGetTagsForGroup($group) : [];
                break;
            case 1:
                $groupArray['tags'] = $this->taggerGetTagsForGroup($group);
                break;
            default:
                $groupArray['tags'] = [];
        }

        return $this->data(['group' => $groupArray]);
    }

    protected function taggerGetTagsForGroup($group)
    {
        if (!$this->taggerLoaded) return [];

        $c = $this->modx->newQuery('TaggerTag');
        $c->where(['group' => $group->id]);

        $sortDir = (strtolower($group->sort_dir) === 'asc') ? 'ASC' : 'DESC';

        if ($group->sort_field === 'alias') {
            $c->sortby('TaggerTag.alias', $sortDir);
        } else {
            $c->sortby('TaggerTag.rank', $sortDir);
        }

        $c->select($this->modx->getSelectColumns('TaggerTag', 'TaggerTag', '', ['tag']));

        $c->prepare();

        $c->stmt->execute();

        return $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
    }
}