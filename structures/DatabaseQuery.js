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

        const params = new URLSearchParams({
            'query': query,
        })

        for await ([index, param] of parameters.entries()) {
            params.append('params[]', param)
        }

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