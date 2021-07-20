import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import EcospendService from './service'
import style from './style'

export default function EcospendButton(props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [step, setStep] = useState(1)

    const [banks, setBanks] = useState([])
    const [bank, setBank] = useState(null)
    const [paymentInfo, setPaymentInfo] = useState({})

    const service = new EcospendService({...props})

    useEffect(() => {
        let listener
        if(paymentInfo?.id){
            listener = window.setInterval(async () => {
                const verifyPayment = await service.verifyPayment(paymentInfo.id)
                if(verifyPayment?.status === "Canceled" || verifyPayment?.status === "Failed" || verifyPayment?.status === "Rejected" || verifyPayment?.status === "Abandoned"){
                    setLoading(false)
                    setError("Transaction cancelled")
                    setStep(2)
                    setBank(null)
                    setPaymentInfo({})
                    props?.onFailure?.({
                        status: verifyPayment.status,
                        obj: verifyPayment
                    })
                }
                if(verifyPayment?.status === "Verified" || verifyPayment?.status === "Completed"){
                    setLoading(false)
                    setStep(4)
                    setBank(null)
                    setPaymentInfo({})
                    props?.onSuccess?.(paymentInfo)
                }
            }, 5000)
        }

        return () => clearInterval(listener)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentInfo?.id])

    const showBanks = async () => {
        setLoading(true)
        const authorized = await service.authorize()
        if(!authorized){
            setError('Authorization failed')
            setLoading(false)
            return
        }
        const banksData = await service.getBanks(props.sandboxMode)
        if(banksData.length === 0){
            setError('No banks were loaded')
            setLoading(false)
        }
        setLoading(false)
        setBanks(banksData)
        setStep(2)
        setError(null)
    }

    const chooseBank = bank => {
        setBank(bank)
        setStep(3)
        setError(null)
    }

    const backToBanks = () => {
        setBank(null)
        setStep(2)
        setError(null)
    }

    const verify = async () => {
        setLoading(true)
        const paymentInfo = await service.startPayment(props.payment, props.creditor_account, bank.bank_id, props.redirectUrl)
        if(!paymentInfo){
            setError('Payment failed')
            setLoading(false)
        } else {
            window.open(paymentInfo.payment_url)
            setPaymentInfo(paymentInfo)
        }
    }

    const cancel = () => {
        setError("")
        setLoading(false)
        setStep(2)
        setPaymentInfo({})
        props?.onFailure?.({
            status: 'Canceled',
            obj: null
        })
    }

    const showStep = () => {
        switch(step){
            case 1: return (
                <button onClick={showBanks}>{props.buttonText || 'Pay with bank transfer'}</button>
            )
            case 2: return (
                <style.ListContainer>
                    {banks.map(bank => {
                        if(!props.sandboxMode || (props.sandboxMode && bank.is_sandbox)){
                            return (
                                <button key={`bank-button-${bank.bank_id}`} onClick={() => chooseBank(bank)}>
                                    <img alt={`${bank.friendly_name} logo`} src={bank.logo} />
                                    <p>{bank.friendly_name}</p>
                                </button>
                            )
                        }
                        return null
                    })}
                </style.ListContainer>
            )
            case 3: {
                if(!bank){
                    setStep(2)
                }
                return <style.OverviewContainer>
                    <h2>Paying with: </h2>
                    <img alt={`${bank.friendly_name}`} src={bank.logo} />
                    <div>
                        <button onClick={backToBanks}>Choose another bank</button>
                        <button onClick={verify} className="success">Go to {bank.friendly_name}</button>
                    </div>
                </style.OverviewContainer>
            }
            case 4: {
                return (
                    <p>Purchase successful</p>
                )
            }
            default: return null
        }
    }
    
    return (
        <style.Container id="ecospend">
            {error && <style.Error className="error">{error}</style.Error>}
            {loading && <style.Loader />}
            {loading && paymentInfo?.id && <button onClick={cancel}>Cancel transaction</button>}
            {!loading && showStep()}
        </style.Container>
    )
    
}

EcospendButton.propTypes = {
    authenticationUrl: PropTypes.string,
    buttonText: PropTypes.string,
    clientId: PropTypes.string,
    clientSecret: PropTypes.string,
    creditor_account: PropTypes.shape({
        type: PropTypes.oneOf(['SortCode', 'Iban', 'Bban']).isRequired,
        identification: PropTypes.string.isRequired,
        owner_name: PropTypes.string.isRequired,
        bic: PropTypes.string,
        currency: PropTypes.string
    }).isRequired,
    onFailure: PropTypes.func,
    onSuccess: PropTypes.func,
    payment: PropTypes.shape({
        amount: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        currency: PropTypes.string.isRequired,
        reference: PropTypes.string.isRequired,
    }).isRequired,
    redirectUrl: PropTypes.string,
    sandboxMode: PropTypes.bool
}

export const EcospendResponseCatcher = () => {
    useEffect(() => {
        const queryString = window.location.search
        if(window.location.pathname.replace(/^\/([^/]*).*$/, '$1') === 'paymentResponse'){
            const urlParams = new URLSearchParams(queryString)
            const status = urlParams.get('status')
            const paymentId = urlParams.get('payment_id')

            if(status && paymentId){
                window.close()
            }
        }
    }, [])

    return null
}