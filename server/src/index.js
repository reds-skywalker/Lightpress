const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares: Permitir peticiones del frontend y entender formato JSON
app.use(cors());
app.use(express.json());

// Configuración de AWS
// La instancia EC2 usa su Rol IAM automáticamente para autenticarse
AWS.config.update({ region: 'us-east-1' });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'LightpressScores';

// Ruta de prueba (Healthcheck)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Backend de LightPress operativo y seguro 🚀' });
});

// Ruta para GUARDAR un puntaje
app.post('/api/scores', async (req, res) => {
    const { userId, score, level } = req.body;
    
    const params = {
        TableName: TABLE_NAME,
        Item: {
            userID: userId || `Player_${Math.floor(Math.random() * 10000)}`,
            score: Number(score),
            level: Number(level),
            fecha: new Date().toISOString()
        }
    };

    try {
        await dynamoDB.put(params).promise();
        res.status(201).json({ message: '¡Puntaje guardado en DynamoDB!' });
    } catch (error) {
        console.error("Error al guardar:", error);
        res.status(500).json({ error: 'Error interno del servidor al conectar con AWS' });
    }
});

// Ruta para OBTENER los puntajes
app.get('/api/scores', async (req, res) => {
    const params = {
        TableName: TABLE_NAME
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        res.status(200).json(data.Items);
    } catch (error) {
        console.error("Error al leer:", error);
        res.status(500).json({ error: 'Error al leer la base de datos' });
    }
});

app.listen(port, () => {
    console.log(`Servidor Backend corriendo en el puerto ${port}`);
});
