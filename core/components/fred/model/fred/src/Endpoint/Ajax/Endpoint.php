<?php
namespace Fred\Endpoint\Ajax;

abstract class Endpoint
{
    /** @var \modX */
    protected $modx;

    /** @var \Fred */
    protected $fred;
    
    /** @var array */
    protected $allowedMethod = ['POST', 'OPTIONS'];

    /**
     * Endpoint constructor.
     * @param \Fred $fred
     */
    public function __construct(\Fred &$fred)
    {
        $this->fred =& $fred;
        $this->modx =& $fred->modx;
    }

    public function run()
    {
        /** @var bool|string $checked */
        $checked = $this->checkMethod();
        if ($checked !== true) {
            return $checked;
        }

        return $this->process();
    }
    
    /**
     * @return string
     */
    abstract function process();

    /**
     * @param $message
     * @return string
     */
    protected function failure($message)
    {
        http_response_code(400);
        
        return json_encode([
            'message' => $message
        ]);
    }

    /**
     * @param string $message
     * @return string
     */
    protected function success($message = '')
    {
        http_response_code(200);
        
        return json_encode([
            'message' => $message
        ]);
    }
    
    /**
     * @param array $data
     * @param array $meta
     * @return string
     */
    protected function data($data, $meta = [])
    {
        http_response_code(200);
        
        $meta['data'] = $data;
        
        return json_encode($meta);
    }
    
    protected function checkMethod()
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD']);
        
        if (in_array($method, $this->allowedMethod)) return true;

        http_response_code(405);
        return '{}';
    }
}
