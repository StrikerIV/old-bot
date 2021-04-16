const axios = require("axios")

/**
 * Fetches an image.
 * @param {string} url 
 * @returns {Buffer}
 */
module.exports = (url) => {

    return new Promise(async (result) => {
        axios.get(url, {
            responseType: 'arraybuffer'
        })
            .then(response => {
                if (!response.headers['content-type'].includes("image")) return result(null);
                let buffer = Buffer.from(response.data, 'binary')
                result(buffer)
            })
    })

}