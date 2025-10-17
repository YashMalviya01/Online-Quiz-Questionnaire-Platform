const DEFAULT_API_PORT = '4000';
const DEV_PORTS = new Set(['5173', '5174']);

const stripTrailingSlash = (value = '') => {
  if (!value || value === '/' || value.endsWith('://')) {
    return value;
  }
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const isLoopback = (value = '') => {
  try {
    const { hostname } = new URL(value);
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
  } catch (error) {
    return value.includes('localhost');
  }
};

export const resolveApiBase = (providedEnv) => {
  const env = providedEnv || (typeof import.meta !== 'undefined' ? import.meta.env : {}) || {};
  const envBase = env.VITE_API_BASE_URL;
  const envPort = env.VITE_API_PORT || DEFAULT_API_PORT;

  if (envBase && !isLoopback(envBase)) {
    return stripTrailingSlash(envBase);
  }

  if (typeof window !== 'undefined' && window.location) {
    const { protocol, hostname, port } = window.location;
    if (DEV_PORTS.has(port)) {
      return `${protocol}//${hostname}:${envPort}`;
    }

    const origin = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    return stripTrailingSlash(origin);
  }

  return `http://localhost:${envPort}`;
};

export const resolveWsBase = (providedEnv) => {
  const env = providedEnv || (typeof import.meta !== 'undefined' ? import.meta.env : {}) || {};
  const wsOverride = env.VITE_WS_URL;

  if (wsOverride && !isLoopback(wsOverride)) {
    return stripTrailingSlash(wsOverride);
  }

  const apiBase = resolveApiBase(env);
  try {
    const url = new URL(apiBase);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return stripTrailingSlash(url.toString());
  } catch (error) {
    return stripTrailingSlash(apiBase.replace(/^http/, 'ws'));
  }
};
