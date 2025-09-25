// ==================== CONFIGURACIONES DE CARRERAS ====================

// Usar el DEFAULT_CAREER_COLORS ya definido en color-system.js (debe cargarse antes en el HTML)
if (typeof DEFAULT_CAREER_COLORS === 'undefined') {
    console.error('DEFAULT_CAREER_COLORS no está definido. Asegúrate de incluir color-system.js antes de configuraciones.js');
    window.DEFAULT_CAREER_COLORS = {}; // Evitar más errores
}

let currentCareerColors = { ...DEFAULT_CAREER_COLORS };
let previewChart = null;

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, iniciando aplicación...');
    // Marca global para detectar que el script se ejecutó
    window.__CONFIG_PANEL_SCRIPT_LOADED__ = true;
    
    // Cargar siempre las configuraciones locales primero
    setTimeout(() => {
        initializeConfigurations();
    }, 100);
    
    // Verificación de autenticación en segundo plano (sin bloquear la UI)
    setTimeout(async () => {
        try {
            console.log('Verificando autenticación...');
            const result = await apiRequest(API_CONFIG.ENDPOINTS.VERIFY, {
                credentials: 'include'
            });

            if (!result || !result.success || !result.authenticated) {
                console.log('Usuario no autenticado');
                showError('Sesión no válida. Será redirigido al login en 10 segundos.');
                
                // Redirigir después de un tiempo más largo para permitir ver las configuraciones
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 10000);
                return;
            }

            console.log('Usuario autenticado correctamente');
            
        } catch (error) {
            console.error('Error en verificación:', error);
            showError('Error de conexión. Trabajando en modo local.');
        }
    }, 1000);
});

// Inicializar configuraciones
function initializeConfigurations() {
    console.log('Inicializando configuraciones...');
    
    // Siempre empezar con colores por defecto
    currentCareerColors = { ...DEFAULT_CAREER_COLORS };
    console.log('Colores inicializados:', currentCareerColors);
    
    // Intentar cargar colores guardados
    try {
        const savedColors = localStorage.getItem('careerColors');
        if (savedColors) {
            const parsedColors = JSON.parse(savedColors);
            if (parsedColors && Object.keys(parsedColors).length > 0) {
                currentCareerColors = parsedColors;
                console.log('Colores cargados desde localStorage:', currentCareerColors);
            }
        }
    } catch (e) {
        console.log('Error al cargar colores desde localStorage, usando defaults');
    }
    
    // Renderizar inmediatamente
    console.log('Sincronizando inputs existentes...');
    renderCareerColorsGrid(); // Esta función ahora respeta fallback estático

    // Aplicar valores guardados a los inputs si existen
    setTimeout(() => {
        const grid = document.getElementById('career-colors-grid');
        if (grid) {
            Object.keys(currentCareerColors).forEach(key => {
                ['primary','secondary','light'].forEach(type => {
                    const input = grid.querySelector(`input[data-career="${key}"][data-color-type="${type}"]`);
                    if (input) input.value = currentCareerColors[key][type];
                });
            });
        }
    }, 50);
    
    // Renderizar gráfico de vista previa
    try {
        renderPreviewChart();
    } catch (e) {
        console.log('Error al renderizar gráfico de vista previa:', e);
    }
    
    // (Se eliminó configuración de toggles de Modo Oscuro y Notificaciones)
    
    // Ocultar loading
    showLoading(false);
    
    console.log('Configuraciones inicializadas correctamente');
}

