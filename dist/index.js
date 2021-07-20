"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = EcospendButton;
exports.EcospendResponseCatcher = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.search.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/web.url.js");

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _service = _interopRequireDefault(require("./service"));

var _style = _interopRequireDefault(require("./style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function EcospendButton(props) {
  const [loading, setLoading] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(null);
  const [step, setStep] = (0, _react.useState)(1);
  const [banks, setBanks] = (0, _react.useState)([]);
  const [bank, setBank] = (0, _react.useState)(null);
  const [paymentInfo, setPaymentInfo] = (0, _react.useState)({});
  const service = new _service.default(_objectSpread({}, props));
  (0, _react.useEffect)(() => {
    let listener;

    if (paymentInfo !== null && paymentInfo !== void 0 && paymentInfo.id) {
      listener = window.setInterval(async () => {
        const verifyPayment = await service.verifyPayment(paymentInfo.id);

        if ((verifyPayment === null || verifyPayment === void 0 ? void 0 : verifyPayment.status) === "Canceled" || (verifyPayment === null || verifyPayment === void 0 ? void 0 : verifyPayment.status) === "Failed" || (verifyPayment === null || verifyPayment === void 0 ? void 0 : verifyPayment.status) === "Rejected" || (verifyPayment === null || verifyPayment === void 0 ? void 0 : verifyPayment.status) === "Abandoned") {
          var _props$onFailure;

          setLoading(false);
          setError("Transaction cancelled");
          setStep(2);
          setBank(null);
          setPaymentInfo({});
          props === null || props === void 0 ? void 0 : (_props$onFailure = props.onFailure) === null || _props$onFailure === void 0 ? void 0 : _props$onFailure.call(props, {
            status: verifyPayment.status,
            obj: verifyPayment
          });
        }

        if ((verifyPayment === null || verifyPayment === void 0 ? void 0 : verifyPayment.status) === "Verified" || (verifyPayment === null || verifyPayment === void 0 ? void 0 : verifyPayment.status) === "Completed") {
          var _props$onSuccess;

          setLoading(false);
          setStep(4);
          setBank(null);
          setPaymentInfo({});
          props === null || props === void 0 ? void 0 : (_props$onSuccess = props.onSuccess) === null || _props$onSuccess === void 0 ? void 0 : _props$onSuccess.call(props, paymentInfo);
        }
      }, 5000);
    }

    return () => clearInterval(listener); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentInfo === null || paymentInfo === void 0 ? void 0 : paymentInfo.id]);

  const showBanks = async () => {
    setLoading(true);
    const authorized = await service.authorize();

    if (!authorized) {
      setError('Authorization failed');
      setLoading(false);
      return;
    }

    const banksData = await service.getBanks(props.sandboxMode);

    if (banksData.length === 0) {
      setError('No banks were loaded');
      setLoading(false);
    }

    setLoading(false);
    setBanks(banksData);
    setStep(2);
    setError(null);
  };

  const chooseBank = bank => {
    setBank(bank);
    setStep(3);
    setError(null);
  };

  const backToBanks = () => {
    setBank(null);
    setStep(2);
    setError(null);
  };

  const verify = async () => {
    setLoading(true);
    const paymentInfo = await service.startPayment(props.payment, props.creditor_account, bank.bank_id, props.redirectUrl);

    if (!paymentInfo) {
      setError('Payment failed');
      setLoading(false);
    } else {
      window.open(paymentInfo.payment_url);
      setPaymentInfo(paymentInfo);
    }
  };

  const cancel = () => {
    var _props$onFailure2;

    setError("");
    setLoading(false);
    setStep(2);
    setPaymentInfo({});
    props === null || props === void 0 ? void 0 : (_props$onFailure2 = props.onFailure) === null || _props$onFailure2 === void 0 ? void 0 : _props$onFailure2.call(props, {
      status: 'Canceled',
      obj: null
    });
  };

  const showStep = () => {
    switch (step) {
      case 1:
        return /*#__PURE__*/_react.default.createElement("button", {
          onClick: showBanks
        }, props.buttonText || 'Pay with bank transfer');

      case 2:
        return /*#__PURE__*/_react.default.createElement(_style.default.ListContainer, null, banks.map(bank => {
          if (!props.sandboxMode || props.sandboxMode && bank.is_sandbox) {
            return /*#__PURE__*/_react.default.createElement("button", {
              key: "bank-button-".concat(bank.bank_id),
              onClick: () => chooseBank(bank)
            }, /*#__PURE__*/_react.default.createElement("img", {
              alt: "".concat(bank.friendly_name, " logo"),
              src: bank.logo
            }), /*#__PURE__*/_react.default.createElement("p", null, bank.friendly_name));
          }

          return null;
        }));

      case 3:
        {
          if (!bank) {
            setStep(2);
          }

          return /*#__PURE__*/_react.default.createElement(_style.default.OverviewContainer, null, /*#__PURE__*/_react.default.createElement("h2", null, "Paying with: "), /*#__PURE__*/_react.default.createElement("img", {
            alt: "".concat(bank.friendly_name),
            src: bank.logo
          }), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("button", {
            onClick: backToBanks
          }, "Choose another bank"), /*#__PURE__*/_react.default.createElement("button", {
            onClick: verify,
            className: "success"
          }, "Go to ", bank.friendly_name)));
        }

      case 4:
        {
          return /*#__PURE__*/_react.default.createElement("p", null, "Purchase successful");
        }

      default:
        return null;
    }
  };

  return /*#__PURE__*/_react.default.createElement(_style.default.Container, {
    id: "ecospend"
  }, error && /*#__PURE__*/_react.default.createElement(_style.default.Error, {
    className: "error"
  }, error), loading && /*#__PURE__*/_react.default.createElement(_style.default.Loader, null), loading && (paymentInfo === null || paymentInfo === void 0 ? void 0 : paymentInfo.id) && /*#__PURE__*/_react.default.createElement("button", {
    onClick: cancel
  }, "Cancel transaction"), !loading && showStep());
}

EcospendButton.propTypes = {
  authenticationUrl: _propTypes.default.string,
  buttonText: _propTypes.default.string,
  clientId: _propTypes.default.string,
  clientSecret: _propTypes.default.string,
  creditor_account: _propTypes.default.shape({
    type: _propTypes.default.oneOf(['SortCode', 'Iban', 'Bban']).isRequired,
    identification: _propTypes.default.string.isRequired,
    owner_name: _propTypes.default.string.isRequired,
    bic: _propTypes.default.string,
    currency: _propTypes.default.string
  }).isRequired,
  onFailure: _propTypes.default.func,
  onSuccess: _propTypes.default.func,
  payment: _propTypes.default.shape({
    amount: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
    currency: _propTypes.default.string.isRequired,
    reference: _propTypes.default.string.isRequired
  }).isRequired,
  redirectUrl: _propTypes.default.string,
  sandboxMode: _propTypes.default.bool
};

const EcospendResponseCatcher = () => {
  (0, _react.useEffect)(() => {
    const queryString = window.location.search;

    if (window.location.pathname.replace(/^\/([^/]*).*$/, '$1') === 'paymentResponse') {
      const urlParams = new URLSearchParams(queryString);
      const status = urlParams.get('status');
      const paymentId = urlParams.get('payment_id');

      if (status && paymentId) {
        window.close();
      }
    }
  }, []);
  return null;
};

exports.EcospendResponseCatcher = EcospendResponseCatcher;