<?php

namespace Fred\Endpoint\ElFinder\Driver;

class Utils {

    public static function normalizeDirname($dirname): string
    {
        return $dirname === '.' ? '' : $dirname;
    }

    public static function dirname($path): string
    {
        return static::normalizeDirname(dirname($path));
    }

    public static function normalizeRelativePath($path)
    {
        $path = str_replace('\\', '/', $path);
        $path =  static::removeFunkyWhiteSpace($path);
        $parts = [];

        foreach (explode('/', $path) as $part) {
            switch ($part) {
                case '':
                case '.':
                    break;

                case '..':
                    if (empty($parts)) {
                        throw new \Exception(
                            'Path is outside of the defined root, path: [' . $path . ']'
                        );
                    }
                    array_pop($parts);
                    break;

                default:
                    $parts[] = $part;
                    break;
            }
        }

        $path = implode('/', $parts);

        return $path;
    }

    public static function normalizePath($path): string
    {
        return static::normalizeRelativePath($path);
    }

    protected static function removeFunkyWhiteSpace($path)
    {
        if (preg_match('#\p{C}+#u', $path)) {
            throw new \Exception($path);
        }

        return $path;
    }
}
