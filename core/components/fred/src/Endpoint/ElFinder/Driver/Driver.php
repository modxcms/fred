<?php

namespace Fred\Endpoint\ElFinder\Driver;

use Intervention\Image\ImageManager;
use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemException;

/**
 * elFinder driver for Flysytem (https://github.com/thephpleague/flysystem)
 *
 * @author Barry vd. Heuvel
 * */
class Driver extends \elFinderVolumeDriver
{

    /**
     * Driver id
     * Must be started from letter and contains [a-z0-9]
     * Used as part of volume id
     *
     * @var string
     **/
    protected $driverId = 'fls';

    /** @var Filesystem $fs */
    protected $fs;


    /** @var ImageManager $imageManager */
    protected $imageManager = null;

    /**
     * Constructor
     * Extend options with required fields
     *
     **/
    public function __construct()
    {
        $opts = [
            'filesystem'      => null,
            'imageManager'    => null,
            'checkSubfolders' => false, // Disable for performance
        ];

        $this->options = array_merge($this->options, $opts);
    }

    public function mount(array $opts)
    {
        // If path is not set, use the root
        if (!isset($opts['path']) || $opts['path'] === '') {
            $opts['path'] = '/';
        }

        return parent::mount($opts);
    }

    public function upload($fp, $dst, $name, $tmpname, $hashes = [])
    {
        return parent::upload($fp, $dst, $name, $tmpname, $hashes);
    }

    /**
     * Resize image
     *
     * @param  string  $hash  image file
     * @param  int  $width  new width
     * @param  int  $height  new height
     * @param  int  $x  X start poistion for crop
     * @param  int  $y  Y start poistion for crop
     * @param  string  $mode  action how to mainpulate image
     * @param  string  $bg  background color
     * @param  int  $degree  rotete degree
     * @param  int  $jpgQuality  JEPG quality (1-100)
     *
     * @return array|false
     * @author Dmitry (dio) Levashov
     * @author Alexey Sukhotin
     * @author nao-pon
     * @author Troex Nevelin
     **/
    public function resize($hash, $width, $height, $x, $y, $mode = 'resize', $bg = '', $degree = 0, $jpgQuality = null)
    {
        if ($this->commandDisabled('resize')) {
            return $this->setError(\elFinder::ERROR_PERM_DENIED);
        }

        if (($file = $this->file($hash)) == false) {
            return $this->setError(\elFinder::ERROR_FILE_NOT_FOUND);
        }

        if (!$file['write'] || !$file['read']) {
            return $this->setError(\elFinder::ERROR_PERM_DENIED);
        }

        $path = $this->decode($hash);
        if (!$this->canResize($path, $file)) {
            return $this->setError(\elFinder::ERROR_UNSUPPORT_TYPE);
        }

        if (!$image = $this->imageManager->make($this->_getContents($path))) {
            return false;
        }

        switch ($mode) {
            case 'propresize':
                $image->resize($width, $height, function ($constraint) {
                    $constraint->aspectRatio();
                });
                break;

            case 'crop':
                $image->crop($width, $height, $x, $y);
                break;

            case 'fitsquare':
                $image->fit($width, $height, null, 'center');
                break;

            case 'rotate':
                $image->rotate($degree);
                break;

            default:
                $image->resize($width, $height);
                break;
        }

        if ($jpgQuality && $image->mime() === 'image/jpeg') {
            $result = (string)$image->encode('jpg', $jpgQuality);
        } else {
            $result = (string)$image->encode();
        }
        if ($result && $this->_filePutContents($path, $result)) {
            $this->rmTmb($file);
            $this->clearstatcache();
            $stat = $this->stat($path);
            $stat['width'] = $image->width();
            $stat['height'] = $image->height();
            return $stat;
        }

        return false;
    }

    /**
     * Write a string to a file
     *
     * @param  string  $path  file path
     * @param  string  $content  new file content
     *
     * @return bool
     **/
    protected function _filePutContents($path, $content)
    {
        $this->fs->write($path, $content);
        return true;
    }

