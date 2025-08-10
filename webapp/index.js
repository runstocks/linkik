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
    // Updated to use the new feature name
    const { open_gap_perc } = req.body;

    if (open_gap_perc === undefined || typeof open_gap_perc !== 'number') {
        return res.status(400).json({ error: 'El campo "open_gap_perc" es requerido y debe ser un número.' });
    }

    // Llamar al script de Python para hacer la predicción
    const pythonProcess = spawn('python3', [predictScriptPath, open_gap_perc]);

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
