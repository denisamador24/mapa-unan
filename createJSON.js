// Verifica si estamos en un entorno de Node.js
if (typeof process !== 'undefined' && process.stdin && process.stdout) {
  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const ubicaciones = [];

  function crearUbicacion(coordenadas, nombre) {
    const [lat, lng] = coordenadas.split(",").map(coord => parseFloat(coord));
    const ubicacion = {
      name: nombre,
      lat: lat,
      lng: lng
    };
    return ubicacion;
  }

  function pedirDatos() {
    rl.question('Ingresa las coordenadas (lat,lng): ', (coordenadas) => {
      if (coordenadas.toLowerCase() === 'exit') {
        console.log('Ubicaciones almacenadas:', JSON.stringify(ubicaciones, null, 2));
        rl.close();
        return;
      }

      rl.question('Ingresa el nombre de la ubicación: ', (nombre) => {
        const nuevaUbicacion = crearUbicacion(coordenadas, nombre);
        ubicaciones.push(nuevaUbicacion);
        console.log('Ubicación agregada:', nuevaUbicacion);
        console.log('------------------------');

        pedirDatos();
      });
    });
  }

  console.log('Escribe "exit" para salir.');
  pedirDatos();

} else {
  console.error('Este script solo puede ejecutarse en un entorno de Node.js.');
}
