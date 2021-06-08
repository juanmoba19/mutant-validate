
# Validate - DNA
---
Este microservicio tiene como objetivo validar si una secuencia de ADN pertenece a un humano o a un mutante. Ademas se devuelve de una base de datos la estadisticas de los analisis de ADN realizados


# Getting Started
---
## Contenido:
1.	Environment Variables. 
2.	Schema and Validation
3.	Request and Response HTTP 
4. Installation
5.	Testing
6.	Indicated Documents

 ## 1. Environment Variables 
---

| Nombre                               | Valor                                                     |
| ------------------------------------ | ----------------------------------------------------------|
| DNA_VERIFIED_TABLE                    |   dna-verified                                                   |
|REGION                                | us-east-1                                                                               |
| STAGE                                |dev                                       |


## 2. Schema and Validation
---
Se espera un request body json, con la siguiente estructura
~~~
{
    
    "dna":["ATGCGA","CAGTGC","TTATTT","AGACGG","GCGTCA","TCACTT"]

} 

~~~
Se valida que el json tenga la propiedad dna, ademas que el valor del campo sea un arreglo. Que el tamaño del arreglo sea de NXN y que los caracteres de la secuencia de ADN solo sean `ATCG`
 
## 4. Request and Response HTTP 
---

Api que se exponen:

##### 1. Verificar si sencuencia es de mutante o humano
 El recurso al que se accede es **/mutant**.

`URL`: `https://4mrfwxhbe4.execute-api.us-east-1.amazonaws.com/dev/mutant`

**Method**
  **post** : solicita validacion de la secuencia de ADN
 **Response**: 
  * `200`: la secuencia corresponde a la de un mutante
  * `403`: la secuencia no es de un mutante, es un humano

Ejemplo mensajeria:

**Request**
~~~
{
    "dna":["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]
} 
~~~
**Response status code 200**
~~~
{
    "isMutant": true
}
~~~
**Response status code 403**
~~~
{
    "message": "No es mutante"
}
~~~
##### 2. obtener estadisticas
 El recurso al que se accede es **/stats**.

`URL`: `https://4mrfwxhbe4.execute-api.us-east-1.amazonaws.com/dev/stats`

**Method**
  **get** : solicita las estadisticas de los llamados a la api, la cantidad de adn verificada para humanos, la cantidad de mutantes y el ratio
 **Response**: 
  * `200`: informacion de estadisticas de la api

Ejemplo mensajeria:
**Response status code 200**
~~~
{
    "count_mutant_dna": 1,
    "count_human_dna": 2,
    "ratio": 0.5
}
~~~
## 5. Installation
---
### Prerequisites
---
Instalar las siguientes herramientas:

- [Node 12.x](http://nodejs.org)
- [Serverless 1.2x](https://serverless.com/)
- AWS Access Key
- [Visual Studio Code](https://code.visualstudio.com/) � IDE de preferencia.
- [Postman](https://www.getpostman.com/downloads/)

#### Download and Run Repository
---
Para iniciar el proceso de implementación y descarga de este repositorio es necesario: 

 1. **Clonar repositorio:**
Para este paso es necesario contar con una cuenta de github:
A continuación ejecutar el siguiente comando:
```sh
	git clone https://github.com/juanmoba19/mutant-validate.git
```
 2. **Descargar dependencias NPM:**
Para este paso se debe ejecutar el siguiente comando para descargar las librerias necesarias
```sh
	npm install
```

 3. **Desplegar lambda en aws:**
Para este paso se debe ejecutar el siguiente comando para desplegar con serverless en la nube de AWS
```sh
	serverless deploy  
```



## 6. Testing

Esta sección esta dedicada en conocer todo el proceso de pruebas 

### Pruebas unitarias

#### Herramientas

Las herramientas usadas son las siguientes dependencias de desarrollo : **mocha**, **chai**,  **aws-sdk-mock**.


La configuración necesaria para ejecutar esta herramienta se puede encontrar en el **package.json** en la sección "**scripts**":
~~~
"scripts": {
    "test": "env-cmd -f ./test/.env nyc --all --reporter=lcov --reporter=text-summary mocha --recursive \"./test/**/*.spec.js\" --reporter=nyan"
  }
~~~

Por lo tanto para ejecutar las pruebas lo hacemos con el siguiente comando: 
```sh
	npm run test
```
 **Nota**: El archivo de cobertura se podra observar en la carpeta coverage, despues de ejecutar el comando de test.
 
 
