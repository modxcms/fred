<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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

    /**
     * @param string $content
     * @param \modParser $parser
     * @return string
     */
    public static function htmlDecodeTags($content, $parser)
    {
        $matches = [];
        $parser->collectElementTags($content, $matches);

        foreach ($matches as $match) {
            $decodedMatch = htmlspecialchars_decode($match[0], ENT_HTML5);
            $content = str_replace($match[0], $decodedMatch, $content);
        }
        
        return $content;
    }

    /**
     * @param \modResource $resource
     * @return string
     */
    public static function resourceFingerprint($resource)
    {
        $data = $resource->editedon;
        
        return sha1($data);
    }
}