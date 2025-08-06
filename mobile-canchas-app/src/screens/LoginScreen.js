// Importación de React para crear componentes
import React, { useState } from 'react';
// Importación de componentes básicos de React Native
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
// Importación del componente de área segura
import { SafeAreaView } from 'react-native-safe-area-context';
// Importación del servicio de autenticación
import { authService } from '../services/authService';
// Importación del hook de autenticación
import { useAuth } from '../../App';

// Componente de pantalla de inicio de sesión
const LoginScreen = ({ navigation }) => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    email: '', // Campo de email
    password: '', // Campo de contraseña
  });
  // Estado para controlar si se está cargando
  const [loading, setLoading] = useState(false);
  // Estado para almacenar errores de validación
  const [errors, setErrors] = useState({});
  // Obtener la función de login del contexto de autenticación
  const { login } = useAuth();

  // Función para validar el formulario antes de enviarlo
  const validateForm = () => {
    // Objeto para almacenar los errores encontrados
    const newErrors = {};

    // Validar que el email tenga el dominio @epn.edu.ec
    const emailRegex = /^[^\s@]+@epn\.edu\.ec$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El email debe tener el dominio @epn.edu.ec';
    }

    // Validar que la contraseña no esté vacía
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    // Actualizar el estado de errores
    setErrors(newErrors);
    // Retornar true si no hay errores, false si los hay
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el proceso de inicio de sesión
  const handleLogin = async () => {
    // Validar el formulario antes de proceder
    if (!validateForm()) {
      Alert.alert('Error de Validación', 'Por favor corrige los errores en el formulario');
      return;
    }

    // Activar el estado de carga
    setLoading(true);
    try {
      // Llamar al servicio de autenticación para hacer login
      const response = await authService.login(formData.email, formData.password);
      
      // Usar el contexto para cambiar el estado de autenticación
      login();
      
      // Mostrar mensaje de éxito
      Alert.alert(
        '¡Bienvenido!', 
        'Has iniciado sesión correctamente.',
        [
          {
            text: 'OK',
            onPress: () => {
              // La navegación se manejará automáticamente por el estado de autenticación
            }
          }
        ]
      );
    } catch (error) {
      // Mostrar mensaje de error si algo falla
      Alert.alert('Error en el Login', error.message || 'Error al iniciar sesión');
    } finally {
      // Desactivar el estado de carga
      setLoading(false);
    }
  };

  // Función para actualizar los datos del formulario
  const updateFormData = (field, value) => {
    // Actualizar el estado del formulario
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Función para renderizar un campo de entrada con su etiqueta y validación
  const renderInput = (field, label, placeholder, options = {}) => (
    <View style={styles.inputContainer}>
      {/* Etiqueta del campo */}
      <Text style={styles.label}>{label}</Text>
      {/* Campo de entrada */}
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]} // Aplicar estilo de error si existe
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => updateFormData(field, value)}
        {...options} // Pasar opciones adicionales (como secureTextEntry)
      />
      {/* Mostrar mensaje de error si existe */}
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  // Renderizar la pantalla de login
  return (
    // Contenedor de área segura que respeta las barras del sistema
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Contenedor que evita que el teclado cubra los campos */}
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Contenedor scrolleable para pantallas pequeñas */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Contenedor del formulario */}
          <View style={styles.formContainer}>
            {/* Título principal de la aplicación */}
            <Text style={styles.title}>Canchas EPN</Text>
            {/* Subtítulo de la pantalla */}
            <Text style={styles.subtitle}>Iniciar Sesión</Text>

            {/* Campo de entrada para el email */}
            {renderInput('email', 'Email EPN', 'Ingresa tu email @epn.edu.ec', {
              keyboardType: 'email-address', // Tipo de teclado para email
              autoCapitalize: 'none', // No capitalizar automáticamente
              autoCorrect: false, // No corregir automáticamente
            })}

            {/* Campo de entrada para la contraseña */}
            {renderInput('password', 'Contraseña', 'Ingresa tu contraseña', {
              secureTextEntry: true, // Ocultar el texto de la contraseña
              autoCapitalize: 'none', // No capitalizar automáticamente
              autoCorrect: false, // No corregir automáticamente
            })}

            {/* Botón para iniciar sesión */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]} // Deshabilitar si está cargando
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                // Mostrar indicador de carga si está procesando
                <ActivityIndicator color="#fff" />
              ) : (
                // Mostrar texto del botón si no está cargando
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            {/* Contenedor con información adicional */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Solo estudiantes de la EPN pueden acceder a la aplicación móvil
              </Text>
            </View>

            {/* Botón para navegar a la pantalla de registro */}
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.linkText}>
                ¿No tienes cuenta? Regístrate aquí
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Estilos para los componentes de la pantalla
const styles = StyleSheet.create({
  // Estilos para el área segura
  safeArea: {
    flex: 1, // Ocupar todo el espacio disponible
    backgroundColor: '#f5f5f5', // Color de fondo gris claro
  },
  // Estilos para el contenedor principal
  container: {
    flex: 1, // Ocupar todo el espacio disponible
    backgroundColor: '#f5f5f5', // Color de fondo gris claro
  },
  // Estilos para el contenedor scrolleable
  scrollContainer: {
    flexGrow: 1, // Permitir que crezca
    justifyContent: 'center', // Centrar verticalmente
    padding: 20, // Padding horizontal
  },
  // Estilos para el contenedor del formulario
  formContainer: {
    backgroundColor: '#fff', // Fondo blanco
    borderRadius: 10, // Bordes redondeados
    padding: 30, // Padding interno
    shadowColor: '#000', // Color de la sombra
    shadowOffset: {
      width: 0, // Offset horizontal
      height: 2, // Offset vertical
    },
    shadowOpacity: 0.1, // Opacidad de la sombra
    shadowRadius: 3.84, // Radio de la sombra
    elevation: 5, // Elevación para Android
  },
  // Estilos para el título principal
  title: {
    fontSize: 28, // Tamaño de fuente
    fontWeight: 'bold', // Fuente en negrita
    color: '#2c3e50', // Color del texto
    textAlign: 'center', // Centrar texto
    marginBottom: 10, // Margen inferior
  },
  // Estilos para el subtítulo
  subtitle: {
    fontSize: 18, // Tamaño de fuente
    color: '#7f8c8d', // Color del texto
    textAlign: 'center', // Centrar texto
    marginBottom: 30, // Margen inferior
  },
  // Estilos para el contenedor de cada campo de entrada
  inputContainer: {
    marginBottom: 20, // Margen inferior
  },
  // Estilos para las etiquetas de los campos
  label: {
    fontSize: 16, // Tamaño de fuente
    fontWeight: '600', // Peso de la fuente
    color: '#2c3e50', // Color del texto
    marginBottom: 8, // Margen inferior
  },
  // Estilos para los campos de entrada
  input: {
    borderWidth: 1, // Ancho del borde
    borderColor: '#ddd', // Color del borde
    borderRadius: 8, // Bordes redondeados
    padding: 15, // Padding interno
    fontSize: 16, // Tamaño de fuente
    backgroundColor: '#fff', // Color de fondo
  },
  // Estilos para campos de entrada con error
  inputError: {
    borderColor: '#e74c3c', // Color de borde rojo para errores
  },
  // Estilos para los mensajes de error
  errorText: {
    color: '#e74c3c', // Color rojo para errores
    fontSize: 14, // Tamaño de fuente
    marginTop: 5, // Margen superior
  },
  // Estilos para el botón principal
  button: {
    backgroundColor: '#3498db', // Color de fondo azul
    padding: 15, // Padding interno
    borderRadius: 8, // Bordes redondeados
    alignItems: 'center', // Centrar contenido
    marginTop: 20, // Margen superior
  },
  // Estilos para el botón cuando está deshabilitado
  buttonDisabled: {
    backgroundColor: '#bdc3c7', // Color gris cuando está deshabilitado
  },
  // Estilos para el texto del botón
  buttonText: {
    color: '#fff', // Color blanco
    fontSize: 16, // Tamaño de fuente
    fontWeight: '600', // Peso de la fuente
  },
  // Estilos para el contenedor de información
  infoContainer: {
    marginTop: 20, // Margen superior
    padding: 15, // Padding interno
    backgroundColor: '#ecf0f1', // Color de fondo gris claro
    borderRadius: 8, // Bordes redondeados
  },
  // Estilos para el texto de información
  infoText: {
    fontSize: 14, // Tamaño de fuente
    color: '#7f8c8d', // Color del texto
    textAlign: 'center', // Centrar texto
    lineHeight: 20, // Altura de línea
  },
  // Estilos para el botón de enlace
  linkButton: {
    marginTop: 20, // Margen superior
    alignItems: 'center', // Centrar contenido
  },
  // Estilos para el texto del enlace
  linkText: {
    color: '#3498db', // Color azul
    fontSize: 16, // Tamaño de fuente
    textDecorationLine: 'underline', // Subrayar texto
  },
});

// Exportar el componente para usarlo en la navegación
export default LoginScreen; 