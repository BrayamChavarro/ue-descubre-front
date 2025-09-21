// ==================== CONFIGURACIONES SIMPLIFICADAS ====================

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Verificar si el usuario está autenticado
        const response = await fetch('/api/auth/verify', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok || !response.status === 200) {
            // Redirigir silenciosamente al login
            window.location.href = '/admin/login';
            return;
        }

        const result = await response.json();
        if (!result.authenticated) {
            // Redirigir silenciosamente al login
            window.location.href = '/admin/login';
            return;
        }

        // Usuario autenticado, mostrar contenido
        showLoading(false);
        
    } catch (error) {
        // En caso de cualquier error, redirigir silenciosamente al login
        window.location.href = '/admin/login';
    }
});

// ==================== FUNCIONES AUXILIARES ====================

// Mostrar loading
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}

// Mostrar mensaje de error
function showError(message) {
    // Crear notificación de error
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Mostrar mensaje de éxito
function showSuccess(message) {
    // Crear notificación de éxito
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Logout
async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = '/admin/login';
        } else {
            console.error('Error en logout');
            window.location.href = '/admin/login';
        }
    } catch (error) {
        console.error('Error en logout:', error);
        window.location.href = '/admin/login';
    }
}