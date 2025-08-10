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

### 1. Instalar Dependencias del Modelo (Python)

Navega a la raíz del proyecto y ejecuta el siguiente comando para instalar las librerías de Python necesarias:

```bash
pip install -r model/requirements.txt
```

### 2. Instalar Dependencias de la Aplicación Web (Node.js)

Navega a la carpeta de la aplicación cliente e instala las dependencias de Node.js:

```bash
cd webapp/client
npm install
cd ../..  # Vuelve a la raíz del proyecto
```
También instala las dependencias del backend:
```bash
cd webapp
npm install
cd .. # Vuelve a la raíz del proyecto
```


### 3. Entrenar el Modelo de IA

Antes de poder hacer predicciones, necesitas entrenar el modelo con el dataset proporcionado. Ejecuta el script de entrenamiento desde la raíz del proyecto:

```bash
python3 model/train.py
```

Esto creará un archivo `predictive_model.joblib` en la carpeta `/model`.

### 4. Ejecutar la Aplicación

El proyecto consta de un backend y un frontend, que deben ejecutarse en terminales separadas.

**En una terminal, inicia el servidor backend:**

```bash
node webapp/index.js
```

El servidor se iniciará en `http://localhost:4001`.

**En otra terminal, inicia la aplicación frontend de React:**

```bash
cd webapp/client
npm start
```

Esto abrirá automáticamente una pestaña en tu navegador en `http://localhost:3000` con la interfaz de usuario, lista para hacer predicciones.

## Cómo Usar la Aplicación

1.  Asegúrate de que tanto el backend como el frontend estén en ejecución.
2.  Abre tu navegador en `http://localhost:3000`.
3.  Introduce un valor en el campo "Open Gap %" (por ejemplo, `0.15` para un 15%).
4.  Haz clic en el botón "Predecir Recorrido Máximo (RTH Run %)".
5.  La aplicación mostrará la predicción del modelo para el máximo recorrido porcentual que se espera durante el día.
