// Variables globales
let distributionChart;
let currentChartType = 'distribution';
let chartData = null;
let selectedCareers = []; // Carreras seleccionadas para mostrar en el gráfico

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

// Colores representativos para cada carrera
const careerColors = {
    0: { // Administración de Empresas
        primary: '#1e40af', // Azul corporativo
        secondary: '#3b82f6',
        light: '#dbeafe'
    },
    1: { // Finanzas y Comercio Exterior
        primary: '#059669', // Verde financiero
        secondary: '#10b981',
        light: '#d1fae5'
    },
    2: { // Negocios Internacionales
        primary: '#7c3aed', // Púrpura internacional
        secondary: '#8b5cf6',
        light: '#ede9fe'
    },
    3: { // Diseño de Producto
        primary: '#dc2626', // Rojo creativo
        secondary: '#ef4444',
        light: '#fee2e2'
    },
    4: { // Marketing
        primary: '#ea580c', // Naranja marketing
        secondary: '#f97316',
        light: '#fed7aa'
    },
    5: { // Ingeniería Industrial
        primary: '#0891b2', // Cian industrial
        secondary: '#06b6d4',
        light: '#cffafe'
    },
    6: { // Ingeniería de Software
        primary: '#0d9488', // Verde teal tecnológico
        secondary: '#14b8a6',
        light: '#ccfbf1'
    },
    7: { // Gestión Comercial
        primary: '#be185d', // Rosa comercial
        secondary: '#ec4899',
        light: '#fce7f3'
    },
    8: { // Producción Industrial
        primary: '#4338ca', // Índigo producción
        secondary: '#6366f1',
        light: '#e0e7ff'
    },
    9: { // Gestión del Talento Humano
        primary: '#b45309', // Ámbar recursos humanos
        secondary: '#d97706',
        light: '#fef3c7'
    }
};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, iniciando aplicación de estadísticas...');
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
            loadStatistics();
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

