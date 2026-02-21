
const isProdEnv = false; // Simulating dev
const extraImageHosts = ('').split(',').map(h => h.trim()).filter(Boolean);
const rawR2 = '';
let r2Host = '';
const rawBackend = '';
let backendHost = '';

const baseImageHosts = [
    'images.unsplash.com',
    'gadizone.com',
    'www.gadizone.com',
    r2Host,
    backendHost,
    'pub-a4a4bb84fc2d41cba103f4e2a8b5d185.r2.dev',
    ...extraImageHosts,
].filter(Boolean);

const devImageHosts = ['localhost', '127.0.0.1'];
const imageHosts = isProdEnv ? baseImageHosts : [...baseImageHosts, ...devImageHosts];

const remotePatterns = imageHosts.flatMap((hostname) => {
    const patterns = [{ protocol: 'https', hostname, pathname: '/**' }];
    if (!isProdEnv && (hostname === 'localhost' || hostname === '127.0.0.1')) {
        patterns.push({ protocol: 'http', hostname, pathname: '/**' });
    }
    return patterns;
});

console.log(JSON.stringify(remotePatterns, null, 2));
