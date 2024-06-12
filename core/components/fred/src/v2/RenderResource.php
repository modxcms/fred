<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\v2;

use Fred\Utils;
use Twig\Environment;
use Twig\Loader\ArrayLoader;

final class RenderResource
{
    use \Fred\Traits\RenderResource;

    private $elementClass = 'FredElement';
    private $modRequestClass = \modRequest::class;

    public $resource;

    private $theme;

    /** @var Environment */
    private $twig;

    private $modx;

    private $fred;

    /** @var array */
    public $data = [];

    /** @var array */
    public $pageSettings = [];

    /** @var array */
    private $elementOptions = [];

    /** @var array */
    private $elementCache = [];

    public function __construct($resource, \modX $modx, $data = [], $pageSettings = [])
    {
        $this->resource = $resource;
        $this->modx = $modx;

        $corePath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
        $this->fred = $modx->getService(
            'fred',
            'Fred',
            $corePath . 'model/fred/',
            array(
                'core_path' => $corePath
            )
        );

        $this->theme = $this->fred->getTheme($this->resource->template);
        if (empty($data)) {
            $this->data = $this->resource->getProperty('data', 'fred');
        } else {
            $this->data = $data;
        }
        if (empty($this->data) && !empty($this->resource->content)) {
            $this->setDefaults();
        }
        $this->pageSettings = $pageSettings;
        if (empty($this->pageSettings)) {
            $this->pageSettings = $this->resource->toArray();
            unset($this->pageSettings['content']);
            $tvs = $this->resource->getTemplateVars();
            foreach ($tvs as $tv) {
                if (isset($this->pageSettings['tv_' . $tv->get('name')])) {
                    continue;
                }
                $this->pageSettings['tv_' . $tv->get('name')] = $this->resource->getTVValue($tv->get('name'));
            }
        } else {
            if (!empty($this->pageSettings['tvs'])) {
                foreach ($this->pageSettings['tvs'] as $key => $value) {
                    $this->pageSettings['tv_' . $key] = $value;
                }
            }
        }
        $elements = [];
        $this->gatherElements($elements, $this->data);

        $loader = new ArrayLoader($elements);
        $this->twig = new Environment($loader, []);
        $this->twig->setCache(false);
    }

    public function render(): bool
    {
        $contentData = !empty($this->data['content']) ? $this->data['content'] : [];
        $html = '';

        foreach ($contentData as $item) {
            if (isset($this->elementCache[$item['widget']])) {
                try {
                    $html .= $this->renderElement(
                        $this->elementCache[$item['widget']],
                        $item,
                        true,
                        true
                    );
                } catch (\Exception $e) {
                }
            } else {
                try {
                    $elementContent = $this->renderElement(
                        $this->twig->render(
                            $item['widget'],
                            $this->mergeSetting(!empty($item['elId']) ? $item['elId'] : '', $item['settings'])
                        ),
                        $item,
                        true,
                        (isset($this->elementOptions[$item['widget']]['cacheOutput'])) ?
                            $this->elementOptions[$item['widget']]['cacheOutput'] : false
                    );
                    if (
                        isset($this->elementOptions[$item['widget']]['cacheOutput'])
                        && $this->elementOptions[$item['widget']]['cacheOutput'] === true
                    ) {
                        $this->cacheElement($item['widget'], $elementContent);
                    }
                    $html .= $elementContent;
                } catch (\Exception $e) {
                    $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Error rendering element {$item['widget']}: {$e->getMessage()}");
                }
            }
        }

        $parser = $this->modx->getParser();
        $html = Utils::htmlDecodeTags($html, $parser);

        $loader = new ArrayLoader(['content' => $html]);
        $twig = new Environment($loader, []);
        $twig->setCache(false);

        try {
            $this->resource->set('content', $twig->render('content', $this->mergeSetting('')));
        } catch (\Exception $e) {
            $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Error rendering resource {$this->resource->id}: {$e->getMessage()}");
            $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] HTML \n {$html}");
            $this->resource->set('content', '');
        }

        $c = $this->modx->newQuery('modTemplateVar');
        $c->leftJoin('modTemplateVarTemplate', 'TemplateVarTemplates');

        $c->where(
            [
                'TemplateVarTemplates.templateid' => $this->resource->get('template'),
            ]
        );

        /** @var modTemplateVar[] $tvs */
        $tvs = $this->modx->getIterator('modTemplateVar', $c);
        $mTypes = $this->modx->getOption('manipulatable_url_tv_output_types', null, 'image,file');
        $mTypes = explode(',', $mTypes);
        foreach ($tvs as $tv) {
            $tvName = $tv->get('name');
            // check if TV is in base data or pageSettings
            $tvValue = (isset($this->pageSettings['tvs'][$tvName])) ?
                $this->pageSettings['tvs'][$tvName] :
                ($this->data[$tvName] ?? null);
            if (isset($tvValue)) {
                $tvContent = '';
                if ($tv->type === 'freddropzone' || is_array($tvValue)) {
                    foreach ($tvValue as $item) {
                        try {
                            $tvContent .= $this->renderElement(
                                $this->twig->render(
                                    $item['widget'],
                                    $this->mergeSetting(!empty($item['elId']) ? $item['elId'] : '', $item['settings'])
                                ),
                                $item,
                                true
                            );
                        } catch (\Exception $e) {
                        }
                    }
                } else {
                    $tvContent = $tvValue;
                }
                $tvContent = Utils::htmlDecodeTags($tvContent, $parser);
                if (in_array($tv->type, $mTypes, true)) {
                    $this->resource->setTVValue($tvName, $this->reversePreparedOutput($tv, $tvContent, $this->resource));
                } else {
                    $this->resource->setTVValue($tvName, $tvContent);
                }
            }
        }

        $this->data['fingerprint'] = Utils::resourceFingerprint($this->resource);
        $this->resource->setProperty('data', $this->data, 'fred');

        if ($this->resource->save()) {
            $this->modx->getCacheManager()->refresh();
            return true;
        }

        return false;
    }
}
