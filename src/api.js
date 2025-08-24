import axios from "axios"

const url = import.meta.env.VITE_URL

const productDetails = async (endpoint) => {
    try {
        const response = await axios.post(`${url}/${endpoint}`, {
            pageNumber: 0,
            pageSize: 100
        })
        // console.log(response.data.data.content)
        return response.data.data;

    } catch (error) {
        console.log(error)

    }
}

const myCartItems = async () => {
    try {
        const response = await axios.post(`${url}/cart/get`, {}, {
            withCredentials: true
        })
        return response;

    } catch (error) {
        console.log(error)

    }
}

const addToCart = async (id, quantity) => {
    try {
        const response = await axios.post(`${url}/cart/add`,
            {
                productId: id,
                quantity: quantity
            }
            , {
                withCredentials: true
            })
        return response;

    } catch (error) {
        console.log(error)

    }
}

const removeCartItems = async (id) => {
    try {
        const response = await axios.post(`${url}/cart/remove`,
            {
                id: id
            }
            , {
                withCredentials: true
            })
        return response;

    } catch (error) {
        console.log(error)

    }
}
const getAddresses = async () => {
    try {
        const response = await axios.post(`${url}/addresses/get-all`,
            {}
            , {
                withCredentials: true
            })
        return response;

    } catch (error) {
        console.log(error)

    }
}
const getPaymentRequest = async (id) => {
    try {
        const response = await axios.post(`${url}/customer/payments/process-pay`,
            {
                orderId:id
            }
            , {
                withCredentials: true
            })
        return response;

    } catch (error) {
        console.log(error)

    }
}

export {
    productDetails,
    myCartItems,
    addToCart,
    removeCartItems,
    getAddresses,
    getPaymentRequest
}