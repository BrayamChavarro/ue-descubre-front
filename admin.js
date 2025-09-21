// Variables globales
let currentPage = 1;
let currentFilters = {};
let distributionChart;
let currentChartType = 'distribution';
let chartData = null;

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
    console.log('DOM cargado, iniciando aplicación...');
    checkAuthentication();
});

// Verificar autenticación
async function checkAuthentication() {
    try {
        const response = await fetch('/api/auth/verify', {
            credentials: 'include'
        });
        const result = await response.json();
        
        if (result.success && result.authenticated) {
            // Usuario autenticado, cargar el panel
            console.log('Usuario autenticado, cargando datos...');
            loadStatistics();
            loadStudents();
            showUserInfo(result.data);
        } else {
            // No autenticado, redirigir al login
            console.log('Usuario no autenticado, redirigiendo al login...');
            window.location.href = '/admin/login';
        }
    } catch (error) {
        console.error('Error verificando autenticación:', error);
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
        console.error('Error en logout:', error);
        window.location.href = '/admin/login';
    }
}

// Cargar estadísticas generales
async function loadStatistics() {
    try {
        console.log('Cargando estadísticas...');
        const response = await fetch('/api/estadisticas', {
            credentials: 'include'
        });
        
        console.log('Respuesta del servidor:', response.status);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Datos recibidos:', result);
        
        if (result.success) {
            const data = result.data;
            chartData = data; // Guardar datos para usar en diferentes gráficos
            
            console.log('Datos de estadísticas:', data);
            
            // Actualizar estadísticas generales
            document.getElementById('total-estudiantes').textContent = data.totalEstudiantes;
            document.getElementById('estudiantes-30-dias').textContent = data.estudiantesUltimos30Dias;
            
            // Programa más popular
            if (data.estadisticasArchetype && data.estadisticasArchetype.length > 0) {
                const programaPopular = data.estadisticasArchetype[0];
                document.getElementById('programa-popular').textContent = programaPopular.programa;
            }
            
            // Crear el gráfico inicial
            createChart(currentChartType, data);
        } else {
            console.error('Error en la respuesta:', result.message);
            showError('Error al cargar las estadísticas: ' + result.message);
        }
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        showError('Error al cargar las estadísticas: ' + error.message);
    }
}

