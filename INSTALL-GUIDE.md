# 🚀 **Guía de Instalación Multiplataforma**

## 📋 **Requisitos Previos (En cualquier SO)**

### **🐳 Docker & Docker Compose**
- **Windows:** Docker Desktop
- **Mac:** Docker Desktop  
- **Linux:** Docker Engine + docker-compose

### ** Node.js**
- **Versión:** 18+ o 20+
- **Instalación:** [nodejs.org](https://nodejs.org)

### ** Chrome/Chromium**
- **Windows:** Google Chrome
- **Mac:** Google Chrome
- **Linux:** `sudo apt install chromium-browser` o Google Chrome

##  **Instalación (3 pasos)**

### **1️⃣ Clonar repositorio:**
```bash
git clone <tu-repo-url>
cd dolibarr-test
```

### **2️⃣ Instalar dependencias:**
```bash
npm install
```

### **3️⃣ Levantar entorno:**
```bash
docker-compose up -d
```

## ▶️ **Ejecución**

### ** Ejecutar pruebas L9(3⁴):**
```bash
npm test
# O directamente:
node corrected-orthogonal-runner.js
```

### ** Ver resultados:**
- **Logs:** En terminal
- **Screenshots:** `reports/screenshots/`
- **Informe:** `INFORME-FINAL-COMPLETO.md`

##  **Troubleshooting por SO**

### ** Windows:**
- Si Docker falla: Habilitar WSL2
- Si Chrome no se encuentra: Verificar PATH

### ** Mac:**
- Si permisos: `sudo chmod +x docker-compose`
- Si M1/M2: Docker funciona nativamente

### ** Linux:**
- Chrome: `sudo apt install google-chrome-stable`
- Permisos Docker: `sudo usermod -aG docker $USER`
- Reiniciar sesión después del comando anterior

##  **Testing Offline**

**¿Funciona sin internet?**
- ✅ Docker local: SÍ
- ✅ Dolibarr: SÍ (contenedor local)
- ✅ Selenium: SÍ (Chrome local)
- ❌ Instalación inicial: NO (requiere descargar imágenes)

##  **Variables de Entorno (Opcional)**

Crear `.env` para personalizar:
```env
# Puerto Dolibarr (default: 8080)
DOLIBARR_PORT=8080

# Modo headless (default: true)  
SELENIUM_HEADLESS=true

# Timeout pruebas (default: 30000ms)
TEST_TIMEOUT=30000
```

## 📊 **Verificación de Compatibilidad**

Ejecutar test de compatibilidad:
```bash
npm run verify
```

Esto verifica:
- ✅ Docker funcionando
- ✅ Node.js versión correcta
- ✅ Chrome accesible
- ✅ Puertos disponibles

## 🚨 **Limitaciones Conocidas**

### **En CI/CD:**
- Requiere Docker (GitHub Actions ✅, GitLab CI ✅)
- Necesita Chrome headless (funciona)

### **En sistemas limitados:**
- Mínimo 4GB RAM recomendado
- Docker debe tener permisos de administrador

## 🎉 **Éxito Esperado**

Después de `npm test` deberías ver:
```
✅ EXCELENTE: Las expectativas con campos obligatorios se cumplieron
Total casos: 9
Expectativas cumplidas: 9/9 (100.0%)
```

---

**💡 Tip:** Si algo falla, revisa `docker-compose logs` para diagnosticar.