    /**
     * Return content URL
     *
     * @param  string  $hash  file hash
     * @param  array  $options  options
     *
     * @return string
     **/
    public function getContentUrl($hash, $options = [])
    {
        if (!empty($options['onetime']) && $this->options['onetimeUrl']) {
            // use parent method to make onetime URL
            return parent::getContentUrl($hash, $options);
        }
        if (!empty($options['temporary'])) {
            // try make temporary file
            $url = parent::getContentUrl($hash, $options);
            if ($url) {
                return $url;
            }
        }
        if (($file = $this->file($hash)) == false || !isset($file['url']) || !$file['url'] || $file['url'] == 1) {
            if ($file && !empty($file['url']) && !empty($options['temporary'])) {
                return parent::getContentUrl($hash, $options);
            }
            return parent::getContentUrl($hash, $options);
        }
        return $file['url'];
    }

    protected function clearcache()
    {
        parent::clearcache();
    }

    /**
     * Prepare driver before mount volume.
     * Return true if volume is ready.
     *
     * @return bool
     **/
    protected function init()
    {
        $this->fs = $this->options['filesystem'];
        if (!($this->fs instanceof Filesystem)) {
            return $this->setError('A filesystem instance is required');
        }

        $this->options['icon'] = $this->options['icon']
            ?: (empty($this->options['rootCssClass']) ? $this->getIcon() : '');
        $this->root = $this->options['path'];

        if ($this->options['imageManager']) {
            $this->imageManager = $this->options['imageManager'];
        } else {
            $this->imageManager = new ImageManager();
        }

        // enable command archive
        $this->options['useRemoteArchive'] = true;

        return true;
    }

    /**
     * Find the icon based on the used Adapter
     *
     * @return string
     */
    protected function getIcon()
    {
        // Can't get adapter on v2
        //        try {
        //            $adapter = $this->fs->getAdapter();
        //        } catch (\Exception $e) {
        //            $adapter = null;
        //        }

        //        if ($adapter instanceof CachedAdapter) {
        //            $adapter = $adapter->getAdapter();
        //        }

        $icon = 'volume_icon_local.png';

        //        if ($adapter instanceof League\Flysystem\Adapter\AbstractFtpAdapter) {
        //            $icon = 'volume_icon_ftp.png';
        //        } elseif ($adapter instanceof League\Flysystem\Dropbox\DropboxAdapter) {
        //            $icon = 'volume_icon_dropbox.png';
        //        }

        $parentUrl = defined('ELFINDER_IMG_PARENT_URL') ? (rtrim(ELFINDER_IMG_PARENT_URL, '/') . '/') : '';
        return $parentUrl . 'img/' . $icon;
    }

    /**
     * Configure after successful mount.
     *
     * @return void
     **/
    protected function configure()
    {
        parent::configure();
    }

    /**
     * Return normalized path
     *
     * @param  string  $path  path
     *
     * @return string
     **/
    protected function _normpath($path)
    {
        return $path;
    }

    /***************** file stat ********************/

    /**
     * Check if the directory exists in the parent directory. Needed because not all drives handle directories
     * correctly.
     *
     * @param  string  $path  path
     *
     * @return boolean
     **/
    protected function _dirExists($path)
    {
        $dir = $this->_dirname($path);
        $basename = basename($path);

        foreach ($this->fs->listContents($dir) as $meta) {
            if ($meta && $meta['type'] !== 'file' && $meta['basename'] == $basename) {
                return true;
            }
        }

        return false;
    }

    /**
     * Return parent directory path
     *
     * @param  string  $path  file path
     *
     * @return string
     **/
    protected function _dirname($path)
    {
        return Utils::dirname($path) ?: '/';
    }

    /******************** file/dir content *********************/

