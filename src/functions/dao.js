const AWS = require('aws-sdk');

/**
 * Clase Dao para la conexion a la base de datos Dynamo
 */
class Dao {

    /**
     * Metodo para hacer un put del item, con la informacion de la secuencia de ADN y un flag 
     * para saber si es mutante o no
     * @param {*} dna 
     */
    async submitVerifiedDna(dna) {
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        console.log('Submitting dna');
        const dnaInfo = {
            TableName: process.env.DNA_VERIFIED_TABLE,
            Item: dna,
        };
        return await dynamoDb.put(dnaInfo).promise();
    };

    /**
     * Metodo que devuelve todos los registros de ADN con el flag isMutant
     */
    async asyncScanItems() {
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: process.env.DNA_VERIFIED_TABLE,
            ProjectionExpression: "dna, isMutant"
        };
        console.log("Scanning dna table.");
        let results = await dynamoDb.scan(params).promise();
        return results;
    }
}

module.exports = Dao;