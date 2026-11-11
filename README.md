# 📊 Investigación de Operaciones — Plataforma Web Interactiva
### Institución Universitaria Pascual Bravo · Medellín, Colombia

Esta plataforma web interactiva fue desarrollada para resolver de forma rigurosa y visual los problemas de **Planificación de Proyectos (PERT / CPM)** y **Modelos de Transporte** presentados en las diapositivas oficiales de la cátedra:
* `6-Proyecto Pert-Cpm.pptx`
* `5-Mètodo de transporte.pptx`

---

## 🚀 Cómo Abrir la Aplicación de Forma Inmediata

Tienes dos opciones para usar la aplicación:

### Opción 1: Abrir Directamente (Sin Instalar Nada)
1. Haz doble clic en el archivo **`Abrir_App_Investigacion_Operaciones.html`** (o ejecuta **`ejecutar_local.bat`**).
2. Se abrirá inmediatamente en Google Chrome, Microsoft Edge o tu navegador favorito, con todas las funciones activas.

### Opción 2: Modo Desarrollo (Vite + React)
```bash
npm install
npm run dev
```

---

## 🌐 Cómo Desplegar en Vercel

La aplicación está 100% configurada y lista para producción en Vercel con `vercel.json` y Vite.

### Método A: Desde la Consola (1 Clic)
1. Ejecuta el archivo **`desplegar_en_vercel.bat`** incluido en esta carpeta (o corre en PowerShell: `npx vercel`).
2. Sigue las instrucciones en pantalla para vincular tu cuenta de Vercel.
3. Para el despliegue final en producción ejecuta:
   ```bash
   npx vercel --prod
   ```

### Método B: Desde GitHub
1. Sube esta carpeta a un repositorio en tu GitHub:
   ```bash
   git init
   git add .
   git commit -m "Investigacion de Operaciones App"
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
2. Entra a [vercel.com](https://vercel.com), presiona **"Add New Project"** e importa tu repositorio.
3. Vercel detectará automáticamente Vite y desplegará tu aplicación en segundos.

---

## 🎯 Módulos y Correspondencia con las Diapositivas

### 1. Módulo PERT / CPM (Proyectos y Ruta Crítica)
* **Tabla Dinámica Personalizable:** Permite definir cuántas actividades (filas) y predecesores se necesitan, agregar, quitar o limpiar filas en tiempo real.
* **Preajustes de Clase:**
  * **Caso Diapositiva 34 (Hospital "Mi Salud"):** 10 actividades (A a I).
    * Duración total del proyecto: **16 días**.
    * Ruta Crítica: **`Inicio ➔ A ➔ E ➔ H ➔ I ➔ Fin`** (Holgura $H = 0$).
  * **Caso Diapositivas 16-22 (Construcción de una Casa):** 5 actividades (A a E).
    * Duración total del proyecto: **12 semanas**.
    * Ruta Crítica: **`Inicio ➔ A ➔ C ➔ E ➔ Fin`**.
* **Red de Actividades (Diagrama Diapositiva 22, 26 y 33):**
  * Representación estándar AON con cajas divididas:
    * Arriba: `ES` (Inicio Temprano) | `ID Actividad` | `EF` (Fin Temprano).
    * Abajo: `LS` (Inicio Tardío) | `Duración (t)` | `LF` (Fin Tardío).
    * Base: `Holgura (H)`.
  * Nodos y flechas de la ruta crítica destacados con aura roja.
  * Controles interactivos de Zoom, Pan y Centrado.
* **Diagrama de Gantt Interactivo:**
  * Eje temporal con barras de duración y holgura.
  * **Al hacer clic en cualquier tarea**, se despliega una tarjeta con:
    * **Tiempo demorado en la tarea (duración)**
    * Tiempos tempranos (ES, EF) y tardíos (LS, LF)
    * Holgura total y libre
    * Predecesores y sucesores directos
    * Estado de pertenencia a la ruta crítica.
* **Tabla de Tiempos y Holguras:** Desglose completo de $ES, EF, LS, LF, H, HL$ y si es crítica.

---

### 2. Módulo de Método de Transporte
* **Dimensiones Dinámicas:** Configura cuántos orígenes (filas) y destinos (columnas) necesitas. Permite añadir/eliminar fuentes y destinos, editar nombres, ofertas, demandas y costos unitarios.
* **Preajustes de Clase:**
  * **Diapositivas 11-17 (Diario El Tiempo):** Bogotá (1700), Medellín (2000), Cali (1700) hacia Villavicencio (1700), Ibagué (1000), Bucaramanga (1500) y Barranquilla (1200).
  * **Diapositivas 18-20 (Motores E-4):** Puertos (Ámsterdam, Amberes, El Havre) a Plantas (Leipzig, Nancy, Lieja, Tilburgo).
* **Métodos de Solución Comparados:**
  * **Método de Aproximación de Vogel (VAM):** Calcula paso a paso las penalizaciones por fila y columna, selecciona el máximo y resuelve con costo mínimo óptimo de **$23.100**.
  * **Método del Costo Mínimo (MCM) (Diapositiva 16):** Reproducción exacta de la diapositiva 16 arrojando **$24.600**.
  * **Solución Óptima / Solver (Diapositiva 17):** Resuelve la incógnita de la diapositiva 17 (*"¿Será la más óptima? Existe una solución de 23.100..."*).
  * **Regla de la Esquina Noroeste (MEN).**
* **Cuadro de Transporte (Estilo Diapositiva 16):**
  * Celda con cajita de costo unitario $c_{ij}$ en la esquina superior izquierda.
  * Círculo central con las unidades enviadas $x_{ij}$.
  * Oferta a la derecha y Demanda abajo con control de balance.
  * Fórmula de costo explícita: $\sum x_{ij} \times c_{ij}$.
* **Procedimiento Paso a Paso con Penalizaciones:**
  * Visor interactivo iteración por iteración.
  * Tablas de penalización por fila y columna con los cálculos de diferencia de los 2 menores costos activos.
  * Marcador de la penalización máxima seleccionada.
  * Explicación de la asignación y tachado de filas/columnas.
* **Gráfica de Red de Transporte (Estilo Diapositiva 11):**
  * Red bipartita interactiva: suministros a la izquierda (1, 2, 3) y demanda a la derecha (4, 5, 6, 7).
  * Selector para ver todas las rutas con costos unitarios (idéntico a diapositiva 11) o ver únicamente los flujos y cantidades asignadas.

---

### 3. Módulo de Teoría y Diapositivas
* Síntesis académica de las diapositivas de clase de la Institución Universitaria Pascual Bravo.
* Formulación del modelo de programación lineal y referencias bibliográficas (Hillier & Lieberman, Taha, Rendy).
