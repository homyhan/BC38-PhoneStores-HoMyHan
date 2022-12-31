var productServices = {
    fetchProduct: function () {
        return axios({
            url: "https://6388b315d94a7e5040a45713.mockapi.io/products",
            method: "GET"
        })
    },
    fetchProductDetail: function (id) {
        return axios({
            url: "https://6388b315d94a7e5040a45713.mockapi.io/products/"+id,
            method: "GET"
        })
    },
    createProduct: function(product){
        return axios({
            url: "https://6388b315d94a7e5040a45713.mockapi.io/products",
            method: "POST",

            data: product,
        })
    },
    deleteProduct: function (id) {
        return axios({
            url: "https://6388b315d94a7e5040a45713.mockapi.io/products/"+id,
            method: "DELETE"
        })
        
    },
    updateProductDetail: function (product, id) {
        return axios({
            url: "https://6388b315d94a7e5040a45713.mockapi.io/products/"+id,
            method: "PUT",
            data: product,
        })
    }
}