// ==================== SISTEMA GLOBAL DE COLORES ====================

// Colores por defecto para cada carrera
const DEFAULT_CAREER_COLORS = {
    0: { name: "Administración de Empresas", primary: '#1e40af', secondary: '#3b82f6', light: '#dbeafe' },
    1: { name: "Finanzas y Comercio Exterior", primary: '#059669', secondary: '#10b981', light: '#d1fae5' },
    2: { name: "Negocios Internacionales", primary: '#7c3aed', secondary: '#8b5cf6', light: '#ede9fe' },
    3: { name: "Diseño de Producto", primary: '#dc2626', secondary: '#ef4444', light: '#fee2e2' },
    4: { name: "Marketing", primary: '#ea580c', secondary: '#f97316', light: '#fed7aa' },
    5: { name: "Ingeniería Industrial", primary: '#0891b2', secondary: '#06b6d4', light: '#cffafe' },
    6: { name: "Ingeniería de Software", primary: '#7c2d12', secondary: '#ea580c', light: '#fed7aa' },
    7: { name: "Gestión Comercial", primary: '#be185d', secondary: '#ec4899', light: '#fce7f3' },
    8: { name: "Producción Industrial", primary: '#65a30d', secondary: '#84cc16', light: '#ecfccb' },
    9: { name: "Gestión del Talento Humano", primary: '#9333ea', secondary: '#a855f7', light: '#f3e8ff' }
};

// Objeto global para los colores actuales
let CURRENT_CAREER_COLORS = { ...DEFAULT_CAREER_COLORS };

// Función para cargar colores guardados desde localStorage
function loadSavedColors() {
    try {
        const savedColors = localStorage.getItem('careerColors');
        if (savedColors) {
            const parsedColors = JSON.parse(savedColors);
            // Validar que los colores guardados tengan la estructura correcta
            Object.keys(DEFAULT_CAREER_COLORS).forEach(key => {
                if (parsedColors[key] && 
                    parsedColors[key].primary && 
                    parsedColors[key].secondary && 
                    parsedColors[key].light) {
                    CURRENT_CAREER_COLORS[key] = {
                        ...DEFAULT_CAREER_COLORS[key],
                        ...parsedColors[key]
                    };
                }
            });
            console.log('Colores personalizados cargados:', CURRENT_CAREER_COLORS);
        }
    } catch (error) {
        console.error('Error cargando colores guardados:', error);
        CURRENT_CAREER_COLORS = { ...DEFAULT_CAREER_COLORS };
    }
}

// Función para obtener los colores actuales
function getCurrentCareerColors() {
    return CURRENT_CAREER_COLORS;
}

// Función para obtener el color de una carrera específica
function getCareerColor(careerId, colorType = 'primary') {
    if (CURRENT_CAREER_COLORS[careerId] && CURRENT_CAREER_COLORS[careerId][colorType]) {
        return CURRENT_CAREER_COLORS[careerId][colorType];
    }
    // Fallback a colores por defecto
    if (DEFAULT_CAREER_COLORS[careerId] && DEFAULT_CAREER_COLORS[careerId][colorType]) {
        return DEFAULT_CAREER_COLORS[careerId][colorType];
    }
    // Fallback final
    return '#6b7280';
}

// Función para escuchar cambios en los colores
let colorChangeListeners = [];

function onColorChange(callback) {
    colorChangeListeners.push(callback);
}

function notifyColorChange() {
    colorChangeListeners.forEach(callback => {
        try {
            callback(CURRENT_CAREER_COLORS);
        } catch (error) {
            console.error('Error en callback de cambio de color:', error);
        }
    });
}

// Función para actualizar colores (llamada desde configuraciones)
function updateCareerColors(newColors) {
    CURRENT_CAREER_COLORS = { ...newColors };
    localStorage.setItem('careerColors', JSON.stringify(CURRENT_CAREER_COLORS));
    notifyColorChange();
    console.log('Colores actualizados globalmente:', CURRENT_CAREER_COLORS);
}

// Función para convertir hex a rgba
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

// Función para obtener variaciones de un color
function getColorVariations(careerId) {
    const colors = CURRENT_CAREER_COLORS[careerId];
    if (!colors) return null;
    
    return {
        solid: colors.primary,
        transparent: hexToRgba(colors.primary, 0.8),
        light: hexToRgba(colors.primary, 0.3),
        veryLight: hexToRgba(colors.primary, 0.1),
        secondary: colors.secondary,
        background: colors.light
    };
}

// Inicializar colores al cargar el script
loadSavedColors();

// Exportar para compatibilidad con el código existente
window.getCurrentCareerColors = getCurrentCareerColors;
window.getCareerColor = getCareerColor;
window.updateCareerColors = updateCareerColors;
window.onColorChange = onColorChange;
window.getColorVariations = getColorVariations;
window.hexToRgba = hexToRgba;