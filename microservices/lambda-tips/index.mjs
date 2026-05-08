export const handler = async (event) => {
    // Lista de mensajes aleatorios para el juego
    const mensajes = [
        { id: 1, tipo: "tip", mensaje: "Evita movimientos bruscos ya que te pueden costar una vida" },
        { id: 2, tipo: "bonus", mensaje: "Si superas el record subimos tu beca en la escuela" },
        { id: 3, tipo: "lore", mensaje: "Este juego es tan sencillo que lo dificil sera no jugarlo" },
        { id: 4, tipo: "status", mensaje: "Estas en fuego" }
    ];

    // Seleccionar uno al azar
    const indiceAleatorio = Math.floor(Math.random() * mensajes.length);
    const mensajeSeleccionado = mensajes[indiceAleatorio];

    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
        },
        body: JSON.stringify(mensajeSeleccionado),
    };
    
    console.log("Mensaje aleatorio generado:", mensajeSeleccionado);
    
    return response;
};