    /**
     * Return stat for given path.
     * Stat contains following fields:
     * - (int)    size    file size in b. required
     * - (int)    ts      file modification time in unix time. required
     * - (string) mime    mimetype. required for folders, others - optionally
     * - (bool)   read    read permissions. required
     * - (bool)   write   write permissions. required
     * - (bool)   locked  is object locked. optionally
     * - (bool)   hidden  is object hidden. optionally
     * - (string) alias   for symlinks - link target path relative to root path. optionally
     * - (string) target  for symlinks - link target path. optionally
     *
     * If file does not exists - returns empty array or false.
     *
     * @param  string  $path  file path
     *
     * @return array|false
     **/
    protected function _stat($path)
    {
        $stat = [
            'size'   => 0,
            'ts'     => time(),
            'read'   => true,
            'write'  => true,
            'locked' => false,
            'hidden' => false,
            'mime'   => 'directory',
        ];

        // If root, just return from above
        if ($this->root == $path) {
            $stat['name'] = $this->root;
            return $stat;
        }


        $name = explode(DIRECTORY_SEPARATOR, $path);
        $stat['name'] = array_pop($name);

        try {
            // Get timestamp/size if available
            $stat['ts'] = $this->fs->lastModified($path);
        } catch (FilesystemException $e) {
        }

        try {
            $stat['size'] = $this->fs->fileSize($path);
        } catch (FilesystemException $e) {
        }

        try {
            $stat['mime'] = $this->fs->mimeType($path);
        } catch (FilesystemException $e) {
        }

        // Check if file, if so, check mimetype when available
        if ($stat['mime'] !== 'directory') {
            $imgMimes = ['image/jpeg', 'image/png', 'image/gif'];

            if (in_array($stat['mime'], $imgMimes)) {
                $stat['tmb'] = $this->URL . $path;
            }
        }

        return $stat;
    }

    /**
     * Return true if path is dir and has at least one childs directory
     *
     * @param  string  $path  dir path
     *
     * @return bool
     **/
    protected function _subdirs($path)
    {
        $contents = $this->fs->listContents($path);
        foreach ($contents as $content) {
            if ($content['type'] === 'dir') {
                return true;
            }
        }

        return false;
    }

    /**
     * Return object width and height
     * Usually used for images, but can be realize for video etc...
     *
     * @param  string  $path  file path
     * @param  string  $mime  file mime type
     *
     * @return string
     **/
    protected function _dimensions($path, $mime)
    {
        try {
            $imgsize = $this->getImageSize($path, $mime);
        } catch (\Exception $e) {
            return false;
        }

        if (!$imgsize) {
            return false;
        }

        return $imgsize['dimensions'];
    }

    /********************  file/dir manipulations *************************/

    public function getImageSize($path, $mime = '')
    {
        $size = false;
        if ($mime === '' || strtolower(substr($mime, 0, 5)) === 'image') {
            if ($data = $this->_getContents($path)) {
                if ($size = @getimagesizefromstring($data)) {
                    $size['dimensions'] = $size[0] . 'x' . $size[1];
                }
            }
        }
        return $size;
    }

    /**
     * Get file contents
     *
     * @param  string  $path  file path
     *
     * @return string|false
     **/
    protected function _getContents($path)
    {
        return $this->fs->read($path);
    }

    /**
     * Return files list in directory
     *
     * @param  string  $path  dir path
     *
     * @return array
     **/
    protected function _scandir($path)
    {
        $paths = [];
        foreach ($this->fs->listContents($path, false) as $object) {
            if ($object) {
                $paths[] = $object->path();
            }
        }

        return $paths;
    }

    /**
     * Open file and return file pointer
     *
     * @param  string  $path  file path
     * @param  string  $mode
     *
     * @return resource|false
     **/
    protected function _fopen($path, $mode = "rb")
    {
        return $this->fs->readStream($path);
    }

    /**
     * Close opened file
     *
     * @param  resource  $fp  file pointer
     * @param  string  $path  file path
     *
     * @return bool
     **/
    protected function _fclose($fp, $path = '')
    {
        return @fclose($fp);
    }

    /**
     * Create dir and return created dir path or false on failed
     *
     * @param  string  $path  parent dir path
     * @param  string  $name  new directory name
     *
     * @return string|bool
     **/
    protected function _mkdir($path, $name)
    {
        $path = $this->_joinPath($path, $name);

        if ($this->fs->createDirectory($path) === false) {
            return false;
        }

        return $path;
    }

    /**
     * Join dir name and file name and return full path
     *
     * @param  string  $dir
     * @param  string  $name
     *
     * @return string
     * @author Dmitry (dio) Levashov
     **/
    protected function _joinPath($dir, $name)
    {
        return Utils::normalizePath($dir . $this->separator . $name);
    }

    /**
     * Create file and return it's path or false on failed
     *
     * @param  string  $path  parent dir path
     * @param  string  $name  new file name
     *
     * @return string|bool
     **/
    protected function _mkfile($path, $name)
    {
        $path = $this->_joinPath($path, $name);

        if ($this->fs->write($path, '') === false) {
            return false;
        }

        return $path;
    }

