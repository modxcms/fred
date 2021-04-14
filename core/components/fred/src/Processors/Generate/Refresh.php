<?php
namespace Fred\Processors\Generate;

use Fred\Fred;
use Fred\Model\FredThemedTemplate;
use MODX\Revolution\modResource;
use MODX\Revolution\modX;
use MODX\Revolution\Processors\Processor;
use xPDO\Cache\xPDOCacheManager;
use xPDO\xPDO;

class Refresh extends Processor
{
    public function checkPermissions()
    {
        return $this->modx->hasPermission('empty_cache');
    }

    public function process()
    {
        /** @var Fred $fred */
        $fred =  $this->modx->services->get('fred');

        $c = $this->modx->newQuery(FredThemedTemplate::class);
        $c->select($this->modx->getSelectColumns(FredThemedTemplate::class, 'FredThemedTemplate', '', ['template']));

        $c->prepare();
        $c->stmt->execute();

        $templates = $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
        $templates = array_map('intval', $templates);
        $templates = array_filter($templates);

        if (empty($templates)) {
            return $this->failure($this->modx->lexicon('fred.refresh_fail_template'));
        }

        $c = $this->modx->newQuery(modResource::class);
        $c->where(array('template:IN' => $templates));
        $results = $this->modx->getIterator(modResource::class, $c);

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
            $this->modx->cacheManager->delete($cKey, array(
                    xPDO::OPT_CACHE_KEY => $this->modx->getOption('cache_resource_key', null, 'resource'),
                    xPDO::OPT_CACHE_HANDLER => $this->modx->getOption('cache_resource_handler', null,
                        $this->modx->getOption(xPDO::OPT_CACHE_HANDLER)),
                    xPDO::OPT_CACHE_FORMAT => (integer)$this->modx->getOption('cache_resource_format', null,
                        $this->modx->getOption(xPDO::OPT_CACHE_FORMAT, null, xPDOCacheManager::CACHE_PHP))
                )
            );
            /* clear the cache the old-fashioned way, just in case */
            if ($path && file_exists($path)) {
                unlink($path);
            }

            /* End CacheMaster Script */

            $this->modx->log(modX::LOG_LEVEL_INFO, $this->modx->lexicon('fred.refresh_id', array('id' => $resource->id)));

        }

        $this->modx->log(modX::LOG_LEVEL_INFO, $this->modx->lexicon('fred.refresh_complete'));

        return $this->success('');
    }
}
