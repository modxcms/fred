<?php
namespace Fred\Endpoint;

abstract class Endpoint
{
    /** @var \modX */
    protected $modx;
    
    /** @var \Fred */
    protected $fred;
    
    /**
     * Endpoint constructor.
     * @param \Fred $fred
     */
    public function __construct(\Fred &$fred)
    {
        $this->fred =& $fred;           
        $this->modx =& $fred->modx;           
    }
    
    abstract function run();
}