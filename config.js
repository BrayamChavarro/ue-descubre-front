// Configuración del API para el frontend
const API_CONFIG = {
    BASE_URL: 'https://ue-descubre.vercel.app',
    ENDPOINTS: {
        HEALTH: '/api/health',
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        VERIFY: '/api/auth/verify',
        ESTUDIANTES: '/api/estudiantes',
        REGISTRO_ESTUDIANTE: '/api/estudiantes/registro',
        ADMIN_STATS: '/api/estadisticas'
    },
    REQUEST_OPTIONS: {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Para manejar cookies de sesión
    }
};

// Función helper para construir URLs
function buildApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Función helper para hacer requests al API
async function apiRequest(endpoint, options = {}) {
    const url = buildApiUrl(endpoint);
    const requestOptions = {
        ...API_CONFIG.REQUEST_OPTIONS,
        ...options,
        headers: {
            ...API_CONFIG.REQUEST_OPTIONS.headers,
            ...(options.headers || {})
        }
    };

    try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error(`API Request Error [${endpoint}]:`, error);
        throw error;
    }
}

// Exponer funciones para uso global
window.API_CONFIG = API_CONFIG;
window.buildApiUrl = buildApiUrl;
window.apiRequest = apiRequest;