"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/web.url.js");

require("core-js/modules/es.array.sort.js");

require("core-js/modules/es.regexp.to-string.js");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class EcospendService {
  constructor(_ref) {
    var _this = this;

    let {
      clientId,
      clientSecret,
      authenticationUrl,
      sandbox: _sandbox
    } = _ref;

    _defineProperty(this, "authorize", async () => {
      let headers = {
        'X-Request-ID': this.generateRandomID(),
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      if (this.authenticationUrl) {
        headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
      }

      try {
        const authResult = await _axios.default.post(this.authenticationUrl || this.token_url, this.authenticationUrl ? null : new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.client_id,
          client_secret: this.client_secret
        }), {
          headers: headers
        });
        _axios.default.defaults.headers.common["Authorization"] = "Bearer " + authResult.data.access_token;
        return true;
      } catch (error) {
        console.log("Something went wrong while authorizing");
        console.log(error);
        return false;
      }
    });

    _defineProperty(this, "getBanks", async function () {
      let sandbox = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      try {
        const banksResult = await _axios.default.get("".concat(_this.api_url, "banks?is_sandbox=").concat(sandbox));
        return banksResult.data.data.sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
      } catch (error) {
        console.log("Something went wrong while fetching banks");
        console.log(error.response);
        return [];
      }
    });

    _defineProperty(this, "startPayment", async (paymentInfo, creditor_account, bankId, redirectUrl) => {
      if (!paymentInfo.amount || !paymentInfo.currency || !paymentInfo.reference || !bankId) return false;
      paymentInfo.redirect_url = redirectUrl || window.location.origin + '/paymentResponse';

      try {
        const paymentResult = await _axios.default.post("".concat(this.api_url, "payments"), _objectSpread(_objectSpread({
          bank_id: bankId
        }, paymentInfo), {}, {
          creditor_account
        }), {
          headers: {
            "content-type": "application/json"
          }
        });
        return paymentResult.data;
      } catch (error) {
        console.log("Something went wrong while preparing your payment");
        console.log(error.response);
        return false;
      }
    });

    _defineProperty(this, "verifyPayment", async paymentId => {
      try {
        const verifyResult = await _axios.default.get("".concat(this.api_url, "payments/").concat(paymentId));
        return verifyResult.data;
      } catch (error) {
        console.log("Something went wrong while fetching payment information");
        console.log(error.response);
        return false;
      }
    });

    _defineProperty(this, "generateRandomID", () => {
      let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      };

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    });

    if (clientId && clientSecret || authenticationUrl) {
      this.client_id = clientId;
      this.client_secret = clientSecret;
      this.authenticationUrl = authenticationUrl;
      this.token_url = 'https://iamapi-px01.ecospend.com/connect/token';
      this.api_url = _sandbox ? 'https://pis-api-sandbox.ecospend.com/api/v2.0/' : 'https://pis-api-sandbox.ecospend.com/api/v2.0/';
    } else {
      console.log("%cEcospend error: either set up an authorizationUrl prop that returns an object with an 'access_token' field, or setup clientId and clientSecret as props. Refer to the docs for more information.", "background-color: red; color: white; font-weight: bold; font-size: 16px; padding: 10px;");
      return false;
    }
  }

}

var _default = EcospendService;
exports.default = _default;