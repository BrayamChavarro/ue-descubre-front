# Panel de Configuraciones - Colores de Carreras

## Nueva Funcionalidad Implementada

### 🎨 Configuración de Colores Representativos por Carrera

El panel de configuraciones ahora incluye una funcionalidad completa para personalizar los colores que representan cada programa académico en las estadísticas y gráficos del sistema.

## Características Principales

### 1. **Selector de Colores Interactivo**
- ✅ Interfaz visual con selectores de color para cada carrera
- ✅ Tres tipos de color por carrera: Principal, Secundario y Claro
- ✅ Vista previa en tiempo real de los cambios
- ✅ Identificación clara de cada programa académico

### 2. **Carreras Incluidas**
- **Administración de Empresas** (Código: 0)
- **Finanzas y Comercio Exterior** (Código: 1)
- **Negocios Internacionales** (Código: 2)
- **Diseño de Producto** (Código: 3)
- **Marketing** (Código: 4)
- **Ingeniería Industrial** (Código: 5)
- **Ingeniería de Software** (Código: 6)
- **Gestión Comercial** (Código: 7)
- **Producción Industrial** (Código: 8)
- **Gestión del Talento Humano** (Código: 9)

### 3. **Vista Previa en Tiempo Real**
- 📊 Gráfico de dona interactivo que muestra cómo se verán los colores
- 🔄 Actualización automática al cambiar cualquier color
- 📱 Diseño responsivo que se adapta a diferentes pantallas

### 4. **Herramientas de Gestión**
- 🔄 **Restaurar Colores por Defecto**: Vuelve a la paleta original
- 🎲 **Generar Colores Aleatorios**: Crea una nueva paleta automáticamente
- 💾 **Guardar Cambios**: Persiste las configuraciones seleccionadas

### 5. **Configuraciones Adicionales**
- 🌙 **Modo Oscuro**: Toggle para activar/desactivar tema oscuro
- 🔔 **Notificaciones**: Control de notificaciones del sistema

## Estructura de Colores

Cada carrera tiene tres variantes de color:

```javascript
{
  name: "Nombre de la Carrera",
  primary: "#color-principal",    // Color principal para gráficos
  secondary: "#color-secundario", // Color para efectos hover/secundarios  
  light: "#color-claro"          // Color claro para fondos/highlights
}
```

## Colores por Defecto

| Carrera | Color Principal | Uso |
|---------|----------------|-----|
| Administración de Empresas | 🔵 Azul Corporativo (#1e40af) | Representación en gráficos |
| Finanzas y Comercio Exterior | 🟢 Verde Financiero (#059669) | Estadísticas financieras |
| Negocios Internacionales | 🟣 Púrpura Internacional (#7c3aed) | Ámbito internacional |
| Diseño de Producto | 🔴 Rojo Creativo (#dc2626) | Creatividad y diseño |
| Marketing | 🟠 Naranja Marketing (#ea580c) | Comunicación y ventas |
| Ingeniería Industrial | 🔷 Cian Industrial (#0891b2) | Procesos industriales |
| Ingeniería de Software | 🟤 Café Tecnológico (#7c2d12) | Desarrollo tecnológico |
| Gestión Comercial | 🩷 Rosa Comercial (#be185d) | Gestión empresarial |
| Producción Industrial | 🟢 Verde Producción (#65a30d) | Manufactura |
| Gestión del Talento Humano | 💜 Púrpura RRHH (#9333ea) | Recursos humanos |

## Persistencia de Datos

Los colores configurados se guardan en:
- **localStorage** del navegador para persistencia local
- Futuras versiones incluirán sincronización con la API externa

## Uso en el Sistema

Los colores configurados se aplicarán automáticamente en:
- 📊 Gráficos de estadísticas
- 📈 Reportes de distribución por carreras  
- 🎯 Indicadores de compatibilidad
- 📋 Listas y tablas con códigos de color

## Navegación

**Acceso**: Admin Panel → Configuraciones → Colores Representativos de Carreras

**Flujo de uso**:
1. Acceder al panel de configuraciones
2. Seleccionar colores usando los selectores visuales
3. Observar cambios en la vista previa
4. Aplicar herramientas de gestión si es necesario
5. Guardar cambios con el botón "Guardar Colores"

## Compatibilidad

- ✅ Navegadores modernos con soporte para `input[type="color"]`
- ✅ Diseño responsivo para móviles y tablets
- ✅ Soporte para modo oscuro
- ✅ Integración con Chart.js para visualizaciones

---

**Estado**: ✅ Implementado y funcional  
**Versión**: 1.0.0  
**Fecha**: 24 de septiembre de 2025