import JsSHA from 'jssha';

const cache = () => {
    const cache = {};

    const setValue = (namespace: string, name: string, value: any, expires: number) => {
        if (!cache[namespace]) cache[namespace] = {};
        if (!cache[namespace][name]) cache[namespace][name] = {};

        cache[namespace][name]['value'] = value;
        cache[namespace][name]['expires'] = expires;
    };

    const load = (namespace: string, properties: {[key: string]: any}, loadFn: () => any, expires: number = 300) => {
        const shaObj = new JsSHA("SHA-256", "TEXT");
        shaObj.update(JSON.stringify(properties));
        const name = shaObj.getHash('HEX');

        const now = Math.floor(Date.now() / 1000);

        if (cache[namespace] && cache[namespace][name] && (cache[namespace][name]['expires'] > now)) {
            return Promise.resolve(cache[namespace][name]['value']);
        }

        return Promise.resolve(loadFn()).then(value => {
            setValue(namespace, name, value, now + expires);
            return value;
        });
    }

    const kill = (namespace: string, properties: {[key: string]: any}) => {
        const shaObj = new JsSHA("SHA-256", "TEXT");
        shaObj.update(JSON.stringify(properties));
        const name = shaObj.getHash('HEX');

        if (cache[namespace] && cache[namespace][name]) {
            delete cache[namespace][name];
        }
    }

    const killNamespace = (namespace: string) => {
        if (cache[namespace]) {
            delete cache[namespace];
        }
    }

    return {
        load,
        kill,
        killNamespace
    };

};

const cacheInstance = cache();
export default cacheInstance;
