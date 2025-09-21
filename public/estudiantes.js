// Variables globales
let currentPage = 1;
let currentFilters = {};

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
    console.log('DOM cargado, iniciando aplicación de estudiantes...');
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
            loadStudents();
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

// Cargar lista de estudiantes
async function loadStudents(page = 1) {
    try {
        console.log('Cargando estudiantes, página:', page);
        showLoading(true);
        
        const params = new URLSearchParams({
            page: page,
            limit: 20,
            ...currentFilters
        });
        
        console.log('Parámetros de búsqueda:', params.toString());
        
        const response = await fetch(`/api/estudiantes?${params}`, {
            credentials: 'include'
        });
        
        console.log('Respuesta del servidor:', response.status);
        
        if (!response.ok) {
            throw new Error('Error al cargar estudiantes');
        }
        
        const result = await response.json();
        console.log('Datos recibidos:', result);
        
        if (result.success) {
            // La API devuelve { success: true, data: [...], pagination: {...} }
            const estudiantes = Array.isArray(result.data) ? result.data : (result.data.estudiantes || []);
            const pagination = result.pagination || result.data.pagination;
            
            console.log('Estudiantes recibidos:', estudiantes.length);
            console.log('Paginación:', pagination);
            console.log('Primer estudiante:', estudiantes[0]);
            
            displayStudents(estudiantes);
            displayPagination(pagination);
            currentPage = page;
        } else {
            console.error('Error en la respuesta:', result.message);
            showError('Error al cargar los estudiantes: ' + result.message);
        }
        
    } catch (error) {
        console.error('Error cargando estudiantes:', error);
        showError('Error al cargar los estudiantes: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Mostrar estudiantes en la tabla
function displayStudents(estudiantes) {
    const tbody = document.getElementById('estudiantes-table');
    tbody.innerHTML = '';
    
    if (estudiantes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-search text-gray-400 text-xl"></i>
                        </div>
                        <p class="text-gray-500 font-medium">No se encontraron estudiantes</p>
                        <p class="text-gray-400 text-sm">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    estudiantes.forEach(estudiante => {
        console.log('🔍 Procesando estudiante completo:', estudiante);
        console.log('🔍 Campos disponibles:', Object.keys(estudiante));
        console.log('🔍 ID del estudiante:', {
            _id: estudiante._id,
            id: estudiante.id,
            estudianteId: estudiante.estudianteId
        });
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        
        const fecha = new Date(estudiante.fechaCompletado).toLocaleDateString('es-ES');
        const hora = new Date(estudiante.fechaCompletado).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        
        // Determinar el color de la compatibilidad
        let compatibilidadColor = 'bg-green-100 text-green-800';
        if (estudiante.resultado.compatibilidad < 70) {
            compatibilidadColor = 'bg-yellow-100 text-yellow-800';
        } else if (estudiante.resultado.compatibilidad < 85) {
            compatibilidadColor = 'bg-blue-100 text-blue-800';
        }
        
        row.innerHTML = `
            <td class="w-2/5 px-4 py-3">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-white font-semibold text-xs">${estudiante.nombre.charAt(0).toUpperCase()}</span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="text-sm font-semibold text-gray-900 truncate">${estudiante.nombre}</div>
                        <div class="text-xs text-gray-500 truncate">
                            <i class="fas fa-envelope mr-1"></i>
                            ${estudiante.email}
                        </div>
                    </div>
                </div>
            </td>
            <td class="w-1/5 px-4 py-3">
                <div class="text-sm font-semibold text-gray-900 truncate">${estudiante.resultado.programa}</div>
                <div class="text-xs text-gray-500 truncate">${estudiante.resultado.nombreArchetype}</div>
            </td>
            <td class="w-1/5 px-4 py-3">
                <div class="flex items-center">
                    <div class="w-10 h-4 bg-gray-200 rounded-full mr-2">
                        <div class="h-4 bg-gradient-to-r from-red-500 to-blue-600 rounded-full" style="width: ${estudiante.resultado.compatibilidad}%"></div>
                    </div>
                    <span class="text-xs font-semibold text-gray-900">${estudiante.resultado.compatibilidad}%</span>
                </div>
            </td>
            <td class="w-1/5 px-4 py-3">
                <div class="text-sm text-gray-900 font-medium">${fecha}</div>
                <div class="text-xs text-gray-500 flex items-center">
                    <i class="fas fa-clock mr-1"></i>
                    ${hora}
                </div>
            </td>
            <td class="w-20 px-2 py-3 text-center">
                <div class="flex items-center justify-center space-x-1">
                    <button onclick="viewStudentDetails('${getStudentId(estudiante) || ''}')" class="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors text-sm font-medium" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="deleteStudent('${getStudentId(estudiante) || ''}', '${estudiante.nombre || ''}', '${estudiante.email || ''}')" class="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors text-sm font-medium" title="Eliminar estudiante">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Mostrar paginación
function displayPagination(pagination) {
    const container = document.getElementById('pagination');
    
    if (!pagination || pagination.totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<div class="flex items-center justify-between">';
    
    // Información de paginación
    html += `<div class="text-sm text-gray-700">
        Mostrando ${((pagination.currentPage - 1) * pagination.limit) + 1} a ${Math.min(pagination.currentPage * pagination.limit, pagination.total)} de ${pagination.total} resultados
    </div>`;
    
    // Botones de navegación
    html += '<div class="flex space-x-2">';
    
    // Botón anterior
    if (pagination.currentPage > 1) {
        html += `<button onclick="loadStudents(${pagination.currentPage - 1})" class="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            <i class="fas fa-chevron-left mr-1"></i>
            Anterior
        </button>`;
    }
    
    // Números de página
    const startPage = Math.max(1, pagination.currentPage - 2);
    const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === pagination.currentPage;
        html += `<button onclick="loadStudents(${i})" class="px-3 py-1 rounded-md text-sm font-medium ${
            isActive 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }">
            ${i}
        </button>`;
    }
    
    // Botón siguiente
    if (pagination.currentPage < pagination.totalPages) {
        html += `<button onclick="loadStudents(${pagination.currentPage + 1})" class="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            Siguiente
            <i class="fas fa-chevron-right ml-1"></i>
        </button>`;
    }
    
    html += '</div></div>';
    container.innerHTML = html;
}

// Aplicar filtros
function applyFilters() {
    currentFilters = {};
    
    const archetype = document.getElementById('filter-archetype').value;
    const fechaDesde = document.getElementById('filter-fecha-desde').value;
    const fechaHasta = document.getElementById('filter-fecha-hasta').value;
    
    if (archetype) currentFilters.archetype = archetype;
    if (fechaDesde) currentFilters.fechaDesde = fechaDesde;
    if (fechaHasta) currentFilters.fechaHasta = fechaHasta;
    
    loadStudents(1);
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('filter-archetype').value = '';
    document.getElementById('filter-fecha-desde').value = '';
    document.getElementById('filter-fecha-hasta').value = '';
    
    currentFilters = {};
    loadStudents(1);
}

// Ver detalles de un estudiante
async function viewStudentDetails(id) {
    try {
        const response = await fetch(`/api/estudiantes/${id}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar detalles');
        }
        
        const result = await response.json();
        
        if (result.success) {
            displayStudentModal(result.data);
        } else {
            showError('Error al cargar los detalles: ' + result.message);
        }
        
    } catch (error) {
        console.error('Error cargando detalles:', error);
        showError('Error al cargar los detalles del estudiante');
    }
}

// Mostrar modal con detalles del estudiante
function displayStudentModal(estudiante) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    
    const fecha = new Date(estudiante.fechaCompletado).toLocaleString('es-ES');
    
    content.innerHTML = `
        <div class="space-y-4 sm:space-y-6">
            <!-- Información básica -->
            <div class="bg-gradient-to-r from-red-50 to-blue-50 p-4 sm:p-6 rounded-2xl border border-red-100">
                <div class="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-3">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-user text-white text-lg sm:text-xl"></i>
                    </div>
                    <div>
                        <h4 class="text-base sm:text-lg font-bold text-gray-900">Información Personal</h4>
                        <p class="text-xs sm:text-sm text-gray-600">Datos del estudiante</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div class="bg-white p-3 sm:p-4 rounded-xl">
                        <label class="text-xs sm:text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-user mr-2 text-red-600 text-xs sm:text-sm"></i>
                            Nombre:
                        </label>
                        <p class="text-gray-900 font-semibold text-sm sm:text-base break-words">${estudiante.nombre}</p>
                    </div>
                    <div class="bg-white p-3 sm:p-4 rounded-xl">
                        <label class="text-xs sm:text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-envelope mr-2 text-blue-600 text-xs sm:text-sm"></i>
                            Email:
                        </label>
                        <p class="text-gray-900 font-semibold text-sm sm:text-base break-all">${estudiante.email}</p>
                    </div>
                    <div class="bg-white p-3 sm:p-4 rounded-xl">
                        <label class="text-xs sm:text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-phone mr-2 text-red-600 text-xs sm:text-sm"></i>
                            Teléfono:
                        </label>
                        <p class="text-gray-900 font-semibold text-sm sm:text-base">${estudiante.telefono}</p>
                    </div>
                    <div class="bg-white p-3 sm:p-4 rounded-xl">
                        <label class="text-xs sm:text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-calendar mr-2 text-blue-600 text-xs sm:text-sm"></i>
                            Fecha de evaluación:
                        </label>
                        <p class="text-gray-900 font-semibold text-sm sm:text-base">${fecha}</p>
                    </div>
                </div>
            </div>
            
            <!-- Resultado -->
            <div class="bg-gradient-to-r from-red-50 to-blue-50 p-4 sm:p-6 rounded-2xl border border-red-100">
                <div class="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-3">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-trophy text-white text-lg sm:text-xl"></i>
                    </div>
                    <div>
                        <h4 class="text-base sm:text-lg font-bold text-gray-900">Resultado de la Evaluación</h4>
                        <p class="text-xs sm:text-sm text-gray-600">Perfil y recomendación</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div class="bg-white p-3 sm:p-4 rounded-xl">
                        <label class="text-xs sm:text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-user-tie mr-2 text-red-600 text-xs sm:text-sm"></i>
                            Arquetipo:
                        </label>
                        <p class="text-gray-900 font-bold text-sm sm:text-base lg:text-lg break-words">${estudiante.resultado.nombreArchetype}</p>
                    </div>
                    <div class="bg-white p-3 sm:p-4 rounded-xl">
                        <label class="text-xs sm:text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-graduation-cap mr-2 text-blue-600 text-xs sm:text-sm"></i>
                            Programa:
                        </label>
                        <p class="text-gray-900 font-bold text-sm sm:text-base lg:text-lg break-words">${estudiante.resultado.programa}</p>
                    </div>
                    <div class="bg-white p-3 sm:p-4 rounded-xl sm:col-span-2 lg:col-span-1">
                        <label class="text-xs sm:text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-percentage mr-2 text-red-600 text-xs sm:text-sm"></i>
                            Compatibilidad:
                        </label>
                        <p class="text-red-600 font-bold text-xl sm:text-2xl">${estudiante.resultado.compatibilidad}%</p>
                    </div>
                </div>
            </div>
            
            <!-- Puntuaciones por arquetipo -->
            <div class="bg-gradient-to-r from-red-50 to-blue-50 p-4 sm:p-6 rounded-2xl border border-red-100">
                <div class="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-3">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-chart-bar text-white text-lg sm:text-xl"></i>
                    </div>
                    <div>
                        <h4 class="text-base sm:text-lg font-bold text-gray-900">Puntuaciones por Programa</h4>
                        <p class="text-xs sm:text-sm text-gray-600">Comparación de compatibilidad</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    ${estudiante.puntuaciones.map(p => `
                        <div class="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl border ${p.archetypeId === estudiante.resultado.archetypeId ? 'border-red-500 bg-red-50' : 'border-gray-200'}">
                            <span class="text-xs sm:text-sm font-medium text-gray-700 break-words">${archetypeNames[p.archetypeId] || 'Programa ' + p.archetypeId}</span>
                            <div class="flex items-center flex-shrink-0">
                                <span class="text-lg font-bold ${p.archetypeId === estudiante.resultado.archetypeId ? 'text-red-600' : 'text-gray-600'}">${p.puntuacion}</span>
                                ${p.archetypeId === estudiante.resultado.archetypeId ? '<i class="fas fa-star text-yellow-500 ml-2"></i>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Respuestas detalladas -->
            <div class="bg-gradient-to-r from-red-50 to-blue-50 p-6 rounded-2xl border border-red-100">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                        <i class="fas fa-clipboard-list text-white text-xl"></i>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold text-gray-900">Respuestas Detalladas</h4>
                        <p class="text-sm text-gray-600">Evaluación completa</p>
                    </div>
                </div>
                <div class="space-y-4 max-h-80 overflow-y-auto">
                    ${estudiante.respuestas.map((respuesta, index) => `
                        <div class="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm">
                            <div class="flex items-center mb-2">
                                <span class="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">${respuesta.categoria}</span>
                                <span class="text-xs text-gray-500 ml-2">Pregunta ${index + 1}</span>
                            </div>
                            <div class="text-sm text-gray-900 mb-3 font-medium">${respuesta.pregunta}</div>
                            <div class="text-sm text-red-700 font-semibold bg-red-50 p-2 rounded-lg">${respuesta.respuesta}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// Cerrar modal
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Refrescar datos
function refreshData() {
    loadStudents(currentPage);
}

// Mostrar/ocultar loading
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.add('active');
    } else {
        loading.classList.remove('active');
    }
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

// Cerrar modal al hacer clic fuera
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Función para exportar todos los estudiantes
async function exportAllStudents() {
    try {
        showLoading(true);
        console.log('Iniciando exportación de todos los estudiantes...');
        
        // Verificar autenticación primero
        const authResponse = await fetch('/api/auth/verify', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!authResponse.ok || !authResponse.status === 200) {
            showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
            window.location.href = '/admin/login';
            return;
        }
        
        const authResult = await authResponse.json();
        if (!authResult.success || !authResult.authenticated) {
            showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
            window.location.href = '/admin/login';
            return;
        }
        
        // Obtener todos los estudiantes sin filtros
        const response = await fetch('/api/estudiantes?limit=10000', { 
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
                window.location.href = '/admin/login';
                return;
            }
            throw new Error(`Error al obtener datos de estudiantes: ${response.status}`);
        }
        
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        
        const estudiantes = Array.isArray(result.data) ? result.data : (result.data.estudiantes || []);
        console.log('Estudiantes obtenidos para exportación:', estudiantes.length);
        
        // Generar y descargar Excel
        generateExcelFile(estudiantes, 'todos_los_estudiantes');
        
        showSuccess(`Se exportaron ${estudiantes.length} estudiantes exitosamente`);
        
    } catch (error) {
        console.error('Error exportando estudiantes:', error);
        showError('Error al exportar estudiantes: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Función para exportar estudiantes filtrados
async function exportFilteredStudents() {
    try {
        showLoading(true);
        console.log('Iniciando exportación de estudiantes filtrados...');
        
        // Verificar autenticación primero
        const authResponse = await fetch('/api/auth/verify', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!authResponse.ok || !authResponse.status === 200) {
            showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
            window.location.href = '/admin/login';
            return;
        }
        
        const authResult = await authResponse.json();
        if (!authResult.success || !authResult.authenticated) {
            showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
            window.location.href = '/admin/login';
            return;
        }
        
        // Aplicar filtros actuales
        const params = new URLSearchParams({ limit: 10000, ...currentFilters });
        const response = await fetch(`/api/estudiantes?${params}`, { 
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
                window.location.href = '/admin/login';
                return;
            }
            throw new Error(`Error al obtener datos filtrados: ${response.status}`);
        }
        
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        
        const estudiantes = Array.isArray(result.data) ? result.data : (result.data.estudiantes || []);
        console.log('Estudiantes filtrados para exportación:', estudiantes.length);
        
        if (estudiantes.length === 0) {
            showError('No hay estudiantes que coincidan con los filtros aplicados');
            return;
        }
        
        // Generar nombre de archivo con filtros
        const filterName = generateFilterFileName();
        
        // Generar y descargar Excel
        generateExcelFile(estudiantes, filterName);
        
        showSuccess(`Se exportaron ${estudiantes.length} estudiantes filtrados exitosamente`);
        
    } catch (error) {
        console.error('Error exportando estudiantes filtrados:', error);
        showError('Error al exportar estudiantes filtrados: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Función para generar el archivo Excel
function generateExcelFile(estudiantes, fileName) {
    try {
        console.log('Generando archivo Excel...');
        
        // Preparar datos para Excel (solo datos esenciales)
        console.log('Preparando datos para Excel - Solo 6 columnas esenciales');
        const excelData = estudiantes.map(estudiante => {
            // Debug: mostrar información de la fecha
            console.log('Estudiante fechaCompletado original:', estudiante.fechaCompletado);
            console.log('Tipo de fechaCompletado:', typeof estudiante.fechaCompletado);
            
            // Formatear fecha de manera más robusta
            let fechaFormateada = 'N/A';
            if (estudiante.fechaCompletado) {
                try {
                    const fecha = new Date(estudiante.fechaCompletado);
                    console.log('Fecha parseada:', fecha);
                    console.log('Fecha válida:', !isNaN(fecha.getTime()));
                    
                    // Verificar que la fecha es válida
                    if (!isNaN(fecha.getTime())) {
                        // Formato DD/MM/YYYY para Excel
                        fechaFormateada = fecha.toLocaleDateString('es-CO', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });
                        console.log('Fecha formateada:', fechaFormateada);
                    }
                } catch (error) {
                    console.warn('Error formateando fecha:', estudiante.fechaCompletado, error);
                    fechaFormateada = 'N/A';
                }
            } else {
                console.log('No hay fechaCompletado para este estudiante');
            }
            
            const data = {
                'Nombre': estudiante.nombre || 'N/A',
                'Email': estudiante.email || 'N/A',
                'Teléfono': estudiante.telefono || 'N/A',
                'Programa': estudiante.resultado?.programa || 'N/A',
                'Compatibilidad (%)': estudiante.resultado?.compatibilidad || 0,
                'Fecha': fechaFormateada
            };
            console.log('Datos del estudiante para Excel:', data);
            return data;
        });
        
        console.log('Total de columnas en Excel:', Object.keys(excelData[0] || {}).length);
        console.log('Columnas incluidas:', Object.keys(excelData[0] || {}));
        
        // Crear libro de trabajo
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        // Configurar ancho de columnas (optimizado para datos esenciales)
        const colWidths = [
            { wch: 30 }, // Nombre
            { wch: 35 }, // Email
            { wch: 18 }, // Teléfono
            { wch: 35 }, // Programa
            { wch: 18 }, // Compatibilidad
            { wch: 15 }  // Fecha
        ];
        ws['!cols'] = colWidths;
        
        // Agregar hoja al libro
        XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');
        
        // Generar nombre de archivo con fecha
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const finalFileName = `estudiantes_${fileName}_${dateStr}.xlsx`;
        
        // Descargar archivo
        XLSX.writeFile(wb, finalFileName);
        
        console.log('Archivo Excel generado exitosamente:', finalFileName);
        
    } catch (error) {
        console.error('Error generando archivo Excel:', error);
        throw new Error('Error al generar el archivo Excel: ' + error.message);
    }
}

// Función para generar nombre de archivo basado en filtros
function generateFilterFileName() {
    const filters = [];
    
    if (currentFilters.archetype) {
        const programName = archetypeNames[currentFilters.archetype] || `Programa_${currentFilters.archetype}`;
        filters.push(programName.replace(/\s+/g, '_'));
    }
    
    if (currentFilters.fechaDesde) {
        filters.push(`desde_${currentFilters.fechaDesde}`);
    }
    
    if (currentFilters.fechaHasta) {
        filters.push(`hasta_${currentFilters.fechaHasta}`);
    }
    
    if (currentFilters.search) {
        filters.push(`busqueda_${currentFilters.search.substring(0, 10)}`);
    }
    
    return filters.length > 0 ? `filtrados_${filters.join('_')}` : 'filtrados';
}

// Función para mostrar mensaje de éxito
function showSuccess(message) {
    console.log('Éxito:', message);
    // Crear o actualizar elemento de éxito
    let successDiv = document.getElementById('success-message');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.id = 'success-message';
        successDiv.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50';
        document.body.appendChild(successDiv);
    }
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

// Variables globales para el modal de eliminación
let currentDeleteStudentId = null;
let currentDeleteStudentName = null;
let currentDeleteStudentEmail = null;

// Función para almacenar datos de eliminación de forma segura
function storeDeleteData(studentId, studentName, studentEmail) {
    console.log('🔍 Almacenando datos de eliminación:', { studentId, studentName, studentEmail });
    currentDeleteStudentId = studentId;
    currentDeleteStudentName = studentName;
    currentDeleteStudentEmail = studentEmail;
    console.log('✅ Datos almacenados:', { currentDeleteStudentId, currentDeleteStudentName, currentDeleteStudentEmail });
}

// Función auxiliar para obtener el ID del estudiante
function getStudentId(estudiante) {
    // Intentar diferentes campos posibles para el ID
    return estudiante._id || estudiante.id || estudiante.estudianteId || null;
}

// Función para eliminar un estudiante
async function deleteStudent(studentId, studentName, studentEmail = '') {
    console.log('🔍 Datos recibidos en deleteStudent:', {
        studentId,
        studentName,
        studentEmail
    });
    
    // Validar que el ID no sea null o undefined
    if (!studentId || studentId === 'null' || studentId === 'undefined') {
        console.error('❌ Error: studentId es null o undefined:', studentId);
        showError('Error: No se pudo obtener el ID del estudiante');
        return;
    }
    
    // Guardar datos del estudiante a eliminar usando función segura
    storeDeleteData(studentId, studentName, studentEmail);
    
    // Mostrar modal de confirmación
    showDeleteModal();
}

// Función para mostrar el modal de eliminación
function showDeleteModal() {
    console.log('🔍 Mostrando modal - datos actuales:', {
        currentDeleteStudentId,
        currentDeleteStudentName,
        currentDeleteStudentEmail
    });
    
    // Actualizar el contenido del modal
    document.getElementById('deleteStudentName').textContent = currentDeleteStudentName;
    document.getElementById('deleteStudentEmail').textContent = currentDeleteStudentEmail || 'Email no disponible';
    
    // Mostrar el modal
    document.getElementById('deleteModal').classList.remove('hidden');
}

// Función para cerrar el modal de eliminación
function closeDeleteModal() {
    console.log('🔍 Cerrando modal - datos antes de limpiar:', {
        currentDeleteStudentId,
        currentDeleteStudentName,
        currentDeleteStudentEmail
    });
    
    document.getElementById('deleteModal').classList.add('hidden');
    // Limpiar variables
    currentDeleteStudentId = null;
    currentDeleteStudentName = null;
    currentDeleteStudentEmail = null;
    
    console.log('✅ Variables limpiadas');
}

// Función para confirmar la eliminación
async function confirmDelete() {
    console.log('🔍 Validando datos antes de eliminar:', {
        currentDeleteStudentId,
        currentDeleteStudentName,
        currentDeleteStudentEmail
    });
    
    if (!currentDeleteStudentId || currentDeleteStudentId === 'null' || currentDeleteStudentId === 'undefined') {
        console.error('❌ Error: currentDeleteStudentId es inválido:', currentDeleteStudentId);
        showError('Error: No se pudo obtener el ID del estudiante para eliminar');
        closeDeleteModal();
        return;
    }
    
    // Guardar los datos en variables locales antes de cerrar el modal
    const studentIdToDelete = currentDeleteStudentId;
    const studentNameToDelete = currentDeleteStudentName;
    const studentEmailToDelete = currentDeleteStudentEmail;
    
    console.log('🔍 Datos guardados en variables locales:', {
        studentIdToDelete,
        studentNameToDelete,
        studentEmailToDelete
    });
    
    // Cerrar el modal
    closeDeleteModal();
    
    try {
        console.log('🗑️ Eliminando estudiante:', studentIdToDelete);
        
        // Verificar autenticación
        const authResponse = await fetch('/api/auth/verify', { 
            method: 'GET', 
            credentials: 'include' 
        });
        
        if (!authResponse.ok || !authResponse.status === 200) {
            showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
            window.location.href = '/admin/login';
            return;
        }
        
        const authResult = await authResponse.json();
        if (!authResult.success || !authResult.authenticated) {
            showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
            window.location.href = '/admin/login';
            return;
        }
        
        // Realizar la eliminación
        console.log('🔍 Justo antes del fetch - studentIdToDelete:', studentIdToDelete);
        console.log('🔍 URL que se va a llamar:', `/api/estudiantes/${studentIdToDelete}`);
        
        const response = await fetch(`/api/estudiantes/${studentIdToDelete}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
                window.location.href = '/admin/login';
                return;
            }
            throw new Error(`Error al eliminar estudiante: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(`Estudiante "${studentNameToDelete}" eliminado exitosamente`);
            // Recargar la lista de estudiantes
            loadStudents(currentPage);
        } else {
            showError('Error al eliminar el estudiante: ' + result.message);
        }
        
    } catch (error) {
        console.error('Error eliminando estudiante:', error);
        showError('Error al eliminar el estudiante: ' + error.message);
    }
}
