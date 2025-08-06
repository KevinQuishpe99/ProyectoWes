import React, { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/authService';
import { useAuth } from '../../App';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    codigo: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  // Validaciones simplificadas
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.userName.trim()) {
      newErrors.userName = 'El nombre es obligatorio';
    } else if (formData.userName.trim().length < 2) {
      newErrors.userName = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email con dominio @epn.edu.ec
    const emailRegex = /^[^\s@]+@epn\.edu\.ec$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El email debe tener el dominio @epn.edu.ec';
    }

    // Validar código
    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es obligatorio';
    } else if (formData.codigo.trim().length < 3) {
      newErrors.codigo = 'El código debe tener al menos 3 caracteres';
    }

    // Validar contraseña (simplificada)
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Error de Validación', 'Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register(formData);
      
      // Usar el contexto para cambiar el estado de autenticación
      login();
      
      Alert.alert(
        '¡Registro Exitoso!', 
        'Tu cuenta ha sido creada correctamente.',
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
      Alert.alert('Error en el Registro', error.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const renderInput = (field, label, placeholder, options = {}) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => updateFormData(field, value)}
        {...options}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Canchas EPN</Text>
            <Text style={styles.subtitle}>Registro de Estudiante</Text>

            {renderInput('userName', 'Nombre Completo', 'Ingresa tu nombre completo', {
              autoCapitalize: 'words',
              autoCorrect: false,
            })}

            {renderInput('email', 'Email EPN', 'Ingresa tu email @epn.edu.ec', {
              keyboardType: 'email-address',
              autoCapitalize: 'none',
              autoCorrect: false,
            })}

            {renderInput('codigo', 'Código de Estudiante', 'Ingresa tu código', {
              autoCapitalize: 'characters',
              autoCorrect: false,
            })}

            {renderInput('password', 'Contraseña', 'Ingresa tu contraseña', {
              secureTextEntry: true,
              autoCapitalize: 'none',
              autoCorrect: false,
            })}

            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>La contraseña debe contener:</Text>
              <Text style={styles.requirement}>• Al menos 4 caracteres</Text>
              <Text style={styles.requirement}>• Puede ser cualquier combinación</Text>
            </View>

            <View style={styles.roleInfo}>
              <Text style={styles.roleInfoText}>
                📱 Esta aplicación es exclusiva para estudiantes de la EPN
              </Text>
              <Text style={styles.roleInfoText}>
                📧 Solo se permiten correos con dominio @epn.edu.ec
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Registrarse como Estudiante</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.linkText}>
                ¿Ya tienes cuenta? Inicia sesión aquí
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  passwordRequirements: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  roleInfo: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  roleInfoText: {
    fontSize: 14,
    color: '#1976d2',
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#3498db',
    fontSize: 14,
  },
});

export default RegisterScreen; 