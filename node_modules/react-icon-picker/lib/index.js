"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var styled_components_1 = require("styled-components");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var IconListWrap = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: fixed;\n  top: 10px;\n  left: 0;\n  max-width: 240px;\n  z-index: 9999;\n  &:before,\n  &:after {\n    bottom: calc(100% - 1px);\n    left: 20px;\n    border: solid transparent;\n    content: \" \";\n    height: 0;\n    width: 0;\n    position: absolute;\n    pointer-events: none;\n  }\n  &:after {\n    border-color: rgba(255, 255, 255, 0);\n    border-bottom-color: #fff;\n    border-width: 10px;\n    margin-left: -10px;\n  }\n  &:before {\n    border-color: rgba(204, 204, 204, 0);\n    border-bottom-color: #ccc;\n    border-width: 11px;\n    margin-left: -11px;\n  }\n"], ["\n  position: fixed;\n  top: 10px;\n  left: 0;\n  max-width: 240px;\n  z-index: 9999;\n  &:before,\n  &:after {\n    bottom: calc(100% - 1px);\n    left: 20px;\n    border: solid transparent;\n    content: \" \";\n    height: 0;\n    width: 0;\n    position: absolute;\n    pointer-events: none;\n  }\n  &:after {\n    border-color: rgba(255, 255, 255, 0);\n    border-bottom-color: #fff;\n    border-width: 10px;\n    margin-left: -10px;\n  }\n  &:before {\n    border-color: rgba(204, 204, 204, 0);\n    border-bottom-color: #ccc;\n    border-width: 11px;\n    margin-left: -11px;\n  }\n"])));
var IconListInner = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  border: 1px solid #CCC;\n  overflow-y: scroll;\n  max-height: 200px;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n"], ["\n  border: 1px solid #CCC;\n  overflow-y: scroll;\n  max-height: 200px;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n"])));
var IconList = styled_components_1.default.ul(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  list-style: none;\n  margin: 0;\n  padding: 10px;\n  background: #FFF;\n  white-space: normal;\n  li {\n    margin: 0;\n    display: inline-block;\n  }\n"], ["\n  list-style: none;\n  margin: 0;\n  padding: 10px;\n  background: #FFF;\n  white-space: normal;\n  li {\n    margin: 0;\n    display: inline-block;\n  }\n"])));
var IconItem = styled_components_1.default.li(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 8px;\n  color: #333;\n  font-size: 18px;\n  border: 1px solid #FFF;\n  border-radius: 4px;\n  transition: background-color linear .15s;\n  cursor: pointer;\n  &:hover {\n    text-decoration: none;\n    background: #BAE2F3;\n  }\n"], ["\n  padding: 8px;\n  color: #333;\n  font-size: 18px;\n  border: 1px solid #FFF;\n  border-radius: 4px;\n  transition: background-color linear .15s;\n  cursor: pointer;\n  &:hover {\n    text-decoration: none;\n    background: #BAE2F3;\n  }\n"])));
var BtnGroup = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  border-collapse: separate;\n  display: inline-table;\n  padding: 7px 10px;\n  padding-left: 0;\n"], ["\n  border-collapse: separate;\n  display: inline-table;\n  padding: 7px 10px;\n  padding-left: 0;\n"])));
var Btn = styled_components_1.default.button(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  background-color: #FFF;\n  text-decoration: none;\n  text-align: center;\n  font-size: 14px;\n  line-height: 1;\n  vertical-align: middle;\n  border-left: none;\n  border: 1px solid #999;\n  font-size: 12px;\n  padding: 3px 5px;\n  border-radius: 3px;\n  display: table-cell;\n  height: 28px;\n  margin: 0;\n  cursor: pointer;\n  &:first-child {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n    border-right: none;\n  }\n  &:last-child {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n  }\n"], ["\n  background-color: #FFF;\n  text-decoration: none;\n  text-align: center;\n  font-size: 14px;\n  line-height: 1;\n  vertical-align: middle;\n  border-left: none;\n  border: 1px solid #999;\n  font-size: 12px;\n  padding: 3px 5px;\n  border-radius: 3px;\n  display: table-cell;\n  height: 28px;\n  margin: 0;\n  cursor: pointer;\n  &:first-child {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n    border-right: none;\n  }\n  &:last-child {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n  }\n"])));
exports.default = (function (props) {
    var button;
    var listener;
    var icons = props.icons || [];
    var _a = React.useState({
        icon: props.defaultValue ? props.defaultValue : '',
        isOpen: false,
        top: 0,
        left: 0
    }), state = _a[0], setState = _a[1];
    var icon = state.icon, isOpen = state.isOpen, top = state.top, left = state.left;
    React.useEffect(function () {
        listener = function (e) {
            if (e.target !== button && (!button.children || e.target !== button.children[0])) {
                setState(__assign({}, state, { isOpen: false }));
            }
        };
        document.addEventListener('click', listener);
        return function () {
            document.removeEventListener('click', listener);
        };
    });
    var selectIcon = function (icon) {
        setState(__assign({}, state, { icon: icon }));
        props.onChange(icon);
    };
    var openIconList = function () {
        var clientRect = button.getBoundingClientRect();
        setState(__assign({}, state, { isOpen: !isOpen, top: clientRect.top, left: clientRect.left }));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(BtnGroup, { style: { padding: '0' } },
            React.createElement(Btn, { type: "button", style: { width: '50px' } },
                React.createElement("span", { className: icon })),
            React.createElement(Btn, { type: "button", onClick: openIconList, ref: function (btn) {
                    button = btn;
                } },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faArrowDown }))),
        React.createElement("div", { style: { position: 'relative' } }, isOpen && React.createElement(IconListWrap, { style: { top: top + 45 + "px", left: left + "px" } },
            React.createElement(IconListInner, null,
                React.createElement(IconList, null, icons.map(function (icon, index) {
                    return (React.createElement(IconItem, { key: index, onClick: function () {
                            selectIcon(icon);
                        } },
                        React.createElement("span", { className: icon })));
                })))))));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=index.js.map