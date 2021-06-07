const AWSMock = require('aws-sdk-mock');
const chai = require('chai');
const expect = chai.expect;
const index = require('../index');
const eventIsMutant = {
    body: '{"dna":["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]}'
};
const eventIsHuman = {
    body: '{"dna":["ATGCGA","CAGTGC","TTATTT","AGACGG","GCGTCA","TCACTG"]}'
};
const eventMatrizIsNotNXN = {
    body: '{"dna":["CAGTGC","TTATTT","AGACGG","GCGTCA","TCACTG"]}'
};
const eventInvalidSchema = {
    body: '{"dna":"String"}'
};
const eventSeqDNAInvalid = {
    body: '{"dna":["JTGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]}'
};

describe('Tests verified dna successful', function () {
    this.timeout(0);
    beforeEach(function () {
        AWSMock.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
            callback(null, true);
        });
        AWSMock.mock('DynamoDB.DocumentClient', 'scan', function (params, callback) {
            callback(null, {Items: [{isMutant: false},{isMutant: false},{isMutant: true}]});
        });
    });
    it('Validation mutant = true', async () => {
        const result = await index.validateMutant( eventIsMutant, {});
        console.log('-------------------------------------------------------------');
        console.log('Result ', JSON.stringify(result));
        console.log('-------------------------------------------------------------');
        expect(JSON.parse(result.body).isMutant).to.equal(true);
    });
    it('Validation mutant = true', async () => {
        const result = await index.getStats( {}, {});
        console.log('-------------------------------------------------------------');
        console.log('Result ', JSON.stringify(result));
        console.log('-------------------------------------------------------------');
        expect(JSON.parse(result.body).count_mutant_dna).to.equal(1);
        expect(JSON.parse(result.body).ratio).to.equal(0.5);
    });
    after(function () {
        AWSMock.restore();
    });
});

describe('Tests verified dna fail', function () {
    this.timeout(0);
    beforeEach(function () {
        AWSMock.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
            callback(null, true);
        });
    });
    it('Validation mutant = false', async () => {
        const result = await index.validateMutant( eventIsHuman, {});
        console.log('-------------------------------------------------------------');
        console.log('Result ', JSON.stringify(result));
        console.log('-------------------------------------------------------------');
        expect(JSON.parse(result.body).message).to.equal("No es mutante");
    });

    it('Matrix is ​​not NXN', async () => {
        const result = await index.validateMutant( eventMatrizIsNotNXN, {});
        console.log('-------------------------------------------------------------');
        console.log('Result ', JSON.stringify(result));
        console.log('-------------------------------------------------------------');
        expect(JSON.parse(result.body).message).to.equal("La matriz no es de tamaño NXN");
    });

    it('Request Schema Invalid', async () => {
        const result = await index.validateMutant( eventInvalidSchema, {});
        console.log('-------------------------------------------------------------');
        console.log('Result ', JSON.stringify(result));
        console.log('-------------------------------------------------------------');
        expect(JSON.parse(result.body).message).to.equal("Esquema invalido en el Request");
    });

    it('Invalid DNA Sequence', async () => {
        const result = await index.validateMutant( eventSeqDNAInvalid, {});
        console.log('-------------------------------------------------------------');
        console.log('Result ', JSON.stringify(result));
        console.log('-------------------------------------------------------------');
        expect(JSON.parse(result.body).message).to.equal("Secuencia de ADN invalido");
    });

    after(function () {
        AWSMock.restore();
    });
});