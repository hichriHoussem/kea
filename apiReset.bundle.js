webpackJsonp([20],{601:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),n.d(t,"default",function(){return f});var c=n(6),u=n.n(c),s=n(243),i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l={usage:n(832)},f=function(e){function t(){return r(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return o(t,e),i(t,[{key:"render",value:function(){return u.a.createElement("div",{className:"api-scene"},u.a.createElement("h2",null,u.a.createElement("code",null,"resetKeaCache")),u.a.createElement("p",null,"Clear the cache for reducer paths, created actions and running sagas. Useful in tests."),u.a.createElement("h3",null,"Usage"),u.a.createElement(s.default,{className:"javascript"},l.usage))}}]),t}(c.Component)},832:function(e,t){e.exports="// logic.test.js\nimport { resetKeaCache } from 'kea'\n\nbeforeEach(() => {\n  resetKeaCache()\n})\n\ntest('starts from a clear state', () => {\n  // ...\n})\n"}});