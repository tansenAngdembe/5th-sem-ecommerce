import axios from "axios"
const url = import.meta.env.VITE_AUTH_URl


const signup = async(data)=>{
    try {
        const response = await axios.post(`${url}/register`,data);
        return response.data
        
    } catch (error) {
        console.log(error)
        
    }
}

export {
    signup
}