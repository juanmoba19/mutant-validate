const SEQ = 4;
const ADN = "ATCG";
const Dao = require('./dao');

/**
 * Clase Service para manejar la logica de la aplicacion
 */
class Service {

    constructor() {
        this.dao = new Dao();
    }

    /**
     * Metodo que valida secuencia de ADN
     * @param {*} event request
     * @returns devuelve true o false 
     */
    async validateMutant(event) {
        try {
            const requestBody = JSON.parse(event.body);
            // Se valida el campo dna en el request y que sea un arreglo
            if(!requestBody.dna || !Array.isArray(requestBody.dna)) {
                throw "Esquema invalido en el Request"
            }
            let dna = requestBody.dna;
            let isMutant = false;
            // Se valida que la matriz sea de tamaño NXN y que los caracteres de la secuencia sean validos
            this.validateData(dna);
            // Se construye la matriz a un arreglo bidimensional
            let matriz = this.buildMatriz(dna);
            let numMutant = 0;
            let size = matriz.length;
            for(let i=0; i < size; i++) {
                for(let j=0; j < size; j++) {
                    // Se busca horizontal
                    let elem = matriz[i][j];
                    if(((j+SEQ) <= size) && elem === matriz[i][j+1] && elem === matriz[i][j+2]
                        && elem === matriz[i][j+3]) {
                        numMutant++;
                    }
                    // Se busca vertical
                    if(((i+SEQ) <= size) && elem === matriz[i+1][j] && elem === matriz[i+2][j]
                        && elem === matriz[i+3][j]) {
                        numMutant++;
                    }
                    // Se busca de forma oblicua descendente
                    if(((j+SEQ) <= size) && ((i+SEQ) <= size) && elem === matriz[i+1][j+1] 
                        && elem === matriz[i+2][j+2] && elem === matriz[i+3][j+3]) {
                            numMutant++;
                    }
                    // Se busca de forma oblicua ascendente
                    if((j + 4 <= size) && (i + 1 >= SEQ) && elem === matriz[i-1][j+1] 
                        && elem === matriz[i-2][j+2] && elem === matriz[i-3][j+3]) {
                            numMutant++;
                    }
                }
            }
            if(numMutant > 1) {
                isMutant =  true;
            }
            // Se manda a almacenar la cadena de adn y el resultado a DYNAMO
            let saveDna = await this.dao.submitVerifiedDna({dna: dna.toString(), isMutant: isMutant});
            console.log("Resultado de guardar item: " + saveDna);
    
            if(!isMutant) {
                throw "No es mutante"
            }
    
            return {
                statusCode: 200,
                body: JSON.stringify({
                    isMutant: isMutant
                }),
            };
        } catch(error) {
            console.log(JSON.stringify(error));
            let message = typeof error === "string" ? error : error.message;
            return {
                statusCode: 403,
                body: JSON.stringify({
                    message: message
                }),
            };
        }
    }

    /**
     * 
     * @param {*} dna 
     * @returns devuelve JSON con informacion de la estadistica
     */
    validateData(dna) {
        let size = dna.length;
        dna.forEach(elem => {
            let sizeRow = elem.length;
            if(size !== sizeRow) {
                throw "La matriz no es de tamaño NXN"
            }
            for(let i=0; i<elem.length; i++){
                if (ADN.indexOf(elem.charAt(i),0) === -1){
                    throw "Secuencia de ADN invalido"
                }
             }
        })
    }

    /**
     * Se construye una matriz de string a una matriz de caracteres
     * @param {*} dna arreglo de string
     * @returns devuelve una matriz bidimensional de tamaño NXN 
     */
    buildMatriz(dna) {
        let matriz = [];
        dna.forEach(elem => {
            let rowMatriz = elem.split("");
            matriz.push(rowMatriz);
        });
        return matriz;
    }

    /**
     * Metodo para devolver la informacion de estadisticas de la api
     * @returns JSON con la cantidad de mutantes, de humanos y el ratio
     */
    async getStats() {
        let countMutan = 0;
        let countHuman = 0;
    
        let results = await this.dao.asyncScanItems();
        results.Items.forEach(elem => {
            if(elem.isMutant) {
                countMutan++;
            } else {
                countHuman++;
            }
        });
    
        return {
            statusCode: 200,
            body: JSON.stringify({
                count_mutant_dna: countMutan,
                count_human_dna: countHuman,
                ratio: countMutan/countHuman
            }),
        };
    }
}

module.exports = Service;