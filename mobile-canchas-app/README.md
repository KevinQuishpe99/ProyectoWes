# 📱 Canchas EPN - Aplicación Móvil

Aplicación móvil exclusiva para estudiantes de la EPN para la gestión de reservas de canchas deportivas.

## 🚀 Configuración Inicial

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar URL del Servidor

**IMPORTANTE:** La URL del servidor se configura directamente en el archivo:
```
src/services/api.js
```

**Cambiar la IP si es necesario:**
```javascript
const API_BASE_URL = 'http://192.168.100.9:3001/api';
```

### 3. Obtener IP de tu Máquina

**Windows:**
```bash
ipconfig
```
Busca la línea "IPv4 Address" en tu adaptador de red.

**Mac/Linux:**
```bash
ifconfig
# o
ip addr show
```

### 4. Verificar que el Servidor esté Funcionando

**IMPORTANTE:** El servidor debe estar ejecutándose antes de usar la app móvil.

```bash
# En la carpeta del servidor
cd ../server
npm start
```

**Verificar que el servidor esté funcionando:**
```bash
# Probar conexión (desde PowerShell)
Invoke-WebRequest -Uri "http://192.168.100.9:3001/api/usuarios/verify" -Method GET
```

## 📱 Ejecutar la Aplicación

### Desarrollo
```bash
npx expo start
```

### Android
```bash
npx expo start --android
```

### iOS
```bash
npx expo start --ios
```

## 🔧 Solución de Problemas

### Error de Red (Network Error)
1. **Verifica que el servidor esté funcionando** - Debe estar ejecutándose en el puerto 3001
2. **Verifica la IP del servidor** en `api.js` - Debe ser la IP correcta de tu máquina
3. **Verifica que el dispositivo y servidor estén en la misma red** - Misma red WiFi
4. **Desactiva el firewall temporalmente** para pruebas
5. **Verifica el puerto** - El servidor debe estar en el puerto 3001

### Error de Navegación
- La app está configurada para evitar valores no serializables
- Los errores de navegación deberían estar resueltos

### Error de Autenticación
- Solo permite acceso a usuarios con rol de estudiante (rol_id: 3)
- Verifica que el usuario esté registrado correctamente

## 📋 Funcionalidades

### ✅ Implementadas (Exclusivas para Estudiantes)

#### 🔐 **Sistema de Autenticación Robusto**
- ✅ **Login exclusivo para estudiantes** - Solo usuarios con rol de estudiante
- ✅ **Registro de estudiantes** - Solo se permite registro como estudiante
- ✅ **Validaciones de formulario** - Campos obligatorios, formato de email, contraseña simplificada
- ✅ **Manejo de errores específicos** - Mensajes claros para cada tipo de error
- ✅ **Logout seguro** - Limpieza completa de datos de sesión

#### 📱 **Pantallas Principales**
- ✅ **LoginScreen** - Validaciones en tiempo real, indicadores de error
- ✅ **RegisterScreen** - Registro exclusivo para estudiantes
- ✅ **ProfileScreen** - Información completa del estudiante
- ✅ **ReservasScreen** - Lista de reservas del estudiante

#### 🛡️ **Seguridad y Validaciones**
- ✅ **Validación de email** - Formato correcto requerido
- ✅ **Contraseña simplificada** - Mínimo 4 caracteres (cualquier combinación)
- ✅ **Validación de código** - Mínimo 3 caracteres
- ✅ **Validación de nombre** - Mínimo 2 caracteres
- ✅ **Acceso exclusivo** - Solo estudiantes pueden usar la app

#### 🔄 **Manejo de Datos**
- ✅ **Formato consistente** - Datos del usuario formateados como en la web
- ✅ **Almacenamiento seguro** - AsyncStorage con claves directas
- ✅ **Manejo de errores de red** - Mensajes específicos para cada tipo de error
- ✅ **Limpieza de sesión** - Método para limpiar datos en casos de error

### 🔄 En Desarrollo
- 📱 Pantalla de reservar canchas
- 📱 Pantalla de eventos
- 📱 Pantalla de feedback

