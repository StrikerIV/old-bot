const config = require('../utils/config.json');
const axios = require('axios');

function ResultObject(error, data, fields) {
    return PermissionCheckResult = {
        error: error,
        data: data,
        fields: fields
    }
}

module.exports = (query, parameters) => {

    return new Promise(async (result) => {
        // eval GET, POST, or DELETE request
        let HTTPMethod = null;
        let QueryMethod = query.split(" ")[0];

        switch (QueryMethod) {
            case "SELECT":
                HTTPMethod = "GET";
                break;
            case "INSERT" || "UPDATE":
                HTTPMethod = "POST";
                break;
            case "DELETE":
                HTTPMethod = "DELETE";
                break;
            default:
                return result(ResultObject(true, null, null))
        }

        const params = new URLSearchParams()
        params.append('query', query)
        params.append('params', parameters[0] ? parameters : '[]')

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
                return result(ResultObject(true, null, null))
            });


    })

}