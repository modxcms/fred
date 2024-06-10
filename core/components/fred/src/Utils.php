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

use MODX\Revolution\modChunk;
use MODX\Revolution\modParser;
use MODX\Revolution\modResource;
use MODX\Revolution\modX;

final class Utils
{
    public static function explodeAndClean($array, $delimiter = ',', $mapMethod = '', $keepDuplicates = 0, $filterCallback = null)
    {
        $array = explode($delimiter, $array);
        $array = array_map('trim', $array);

        if (!empty($filterCallback)) {
            $array = array_filter($array, $filterCallback);
        } else {
            $array = array_filter($array);
        }

        if (!empty($mapMethod)) {
            $array = array_map($mapMethod, $array);
        }

        if ($keepDuplicates == 0) {
            $array = array_keys(array_flip($array));
        }

        if (!empty($filterCallback)) {
            return array_filter($array, $filterCallback);
        }

        return array_filter($array);
    }

    /**
     * @param string $content
     * @param modParser $parser
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
     * @param modResource $resource
     * @return string
     */
    public static function resourceFingerprint($resource)
    {
        $data = $resource->editedon;

        return sha1($data);
    }

    /**
     * @param modX|\xPDO\xPDO $modx
     * @param string|array $data
     * @param array $phs
     * @return string|array
     */
    public static function modxParseString($modx, $data, $phs = [])
    {
        $isArray = false;

        if (is_array($data)) {
            $isArray = true;
            $data = json_encode($data);
        }
        /** @var modChunk $chunk */
        $chunk = $modx->newObject(modChunk::class, ['name' => 'inline-' . uniqid()]);
        $chunk->setCacheable(false);

        $output = $chunk->process($phs, $data);

        if ($isArray === true) {
            $output = json_decode($output, true);
        }

        return $output;
    }

    public static function uuidFactory()
    {
        $factory = new \Ramsey\Uuid\UuidFactory();

        $generator = new \Ramsey\Uuid\Generator\CombGenerator(
            $factory->getRandomGenerator(),
            $factory->getNumberConverter()
        );

        $factory->setRandomGenerator($generator);

        return $factory;
    }

    public static function uuid()
    {
        return self::uuidFactory()->uuid4()->toString();
    }
}
