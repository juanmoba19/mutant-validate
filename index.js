const Service = require('./src/functions/service')

/**
 * Metodo Handler para validar si una secuencia de ADN corresponde a un humano o mutante
 * @param {*} event 
 * @param {*} context 
 */
async function validateMutant(event, context) {
    const service = new Service();
    let validate = await service.validateMutant(event);
    return validate;
}

/**
 * Metodo para devolver las estadisticas de humanos y mutantes
 * @param {*} event 
 * @param {*} context 
 */
async function getStats(event, context) {
    const service = new Service();
    let stats = await service.getStats();
    return stats;
}

module.exports.validateMutant = validateMutant;
module.exports.getStats = getStats;
