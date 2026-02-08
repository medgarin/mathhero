# Configuración de Supabase para EasyMaths

## Paso 1: Crear un Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta (es gratis)
2. Haz clic en "New Project"
3. Completa los detalles:
   - **Name**: EasyMaths (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (guárdala en un lugar seguro)
   - **Region**: Selecciona la región más cercana a ti
4. Haz clic en "Create new project" y espera unos minutos mientras se crea

## Paso 2: Ejecutar el Schema de la Base de Datos

1. En tu proyecto de Supabase, ve a la sección **SQL Editor** en el menú lateral
2. Haz clic en "New Query"
3. Copia todo el contenido del archivo `supabase/schema.sql` de este proyecto
4. Pégalo en el editor SQL
5. Haz clic en "Run" para ejecutar el script
6. Deberías ver un mensaje de éxito confirmando que las tablas fueron creadas

## Paso 3: Obtener las Credenciales

1. Ve a **Settings** → **API** en el menú lateral de Supabase
2. Encontrarás dos valores importantes:
   - **Project URL**: Algo como `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: Una clave larga que comienza con `eyJ...`

## Paso 4: Configurar las Variables de Entorno

1. En la raíz del proyecto EasyMaths, crea un archivo llamado `.env.local`
2. Copia el siguiente contenido y reemplaza los valores con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

3. Guarda el archivo

## Paso 5: Reiniciar el Servidor de Desarrollo

Si el servidor de desarrollo está corriendo, deténlo (Ctrl+C) y vuelve a iniciarlo:

```bash
pnpm dev
```

## Verificar la Instalación

1. Abre la aplicación en tu navegador (normalmente `http://localhost:3000`)
2. Deberías ser redirigido a la página de bienvenida
3. Ingresa un nombre y haz clic en "Comenzar a jugar"
4. Juega un juego completo
5. Ve a Supabase → **Table Editor** → **users** y deberías ver tu usuario
6. Ve a **game_scores** y deberías ver tu puntuación guardada
7. En la app, haz clic en "Ver mi marcador" para ver tu historial

## Solución de Problemas

### Error: "Invalid API key"
- Verifica que copiaste correctamente la `anon key` de Supabase
- Asegúrate de que el archivo `.env.local` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo

### No se guardan los datos
- Verifica que ejecutaste el schema SQL correctamente
- Revisa la consola del navegador para ver errores
- Verifica que las políticas RLS estén habilitadas en Supabase

### La página de bienvenida no aparece
- Limpia el localStorage del navegador (F12 → Application → Local Storage → Clear)
- Recarga la página

## Próximos Pasos (Futuro)

Con esta base, podrás agregar:
- **Leaderboard global**: Mostrar los mejores puntajes de todos los usuarios
- **Autenticación**: Agregar login con email/contraseña o redes sociales
- **Perfiles de usuario**: Agregar avatares, logros, insignias
- **Desafíos diarios**: Crear retos especiales cada día
