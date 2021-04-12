const config = require('../utils/config.json');
const axios = require('axios');

/**
 * Queries and returns a DatabaseObject from the database.
 * @param {string} url 
 * @param {Object} data 
 * @returns {Data}
 */
module.exports = (url, data) => {

    return new Promise(async (result) => {
        // eval supplied data 

        const RequestConfig = {
            method: "GET",
            url: url,
            headers: {
                'Authorization': `Bearer ${config.APIToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios(RequestConfig)
            .then(function (response) {
                return result(response.data)
            })
            .catch(function (error) {
                return result(false)
            });


    })

}