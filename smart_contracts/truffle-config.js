const path = require("path");

module.exports = {
  // Cambiar directorio por defecto para los contratos compilados
  contracts_build_directory: path.join(__dirname, '../frontend/src/contracts'),
  // Definir redes a utilizar
  networks: {
    // Red de desarrollo de GANACHE
    development: {      
      host: 'localhost',
      port: 7545,
      network_id: '*', // matchear cualquier red contra la que se lancen los scripts
    },
    // Red de desarrollo de Alastria
    testnetAlastria: {
      host: 'localhost',
      port: 22001,
      network_id: '*', // matchear cualquier red contra la que se lancen los scripts
      gas: 0xffffff, // limite de gas por transaccion
      gasPrice: 0x0,
      from: '0x74d4c56d8dcbc10a567341bfac6da0a8f04dc41d'
    },
    // Nodo UNIR de Alastria
    nodoUnir: {
      host: '10.141.8.11',
      port: 8545,
      network_id: '*', // matchear cualquier red contra la que se lancen los scripts
      gas: 0xffffff, // limite de gas por transaccion
      gasPrice: 0x0,
      from: '0xbc869c21d631e122d35789942a573241ec04d2e4'
    }    
  },
  compilers: {
    solc: {
      // version: '0.5.5',
      /*settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }      */
    }
  }
};