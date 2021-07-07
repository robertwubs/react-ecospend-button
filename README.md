
# React Ecospend Button

This package adds an Ecospend button to your payment gateway.

## Installation

Use the package manager of your choice to add it to your React project.

```bash
npm install react-ecospend-payment-button
yarn add react-ecospend-payment-button
```

## Usage

```javascript
import EcospendButton, { EcospendResponseCatcher } from 'react-ecospend-payment-button'

return (
  <EcospendButton
    authenticationUrl="https://myserver.com/authorizeEcospend"
    creditor_account={{
      type: 'SortCode',
      identification: '12345678910111',
      owner_name: 'John Doe'
    }}
    payment= {{
      amount: 3,
      currency: "GBP",
      description: "A cup of coffee",
      reference: "COFFEE_1234",
    }}
  />
  <EcospendResponseCatcher />
)
```

## Explanation of the EcospendResponseCatcher

Ecospend works with Redirect URLs in their popups. To make sure that the payment flow is as smooth as possible, the EcospendResponseCatcher will catch any user coming back to the return URL and automatically closes the window. The main button will handle the processing. The EcospendResponseCatcher should be placed in the Route that the return URL will point to. *Default*: at the root.

Using this is optional. You can set your own **redirectUrl** prop to and choose not to include this component at all.

## Configuration props

Key | Value | Comment
----| ------|--------
authenticationUrl | string | When set, a POST call will be made to this address to retrieve an access_token for Ecospend. Return format should be: *{access_token: '1234'}*. Using this method is highly recommended.
clientId | string | If you're not using an authenticationUrl, you have to set your Ecospend client id
clientSecret | string | If you're not using an authenticationUrl, you have to set your Ecospend client secret
buttonText | string | Change the text that will be displayed. *Default:* Pay with bank transfer
redirectUrl | string | If left empty, the redirect URL will be set to the domain root. The EcospendResponseCatcher can close it from here. Override here if necessary.
sandboxMode | bool | Whether the API calls and loaded banks should be in sandbox mode or not. Use for testing purposes only.

## Ecospend props

The underlying fields correlate with the fields set in the ecospend documentation [here](https://docs.ecospend.com/api/v2/#tag/Payments/paths/~1api~1v2.0~1payments/post)

Key | Value | Comment
----| ------|--------
creditor_account | object | Fields *type*, *identification* and *owner_name*  are required.
payment | object | Fields *amount*, *currency* and *reference* are required.

## Methods

Key | Value | Comment
----| ------|--------
onSuccess | function | Callback function for when a transaction is complete. Returns with attribute **paymentInfo**, which holds all information regarding the payment.
onFailure | function | Callback function for when a transaction fails. Returns with an object in the format: *{status: String, obj: paymentInfo}*.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Disclaimer
This package was created by a lone programmer making this type of component for the first time. Any feedback, improvements or comments are very much welcome.

## License
[MIT](https://choosealicense.com/licenses/mit/)