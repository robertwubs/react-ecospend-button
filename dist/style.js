"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

const style = {
  Loader: _styledComponents.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n        display: inline-block;\n        width: 80px;\n        height: 80px;\n\n        &:after {\n            content: \" \";\n            display: block;\n            width: 32px;\n            height: 32px;\n            margin: 8px;\n            border-radius: 50%;\n            border: 6px solid #6492bb;\n            border-color: #6492bb transparent #6492bb transparent;\n            animation: lds-dual-ring 1.2s linear infinite;\n        }\n        \n        @keyframes lds-dual-ring {\n            0% {\n                transform: rotate(0deg);\n            }\n            100% {\n                transform: rotate(360deg);\n            }\n        }\n    "]))),
  Error: _styledComponents.default.p(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n        margin: 30px 0;\n        color: red;\n        font-size: 16px;\n        font-weight: bold;\n    "]))),
  Container: _styledComponents.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n        width: 100%;\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n        box-sizing: border-box;\n\n        * {\n            box-sizing: border-box;\n        }\n\n        button {\n            border: 0;\n            box-shadow: none;\n            padding: 10px 20px;\n            border-radius: 3px;\n            cursor: pointer;\n            font-size: 14px;\n            font-weight: bold;\n            transition: all 0.2s ease;\n            background-color: #efefef;\n\n            &:hover {\n                background-color: #e4e4e4;\n            }\n        }\n    "]))),
  ListContainer: _styledComponents.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n        display: flex;\n        flex-direction: column;\n        width: 100%;\n\n        button {\n            display: flex;\n            flex-direction: row;\n            justify-content: space-between;\n            margin-bottom: 15px;\n            align-items: center;\n        }\n    "]))),
  OverviewContainer: _styledComponents.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        padding: 15px;\n        border: 1px solid #eee;\n        border-radius: 10px;\n        width: 100%;\n\n        h2 {\n            font-size: 18px;\n        }\n\n        img {\n            width: 100%;\n            max-width: 400px;\n            margin: 15px 0;\n        }\n\n        div {\n            display: flex;\n            flex-direction: column;\n            justify-content: space-between;\n\n            button {\n                margin-bottom: 15px;\n\n                &:first-of-type {\n\n                }\n                &:last-of-type {\n                    background-color: #67a567;\n                    color: white;\n                    \n                    &:hover {\n                        background-color: #346334\n                    }\n                }\n            }\n        }\n    "])))
};
var _default = style;
exports.default = _default;