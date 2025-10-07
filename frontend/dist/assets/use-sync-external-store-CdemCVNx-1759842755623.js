import{r as j}from"./react-DlxZUTCp-1759842755623.js";var E={exports:{}},R={};/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var l=j;function w(r,u){return r===u&&(r!==0||1/r===1/u)||r!==r&&u!==u}var y=typeof Object.is=="function"?Object.is:w,z=l.useSyncExternalStore,M=l.useRef,D=l.useEffect,O=l.useMemo,W=l.useDebugValue;R.useSyncExternalStoreWithSelector=function(r,u,n,m,a){var f=M(null);if(f.current===null){var o={hasValue:!1,value:null};f.current=o}else o=f.current;f=O(function(){function s(e){if(!d){if(d=!0,c=e,e=m(e),a!==void 0&&o.hasValue){var t=o.value;if(a(t,e))return v=t}return v=e}if(t=v,y(c,e))return t;var V=m(e);return a!==void 0&&a(t,V)?(c=e,t):(c=e,v=V)}var d=!1,c,v,b=n===void 0?null:n;return[function(){return s(u())},b===null?void 0:function(){return s(b())}]},[u,n,m,a]);var i=z(r,f[0],f[1]);return D(function(){o.hasValue=!0,o.value=i},[i]),W(i),i};E.exports=R;var I=E.exports;export{I as w};
