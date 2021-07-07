import './App.css'
import EcospendButton, { EcospendResponseCatcher } from './lib'

function App() {
  return (
    <div style={{padding: 15}} className="App">
      <h1>Ecospend test</h1>

      <p style={{paddingBottom: 15}}>Total price: <strong>&pound;10,20</strong></p>

      <EcospendButton
        authenticationUrl="https://localhost:8080/authenticate"
        creditor_account={{
          type: 'SortCode',
          identification: '50000012345602',
          owner_name: 'Alice Test'
        }}
        payment= {{
          amount: 10.2,
          currency: "GBP",
          description: "Test description",
          reference: "TEST_PAYMENT",
        }}
        sandboxMode
    />
      <EcospendResponseCatcher />
    </div>
  )
}

export default App