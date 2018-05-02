<?php

namespace Fred;

final class Utils
{
    public static function explodeAndClean($array, $delimiter = ',', $mapMethod = '', $keepDuplicates = 0)
    {
        $array = explode($delimiter, $array);
        $array = array_map('trim', $array);

        if (!empty($mapMethod)) {
            $array = array_map($mapMethod, $array);    
        }
        
        if ($keepDuplicates == 0) {
            $array = array_keys(array_flip($array));
        }

        return array_filter($array);
    }
}