// Cargar estadísticas generales
async function loadStatistics() {
    try {
        console.log('Cargando estadísticas...');
        const response = await fetch('/api/estadisticas', {
            credentials: 'include'
        });
        
        console.log('Respuesta del servidor:', response.status);
        console.log('Headers de respuesta:', response.headers);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Datos recibidos:', result);
        
        if (result.success) {
            const data = result.data;
            chartData = data; // Guardar datos para usar en diferentes gráficos
            
            console.log('Datos de estadísticas:', data);
            console.log('Total estudiantes:', data.totalEstudiantes);
            console.log('Estudiantes últimos 30 días:', data.estudiantesUltimos30Dias);
            
            // Actualizar estadísticas generales
            const totalElement = document.getElementById('total-estudiantes');
            const ultimos30Element = document.getElementById('estudiantes-30-dias');
            const programaElement = document.getElementById('programa-popular');
            
            console.log('Elementos encontrados:', {
                total: totalElement,
                ultimos30: ultimos30Element,
                programa: programaElement
            });
            
            if (totalElement) totalElement.textContent = data.totalEstudiantes;
            if (ultimos30Element) ultimos30Element.textContent = data.estudiantesUltimos30Dias;
            
            // Programa más popular
            if (data.estadisticasArchetype && data.estadisticasArchetype.length > 0) {
                const programaPopular = data.estadisticasArchetype[0];
                if (programaElement) programaElement.textContent = programaPopular.programa;
            }
            
            // Inicializar filtros de carreras
            initializeCareerFilters(data);
            
            // Crear el gráfico inicial
            await createChart(currentChartType, data);
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
async function createChart(type, data) {
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
                await createTrendsChart(ctx, data);
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
    // Filtrar datos según carreras seleccionadas
    const filteredData = data.estadisticasArchetype.filter(item => 
        selectedCareers.includes(item._id)
    );
    
    if (filteredData.length === 0) {
        // Mostrar mensaje si no hay datos
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('No hay datos para mostrar', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    const labels = filteredData.map(item => item.programa);
    const values = filteredData.map(item => Math.round(item.count));
    const total = values.reduce((sum, value) => sum + value, 0);
    
    // Crear labels con porcentajes
    const labelsWithPercentages = labels.map((label, index) => {
        const percentage = total > 0 ? Math.round((values[index] / total) * 100) : 0;
        return `${label} (${percentage}%)`;
    });
    
    // Generar colores basados en las carreras seleccionadas
    const backgroundColors = filteredData.map(item => careerColors[item._id].primary);
    const borderColors = filteredData.map(item => careerColors[item._id].secondary);
    
    distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labelsWithPercentages,
            datasets: [{
                data: values,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
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
async function createTrendsChart(ctx, data) {
    try {
        // Obtener datos de estudiantes para calcular tendencias reales
        const response = await fetch('/api/estudiantes?limit=1000', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar datos de estudiantes');
        }
        
        const result = await response.json();
        const estudiantes = Array.isArray(result.data) ? result.data : (result.data.estudiantes || []);
        
        // Calcular tendencias por mes (últimos 6 meses)
        const now = new Date();
        const months = [];
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        
        // Generar los últimos 6 meses
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                month: date.getMonth(),
                year: date.getFullYear(),
                name: monthNames[date.getMonth()],
                count: 0
            });
        }
        
        // Contar estudiantes por mes
        estudiantes.forEach(estudiante => {
            const fechaCompletado = new Date(estudiante.fechaCompletado);
            const monthIndex = months.findIndex(m => 
                m.month === fechaCompletado.getMonth() && 
                m.year === fechaCompletado.getFullYear()
            );
            
            if (monthIndex !== -1) {
                months[monthIndex].count++;
            }
        });
        
        // Calcular datos acumulativos
        let acumulado = 0;
        const trendData = months.map(month => {
            acumulado += month.count;
            return acumulado;
        });
        
        const labels = months.map(m => m.name);
        
        distributionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
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
                                const monthIndex = context.dataIndex;
                                const newThisMonth = months[monthIndex].count;
                                return [
                                    `${context.dataset.label}: ${value} personas`,
                                    `Nuevos este mes: ${newThisMonth} personas`
                                ];
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
        
    } catch (error) {
        console.error('Error creando gráfico de tendencias:', error);
        // Fallback a datos simulados si hay error
        createTrendsChartFallback(ctx, data);
    }
}

// Función de fallback para gráfico de tendencias
function createTrendsChartFallback(ctx, data) {
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
                label: 'Estudiantes Registrados (Datos Simulados)',
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
    // Filtrar datos según carreras seleccionadas
    const filteredData = data.estadisticasArchetype.filter(item => 
        selectedCareers.includes(item._id)
    );
    
    if (filteredData.length === 0) {
        // Mostrar mensaje si no hay datos
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('No hay datos para mostrar', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    const topPrograms = filteredData.slice(0, 5);
    const labels = topPrograms.map(item => item.programa);
    const values = topPrograms.map(item => Math.round(item.count));
    
    // Generar colores basados en las carreras seleccionadas
    const backgroundColors = topPrograms.map(item => careerColors[item._id].primary + 'CC'); // Agregar transparencia
    const borderColors = topPrograms.map(item => careerColors[item._id].primary);
    
    distributionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad de Estudiantes',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
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
    // Filtrar datos según carreras seleccionadas
    const filteredData = data.estadisticasArchetype.filter(item => 
        selectedCareers.includes(item._id)
    );
    
    if (filteredData.length === 0) {
        // Mostrar mensaje si no hay datos
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('No hay datos para mostrar', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    const programs = filteredData.slice(0, 6);
    const labels = programs.map(item => item.programa);
    const values = programs.map(item => Math.round(item.count));
    
    // Generar colores basados en las carreras seleccionadas (más translúcidos)
    const backgroundColor = programs.map(item => careerColors[item._id].primary + '20'); // Muy translúcido
    const borderColor = programs.map(item => careerColors[item._id].primary + '80'); // Semi-transparente
    const pointBackgroundColor = programs.map(item => careerColors[item._id].primary);
    
    distributionChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distribución por Programa',
                data: values,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 2,
                pointBackgroundColor: pointBackgroundColor,
                pointBorderColor: '#fff'
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
    // Filtrar datos según carreras seleccionadas
    const filteredData = data.estadisticasArchetype.filter(item => 
        selectedCareers.includes(item._id)
    );
    
    if (filteredData.length === 0) {
        // Mostrar mensaje si no hay datos
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('No hay datos para mostrar', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    const programs = filteredData.slice(0, 8);
    const labels = programs.map(item => item.programa);
    const values = programs.map(item => Math.round(item.count));
    
    // Generar colores basados en las carreras seleccionadas
    const backgroundColors = programs.map(item => careerColors[item._id].primary + 'CC'); // Agregar transparencia
    const borderColors = programs.map(item => careerColors[item._id].primary);
    
    distributionChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
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

// Cambiar tipo de gráfico
async function changeChartType(type) {
    currentChartType = type;
    
    // Actualizar botones activos
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn-${type}`).classList.add('active');
    
    // Crear nuevo gráfico si hay datos disponibles
    if (chartData) {
        await createChart(type, chartData);
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

// Inicializar filtros de carreras
function initializeCareerFilters(data) {
    const container = document.getElementById('career-filters');
    if (!container) return;
    
    // Obtener carreras disponibles en los datos
    const availableCareers = data.estadisticasArchetype.map(item => item._id);
    
    // Inicializar con todas las carreras seleccionadas
    selectedCareers = [...availableCareers];
    
    // Generar filtros
    container.innerHTML = '';
    
    Object.keys(archetypeNames).forEach(careerId => {
        const careerName = archetypeNames[careerId];
        const colors = careerColors[careerId];
        const isAvailable = availableCareers.includes(parseInt(careerId));
        const isSelected = selectedCareers.includes(parseInt(careerId));
        
        const filterElement = document.createElement('div');
        filterElement.className = `career-filter p-3 rounded-lg border-2 cursor-pointer transition-all ${
            isSelected ? 'border-opacity-100 shadow-md' : 'border-opacity-50'
        } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`;
        
        filterElement.style.borderColor = colors.primary;
        filterElement.style.backgroundColor = isSelected ? colors.light : '#ffffff';
        
        filterElement.innerHTML = `
            <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" style="background-color: ${colors.primary}"></div>
                <span class="text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}">${careerName}</span>
            </div>
        `;
        
        if (isAvailable) {
            filterElement.onclick = () => toggleCareerFilter(parseInt(careerId));
        }
        
        container.appendChild(filterElement);
    });
}

// Alternar filtro de carrera
async function toggleCareerFilter(careerId) {
    const index = selectedCareers.indexOf(careerId);
    
    if (index > -1) {
        selectedCareers.splice(index, 1);
    } else {
        selectedCareers.push(careerId);
    }
    
    // Actualizar la interfaz
    updateCareerFilterUI();
    
    // Recrear el gráfico con los filtros aplicados
    if (chartData) {
        await createChart(currentChartType, chartData);
    }
}

// Actualizar interfaz de filtros
function updateCareerFilterUI() {
    const filters = document.querySelectorAll('.career-filter');
    
    filters.forEach((filter, index) => {
        const careerId = parseInt(Object.keys(archetypeNames)[index]);
        const colors = careerColors[careerId];
        const isSelected = selectedCareers.includes(careerId);
        
        filter.style.borderColor = colors.primary;
        filter.style.backgroundColor = isSelected ? colors.light : '#ffffff';
        
        const span = filter.querySelector('span');
        span.className = `text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`;
    });
}

// Seleccionar todas las carreras
async function selectAllCareers() {
    if (chartData && chartData.estadisticasArchetype) {
        selectedCareers = chartData.estadisticasArchetype.map(item => item._id);
        updateCareerFilterUI();
        
        if (chartData) {
            await createChart(currentChartType, chartData);
        }
    }
}

// Limpiar selección de carreras
async function clearCareerSelection() {
    selectedCareers = [];
    updateCareerFilterUI();
    
    if (chartData) {
        await createChart(currentChartType, chartData);
    }
}
