class Auth {

    setToken(api){
        localStorage.setItem('api', JSON.stringify(api))
    }

    getToken(){        
        let storage = localStorage.getItem('api')
        const api = JSON.parse(storage)
        
        return api && api.token ? api : null
    }

    isAuthenticated(){
        return this.getToken() ? true : false
    }

    logout(){
        localStorage.removeItem('api')
    }
}

export default Auth