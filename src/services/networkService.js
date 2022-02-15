import axios from 'axios'

const getInstance = (baseURL, headers) => {
    const instance = axios.create({ baseURL, headers})
    return instance    
}

export const get = async (baseURL, path, headers) => {
    const instance = getInstance(baseURL, headers)
    const result = await instance.get(path).catch(error => {
        console.error(error)
        return {status: 500, data:{error, errorMessage: 'Unexpected error.'}}
    })

    return result
}