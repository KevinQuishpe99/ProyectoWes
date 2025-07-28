import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';

dotenv.config();

export const protect = async (request, response, next) => {
    let token;
    
    // Verificar si existe la cabecera authorization
    if (request.headers.authorization) {
        // Obtener el valor como string y verificar si empieza con 'Bearer'
        const authHeader = String(request.headers.authorization);
        if (authHeader.startsWith('Bearer')) {
            try {
                // Extraer el token
                token = authHeader.split(' ')[1];
                
                // Verificar el token
                const decoded = jwt.verify(token, '12345678');
                
                // Buscar al usuario
                request.usuario = await Usuario.findOne({ id: decoded.id }).select('-contrasena');
                
                // Continuar con la siguiente función middleware
                next();
            } catch (error) {
                response.status(401).json({ 
                    message: 'ERROR: Usuario No autorizado!' 
                });
            }
        } else {
            response.status(401).json({ 
                message: 'ERROR: Token inválido - Formato incorrecto' 
            });
        }
    } else {
        response.status(401).json({ 
            message: 'ERROR: No autorizado - Token no proporcionado' 
        });
    }
};