<?php

namespace Fred\v2\Processors\MediaSources;

/**
 * @package fred
 * @subpackage processors
 */

class UpdateFromGrid extends \modObjectUpdateProcessor
{
    public $classKey = 'modMediaSource';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.media_sources';

    /** @var \modMediaSource */
    public $object;

    private $fred = false;
    private $fredReadOnly = false;

    public function initialize()
    {
        $data = $this->getProperty('data');
        if (empty($data)) {
            return $this->modx->lexicon('invalid_data');
        }
        $data = $this->modx->fromJSON($data);
        if (empty($data)) {
            return $this->modx->lexicon('invalid_data');
        }

        $this->setProperty('id', $data['id']);

        $this->fred = empty($data['fred']) ? false : $data['fred'];
        $this->fredReadOnly = empty($data['fredReadOnly']) ? false : $data['fredReadOnly'];

        $this->unsetProperty('data');

        return parent::initialize();
    }

    public function beforeSave()
    {
        $props = $this->object->getProperties();

        if (!isset($props['fred']['value'])) {
            $props['fred'] = [
                'name' => 'fred',
                'desc' => '',
                'type' => 'combo-boolean',
                'value' => $this->fred,
                'lexicon' => null,
                'name_trans' => 'fred'
            ];
        } else {
            $props['fred']['value'] = $this->fred;
        }

        if (!isset($props['fredReadOnly']['value'])) {
            $props['fredReadOnly'] = [
                'name' => 'fredReadOnly',
                'desc' => '',
                'type' => 'combo-boolean',
                'value' => $this->fredReadOnly,
                'lexicon' => null,
                'name_trans' => 'fredReadOnly'
            ];
        } else {
            $props['fredReadOnly']['value'] = $this->fredReadOnly;
        }

        $this->object->setProperties($props);

        return true;
    }
}
