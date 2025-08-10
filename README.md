# Proyecto de IA Predictiva para Trading v0

Este proyecto es una prueba de concepto (v0) para un servicio de IA que predice el comportamiento de acciones en base a datos de mercado.

## Estructura del Proyecto

El repositorio está organizado en dos componentes principales:

-   `/model`: Contiene todo lo relacionado con el modelo de Machine Learning.
    -   `dataset.csv`: El dataset utilizado para el entrenamiento.
    -   `train.py`: Script para entrenar el modelo de IA y guardarlo.
    -   `predict.py`: Script que carga el modelo entrenado y realiza predicciones.
    -   `requirements.txt`: Dependencias de Python.
-   `/webapp`: Contiene la aplicación web para interactuar con el modelo.
    -   `index.js`: El servidor backend (Node.js/Express).
    -   `/client`: La aplicación frontend (React/Mantine).

## Cómo Empezar

Sigue estos pasos para instalar las dependencias y ejecutar el proyecto.

### Prerrequisitos

-   Python 3.x
-   Node.js y npm

### 1. Instalar Dependencias

Hay tres conjuntos de dependencias que instalar:

**a) Modelo de Python:**
Navega a la raíz del proyecto y ejecuta:
```bash
pip install -r model/requirements.txt
```

**b) Backend (Node.js):**
Desde la raíz del proyecto, ejecuta:
```bash
npm install --prefix webapp
```

**c) Frontend (React):**
Desde la raíz del proyecto, ejecuta:
```bash
npm install --prefix webapp/client
```

### 2. Entrenar el Modelo de IA

Antes de poder hacer predicciones, necesitas entrenar el modelo con el dataset proporcionado. Ejecuta el script de entrenamiento desde la raíz del proyecto:

```bash
python3 model/train.py
```

Esto creará un archivo `predictive_model.joblib` en la carpeta `/model`. Si este archivo ya existe, será sobrescrito.

### 3. Ejecutar la Aplicación

Gracias al script de ejecución concurrente, puedes lanzar tanto el backend como el frontend con un solo comando.

**Desde la raíz del proyecto, navega a la carpeta `webapp` y ejecuta:**

```bash
cd webapp
npm run start:dev
```

Esto hará dos cosas:
1.  Iniciará el servidor backend en `http://localhost:4001`.
2.  Iniciará el servidor de desarrollo del cliente React y abrirá automáticamente una pestaña en tu navegador en `http://localhost:3000`.

## Cómo Usar la Aplicación

1.  Asegúrate de que la aplicación esté en ejecución con `npm run start:dev`.
2.  Abre tu navegador en `http://localhost:3000`.
3.  Introduce un valor en el campo "Open Gap %" (por ejemplo, `0.15` para un 15%).
4.  Haz clic en el botón "Predecir Recorrido Máximo (RTH Run %)".
5.  La aplicación mostrará la predicción del modelo para el máximo recorrido porcentual que se espera durante el día.
