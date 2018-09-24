# Fred
The friendly front-end editor … documentation at https://modxcms.github.io/fred/

## Folder structure
- `_build/assets/js` - source codes for Frontend part
- `_build/assets/sass` - source codes for Frontend styles
- `assets/components/fred/mgr` - CMP part
- `assets/components/fred/web` - Assets to be used on Frontend
- `assets/components/fred/web/endpoints` - XHR endpoints
- `core/components/fred/model/fred/src` - Autoloaded directory for Fred namespace
- `core/components/fred/model/fred/src/Endpoint` - Implementation for XHR endpoints

## Prerequisites for DEV
- MODX Revolution
- GPM
- Composer
- Node JS
- ruby sass

## Develop
- `npm install` from root
- `composer install` from core/components/fred/model

### Build
 - `npm run build-dev` (starts watchers)
 - `npm run build` (also minifies and other things for prod.)
