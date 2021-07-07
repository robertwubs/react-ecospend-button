import styled from 'styled-components'

const style = {
    Loader: styled.div`
        display: inline-block;
        width: 80px;
        height: 80px;

        &:after {
            content: " ";
            display: block;
            width: 32px;
            height: 32px;
            margin: 8px;
            border-radius: 50%;
            border: 6px solid #6492bb;
            border-color: #6492bb transparent #6492bb transparent;
            animation: lds-dual-ring 1.2s linear infinite;
        }
        
        @keyframes lds-dual-ring {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    `,
    Error: styled.p`
        margin: 30px 0;
        color: red;
        font-size: 16px;
        font-weight: bold;
    `,
    Container: styled.div`
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;

        * {
            box-sizing: border-box;
        }

        button {
            border: 0;
            box-shadow: none;
            padding: 10px 20px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s ease;
            background-color: #efefef;

            &:hover {
                background-color: #e4e4e4;
            }
        }
    `,
    ListContainer: styled.div`
        display: flex;
        flex-direction: column;
        width: 100%;

        button {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 15px;
            align-items: center;
        }
    `,
    OverviewContainer: styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        border: 1px solid #eee;
        border-radius: 10px;
        width: 100%;

        h2 {
            font-size: 18px;
        }

        img {
            width: 100%;
            max-width: 400px;
            margin: 15px 0;
        }

        div {
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            button {
                margin-bottom: 15px;

                &:first-of-type {

                }
                &:last-of-type {
                    background-color: #67a567;
                    color: white;
                    
                    &:hover {
                        background-color: #346334
                    }
                }
            }
        }
    `
}

export default style