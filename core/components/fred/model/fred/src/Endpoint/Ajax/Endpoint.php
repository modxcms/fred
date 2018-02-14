<?php
namespace Fred\Endpoint\Ajax;

abstract class Endpoint
{
    /** @var \modX */
    protected $modx;

    /** @var \Fred */
    protected $fred;

    /** @var string */
    protected $method;

    /** @var array */
    protected $body;

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

        if ($this->method === 'POST') {
            $this->body = json_decode(file_get_contents('php://input'), true);
        }

        return $this->process();
    }

    /**
     * @return string
     */
    abstract function process();

    /**
     * @param string|array $message
     * @return string
     */
    protected function failure($message)
    {
        http_response_code(400);

        if (!is_array($message)) {
            $message = ['message' => $message];
        }

        return json_encode($message);
    }

    /**
     * @param string|array $message
     * @return string
     */
    protected function success($message = '')
    {
        http_response_code(200);

        if (!is_array($message)) {
            $message = ['message' => $message];
        }

        return json_encode($message);
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
        $this->method = strtoupper($_SERVER['REQUEST_METHOD']);

        if (in_array($this->method, $this->allowedMethod)) return true;

        http_response_code(405);
        return '{}';
    }
}