## 🛠️ Estructura del Proyecto (Simplificada)

```
mobile-canchas-app/
├── src/
│   ├── navigation/
│   │   ├── AppNavigator.js       # Navegación principal
│   │   └── MainTabNavigator.js   # Navegación con tabs
│   ├── screens/
│   │   ├── LoginScreen.js        # Login exclusivo para estudiantes
│   │   ├── RegisterScreen.js     # Registro de estudiantes
│   │   ├── ProfileScreen.js      # Perfil del estudiante
│   │   └── ReservasScreen.js     # Lista de reservas del estudiante
│   └── services/
│       ├── api.js                # Configuración de axios con URL base directa
│       └── authService.js        # Servicios de autenticación para estudiantes
├── App.js                        # Componente principal con NavigationContainer
└── app.json                      # Configuración de Expo
```

## 🔐 Seguridad

- ✅ **Acceso exclusivo** - Solo estudiantes (rol_id: 3) pueden usar la app
- ✅ **Tokens JWT** - Autenticación segura con tokens
- ✅ **Almacenamiento seguro** - AsyncStorage con claves directas
- ✅ **Validación de datos** - Frontend y backend con validaciones robustas
- ✅ **Manejo de errores** - Mensajes específicos y seguros

## 📱 Compatibilidad

- ✅ Android 6.0+
- ✅ iOS 12.0+
- ✅ Expo SDK 49+
- ✅ React Native 0.72+

## 🆘 Soporte

Si encuentras problemas:

1. **Verifica que el servidor esté funcionando** - Es el problema más común
2. **Verifica la configuración de red** - IP correcta y misma red
3. **Revisa los logs de la consola** - Para errores específicos
4. **Verifica que la IP sea correcta** - Usa `ipconfig` para obtenerla

## 🆕 Mejoras Implementadas (Exclusivas para Estudiantes)

### **Validaciones de Formulario:**
- ✅ **Validación en tiempo real** - Errores se muestran mientras escribes
- ✅ **Validación de email** - Formato correcto requerido
- ✅ **Contraseña simplificada** - Solo 4 caracteres mínimos
- ✅ **Validación de campos** - Todos los campos son obligatorios
- ✅ **Registro exclusivo** - Solo para estudiantes

### **Manejo de Errores:**
- ✅ **Errores específicos** - Mensajes claros para cada tipo de error
- ✅ **Errores de red** - Manejo específico de problemas de conexión
- ✅ **Errores de servidor** - Mensajes del backend mostrados correctamente

### **Experiencia de Usuario:**
- ✅ **Indicadores visuales** - Campos con error se resaltan en rojo
- ✅ **Mensajes informativos** - Información clara sobre requisitos
- ✅ **Navegación fluida** - Transiciones suaves entre pantallas
- ✅ **Feedback inmediato** - Respuestas rápidas a las acciones del usuario
- ✅ **Interfaz de estudiante** - Diseño específico para estudiantes

### **Código Simplificado:**
- ✅ **Sin archivos innecesarios** - Eliminados utils/, components/, config/
- ✅ **Configuración directa** - URL base directamente en api.js
- ✅ **Sin variables de entorno** - Configuración simple y directa
- ✅ **Claves directas** - AsyncStorage sin constantes intermedias
- ✅ **Menos dependencias** - Código más limpio y mantenible
- ✅ **Sin selector de rol** - Solo estudiantes pueden registrarse

## 🚨 Solución Rápida para Error de Red

Si obtienes "Network Error":

1. **Inicia el servidor:**
   ```bash
   cd ../server
   npm start
   ```

2. **Verifica la IP:**
   ```bash
   ipconfig
   ```

3. **Actualiza api.js:**
   ```javascript
   const API_BASE_URL = 'http://TU_IP_AQUI:3001/api';
   ```

4. **Reinicia la app móvil**

---

**¡La aplicación móvil está completamente optimizada y es exclusiva para estudiantes!** 🎉 