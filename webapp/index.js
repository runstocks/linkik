const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = 4001;

// Middlewares
app.use(cors());
app.use(express.json());

// Resolve the absolute path to the predict.py script
const predictScriptPath = path.resolve(__dirname, '..', 'model', 'predict.py');

// Endpoint para realizar predicciones
app.post('/predict', (req, res) => {
    const features = req.body;

    // Basic validation
    if (typeof features !== 'object' || features === null) {
        return res.status(400).json({ error: 'Invalid input. Expected a JSON object with features.' });
    }

    // Convert the features object to a JSON string to pass as a single argument
    const featuresJsonString = JSON.stringify(features);

    // Call the Python script with the JSON string
    const pythonProcess = spawn('python3', [predictScriptPath, featuresJsonString]);

    let dataToSend = '';
    let errorToSend = '';

    // Recoger la salida del script de Python
    pythonProcess.stdout.on('data', (data) => {
        dataToSend += data.toString();
    });

    // Recoger errores del script de Python
    pythonProcess.stderr.on('data', (data) => {
        errorToSend += data.toString();
    });

    // Manejar el cierre del proceso
    pythonProcess.on('close', (code) => {
        if (errorToSend) {
            console.error(`Error del script de Python: ${errorToSend}`);
            return res.status(500).json({ error: 'Error interno del servidor al ejecutar el script de predicción.' });
        }

        try {
            const parsedData = JSON.parse(dataToSend);
            if(parsedData.error) {
                 console.error(`Error reportado por el script de Python: ${parsedData.error}`);
                 return res.status(500).json({ error: parsedData.error });
            }
            res.json(parsedData);
        } catch (error) {
            console.error(`Error al parsear la salida de Python: ${dataToSend}`);
            res.status(500).json({ error: 'Error al procesar la respuesta del modelo.' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