    /**
     * Copy file into another file
     *
     * @param  string  $source  source file path
     * @param  string  $target  target directory path
     * @param  string  $name  new file name
     *
     * @return string|bool
     **/
    protected function _copy($source, $target, $name)
    {
        $path = $this->_joinPath($target, $name);

        if ($this->fs->copy($source, $path) === false) {
            return false;
        }

        return $path;
    }

    /*********************** paths/urls *************************/

    /**
     * Move file into another parent dir.
     * Return new file path or false.
     *
     * @param  string  $source  source file path
     * @param  string  $target  target dir path
     * @param  string  $name  file name
     *
     * @return string|bool
     **/
    protected function _move($source, $target, $name)
    {
        $path = $this->_joinPath($target, $name);

        if ($this->fs->move($source, $path) === false) {
            return false;
        }

        return $path;
    }

    /**
     * Remove file
     *
     * @param  string  $path  file path
     *
     * @return bool
     **/
    protected function _unlink($path)
    {
        $this->fs->delete($path);
        return true;
    }

    /**
     * Remove dir
     *
     * @param  string  $path  dir path
     *
     * @return bool
     **/
    protected function _rmdir($path)
    {
        $this->fs->deleteDirectory($path);
        return true;
    }

    /**
     * Create new file and write into it from file pointer.
     * Return new file path or false on error.
     *
     * @param  resource  $fp  file pointer
     * @param  string  $dir  target dir path
     * @param  string  $name  file name
     * @param  array  $stat  file stat (required by some virtual fs)
     *
     * @return bool|string
     **/
    protected function _save($fp, $dir, $name, $stat)
    {
        $path = $this->_joinPath($dir, $name);
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        $config = [];
        if (isset(self::$mimetypes[$ext])) {
            $config['mimetype'] = self::$mimetypes[$ext];
        }

        if (isset($this->options['visibility'])) {
            $config['visibility'] = $this->options['visibility'];
        }

        if ($this->fs->writeStream($path, $fp, $config) === false) {
            return false;
        }

        return $path;
    }

    /**
     * Return file name
     *
     * @param  string  $path  file path
     *
     * @return string
     * @author Dmitry (dio) Levashov
     **/
    protected function _basename($path)
    {
        return basename($path);
    }

    /**
     * Return file path related to root dir
     *
     * @param  string  $path  file path
     *
     * @return string
     **/
    protected function _relpath($path)
    {
        return $path;
    }

    /**
     * Convert path related to root dir into real path
     *
     * @param  string  $path  file path
     *
     * @return string
     **/
    protected function _abspath($path)
    {
        return $path;
    }

    /**
     * Return fake path started from root dir
     *
     * @param  string  $path  file path
     *
     * @return string
     **/
    protected function _path($path)
    {
        return $this->rootName . $this->separator . $path;
    }

    /**
     * Return true if $path is children of $parent
     *
     * @param  string  $path  path to check
     * @param  string  $parent  parent path
     *
     * @return bool
     * @author Dmitry (dio) Levashov
     **/
    protected function _inpath($path, $parent)
    {
        return $path == $parent || strpos($path, $parent . '/') === 0;
    }

    /**
     * Create symlink
     *
     * @param  string  $source  file to link to
     * @param  string  $targetDir  folder to create link in
     * @param  string  $name  symlink name
     *
     * @return bool
     **/
    protected function _symlink($source, $targetDir, $name)
    {
        return false;
    }

    /**
     * Extract files from archive
     *
     * @param  string  $path  file path
     * @param  array  $arc  archiver options
     *
     * @return bool
     **/
    protected function _extract($path, $arc)
    {
        return false;
    }

    /**
     * Create archive and return its path
     *
     * @param  string  $dir  target dir
     * @param  array  $files  files names list
     * @param  string  $name  archive name
     * @param  array  $arc  archiver options
     *
     * @return string|bool
     **/
    protected function _archive($dir, $files, $name, $arc)
    {
        return false;
    }

    /**
     * Detect available archivers
     *
     * @return void
     **/
    protected function _checkArchivers()
    {
        return;
    }

    /**
     * chmod implementation
     *
     * @return bool
     **/
    protected function _chmod($path, $mode)
    {
        return false;
    }

}
