# Canchas EPN - Aplicación Móvil

## Descripción
Aplicación móvil simplificada para estudiantes de la EPN para ver sus reservas de canchas deportivas.

## Funcionalidades

### 🔐 Autenticación
- **Login**: Solo usuarios con rol "usuario" (estudiantes) pueden acceder
- **Registro**: Registro exclusivo para estudiantes (rol_id: 3)
- **Logout**: Cerrar sesión desde el perfil

### 📱 Pantallas Principales

#### 1. Login Screen
- Formulario de inicio de sesión
- Validación de campos
- Redirección automática al registro

#### 2. Register Screen  
- Registro de estudiantes
- Campos: Nombre completo, email, código de estudiante, contraseña
- Validación de contraseña (mínimo 6 caracteres)

#### 3. Mis Reservas
- Lista de reservas del usuario
- Información: Cancha, fecha, hora, tipo, ubicación
- Estado de la reserva (Reservada, Cancelada, Pendiente)
- Vista de solo lectura (sin edición/eliminación)

#### 4. Mi Perfil
- Información básica del usuario
- Nombre, email, código de estudiante
- Botón de cerrar sesión

## Tecnologías
- React Native + Expo
- React Navigation
- AsyncStorage para persistencia
- Axios para API calls
- JWT para autenticación

## Configuración
- **API Base URL**: `http://192.168.100.9:3001/api`
- **Rol permitido**: Solo usuarios con rol_id: 3 (estudiantes)

## Instalación
```bash
npm install
expo start
```

## Estructura del Proyecto
```
src/
├── screens/
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── ReservasScreen.js
│   └── ProfileScreen.js
├── services/
│   ├── authService.js
│   ├── reservasService.js
│   └── api.js
├── navigation/
│   ├── AppNavigator.js
│   └── MainTabNavigator.js
└── config/
    └── constants.js
```

## Notas
- La aplicación está diseñada exclusivamente para estudiantes
- No incluye funcionalidades de administración
- Las reservas son de solo lectura
- Interfaz simplificada y enfocada en la experiencia del usuario 