// Función principal para crear gráficos
function createChart(type, data) {
    console.log('Creando gráfico de tipo:', type);
    console.log('Datos para el gráfico:', data);
    
    const canvas = document.getElementById('main-chart');
    if (!canvas) {
        console.error('No se encontró el canvas con id "main-chart"');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    if (distributionChart) {
        distributionChart.destroy();
    }
    
    // Actualizar información del gráfico
    updateChartInfo(type, data);
    
    try {
        switch (type) {
            case 'distribution':
                createDistributionChart(ctx, data);
                break;
            case 'trends':
                createTrendsChart(ctx, data);
                break;
            case 'comparison':
                createComparisonChart(ctx, data);
                break;
            case 'demographics':
                createDemographicsChart(ctx, data);
                break;
            case 'performance':
                createPerformanceChart(ctx, data);
                break;
            default:
                createDistributionChart(ctx, data);
        }
        console.log('Gráfico creado exitosamente');
    } catch (error) {
        console.error('Error creando gráfico:', error);
    }
}

// Crear gráfico de distribución (dona)
function createDistributionChart(ctx, data) {
    const labels = data.estadisticasArchetype.map(item => item.programa);
    const values = data.estadisticasArchetype.map(item => Math.round(item.count));
    const total = values.reduce((sum, value) => sum + value, 0);
    
    // Crear labels con porcentajes
    const labelsWithPercentages = labels.map((label, index) => {
        const percentage = total > 0 ? Math.round((values[index] / total) * 100) : 0;
        return `${label} (${percentage}%)`;
    });
    
    distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labelsWithPercentages,
            datasets: [{
                data: values,
                backgroundColor: [
                    '#dc2626', '#2563eb', '#dc2626', '#2563eb', '#dc2626',
                    '#2563eb', '#dc2626', '#2563eb', '#dc2626', '#2563eb'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    return {
                                        text: `${label}: ${value} personas`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor,
                                        lineWidth: data.datasets[0].borderWidth,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = Math.round(context.parsed);
                            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value} personas (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Crear gráfico de tendencias (línea)
function createTrendsChart(ctx, data) {
    // Simular datos de tendencias por mes (últimos 6 meses)
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const totalEstudiantes = Math.round(data.totalEstudiantes);
    const trendData = months.map((_, index) => 
        Math.round(totalEstudiantes * (0.1 + (index + 1) * 0.15))
    );
    
    distributionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Estudiantes Registrados',
                data: trendData,
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = Math.round(context.parsed.y);
                            return `${context.dataset.label}: ${value} personas`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return Math.round(value) + ' personas';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

// Crear gráfico de comparación (barras)
function createComparisonChart(ctx, data) {
    const topPrograms = data.estadisticasArchetype.slice(0, 5);
    const labels = topPrograms.map(item => item.programa);
    const values = topPrograms.map(item => Math.round(item.count));
    
    distributionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad de Estudiantes',
                data: values,
                backgroundColor: [
                    'rgba(220, 38, 38, 0.8)',
                    'rgba(37, 99, 235, 0.8)',
                    'rgba(220, 38, 38, 0.8)',
                    'rgba(37, 99, 235, 0.8)',
                    'rgba(220, 38, 38, 0.8)'
                ],
                borderColor: [
                    '#dc2626',
                    '#2563eb',
                    '#dc2626',
                    '#2563eb',
                    '#dc2626'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = Math.round(context.parsed.y);
                            return `${context.dataset.label}: ${value} personas`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return Math.round(value) + ' personas';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Crear gráfico demográfico (radar)
function createDemographicsChart(ctx, data) {
    const programs = data.estadisticasArchetype.slice(0, 6);
    const labels = programs.map(item => item.programa);
    const values = programs.map(item => Math.round(item.count));
    
    distributionChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distribución por Programa',
                data: values,
                backgroundColor: 'rgba(220, 38, 38, 0.2)',
                borderColor: '#dc2626',
                borderWidth: 2,
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#2563eb'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = Math.round(context.parsed.r);
                            return `${context.dataset.label}: ${value} personas`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return Math.round(value) + ' personas';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

// Crear gráfico de rendimiento (polar)
function createPerformanceChart(ctx, data) {
    const programs = data.estadisticasArchetype.slice(0, 8);
    const labels = programs.map(item => item.programa);
    const values = programs.map(item => Math.round(item.count));
    
    distributionChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    'rgba(220, 38, 38, 0.8)',
                    'rgba(37, 99, 235, 0.8)',
                    'rgba(220, 38, 38, 0.8)',
                    'rgba(37, 99, 235, 0.8)',
                    'rgba(220, 38, 38, 0.8)',
                    'rgba(37, 99, 235, 0.8)',
                    'rgba(220, 38, 38, 0.8)',
                    'rgba(37, 99, 235, 0.8)'
                ],
                borderColor: [
                    '#dc2626',
                    '#2563eb',
                    '#dc2626',
                    '#2563eb',
                    '#dc2626',
                    '#2563eb',
                    '#dc2626',
                    '#2563eb'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = Math.round(data.datasets[0].data[i]);
                                    return {
                                        text: `${label}: ${value} personas`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor[i],
                                        lineWidth: data.datasets[0].borderWidth,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = Math.round(context.parsed);
                            return `${context.label}: ${value} personas`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return Math.round(value) + ' personas';
                        }
                    }
                }
            }
        }
    });
}

// Cargar lista de estudiantes
async function loadStudents(page = 1) {
    try {
        showLoading(true);
        
        const params = new URLSearchParams({
            page: page,
            limit: 20,
            ...currentFilters
        });
        
        const response = await fetch(`/api/estudiantes?${params}`, {
            credentials: 'include'
        });
        const result = await response.json();
        
        if (result.success) {
            displayStudents(result.data);
            displayPagination(result.pagination);
            currentPage = page;
        }
    } catch (error) {
        console.error('Error cargando estudiantes:', error);
        showError('Error cargando los datos');
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
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mr-3">
                        <span class="text-white font-semibold text-sm">${estudiante.nombre.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                        <div class="text-sm font-semibold text-gray-900">${estudiante.nombre}</div>
                        <div class="text-sm text-gray-500 flex items-center">
                            <i class="fas fa-envelope mr-1 text-xs"></i>
                            ${estudiante.email}
                        </div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-graduation-cap text-white text-xs"></i>
                    </div>
                    <div>
                        <div class="text-sm font-semibold text-gray-900">${estudiante.resultado.programa}</div>
                        <div class="text-sm text-gray-500">${estudiante.resultado.nombreArchetype}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-12 h-6 bg-gray-200 rounded-full mr-2">
                        <div class="h-6 bg-gradient-to-r from-red-500 to-blue-600 rounded-full" style="width: ${estudiante.resultado.compatibilidad}%"></div>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${compatibilidadColor}">
                        ${estudiante.resultado.compatibilidad}%
                    </span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 font-medium">${fecha}</div>
                <div class="text-sm text-gray-500 flex items-center">
                    <i class="fas fa-clock mr-1 text-xs"></i>
                    ${hora}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="viewStudentDetails('${estudiante._id}')" class="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg hover:from-red-700 hover:to-blue-700 transition-colors text-sm font-medium">
                    <i class="fas fa-eye mr-1"></i>
                    Ver Detalles
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Mostrar paginación
function displayPagination(pagination) {
    const container = document.getElementById('pagination');
    
    if (pagination.pages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<div class="flex items-center justify-between">';
    html += `<div class="text-sm text-gray-700">Mostrando ${((pagination.page - 1) * pagination.limit) + 1} a ${Math.min(pagination.page * pagination.limit, pagination.total)} de ${pagination.total} resultados</div>`;
    
    html += '<div class="flex space-x-2">';
    
    // Botón anterior
    if (pagination.page > 1) {
        html += `<button onclick="loadStudents(${pagination.page - 1})" class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">Anterior</button>`;
    }
    
    // Números de página
    const startPage = Math.max(1, pagination.page - 2);
    const endPage = Math.min(pagination.pages, pagination.page + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === pagination.page;
        html += `<button onclick="loadStudents(${i})" class="px-3 py-1 border rounded-md text-sm ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}">${i}</button>`;
    }
    
    // Botón siguiente
    if (pagination.page < pagination.pages) {
        html += `<button onclick="loadStudents(${pagination.page + 1})" class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">Siguiente</button>`;
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
        const result = await response.json();
        
        if (result.success) {
            displayStudentModal(result.data);
        }
    } catch (error) {
        console.error('Error cargando detalles:', error);
        showError('Error cargando los detalles del estudiante');
    }
}

// Mostrar modal con detalles del estudiante
function displayStudentModal(estudiante) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    
    const fecha = new Date(estudiante.fechaCompletado).toLocaleString('es-ES');
    
    content.innerHTML = `
        <div class="space-y-6">
            <!-- Información básica -->
            <div class="bg-gradient-to-r from-red-50 to-blue-50 p-6 rounded-2xl border border-red-100">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                        <i class="fas fa-user text-white text-xl"></i>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold text-gray-900">Información Personal</h4>
                        <p class="text-sm text-gray-600">Datos del estudiante</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-white p-4 rounded-xl">
                        <label class="text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-user mr-2 text-red-600"></i>
                            Nombre:
                        </label>
                        <p class="text-gray-900 font-semibold">${estudiante.nombre}</p>
                    </div>
                    <div class="bg-white p-4 rounded-xl">
                        <label class="text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-envelope mr-2 text-blue-600"></i>
                            Email:
                        </label>
                        <p class="text-gray-900 font-semibold">${estudiante.email}</p>
                    </div>
                    <div class="bg-white p-4 rounded-xl">
                        <label class="text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-phone mr-2 text-red-600"></i>
                            Teléfono:
                        </label>
                        <p class="text-gray-900 font-semibold">${estudiante.telefono}</p>
                    </div>
                    <div class="bg-white p-4 rounded-xl">
                        <label class="text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-calendar mr-2 text-blue-600"></i>
                            Fecha de evaluación:
                        </label>
                        <p class="text-gray-900 font-semibold">${fecha}</p>
                    </div>
                </div>
            </div>
            
            <!-- Resultado -->
            <div class="bg-gradient-to-r from-red-50 to-blue-50 p-6 rounded-2xl border border-red-100">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                        <i class="fas fa-trophy text-white text-xl"></i>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold text-gray-900">Resultado de la Evaluación</h4>
                        <p class="text-sm text-gray-600">Perfil y recomendación</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white p-4 rounded-xl">
                        <label class="text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-user-tie mr-2 text-red-600"></i>
                            Arquetipo:
                        </label>
                        <p class="text-gray-900 font-bold text-lg">${estudiante.resultado.nombreArchetype}</p>
                    </div>
                    <div class="bg-white p-4 rounded-xl">
                        <label class="text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-graduation-cap mr-2 text-blue-600"></i>
                            Programa:
                        </label>
                        <p class="text-gray-900 font-bold text-lg">${estudiante.resultado.programa}</p>
                    </div>
                    <div class="bg-white p-4 rounded-xl">
                        <label class="text-sm font-medium text-gray-600 flex items-center mb-1">
                            <i class="fas fa-percentage mr-2 text-red-600"></i>
                            Compatibilidad:
                        </label>
                        <p class="text-red-600 font-bold text-2xl">${estudiante.resultado.compatibilidad}%</p>
                    </div>
                </div>
            </div>
            
            <!-- Puntuaciones por arquetipo -->
            <div class="bg-gradient-to-r from-red-50 to-blue-50 p-6 rounded-2xl border border-red-100">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                        <i class="fas fa-chart-bar text-white text-xl"></i>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold text-gray-900">Puntuaciones por Programa</h4>
                        <p class="text-sm text-gray-600">Comparación de compatibilidad</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${estudiante.puntuaciones.map(p => `
                        <div class="flex justify-between items-center p-4 bg-white rounded-xl border ${p.archetypeId === estudiante.resultado.archetypeId ? 'border-red-500 bg-red-50' : 'border-gray-200'}">
                            <span class="text-sm font-medium text-gray-700">${archetypeNames[p.archetypeId] || 'Programa ' + p.archetypeId}</span>
                            <div class="flex items-center">
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

// Cambiar tipo de gráfico
function changeChartType(type) {
    currentChartType = type;
    
    // Actualizar botones activos
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn-${type}`).classList.add('active');
    
    // Crear nuevo gráfico si hay datos disponibles
    if (chartData) {
        createChart(type, chartData);
    }
}

// Actualizar información del gráfico
function updateChartInfo(type, data) {
    const titles = {
        'distribution': 'Distribución por Programa',
        'trends': 'Tendencias de Registro',
        'comparison': 'Comparación de Programas',
        'demographics': 'Análisis Demográfico',
        'performance': 'Rendimiento por Programa'
    };
    
    const descriptions = {
        'distribution': 'Muestra la cantidad de estudiantes por cada programa académico',
        'trends': 'Evolución del número de estudiantes registrados en los últimos meses',
        'comparison': 'Comparación directa entre los programas más populares',
        'demographics': 'Análisis de la distribución demográfica de los estudiantes',
        'performance': 'Evaluación del rendimiento y popularidad de cada programa'
    };
    
    document.getElementById('chart-title').textContent = titles[type];
    document.getElementById('chart-description').textContent = descriptions[type];
    document.getElementById('chart-total').textContent = data.totalEstudiantes;
}

// Exportar gráfico
function exportChart() {
    if (distributionChart) {
        const url = distributionChart.toBase64Image();
        const link = document.createElement('a');
        link.download = `estadisticas-${currentChartType}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = url;
        link.click();
    }
}

// Refrescar datos
function refreshData() {
    loadStatistics();
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
