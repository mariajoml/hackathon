# 🌐 AXES Landing Page

Una landing page moderna, minimalista y profesional para **AXES**, la plataforma **AI-first** que reemplaza perfiles inflados por **evidencia real de trabajo** y **conexiones auténticas**.

## ✨ Características

- **Framework**: Next.js 15 con App Router
- **Estilos**: TailwindCSS v4 con paleta personalizada morado + negro
- **Componentes**: shadcn/ui (button, card, accordion, badge, tabs, input)
- **Íconos**: lucide-react
- **Animaciones**: Efecto typewriter en el hero + transiciones suaves
- **SEO**: Metadatos completos y Open Graph configurados
- **Accesibilidad**: Navegación por teclado, contraste AA, focus visible

## 🎨 Diseño

### Paleta de Colores
- **Primario**: `#7C3AED` (morado vibrante)
- **Primario Dark**: `#5B21B6` (hover states)
- **Fondo**: Gradiente de `#0B0B0F` a `#000000`
- **Acentos**: `#1F0A3A` (morado oscuro para detalles)

### Características Visuales
- Bordes redondeados (`rounded-2xl`)
- Sombras suaves con acentos morados
- Gradientes elegantes y oscuros
- Efectos de hover y transiciones suaves
- Backdrop blur en elementos superpuestos

## 🏗️ Estructura de Componentes

### Páginas y Secciones
1. **Navbar** - Navegación sticky con blur y logo
2. **Hero** - Headline con typewriter + mockups de perfil
3. **ValueProposition** - 4 tarjetas con propuesta de valor
4. **HowItWorks** - 3 pasos del proceso con conectores
5. **RealConnections** - Grid de proyectos + testimonios
6. **DemoSection** - Tabs interactivos (Persona/Empresa/Conexiones)
7. **AuthSection** - Formulario de login/registro
8. **FAQSection** - Accordion con preguntas frecuentes
9. **Footer** - Links y información de contacto

### Componentes Especiales
- **TypewriterText** - Efecto de máquina de escribir personalizado
- **Navbar** - Navegación responsive con scroll effects
- **Hero** - Cards de portfolio con skill fingerprint

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start

# Linting
npm run lint
```

## 📱 Responsive Design

La landing page está optimizada para:
- **Desktop**: Layouts de 2-4 columnas
- **Tablet**: Layouts adaptables con grid responsive
- **Mobile**: Stack vertical con navegación hamburger

## ♿ Accesibilidad

- Contraste AA en todos los textos
- Navegación por teclado completa
- Focus visible en elementos interactivos
- Alt text descriptivo en imágenes
- Estructura semántica correcta
- Roles ARIA donde necesario

## 🎯 SEO y Meta Tags

- Título y descripción optimizados
- Open Graph para redes sociales
- Twitter Cards configuradas
- Schema markup implícito
- Sitemap automático (Next.js)

## 🎭 Animaciones

- **Typewriter**: Efecto en el headline principal
- **Scroll**: Fade-in suave en secciones
- **Hover**: Estados interactivos en cards y botones
- **Transitions**: Suaves en tabs y cambios de estado

## 💡 Conceptos Clave

> **"En AXES no necesitas disfrazarte para encajar. Aquí tu trabajo habla por ti."**

- **Evidencia sobre palabras**: Proyectos reales vs. CVs inflados
- **AI Insights**: Análisis automático de habilidades
- **Conexiones auténticas**: Validación entre pares
- **Skill Fingerprint**: Visualización de expertise real

## 📦 Dependencias Principales

```json
{
  "next": "15.5.0",
  "react": "19.1.0",
  "tailwindcss": "^4",
  "framer-motion": "^12.23.12",
  "lucide-react": "^0.541.0",
  "@radix-ui/react-*": "^1.x"
}
```

## 🔧 Configuración

### TailwindCSS v4
El proyecto utiliza la nueva versión de Tailwind con configuración en CSS:
- Variables personalizadas en `globals.css`
- Colores AXES definidos como custom properties
- Animaciones keyframe personalizadas

### shadcn/ui
Componentes configurados con tema personalizado:
- Paleta adaptada a AXES
- Variantes personalizadas
- Accesibilidad incluida

## 🎨 Customización

Para personalizar colores, edita las variables CSS en `src/app/globals.css`:

```css
--color-axes-primary: #7C3AED;
--color-axes-primary-dark: #5B21B6;
--color-axes-bg-start: #0B0B0F;
--color-axes-bg-end: #000000;
--color-axes-accent-purple: #1F0A3A;
```

## 📄 Licencia

Proyecto desarrollado para AXES © 2025 - Autenticidad primero · AI-powered

---

**Desarrollado con ❤️ para developers reales**