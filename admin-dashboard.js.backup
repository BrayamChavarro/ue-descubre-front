// Variables globales para el dashboard
let dashboardData = null;

// Nombres de los arquetipos para mostrar
const archetypeNames = {
    0: "Administración de Empresas",
    1: "Finanzas y Comercio Exterior", 
    2: "Negocios Internacionales",
    3: "Diseño de Producto",
    4: "Marketing",
    5: "Ingeniería Industrial",
    6: "Ingeniería de Software",
    7: "Gestión Comercial",
    8: "Producción Industrial",
    9: "Gestión del Talento Humano"
};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, iniciando dashboard...');
    checkAuthentication();
});

// Verificar autenticación
async function checkAuthentication() {
    try {
        const response = await fetch('/api/auth/verify', {
            credentials: 'include'
        });
        
        if (!response.ok || !response.status === 200) {
            window.location.href = '/admin/login';
            return;
        }
        
        const result = await response.json();
        
        if (result.success && result.authenticated) {
            loadDashboardData();
            showUserInfo(result.data);
        } else {
            window.location.href = '/admin/login';
        }
    } catch (error) {
        window.location.href = '/admin/login';
    }
}

// Mostrar información del usuario
function showUserInfo(userData) {
    // Actualizar la información del usuario en el header
    document.getElementById('admin-username').textContent = userData.username;
    document.getElementById('admin-role').textContent = userData.role;
}

// Función de logout
async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.href = '/admin/login';
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

// Cargar datos del dashboard
async function loadDashboardData() {
    try {
        console.log('Cargando datos del dashboard...');
        
        // Cargar estadísticas generales
        const statsResponse = await fetch('/api/estadisticas', {
            credentials: 'include'
        });
        
        if (!statsResponse.ok) {
            throw new Error(`Error HTTP: ${statsResponse.status}`);
        }
        
        const statsResult = await statsResponse.json();
        console.log('Datos de estadísticas:', statsResult);
        
        if (statsResult.success) {
            dashboardData = statsResult.data;
            updateDashboardStats(statsResult.data);
        }
        
        // Cargar estudiantes recientes
        const studentsResponse = await fetch('/api/estudiantes?limit=5', {
            credentials: 'include'
        });
        
        if (studentsResponse.ok) {
            const studentsResult = await studentsResponse.json();
            if (studentsResult.success) {
                // La API devuelve { success: true, data: [...], pagination: {...} }
                const estudiantes = Array.isArray(studentsResult.data) ? studentsResult.data : (studentsResult.data.estudiantes || []);
                console.log('Estudiantes recientes recibidos:', estudiantes.length);
                displayRecentActivity(estudiantes);
            }
        }
        
    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        showError('Error al cargar los datos del dashboard: ' + error.message);
    }
}

// Actualizar estadísticas del dashboard
function updateDashboardStats(data) {
    // Actualizar estadísticas generales
    document.getElementById('total-estudiantes').textContent = data.totalEstudiantes;
    document.getElementById('estudiantes-30-dias').textContent = data.estudiantesUltimos30Dias;
    
    // Programa más popular
    if (data.estadisticasArchetype && data.estadisticasArchetype.length > 0) {
        const programaPopular = data.estadisticasArchetype[0];
        document.getElementById('programa-popular').textContent = programaPopular.programa;
    }
}

// Mostrar actividad reciente
function displayRecentActivity(estudiantes) {
    const container = document.getElementById('recent-activity');
    
    if (!estudiantes || estudiantes.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-inbox text-gray-400 text-xl"></i>
                </div>
                <p class="text-gray-500 font-medium">No hay actividad reciente</p>
                <p class="text-gray-400 text-sm">Los nuevos estudiantes aparecerán aquí</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = estudiantes.map(estudiante => {
        const fecha = new Date(estudiante.fechaCompletado).toLocaleDateString('es-ES');
        const hora = new Date(estudiante.fechaCompletado).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
                    <span class="text-white font-semibold">${estudiante.nombre.charAt(0).toUpperCase()}</span>
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="font-semibold text-gray-900">${estudiante.nombre}</h4>
                            <p class="text-sm text-gray-600">${estudiante.resultado.programa}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-sm font-medium text-gray-900">${fecha}</div>
                            <div class="text-xs text-gray-500">${hora}</div>
                        </div>
                    </div>
                    <div class="mt-2 flex items-center">
                        <div class="w-20 h-2 bg-gray-200 rounded-full mr-2">
                            <div class="h-2 bg-gradient-to-r from-red-500 to-blue-600 rounded-full" style="width: ${estudiante.resultado.compatibilidad}%"></div>
                        </div>
                        <span class="text-sm font-medium text-gray-600">${estudiante.resultado.compatibilidad}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Refrescar datos
function refreshData() {
    loadDashboardData();
}

// Mostrar error
function showError(message) {
    console.error('Error:', message);
    // Crear o actualizar elemento de error
    let errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50';
        document.body.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}
