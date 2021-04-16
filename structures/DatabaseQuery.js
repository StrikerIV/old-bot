const config = require('../utils/config.json');
const axios = require('axios');

function ErrorObject(error) {
    return {
        error: error.response.status ? `${error.response.status}: ${error.response.statusText}` : error.data.message,
        code: error.response.status ? null : error.data.code
    }
}

function ResultObject(error, data, fields) {
    return PermissionCheckResult = {
        error: error,
        data: data,
        fields: fields
    }
}

/**
 * Queries and returns a DatabaseObject from the database.
 * @typedef {Object{error, data, fields}} DatabaseObject
 * @param {string} query 
 * @param {Array} parameters 
 * @returns {DatabaseObject}
 */
module.exports = (query, parameters) => {

    return new Promise(async (result) => {
        // eval GET, POST, or DELETE request
        let HTTPMethod = null;
        let QueryMethod = query.split(" ")[0];

        switch (QueryMethod) {
            case "SELECT":
                HTTPMethod = "GET";
                break;
            case "INSERT": case "UPDATE":
                HTTPMethod = "POST";
                break;
            case "DELETE":
                HTTPMethod = "DELETE";
                break;
            default:
                return result(ResultObject(true, null, null))
        }

        if (parameters.includes(null) || QueryMethod === "INSERT") {
            //when we supply 'null' in an INSERT, we want default values, therefor we need to remove those values
            //start with params, then we create the values input
            
            let splitQuery = query.split("(")
            splitQuery = splitQuery[1].split(")")[0].split(",")

            let database = query.split(" ")[2].split("(")[0]
            let actualParams = parameters.filter(param => param != null)

            parameters = actualParams
            query = `INSERT INTO ${database}(${splitQuery.slice(0, parameters.length)}) VALUES(${"?, ".repeat(parameters.length - 1) + "?"})`
        }

        const params = new URLSearchParams({
            'query': query,
        })

        for ([index, param] of parameters.entries()) {
            params.append('params[]', param)
        }

        console.log(params)
        const RequestConfig = {
            method: HTTPMethod,
            url: 'https://kryt.xyz/api/v1/database',
            headers: {
                'Authorization': `Bearer ${config.APIToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: params
        };

        axios(RequestConfig)
            .then(function (response) {
                let data = response.data
                return result(ResultObject(data.error, data.data, data.fields))
            })
            .catch(function (error) {
                return result(ResultObject(ErrorObject(error), null, null))
            });


    })

}