// Renderizar la grilla de colores de carreras
function renderCareerColorsGrid() {
    console.log('Renderizando grilla de colores...');
    
    const grid = document.getElementById('career-colors-grid');
    if (!grid) {
        console.error('No se encontró el elemento career-colors-grid');
        return;
    }
    // Si ya existen inputs (fallback estático), solo sincronizar valores y listeners
    const existingPickers = grid.querySelectorAll('input.color-picker');
    if (existingPickers.length > 0 && grid.children.length >= 9) {
        console.log('Detectado fallback estático, actualizando valores sin regenerar');
        Object.keys(currentCareerColors).forEach(key => {
            const career = currentCareerColors[key];
            ['primary','secondary','light'].forEach(type => {
                const input = grid.querySelector(`input[data-career="${key}"][data-color-type="${type}"]`);
                if (input) input.value = career[type];
            });
        });
        addColorPickerListeners();
        return;
    }
    console.log('Grid encontrado, regenerando dinámicamente');
    grid.innerHTML = '';
    
    console.log('Procesando colores de carreras:', currentCareerColors);
    const careerKeys = Object.keys(currentCareerColors);
    console.log('Claves de carreras:', careerKeys);
    
    if (careerKeys.length === 0) {
        console.error('No hay carreras para mostrar');
        grid.innerHTML = '<div class="col-span-full text-center text-red-500 p-8">No se encontraron carreras para configurar</div>';
        return;
    }
    
    careerKeys.forEach(careerKey => {
        const career = currentCareerColors[careerKey];
        
        const careerItem = document.createElement('div');
        careerItem.className = 'career-color-item';
        careerItem.setAttribute('data-career', careerKey);
        
        careerItem.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="color-preview" style="background-color: ${career.primary}" data-color-type="primary"></div>
                    <div>
                        <h4 class="font-semibold text-gray-900 text-sm">${career.name}</h4>
                        <p class="text-xs text-gray-500">Código: ${careerKey}</p>
                    </div>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <label class="text-sm font-medium text-gray-700">Color Principal</label>
                    <div class="flex items-center space-x-2">
                        <input type="color" 
                               value="${career.primary}" 
                               class="color-picker w-12 h-12"
                               data-career="${careerKey}"
                               data-color-type="primary"
                               title="Seleccionar color principal">
                        <div class="text-xs text-gray-500 font-mono">${career.primary}</div>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <label class="text-sm font-medium text-gray-700">Color Secundario</label>
                    <div class="flex items-center space-x-2">
                        <input type="color" 
                               value="${career.secondary}" 
                               class="color-picker w-12 h-12"
                               data-career="${careerKey}"
                               data-color-type="secondary"
                               title="Seleccionar color secundario">
                        <div class="text-xs text-gray-500 font-mono">${career.secondary}</div>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <label class="text-sm font-medium text-gray-700">Color Claro</label>
                    <div class="flex items-center space-x-2">
                        <input type="color" 
                               value="${career.light}" 
                               class="color-picker w-12 h-12"
                               data-career="${careerKey}"
                               data-color-type="light"
                               title="Seleccionar color claro">
                        <div class="text-xs text-gray-500 font-mono">${career.light}</div>
                    </div>
                </div>
            </div>
        `;
        
        console.log(`Agregando elemento para carrera ${careerKey}: ${career.name}`);
        grid.appendChild(careerItem);
    });
    
    console.log('Grilla renderizada, agregando event listeners...');
    addColorPickerListeners();
    console.log('Event listeners agregados');

    // Fallback de verificación: si después de 100ms no hay inputs, forzar inserción mínima
    setTimeout(() => {
        if (grid.querySelectorAll('input[type="color"]').length === 0) {
            console.warn('Fallback activado: no se encontraron inputs de color tras render inicial. Insertando versión mínima.');
            grid.innerHTML = Object.keys(currentCareerColors).map(key => {
                const c = currentCareerColors[key];
                return `<div class="p-4 border rounded mb-3">`+
                       `<p class='text-sm font-semibold mb-2'>${c.name}</p>`+
                       `<div class='flex gap-4'>`+
                       `<label class='flex flex-col text-xs'>Principal <input data-career='${key}' data-color-type='primary' type='color' value='${c.primary}' class='color-picker w-10 h-10 mt-1'></label>`+
                       `<label class='flex flex-col text-xs'>Secundario <input data-career='${key}' data-color-type='secondary' type='color' value='${c.secondary}' class='color-picker w-10 h-10 mt-1'></label>`+
                       `<label class='flex flex-col text-xs'>Claro <input data-career='${key}' data-color-type='light' type='color' value='${c.light}' class='color-picker w-10 h-10 mt-1'></label>`+
                       `</div>`+
                       `</div>`;
            }).join('');
            addColorPickerListeners();
        }
    }, 120);
}

// Agregar event listeners a los selectores de color
function addColorPickerListeners() {
    const colorPickers = document.querySelectorAll('.color-picker');
    colorPickers.forEach(picker => {
        picker.addEventListener('input', function() {
            const careerKey = this.getAttribute('data-career');
            const colorType = this.getAttribute('data-color-type');
            const newColor = this.value;
            
            updateCareerColor(careerKey, colorType, newColor, this);
        });
        
        picker.addEventListener('change', function() {
            const careerKey = this.getAttribute('data-career');
            const colorType = this.getAttribute('data-color-type');
            const newColor = this.value;
            
            updateCareerColor(careerKey, colorType, newColor, this);
            // Guardado rápido silencioso
            try {
                const domColors = collectColorsFromDOM();
                if (domColors) {
                    localStorage.setItem('careerColors', JSON.stringify(domColors));
                }
            } catch(e) { console.warn('Auto-save falló', e);}    
        });
    });
}

// Actualizar color de carrera
function updateCareerColor(careerKey, colorType, newColor, pickerElement = null) {
    if (currentCareerColors[careerKey]) {
        // Actualizar el color en el objeto
        currentCareerColors[careerKey][colorType] = newColor;
        
        // Animar el selector de color
        if (pickerElement) {
            pickerElement.classList.add('updating');
            setTimeout(() => {
                pickerElement.classList.remove('updating');
            }, 300);
            
            // Actualizar el texto del código de color
            const colorCodeDiv = pickerElement.parentElement.querySelector('.font-mono');
            if (colorCodeDiv) {
                colorCodeDiv.style.transition = 'background-color 0.3s ease';
                colorCodeDiv.textContent = newColor;
                colorCodeDiv.style.backgroundColor = hexToRgba(newColor, 0.1);
            }
        }
        
        // Actualizar vista previa del color principal
        if (colorType === 'primary') {
            const careerItem = document.querySelector(`[data-career="${careerKey}"]`);
            if (careerItem) {
                const colorPreview = careerItem.querySelector('.color-preview[data-color-type="primary"]');
                if (colorPreview) {
                    colorPreview.style.transition = 'background-color 0.3s ease, transform 0.3s ease';
                    colorPreview.style.backgroundColor = newColor;
                    colorPreview.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        colorPreview.style.transform = 'scale(1)';
                    }, 200);
                }
            }
        }
        
        // Actualizar gráfico de vista previa con un pequeño delay para suavizar
        setTimeout(() => {
            renderPreviewChart();
        }, 100);
        
        console.log(`Color actualizado: Carrera ${careerKey}, tipo ${colorType}, color ${newColor}`);
    }
}

// Función auxiliar para convertir hex a rgba
function hexToRgba(hex, alpha = 1) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return hex;
}

// Renderizar gráfico de vista previa
function renderPreviewChart() {
    const ctx = document.getElementById('preview-chart');
    if (!ctx) return;
    
    // Destruir gráfico anterior si existe
    if (previewChart) {
        previewChart.destroy();
    }
    
    // Datos de ejemplo más realistas para el gráfico
    const sampleData = [15, 23, 18, 12, 20, 16, 25, 14, 19, 22]; // Datos fijos para mejor visualización
    const labels = Object.values(currentCareerColors).map(career => {
        // Acortar nombres largos para mejor visualización
        return career.name.length > 20 ? career.name.substring(0, 17) + '...' : career.name;
    });
    const colors = Object.values(currentCareerColors).map(career => career.primary);
    const borderColors = Object.values(currentCareerColors).map(career => career.secondary);
    
    previewChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: sampleData,
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 3,
                hoverBorderWidth: 4,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 11,
                            family: 'Inter, sans-serif'
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, index) => ({
                                text: label,
                                fillStyle: data.datasets[0].backgroundColor[index],
                                strokeStyle: data.datasets[0].borderColor[index],
                                pointStyle: 'circle',
                                hidden: false,
                                index: index
                            }));
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Vista Previa de Colores',
                    font: {
                        size: 16,
                        weight: 'bold',
                        family: 'Inter, sans-serif'
                    },
                    padding: {
                        bottom: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} estudiantes (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: false,
                duration: 1000,
                easing: 'easeOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            }
        }
    });
}

// Vista previa de cambios (aplicar temporalmente sin guardar)
function previewChanges() {
    if (typeof updateCareerColors === 'function') {
        updateCareerColors(currentCareerColors);
        showSuccess('Vista previa aplicada. Ve a las estadísticas para ver los cambios. Usa "Guardar Colores" para hacer los cambios permanentes.');
    } else {
        showError('Sistema de colores no disponible');
    }
}

// Guardar colores de carreras
async function saveCareerColors() {
    try {
        showLoading(true);
        // 1. Recolectar siempre los valores actuales del DOM (por si algún listener no disparó)
        const domColors = collectColorsFromDOM();
        if (domColors) {
            currentCareerColors = domColors;
        }

        // 2. Guardar en localStorage directamente (fuente de verdad al recargar)
        localStorage.setItem('careerColors', JSON.stringify(currentCareerColors));

        // 3. Propagar al sistema global si existe
        if (typeof updateCareerColors === 'function') {
            try { updateCareerColors(currentCareerColors); } catch(e){ console.warn('updateCareerColors falló', e);}    
        }

        console.log('[saveCareerColors] Guardado ->', currentCareerColors);
        showSuccess('Colores guardados (persistencia local)');
        
    } catch (error) {
        console.error('Error guardando colores:', error);
        showError('Error al guardar los colores de carreras');
    } finally {
        showLoading(false);
    }
}
// Exponer función
window.saveCareerColors = saveCareerColors;

// Restaurar colores por defecto
function resetToDefaultColors() {
    const modal = createConfirmModal(
        'Restaurar Colores por Defecto',
        '¿Estás seguro de que quieres restaurar todos los colores a sus valores por defecto? Esta acción no se puede deshacer.',
        'Restaurar',
        'fas fa-undo',
        () => {
            showLoading(true);
            setTimeout(() => {
                currentCareerColors = JSON.parse(JSON.stringify(DEFAULT_CAREER_COLORS));
                renderCareerColorsGrid();
                setTimeout(() => {
                    renderPreviewChart();
                    showLoading(false);
                    showSuccess('Colores restaurados a los valores por defecto');
                }, 500);
            }, 300);
        }
    );
    document.body.appendChild(modal);
}

// Generar colores aleatorios
function generateRandomColors() {
    const modal = createConfirmModal(
        'Generar Colores Aleatorios',
        '¿Estás seguro de que quieres generar una nueva paleta de colores aleatoria para todas las carreras?',
        'Generar',
        'fas fa-random',
        () => {
            showLoading(true);
            setTimeout(() => {
                Object.keys(currentCareerColors).forEach(key => {
                    const hue = Math.floor(Math.random() * 360);
                    const saturation = 60 + Math.floor(Math.random() * 30); // 60-90%
                    const lightness = 45 + Math.floor(Math.random() * 15); // 45-60%
                    
                    currentCareerColors[key].primary = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                    currentCareerColors[key].secondary = `hsl(${hue}, ${saturation - 10}%, ${lightness + 10}%)`;
                    currentCareerColors[key].light = `hsl(${hue}, ${saturation - 40}%, 90%)`;
                });
                
                renderCareerColorsGrid();
                setTimeout(() => {
                    renderPreviewChart();
                    showLoading(false);
                    showSuccess('Nueva paleta de colores generada exitosamente');
                }, 500);
            }, 300);
        }
    );
    document.body.appendChild(modal);
}

// Crear modal de confirmación personalizado
function createConfirmModal(title, message, confirmText, icon, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="${icon} text-2xl text-blue-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">${title}</h3>
                <p class="text-gray-600">${message}</p>
            </div>
            <div class="flex space-x-3">
                <button class="cancel-btn flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                    Cancelar
                </button>
                <button class="confirm-btn flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    ${confirmText}
                </button>
            </div>
        </div>
    `;
    
    const cancelBtn = modal.querySelector('.cancel-btn');
    const confirmBtn = modal.querySelector('.confirm-btn');
    
    cancelBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    confirmBtn.addEventListener('click', () => {
        modal.remove();
        onConfirm();
    });
    
    // Cerrar con click fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

// Configurar toggles
// (Función setupToggles eliminada junto con los toggles del HTML)

// ==================== FUNCIONES AUXILIARES ====================

// Mostrar loading
function showLoading(show) {
    const loading = document.getElementById('loading');
    const mainContent = document.querySelector('main .config-section');
    
    if (loading) {
        if (show) {
            loading.style.display = 'block';
            loading.classList.remove('hidden');
        } else {
            loading.style.display = 'none';
            loading.classList.add('hidden');
        }
    }
    
    // Ocultar/mostrar el contenido principal
    const configSections = document.querySelectorAll('.config-section');
    configSections.forEach(section => {
        if (show) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

// Mostrar mensaje de error
function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

// Mostrar mensaje de éxito
function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

// Logout
async function logout() {
    try {
        const result = await apiRequest(API_CONFIG.ENDPOINTS.LOGOUT, {
            method: 'POST',
            credentials: 'include'
        });

        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error en logout:', error);
        window.location.href = 'login.html';
    }
}

// Función de respaldo para cargar las opciones de color sin autenticación
function loadColorsDirectly() {
    console.log('Cargando colores directamente...');
    currentCareerColors = { ...DEFAULT_CAREER_COLORS };
    renderCareerColorsGrid();
    showLoading(false);
}

// Llamar función de respaldo si hay problemas
setTimeout(() => {
    const grid = document.getElementById('career-colors-grid');
    if (!grid || grid.children.length === 0) {
        console.log('No se detectaron elementos de color, cargando directamente...');
        loadColorsDirectly();
    }
}, 3000);

// Herramientas de depuración
window.__debugCareerColors = function() {
    console.log('DEFAULT_CAREER_COLORS:', DEFAULT_CAREER_COLORS);
    console.log('currentCareerColors:', currentCareerColors);
    const grid = document.getElementById('career-colors-grid');
    console.log('Grid existe:', !!grid, 'nodos hijos:', grid ? grid.children.length : 'N/A');
};

window.__forceRenderCareerColors = function() {
    console.log('Forzando render manual de grilla');
    try { renderCareerColorsGrid(); } catch(e){ console.error(e);} 
};

// Recolectar colores directamente del DOM
function collectColorsFromDOM() {
    const grid = document.getElementById('career-colors-grid');
    if (!grid) return null;
    const result = {};
    try {
        Object.keys(DEFAULT_CAREER_COLORS).forEach(key => {
            const primaryInput = grid.querySelector(`input[data-career="${key}"][data-color-type="primary"]`);
            const secondaryInput = grid.querySelector(`input[data-career="${key}"][data-color-type="secondary"]`);
            const lightInput = grid.querySelector(`input[data-career="${key}"][data-color-type="light"]`);
            if (primaryInput && secondaryInput && lightInput) {
                result[key] = {
                    name: DEFAULT_CAREER_COLORS[key].name,
                    primary: primaryInput.value,
                    secondary: secondaryInput.value,
                    light: lightInput.value
                };
            }
        });
        return result;
    } catch(e){
        console.error('Error recolectando colores del DOM', e);
        return null;
    }
}
window.collectColorsFromDOM = collectColorsFromDOM;

// Guardar todas las configuraciones (botón header)
function saveAllSettings() {
    console.log('Guardando todas las configuraciones...');
    try {
        // Guardar colores
        if (typeof saveCareerColors === 'function') {
            saveCareerColors();
        }
    // (Ya no hay toggles que guardar)
        showSuccess('Configuraciones guardadas');
    } catch (e) {
        console.error('Error guardando configuraciones:', e);
        showError('Error al guardar configuraciones');
    }
}
window.saveAllSettings = saveAllSettings;