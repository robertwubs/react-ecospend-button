import axios from 'axios'

class EcospendService {
    constructor({clientId, clientSecret, authenticationUrl, sandbox}){
        if((clientId && clientSecret) || authenticationUrl){
            this.client_id = clientId
            this.client_secret = clientSecret
            this.authenticationUrl = authenticationUrl
            this.token_url = 'https://iamapi-px01.ecospend.com/connect/token'
            this.api_url = sandbox ? 'https://pis-api-sandbox.ecospend.com/api/v2.0/' : 'https://pis-api-sandbox.ecospend.com/api/v2.0/'
        } else {
            console.log("%cEcospend error: either set up an authorizationUrl prop that returns an object with an 'access_token' field, or setup clientId and clientSecret as props. Refer to the docs for more information.", "background-color: red; color: white; font-weight: bold; font-size: 16px; padding: 10px;")
            return false
        }
    }

    authorize = async () => {
        let headers = {
            'X-Request-ID' : this.generateRandomID(),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        if(this.authenticationUrl){
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        try {
            const authResult = await axios.post(this.authenticationUrl || this.token_url, this.authenticationUrl ? null : new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: this.client_id,
                client_secret: this.client_secret,
            }), {
                headers: headers
            })
            sessionStorage.setItem('ecospendToken', "Bearer " + authResult.data.access_token)
            return true
        } catch(error){
            console.log("Something went wrong while authorizing")
            console.log(error)
            return false
        }
    }

    getBanks = async (sandbox = false) => {
        try {
            const banksResult = await axios.get(`${this.api_url}banks?is_sandbox=${sandbox}`, {headers: {'Authorization':sessionStorage.getItem('ecospendToken')}})
            return banksResult.data.data.sort((a, b) => {
                if (a.name > b.name) return 1
                if (a.name < b.name) return -1
                return 0
            })
        } catch(error){
            console.log("Something went wrong while fetching banks")
            console.log(error.response)
            return []
        }
    }

    startPayment = async(paymentInfo, creditor_account, bankId, redirectUrl) => {
        if(!paymentInfo.amount || !paymentInfo.currency || !paymentInfo.reference || !bankId)
            return false

        paymentInfo.redirect_url = redirectUrl || window.location.origin + '/paymentResponse'

        try {
            const paymentResult = await axios.post(`${this.api_url}payments`, {
                bank_id: bankId,
                ...paymentInfo,
                creditor_account
            }, {
                headers: {
                    "content-type":"application/json",
                    "Authorization": sessionStorage.getItem('ecospendToken')
                }
            })
            return paymentResult.data
        } catch(error){
            console.log("Something went wrong while preparing your payment")
            console.log(error.response)
            return false
        }
    }

    verifyPayment = async(paymentId) => {
        try {
            const verifyResult = await axios.get(`${this.api_url}payments/${paymentId}`, {headers: {'Authorization':sessionStorage.getItem('ecospendToken')}})
            return verifyResult.data
        } catch(error){
            console.log("Something went wrong while fetching payment information")
            console.log(error.response)
            return false
        }
    }

    generateRandomID = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
}

export default EcospendService