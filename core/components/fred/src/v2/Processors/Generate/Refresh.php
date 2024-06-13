<?php

namespace Fred\v2\Processors\Generate;

/**
 * @package fred
 * @subpackage processors
 */
class Refresh extends \modProcessor
{
    public function checkPermissions()
    {
        return $this->modx->hasPermission('empty_cache');
    }

    public function process()
    {
        //allow larger sites to rebuild
        ini_set('max_execution_time', 300);
        /** @var \Fred $fred */
        $fred =  $this->modx->services->get('fred');

        //Clear Element Values
        $this->modx->removeCollection('FredCache', []);

        $c = $this->modx->newQuery('FredThemedTemplate');
        $c->select($this->modx->getSelectColumns('FredThemedTemplate', 'FredThemedTemplate', '', ['template']));

        $c->prepare();
        $c->stmt->execute();

        $templates = $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
        $templates = array_map('intval', $templates);
        $templates = array_filter($templates);

        if (empty($templates)) {
            return $this->failure($this->modx->lexicon('fred.refresh_fail_template'));
        }

        $c = $this->modx->newQuery('modResource');
        $c->where(['template:IN' => $templates]);
        $results = $this->modx->getIterator('modResource', $c);

        foreach ($results as $resource) {
            $renderResource = new \Fred\RenderResource($resource, $this->modx);
            $renderResource->render();

            /* CacheMaster Script to rebuild output */

            /* get resource context and id */
            $ctx = $resource->get('context_key');
            $docId = $resource->get('id');
            /* set path to default cache file */
            $path = MODX_CORE_PATH . 'cache/resource/' . $ctx . '/resources/' . $docId . '.cache.php';
            $ck = $resource->getCacheKey();
            $mgrCtx = $this->modx->context->get('key');
            $cKey = str_replace($mgrCtx, $ctx, $ck);
            $this->modx->cacheManager->delete(
                $cKey,
                [
                    \xPDO::OPT_CACHE_KEY => $this->modx->getOption('cache_resource_key', null, 'resource'),
                    \xPDO::OPT_CACHE_HANDLER => $this->modx->getOption(
                        'cache_resource_handler',
                        null,
                        $this->modx->getOption(\xPDO::OPT_CACHE_HANDLER)
                    ),
                    \xPDO::OPT_CACHE_FORMAT => (int)$this->modx->getOption(
                        'cache_resource_format',
                        null,
                        $this->modx->getOption(\xPDO::OPT_CACHE_FORMAT, null, \xPDOCacheManager::CACHE_PHP)
                    )
                ]
            );
            /* clear the cache the old-fashioned way, just in case */
            if ($path && file_exists($path)) {
                unlink($path);
            }

            /* End CacheMaster Script */

            $this->modx->log(\modX::LOG_LEVEL_INFO, $this->modx->lexicon('fred.refresh_id', ['id' => $resource->id]));
        }

        $this->modx->log(\modX::LOG_LEVEL_INFO, $this->modx->lexicon('fred.refresh_complete'));

        return $this->success('');
    }
}
