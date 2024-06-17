<?php

namespace Fred\v2\Elements\Event;

abstract class Event
{
    /** @var \modX */
    protected $modx;

    /** @var \Fred */
    protected $fred;

    /** @var array */
    protected $sp = [];

    protected $disabledClassKeys = ['modWebLink', 'modSymLink'];

    public function __construct(\Fred &$fred, array $scriptProperties)
    {
        $this->fred =& $fred;
        $this->modx =& $this->fred->modx;
        $this->sp = $scriptProperties;
    }

    abstract public function run();

    protected function getOption($key, $default = null, $skipEmpty = false)
    {
        return $this->modx->getOption($key, $this->sp, $default, $skipEmpty);
    }
}
