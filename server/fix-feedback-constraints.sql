-- Script para modificar las restricciones de clave foránea del feedback
-- Esto permitirá eliminar feedback sin problemas de dependencias

-- Conectarse a la base de datos
-- \c gestion_canchas_epn

-- Eliminar las restricciones existentes
ALTER TABLE feedback 
DROP CONSTRAINT IF EXISTS feedback_usuario_id_fkey;

ALTER TABLE feedback 
DROP CONSTRAINT IF EXISTS feedback_cancha_id_fkey;

-- Agregar las nuevas restricciones con CASCADE DELETE
ALTER TABLE feedback 
ADD CONSTRAINT feedback_usuario_id_fkey 
FOREIGN KEY (usuario_id) REFERENCES usuarios(id) 
ON DELETE CASCADE;

ALTER TABLE feedback 
ADD CONSTRAINT feedback_cancha_id_fkey 
FOREIGN KEY (cancha_id) REFERENCES canchas(id) 
ON DELETE CASCADE;

-- Verificar que las restricciones se aplicaron correctamente
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='feedback';

-- Mensaje de confirmación
SELECT 'Restricciones de feedback actualizadas con CASCADE DELETE' as mensaje; 