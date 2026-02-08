# Math Hero - EasyMaths

Una aplicación educativa interactiva para que los niños practiquen las tablas de multiplicar de manera divertida y efectiva.

## 🎮 Características

- **4 Niveles de Dificultad**: Desde tablas básicas hasta modo contrarreloj
- **Sistema de Vidas**: 3 vidas por juego para mantener el desafío
- **Puntuación y Estadísticas**: Seguimiento detallado del progreso
- **Marcador Personal**: Historial completo de juegos con análisis de errores
- **Repetición Inteligente**: El sistema repite preguntas falladas para reforzar el aprendizaje
- **Diseño Atractivo**: Interfaz moderna y colorida diseñada para niños

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- pnpm (recomendado) o npm
- Cuenta gratuita en [Supabase](https://supabase.com)

### Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd easymaths
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Configura Supabase:
   - Sigue las instrucciones en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Crea tu archivo `.env.local` con las credenciales

4. Inicia el servidor de desarrollo:
```bash
pnpm dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 📊 Estructura del Proyecto

```
easymaths/
├── app/                    # Páginas de Next.js
│   ├── page.tsx           # Página principal (selección de nivel)
│   ├── welcome/           # Página de bienvenida (ingreso de nombre)
│   ├── game/              # Página del juego
│   ├── results/           # Página de resultados
│   └── scoreboard/        # Marcador y estadísticas
├── components/            # Componentes reutilizables
├── lib/                   # Lógica de negocio y utilidades
│   ├── supabase.ts       # Cliente y funciones de Supabase
│   ├── types.ts          # Definiciones de TypeScript
│   ├── math-logic.ts     # Generación de preguntas
│   └── hooks/            # React hooks personalizados
├── supabase/             # Esquema de base de datos
└── public/               # Recursos estáticos

```

## 🎯 Niveles de Juego

1. **Nivel 1**: Tablas del 1 al 5 (10 segundos por pregunta)
2. **Nivel 2**: Tablas del 6 al 9 (10 segundos por pregunta)
3. **Nivel 3**: Mezclado - Todas las tablas (10 segundos por pregunta)
4. **Nivel 4**: Contrarreloj - Tiempo reducido progresivamente (10s → 7s → 5s)

## 💾 Base de Datos

La aplicación utiliza Supabase (PostgreSQL) con dos tablas principales:

- **users**: Almacena solo el nombre del usuario (privacidad primero)
- **game_scores**: Registra cada partida con detalles completos incluyendo preguntas falladas

Ver [supabase/schema.sql](./supabase/schema.sql) para el esquema completo.

## 🛠️ Tecnologías

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Base de Datos**: Supabase (PostgreSQL)
- **Gestión de Estado**: React Hooks
- **Iconos**: Material Symbols

## 📝 Scripts Disponibles

```bash
pnpm dev      # Inicia el servidor de desarrollo
pnpm build    # Construye la aplicación para producción
pnpm start    # Inicia el servidor de producción
pnpm lint     # Ejecuta el linter
```

## 🔮 Próximas Características

- [ ] Leaderboard global entre usuarios
- [ ] Sistema de logros e insignias
- [ ] Modo multijugador en tiempo real
- [ ] Desafíos diarios
- [ ] Temas personalizables
- [ ] Soporte para división y suma/resta

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.
