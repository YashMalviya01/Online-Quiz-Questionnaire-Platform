/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var _i=function(r,t){return(_i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var o in n)n.hasOwnProperty(o)&&(e[o]=n[o])})(r,t)};function $e(r,t){function e(){this.constructor=r}_i(r,t),r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}function j(r,t,e,n){return new(e||(e=Promise))(function(o,a){function i(l){try{u(n.next(l))}catch(c){a(c)}}function s(l){try{u(n.throw(l))}catch(c){a(c)}}function u(l){l.done?o(l.value):new e(function(c){c(l.value)}).then(i,s)}u((n=n.apply(r,[])).next())})}function X(r,t){var e,n,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function s(u){return function(l){return function(c){if(e)throw new TypeError("Generator is already executing.");for(;i;)try{if(e=1,n&&(o=2&c[0]?n.return:c[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,c[1])).done)return o;switch(n=0,o&&(c=[2&c[0],o.value]),c[0]){case 0:case 1:o=c;break;case 4:return i.label++,{value:c[1],done:!1};case 5:i.label++,n=c[1],c=[0];continue;case 7:c=i.ops.pop(),i.trys.pop();continue;default:if(!(o=(o=i.trys).length>0&&o[o.length-1])&&(c[0]===6||c[0]===2)){i=0;continue}if(c[0]===3&&(!o||c[1]>o[0]&&c[1]<o[3])){i.label=c[1];break}if(c[0]===6&&i.label<o[1]){i.label=o[1],o=c;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(c);break}o[2]&&i.ops.pop(),i.trys.pop();continue}c=t.call(r,i)}catch(f){c=[6,f],n=0}finally{e=o=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([u,l])}}}var Oi=function(){function r(t){this.global=t,this.flags={},this.flagRegistry={},this.urlFlags={},this.populateURLFlags()}return r.prototype.setPlatform=function(t,e){this.platform!=null&&console.warn("Platform "+this.platformName+" has already been set. Overwriting the platform with "+e+"."),this.platformName=t,this.platform=e},r.prototype.registerFlag=function(t,e,n){if(this.flagRegistry[t]={evaluationFn:e,setHook:n},this.urlFlags[t]!=null){var o=this.urlFlags[t];console.warn("Setting feature override from URL "+t+": "+o+"."),this.set(t,o)}},r.prototype.get=function(t){return t in this.flags?this.flags[t]:(this.flags[t]=this.evaluateFlag(t),this.flags[t])},r.prototype.getNumber=function(t){return this.get(t)},r.prototype.getBool=function(t){return this.get(t)},r.prototype.getFlags=function(){return this.flags},Object.defineProperty(r.prototype,"features",{get:function(){return this.flags},enumerable:!0,configurable:!0}),r.prototype.set=function(t,e){if(this.flagRegistry[t]==null)throw new Error("Cannot set flag "+t+" as it has not been registered.");this.flags[t]=e,this.flagRegistry[t].setHook!=null&&this.flagRegistry[t].setHook(e)},r.prototype.evaluateFlag=function(t){if(this.flagRegistry[t]==null)throw new Error("Cannot evaluate flag '"+t+"': no evaluation function found.");return this.flagRegistry[t].evaluationFn()},r.prototype.setFlags=function(t){this.flags=Object.assign({},t)},r.prototype.reset=function(){this.flags={},this.urlFlags={},this.populateURLFlags()},r.prototype.populateURLFlags=function(){var t=this;if(this.global!==void 0&&this.global.location!==void 0&&this.global.location.search!==void 0){var e,n,o=(e=this.global.location.search,n={},e.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,function(a){for(var i=[],s=1;s<arguments.length;s++)i[s-1]=arguments[s];return xf(n,i[0],i[1]),i.join("=")}),n);"tfjsflags"in o&&o.tfjsflags.split(",").forEach(function(a){var i=a.split(":"),s=i[0],u=i[1];t.urlFlags[s]=function(l,c){if((c=c.toLowerCase())==="true"||c==="false")return c==="true";if(""+ +c===c)return+c;throw new Error("Could not parse value flag value "+c+" for flag "+l+".")}(s,u)})}},r}();function xf(r,t,e){r[decodeURIComponent(t)]=decodeURIComponent(e||"")}function M(){return Mo}var Mo=null,ct=new Map,At=new Map;function Bo(r,t){var e=Lo(r,t);return ct.get(e)}function Mi(r){return At.get(r)}function po(r){for(var t=ct.entries(),e=[];;){var n=t.next(),o=n.done,a=n.value;if(o)break;var i=a[0],s=a[1];i.split("_")[0]===r&&e.push(s)}return e}function Po(r){var t=r.kernelName,e=r.backendName,n=Lo(t,e);if(ct.has(n))throw new Error("The kernel '"+t+"' for backend '"+e+"' is already registered");ct.set(n,r)}function Bi(r){var t=r.kernelName;At.has(t)&&console.warn("Overriding the gradient for '"+t+"'"),At.set(t,r)}function bf(r,t){var e=Lo(r,t);if(!ct.has(e))throw new Error("The kernel '"+r+"' for backend '"+t+"' is not registered");ct.delete(e)}function wf(r){if(!At.has(r))throw new Error("The gradient '"+r+"' for backend is not registered");At.delete(r)}function Lo(r,t){return t+"_"+r}function Ya(r){for(var t=r.length,e=0,n=0;t>0;)n=Math.random()*t|0,e=r[--t],r[t]=r[n],r[n]=e}function lr(r,t,e){return Math.max(r,Math.min(t,e))}function Wo(r){return r%2==0?r:r+1}function Pi(r){for(var t=0,e=0;e<r.length;e++)t+=r[e];return t}function E(r,t){if(!r)throw new Error(typeof t=="string"?t:t())}function fe(r,t,e){e===void 0&&(e=""),E(Re(r,t),function(){return e+" Shapes "+r+" and "+t+" must match"})}function Kn(r){E(r!=null,function(){return"The input to the tensor constructor must be a non-null value."})}function vn(r,t,e){if(t===void 0&&(t=[]),e===void 0&&(e=!1),t==null&&(t=[]),Array.isArray(r)||Fe(r)&&!e)for(var n=0;n<r.length;++n)vn(r[n],t,e);else t.push(r);return t}function Y(r){if(r.length===0)return 1;for(var t=r[0],e=1;e<r.length;e++)t*=r[e];return t}function Re(r,t){if(r===t)return!0;if(r==null||t==null||r.length!==t.length)return!1;for(var e=0;e<r.length;e++)if(r[e]!==t[e])return!1;return!0}function we(r){return r%1==0}function Li(r){if(Math.tanh!=null)return Math.tanh(r);if(r===1/0)return 1;if(r===-1/0)return-1;var t=Math.exp(2*r);return(t-1)/(t+1)}function cr(r){var t=Math.ceil(Math.sqrt(r));return[t,Math.ceil(r/t)]}function Un(r,t){return t<=r.length?r:r+" ".repeat(t-r.length)}function vo(r,t,e){return t===void 0&&(t=function(n){return 0}),new Promise(function(n,o){var a=0,i=function(){if(r())n();else{a++;var s=t(a);e!=null&&a>=e?o():setTimeout(i,s)}};i()})}function Wi(r,t){for(var e=1,n=-1,o=0;o<r.length;++o)if(r[o]>=0)e*=r[o];else if(r[o]===-1){if(n!==-1)throw Error("Shapes can only have 1 implicit size. Found -1 at dim "+n+" and dim "+o);n=o}else if(r[o]<0)throw Error("Shapes can not be < 0. Found "+r[o]+" at dim "+o);if(n===-1){if(t>0&&t!==e)throw Error("Size("+t+") must match the product of shape "+r);return r}if(e===0)throw Error("Cannot infer the missing size in ["+r+"] when there are 0 elements");if(t%e!=0)throw Error("The implicit shape can't be a fractional number. Got "+t+" / "+e);var a=r.slice();return a[n]=t/e,a}function ke(r,t){var e=t.length;return E((r=r==null?t.map(function(n,o){return o}):[].concat(r)).every(function(n){return n>=-e&&n<e}),function(){return"All values in axis param must be in range [-"+e+", "+e+") but got axis "+r}),E(r.every(function(n){return we(n)}),function(){return"All values in axis param must be integers but got axis "+r}),r.map(function(n){return n<0?e+n:n})}function wn(r,t){for(var e=[],n=[],o=t!=null&&Array.isArray(t)&&t.length===0,a=t==null||o?null:ke(t,r).sort(),i=0,s=0;s<r.length;++s){if(a!=null){if(a[i]===s&&r[s]!==1)throw new Error("Can't squeeze axis "+s+" since its dim '"+r[s]+"' is not 1");(a[i]==null||a[i]>s)&&r[s]===1&&(e.push(r[s]),n.push(s)),a[i]<=s&&i++}r[s]!==1&&(e.push(r[s]),n.push(s))}return{newShape:e,keptDims:n}}function ft(r,t){var e=null;if(r==null||r==="float32")e=new Float32Array(t);else if(r==="int32")e=new Int32Array(t);else{if(r!=="bool")throw new Error("Unknown data type "+r);e=new Uint8Array(t)}return e}function Dt(r,t){var e=null;if(r==null||r==="float32")e=new Float32Array(t);else if(r==="int32")e=new Int32Array(t);else if(r==="bool")e=new Uint8Array(t);else{if(r!=="string")throw new Error("Unknown data type "+r);e=new Array(t)}return e}function Ui(r,t){for(var e=0;e<r.length;e++){var n=r[e];if(isNaN(n)||!isFinite(n))throw Error("A tensor of type "+t+" being uploaded contains "+n+".")}}function zi(r){return r==="bool"||r==="complex64"||r==="float32"||r==="int32"||r==="string"}function Vi(r,t){return t!=="complex64"&&(t!=="float32"||r==="complex64")&&(t!=="int32"||r==="float32"||r==="complex64")&&(t!=="bool"||r!=="bool")}function Fe(r){return r instanceof Float32Array||r instanceof Int32Array||r instanceof Uint8Array}function Uo(r){if(r==="float32"||r==="int32")return 4;if(r==="complex64")return 8;if(r==="bool")return 1;throw new Error("Unknown dtype "+r)}function Gi(r){if(r==null)return 0;var t=0;return r.forEach(function(e){return t+=e.length}),t}function Cn(r){return typeof r=="string"||r instanceof String}function Hi(r){return typeof r=="boolean"}function qi(r){return typeof r=="number"}function pt(r){return Array.isArray(r)?pt(r[0]):r instanceof Float32Array?"float32":r instanceof Int32Array||r instanceof Uint8Array?"int32":qi(r)?"float32":Cn(r)?"string":Hi(r)?"bool":"float32"}function In(r){return!!(r&&r.constructor&&r.call&&r.apply)}function fr(r,t){for(var e=t;e<r;++e)if(r%e==0)return e;return r}function Xe(r){var t=r.length;if(t<2)return[];var e=new Array(t-1);e[t-2]=r[t-1];for(var n=t-3;n>=0;--n)e[n]=e[n+1]*r[n+1];return e}function zo(r,t,e){if(t==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(r)&&(r=vn(r)),e&&Ui(r,t),function(a,i){return a instanceof Float32Array&&i==="float32"||a instanceof Int32Array&&i==="int32"||a instanceof Uint8Array&&i==="bool"}(r,t))return r;if(t==null||t==="float32"||t==="complex64")return new Float32Array(r);if(t==="int32")return new Int32Array(r);if(t==="bool"){for(var n=new Uint8Array(r.length),o=0;o<n.length;++o)Math.round(r[o])!==0&&(n[o]=1);return n}throw new Error("Unknown data type "+t)}function mo(r,t){if(r.length===0)return t[0];var e=r.reduce(function(n,o){return n*o});if(e===0)return[];if(e!==t.length)throw new Error("["+r+"] does not match the input size.");return function n(o,a,i){var s=new Array;if(a.length===1)for(var u=a[0],l=0;l<u;l++)s[l]=i[o+l];else{u=a[0];var c=a.slice(1),f=c.reduce(function(h,d){return h*d});for(l=0;l<u;l++)s[l]=n(o+l*f,c,i)}return s}(0,r,t)}function Vo(r,t){for(var e=vt(r,t),n=0;n<e.length;n++)e[n]=1;return e}function vt(r,t){if(t==null||t==="float32"||t==="complex64")return new Float32Array(r);if(t==="int32")return new Int32Array(r);if(t==="bool")return new Uint8Array(r);throw new Error("Unknown data type "+t)}function Ke(){return M().platform.now()}function Go(r){r.forEach(function(t){E(Number.isInteger(t)&&t>=0,function(){return"Tensor must have a shape comprised of positive integers but got shape ["+r+"]."})})}function Ki(r,t){return t===void 0&&(t="utf-8"),t=t||"utf-8",M().platform.encode(r,t)}function Tt(r,t){return t===void 0&&(t="utf-8"),t=t||"utf-8",M().platform.decode(r,t)}function go(r,t,e){if(t===0)return 0;if(t===1)return r[0];for(var n=r[r.length-1],o=0;o<r.length-1;++o)n+=e[o]*r[o];return n}function ji(r,t,e){if(t===0)return[];if(t===1)return[r];for(var n=new Array(t),o=0;o<n.length-1;++o)n[o]=Math.floor(r/e[o]),r-=n[o]*e[o];return n[n.length-1]=r,n}var Cf=Object.freeze({shuffle:Ya,clamp:lr,nearestLargerEven:Wo,sum:Pi,randUniform:function(r,t){var e=Math.random();return t*e+(1-e)*r},distSquared:function(r,t){for(var e=0,n=0;n<r.length;n++){var o=Number(r[n])-Number(t[n]);e+=o*o}return e},assert:E,assertShapesMatch:fe,assertNonNull:Kn,flatten:vn,sizeFromShape:Y,isScalarShape:function(r){return r.length===0},arraysEqual:Re,isInt:we,tanh:Li,sizeToSquarishShape:cr,createShuffledIndices:function(r){for(var t=new Uint32Array(r),e=0;e<r;++e)t[e]=e;return Ya(t),t},rightPad:Un,repeatedTry:vo,inferFromImplicitShape:Wi,parseAxisParam:ke,squeezeShape:wn,getTypedArrayFromDType:ft,getArrayFromDType:Dt,checkConversionForErrors:Ui,isValidDtype:zi,hasEncodingLoss:Vi,isTypedArray:Fe,bytesPerElement:Uo,bytesFromStringArray:Gi,isString:Cn,isBoolean:Hi,isNumber:qi,inferDtype:pt,isFunction:In,nearestDivisor:fr,computeStrides:Xe,toTypedArray:zo,toNestedArray:mo,makeOnesTypedArray:Vo,makeZerosTypedArray:vt,now:Ke,assertNonNegativeIntegerDimensions:Go,fetch:function(r,t){return M().platform.fetch(r,t)},encodeString:Ki,decodeString:Tt,locToIndex:go,indexToLoc:ji}),Ef=function(){function r(t,e){this.backendTimer=t,this.logger=e,e==null&&(this.logger=new Rf)}return r.prototype.profileKernel=function(t,e,n){var o,a=this,i=this.backendTimer.time(function(){o=n()});return o.forEach(function(s){s.data().then(function(u){(function(l,c,f){if(c!=="float32")return!1;for(var h=0;h<l.length;h++){var d=l[h];if(isNaN(d)||!isFinite(d))return console.warn("Found "+d+" in the result of '"+f+"'"),!0}})(u,s.dtype,t),i.then(function(l){var c="";l.getExtraProfileInfo!=null&&(c=l.getExtraProfileInfo()),a.logger.logKernelProfile(t,s,u,l.kernelMs,e,c)})})}),o},r}(),Rf=function(){function r(){}return r.prototype.logKernelProfile=function(t,e,n,o,a,i){var s=typeof o=="number"?Un(o+"ms",9):o.error,u=Un(t,25),l=e.rank,c=e.size,f=Un(e.shape.toString(),14),h="";for(var d in a){var p=a[d].shape||e.shape,m=p.length;h+=d+": "+m+"D "+(m>0?p:"")+" "}console.log("%c"+u+"	%c"+s+"	%c"+l+"D "+f+"	%c"+c+"	%c"+h+"	%c"+i,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")},r}(),$a=20,xt=3,jr=7;function If(r,t,e,n){var o=Xe(t),a=function(l,c,f,h){var d=Y(c),p=h[h.length-1],m=new Array(p).fill(0),v=c.length,g=f==="complex64"?wt(l):l;if(v>1)for(var y=0;y<d/p;y++)for(var x=y*p,b=0;b<p;b++)m[b]=Math.max(m[b],bt(g[x+b],0,f).length);return m}(r,t,e,o),i=t.length,s=function l(c,f,h,d,p,m){m===void 0&&(m=!0);var v=h==="complex64"?2:1,g=f[0],y=f.length;if(y===0)return h==="complex64"?[bt(wt(c)[0],0,h)]:h==="bool"?[Xi(c[0])]:[c[0].toString()];if(y===1){if(g>$a){var x=xt*v,b=Array.from(c.slice(0,x)),w=Array.from(c.slice((g-xt)*v,g*v));return h==="complex64"&&(b=wt(b),w=wt(w)),["["+b.map(function(B,V){return bt(B,p[V],h)}).join(", ")+", ..., "+w.map(function(B,V){return bt(B,p[g-xt+V],h)}).join(", ")+"]"]}return["["+(h==="complex64"?wt(c):Array.from(c)).map(function(B,V){return bt(B,p[V],h)}).join(", ")+"]"]}var R=f.slice(1),A=d.slice(1),k=d[0]*v,I=[];if(g>$a){for(var S=0;S<xt;S++){var F=(N=S*k)+k;I.push.apply(I,l(c.slice(N,F),R,h,A,p,!1))}for(I.push("..."),S=g-xt;S<g;S++)F=(N=S*k)+k,I.push.apply(I,l(c.slice(N,F),R,h,A,p,S===g-1))}else for(S=0;S<g;S++){var N;F=(N=S*k)+k,I.push.apply(I,l(c.slice(N,F),R,h,A,p,S===g-1))}var W=y===2?",":"";for(I[0]="["+I[0]+W,S=1;S<I.length-1;S++)I[S]=" "+I[S]+W;var L=`,
`;for(S=2;S<y;S++)L+=`
`;return I[I.length-1]=" "+I[I.length-1]+"]"+(m?"":L),I}(r,t,e,o,a),u=["Tensor"];return n&&(u.push("  dtype: "+e),u.push("  rank: "+i),u.push("  shape: ["+t+"]"),u.push("  values:")),u.push(s.map(function(l){return"    "+l}).join(`
`)),u.join(`
`)}function bt(r,t,e){return Un(Array.isArray(r)?parseFloat(r[0].toFixed(jr))+" + "+parseFloat(r[1].toFixed(jr))+"j":Cn(r)?"'"+r+"'":e==="bool"?Xi(r):parseFloat(r.toFixed(jr)).toString(),t)}function Xi(r){return r===0?"false":"true"}function wt(r){for(var t=[],e=0;e<r.length;e+=2)t.push([r[e],r[e+1]]);return t}var ht=function(){function r(t,e,n){var o=this;if(this.dtype=e,this.shape=t.slice(),this.size=Y(t),n!=null){var a=n.length;E(a===this.size,function(){return"Length of values '"+a+"' does not match the size inferred by the shape '"+o.size+"'."})}if(e==="complex64")throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=n||Dt(e,this.size),this.strides=Xe(t)}return r.prototype.set=function(t){for(var e=this,n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o];n.length===0&&(n=[0]),E(n.length===this.rank,function(){return"The number of provided coordinates ("+n.length+") must match the rank ("+e.rank+")"});var a=this.locToIndex(n);this.values[a]=t},r.prototype.get=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];t.length===0&&(t=[0]);for(var n=0,o=0,a=t;o<a.length;o++){var i=a[o];if(i<0||i>=this.shape[n]){var s="Requested out of range element at "+t+".   Buffer shape="+this.shape;throw new Error(s)}n++}for(var u=t[t.length-1],l=0;l<t.length-1;++l)u+=this.strides[l]*t[l];return this.values[u]},r.prototype.locToIndex=function(t){if(this.rank===0)return 0;if(this.rank===1)return t[0];for(var e=t[t.length-1],n=0;n<t.length-1;++n)e+=this.strides[n]*t[n];return e},r.prototype.indexToLoc=function(t){if(this.rank===0)return[];if(this.rank===1)return[t];for(var e=new Array(this.shape.length),n=0;n<e.length-1;++n)e[n]=Math.floor(t/this.strides[n]),t-=e[n]*this.strides[n];return e[e.length-1]=t,e},Object.defineProperty(r.prototype,"rank",{get:function(){return this.shape.length},enumerable:!0,configurable:!0}),r.prototype.toTensor=function(){return rn().makeTensor(this.values,this.shape,this.dtype)},r}(),rn=null,O=null,Yi=null,Se=function(){function r(t,e,n,o){this.kept=!1,this.isDisposedInternal=!1,this.shape=t.slice(),this.dtype=e||"float32",this.size=Y(t),this.strides=Xe(t),this.dataId=n,this.id=o,this.rankType=this.rank<5?this.rank.toString():"higher"}return r.prototype.flatten=function(){return this.throwIfDisposed(),this.as1D()},r.prototype.asScalar=function(){return this.throwIfDisposed(),E(this.size===1,function(){return"The array must have only 1 element."}),this.reshape([])},r.prototype.as1D=function(){return this.throwIfDisposed(),this.reshape([this.size])},r.prototype.as2D=function(t,e){return this.throwIfDisposed(),this.reshape([t,e])},r.prototype.as3D=function(t,e,n){return this.throwIfDisposed(),this.reshape([t,e,n])},r.prototype.as4D=function(t,e,n,o){return this.throwIfDisposed(),this.reshape([t,e,n,o])},r.prototype.as5D=function(t,e,n,o,a){return this.throwIfDisposed(),this.reshape([t,e,n,o,a])},r.prototype.asType=function(t){return this.throwIfDisposed(),O.cast(this,t)},Object.defineProperty(r.prototype,"rank",{get:function(){return this.shape.length},enumerable:!0,configurable:!0}),r.prototype.buffer=function(){return j(this,void 0,void 0,function(){var t;return X(this,function(e){switch(e.label){case 0:return[4,this.data()];case 1:return t=e.sent(),[2,O.buffer(this.shape,this.dtype,t)]}})})},r.prototype.bufferSync=function(){return O.buffer(this.shape,this.dtype,this.dataSync())},r.prototype.array=function(){return j(this,void 0,void 0,function(){var t;return X(this,function(e){switch(e.label){case 0:return[4,this.data()];case 1:return t=e.sent(),[2,mo(this.shape,t)]}})})},r.prototype.arraySync=function(){return mo(this.shape,this.dataSync())},r.prototype.data=function(){return j(this,void 0,void 0,function(){var t,e;return X(this,function(n){switch(n.label){case 0:return this.throwIfDisposed(),t=rn().read(this.dataId),this.dtype!=="string"?[3,2]:[4,t];case 1:e=n.sent();try{return[2,e.map(function(o){return Tt(o)})]}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}n.label=2;case 2:return[2,t]}})})},r.prototype.dataSync=function(){this.throwIfDisposed();var t=rn().readSync(this.dataId);if(this.dtype==="string")try{return t.map(function(e){return Tt(e)})}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return t},r.prototype.bytes=function(){return j(this,void 0,void 0,function(){var t;return X(this,function(e){switch(e.label){case 0:return this.throwIfDisposed(),[4,rn().read(this.dataId)];case 1:return t=e.sent(),this.dtype==="string"?[2,t]:[2,new Uint8Array(t.buffer)]}})})},r.prototype.dispose=function(){this.isDisposed||(rn().disposeTensor(this),this.isDisposedInternal=!0)},Object.defineProperty(r.prototype,"isDisposed",{get:function(){return this.isDisposedInternal},enumerable:!0,configurable:!0}),r.prototype.throwIfDisposed=function(){if(this.isDisposed)throw new Error("Tensor is disposed.")},r.prototype.toFloat=function(){return this.asType("float32")},r.prototype.toInt=function(){return this.asType("int32")},r.prototype.toBool=function(){return this.asType("bool")},r.prototype.print=function(t){return t===void 0&&(t=!1),O.print(this,t)},r.prototype.reshape=function(t){return this.throwIfDisposed(),O.reshape(this,t)},r.prototype.reshapeAs=function(t){return this.throwIfDisposed(),this.reshape(t.shape)},r.prototype.expandDims=function(t){return t===void 0&&(t=0),O.expandDims(this,t)},r.prototype.cumsum=function(t,e,n){return t===void 0&&(t=0),e===void 0&&(e=!1),n===void 0&&(n=!1),O.cumsum(this,t,e,n)},r.prototype.squeeze=function(t){return this.throwIfDisposed(),O.squeeze(this,t)},r.prototype.clone=function(){return this.throwIfDisposed(),O.clone(this)},r.prototype.oneHot=function(t,e,n){return this.throwIfDisposed(),O.oneHot(this,t,e,n)},r.prototype.toString=function(t){return t===void 0&&(t=!1),If(this.dataSync(),this.shape,this.dtype,t)},r.prototype.tile=function(t){return this.throwIfDisposed(),O.tile(this,t)},r.prototype.gather=function(t,e){return e===void 0&&(e=0),this.throwIfDisposed(),O.gather(this,t,e)},r.prototype.matMul=function(t,e,n){return e===void 0&&(e=!1),n===void 0&&(n=!1),this.throwIfDisposed(),O.matMul(this,t,e,n)},r.prototype.dot=function(t){return this.throwIfDisposed(),O.dot(this,t)},r.prototype.norm=function(t,e,n){return t===void 0&&(t="euclidean"),e===void 0&&(e=null),n===void 0&&(n=!1),this.throwIfDisposed(),O.norm(this,t,e,n)},r.prototype.slice=function(t,e){return this.throwIfDisposed(),O.slice(this,t,e)},r.prototype.reverse=function(t){return this.throwIfDisposed(),O.reverse(this,t)},r.prototype.concat=function(t,e){return e===void 0&&(e=0),this.throwIfDisposed(),t instanceof r&&(t=[t]),O.concat([this].concat(t),e)},r.prototype.split=function(t,e){return e===void 0&&(e=0),this.throwIfDisposed(),O.split(this,t,e)},r.prototype.stack=function(t,e){return e===void 0&&(e=0),O.stack([this,t],e)},r.prototype.unstack=function(t){return t===void 0&&(t=0),O.unstack(this,t)},r.prototype.pad=function(t,e){return e===void 0&&(e=0),O.pad(this,t,e)},r.prototype.batchNormalization=function(t,e,n,o,a){return n===void 0&&(n=.001),Yi("tf.batchNormalization() is going away. Use tf.batchNorm() instead, and note the positional argument change of scale, offset, and varianceEpsilon"),this.batchNorm(t,e,a,o,n)},r.prototype.batchNorm=function(t,e,n,o,a){return a===void 0&&(a=.001),this.throwIfDisposed(),O.batchNorm(this,t,e,n,o,a)},r.prototype.all=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),O.all(this,t,e)},r.prototype.any=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),O.any(this,t,e)},r.prototype.logSumExp=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),O.logSumExp(this,t,e)},r.prototype.sum=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),O.sum(this,t,e)},r.prototype.prod=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),O.prod(this,t,e)},r.prototype.mean=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),O.mean(this,t,e)},r.prototype.min=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),O.min(this,t,e)},r.prototype.max=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),O.max(this,t,e)},r.prototype.argMin=function(t){return t===void 0&&(t=null),this.throwIfDisposed(),O.argMin(this,t)},r.prototype.argMax=function(t){return t===void 0&&(t=null),this.throwIfDisposed(),O.argMax(this,t)},r.prototype.cast=function(t){return this.throwIfDisposed(),O.cast(this,t)},r.prototype.add=function(t){return this.throwIfDisposed(),O.add(this,t)},r.prototype.addStrict=function(t){return this.throwIfDisposed(),O.addStrict(this,t)},r.prototype.atan2=function(t){return this.throwIfDisposed(),O.atan2(this,t)},r.prototype.sub=function(t){return this.throwIfDisposed(),O.sub(this,t)},r.prototype.subStrict=function(t){return this.throwIfDisposed(),O.subStrict(this,t)},r.prototype.pow=function(t){return this.throwIfDisposed(),O.pow(this,t)},r.prototype.powStrict=function(t){return this.throwIfDisposed(),O.powStrict(this,t)},r.prototype.mul=function(t){return this.throwIfDisposed(),O.mul(this,t)},r.prototype.mulStrict=function(t){return this.throwIfDisposed(),O.mulStrict(this,t)},r.prototype.div=function(t){return this.throwIfDisposed(),O.div(this,t)},r.prototype.divNoNan=function(t){return this.throwIfDisposed(),O.divNoNan(this,t)},r.prototype.floorDiv=function(t){return this.throwIfDisposed(),O.floorDiv(this,t)},r.prototype.divStrict=function(t){return this.throwIfDisposed(),O.divStrict(this,t)},r.prototype.minimum=function(t){return this.throwIfDisposed(),O.minimum(this,t)},r.prototype.minimumStrict=function(t){return this.throwIfDisposed(),O.minimumStrict(this,t)},r.prototype.maximum=function(t){return this.throwIfDisposed(),O.maximum(this,t)},r.prototype.maximumStrict=function(t){return this.throwIfDisposed(),O.maximumStrict(this,t)},r.prototype.mod=function(t){return this.throwIfDisposed(),O.mod(this,t)},r.prototype.modStrict=function(t){return this.throwIfDisposed(),O.modStrict(this,t)},r.prototype.squaredDifferenceStrict=function(t){return this.throwIfDisposed(),O.squaredDifferenceStrict(this,t)},r.prototype.transpose=function(t){return this.throwIfDisposed(),O.transpose(this,t)},r.prototype.notEqual=function(t){return this.throwIfDisposed(),O.notEqual(this,t)},r.prototype.notEqualStrict=function(t){return this.throwIfDisposed(),O.notEqualStrict(this,t)},r.prototype.less=function(t){return this.throwIfDisposed(),O.less(this,t)},r.prototype.lessStrict=function(t){return this.throwIfDisposed(),O.lessStrict(this,t)},r.prototype.equal=function(t){return this.throwIfDisposed(),O.equal(this,t)},r.prototype.equalStrict=function(t){return this.throwIfDisposed(),O.equalStrict(this,t)},r.prototype.lessEqual=function(t){return this.throwIfDisposed(),O.lessEqual(this,t)},r.prototype.lessEqualStrict=function(t){return this.throwIfDisposed(),O.lessEqualStrict(this,t)},r.prototype.greater=function(t){return this.throwIfDisposed(),O.greater(this,t)},r.prototype.greaterStrict=function(t){return this.throwIfDisposed(),O.greaterStrict(this,t)},r.prototype.greaterEqual=function(t){return this.throwIfDisposed(),O.greaterEqual(this,t)},r.prototype.greaterEqualStrict=function(t){return this.throwIfDisposed(),O.greaterEqualStrict(this,t)},r.prototype.logicalAnd=function(t){return this.throwIfDisposed(),O.logicalAnd(this,t)},r.prototype.logicalOr=function(t){return this.throwIfDisposed(),O.logicalOr(this,t)},r.prototype.logicalNot=function(){return this.throwIfDisposed(),O.logicalNot(this)},r.prototype.logicalXor=function(t){return this.throwIfDisposed(),O.logicalXor(this,t)},r.prototype.where=function(t,e){return this.throwIfDisposed(),O.where(t,this,e)},r.prototype.neg=function(){return this.throwIfDisposed(),O.neg(this)},r.prototype.ceil=function(){return this.throwIfDisposed(),O.ceil(this)},r.prototype.floor=function(){return this.throwIfDisposed(),O.floor(this)},r.prototype.sign=function(){return this.throwIfDisposed(),O.sign(this)},r.prototype.isNaN=function(){return this.throwIfDisposed(),O.isNaN(this)},r.prototype.isInf=function(){return this.throwIfDisposed(),O.isInf(this)},r.prototype.isFinite=function(){return this.throwIfDisposed(),O.isFinite(this)},r.prototype.exp=function(){return this.throwIfDisposed(),O.exp(this)},r.prototype.expm1=function(){return this.throwIfDisposed(),O.expm1(this)},r.prototype.log=function(){return this.throwIfDisposed(),O.log(this)},r.prototype.log1p=function(){return this.throwIfDisposed(),O.log1p(this)},r.prototype.sqrt=function(){return this.throwIfDisposed(),O.sqrt(this)},r.prototype.rsqrt=function(){return this.throwIfDisposed(),O.rsqrt(this)},r.prototype.square=function(){return this.throwIfDisposed(),O.square(this)},r.prototype.reciprocal=function(){return this.throwIfDisposed(),O.reciprocal(this)},r.prototype.abs=function(){return this.throwIfDisposed(),O.abs(this)},r.prototype.clipByValue=function(t,e){return this.throwIfDisposed(),O.clipByValue(this,t,e)},r.prototype.relu=function(){return this.throwIfDisposed(),O.relu(this)},r.prototype.relu6=function(){return this.throwIfDisposed(),O.relu6(this)},r.prototype.elu=function(){return this.throwIfDisposed(),O.elu(this)},r.prototype.selu=function(){return this.throwIfDisposed(),O.selu(this)},r.prototype.leakyRelu=function(t){return t===void 0&&(t=.2),this.throwIfDisposed(),O.leakyRelu(this,t)},r.prototype.prelu=function(t){return this.throwIfDisposed(),O.prelu(this,t)},r.prototype.sigmoid=function(){return this.throwIfDisposed(),O.sigmoid(this)},r.prototype.logSigmoid=function(){return this.throwIfDisposed(),O.logSigmoid(this)},r.prototype.softplus=function(){return this.throwIfDisposed(),O.softplus(this)},r.prototype.zerosLike=function(){return this.throwIfDisposed(),O.zerosLike(this)},r.prototype.onesLike=function(){return this.throwIfDisposed(),O.onesLike(this)},r.prototype.sin=function(){return this.throwIfDisposed(),O.sin(this)},r.prototype.cos=function(){return this.throwIfDisposed(),O.cos(this)},r.prototype.tan=function(){return this.throwIfDisposed(),O.tan(this)},r.prototype.asin=function(){return this.throwIfDisposed(),O.asin(this)},r.prototype.acos=function(){return this.throwIfDisposed(),O.acos(this)},r.prototype.atan=function(){return this.throwIfDisposed(),O.atan(this)},r.prototype.sinh=function(){return this.throwIfDisposed(),O.sinh(this)},r.prototype.cosh=function(){return this.throwIfDisposed(),O.cosh(this)},r.prototype.tanh=function(){return this.throwIfDisposed(),O.tanh(this)},r.prototype.asinh=function(){return this.throwIfDisposed(),O.asinh(this)},r.prototype.acosh=function(){return this.throwIfDisposed(),O.acosh(this)},r.prototype.atanh=function(){return this.throwIfDisposed(),O.atanh(this)},r.prototype.erf=function(){return this.throwIfDisposed(),O.erf(this)},r.prototype.round=function(){return this.throwIfDisposed(),O.round(this)},r.prototype.step=function(t){return t===void 0&&(t=0),this.throwIfDisposed(),O.step(this,t)},r.prototype.softmax=function(t){return t===void 0&&(t=-1),this.throwIfDisposed(),O.softmax(this,t)},r.prototype.logSoftmax=function(t){return t===void 0&&(t=-1),this.throwIfDisposed(),O.logSoftmax(this,t)},r.prototype.resizeBilinear=function(t,e){return e===void 0&&(e=!1),this.throwIfDisposed(),O.image.resizeBilinear(this,t,e)},r.prototype.resizeNearestNeighbor=function(t,e){return e===void 0&&(e=!1),this.throwIfDisposed(),O.image.resizeNearestNeighbor(this,t,e)},r.prototype.conv1d=function(t,e,n,o,a,i){return o===void 0&&(o="NWC"),a===void 0&&(a=1),this.throwIfDisposed(),O.conv1d(this,t,e,n,o,a,i)},r.prototype.conv2d=function(t,e,n,o,a,i){return o===void 0&&(o="NHWC"),a===void 0&&(a=[1,1]),this.throwIfDisposed(),O.conv2d(this,t,e,n,o,a,i)},r.prototype.conv2dTranspose=function(t,e,n,o,a){return this.throwIfDisposed(),O.conv2dTranspose(this,t,e,n,o,a)},r.prototype.depthwiseConv2D=function(t,e,n,o,a,i){return o===void 0&&(o="NHWC"),a===void 0&&(a=[1,1]),this.throwIfDisposed(),O.depthwiseConv2d(this,t,e,n,o,a,i)},r.prototype.separableConv2d=function(t,e,n,o,a,i){return a===void 0&&(a=[1,1]),i===void 0&&(i="NHWC"),this.throwIfDisposed(),O.separableConv2d(this,t,e,n,o,a,i)},r.prototype.avgPool=function(t,e,n,o){return this.throwIfDisposed(),O.avgPool(this,t,e,n,o)},r.prototype.maxPool=function(t,e,n,o){return this.throwIfDisposed(),O.maxPool(this,t,e,n,o)},r.prototype.localResponseNormalization=function(t,e,n,o){return t===void 0&&(t=5),e===void 0&&(e=1),n===void 0&&(n=1),o===void 0&&(o=.5),O.localResponseNormalization(this,t,e,n,o)},r.prototype.pool=function(t,e,n,o,a){return this.throwIfDisposed(),O.pool(this,t,e,n,o,a)},r.prototype.variable=function(t,e,n){return t===void 0&&(t=!0),this.throwIfDisposed(),rn().makeVariable(this,t,e,n)},r.prototype.unsortedSegmentSum=function(t,e){return this.throwIfDisposed(),O.unsortedSegmentSum(this,t,e)},r.prototype.batchToSpaceND=function(t,e){return this.throwIfDisposed(),O.batchToSpaceND(this,t,e)},r.prototype.spaceToBatchND=function(t,e){return this.throwIfDisposed(),O.spaceToBatchND(this,t,e)},r.prototype.topk=function(t,e){return t===void 0&&(t=1),e===void 0&&(e=!0),this.throwIfDisposed(),O.topk(this,t,e)},r.prototype.stridedSlice=function(t,e,n,o,a,i,s,u){return o===void 0&&(o=0),a===void 0&&(a=0),i===void 0&&(i=0),s===void 0&&(s=0),u===void 0&&(u=0),this.throwIfDisposed(),O.stridedSlice(this,t,e,n,o,a,i,s,u)},r.prototype.depthToSpace=function(t,e){return this.throwIfDisposed(),O.depthToSpace(this,t,e)},r.prototype.fft=function(){return this.throwIfDisposed(),O.spectral.fft(this)},r.prototype.ifft=function(){return this.throwIfDisposed(),O.spectral.ifft(this)},r.prototype.rfft=function(){return this.throwIfDisposed(),O.spectral.rfft(this)},r.prototype.irfft=function(){return this.throwIfDisposed(),O.spectral.irfft(this)},r}();Object.defineProperty(Se,Symbol.hasInstance,{value:function(r){return!!r&&r.dataId!=null&&r.shape!=null&&r.dtype!=null}});var yo,xo,bo,wo,Co,Nt=function(r){function t(e,n,o,a){var i=r.call(this,e.shape,e.dtype,e.dataId,a)||this;return i.trainable=n,i.name=o,i}return $e(t,r),t.prototype.assign=function(e){if(e.dtype!==this.dtype)throw new Error("dtype of the new value ("+e.dtype+") and previous value ("+this.dtype+") must match");if(!Re(e.shape,this.shape))throw new Error("shape of the new value ("+e.shape+") and previous value ("+this.shape+") must match");rn().disposeTensor(this),this.dataId=e.dataId,rn().incRef(this,null)},t.prototype.dispose=function(){rn().disposeVariable(this),this.isDisposedInternal=!0},t}(Se);Object.defineProperty(Nt,Symbol.hasInstance,{value:function(r){return r instanceof Se&&r.assign!=null&&r.assign instanceof Function}}),function(r){r.R0="R0",r.R1="R1",r.R2="R2",r.R3="R3",r.R4="R4",r.R5="R5",r.R6="R6"}(yo||(yo={})),function(r){r.float32="float32",r.int32="int32",r.bool="int32",r.complex64="complex64"}(xo||(xo={})),function(r){r.float32="float32",r.int32="int32",r.bool="bool",r.complex64="complex64"}(bo||(bo={})),function(r){r.float32="float32",r.int32="float32",r.bool="float32",r.complex64="complex64"}(wo||(wo={})),function(r){r.float32="complex64",r.int32="complex64",r.bool="complex64",r.complex64="complex64"}(Co||(Co={}));var kf={float32:wo,int32:xo,bool:bo,complex64:Co};function De(r,t){if(r==="string"||t==="string"){if(r==="string"&&t==="string")return"string";throw new Error("Can not upcast "+r+" with "+t)}return kf[r][t]}function nr(r){return De(r,"int32")}function ve(r,t){if(r.dtype===t.dtype)return[r,t];var e=De(r.dtype,t.dtype);return[r.cast(e),t.cast(e)]}function $i(r,t){E(r.dtype===t.dtype,function(){return"The dtypes of the first("+r.dtype+") and second("+t.dtype+") input must match"})}function Ho(r){var t=[];return function e(n,o,a){if(n!=null){if(n instanceof Se)return void o.push(n);if(i=n,!(!Array.isArray(i)&&typeof i!="object")){var i,s=n;for(var u in s){var l=s[u];a.has(l)||(a.add(l),e(l,o,a))}}}}(r,t,new Set),t}var Xr,Sf=Object.freeze({makeTypesMatch:ve,assertTypesMatch:$i,isTensorInList:function(r,t){return t.some(function(e){return e.id===r.id})},getTensorsInContainer:Ho}),Qa=function(){function r(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null}}return r.prototype.dispose=function(){for(var t in this.registeredVariables)this.registeredVariables[t].dispose()},r}(),Af=function(){function r(t){this.ENV=t,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new Qa}return r.prototype.ready=function(){return j(this,void 0,void 0,function(){var t,e,n;return X(this,function(o){switch(o.label){case 0:if(this.pendingBackendInit!=null)return[2,this.pendingBackendInit.then(function(){})];if(this.backendInstance!=null)return[2];t=this.getSortedBackends(),e=0,o.label=1;case 1:return e<t.length?(n=t[e],[4,this.initializeBackend(n).success]):[3,5];case 2:return o.sent()?[4,this.setBackend(n)]:[3,4];case 3:return o.sent(),[2];case 4:return e++,[3,1];case 5:throw new Error("Could not initialize any backends, all backend initializations failed.")}})})},Object.defineProperty(r.prototype,"backend",{get:function(){if(this.pendingBackendInit!=null)throw new Error("Backend '"+this.backendName+"' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods");if(this.backendInstance==null){var t=this.initializeBackendsAndReturnBest(),e=t.name;if(t.asyncInit)throw new Error("The highest priority backend '"+e+"' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods");this.setBackend(e)}return this.backendInstance},enumerable:!0,configurable:!0}),r.prototype.backendNames=function(){return Object.keys(this.registryFactory)},r.prototype.findBackend=function(t){return!(t in this.registry)&&(!(t in this.registryFactory)||this.initializeBackend(t).asyncInit)?null:this.registry[t]},r.prototype.findBackendFactory=function(t){return t in this.registryFactory?this.registryFactory[t].factory:null},r.prototype.registerBackend=function(t,e,n){return n===void 0&&(n=1),t in this.registryFactory?(console.warn(t+" backend was already registered. Reusing existing backend factory."),!1):(this.registryFactory[t]={factory:e,priority:n},!0)},r.prototype.setBackend=function(t){return j(this,void 0,void 0,function(){var e,n,o;return X(this,function(a){switch(a.label){case 0:if(this.registryFactory[t]==null)throw new Error("Backend name '"+t+"' not found in registry");return this.backendName=t,this.registry[t]!=null?[3,4]:(this.backendInstance=null,e=this.initializeBackend(t),n=e.success,e.asyncInit?[4,n]:[3,2]);case 1:return o=a.sent(),[3,3];case 2:o=n,a.label=3;case 3:if(!o)return[2,!1];a.label=4;case 4:return this.backendInstance=this.registry[t],this.setupRegisteredKernels(),this.profiler=new Ef(this.backendInstance),[2,!0]}})})},r.prototype.setupRegisteredKernels=function(){var t=this;po(this.backendName).forEach(function(e){e.setupFunc!=null&&e.setupFunc(t.backendInstance)})},r.prototype.disposeRegisteredKernels=function(t){var e=this;po(t).forEach(function(n){n.disposeFunc!=null&&n.disposeFunc(e.registry[t])})},r.prototype.initializeBackend=function(t){var e=this,n=this.registryFactory[t];if(n==null)throw new Error("Cannot initialize backend "+t+", no registration found.");try{var o=n.factory();if(Promise.resolve(o)===o){var a=++this.pendingBackendInitId,i=o.then(function(s){return!(a<e.pendingBackendInitId)&&(e.registry[t]=s,e.pendingBackendInit=null,!0)}).catch(function(s){return!(a<e.pendingBackendInitId)&&(e.pendingBackendInit=null,console.warn("Initialization of backend "+t+" failed"),console.warn(s.stack||s.message),!1)});return this.pendingBackendInit=i,{success:i,asyncInit:!0}}return this.registry[t]=o,{success:!0,asyncInit:!1}}catch(s){return console.warn("Initialization of backend "+t+" failed"),console.warn(s.stack||s.message),{success:!1,asyncInit:!1}}},r.prototype.removeBackend=function(t){if(!(t in this.registryFactory))throw new Error(t+" backend not found in registry");this.backendName===t&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,t in this.registry&&(this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t]),delete this.registryFactory[t],this.backendName===t&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)},r.prototype.getSortedBackends=function(){var t=this;if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort(function(e,n){return t.registryFactory[n].priority-t.registryFactory[e].priority})},r.prototype.initializeBackendsAndReturnBest=function(){for(var t=this.getSortedBackends(),e=0;e<t.length;e++){var n=t[e],o=this.initializeBackend(n),a=o.success,i=o.asyncInit;if(i||a)return{name:n,asyncInit:i}}throw new Error("Could not initialize any backends, all backend initializations failed.")},r.prototype.moveData=function(t,e){var n=this.state.tensorInfo.get(e),o=n.backend,a=this.readSync(e);o.disposeData(e),n.backend=t,t.move(e,a,n.shape,n.dtype),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++},r.prototype.tidy=function(t,e){var n,o=this,a=null;if(e==null){if(typeof t!="function")throw new Error("Please provide a function to tidy()");e=t}else{if(typeof t!="string"&&!(t instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof e!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");a=t}return this.scopedRun(function(){return o.startScope(a)},function(){return o.endScope(n)},function(){return(n=e())instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),n})},r.prototype.scopedRun=function(t,e,n){t();try{var o=n();return e(),o}catch(a){throw e(),a}},r.prototype.nextTensorId=function(){return r.nextTensorId++},r.prototype.nextVariableId=function(){return r.nextVariableId++},r.prototype.clone=function(t){var e=this.makeTensorFromDataId(t.dataId,t.shape,t.dtype),n={x:t};return this.addTapeNode(this.state.activeScope.name,n,[e],function(o){return{x:function(){return o.toFloat()}}},[]),e},r.prototype.runKernel=function(t,e,n,o,a){return this.runKernelFunc(null,e,null,t,n,o,a)},r.prototype.shouldCheckForMemLeaks=function(){return this.ENV.getBool("IS_TEST")},r.prototype.checkKernelForMemLeak=function(t,e,n){var o=this.backend.numDataIds(),a=0;n.forEach(function(u){a+=u.dtype==="complex64"?3:1});var i=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],s=o-e-a-i;if(s>0)throw new Error("Backend '"+this.backendName+"' has an internal memory leak ("+s+" data ids) after running '"+t+"'")},r.prototype.runKernelFunc=function(t,e,n,o,a,i,s){var u,l=this;i===void 0&&(i=[]),s===void 0&&(s=[]);var c=[],f=this.isTapeOn();o==null&&(o=this.state.activeScope!=null?this.state.activeScope.name:"");var h,d=function(y){f&&(c=y.map(function(x){return l.keep(l.clone(x))}))},p=this.state.numBytes,m=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);var v,g=Bo(o,this.backendName);return h=g!=null?function(){var y=l.backend.numDataIds();v=g.kernelFunc({inputs:e,attrs:a,backend:l.backend});var x=Array.isArray(v)?v:[v];l.shouldCheckForMemLeaks()&&l.checkKernelForMemLeak(o,y,x);var b=x.map(function(R){var A=R.dataId,k=R.shape,I=R.dtype;return l.makeTensorFromDataId(A,k,I)}),w=b.filter(function(R,A){return s[A]});return d((i||[]).slice().concat(w)),b}:function(){var y=l.backend.numDataIds();v=l.tidy(function(){return t(l.backend,d)});var x=Array.isArray(v)?v:[v];return l.shouldCheckForMemLeaks()&&l.checkKernelForMemLeak(o,y,x),x},this.scopedRun(function(){return l.state.kernelDepth++},function(){return l.state.kernelDepth--},function(){u=l.ENV.getBool("DEBUG")?l.profiler.profileKernel(o,e,function(){return h()}):h()}),f&&this.addTapeNode(o,e,u,n,c),this.state.profiling&&this.state.activeProfile.kernels.push({name:o,bytesAdded:this.state.numBytes-p,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-m,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(e).map(function(y){return e[y].shape}),outputShapes:u.map(function(y){return y.shape})}),Array.isArray(v)?u:u[0]},r.prototype.makeTensor=function(t,e,n,o){if(t==null)throw new Error("Values passed to engine.makeTensor() are null");n=n||"float32",o=o||this.backend;var a=t;n==="string"&&Cn(t[0])&&(a=t.map(function(c){return Ki(c)}));var i=o.write(a,e,n),s=new Se(e,n,i,this.nextTensorId());if(this.incRef(s,o),n==="string"){var u=this.state.tensorInfo.get(i),l=Gi(a);this.state.numBytes+=l-u.bytes,u.bytes=l}return s},r.prototype.makeTensorFromDataId=function(t,e,n,o){var a=new Se(e,n=n||"float32",t,this.nextTensorId());return this.incRef(a,o),a},r.prototype.makeVariable=function(t,e,n,o){e===void 0&&(e=!0),n=n||this.nextVariableId().toString(),o!=null&&o!==t.dtype&&(t=t.asType(o));var a=new Nt(t,e,n,this.nextTensorId());if(this.state.registeredVariables[a.name]!=null)throw new Error("Variable with name "+a.name+" was already registered");return this.state.registeredVariables[a.name]=a,this.incRef(a,this.backend),a},r.prototype.incRef=function(t,e){var n=this.state.tensorInfo.has(t.dataId)?this.state.tensorInfo.get(t.dataId).refCount:0;if(this.state.numTensors++,t.dtype==="string"&&this.state.numStringTensors++,n===0){this.state.numDataBuffers++;var o=0;t.dtype!=="complex64"&&t.dtype!=="string"&&(o=t.size*Uo(t.dtype)),this.state.tensorInfo.set(t.dataId,{backend:e||this.backend,dtype:t.dtype,shape:t.shape,bytes:o,refCount:0}),this.state.numBytes+=o}this.state.tensorInfo.get(t.dataId).refCount++,t instanceof Nt||this.track(t)},r.prototype.disposeTensor=function(t){if(this.state.tensorInfo.has(t.dataId)){this.state.numTensors--,t.dtype==="string"&&this.state.numStringTensors--;var e=this.state.tensorInfo.get(t.dataId);e.refCount<=1?(t.dtype!=="complex64"&&(this.state.numBytes-=e.bytes),this.state.numDataBuffers--,e.backend.disposeData(t.dataId),this.state.tensorInfo.delete(t.dataId)):this.state.tensorInfo.get(t.dataId).refCount--}},r.prototype.disposeVariables=function(){for(var t in this.state.registeredVariables){var e=this.state.registeredVariables[t];this.disposeVariable(e)}},r.prototype.disposeVariable=function(t){this.disposeTensor(t),this.state.registeredVariables[t.name]!=null&&delete this.state.registeredVariables[t.name]},r.prototype.memory=function(){var t=this.backend.memory();return t.numTensors=this.state.numTensors,t.numDataBuffers=this.state.numDataBuffers,t.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(t.unreliable=!0,t.reasons==null&&(t.reasons=[]),t.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),t},r.prototype.profile=function(t){return j(this,void 0,void 0,function(){var e,n;return X(this,function(o){return this.state.profiling=!0,e=this.state.numBytes,n=this.state.numTensors,this.state.activeProfile.kernels=[],this.state.activeProfile.result=t(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max.apply(Math,this.state.activeProfile.kernels.map(function(a){return a.totalBytesSnapshot})),this.state.activeProfile.newBytes=this.state.numBytes-e,this.state.activeProfile.newTensors=this.state.numTensors-n,[2,this.state.activeProfile]})})},r.prototype.isTapeOn=function(){return this.state.gradientDepth>0&&this.state.kernelDepth===0},r.prototype.addTapeNode=function(t,e,n,o,a){var i=this,s={id:this.state.nextTapeNodeId++,kernelName:t,inputs:e,outputs:n,saved:a},u=Mi(t);u!=null&&(o=u.gradFunc),o!=null&&(s.gradient=function(l){return l=l.map(function(c,f){if(c==null){var h=n[f],d=vt(h.size,h.dtype);return i.makeTensor(d,h.shape,h.dtype)}return c}),o(l.length>1?l:l[0],a)}),this.state.activeTape.push(s)},r.prototype.keep=function(t){return t.kept=!0,t},r.prototype.startTape=function(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++},r.prototype.endTape=function(){this.state.gradientDepth--},r.prototype.startScope=function(t){var e={track:[],name:"unnamed scope",id:this.state.nextScopeId++};t&&(e.name=t),this.state.scopeStack.push(e),this.state.activeScope=e},r.prototype.endScope=function(t){for(var e=this,n=Ho(t),o=new Set(n.map(function(u){return u.id})),a=0;a<this.state.activeScope.track.length;a++){var i=this.state.activeScope.track[a];i.kept||o.has(i.id)||i.dispose()}var s=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],n.forEach(function(u){u.kept||u.scopeId!==s.id||e.track(u)})},r.prototype.gradients=function(t,e,n,o){var a=this;if(o===void 0&&(o=!1),E(e.length>0,function(){return"gradients() received an empty list of xs."}),n!=null&&n.dtype!=="float32")throw new Error("dy must have 'float32' dtype, but has '"+n.dtype+"'");var i=this.scopedRun(function(){return a.startTape()},function(){return a.endTape()},function(){return a.tidy("forward",t)});E(i instanceof Se,function(){return"The result y returned by f() must be a tensor."});var s=function(u,l,c){for(var f={},h={},d=0;d<l.length;d++)f[l[d].id]=!0;for(d=0;d<u.length;d++){var p=(R=u[d]).inputs;for(var m in p){for(var v=p[m],g=!1,y=0;y<l.length;y++)if(f[v.id]){R.outputs.forEach(function(S){return f[S.id]=!0}),g=!0,h[R.id]=!0;break}if(g)break}}var x={};x[c.id]=!0;var b={};for(d=u.length-1;d>=0;d--)for(p=(R=u[d]).inputs,y=0;y<R.outputs.length;y++)if(x[R.outputs[y].id]){for(var m in p)x[p[m].id]=!0,b[R.id]=!0;break}var w=[];for(d=0;d<u.length;d++){var R;if(h[(R=u[d]).id]&&b[R.id]){var A={};for(var m in R.inputs){var k=R.inputs[m];f[k.id]&&(A[m]=k)}var I=Object.assign({},R);I.inputs=A,I.outputs=R.outputs,w.push(I)}}return w}(this.state.activeTape,e,i);if(!o&&s.length===0&&e.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",function(){var u,l,c={};c[i.id]=n??(u=i.shape,l=Vo(Y(u),"float32"),D.makeTensor(l,u,"float32")),function(h,d,p){for(var m=function(g){var y=d[g],x=[];if(y.outputs.forEach(function(A){var k=h[A.id];k!=null?x.push(k):x.push(null)}),y.gradient==null)throw new Error("Cannot compute gradient: gradient function not found for "+y.kernelName+".");var b=y.gradient(x),w=function(A){if(!(A in b))throw new Error("Cannot backprop through input "+A+". Available gradients found: "+Object.keys(b)+".");var k=p(function(){return b[A]()});if(k.dtype!=="float32")throw new Error("Error in gradient for op "+y.kernelName+". The gradient of input "+A+" must have 'float32' dtype, but has '"+k.dtype+"'");var I=y.inputs[A];if(!Re(k.shape,I.shape))throw new Error("Error in gradient for op "+y.kernelName+". The gradient of input '"+A+"' has shape '"+k.shape+"', which does not match the shape of the input '"+I.shape+"'");if(h[I.id]==null)h[I.id]=k;else{var S=h[I.id];h[I.id]=S.add(k),S.dispose()}};for(var R in y.inputs)w(R)},v=d.length-1;v>=0;v--)m(v)}(c,s,function(h){return a.tidy(h)});var f=e.map(function(h){return c[h.id]});return a.state.gradientDepth===0&&(a.state.activeTape.forEach(function(h){for(var d=0,p=h.saved;d<p.length;d++)p[d].dispose()}),a.state.activeTape=null),{value:i,grads:f}})},r.prototype.customGrad=function(t){var e=this;return E(In(t),function(){return"The f passed in customGrad(f) must be a function."}),function(){for(var n,o=[],a=0;a<arguments.length;a++)o[a]=arguments[a];E(o.every(function(s){return s instanceof Se}),function(){return"The args passed in customGrad(f)(x1, x2,...) must all be tensors"});var i={};return o.forEach(function(s,u){i[u]=s}),e.runKernelFunc(function(s,u){return E((n=t.apply(void 0,o.concat([u]))).value instanceof Se,function(){return"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"}),E(In(n.gradFunc),function(){return"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."}),n.value},i,function(s,u){var l=n.gradFunc(s,u),c=Array.isArray(l)?l:[l];E(c.length===o.length,function(){return"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."}),E(c.every(function(h){return h instanceof Se}),function(){return"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors."});var f={};return c.forEach(function(h,d){f[d]=function(){return h}}),f})}},r.prototype.readSync=function(t){return this.state.tensorInfo.get(t).backend.readSync(t)},r.prototype.read=function(t){return this.state.tensorInfo.get(t).backend.read(t)},r.prototype.time=function(t){return j(this,void 0,void 0,function(){var e,n;return X(this,function(o){switch(o.label){case 0:return e=Ke(),[4,this.backend.time(t)];case 1:return(n=o.sent()).wallMs=Ke()-e,[2,n]}})})},r.prototype.track=function(t){return this.state.activeScope!=null&&(t.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(t)),t},Object.defineProperty(r.prototype,"registeredVariables",{get:function(){return this.state.registeredVariables},enumerable:!0,configurable:!0}),r.prototype.reset=function(){for(var t in this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new Qa,this.registry)this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null},r.nextTensorId=0,r.nextVariableId=0,r}(),D=function(){var r=function(){if(Xr==null){var e=void 0;if(typeof window<"u")e=window;else if(typeof global<"u")e=global;else if(typeof process<"u")e=process;else{if(typeof self>"u")throw new Error("Could not find a global object");e=self}Xr=e}return Xr}();if(r._tfengine==null){var t=new Oi(r);r._tfengine=new Af(t)}return function(e){Mo=e}(r._tfengine.ENV),rn=function(){return r._tfengine},r._tfengine}();function Qi(){return typeof window<"u"&&window.document!=null||typeof WorkerGlobalScope<"u"}var cn=M();cn.registerFlag("DEBUG",function(){return!1},function(r){r&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")}),cn.registerFlag("IS_BROWSER",function(){return Qi()}),cn.registerFlag("IS_NODE",function(){return typeof process<"u"&&process.versions!==void 0&&process.versions.node!==void 0}),cn.registerFlag("IS_CHROME",function(){return typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor)}),cn.registerFlag("PROD",function(){return!1}),cn.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",function(){return cn.getBool("DEBUG")}),cn.registerFlag("DEPRECATION_WARNINGS_ENABLED",function(){return!0}),cn.registerFlag("IS_TEST",function(){return!1});var Ft,Ge,ze,Mn={},Yr={alpha:!1,antialias:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,depth:!1,stencil:!1,failIfMajorPerformanceCaveat:!0};function Ji(r,t){Mn[r]=t}function an(r){r in Mn||(Mn[r]=function(e){if(e!==1&&e!==2)throw new Error("Cannot get WebGL rendering context, WebGL is disabled.");var n=function(o){if(typeof OffscreenCanvas<"u"&&o===2)return new OffscreenCanvas(300,150);if(typeof document<"u")return document.createElement("canvas");throw new Error("Cannot create a canvas in this context")}(e);return n.addEventListener("webglcontextlost",function(o){o.preventDefault(),delete Mn[e]},!1),e===1?n.getContext("webgl",Yr)||n.getContext("experimental-webgl",Yr):n.getContext("webgl2",Yr)}(r));var t=Mn[r];return t.isContextLost()?(delete Mn[r],an(r)):(t.disable(t.DEPTH_TEST),t.disable(t.STENCIL_TEST),t.disable(t.BLEND),t.disable(t.DITHER),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SAMPLE_COVERAGE),t.enable(t.SCISSOR_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK),Mn[r])}function br(r,t){return[t,r]}function kt(r){var t=Y(r);return cr(Math.ceil(t/4))}function Gt(r,t){return[Math.max(1,Math.ceil(t/2)),Math.max(1,Math.ceil(r/2))]}function qo(r,t){var e,n,o,a,i,s,u,l,c,f=r;return M().getNumber("WEBGL_VERSION")===2?(e=f.R32F,n=f.R16F,o=f.RGBA16F,a=f.RGBA32F,i=f.RED,s=4,u=1,l=f.HALF_FLOAT,c=f.FLOAT):(e=r.RGBA,n=r.RGBA,o=r.RGBA,a=f.RGBA,i=r.RGBA,s=4,u=4,l=t!=null?t.HALF_FLOAT_OES:null,c=r.FLOAT),{internalFormatFloat:e,internalFormatHalfFloat:n,internalFormatPackedHalfFloat:o,internalFormatPackedFloat:a,textureFormatFloat:i,downloadTextureFormat:r.RGBA,downloadUnpackNumChannels:s,defaultNumChannels:u,textureTypeHalfFloat:l,textureTypeFloat:c}}function K(r,t,e){var n=e();return t&&function(o){var a=o.getError();if(a!==o.NO_ERROR)throw new Error("WebGL Error: "+es(o,a))}(r),n}(function(r){r[r.DENSE=0]="DENSE",r[r.SHARED_BATCH=1]="SHARED_BATCH"})(Ft||(Ft={})),function(r){r[r.RENDER=0]="RENDER",r[r.UPLOAD=1]="UPLOAD",r[r.PIXELS=2]="PIXELS",r[r.DOWNLOAD=3]="DOWNLOAD"}(Ge||(Ge={})),function(r){r[r.UNPACKED_FLOAT16=0]="UNPACKED_FLOAT16",r[r.UNPACKED_FLOAT32=1]="UNPACKED_FLOAT32",r[r.PACKED_4X1_UNSIGNED_BYTE=2]="PACKED_4X1_UNSIGNED_BYTE",r[r.PACKED_2X2_FLOAT32=3]="PACKED_2X2_FLOAT32",r[r.PACKED_2X2_FLOAT16=4]="PACKED_2X2_FLOAT16"}(ze||(ze={}));var Df=596e-10,Tf=65504;function Zi(r){return!!(M().getBool("WEBGL_RENDER_FLOAT32_ENABLED")||r===0||Df<Math.abs(r)&&Math.abs(r)<Tf)}function es(r,t){switch(t){case r.NO_ERROR:return"NO_ERROR";case r.INVALID_ENUM:return"INVALID_ENUM";case r.INVALID_VALUE:return"INVALID_VALUE";case r.INVALID_OPERATION:return"INVALID_OPERATION";case r.INVALID_FRAMEBUFFER_OPERATION:return"INVALID_FRAMEBUFFER_OPERATION";case r.OUT_OF_MEMORY:return"OUT_OF_MEMORY";case r.CONTEXT_LOST_WEBGL:return"CONTEXT_LOST_WEBGL";default:return"Unknown error code "+t}}function Et(r,t,e){return gn(r,t,function(){return r.getExtension(e)},'Extension "'+e+'" not supported on this browser.')}function ns(r,t,e){var n=gn(r,t,function(){return r.createShader(r.VERTEX_SHADER)},"Unable to create vertex WebGLShader.");if(K(r,t,function(){return r.shaderSource(n,e)}),K(r,t,function(){return r.compileShader(n)}),r.getShaderParameter(n,r.COMPILE_STATUS)===!1)throw console.log(r.getShaderInfoLog(n)),new Error("Failed to compile vertex shader.");return n}function ts(r,t,e){var n=gn(r,t,function(){return r.createShader(r.FRAGMENT_SHADER)},"Unable to create fragment WebGLShader.");if(K(r,t,function(){return r.shaderSource(n,e)}),K(r,t,function(){return r.compileShader(n)}),r.getShaderParameter(n,r.COMPILE_STATUS)===!1)throw function(o,a){var i=Nf.exec(a);if(i==null)return console.log("Couldn't parse line number in error: "+a),void console.log(o);for(var s=+i[1],u=o.split(`
`),l=u.length.toString().length+2,c=u.map(function(v,g){return Un((g+1).toString(),l)+v}),f=0,h=0;h<c.length;h++)f=Math.max(c[h].length,f);var d=c.slice(0,s-1),p=c.slice(s-1,s),m=c.slice(s);console.log(d.join(`
`)),console.log(a.split(`
`)[0]),console.log("%c "+Un(p[0],f),"border:1px solid red; background-color:#e3d2d2; color:#a61717"),console.log(m.join(`
`))}(e,r.getShaderInfoLog(n)),new Error("Failed to compile fragment shader.");return n}var tr,rr,Nf=/ERROR: [0-9]+:([0-9]+):/g;function rs(r,t){return gn(r,t,function(){return r.createProgram()},"Unable to create WebGLProgram.")}function os(r,t,e){if(K(r,t,function(){return r.linkProgram(e)}),r.getProgramParameter(e,r.LINK_STATUS)===!1)throw console.log(r.getProgramInfoLog(e)),new Error("Failed to link vertex and fragment shaders.")}function or(r,t,e){if(K(r,t,function(){return r.validateProgram(e)}),r.getProgramParameter(e,r.VALIDATE_STATUS)===!1)throw console.log(r.getProgramInfoLog(e)),new Error("Shader program validation failed.")}function as(r,t,e){var n=gn(r,t,function(){return r.createBuffer()},"Unable to create WebGLBuffer");return K(r,t,function(){return r.bindBuffer(r.ARRAY_BUFFER,n)}),K(r,t,function(){return r.bufferData(r.ARRAY_BUFFER,e,r.STATIC_DRAW)}),n}function is(r,t,e){var n=gn(r,t,function(){return r.createBuffer()},"Unable to create WebGLBuffer");return K(r,t,function(){return r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,n)}),K(r,t,function(){return r.bufferData(r.ELEMENT_ARRAY_BUFFER,e,r.STATIC_DRAW)}),n}function ss(r,t){return gn(r,t,function(){return r.createTexture()},"Unable to create WebGLTexture.")}function us(r,t){var e=M().getNumber("WEBGL_MAX_TEXTURE_SIZE");if(r<=0||t<=0){var n="["+r+"x"+t+"]";throw new Error("Requested texture size "+n+" is invalid.")}if(r>e||t>e)throw n="["+r+"x"+t+"]",new Error("Requested texture size "+n+" greater than WebGL maximum on this browser / GPU "+("["+e+"x"+e+"]")+".")}function ls(r,t){return gn(r,t,function(){return r.createFramebuffer()},"Unable to create WebGLFramebuffer.")}function Eo(r,t,e,n,o,a,i,s){var u=r.getAttribLocation(e,n);return u!==-1&&(K(r,t,function(){return r.bindBuffer(r.ARRAY_BUFFER,o)}),K(r,t,function(){return r.vertexAttribPointer(u,a,r.FLOAT,!1,i,s)}),K(r,t,function(){return r.enableVertexAttribArray(u)}),!0)}function cs(r,t,e,n){vs(r,n),K(r,t,function(){return r.activeTexture(r.TEXTURE0+n)}),K(r,t,function(){return r.bindTexture(r.TEXTURE_2D,e)})}function fs(r,t,e,n){return gn(r,t,function(){return r.getUniformLocation(e,n)},'uniform "'+n+'" not present in program.')}function hs(r,t,e){return r.getUniformLocation(t,e)}function ds(r,t,e,n,o,a){K(r,t,function(){return cs(r,t,n,a)}),K(r,t,function(){return r.uniform1i(o,a)})}function ar(r,t,e,n){K(r,t,function(){return r.bindFramebuffer(r.FRAMEBUFFER,n)}),K(r,t,function(){return r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,e,0)})}function Ro(r,t,e){K(r,t,function(){return r.bindFramebuffer(r.FRAMEBUFFER,e)}),K(r,t,function(){return r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,null,0)})}function Rt(r){var t=r.checkFramebufferStatus(r.FRAMEBUFFER);if(t!==r.FRAMEBUFFER_COMPLETE)throw new Error("Error binding framebuffer: "+ps(r,t))}function ps(r,t){switch(t){case r.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_ATTACHMENT";case r.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";case r.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return"FRAMEBUFFER_INCOMPLETE_DIMENSIONS";case r.FRAMEBUFFER_UNSUPPORTED:return"FRAMEBUFFER_UNSUPPORTED";default:return"unknown error "+t}}function gn(r,t,e,n){var o=K(r,t,function(){return e()});if(o==null)throw new Error(n);return o}function vs(r,t){var e=r.MAX_COMBINED_TEXTURE_IMAGE_UNITS-1,n=t+r.TEXTURE0;if(n<r.TEXTURE0||n>e)throw new Error("textureUnit must be in "+("[gl.TEXTURE0, gl.TEXTURE"+e+"]")+".")}function _t(r,t){return t===void 0&&(t=2),Y(r.slice(0,r.length-t))}function Ot(r){if(r.length===0)throw Error("Cannot get rows and columns of an empty shape array.");return[r.length>1?r[r.length-2]:1,r[r.length-1]]}function ir(r){var t=[1,1,1];return r.length===0||r.length===1&&r[0]===1||(t=[_t(r)].concat(Ot(r))),t}function ms(r,t){var e;t===void 0&&(t=!1);var n=M().getNumber("WEBGL_MAX_TEXTURE_SIZE");if(t&&(n*=2,(r=r.map(function(l,c){return c>=r.length-2?Wo(r[c]):r[c]})).length===1&&(r=[2,r[0]])),r.length!==2){var o=wn(r);r=o.newShape}var a=Y(r);if(r.length<=1&&a<=n)return[1,a];if(r.length===2&&r[0]<=n&&r[1]<=n)return r;if(r.length===3&&r[0]*r[1]<=n&&r[2]<=n)return[r[0]*r[1],r[2]];if(r.length===3&&r[0]<=n&&r[1]*r[2]<=n)return[r[0],r[1]*r[2]];if(r.length===4&&r[0]*r[1]*r[2]<=n&&r[3]<=n)return[r[0]*r[1]*r[2],r[3]];if(r.length===4&&r[0]<=n&&r[1]*r[2]*r[3]<=n)return[r[0],r[1]*r[2]*r[3]];if(t){var i=_t(r),s=2,u=2;return r.length&&(s=(e=Ot(r))[0],u=e[1]),cr(a=i*(s/2)*(u/2)).map(function(l){return 2*l})}return cr(a)}function Yt(r){return r%2==0}function It(r,t){if(Re(r=r.slice(-2),t=t.slice(-2))||!r.length||!t.length||r[0]===0||r[1]===0||t[0]===0||t[1]===0)return!0;if(r.length!==t.length){var e=r.slice(-1)[0],n=t.slice(-1)[0];if(e===n||Yt(e)&&Yt(n)&&(r[0]===1||t[0]===1))return!0}return r[1]===t[1]&&Yt(r[0])&&Yt(t[0])}function gs(r){if(tr==null){var t=an(r);tr=t.getParameter(t.MAX_TEXTURE_SIZE)}return tr}function ys(r){if(rr==null){var t=an(r);rr=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS)}return Math.min(16,rr)}function xs(r){if(r===0)return 0;var t=an(r);return He(t,"EXT_disjoint_timer_query_webgl2")&&r===2?2:He(t,"EXT_disjoint_timer_query")?1:0}function He(r,t){return r.getExtension(t)!=null}function Io(r){try{if(an(r)!=null)return!0}catch{return!1}return!1}function bs(r){if(r===0)return!1;var t=an(r);if(r===1){if(!He(t,"OES_texture_float"))return!1}else if(!He(t,"EXT_color_buffer_float"))return!1;return ko(t)}function ws(r){if(r===0)return!1;var t=an(r);if(r!==1){if(He(t,"EXT_color_buffer_float"))return ko(t);if(He(t,"EXT_color_buffer_half_float")){var e=t.getExtension("EXT_color_buffer_half_float");return function(n,o){var a=qo(n,o),i=n.createTexture();n.bindTexture(n.TEXTURE_2D,i),n.texImage2D(n.TEXTURE_2D,0,a.internalFormatHalfFloat,1,1,0,a.textureFormatFloat,a.textureTypeHalfFloat,null);var s=n.createFramebuffer();n.bindFramebuffer(n.FRAMEBUFFER,s),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,i,0);var u=n.checkFramebufferStatus(n.FRAMEBUFFER)===n.FRAMEBUFFER_COMPLETE;return n.bindTexture(n.TEXTURE_2D,null),n.bindFramebuffer(n.FRAMEBUFFER,null),n.deleteTexture(i),n.deleteFramebuffer(s),u}(t,e)}return!1}return!!He(t,"OES_texture_float")&&!!He(t,"WEBGL_color_buffer_float")&&ko(t)}function ko(r){var t=qo(r),e=r.createTexture();r.bindTexture(r.TEXTURE_2D,e),r.texImage2D(r.TEXTURE_2D,0,t.internalFormatFloat,1,1,0,t.textureFormatFloat,t.textureTypeFloat,null);var n=r.createFramebuffer();r.bindFramebuffer(r.FRAMEBUFFER,n),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,e,0);var o=r.checkFramebufferStatus(r.FRAMEBUFFER)===r.FRAMEBUFFER_COMPLETE;return r.bindTexture(r.TEXTURE_2D,null),r.bindFramebuffer(r.FRAMEBUFFER,null),r.deleteTexture(e),r.deleteFramebuffer(n),o}function Cs(r){return r===2&&an(r).fenceSync!=null}var Ff=Object.freeze({callAndCheck:K,canBeRepresented:Zi,getWebGLErrorMessage:es,getExtensionOrThrow:Et,createVertexShader:ns,createFragmentShader:ts,createProgram:rs,linkProgram:os,validateProgram:or,createStaticVertexBuffer:as,createStaticIndexBuffer:is,getNumChannels:function(){return M().getNumber("WEBGL_VERSION")===2?1:4},createTexture:ss,validateTextureSize:us,createFramebuffer:ls,bindVertexBufferToProgramAttribute:Eo,bindTextureUnit:cs,unbindTextureUnit:function(r,t,e){vs(r,e),K(r,t,function(){return r.activeTexture(r.TEXTURE0+e)}),K(r,t,function(){return r.bindTexture(r.TEXTURE_2D,null)})},getProgramUniformLocationOrThrow:fs,getProgramUniformLocation:hs,bindTextureToProgramUniformSampler:ds,bindCanvasToFramebuffer:function(r,t){K(r,t,function(){return r.bindFramebuffer(r.FRAMEBUFFER,null)}),K(r,t,function(){return r.viewport(0,0,r.canvas.width,r.canvas.height)}),K(r,t,function(){return r.scissor(0,0,r.canvas.width,r.canvas.height)})},bindColorTextureToFramebuffer:ar,unbindColorTextureFromFramebuffer:Ro,validateFramebuffer:Rt,getFramebufferErrorMessage:ps,getBatchDim:_t,getRowsCols:Ot,getShapeAs3D:ir,getTextureShapeFromLogicalShape:ms,isReshapeFree:It,getWebGLMaxTextureSize:gs,resetMaxTextureSize:function(){tr=null},resetMaxTexturesInShader:function(){rr=null},getMaxTexturesInShader:ys,getWebGLDisjointQueryTimerVersion:xs,hasExtension:He,isWebGLVersionEnabled:Io,isCapableOfRenderingToFloatTexture:bs,isDownloadFloatTextureEnabled:ws,isWebGLFenceEnabled:Cs}),Z=M();function _f(){M().set("PROD",!0)}function Of(){M().set("DEBUG",!0)}function Mf(){M().set("DEPRECATION_WARNINGS_ENABLED",!1),console.warn("TensorFlow.js deprecation warnings have been disabled.")}function Ko(r){M().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(r+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")}function Bf(){D.disposeVariables()}function Pf(){return D}function Lf(){return D.memory()}function Wf(r){return D.profile(r)}function Ee(r,t){return D.tidy(r,t)}function Me(r){Ho(r).forEach(function(t){return t.dispose()})}function Es(r){return D.keep(r)}function Uf(r){return D.time(r)}function zf(r){return D.setBackend(r)}function Vf(){return D.ready()}function Gf(){return D.backendName}function Hf(r){D.removeBackend(r)}function qf(r){return D.findBackend(r)}function Kf(r){return D.findBackendFactory(r)}function jf(r,t,e){return e===void 0&&(e=1),D.registerBackend(r,t,e)}function Xf(){return D.backend}function Yf(r,t){M().setPlatform(r,t)}function hr(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];M().getBool("IS_TEST")||console.warn.apply(console,r)}function on(r,t){var e=r;if(Fe(r))return t==="string"?[]:[r.length];if(!Array.isArray(r))return[];for(var n=[];Array.isArray(e)||Fe(e)&&t!=="string";)n.push(e.length),e=e[0];return Array.isArray(r)&&M().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&function o(a,i,s){if(s=s||[],!Array.isArray(a)&&!Fe(a))return void E(i.length===0,function(){return"Element arr["+s.join("][")+"] is a primitive, but should be an array/TypedArray of "+i[0]+" elements"});E(i.length>0,function(){return"Element arr["+s.join("][")+"] should be a primitive, but is an array of "+a.length+" elements"}),E(a.length===i[0],function(){return"Element arr["+s.join("][")+"] should have "+i[0]+" elements, but has "+a.length+" elements"});for(var u=i.slice(1),l=0;l<a.length;++l)o(a[l],u,s.concat(l))}(r,n,[]),n}function Ja(r,t,e,n){if(r!=null&&(r!=="numeric"&&r!==t||r==="numeric"&&t==="string"))throw new Error("Argument '"+e+"' passed to '"+n+"' must be "+r+" tensor, but got "+t+" tensor")}function C(r,t,e,n){if(n===void 0&&(n="numeric"),r instanceof Se)return Ja(n,r.dtype,t,e),r;var o=pt(r);if(o!=="string"&&["bool","int32","float32"].indexOf(n)>=0&&(o=n),Ja(n,o,t,e),r==null||!Fe(r)&&!Array.isArray(r)&&typeof r!="number"&&typeof r!="boolean"&&typeof r!="string"){var a=r==null?"null":r.constructor.name;throw new Error("Argument '"+t+"' passed to '"+e+"' must be a Tensor or TensorLike, but got '"+a+"'")}var i=on(r,o);Fe(r)||Array.isArray(r)||(r=[r]);var s=o!=="string"?zo(r,o,M().getBool("DEBUG")):vn(r,[],!0);return D.makeTensor(s,i,o)}function Mt(r,t,e,n){if(n===void 0&&(n="numeric"),!Array.isArray(r))throw new Error("Argument "+t+" passed to "+e+" must be a `Tensor[]` or `TensorLike[]`");return r.map(function(o,a){return C(o,t+"["+a+"]",e)},n)}function jo(r,t){for(var e=0;e<r.length;++e)if(r[r.length-e-1]!==t-1-e)return!1;return!0}function Rs(r,t,e){for(var n=r.length+t.length,o=[],a=0,i=0,s=0;s<n;s++)e.indexOf(s)===-1?o.push(r[a++]):o.push(t[i++]);return o}function Te(r,t){for(var e=[],n=r.length,o=0;o<n;o++)t.indexOf(o)===-1&&e.push(r[o]);return[e,t.map(function(a){return r[a]})]}function Be(r,t){return Rs(r,t.map(function(e){return 1}),t)}function Le(r,t,e){E(jo(t,e),function(){return r+" supports only inner-most axes for now. Got axes "+t+" and rank-"+e+" input."})}function Qe(r,t){if(jo(r,t))return null;for(var e=[],n=0;n<t;++n)r.indexOf(n)===-1&&e.push(n);return r.forEach(function(o){return e.push(o)}),e}function wr(r){return r.map(function(t,e){return[e,t]}).sort(function(t,e){return t[1]-e[1]}).map(function(t){return t[0]})}function Je(r,t){for(var e=[],n=t-r;n<t;++n)e.push(n);return e}function Is(r,t){var e=r[0].length;r.forEach(function(o,a){E(o.length===e,function(){return"Error in concat"+e+"D: rank of tensors["+a+"] must be the same as the rank of the rest ("+e+")"})}),E(t>=0&&t<e,function(){return"Error in concat"+e+"D: axis must be between 0 and "+(e-1)+"."});var n=r[0];r.forEach(function(o,a){for(var i=0;i<e;i++)E(i===t||o[i]===n[i],function(){return"Error in concat"+e+"D: Shape of tensors["+a+"] ("+o+") does not match the shape of the rest ("+n+") along the non-concatenated axis "+a+"."})})}function Vn(r,t){for(var e=r[0].slice(),n=1;n<r.length;n++)e[t]+=r[n][t];return e}function T(r){var t=Object.keys(r);if(t.length!==1)throw new Error("Please provide an object with a single key (operation name) mapping to a function. Got an object with "+t.length+" keys.");var e=t[0],n=r[e];e.endsWith("_")&&(e=e.substring(0,e.length-1));var o=function(){for(var a=[],i=0;i<arguments.length;i++)a[i]=arguments[i];D.startScope(e);try{var s=n.apply(void 0,a);return s instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),D.endScope(s),s}catch(u){throw D.endScope(null),u}};return Object.defineProperty(o,"name",{value:e,configurable:!0}),o}Z.registerFlag("HAS_WEBGL",function(){return Z.getNumber("WEBGL_VERSION")>0}),Z.registerFlag("WEBGL_VERSION",function(){return Io(2)?2:Io(1)?1:0}),Z.registerFlag("WEBGL_BUFFER_SUPPORTED",function(){return Z.get("WEBGL_VERSION")===2}),Z.registerFlag("WEBGL_CPU_FORWARD",function(){return!0}),Z.registerFlag("WEBGL_FORCE_F16_TEXTURES",function(){return!1}),Z.registerFlag("WEBGL_PACK",function(){return Z.getBool("HAS_WEBGL")}),Z.registerFlag("WEBGL_PACK_NORMALIZATION",function(){return Z.getBool("WEBGL_PACK")}),Z.registerFlag("WEBGL_PACK_CLIP",function(){return Z.getBool("WEBGL_PACK")}),Z.registerFlag("WEBGL_PACK_DEPTHWISECONV",function(){return!1}),Z.registerFlag("WEBGL_PACK_BINARY_OPERATIONS",function(){return Z.getBool("WEBGL_PACK")}),Z.registerFlag("WEBGL_PACK_UNARY_OPERATIONS",function(){return Z.getBool("WEBGL_PACK")}),Z.registerFlag("WEBGL_PACK_ARRAY_OPERATIONS",function(){return Z.getBool("WEBGL_PACK")}),Z.registerFlag("WEBGL_PACK_IMAGE_OPERATIONS",function(){return Z.getBool("WEBGL_PACK")}),Z.registerFlag("WEBGL_PACK_REDUCE",function(){return Z.getBool("WEBGL_PACK")}),Z.registerFlag("WEBGL_LAZILY_UNPACK",function(){return Z.getBool("WEBGL_PACK")}),Z.registerFlag("WEBGL_CONV_IM2COL",function(){return Z.getBool("WEBGL_PACK")}),Z.registerFlag("WEBGL_MAX_TEXTURE_SIZE",function(){return gs(Z.getNumber("WEBGL_VERSION"))}),Z.registerFlag("WEBGL_MAX_TEXTURES_IN_SHADER",function(){return ys(Z.getNumber("WEBGL_VERSION"))}),Z.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION",function(){var r=Z.getNumber("WEBGL_VERSION");return r===0?0:xs(r)}),Z.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE",function(){return Z.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0&&(r=navigator.userAgent||navigator.vendor||window.opera,!(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(r)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(r.substr(0,4))));var r}),Z.registerFlag("WEBGL_RENDER_FLOAT32_CAPABLE",function(){return bs(Z.getNumber("WEBGL_VERSION"))}),Z.registerFlag("WEBGL_RENDER_FLOAT32_ENABLED",function(){return!Z.getBool("WEBGL_FORCE_F16_TEXTURES")&&Z.getBool("WEBGL_RENDER_FLOAT32_CAPABLE")}),Z.registerFlag("WEBGL_DOWNLOAD_FLOAT_ENABLED",function(){return ws(Z.getNumber("WEBGL_VERSION"))}),Z.registerFlag("WEBGL_FENCE_API_ENABLED",function(){return Cs(Z.getNumber("WEBGL_VERSION"))}),Z.registerFlag("WEBGL_SIZE_UPLOAD_UNIFORM",function(){return Z.getBool("WEBGL_RENDER_FLOAT32_ENABLED")?4:0}),Yi=Ko;var Ae=T({complex_:function(r,t){var e=C(r,"real","complex"),n=C(t,"imag","complex");return fe(e.shape,n.shape,"real and imag shapes, "+e.shape+" and "+n.shape+", must match in call to tf.complex()."),D.runKernelFunc(function(o){return o.complex(e,n)},{$real:e,$imag:n})}}),Ve=T({real_:function(r){var t=C(r,"input","real");return D.runKernelFunc(function(e){return e.real(t)},{$input:t})}}),je=T({imag_:function(r){var t=C(r,"input","imag");return D.runKernelFunc(function(e){return e.imag(t)},{$input:t})}});function Ne(r,t,e){return Dn(r,t,on(r,e),e)}function Dn(r,t,e,n){if(n==null&&(n=pt(r)),n==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(!Fe(r)&&!Array.isArray(r)&&typeof r!="number"&&typeof r!="boolean"&&typeof r!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(t!=null){Go(t);var o=Y(t),a=Y(e);E(o===a,function(){return"Based on the provided shape, ["+t+"], the tensor should have "+o+" values but has "+a});for(var i=0;i<e.length;++i){var s=e[i],u=i!==e.length-1||s!==Y(t.slice(i));E(e[i]===t[i]||!u,function(){return"Error creating a new Tensor. Inferred shape ("+e+") does not match the provided shape ("+t+"). "})}}return Fe(r)||Array.isArray(r)||(r=[r]),t=t||e,r=n!=="string"?zo(r,n,M().getBool("DEBUG")):vn(r,[],!0),D.makeTensor(r,t,n)}function $(r,t){if((Fe(r)&&t!=="string"||Array.isArray(r))&&t!=="complex64")throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if(t==="string"&&Fe(r)&&!(r instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return Dn(r,[],[],t)}function Gn(r,t){Kn(r);var e=on(r,t);if(e.length!==1)throw new Error("tensor1d() requires values to be a flat/TypedArray");return Dn(r,null,e,t)}function zn(r,t,e){if(Kn(r),t!=null&&t.length!==2)throw new Error("tensor2d() requires shape to have two numbers");var n=on(r,e);if(n.length!==2&&n.length!==1)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(n.length===1&&t==null)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return Dn(r,t,n,e)}function Xo(r,t,e){if(Kn(r),t!=null&&t.length!==3)throw new Error("tensor3d() requires shape to have three numbers");var n=on(r,e);if(n.length!==3&&n.length!==1)throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");if(n.length===1&&t==null)throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");return Dn(r,t,n,e)}function bn(r,t,e){if(Kn(r),t!=null&&t.length!==4)throw new Error("tensor4d() requires shape to have four numbers");var n=on(r,e);if(n.length!==4&&n.length!==1)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(n.length===1&&t==null)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return Dn(r,t,n,e)}function ks(r,t,e){if(Kn(r),t!=null&&t.length!==5)throw new Error("tensor5d() requires shape to have five numbers");var n=on(r,e);if(n.length!==5&&n.length!==1)throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");if(n.length===1&&t==null)throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");return Dn(r,t,n,e)}function Ss(r,t,e){if(Kn(r),t!=null&&t.length!==6)throw new Error("tensor6d() requires shape to have six numbers");var n=on(r,e);if(n.length!==6&&n.length!==1)throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");if(n.length===1&&t==null)throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");return Dn(r,t=t||n,n,e)}function As(r,t,e,n){return t===void 0&&(t=!0),D.makeVariable(r,t,e,n)}function jn(r,t){if(t===void 0&&(t="float32"),t==="complex64"){var e=jn(r,"float32"),n=ye(r,"float32");return Ae(e,n)}var o=Vo(Y(r),t);return D.makeTensor(o,r,t)}function ye(r,t){if(t===void 0&&(t="float32"),t==="complex64"){var e=ye(r,"float32"),n=ye(r,"float32");return Ae(e,n)}var o=vt(Y(r),t);return D.makeTensor(o,r,t)}function Cr(r,t,e){return D.runKernelFunc(function(n){return n.fill(r,t,e)},{})}function Ds(r,t,e){if(e<=0)throw new Error("The number of values should be positive.");return D.runKernelFunc(function(n){return n.linspace(r,t,e)},{})}function Bt(r,t,e,n){if(e===void 0&&(e=1),n===void 0&&(n="float32"),e===0)throw new Error("Cannot have a step of zero");if(r===t||r<t&&e<0||t<r&&e>1)return ye([0],n);var o=vt(Math.abs(Math.ceil((t-r)/e)),n);t<r&&e===1&&(e=-1),o[0]=r;for(var a=1;a<o.length;a++)o[a]=o[a-1]+e;return Gn(o,n)}var Yo=T({onesLike_:function(r){var t=C(r,"x","onesLike");if(t.dtype==="complex64"){var e=Yo(Ve(t)),n=ue(je(t));return Ae(e,n)}return D.runKernelFunc(function(o){return o.onesLike(t)},{$x:t},function(o,a){return{$x:function(){return ue(o)}}})}}),ue=T({zerosLike_:function(r){var t=C(r,"x","zerosLike");return D.runKernelFunc(function(e){return e.zerosLike(t)},{$x:t},function(e,n){return{$x:function(){return ue(e)}}})}}),Ye=T({concat_:function(r,t){t===void 0&&(t=0),E(r.length>=1,function(){return"Pass at least one tensor to concat"});var e=Mt(r,"tensors","concat");e[0].dtype==="complex64"&&e.forEach(function(s){if(s.dtype!=="complex64")throw new Error(`Cannot concatenate complex64 tensors with a tensor
          with dtype `+s.dtype+". ")}),t=ke(t,e[0].shape)[0];var n=Vn(e.map(function(s){return s.shape}),t);if(Y(n)===0)return Ne([],n);if((e=e.filter(function(s){return s.size>0})).length===1)return e[0];var o=e.map(function(s){return s.shape});Is(o,t);var a=e,i={axis:t};return D.runKernelFunc(function(s){return s.concat(e,t)},a,function(s){var u=o.map(function(l){return l[t]});return Er(s,u,t).map(function(l){return function(){return l}})},"Concat",i)}}),Ts=T({concat1d_:function(r){return Ye(r,0)}}),Ns=T({concat2d_:function(r,t){return Ye(r,t)}}),Fs=T({concat3d_:function(r,t){return Ye(r,t)}}),_s=T({concat4d_:function(r,t){return Ye(r,t)}}),Er=T({split_:function(r,t,e){e===void 0&&(e=0);var n,o=C(r,"x","split");return e=ke(e,o.shape)[0],typeof t=="number"?(E(o.shape[e]%t==0,function(){return"Number of splits must evenly divide the axis."}),n=new Array(t).fill(o.shape[e]/t)):(E(o.shape[e]===t.reduce(function(a,i){return a+i}),function(){return"The sum of sizes must match the size of the axis dimension."}),n=t),D.runKernelFunc(function(a){return a.split(o,n,e)},{$x:o},function(a){return{$x:function(){return Ye(a,e)}}})}});function Xn(r,t){return r(t={exports:{}},t.exports),t.exports}var $f=Xn(function(r){(function(t,e,n){function o(s){var u,l=this,c=(u=4022871197,function(f){f=f.toString();for(var h=0;h<f.length;h++){var d=.02519603282416938*(u+=f.charCodeAt(h));d-=u=d>>>0,u=(d*=u)>>>0,u+=4294967296*(d-=u)}return 23283064365386963e-26*(u>>>0)});l.next=function(){var f=2091639*l.s0+23283064365386963e-26*l.c;return l.s0=l.s1,l.s1=l.s2,l.s2=f-(l.c=0|f)},l.c=1,l.s0=c(" "),l.s1=c(" "),l.s2=c(" "),l.s0-=c(s),l.s0<0&&(l.s0+=1),l.s1-=c(s),l.s1<0&&(l.s1+=1),l.s2-=c(s),l.s2<0&&(l.s2+=1),c=null}function a(s,u){return u.c=s.c,u.s0=s.s0,u.s1=s.s1,u.s2=s.s2,u}function i(s,u){var l=new o(s),c=u&&u.state,f=l.next;return f.int32=function(){return 4294967296*l.next()|0},f.double=function(){return f()+11102230246251565e-32*(2097152*f()|0)},f.quick=f,c&&(typeof c=="object"&&a(c,l),f.state=function(){return a(l,{})}),f}e&&e.exports?e.exports=i:this.alea=i})(0,r)}),Qf=Xn(function(r){(function(t,e,n){function o(s){var u=this,l="";u.x=0,u.y=0,u.z=0,u.w=0,u.next=function(){var f=u.x^u.x<<11;return u.x=u.y,u.y=u.z,u.z=u.w,u.w^=u.w>>>19^f^f>>>8},s===(0|s)?u.x=s:l+=s;for(var c=0;c<l.length+64;c++)u.x^=0|l.charCodeAt(c),u.next()}function a(s,u){return u.x=s.x,u.y=s.y,u.z=s.z,u.w=s.w,u}function i(s,u){var l=new o(s),c=u&&u.state,f=function(){return(l.next()>>>0)/4294967296};return f.double=function(){do var h=((l.next()>>>11)+(l.next()>>>0)/4294967296)/2097152;while(h===0);return h},f.int32=l.next,f.quick=f,c&&(typeof c=="object"&&a(c,l),f.state=function(){return a(l,{})}),f}e&&e.exports?e.exports=i:this.xor128=i})(0,r)}),Jf=Xn(function(r){(function(t,e,n){function o(s){var u=this,l="";u.next=function(){var f=u.x^u.x>>>2;return u.x=u.y,u.y=u.z,u.z=u.w,u.w=u.v,(u.d=u.d+362437|0)+(u.v=u.v^u.v<<4^f^f<<1)|0},u.x=0,u.y=0,u.z=0,u.w=0,u.v=0,s===(0|s)?u.x=s:l+=s;for(var c=0;c<l.length+64;c++)u.x^=0|l.charCodeAt(c),c==l.length&&(u.d=u.x<<10^u.x>>>4),u.next()}function a(s,u){return u.x=s.x,u.y=s.y,u.z=s.z,u.w=s.w,u.v=s.v,u.d=s.d,u}function i(s,u){var l=new o(s),c=u&&u.state,f=function(){return(l.next()>>>0)/4294967296};return f.double=function(){do var h=((l.next()>>>11)+(l.next()>>>0)/4294967296)/2097152;while(h===0);return h},f.int32=l.next,f.quick=f,c&&(typeof c=="object"&&a(c,l),f.state=function(){return a(l,{})}),f}e&&e.exports?e.exports=i:this.xorwow=i})(0,r)}),Zf=Xn(function(r){(function(t,e,n){function o(s){var u=this;u.next=function(){var l,c,f=u.x,h=u.i;return l=f[h],c=(l^=l>>>7)^l<<24,c^=(l=f[h+1&7])^l>>>10,c^=(l=f[h+3&7])^l>>>3,c^=(l=f[h+4&7])^l<<7,l=f[h+7&7],c^=(l^=l<<13)^l<<9,f[h]=c,u.i=h+1&7,c},function(l,c){var f,h=[];if(c===(0|c))h[0]=c;else for(c=""+c,f=0;f<c.length;++f)h[7&f]=h[7&f]<<15^c.charCodeAt(f)+h[f+1&7]<<13;for(;h.length<8;)h.push(0);for(f=0;f<8&&h[f]===0;++f);for(f==8?h[7]=-1:h[f],l.x=h,l.i=0,f=256;f>0;--f)l.next()}(u,s)}function a(s,u){return u.x=s.x.slice(),u.i=s.i,u}function i(s,u){s==null&&(s=+new Date);var l=new o(s),c=u&&u.state,f=function(){return(l.next()>>>0)/4294967296};return f.double=function(){do var h=((l.next()>>>11)+(l.next()>>>0)/4294967296)/2097152;while(h===0);return h},f.int32=l.next,f.quick=f,c&&(c.x&&a(c,l),f.state=function(){return a(l,{})}),f}e&&e.exports?e.exports=i:this.xorshift7=i})(0,r)}),eh=Xn(function(r){(function(t,e,n){function o(s){var u=this;u.next=function(){var l,c,f=u.w,h=u.X,d=u.i;return u.w=f=f+1640531527|0,c=h[d+34&127],l=h[d=d+1&127],c^=c<<13,l^=l<<17,c^=c>>>15,l^=l>>>12,c=h[d]=c^l,u.i=d,c+(f^f>>>16)|0},function(l,c){var f,h,d,p,m,v=[],g=128;for(c===(0|c)?(h=c,c=null):(c+="\0",h=0,g=Math.max(g,c.length)),d=0,p=-32;p<g;++p)c&&(h^=c.charCodeAt((p+32)%c.length)),p===0&&(m=h),h^=h<<10,h^=h>>>15,h^=h<<4,h^=h>>>13,p>=0&&(m=m+1640531527|0,d=(f=v[127&p]^=h+m)==0?d+1:0);for(d>=128&&(v[127&(c&&c.length||0)]=-1),d=127,p=512;p>0;--p)h=v[d+34&127],f=v[d=d+1&127],h^=h<<13,f^=f<<17,h^=h>>>15,f^=f>>>12,v[d]=h^f;l.w=m,l.X=v,l.i=d}(u,s)}function a(s,u){return u.i=s.i,u.w=s.w,u.X=s.X.slice(),u}function i(s,u){s==null&&(s=+new Date);var l=new o(s),c=u&&u.state,f=function(){return(l.next()>>>0)/4294967296};return f.double=function(){do var h=((l.next()>>>11)+(l.next()>>>0)/4294967296)/2097152;while(h===0);return h},f.int32=l.next,f.quick=f,c&&(c.X&&a(c,l),f.state=function(){return a(l,{})}),f}e&&e.exports?e.exports=i:this.xor4096=i})(0,r)}),nh=Xn(function(r){(function(t,e,n){function o(s){var u=this,l="";u.next=function(){var f=u.b,h=u.c,d=u.d,p=u.a;return f=f<<25^f>>>7^h,h=h-d|0,d=d<<24^d>>>8^p,p=p-f|0,u.b=f=f<<20^f>>>12^h,u.c=h=h-d|0,u.d=d<<16^h>>>16^p,u.a=p-f|0},u.a=0,u.b=0,u.c=-1640531527,u.d=1367130551,s===Math.floor(s)?(u.a=s/4294967296|0,u.b=0|s):l+=s;for(var c=0;c<l.length+20;c++)u.b^=0|l.charCodeAt(c),u.next()}function a(s,u){return u.a=s.a,u.b=s.b,u.c=s.c,u.d=s.d,u}function i(s,u){var l=new o(s),c=u&&u.state,f=function(){return(l.next()>>>0)/4294967296};return f.double=function(){do var h=((l.next()>>>11)+(l.next()>>>0)/4294967296)/2097152;while(h===0);return h},f.int32=l.next,f.quick=f,c&&(typeof c=="object"&&a(c,l),f.state=function(){return a(l,{})}),f}e&&e.exports?e.exports=i:this.tychei=i})(0,r)}),Bn=Xn(function(r){(function(t,e){var n,o=this,a=256,i=6,s="random",u=e.pow(a,i),l=e.pow(2,52),c=2*l,f=a-1;function h(g,y,x){var b=[],w=m(function k(I,S){var F,N=[],W=typeof I;if(S&&W=="object")for(F in I)try{N.push(k(I[F],S-1))}catch{}return N.length?N:W=="string"?I:I+"\0"}((y=y==1?{entropy:!0}:y||{}).entropy?[g,v(t)]:g??function(){try{var k;return n&&(k=n.randomBytes)?k=k(a):(k=new Uint8Array(a),(o.crypto||o.msCrypto).getRandomValues(k)),v(k)}catch{var I=o.navigator,S=I&&I.plugins;return[+new Date,o,S,o.screen,v(t)]}}(),3),b),R=new d(b),A=function(){for(var k=R.g(i),I=u,S=0;k<l;)k=(k+S)*a,I*=a,S=R.g(1);for(;k>=c;)k/=2,I/=2,S>>>=1;return(k+S)/I};return A.int32=function(){return 0|R.g(4)},A.quick=function(){return R.g(4)/4294967296},A.double=A,m(v(R.S),t),(y.pass||x||function(k,I,S,F){return F&&(F.S&&p(F,R),k.state=function(){return p(R,{})}),S?(e[s]=k,I):k})(A,w,"global"in y?y.global:this==e,y.state)}function d(g){var y,x=g.length,b=this,w=0,R=b.i=b.j=0,A=b.S=[];for(x||(g=[x++]);w<a;)A[w]=w++;for(w=0;w<a;w++)A[w]=A[R=f&R+g[w%x]+(y=A[w])],A[R]=y;(b.g=function(k){for(var I,S=0,F=b.i,N=b.j,W=b.S;k--;)I=W[F=f&F+1],S=S*a+W[f&(W[F]=W[N=f&N+I])+(W[N]=I)];return b.i=F,b.j=N,S})(a)}function p(g,y){return y.i=g.i,y.j=g.j,y.S=g.S.slice(),y}function m(g,y){for(var x,b=g+"",w=0;w<b.length;)y[f&w]=f&(x^=19*y[f&w])+b.charCodeAt(w++);return v(y)}function v(g){return String.fromCharCode.apply(0,g)}if(e["seed"+s]=h,m(e.random(),t),r.exports){r.exports=h;try{n=require("crypto")}catch{}}})([],Math)});Bn.alea=$f,Bn.xor128=Qf,Bn.xorwow=Jf,Bn.xorshift7=Zf,Bn.xor4096=eh,Bn.tychei=nh;var Rr=Bn.alea,$o=function(){function r(t,e,n,o,a){this.mean=t,this.stdDev=e,this.dtype=n,this.nextVal=NaN,this.truncated=o,this.truncated&&(this.upper=this.mean+2*this.stdDev,this.lower=this.mean-2*this.stdDev);var i=a||Math.random();this.random=Rr(i.toString())}return r.prototype.nextValue=function(){if(!isNaN(this.nextVal)){var t=this.nextVal;return this.nextVal=NaN,t}for(var e,n,o=!1;!o;){var a=void 0,i=void 0,s=void 0;do s=(a=2*this.random()-1)*a+(i=2*this.random()-1)*i;while(s>=1||s===0);var u=Math.sqrt(-2*Math.log(s)/s);e=this.mean+this.stdDev*a*u,n=this.mean+this.stdDev*i*u,this.truncated&&!this.isValidTruncated(e)||(o=!0)}return this.truncated&&!this.isValidTruncated(n)||(this.nextVal=this.convertValue(n)),this.convertValue(e)},r.prototype.convertValue=function(t){return this.dtype==null||this.dtype==="float32"?t:Math.round(t)},r.prototype.isValidTruncated=function(t){return t<=this.upper&&t>=this.lower},r}(),th=function(){function r(t,e,n,o){this.alpha=t,this.beta=1/e,this.dtype=n;var a=o||Math.random();this.randu=Rr(a.toString()),this.randn=new $o(0,1,n,!1,this.randu()),this.d=t<1?t+2/3:t-1/3,this.c=1/Math.sqrt(9*this.d)}return r.prototype.nextValue=function(){for(var t,e,n,o,a,i;;){do o=this.randn.nextValue(),i=1+this.c*o;while(i<=0);if(i*=i*i,e=1-.331*(t=o*o)*t,n=.5*t+this.d*(1-i+Math.log(i)),(a=this.randu())<e||Math.log(a)<n)break}return i=1/this.beta*this.d*i,this.alpha<1&&(i*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(i)},r.prototype.convertValue=function(t){return this.dtype==="float32"?t:Math.round(t)},r}(),rh=function(){function r(t,e,n,o){var a=this;if(t===void 0&&(t=0),e===void 0&&(e=1),this.canReturnFloat=function(){return a.dtype==null||a.dtype==="float32"},this.min=t,this.range=e-t,this.dtype=n,o==null&&(o=Math.random()),typeof o=="number"&&(o=o.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error("The difference between "+t+" - "+e+" <= 1 and dtype is not float");this.random=Rr(o)}return r.prototype.convertValue=function(t){return this.canReturnFloat()?t:Math.round(t)},r.prototype.nextValue=function(){return this.convertValue(this.min+this.range*this.random())},r}();function ee(r,t,e){return t===void 0&&(t="float32"),t=t||"float32",Go(r),new ht(r,t,e)}function Os(r,t){t===void 0&&(t=!1),console.log(r.toString(t))}var Qo=T({batchToSpaceND_:function(r,t,e){var n=C(r,"x","batchToSpaceND"),o=t.reduce(function(a,i){return a*i});return E(n.rank>=1+t.length,function(){return"input rank is "+n.rank+" but should be > than blockShape.length "+t.length}),E(e.length===t.length,function(){return"crops.length is "+e.length+" but should be equal to blockShape.length  "+t.length}),E(n.shape[0]%o==0,function(){return"input tensor batch is "+n.shape[0]+" but is not divisible by the product of the elements of blockShape "+t.join(" * ")+" === "+o}),D.runKernelFunc(function(a){return a.batchToSpaceND(n,t,e)},{$x:n},function(a){return{$x:function(){return a.spaceToBatchND(t,e)}}})}}),Ms=T({broadcastTo_:function(r,t){var e=C(r,"broadcastTo","x"),n=e.shape;if(t.some(function(u){return!(u>0)||u%1!=0}))throw new Error("broadcastTo(): Invalid broadcast shape ["+t+"].");if(t.length<e.rank)throw new Error("broadcastTo(): shape.length="+t.length+" < input.rank="+e.rank+".");if(t.length>e.rank){for(var o=e.shape.slice();o.length<t.length;)o.unshift(1);e=e.reshape(o)}for(var a=Array.from(t),i=t.length-1;i>=0;i--)if(e.shape[i]===t[i])a[i]=1;else if(e.shape[i]!==1)throw new Error("broadcastTo(): ["+n+"] cannot be broadcast to ["+t+"].");var s=a.map(function(u,l){return u>1?l:-1}).filter(function(u){return u>=0});return s.length===0?e.clone():D.runKernelFunc(function(u){return u.tile(e,a)},{input:e},function(u){return{input:function(){return u.sum(s,!0)}}})}}),Bs=T({cast_:function(r,t){var e=C(r,"x","cast");if(!zi(t))throw new Error("Failed to cast to unknown dtype "+t);if(t==="string"&&e.dtype!=="string"||t!=="string"&&e.dtype==="string")throw new Error("Only strings can be casted to strings");var n={dtype:t};return D.runKernelFunc(function(o){return o.cast(e,t)},{x:e},function(o){return{x:function(){return o.clone()}}},"Cast",n)}}),Ps=T({clone_:function(r){var t=C(r,"x","clone",null);return D.runKernelFunc(function(){return D.makeTensorFromDataId(t.dataId,t.shape,t.dtype)},{$x:t},function(e){return{$x:function(){return e.toFloat()}}})}}),Ls=T({cumsum_:function(r,t,e,n){t===void 0&&(t=0),e===void 0&&(e=!1),n===void 0&&(n=!1);var o=C(r,"x","cumsum"),a=Qe([t|=0],o.rank),i=o;a!=null&&(i=o.transpose(a));var s=Je(1,o.rank)[0],u=D.runKernelFunc(function(l){return l.cumsum(i,s,e,n)},{permutedX:i},function(l){return{permutedX:function(){return l.cumsum(t,e,!n)}}});return a!=null&&(u=u.transpose(a)),u}}),Ws=T({depthToSpace_:function(r,t,e){e===void 0&&(e="NHWC");var n=C(r,"x","depthToSpace"),o=e==="NHWC"?n.shape[1]:n.shape[2],a=e==="NHWC"?n.shape[2]:n.shape[3],i=e==="NHWC"?n.shape[3]:n.shape[1];return E(o*t>=0,function(){return`Negative dimension size caused by overflow when multiplying
      `+o+" and "+t+`  for depthToSpace with input shape
      `+n.shape}),E(a*t>=0,function(){return`Negative dimension size caused by overflow when multiplying
      `+a+" and "+t+` for depthToSpace with input shape
          `+n.shape}),E(i%(t*t)==0,function(){return"Dimension size must be evenly divisible by "+t*t+" but is "+i+" for depthToSpace with input shape "+n.shape}),D.runKernelFunc(function(s){return s.depthToSpace(n,t,e)},{$x:n})}}),hn=T({expandDims_:function(r,t){t===void 0&&(t=0);var e=C(r,"x","expandDims",null);E(t<=e.rank,function(){return"Axis must be <= rank of the tensor"});var n=e.shape.slice();return t<0&&(E(-(e.rank+1)<=t,function(){return"Axis must be in the interval ["+-(e.rank+1)+", "+e.rank+"]"}),t=e.rank+t+1),n.splice(t,0,1),Ir(e,n)}}),Jo=T({eye_:function(r,t,e,n){n===void 0&&(n="float32"),t==null&&(t=r);for(var o=ee([r,t],n),a=r<=t?r:t,i=0;i<a;++i)o.set(1,i,i);var s=o.toTensor().as2D(r,t);if(e==null)return s;if(e.length===1)return at(hn(s,0),[e[0],1,1]);if(e.length===2)return at(hn(hn(s,0),0),[e[0],e[1],1,1]);if(e.length===3)return at(hn(hn(hn(s,0),0),0),[e[0],e[1],e[2],1,1]);throw new Error("eye() currently supports only 1D and 2D batchShapes, but received "+e.length+"D.")}}),Us=T({multinomial_:function(r,t,e,n){n===void 0&&(n=!1);var o=C(r,"logits","multinomial"),a=o.size,i=o.rank;if(a<2)throw new Error("Error in multinomial: you need at least 2 outcomes, but got "+a+".");if(i>2)throw new Error("Rank of probabilities must be 1 or 2, but is "+i);e=e||Math.random();var s=i===1?o.as2D(1,-1):o,u=D.runKernelFunc(function(l){return l.multinomial(s,n,t,e)},{logits2D:s});return i===1?u.as1D():u}}),dr=T({oneHot_:function(r,t,e,n){if(e===void 0&&(e=1),n===void 0&&(n=0),t<2)throw new Error("Error in oneHot: depth must be >=2, but it is "+t);var o=C(r,"indices","oneHot","int32"),a=o.shape.concat([t]);return o=o.flatten(),D.runKernelFunc(function(i){return i.oneHot(o,t,e,n)},{$indices:o},function(i){return{$indices:function(){return ye(o.shape,"float32")}}}).reshape(a)}}),mt=T({pad_:function(r,t,e){e===void 0&&(e=0);var n=C(r,"x","pad");if(n.rank===0)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");var o={paddings:t,constantValue:e};return D.runKernelFunc(function(a){return a.pad(n,t,e)},{x:n},function(a){var i=t.map(function(s){return s[0]});return{x:function(){return a.slice(i,n.shape)}}},"PadV2",o)}}),zs=T({pad1d_:function(r,t,e){return e===void 0&&(e=0),E(t.length===2,function(){return"Invalid number of paddings. Must be length of 2."}),mt(r,[t],e)}}),Vs=T({pad2d_:function(r,t,e){return e===void 0&&(e=0),E(t.length===2&&t[0].length===2&&t[1].length===2,function(){return"Invalid number of paddings. Must be length of 2 each."}),mt(r,t,e)}}),Gs=T({pad3d_:function(r,t,e){return e===void 0&&(e=0),E(t.length===3&&t[0].length===2&&t[1].length===2&&t[2].length===2,function(){return"Invalid number of paddings. Must be length of 2 each."}),mt(r,t,e)}}),Hs=T({pad4d_:function(r,t,e){return e===void 0&&(e=0),E(t.length===4&&t[0].length===2&&t[1].length===2&&t[2].length===2&&t[3].length===2,function(){return"Invalid number of paddings. Must be length of 2 each."}),mt(r,t,e)}}),qs=T({rand_:function(r,t,e){var n=Y(r),o=null;if(e==null||e==="float32")o=new Float32Array(n);else if(e==="int32")o=new Int32Array(n);else{if(e!=="bool")throw new Error("Unknown data type "+e);o=new Uint8Array(n)}for(var a=0;a<n;a++)o[a]=t();return D.makeTensor(o,r,e)}}),Ks=T({randomNormal_:function(r,t,e,n,o){if(t===void 0&&(t=0),e===void 0&&(e=1),n!=null&&n==="bool")throw new Error("Unsupported data type "+n);for(var a=new $o(t,e,n,!1,o),i=ee(r,n),s=0;s<i.values.length;s++)i.values[s]=a.nextValue();return i.toTensor()}}),js=T({randomGamma_:function(r,t,e,n,o){if(e===void 0&&(e=1),n===void 0&&(n="float32"),e==null&&(e=1),n==null&&(n="float32"),n!=="float32"&&n!=="int32")throw new Error("Unsupported data type "+n);for(var a=new th(t,e,n,o),i=ee(r,n),s=0;s<i.values.length;s++)i.values[s]=a.nextValue();return i.toTensor()}}),Zo=T({randomUniform_:function(r,t,e,n,o){t===void 0&&(t=0),e===void 0&&(e=1),n===void 0&&(n="float32");for(var a=ee(r,n),i=new rh(t,e,null,o),s=0;s<a.values.length;s++)a.values[s]=i.nextValue();return a.toTensor()}}),Ir=T({reshape_:function(r,t){var e=C(r,"x","reshape",null);t=Wi(t,e.size),E(e.size===Y(t),function(){return"new shape and old shape must have the same number of elements."});var n={shape:t};return D.runKernelFunc(function(o){return o.reshape(e,t)},{x:e},function(o){return{x:function(){return o.reshape(e.shape)}}},"Reshape",n)}}),ea=T({spaceToBatchND_:function(r,t,e){var n=C(r,"x","spaceToBatchND");return E(n.rank>=1+t.length,function(){return"input rank "+n.rank+" should be > than [blockShape] "+t.length}),E(e.length===t.length,function(){return"paddings.shape[0] "+e.length+" must be equal to [blockShape] "+t.length}),E(n.shape.reduce(function(o,a,i){return i>0&&i<=t.length?o&&(a+e[i-1][0]+e[i-1][1])%t[i-1]==0:o},!0),function(){return"input spatial dimensions "+n.shape.slice(1)+" with paddings "+e.toString()+" must be divisible by blockShapes "+t.toString()}),D.runKernelFunc(function(o){return o.spaceToBatchND(n,t,e)},{$x:n},function(o){return{$x:function(){return o.batchToSpaceND(t,e)}}})}}),na=T({squeeze_:function(r,t){var e=C(r,"x","squeeze");return Ir(e,wn(e.shape,t).newShape)}}),kn=T({stack_:function(r,t){t===void 0&&(t=0);var e=Mt(r,"tensors","stack");if(E(e.length>=1,function(){return"Pass at least one tensor to tf.stack"}),e.length===1)return e[0].expandDims(t);var n=e[0].rank,o=e[0].shape,a=e[0].dtype;E(t<=n,function(){return"Axis must be <= rank of the tensor"}),e.forEach(function(s){fe(o,s.shape,"All tensors passed to stack must have matching shapes")}),e.forEach(function(s){E(a===s.dtype,function(){return"All tensors passed to stack must have matching dtypes"})});var i=e.map(function(s){return s.expandDims(t)});return Ye(i,t)}}),at=T({tile_:function(r,t){var e=C(r,"x","tile",null);E(e.rank===t.length,function(){return"Error in transpose: rank of input "+e.rank+" must match length of reps "+t+"."});var n=[e],o={reps:t};return D.runKernelFunc(function(a,i){var s=a.tile(e,t);return i([e]),s},{x:e},function(a,i){var s=i[0];return{x:function(){var u=ue(s);if(s.rank===1)for(var l=0;l<t[0];++l)u=u.add(a.slice([l*s.shape[0]],[s.shape[0]]));else if(s.rank===2)for(l=0;l<t[0];++l)for(var c=0;c<t[1];++c)u=u.add(a.slice([l*s.shape[0],c*s.shape[1]],[s.shape[0],s.shape[1]]));else if(s.rank===3)for(l=0;l<t[0];++l)for(c=0;c<t[1];++c)for(var f=0;f<t[2];++f)u=u.add(a.slice([l*s.shape[0],c*s.shape[1],f*s.shape[2]],[s.shape[0],s.shape[1],s.shape[2]]));else{if(s.rank!==4)throw new Error("Gradient for tile operation is not implemented for rank-"+s.rank+" tensors yet.");for(l=0;l<t[0];++l)for(c=0;c<t[1];++c)for(f=0;f<t[2];++f)for(var h=0;h<t[3];++h)u=u.add(a.slice([l*s.shape[0],c*s.shape[1],f*s.shape[2],h*s.shape[3]],[s.shape[0],s.shape[1],s.shape[2],s.shape[3]]))}return u}}},"Tile",o,n)}}),Xs=T({truncatedNormal_:function(r,t,e,n,o){if(t===void 0&&(t=0),e===void 0&&(e=1),n!=null&&n==="bool")throw new Error("Unsupported data type "+n);for(var a=new $o(t,e,n,!0,o),i=ee(r,n),s=0;s<i.values.length;s++)i.values[s]=a.nextValue();return i.toTensor()}}),kr=T({unstack_:function(r,t){t===void 0&&(t=0),t=t||0;var e=C(r,"x","unstack");E(t>=-e.shape.length&&t<e.shape.length,function(){return"Axis = "+t+" is not in [-"+e.shape.length+", "+e.shape.length+")"}),t<0&&(t+=e.shape.length);var n={axis:t};return D.runKernelFunc(function(o){return o.unstack(e,t)},{x:e},function(o){return{x:function(){return kn(o,t)}}},"Unpack",n)}}),Ys=function(r,t){return j(this,void 0,void 0,function(){var e,n,o,a,i,s,u,l,c,f;return X(this,function(h){switch(h.label){case 0:return e=C(r,"x","setdiff1d"),n=C(t,"y","setdiff1d"),E(e.dtype===n.dtype,function(){return"x and y should have the same dtype, but got x ("+e.dtype+") and y ("+n.dtype+")."}),E(e.rank===1,function(){return"x should be 1D tensor, but got x ("+e.shape+")."}),E(n.rank===1,function(){return"y should be 1D tensor, but got y ("+n.shape+")."}),[4,e.data()];case 1:return o=h.sent(),[4,n.data()];case 2:for(a=h.sent(),i=new Set(a),s=0,c=0;c<o.length;c++)i.has(o[c])||s++;for(u=new ht([s],e.dtype),l=new ht([s],"int32"),c=0,f=0;c<o.length;c++)i.has(o[c])||(u.values[f]=o[c],l.values[f]=c,f++);return[2,[u.toTensor(),l.toTensor()]]}})})};function pr(r,t,e,n){n===void 0&&(n=!0);var o=[];if(n)(o=o.concat(t.slice(0))).push(r[0]/e),o=o.concat(r.slice(1));else{o=o.concat(r[0]);for(var a=t.length,i=0;i<a;++i)o=o.concat([r[i+1]/t[i],t[i]]);o=o.concat(r.slice(a+1))}return o}function vr(r,t,e){e===void 0&&(e=!0);var n=[];if(e){n.push(t);for(var o=t+1;o<r;++o)o<=2*t?(n.push(o),n.push(o-(t+1))):n.push(o)}else{var a=[],i=[];for(o=1;o<r;++o)o>=2*t+1||o%2==1?i.push(o):a.push(o);n.push.apply(n,a),n.push(0),n.push.apply(n,i)}return n}function mr(r,t,e,n){n===void 0&&(n=!0);var o=[];n?o.push(r[0]/e):o.push(r[0]*e);for(var a=1;a<r.length;++a)a<=t.length?n?o.push(t[a-1]*r[a]):o.push(r[a]/t[a-1]):o.push(r[a]);return o}function $s(r,t){for(var e=[0],n=0;n<t;++n)e.push(r[n][0]);return e}function Qs(r,t,e){for(var n=r.slice(0,1),o=0;o<e;++o)n.push(r[o+1]-t[o][0]-t[o][1]);return n}function ta(r,t){if(r.rank<1)throw new Error("tf.gatherND() expects the input to be rank 1 or higher, but the rank was "+r.rank+".");if(t.rank<1)throw new Error("tf.gatherND() expects the indices to be rank 1 or higher, but the rank was "+t.rank+".");if(t.dtype!=="int32")throw new Error("tf.gatherND() expects the indices to be int32 type, but the dtype was "+t.dtype+".");if(t.shape[t.rank-1]>r.rank)throw new Error("index innermost dimension length must be <= tensor rank; saw: "+t.shape[t.rank-1]+" vs. "+r.rank);if(r.size===0)throw new Error("Requested more than 0 entries, but input is empty. Input shape: "+r.shape+".");for(var e=t.shape,n=e[e.length-1],o=1,a=0;a<e.length-1;++a)o*=e[a];var i=r.shape,s=e.slice();s.pop();var u=1;for(a=n;a<r.rank;++a)u*=i[a],s.push(i[a]);var l=Xe(r.shape).map(function(c){return c/u}).concat([1]).slice(0,n);return[s,o,u,l]}var oh=Object.freeze({prepareAndValidate:ta}),ra=30;function sr(r){return r<=ra?r:fr(r,Math.floor(Math.sqrt(r)))}function Js(r,t,e){var n=t.rank>1?t.shape[t.rank-1]:1,o=t.rank>1?t.rank-1:1,a="Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: "+e.shape+", indices.shape: "+t.shape+", shape: "+r+", sliceDim: "+n+", and batchDim: "+o+".";if(e.rank<o)throw new Error(a+" update.rank < "+o+". ");if(r.length<n+(e.rank-o))throw new Error(a+" Output shape length < "+(n+(e.rank-o)));if(e.rank!==o+r.length-n)throw new Error(a+" update.rank != "+(o+r.length-n));for(var i=0;i<o;++i)if(e.shape[i]!==t.shape[i])throw new Error(a+" updates.shape["+i+"] ("+e.shape[i]+") != indices.shape["+i+"] ("+t.shape[i]+").");for(i=0;i<e.rank-o;++i)if(e.shape[i+o]!==r[i+n])throw new Error(a+" updates.shape["+(i+o)+"] ("+e.shape[i+o]+") != shape["+(i+o)+"] ("+r[i+o]+")")}function Zs(r,t,e){if(t.rank<1)throw new Error("tf.scatterND() expects the indices to be rank 1 or higher, but the rank was "+t.rank+".");if(r.rank<1)throw new Error("tf.scatterND() expects the updates to be rank 1 or higher, but the rank was "+r.rank+".");if(t.dtype!=="int32")throw new Error("The dtype of 'indices' should be int32, but got dtype: "+t.dtype);if(e.length<1)throw new Error("Output rank must be greater or equal to 1, but got shape: "+e);if(e.length===0){if(t.size===0)throw new Error("Indices specified for empty output. indices shape: "+t.shape);if(r.size===0)throw new Error("Updates specified for empty output. updates shape: "+r.shape)}Js(e,t,r)}function Pt(r,t,e){for(var n=t.shape.length,o=n>1?t.shape[n-1]:1,a=e.length,i=1,s=o;s<a;++s)i*=e[s];var u=o<1?1:o;return{sliceRank:o,numUpdates:Y(t.shape)/u,sliceSize:i,strides:Xe(e.slice(0,o)).concat([1]),outputSize:Y(e)}}var ah=Object.freeze({validateUpdateShape:Js,validateInput:Zs,calculateShapes:Pt});function eu(r,t,e){E(r.rank===t.length,function(){return"Error in slice"+r.rank+"D: Length of begin "+t+" must match the rank of the array ("+r.rank+")."}),E(r.rank===e.length,function(){return"Error in slice"+r.rank+"D: Length of size "+e+" must match the rank of the array ("+r.rank+")."});for(var n=function(a){E(t[a]+e[a]<=r.shape[a],function(){return"Error in slice"+r.rank+"D: begin["+a+"] + size["+a+"] ("+(t[a]+e[a])+") would overflow input.shape["+a+"] ("+r.shape[a]+")"})},o=0;o<r.rank;++o)n(o)}function So(r){for(var t=[],e=0;r>0;)1&r&&t.push(e),r/=2,e++;return t}function Sr(r,t,e){for(var n=[],o=0;o<r.length;o++)n[o]=Math.ceil((t[o]-r[o])/e[o]);return n}function nu(r,t,e,n,o){var a=t[o],i=e[o]||1;(r&1<<o||a==null)&&(a=i>0?Number.MIN_SAFE_INTEGER:Number.MAX_SAFE_INTEGER);var s=n[o];return a<0&&(a+=s),a=lr(0,a,s-1)}function tu(r,t,e,n,o){var a=t[o],i=e[o]||1;(r&1<<o||a==null)&&(a=i>0?Number.MAX_SAFE_INTEGER:Number.MIN_SAFE_INTEGER);var s=n[o];return a<0&&(a+=s),a=i>0?lr(0,a,s):lr(-1,a,s-1)}function oa(r,t,e){for(var n=e.length,o=0;o<e.length;o++)if(e[o]>1){n=o;break}for(o=n+1;o<e.length;o++)if(t[o]>0||e[o]!==r[o])return!1;return!0}function aa(r,t){for(var e=r.length>0?r[r.length-1]:1,n=0;n<r.length-1;n++)e+=r[n]*t[n];return e}var ih=Object.freeze({assertParamsValid:eu,maskToAxes:So,computeOutShape:Sr,startForAxis:nu,stopForAxis:tu,isSliceContinous:oa,computeFlatOffset:aa});function sh(r){return E(In(r),function(){return"The f passed in grad(f) must be a function"}),function(t,e){var n=C(t,"x","tf.grad",null),o=e!=null?C(e,"dy","tf.grad"):null;return D.tidy(function(){var a=D.gradients(function(){return r(n)},[n],o),i=a.value,s=a.grads;return o!=null&&fe(i.shape,o.shape,"The shape of dy passed in grad(f)(x, dy) must match the shape returned by f(x)"),Ar(s),s[0]})}}function uh(r){return E(In(r),function(){return"The f passed in grads(f) must be a function"}),function(t,e){E(Array.isArray(t),function(){return"The args passed in grads(f)(args) must be an array of `Tensor`s or `TensorLike`s"});var n=Mt(t,"args","tf.grads",null),o=e!=null?C(e,"dy","tf.grads"):null;return D.tidy(function(){var a=D.gradients(function(){return r.apply(void 0,n)},n,o),i=a.value,s=a.grads;return o!=null&&fe(i.shape,o.shape,"The shape of dy passed in grads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),Ar(s),s})}}function lh(r){return E(In(r),function(){return"The f passed in valueAndGrad(f) must be a function"}),function(t,e){E(t instanceof Se,function(){return"The x passed in valueAndGrad(f)(x) must be a tensor"}),E(e==null||e instanceof Se,function(){return"The dy passed in valueAndGrad(f)(x, dy) must be a tensor"});var n=D.gradients(function(){return r(t)},[t],e),o=n.grads,a=n.value;return Ar(o),{grad:o[0],value:a}}}function ch(r){return E(In(r),function(){return"The f passed in valueAndGrads(f) must be a function"}),function(t,e){E(Array.isArray(t)&&t.every(function(o){return o instanceof Se}),function(){return"The args passed in valueAndGrads(f)(args) must be array of tensors"}),E(e==null||e instanceof Se,function(){return"The dy passed in valueAndGrads(f)(args, dy) must be a tensor"});var n=D.gradients(function(){return r.apply(void 0,t)},t,e);return e!=null&&fe(n.value.shape,e.shape,"The shape of dy passed in valueAndGrads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),Ar(n.grads),n}}function ru(r,t){E(In(r),function(){return"The f passed in variableGrads(f) must be a function"}),E(t==null||Array.isArray(t)&&t.every(function(c){return c instanceof Nt}),function(){return"The varList passed in variableGrads(f, varList) must be an array of variables"});var e=t!=null;if(!e)for(var n in t=[],D.registeredVariables)t.push(D.registeredVariables[n]);var o=e?t.filter(function(c){return!c.trainable}):null,a=t.length;E((t=t.filter(function(c){return c.trainable})).length>0,function(){return"variableGrads() expects at least one of the input variables to be trainable, but none of the "+a+" variables is trainable."});var i=D.gradients(r,t,null,!0),s=i.value,u=i.grads;E(u.some(function(c){return c!=null}),function(){return"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize()."}),E(s.rank===0,function(){return"The f passed in variableGrads(f) must return a scalar, but it returned a rank-"+s.rank+" tensor"});var l={};return t.forEach(function(c,f){u[f]!=null&&(l[c.name]=u[f])}),o!=null&&o.forEach(function(c){return l[c.name]=null}),{value:s,grads:l}}function Ht(r){return D.customGrad(r)}function Ar(r){if(r.filter(function(t){return t==null}).length>0)throw new Error(`Cannot compute gradient of y=f(x) with respect to x. Make sure that
    the f you passed encloses all operations that lead from x to y.`)}var Dr=T({softmax_:function(r,t){t===void 0&&(t=-1);var e=C(r,"logits","softmax","float32");if(t===-1&&(t=e.rank-1),t!==e.rank-1)throw Error("Softmax along a non-last dimension is not yet supported. Logits was rank "+e.rank+" and dim was "+t);return D.runKernelFunc(function(n,o){var a=n.softmax(e,t);return o([a]),a},{logits:e},function(n,o){var a=o[0],i=n.mul(a);return{logits:function(){return i.sub(i.sum([t],!0).mul(a))}}},"Softmax",{dim:t},[],[!0])}}),ou=T({logSoftmax_:function(r,t){t===void 0&&(t=-1);var e=C(r,"logits","logSoftmax");if(t===-1&&(t=e.rank-1),t!==e.rank-1)throw Error("Log Softmax along a non-last dimension is not yet supported. Logits was rank "+e.rank+" and axis was "+t);return Ht(function(n,o){var a=n.max(t,!0),i=n.sub(a),s=i.toFloat().sub(i.exp().sum(t,!0).log());return o([s]),{value:s,gradFunc:function(u,l){var c=l[0].exp();return u.sub(u.sum(t,!0).mul(c))}}})(e)}}),ia=function(){function r(t,e){this.backend=t,this.dataMover=e,this.data=new WeakMap,this.dataIdsCount=0}return r.prototype.get=function(t){return this.data.has(t)||this.dataMover.moveData(this.backend,t),this.data.get(t)},r.prototype.set=function(t,e){this.dataIdsCount++,this.data.set(t,e)},r.prototype.has=function(t){return this.data.has(t)},r.prototype.delete=function(t){return this.dataIdsCount--,this.data.delete(t)},r.prototype.numDataIds=function(){return this.dataIdsCount},r}(),sa=function(){function r(){}return r.prototype.time=function(t){return _("time")},r.prototype.read=function(t){return _("read")},r.prototype.readSync=function(t){return _("readSync")},r.prototype.numDataIds=function(){return _("numDataIds")},r.prototype.disposeData=function(t){return _("disposeData")},r.prototype.write=function(t,e,n){return _("write")},r.prototype.move=function(t,e,n,o){return _("move")},r.prototype.memory=function(){return _("memory")},r.prototype.floatPrecision=function(){return _("floatPrecision")},r.prototype.epsilon=function(){return this.floatPrecision()===32?1e-7:1e-4},r.prototype.batchMatMul=function(t,e,n,o){return _("batchMatMul")},r.prototype.fusedBatchMatMul=function(t){return t.a,t.b,t.transposeA,t.transposeB,t.bias,t.activation,t.preluActivationWeights,_("fusedBatchMatMul")},r.prototype.slice=function(t,e,n){return _("slice")},r.prototype.stridedSlice=function(t,e,n,o){return _("stridedSlice")},r.prototype.unstack=function(t,e){return _("unstack")},r.prototype.reverse=function(t,e){return _("reverse")},r.prototype.concat=function(t,e){return _("concat")},r.prototype.neg=function(t){return _("neg")},r.prototype.add=function(t,e){return _("add")},r.prototype.addN=function(t){return _("addN")},r.prototype.subtract=function(t,e){return _("subtract")},r.prototype.multiply=function(t,e){return _("multiply")},r.prototype.realDivide=function(t,e){return _("realDivide")},r.prototype.floorDiv=function(t,e){return _("floorDiv")},r.prototype.sum=function(t,e){return _("sum")},r.prototype.prod=function(t,e){return _("prod")},r.prototype.unsortedSegmentSum=function(t,e,n){return _("unsortedSegmentSum")},r.prototype.argMin=function(t,e){return _("argMin")},r.prototype.argMax=function(t,e){return _("argMax")},r.prototype.equal=function(t,e){return _("equal")},r.prototype.notEqual=function(t,e){return _("notEqual")},r.prototype.less=function(t,e){return _("less")},r.prototype.lessEqual=function(t,e){return _("lessEqual")},r.prototype.greater=function(t,e){return _("greater")},r.prototype.greaterEqual=function(t,e){return _("greaterEqual")},r.prototype.logicalNot=function(t){return _("logicalNot")},r.prototype.logicalAnd=function(t,e){return _("logicalAnd")},r.prototype.logicalOr=function(t,e){return _("logicalOr")},r.prototype.where=function(t){return _("where")},r.prototype.select=function(t,e,n){return _("select")},r.prototype.topk=function(t,e,n){return _("topk")},r.prototype.min=function(t,e){return _("min")},r.prototype.minimum=function(t,e){return _("minimum")},r.prototype.mod=function(t,e){return _("mod")},r.prototype.max=function(t,e){return _("max")},r.prototype.maximum=function(t,e){return _("maximum")},r.prototype.all=function(t,e){return _("all")},r.prototype.any=function(t,e){return _("any")},r.prototype.squaredDifference=function(t,e){return _("squaredDifference")},r.prototype.ceil=function(t){return _("ceil")},r.prototype.floor=function(t){return _("floor")},r.prototype.round=function(t){return _("round")},r.prototype.sign=function(t){return _("sign")},r.prototype.isNaN=function(t){return _("isNaN")},r.prototype.isInf=function(t){return _("isInf")},r.prototype.isFinite=function(t){return _("isFinite")},r.prototype.pow=function(t,e){return _("pow")},r.prototype.exp=function(t){return _("exp")},r.prototype.expm1=function(t){return _("expm1")},r.prototype.softmax=function(t,e){return _("softmax")},r.prototype.log=function(t){return _("log")},r.prototype.log1p=function(t){return _("log1p")},r.prototype.sqrt=function(t){return _("sqrt")},r.prototype.rsqrt=function(t){return _("rsqrt")},r.prototype.square=function(t){return _("square")},r.prototype.reciprocal=function(t){return _("reciprocal")},r.prototype.relu=function(t){return _("relu")},r.prototype.relu6=function(t){return _("relu6")},r.prototype.prelu=function(t,e){return _("prelu")},r.prototype.elu=function(t){return _("elu")},r.prototype.eluDer=function(t,e){return _("eluDer")},r.prototype.selu=function(t){return _("selu")},r.prototype.int=function(t){return _("int")},r.prototype.clip=function(t,e,n){return _("clip")},r.prototype.abs=function(t){return _("abs")},r.prototype.complexAbs=function(t){return _("complexAbs")},r.prototype.sigmoid=function(t){return _("sigmoid")},r.prototype.softplus=function(t){return _("softplus")},r.prototype.sin=function(t){return _("sin")},r.prototype.cos=function(t){return _("cos")},r.prototype.tan=function(t){return _("tan")},r.prototype.asin=function(t){return _("asin")},r.prototype.acos=function(t){return _("acos")},r.prototype.atan=function(t){return _("atan")},r.prototype.atan2=function(t,e){return _("atan2")},r.prototype.sinh=function(t){return _("sinh")},r.prototype.cosh=function(t){return _("cosh")},r.prototype.tanh=function(t){return _("tanh")},r.prototype.asinh=function(t){return _("asinh")},r.prototype.acosh=function(t){return _("acosh")},r.prototype.atanh=function(t){return _("atanh")},r.prototype.erf=function(t){return _("erf")},r.prototype.step=function(t,e){return _("step")},r.prototype.fusedConv2d=function(t){return t.input,t.filter,t.convInfo,t.bias,t.activation,t.preluActivationWeights,_("fusedConv2d")},r.prototype.conv2d=function(t,e,n){return _("conv2d")},r.prototype.conv2dDerInput=function(t,e,n){return _("conv2dDerInput")},r.prototype.conv2dDerFilter=function(t,e,n){return _("conv2dDerFilter")},r.prototype.fusedDepthwiseConv2D=function(t){return t.input,t.filter,t.convInfo,t.bias,t.activation,t.preluActivationWeights,_("fusedDepthwiseConv2D")},r.prototype.depthwiseConv2D=function(t,e,n){return _("depthwiseConv2D")},r.prototype.depthwiseConv2DDerInput=function(t,e,n){return _("depthwiseConv2DDerInput")},r.prototype.depthwiseConv2DDerFilter=function(t,e,n){return _("depthwiseConv2DDerFilter")},r.prototype.conv3d=function(t,e,n){return _("conv3d")},r.prototype.conv3dDerInput=function(t,e,n){return _("conv3dDerInput")},r.prototype.conv3dDerFilter=function(t,e,n){return _("conv3dDerFilter")},r.prototype.maxPool=function(t,e){return _("maxPool")},r.prototype.maxPoolBackprop=function(t,e,n,o){return _("maxPoolBackprop")},r.prototype.avgPool=function(t,e){return _("avgPool")},r.prototype.avgPoolBackprop=function(t,e,n){return _("avgPoolBackprop")},r.prototype.avgPool3d=function(t,e){return _("avgPool3d")},r.prototype.avgPool3dBackprop=function(t,e,n){return _("avgPool3dBackprop")},r.prototype.maxPool3d=function(t,e){return _("maxPool3d")},r.prototype.maxPool3dBackprop=function(t,e,n,o){return _("maxPool3dBackprop")},r.prototype.reshape=function(t,e){return _("reshape")},r.prototype.cast=function(t,e){return _("cast")},r.prototype.tile=function(t,e){return _("tile")},r.prototype.pad=function(t,e,n){return _("pad")},r.prototype.transpose=function(t,e){return _("transpose")},r.prototype.gather=function(t,e,n){return _("gather")},r.prototype.gatherND=function(t,e){return _("gatherND")},r.prototype.scatterND=function(t,e,n){return _("scatterND")},r.prototype.batchToSpaceND=function(t,e,n){return _("batchToSpaceND")},r.prototype.spaceToBatchND=function(t,e,n){return _("spaceToBatchND")},r.prototype.resizeBilinear=function(t,e,n,o){return _("resizeBilinear")},r.prototype.resizeBilinearBackprop=function(t,e,n){return _("resizeBilinearBackprop")},r.prototype.resizeNearestNeighbor=function(t,e,n,o){return _("resizeNearestNeighbor")},r.prototype.resizeNearestNeighborBackprop=function(t,e,n){return _("resizeNearestNeighborBackprop")},r.prototype.batchNormalization=function(t,e,n,o,a,i){return _("batchNormalization")},r.prototype.localResponseNormalization4D=function(t,e,n,o,a){return _("localResponseNormalization4D")},r.prototype.LRNGrad=function(t,e,n,o,a,i,s){return _("LRNGrad")},r.prototype.multinomial=function(t,e,n,o){return _("multinomial")},r.prototype.oneHot=function(t,e,n,o){return _("oneHot")},r.prototype.cumsum=function(t,e,n,o){return _("cumsum")},r.prototype.nonMaxSuppression=function(t,e,n,o,a){return _("nonMaxSuppression")},r.prototype.fft=function(t){return _("fft")},r.prototype.ifft=function(t){return _("ifft")},r.prototype.complex=function(t,e){return _("complex")},r.prototype.real=function(t){return _("real")},r.prototype.imag=function(t){return _("imag")},r.prototype.cropAndResize=function(t,e,n,o,a,i){return _("cropAndResize")},r.prototype.depthToSpace=function(t,e,n){return _("depthToSpace")},r.prototype.split=function(t,e,n){return _("split")},r.prototype.sparseToDense=function(t,e,n,o){return _("sparseToDense")},r.prototype.diag=function(t){return _("diag")},r.prototype.fill=function(t,e,n){return _("fill")},r.prototype.onesLike=function(t){return _("onesLike")},r.prototype.zerosLike=function(t){return _("zerosLike")},r.prototype.linspace=function(t,e,n){return _("linspace")},r.prototype.dispose=function(){return _("dispose")},r}();function _(r){throw new Error("'"+r+"' not yet implemented or not found in the registry. Did you forget to import the kernel?")}function pn(r,t){for(var e=r.length,n=[],o=0;o<e;o++){var a=e-1-o,i=r[a]||1;(t[t.length-1-o]||1)>1&&i===1&&n.unshift(a)}return n}function Ie(r,t){for(var e=[],n=0;n<t.length;n++){var o=r[r.length-n-1],a=t.length-n-1,i=t[a];(o==null||o===1&&i>1)&&e.unshift(a)}return e}function oe(r,t){for(var e=[],n=Math.max(r.length,t.length),o=0;o<n;o++){var a=r[r.length-o-1];a==null&&(a=1);var i=t[t.length-o-1];if(i==null&&(i=1),a===1)e.unshift(i);else if(i===1)e.unshift(a);else{if(a!==i)throw Error("Operands could not be broadcast together with shapes "+r+" and "+t+".");e.unshift(a)}}return e}function dt(r,t,e,n,o,a,i){i===void 0&&(i="channelsLast");var s,u=gr(t),l=u[0],c=u[1];if(i==="channelsLast")s=[l,c,r[3],r[3]];else{if(i!=="channelsFirst")throw new Error("Unknown dataFormat "+i);s=[l,c,r[1],r[1]]}return Tn(r,s,e,n,o,a,!1,i)}function Lt(r,t,e,n,o,a,i){i===void 0&&(i="NDHWC");var s,u,l=Ao(t),c=l[0],f=l[1],h=l[2];if(i==="NDHWC")u="channelsLast",s=[c,f,h,r[4],r[4]];else{if(i!=="NCDHW")throw new Error("Unknown dataFormat "+i);u="channelsFirst",s=[c,f,h,r[1],r[1]]}return Wt(r,s,e,n,o,!1,u,a)}function Tn(r,t,e,n,o,a,i,s){i===void 0&&(i=!1),s===void 0&&(s="channelsLast");var u=[-1,-1,-1,-1],l=u[0],c=u[1],f=u[2],h=u[3];if(s==="channelsLast")l=r[0],c=r[1],f=r[2],h=r[3];else{if(s!=="channelsFirst")throw new Error("Unknown dataFormat "+s);l=r[0],h=r[1],c=r[2],f=r[3]}var d,p=t[0],m=t[1],v=t[3],g=gr(e),y=g[0],x=g[1],b=gr(n),w=b[0],R=b[1],A=it(p,w),k=it(m,R),I=function(L,B,V,z,P,G,H,q){var Q,J,te;if(typeof L=="number"){Q={top:L,bottom:L,left:L,right:L,type:L===0?"VALID":"NUMBER"};var re=function(se,de,he,xe,me){xe==null&&(xe=ua(se,de,he));var ge=se[0],en=se[1],nn=St((ge-de+2*xe)/he+1,me);E(we(nn),function(){return"The output # of rows ("+nn+") must be an integer. Change the stride and/or zero pad parameters"});var Ue=St((en-de+2*xe)/he+1,me);return E(we(Ue),function(){return"The output # of columns ("+Ue+") must be an integer. Change the stride and/or zero pad parameters"}),[nn,Ue]}([B,V],G,z,L,q);J=re[0],te=re[1]}else if(L==="same"){J=Math.ceil(B/z),te=Math.ceil(V/P);var ae=Math.max(0,(J-1)*z+G-B),le=Math.max(0,(te-1)*P+H-V),ie=Math.floor(ae/2),ce=ae-ie,Ce=Math.floor(le/2);Q={top:ie,bottom:ce,left:Ce,right:le-Ce,type:"SAME"}}else{if(L!=="valid")throw Error("Unknown padding parameter: "+L);Q={top:0,bottom:0,left:0,right:0,type:"VALID"},J=Math.ceil((B-G+1)/z),te=Math.ceil((V-H+1)/P)}return{padInfo:Q,outHeight:J,outWidth:te}}(o,c,f,y,x,A,k,a),S=I.padInfo,F=I.outHeight,N=I.outWidth,W=i?v*h:v;return s==="channelsFirst"?d=[l,W,F,N]:s==="channelsLast"&&(d=[l,F,N,W]),{batchSize:l,dataFormat:s,inHeight:c,inWidth:f,inChannels:h,outHeight:F,outWidth:N,outChannels:W,padInfo:S,strideHeight:y,strideWidth:x,filterHeight:p,filterWidth:m,effectiveFilterHeight:A,effectiveFilterWidth:k,dilationHeight:w,dilationWidth:R,inShape:r,outShape:d,filterShape:t}}function Wt(r,t,e,n,o,a,i,s){a===void 0&&(a=!1),i===void 0&&(i="channelsLast");var u=[-1,-1,-1,-1,-1],l=u[0],c=u[1],f=u[2],h=u[3],d=u[4];if(i==="channelsLast")l=r[0],c=r[1],f=r[2],h=r[3],d=r[4];else{if(i!=="channelsFirst")throw new Error("Unknown dataFormat "+i);l=r[0],d=r[1],c=r[2],f=r[3],h=r[4]}var p,m=t[0],v=t[1],g=t[2],y=t[4],x=Ao(e),b=x[0],w=x[1],R=x[2],A=Ao(n),k=A[0],I=A[1],S=A[2],F=it(m,k),N=it(v,I),W=it(g,S),L=function(H,q,Q,J,te,re,ae,le,ie,ce,Ce){var se,de,he,xe;if(typeof H=="number"){se={top:H,bottom:H,left:H,right:H,front:H,back:H,type:H===0?"VALID":"NUMBER"};var me=function($n,ln,Vr,Qn,tn,Gr){tn==null&&(tn=ua($n,ln,Qn));var mf=$n[0],gf=$n[1],yf=$n[2],Hr=St((mf-ln+2*tn)/Qn+1,Gr);E(we(Hr),function(){return"The output # of depths ("+Hr+") must be an integer. Change the stride and/or zero pad parameters"});var qr=St((gf-ln+2*tn)/Qn+1,Gr);E(we(qr),function(){return"The output # of rows ("+qr+") must be an integer. Change the stride and/or zero pad parameters"});var Kr=St((yf-ln+2*tn)/Qn+1,Gr);return E(we(Kr),function(){return"The output # of columns ("+Kr+") must be an integer. Change the stride and/or zero pad parameters"}),[Hr,qr,Kr,Vr]}([q,Q,J,1],le,1,te,H,Ce);de=me[0],he=me[1],xe=me[2]}else if(H==="same"){de=Math.ceil(q/te),he=Math.ceil(Q/re),xe=Math.ceil(J/ae);var ge=(de-1)*te+le-q,en=(he-1)*re+ie-Q,nn=(xe-1)*ae+ce-J,Ue=Math.floor(ge/2),Yn=ge-Ue,sn=Math.floor(en/2),xn=en-sn,un=Math.floor(nn/2);se={top:sn,bottom:xn,left:un,right:nn-un,front:Ue,back:Yn,type:"SAME"}}else{if(H!=="valid")throw Error("Unknown padding parameter: "+H);se={top:0,bottom:0,left:0,right:0,front:0,back:0,type:"VALID"},de=Math.ceil((q-le+1)/te),he=Math.ceil((Q-ie+1)/re),xe=Math.ceil((J-ce+1)/ae)}return{padInfo:se,outDepth:de,outHeight:he,outWidth:xe}}(o,c,f,h,b,w,R,F,N,W,s),B=L.padInfo,V=L.outDepth,z=L.outHeight,P=L.outWidth,G=a?y*d:y;return i==="channelsFirst"?p=[l,G,V,z,P]:i==="channelsLast"&&(p=[l,V,z,P,G]),{batchSize:l,dataFormat:i,inDepth:c,inHeight:f,inWidth:h,inChannels:d,outDepth:V,outHeight:z,outWidth:P,outChannels:G,padInfo:B,strideDepth:b,strideHeight:w,strideWidth:R,filterDepth:m,filterHeight:v,filterWidth:g,effectiveFilterDepth:F,effectiveFilterHeight:N,effectiveFilterWidth:W,dilationDepth:k,dilationHeight:I,dilationWidth:S,inShape:r,outShape:p,filterShape:t}}function ua(r,t,e,n){n===void 0&&(n=1);var o=it(t,n);return Math.floor((r[0]*(e-1)-e+o)/2)}function gr(r){return typeof r=="number"?[r,r,r]:r.length===2?[r[0],r[1],1]:r}function Ao(r){return typeof r=="number"?[r,r,r]:r}function it(r,t){return t<=1?r:r+(r-1)*(t-1)}function St(r,t){if(!t)return r;switch(t){case"round":return Math.round(r);case"ceil":return Math.ceil(r);case"floor":return Math.floor(r);default:throw new Error("Unknown roundingMode "+t)}}function Hn(r){var t=gr(r),e=t[0],n=t[1],o=t[2];return e===1&&n===1&&o===1}function Pe(r,t){return Hn(r)||Hn(t)}function Tr(r){if(r==="NHWC")return"channelsLast";if(r==="NCHW")return"channelsFirst";throw new Error("Unknown dataFormat "+r)}function la(r,t,e){if(t==="complex64"){if(r.dtype==="complex64")return r.clone();var n=ye(r.shape),o=r.toFloat(),a=e.complex(o,n);return n.dispose(),o.dispose(),a}if(!Vi(r.dtype,t))return D.makeTensorFromDataId(r.dataId,r.shape,t);if(r.dtype==="complex64"){var i=e.real(r);return a=i.cast(t),i.dispose(),a}if(t==="int32")return e.int(r);if(t==="bool"){var s=$(0,r.dtype);return a=e.notEqual(r,s),s.dispose(),a}throw new Error("Error in Cast: failed to cast "+r.dtype+" to "+t)}function yr(r,t){return D.makeTensorFromDataId(r.dataId,t,r.dtype)}function ca(r,t,e){var n=(t-r)/(e-1),o=vt(e,"float32");o[0]=r;for(var a=1;a<o.length;a++)o[a]=o[a-1]+n;return Gn(o,"float32")}var fh=Object.freeze({castTensor:la,reshapeTensor:yr,linspaceImpl:ca,upcastType:De,axesAreInnerMostDims:jo,combineLocations:Rs,computeOutAndReduceShapes:Te,expandShapeToKeepDim:Be,assertAxesAreInnerMostDims:Le,getAxesPermutation:Qe,getUndoAxesPermutation:wr,getInnerMostAxes:Je,getBroadcastDims:pn,getReductionAxes:Ie,assertAndGetBroadcastShape:oe,assertParamsConsistent:Is,computeOutShape:Vn,computePool2DInfo:dt,computePool3DInfo:Lt,computeConv2DInfo:Tn,computeConv3DInfo:Wt,computeDefaultPad:ua,tupleValuesAreOne:Hn,eitherStridesOrDilationsAreOne:Pe,convertConv2DDataFormat:Tr,PARALLELIZE_THRESHOLD:ra,computeOptimalWindowSize:sr});function Do(r,t){if(r.length!==t.length)throw new Error("Cannot merge real and imag arrays of different lengths. real:"+r.length+", imag: "+t.length+".");for(var e=new Float32Array(2*r.length),n=0;n<e.length;n+=2)e[n]=r[n/2],e[n+1]=t[n/2];return e}function Za(r,t){return{real:r[2*t],imag:r[2*t+1]}}function hh(r,t,e,n){r[2*n]=t,r[2*n+1]=e}function dh(r,t,e){var n=(e?2:-2)*Math.PI*(r/t);return{real:Math.cos(n),imag:Math.sin(n)}}function ph(r,t,e){var n=function(a,i,s){return function(u,l,c){for(var f=0,h=u.length,d=0,p=!1;f<h;){var m=c(l,u[d=f+(h-f>>>1)]);m>0?f=d+1:(h=d,p=!m)}return p?f:-f-1}(a,i,s||vh)}(r,t,e),o=n<0?-(n+1):n;r.splice(o,0,t)}function vh(r,t){return r>t?1:r<t?-1:0}function fa(r,t,e,n,o){return au(r,t,e,n,o,0).selectedIndices}function ha(r,t,e,n,o,a){var i=au(r,t,e,n,o,a);return i.numValidOutputs.dispose(),{selectedIndices:i.selectedIndices,selectedScores:i.selectedScores}}function au(r,t,e,n,o,a,i,s){s===void 0&&(s=!1);for(var u=Array.from(t).map(function(b,w){return{score:b,boxIndex:w,suppressBeginIndex:0}}).filter(function(b){return b.score>o}).sort(ei),l=a>0?-.5/a:0,c=[],f=[];c.length<e&&u.length>0;){var h=u.pop(),d=h.score,p=h.boxIndex,m=h.suppressBeginIndex;if(d<o)break;for(var v=!1,g=c.length-1;g>=m;--g){var y=mh(r,p,c[g]);if(y>=n){v=!0;break}if(h.score=h.score*gh(n,l,y),h.score<=o)break}h.suppressBeginIndex=c.length,v||(h.score===d?(c.push(p),f.push(h.score)):h.score>o&&ph(u,h,ei))}var x=c.length;return s&&(c.fill(0,x),f.fill(0,x)),{selectedIndices:Gn(c,"int32"),selectedScores:Gn(f,"float32"),numValidOutputs:$(x,"int32")}}function mh(r,t,e){var n=r.subarray(4*t,4*t+4),o=r.subarray(4*e,4*e+4),a=Math.min(n[0],n[2]),i=Math.min(n[1],n[3]),s=Math.max(n[0],n[2]),u=Math.max(n[1],n[3]),l=Math.min(o[0],o[2]),c=Math.min(o[1],o[3]),f=Math.max(o[0],o[2]),h=Math.max(o[1],o[3]),d=(s-a)*(u-i),p=(f-l)*(h-c);if(d<=0||p<=0)return 0;var m=Math.max(a,l),v=Math.max(i,c),g=Math.min(s,f),y=Math.min(u,h),x=Math.max(g-m,0)*Math.max(y-v,0);return x/(d+p-x)}function gh(r,t,e){var n=Math.exp(t*e*e);return e<=r?n:0}function ei(r,t){return r.score-t.score||r.score===t.score&&t.boxIndex-r.boxIndex}function iu(r,t,e){var n=new Array(r.rank).fill(0),o=r.shape.slice();return t.map(function(a){o[e]=a;var i=r.slice(n,o);return n[e]+=a,i})}function su(r,t){for(var e=new Array(r.rank),n=0;n<e.length;n++)e[n]=r.shape[n]*t[n];var o=ee(e,r.dtype);for(n=0;n<o.values.length;++n){for(var a=o.indexToLoc(n),i=new Array(r.rank),s=0;s<i.length;s++)i[s]=a[s]%r.shape[s];var u=r.locToIndex(i);o.values[n]=r.values[u]}return o.toTensor()}function uu(r,t,e,n,o){for(var a=t[t.length-1],i=[r.length/a,a],s=i[0],u=i[1],l=ft(e,s*n),c=ft("int32",s*n),f=0;f<s;f++){for(var h=f*u,d=r.subarray(h,h+u),p=[],m=0;m<d.length;m++)p.push({value:d[m],index:m});p.sort(function(b,w){return w.value-b.value});var v=f*n,g=l.subarray(v,v+n),y=c.subarray(v,v+n);for(m=0;m<n;m++)g[m]=p[m].value,y[m]=p[m].index}var x=t.slice();return x[x.length-1]=n,[Ne(l,x,e),Ne(c,x,"int32")]}function da(r,t){for(var e=[],n=0;n<t.length;n++)t[n]&&e.push(n);var o=ee(r,"int32"),a=ee([e.length,r.length],"int32");for(n=0;n<e.length;n++){var i=o.indexToLoc(e[n]),s=n*r.length;a.values.set(i,s)}return a.toTensor()}var yh=function(r,t){this.outputShape=[],this.outputShape=r,this.variableNames=t.map(function(o,a){return"T"+a});var e=[];this.variableNames.forEach(function(o){e.push("float v"+o+" = get"+o+"AtOutCoords();")});var n=this.variableNames.map(function(o){return"v"+o}).join(" + ");this.userCode=`
      void main() {
        `+e.join(`
        `)+`

        float result = `+n+`;
        setOutput(result);
      }
    `},xh=function(r,t){this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=r,this.variableNames=t.map(function(o,a){return"T"+a});var e=[];this.variableNames.forEach(function(o){e.push("vec4 v"+o+" = get"+o+"AtOutCoords();")});var n=this.variableNames.map(function(o){return"v"+o}).join(" + ");this.userCode=`
      void main() {
        `+e.join(`
        `)+`

        vec4 result = `+n+`;
        setOutput(result);
      }
    `},bh=function(r,t,e){this.variableNames=["A"];var n=r.windowSize,o=r.batchSize,a=r.inSize,i=Math.ceil(a/n);e||this.variableNames.push("bestIndicesA"),this.outputShape=[o,i];var s=t==="max"?">":"<",u=e?"inOffset + i;":"round(getBestIndicesA(batch, inOffset + i));";this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * `+n+`;

        int bestIndex = inOffset;
        float bestValue = getA(batch, bestIndex);

        for (int i = 0; i < `+n+`; i++) {
          int inIdx = `+u+`;
          float candidate = getA(batch, inIdx);
          if (candidate `+s+` bestValue) {
            bestValue = candidate;
            bestIndex = inIdx;
          }
        }
        setOutput(float(bestIndex));
      }
    `};function lu(r,t){return["x","y","z","w","u","v"].slice(0,t).map(function(e){return r+"."+e})}function We(r,t){return t===1?[r]:lu(r,t)}function Oe(){var r,t,e,n,o,a,i,s,u,l;return M().getNumber("WEBGL_VERSION")===2?(r="#version 300 es",t="in",e="out",n="in",o="texture",a="outputColor",i="out vec4 outputColor;",s=`
      bool isnan_custom(float val) {
        return (val > 0.0 || val < 0.0) ? false : val != 0.0;
      }

      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan_custom(val.x),
          isnan_custom(val.y), isnan_custom(val.z), isnan_custom(val.w));
      }

      #define isnan(value) isnan_custom(value)
    `,u="",l=`
      #define round(value) newRound(value)
      int newRound(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 newRound(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `):(r="",t="attribute",e="varying",n="varying",o="texture2D",a="gl_FragColor",i="",s=`
      #define isnan(value) isnan_custom(value)
      bool isnan_custom(float val) {
        return (val > 0. || val < 1. || val == 0.) ? false : true;
      }
      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan(val.x), isnan(val.y), isnan(val.z), isnan(val.w));
      }
    `,u=`
      uniform float INFINITY;

      bool isinf(float val) {
        return abs(val) == INFINITY;
      }
      bvec4 isinf(vec4 val) {
        return equal(abs(val), vec4(INFINITY));
      }
    `,l=`
      int round(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 round(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `),{version:r,attribute:t,varyingVs:e,varyingFs:n,texture2D:o,output:a,defineOutput:i,defineSpecialNaN:s,defineSpecialInf:u,defineRound:l}}function Pn(r,t,e){e===void 0&&(e="index");var n=Xe(t);return n.map(function(o,a){return"int "+r[a]+" = "+e+" / "+o+"; "+(a===n.length-1?"int "+r[a+1]+" = "+e+" - "+r[a]+" * "+o:"index -= "+r[a]+" * "+o)+";"}).join("")}function pa(r){var t=Xe(r).map(function(e){return e.toString()});return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * `+t[0]+" + coords.y * "+t[1]+` + coords.z;
  }
`}var cu=`
  const float FLOAT_MAX = 1.70141184e38;
  const float FLOAT_MIN = 1.17549435e-38;

  lowp vec4 encode_float(highp float v) {
    if (isnan(v)) {
      return vec4(255, 255, 255, 255);
    }

    highp float av = abs(v);

    if(av < FLOAT_MIN) {
      return vec4(0.0, 0.0, 0.0, 0.0);
    } else if(v > FLOAT_MAX) {
      return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
    } else if(v < -FLOAT_MAX) {
      return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
    }

    highp vec4 c = vec4(0,0,0,0);

    highp float e = floor(log2(av));
    highp float m = exp2(fract(log2(av))) - 1.0;

    c[2] = floor(128.0 * m);
    m -= c[2] / 128.0;
    c[1] = floor(32768.0 * m);
    m -= c[1] / 32768.0;
    c[0] = floor(8388608.0 * m);

    highp float ebias = e + 127.0;
    c[3] = floor(ebias / 2.0);
    ebias -= c[3] * 2.0;
    c[2] += floor(ebias) * 128.0;

    c[3] += 128.0 * step(0.0, -v);

    return c / 255.0;
  }
`;function wh(r,t,e,n){var o=[];r.forEach(function(d){var p=Y(d.shapeInfo.logicalShape);d.shapeInfo.isUniform?o.push("uniform float "+d.name+(p>1?"["+p+"]":"")+";"):(o.push("uniform sampler2D "+d.name+";"),o.push("uniform int offset"+d.name+";"))});var a,i,s=o.join(`
`),u=r.map(function(d){return function(p,m,v){v===void 0&&(v=!1);var g="";g+=v?fu(p):nt(p);var y=p.shapeInfo.logicalShape,x=m.logicalShape;return y.length<=x.length&&(g+=v?function(b,w){var R,A=b.name,k=A.charAt(0).toUpperCase()+A.slice(1),I="get"+k+"AtOutCoords",S=b.shapeInfo.logicalShape.length,F=w.logicalShape.length,N=pn(b.shapeInfo.logicalShape,w.logicalShape),W=pe(F),L=F-S,B=["x","y","z","w","u","v"];R=S===0?"":F<2&&N.length>=1?"coords = 0;":N.map(function(Q){return"coords."+B[Q+L]+" = 0;"}).join(`
`);var V="";V=F<2&&S>0?"coords":b.shapeInfo.logicalShape.map(function(Q,J){return"coords."+B[J+L]}).join(", ");var z="return outputValue;",P=Y(b.shapeInfo.logicalShape)===1,G=Y(w.logicalShape)===1;if(S!==1||P||G){if(P&&!G)z=F===1?`
        return vec4(outputValue.x, outputValue.x, 0., 0.);
      `:`
        return vec4(outputValue.x);
      `;else if(N.length){var H=S-2,q=S-1;N.indexOf(H)>-1&&N.indexOf(q)>-1?z="return vec4(outputValue.x);":N.indexOf(H)>-1?z="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":N.indexOf(q)>-1&&(z="return vec4(outputValue.xx, outputValue.zz);")}}else z=`
      return vec4(outputValue.xy, outputValue.xy);
    `;return`
    vec4 `+I+`() {
      `+W+` coords = getOutputCoords();
      `+R+`
      vec4 outputValue = get`+k+"("+V+`);
      `+z+`
    }
  `}(p,m):function(b,w){var R=b.name,A=R.charAt(0).toUpperCase()+R.slice(1),k="get"+A+"AtOutCoords",I=w.texShape,S=b.shapeInfo.texShape,F=b.shapeInfo.logicalShape.length,N=w.logicalShape.length;if(!b.shapeInfo.isUniform&&F===N&&b.shapeInfo.flatOffset==null&&Re(S,I))return`
      float `+k+`() {
        return sampleTexture(`+R+`, resultUV);
      }
    `;var W,L=pe(N),B=pn(b.shapeInfo.logicalShape,w.logicalShape),V=N-F,z=["x","y","z","w","u","v"];W=F===0?"":N<2&&B.length>=1?"coords = 0;":B.map(function(G){return"coords."+z[G+V]+" = 0;"}).join(`
`);var P="";return P=N<2&&F>0?"coords":b.shapeInfo.logicalShape.map(function(G,H){return"coords."+z[H+V]}).join(", "),`
    float `+k+`() {
      `+L+` coords = getOutputCoords();
      `+W+`
      return get`+A+"("+P+`);
    }
  `}(p,m)),g}(d,t,n)}).join(`
`),l=t.texShape,c=Oe(),f=function(d){return`
    float sampleTexture(sampler2D textureSampler, vec2 uv) {
      return `+d.texture2D+`(textureSampler, uv).r;
    }
  `}(c),h=function(d){return d.version+`
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    `+d.varyingFs+` vec2 resultUV;
    `+d.defineOutput+`
    const vec2 halfCR = vec2(0.5, 0.5);

    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    uniform float NAN;
    `+d.defineSpecialNaN+`
    `+d.defineSpecialInf+`
    `+d.defineRound+`

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    int idiv(int a, int b, float sign) {
      int res = a / b;
      int mod = imod(a, b);
      if (sign < 0. && mod != 0) {
        res -= 1;
      }
      return res;
    }

    //Based on the work of Dave Hoskins
    //https://www.shadertoy.com/view/4djSRW
    #define HASHSCALE1 443.8975
    float random(float seed){
      vec2 p = resultUV * seed;
      vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
      p3 += dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }

    `+Ch+`
    `+Eh+`
    `+Rh+`
  `}(c);return t.isPacked?(a=function(d,p){switch(d.length){case 0:return`
    int getOutputCoords() {
      return 0;
    }
  `;case 1:return function(b,w){var R=[Math.ceil(w[0]/2),Math.ceil(w[1]/2)];return R[0]===1?`
      int getOutputCoords() {
        return 2 * int(resultUV.x * `+R[1]+`.0);
      }
    `:R[1]===1?`
      int getOutputCoords() {
        return 2 * int(resultUV.y * `+R[0]+`.0);
      }
    `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+R[0]+", "+R[1]+`));
      return 2 * (resTexRC.x * `+R[1]+` + resTexRC.y);
    }
  `}(0,p);case 2:return function(b,w){var R=[Math.ceil(w[0]/2),Math.ceil(w[1]/2)];if(Re(b,w))return`
      ivec2 getOutputCoords() {
        return 2 * ivec2(resultUV.yx * vec2(`+R[0]+", "+R[1]+`));
      }
    `;var A=Math.ceil(b[1]/2);return`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+R[0]+", "+R[1]+`));

      int index = resTexRC.x * `+R[1]+` + resTexRC.y;
      int r = 2 * (index / `+A+`);
      int c = imod(index, `+A+`) * 2;

      return ivec2(r, c);
    }
  `}(d,p);case 3:return m=d,v=p,g=[Math.ceil(v[0]/2),Math.ceil(v[1]/2)],y=Math.ceil(m[2]/2),x=y*Math.ceil(m[1]/2),`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+g[0]+", "+g[1]+`));
      int index = resTexRC.x * `+g[1]+` + resTexRC.y;

      int b = index / `+x+`;
      index -= b * `+x+`;

      int r = 2 * (index / `+y+`);
      int c = imod(index, `+y+`) * 2;

      return ivec3(b, r, c);
    }
  `;default:return function(b,w){for(var R=[Math.ceil(w[0]/2),Math.ceil(w[1]/2)],A=Math.ceil(b[b.length-1]/2),k=A*Math.ceil(b[b.length-2]/2),I=k,S="",F="b, r, c",N=2;N<b.length-1;N++)I*=b[b.length-N-1],S=`
      int b`+N+" = index / "+I+`;
      index -= b`+N+" * "+I+`;
    `+S,F="b"+N+", "+F;return`
    ivec`+b.length+` getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+R[0]+", "+R[1]+`));
      int index = resTexRC.x * `+R[1]+` + resTexRC.y;

      `+S+`

      int b = index / `+k+`;
      index -= b * `+k+`;

      int r = 2 * (index / `+A+`);
      int c = imod(index, `+A+`) * 2;

      return ivec`+b.length+"("+F+`);
    }
  `}(d,p)}var m,v,g,y,x}(t.logicalShape,l),i=function(d){return`
    void setOutput(vec4 val) {
      `+d.output+` = val;
    }
  `}(c)):(a=function(d,p){switch(d.length){case 0:return`
    int getOutputCoords() {
      return 0;
    }
  `;case 1:return function(g,y){return y[0]===1?`
      int getOutputCoords() {
        return int(resultUV.x * `+y[1]+`.0);
      }
    `:y[1]===1?`
      int getOutputCoords() {
        return int(resultUV.y * `+y[0]+`.0);
      }
    `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+y[0]+", "+y[1]+`));
      return resTexRC.x * `+y[1]+` + resTexRC.y;
    }
  `}(0,p);case 2:return function(g,y){return Re(g,y)?`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(`+y[0]+", "+y[1]+`));
      }
    `:g[1]===1?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(`+y[0]+", "+y[1]+`));
        int index = resTexRC.x * `+y[1]+` + resTexRC.y;
        return ivec2(index, 0);
      }
    `:g[0]===1?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(`+y[0]+", "+y[1]+`));
        int index = resTexRC.x * `+y[1]+` + resTexRC.y;
        return ivec2(0, index);
      }
    `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+y[0]+", "+y[1]+`));
      int index = resTexRC.x * `+y[1]+` + resTexRC.y;
      int r = index / `+g[1]+`;
      int c = index - r * `+g[1]+`;
      return ivec2(r, c);
    }
  `}(d,p);case 3:return m=p,v=Pn(["r","c","d"],d),`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+m[0]+", "+m[1]+`));
      int index = resTexRC.x * `+m[1]+` + resTexRC.y;
      `+v+`
      return ivec3(r, c, d);
    }
  `;case 4:return function(g,y){var x=Pn(["r","c","d","d2"],g);return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(`+y[0]+", "+y[1]+`));
      int index = resTexRC.x * `+y[1]+` + resTexRC.y;
      `+x+`
      return ivec4(r, c, d, d2);
    }
  `}(d,p);case 5:return function(g,y){var x=Pn(["r","c","d","d2","d3"],g);return`
    ivec5 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx * vec2(`+y[0]+`,
                             `+y[1]+`));

      int index = resTexRC.x * `+y[1]+` + resTexRC.y;

      `+x+`

      ivec5 outShape = ivec5(r, c, d, d2, d3);
      return outShape;
    }
  `}(d,p);case 6:return function(g,y){var x=Pn(["r","c","d","d2","d3","d4"],g);return`
    ivec6 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(`+y[0]+", "+y[1]+`));
      int index = resTexRC.x * `+y[1]+` + resTexRC.y;

      `+x+`

      ivec6 result = ivec6(r, c, d, d2, d3, d4);
      return result;
    }
  `}(d,p);default:throw new Error(d.length+"-D output sampling is not yet supported")}var m,v}(t.logicalShape,l),i=function(d){return`
    void setOutput(float val) {
      `+d.output+` = vec4(val, 0, 0, 0);
    }
  `}(c)),n&&(h+=Ih),[h,f,i,s,a,u,e].join(`
`)}function nt(r){var t=r.shapeInfo.logicalShape;switch(t.length){case 0:return function(e){var n=e.name,o="get"+n.charAt(0).toUpperCase()+n.slice(1);if(e.shapeInfo.isUniform)return"float "+o+"() {return "+n+";}";var a=e.shapeInfo.texShape,i=a[0],s=a[1];if(i===1&&s===1)return`
      float `+o+`() {
        return sampleTexture(`+n+`, halfCR);
      }
    `;var u=e.shapeInfo.texShape,l=u[0],c=u[1],f=_n(n);return`
    float `+o+`() {
      vec2 uv = uvFromFlat(`+l+", "+c+", "+f+`);
      return sampleTexture(`+n+`, uv);
    }
  `}(r);case 1:return function(e){var n=e.name,o="get"+n.charAt(0).toUpperCase()+n.slice(1);if(e.shapeInfo.isUniform)return`
      float `+o+`(int index) {
        `+Jn(e)+`
      }
    `;var a=e.shapeInfo.texShape,i=a[0],s=a[1];if(s===1&&i===1)return`
      float `+o+`(int index) {
        return sampleTexture(`+n+`, halfCR);
      }
    `;var u=_n(n);return s===1?`
      float `+o+`(int index) {
        vec2 uv = vec2(0.5, (float(index + `+u+") + 0.5) / "+i+`.0);
        return sampleTexture(`+n+`, uv);
      }
    `:i===1?`
      float `+o+`(int index) {
        vec2 uv = vec2((float(index + `+u+") + 0.5) / "+s+`.0, 0.5);
        return sampleTexture(`+n+`, uv);
      }
    `:`
    float `+o+`(int index) {
      vec2 uv = uvFromFlat(`+i+", "+s+", index + "+u+`);
      return sampleTexture(`+n+`, uv);
    }
  `}(r);case 2:return function(e){var n=e.shapeInfo.logicalShape,o=e.name,a="get"+o.charAt(0).toUpperCase()+o.slice(1),i=e.shapeInfo.texShape;if(i!=null&&Re(n,i)){var s=i[0],u=i[1];return`
    float `+a+`(int row, int col) {
      vec2 uv = (vec2(col, row) + halfCR) / vec2(`+u+".0, "+s+`.0);
      return sampleTexture(`+o+`, uv);
    }
  `}var l=wn(n),c=l.newShape,f=l.keptDims,h=c;if(h.length<n.length){var d=tt(e,h);return`
      `+nt(d)+`
      float `+a+`(int row, int col) {
        return `+a+"("+rt(["row","col"],f)+`);
      }
    `}if(e.shapeInfo.isUniform)return`
      float `+a+`(int row, int col) {
        int index = round(dot(vec2(row, col), vec2(`+n[1]+`, 1)));
        `+Jn(e)+`
      }
    `;var p=i[0],m=i[1],v=_n(o);return m===1?`
    float `+a+`(int row, int col) {
      float index = dot(vec3(row, col, `+v+"), vec3("+n[1]+`, 1, 1));
      vec2 uv = vec2(0.5, (index + 0.5) / `+p+`.0);
      return sampleTexture(`+o+`, uv);
    }
  `:p===1?`
    float `+a+`(int row, int col) {
      float index = dot(vec3(row, col, `+v+"), vec3("+n[1]+`, 1, 1));
      vec2 uv = vec2((index + 0.5) / `+m+`.0, 0.5);
      return sampleTexture(`+o+`, uv);
    }
  `:`
  float `+a+`(int row, int col) {
    // Explicitly use integer operations as dot() only works on floats.
    int index = row * `+n[1]+" + col + "+v+`;
    vec2 uv = uvFromFlat(`+p+", "+m+`, index);
    return sampleTexture(`+o+`, uv);
  }
`}(r);case 3:return function(e){var n=e.shapeInfo.logicalShape,o=e.name,a="get"+o.charAt(0).toUpperCase()+o.slice(1),i=n[1]*n[2],s=n[2],u=wn(n),l=u.newShape,c=u.keptDims,f=l;if(f.length<n.length){var h=tt(e,f);return`
        `+nt(h)+`
        float `+a+`(int row, int col, int depth) {
          return `+a+"("+rt(["row","col","depth"],c)+`);
        }
      `}if(e.shapeInfo.isUniform)return`
      float `+a+`(int row, int col, int depth) {
        int index = round(dot(vec3(row, col, depth),
                          vec3(`+i+", "+s+`, 1)));
        `+Jn(e)+`
      }
    `;var d=e.shapeInfo.texShape,p=d[0],m=d[1],v=e.shapeInfo.flatOffset;if(m===i&&v==null)return`
        float `+a+`(int row, int col, int depth) {
          float texR = float(row);
          float texC = dot(vec2(col, depth), vec2(`+s+`, 1));
          vec2 uv = (vec2(texC, texR) + halfCR) /
                     vec2(`+m+".0, "+p+`.0);
          return sampleTexture(`+o+`, uv);
        }
      `;if(m===s&&v==null)return`
    float `+a+`(int row, int col, int depth) {
      float texR = dot(vec2(row, col), vec2(`+n[1]+`, 1));
      float texC = float(depth);
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(`+m+".0, "+p+`.0);
      return sampleTexture(`+o+`, uv);
    }
  `;var g=_n(o);return`
      float `+a+`(int row, int col, int depth) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * `+i+" + col * "+s+" + depth + "+g+`;
        vec2 uv = uvFromFlat(`+p+", "+m+`, index);
        return sampleTexture(`+o+`, uv);
      }
  `}(r);case 4:return function(e){var n=e.shapeInfo.logicalShape,o=e.name,a="get"+o.charAt(0).toUpperCase()+o.slice(1),i=n[3],s=n[2]*i,u=n[1]*s,l=wn(n),c=l.newShape,f=l.keptDims;if(c.length<n.length){var h=tt(e,c);return`
      `+nt(h)+`
      float `+a+`(int row, int col, int depth, int depth2) {
        return `+a+"("+rt(["row","col","depth","depth2"],f)+`);
      }
    `}if(e.shapeInfo.isUniform)return`
      float `+a+`(int row, int col, int depth, int depth2) {
        int index = round(dot(vec4(row, col, depth, depth2),
                          vec4(`+u+", "+s+", "+i+`, 1)));
        `+Jn(e)+`
      }
    `;var d=e.shapeInfo.flatOffset,p=e.shapeInfo.texShape,m=p[0],v=p[1];if(v===u&&d==null)return`
      float `+a+`(int row, int col, int depth, int depth2) {
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(`+s+", "+i+`, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(`+v+".0, "+m+`.0);
        return sampleTexture(`+o+`, uv);
      }
    `;if(v===i&&d==null)return`
      float `+a+`(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(`+n[1]*n[2]+", "+n[2]+`, 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(`+v+".0, "+m+`.0);
        return sampleTexture(`+o+`, uv);
      }
    `;var g=_n(o);return`
    float `+a+`(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * `+u+" + col * "+s+` +
          depth * `+i+` + depth2;
      vec2 uv = uvFromFlat(`+m+", "+v+", index + "+g+`);
      return sampleTexture(`+o+`, uv);
    }
  `}(r);case 5:return function(e){var n=e.shapeInfo.logicalShape,o=e.name,a="get"+o.charAt(0).toUpperCase()+o.slice(1),i=n[4],s=n[3]*i,u=n[2]*s,l=n[1]*u,c=wn(n),f=c.newShape,h=c.keptDims;if(f.length<n.length){var d=tt(e,f);return`
      `+nt(d)+`
      float `+a+`(int row, int col, int depth, int depth2, int depth3) {
        return `+a+"("+rt(["row","col","depth","depth2","depth3"],h)+`);
      }
    `}if(e.shapeInfo.isUniform)return`
      float `+a+`(int row, int col, int depth, int depth2, int depth3) {
        float index = dot(
          vec4(row, col, depth, depth2),
          vec4(`+l+", "+u+", "+s+", "+i+`)) +
          depth3;
        `+Jn(e)+`
      }
    `;var p=e.shapeInfo.flatOffset,m=e.shapeInfo.texShape,v=m[0],g=m[1];if(g===l&&p==null)return`
      float `+a+`(int row, int col, int depth, int depth2, int depth3) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
                         vec4(`+u+", "+s+", "+i+`, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(`+g+".0, "+v+`.0);
        return sampleTexture(`+o+`, uv);
      }
    `;if(g===i&&p==null)return`
      float `+a+`(int row, int col, int depth, int depth2, int depth3) {
        float texR = dot(
          vec4(row, col, depth, depth2),
          vec4(`+n[1]*n[2]*n[3]+`,
               `+n[2]*n[3]+", "+n[3]+`, 1));
        int texC = depth3;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(`+g+".0, "+v+`.0);
        return sampleTexture(`+o+`, uv);
      }
    `;var y=_n(o);return`
    float `+a+`(int row, int col, int depth, int depth2, int depth3) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * `+l+" + col * "+u+" + depth * "+s+` +
          depth2 * `+i+" + depth3 + "+y+`;
      vec2 uv = uvFromFlat(`+v+", "+g+`, index);
      return sampleTexture(`+o+`, uv);
    }
  `}(r);case 6:return function(e){var n=e.shapeInfo.logicalShape,o=e.name,a="get"+o.charAt(0).toUpperCase()+o.slice(1),i=wn(n),s=i.newShape,u=i.keptDims;if(s.length<n.length){var l=tt(e,s);return`
      `+nt(l)+`
      float `+a+`(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        return `+a+"("+rt(["row","col","depth","depth2","depth3","depth4"],u)+`);
      }
    `}var c=n[5],f=n[4]*c,h=n[3]*f,d=n[2]*h,p=n[1]*d;if(e.shapeInfo.isUniform)return`
      float `+a+`(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
        int index = round(dot(
          vec4(row, col, depth, depth2),
          vec4(`+p+", "+d+", "+h+", "+f+`)) +
          dot(
            vec2(depth3, depth4),
            vec2(`+c+`, 1)));
        `+Jn(e)+`
      }
    `;var m=e.shapeInfo.flatOffset,v=e.shapeInfo.texShape,g=v[0],y=v[1];if(y===p&&m==null)return`
      float `+a+`(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
          vec4(`+d+", "+h+", "+f+", "+c+`)) +
               float(depth4);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(`+y+".0, "+g+`.0);
        return sampleTexture(`+o+`, uv);
      }
    `;if(y===c&&m==null)return`
      float `+a+`(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        float texR = dot(vec4(row, col, depth, depth2),
          vec4(`+n[1]*n[2]*n[3]*n[4]+`,
               `+n[2]*n[3]*n[4]+`,
               `+n[3]*n[4]+`,
               `+n[4]+`)) + float(depth3);
        int texC = depth4;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(`+y+".0, "+g+`.0);
        return sampleTexture(`+o+`, uv);
      }
    `;var x=_n(o);return`
    float `+a+`(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * `+p+" + col * "+d+" + depth * "+h+` +
          depth2 * `+f+" + depth3 * "+c+" + depth4 + "+x+`;
      vec2 uv = uvFromFlat(`+g+", "+y+`, index);
      return sampleTexture(`+o+`, uv);
    }
  `}(r);default:throw new Error(t.length+"-D input sampling is not yet supported")}}function fu(r){var t,e,n;switch(r.shapeInfo.logicalShape.length){case 0:return t=r.name,e="get"+t.charAt(0).toUpperCase()+t.slice(1),n=Oe(),`
    vec4 `+e+`() {
      return `+n.texture2D+"("+t+`, halfCR);
    }
  `;case 1:return function(o){var a=o.name,i="get"+a.charAt(0).toUpperCase()+a.slice(1),s=o.shapeInfo.texShape,u=[Math.ceil(s[0]/2),Math.ceil(s[1]/2)],l=Oe();return`
    vec4 `+i+`(int index) {
      vec2 uv = packedUVfrom1D(
        `+u[0]+", "+u[1]+`, index);
      return `+l.texture2D+"("+a+`, uv);
    }
  `}(r);case 2:return function(o){var a=o.shapeInfo.logicalShape,i=o.name,s="get"+i.charAt(0).toUpperCase()+i.slice(1),u=o.shapeInfo.texShape,l=u[0],c=u[1],f=Oe();if(u!=null&&Re(a,u))return`
      vec4 `+s+`(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(`+c+".0, "+l+`.0);

        return `+f.texture2D+"("+i+`, uv);
      }
    `;var h=[Math.ceil(u[0]/2),Math.ceil(u[1]/2)],d=Math.ceil(a[1]/2);return`
    vec4 `+s+`(int row, int col) {
      vec2 uv = packedUVfrom2D(`+d+", "+h[0]+", "+h[1]+`, row, col);
      return `+f.texture2D+"("+i+`, uv);
    }
  `}(r);case 3:return function(o){var a=o.shapeInfo.logicalShape,i=o.name,s="get"+i.charAt(0).toUpperCase()+i.slice(1),u=o.shapeInfo.texShape,l=[Math.ceil(u[0]/2),Math.ceil(u[1]/2)];if(a[0]===1){var c=a.slice(1),f=tt(o,c);return`
        `+fu(f)+`
        vec4 `+s+`(int b, int row, int col) {
          return `+s+"("+rt(["b","row","col"],[1,2])+`);
        }
      `}var h=l[0],d=l[1],p=Math.ceil(a[2]/2),m=p*Math.ceil(a[1]/2),v=Oe();return`
    vec4 `+s+`(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        `+h+", "+d+", "+m+", "+p+`, b, row, col);
      return `+v.texture2D+"("+i+`, uv);
    }
  `}(r);default:return function(o){for(var a=o.shapeInfo.logicalShape,i=a.length,s=o.name,u="get"+s.charAt(0).toUpperCase()+s.slice(1),l=o.shapeInfo.texShape,c=[Math.ceil(l[0]/2),Math.ceil(l[1]/2)],f=c[0],h=c[1],d=Math.ceil(a[i-1]/2),p=d*Math.ceil(a[i-2]/2),m="int b, int row, int col",v="b * "+p+" + (row / 2) * "+d+" + (col / 2)",g=2;g<i-1;g++)m="int b"+g+", "+m,p*=a[i-g-1],v="b"+g+" * "+p+" + "+v;var y=Oe();return`
    vec4 `+u+"("+m+`) {
      int index = `+v+`;
      int texR = index / `+h+`;
      int texC = index - texR * `+h+`;
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(`+h+", "+f+`);
      return `+y.texture2D+"("+s+`, uv);
    }
  `}(r)}}var Ch=`
vec2 uvFromFlat(int texNumR, int texNumC, int index) {
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
  int texelIndex = index / 2;
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,Eh=`
vec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,
  int texNumC, int row, int col) {
  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,Rh=`
vec2 packedUVfrom3D(int texNumR, int texNumC,
    int texelsInBatch, int texelsInLogicalRow, int b,
    int row, int col) {
  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,Ih=`
  float getChannel(vec4 frag, vec2 innerDims) {
    vec2 modCoord = mod(innerDims, 2.);
    return modCoord.x == 0. ?
      (modCoord.y == 0. ? frag.r : frag.g) :
      (modCoord.y == 0. ? frag.b : frag.a);
  }
  float getChannel(vec4 frag, int dim) {
    float modCoord = mod(float(dim), 2.);
    return modCoord == 0. ? frag.r : frag.g;
  }
`;function _n(r){return"offset"+r}function Jn(r){var t=r.name,e=Y(r.shapeInfo.logicalShape);return e<2?"return "+t+";":`
    for (int i = 0; i < `+e+`; i++) {
      if (i == index) {
        return `+t+`[i];
      }
    }
  `}function pe(r){if(r<=1)return"int";if(r===2)return"ivec2";if(r===3)return"ivec3";if(r===4)return"ivec4";if(r===5)return"ivec5";if(r===6)return"ivec6";throw Error("GPU for rank "+r+" is not yet supported")}function tt(r,t){var e=JSON.parse(JSON.stringify(r));return e.shapeInfo.logicalShape=t,e}function rt(r,t){return t.map(function(e){return r[e]}).join(", ")}var kh=function(r,t,e,n){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,E(r.length>2,function(){return"Packed arg"+(e.charAt(0).toUpperCase()+e.slice(1))+" supports only inputs with rank above 2."});var o=r[r.length-1],a=Math.ceil(o/t);this.outputShape=r.slice(0,-1),a>1&&this.outputShape.push(a),n||this.variableNames.push("bestIndicesA");var i,s,u=this.outputShape,l=u.length,c=pe(l),f=We("coords",l);if(a===1){var h=pe(s=l+1);i=`
        `+h+" sourceLocR = "+h+"("+f.join()+`, 0);
        ++`+f[l-1]+`;
        `+h+" sourceLocG = "+h+"("+f.join()+`, 0);
        ++`+f[l-2]+`;
        `+h+" sourceLocA = "+h+"("+f.join()+`, 0);
        --`+f[l-1]+`;
        `+h+" sourceLocB = "+h+"("+f.join()+`, 0);
        --`+f[l-2]+";"}else s=l,i=`
        `+c+` sourceLocR = coords;
        ++`+f[l-1]+`;
        `+c+` sourceLocG = coords;
        ++`+f[l-2]+`;
        `+c+` sourceLocA = coords;
        --`+f[l-1]+`;
        `+c+` sourceLocB = coords;
        --`+f[l-2]+";";var d=["x","y","z","w","u","v"].slice(0,s),p="."+d[s-1],m=d.map(function(k){return"int "+k}),v=We("sourceLocR",s-1).concat("inIdx.r"),g=We("sourceLocG",s-1).concat("inIdx.g"),y=We("sourceLocB",s-1).concat("inIdx.b"),x=We("sourceLocA",s-1).concat("inIdx.a"),b=e==="max"?"greaterThan":"lessThan",w=n?"":`
          inIdx = round(vec4(getBestIndicesAChannel(`+v.join()+`),
                             getBestIndicesAChannel(`+g.join()+`),
                             getBestIndicesAChannel(`+y.join()+`),
                             getBestIndicesAChannel(`+x.join()+")));",R=`vec4(
            getAChannel(`+v.join()+`),
            hasNextCol ? getAChannel(`+g.join()+`) : 0.,
            hasNextRow ? getAChannel(`+y.join()+`) : 0.,
            hasNextRow && hasNextCol ? getAChannel(`+x.join()+") : 0.)",A=n?"":`
      float getBestIndicesAChannel(`+m.join()+`) {
        return getChannel(getBestIndicesA(`+d.join()+`),
                                          vec2(`+d.slice(-2).join()+`));
      }`;this.userCode=`
      float getAChannel(`+m.join()+`) {
        return getChannel(getA(`+d.join()+`),
                               vec2(`+d.slice(-2).join()+`));
      }
      `+A+`
      void main() {
        `+c+` coords = getOutputCoords();
        bool hasNextCol = `+f[l-1]+" < "+(u[l-1]-1)+`;
        bool hasNextRow = `+f[l-2]+" < "+(u[l-2]-1)+`;
        `+i+`
        ivec4 srcIdx = ivec4(sourceLocR`+p+", sourceLocG"+p+`,
          sourceLocB`+p+", sourceLocA"+p+") * "+t+`;
        ivec4 inIdx = srcIdx;
        vec4 bestIndex = vec4(inIdx);
        vec4 bestValue = `+R+`;

        for (int i = 0; i < `+t+`; i++) {
          inIdx = srcIdx;
          `+w+`
          vec4 candidate = `+R+`;
          bvec4 nan = isnan(candidate);
          bvec4 replace = bvec4(
            vec4(`+b+`(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));

          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,
                           replace.y  ? candidate.y : bestValue.y,
                           replace.z  ? candidate.z : bestValue.z,
                           replace.w  ? candidate.w : bestValue.w);
          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));
          srcIdx++;
        }
        setOutput(bestIndex);
      }
    `},Sh=function(r){this.variableNames=["dy"],this.outputShape=r.inShape;var t=r.filterHeight,e=r.filterWidth,n=r.strideHeight,o=r.strideWidth,a=r.dilationHeight,i=r.dilationWidth,s=r.effectiveFilterHeight,u=r.effectiveFilterWidth,l=s-1-r.padInfo.top,c=u-1-r.padInfo.left,f=1/(t*e);this.userCode=`
      const ivec2 pads = ivec2(`+l+", "+c+`);
      const float avgMultiplier = float(`+f+`);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < `+s+`;
            wR += `+a+`) {
          float dyR = float(dyRCorner + wR) / `+n+`.0;

          if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < `+u+`;
            wC+= `+i+`) {
            float dyC = float(dyCCorner + wC) / `+o+`.0;

            if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);

            dotProd += dyValue * avgMultiplier;
          }
        }
        setOutput(dotProd);
      }
    `},Ah=function(r){this.variableNames=["dy"],this.outputShape=r.inShape;var t=r.filterDepth,e=r.filterHeight,n=r.filterWidth,o=r.strideDepth,a=r.strideHeight,i=r.strideWidth,s=r.dilationDepth,u=r.dilationHeight,l=r.dilationWidth,c=r.effectiveFilterDepth,f=r.effectiveFilterHeight,h=r.effectiveFilterWidth,d=c-1-r.padInfo.front,p=f-1-r.padInfo.top,m=h-1-r.padInfo.left,v=1/(t*e*n);this.userCode=`
      const ivec3 pads = ivec3(`+d+", "+p+", "+m+`);
      const float avgMultiplier = float(`+v+`);

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < `+c+`;
            wD += `+s+`) {
          float dyD = float(dyDCorner + wD) / `+o+`.0;

          if (dyD < 0.0 || dyD >= `+r.outDepth+`.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < `+f+`;
              wR += `+u+`) {
            float dyR = float(dyRCorner + wR) / `+a+`.0;

            if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < `+h+`;
                wC += `+l+`) {
              float dyC = float(dyCCorner + wC) / `+i+`.0;

              if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);

              dotProd += dyValue * avgMultiplier;
            }
          }
        }
        setOutput(dotProd);
      }
    `},Dh=function(r,t,e,n,o,a){this.outputShape=[],this.variableNames=["x","mean","variance"],oe(r,t),oe(r,e);var i="0.0";n!=null&&(oe(r,n),this.variableNames.push("offset"),i="getOffsetAtOutCoords()");var s="1.0";o!=null&&(oe(r,o),this.variableNames.push("scale"),s="getScaleAtOutCoords()"),this.outputShape=r,this.userCode=`
      void main() {
        float x = getXAtOutCoords();
        float mean = getMeanAtOutCoords();
        float variance = getVarianceAtOutCoords();
        float offset = `+i+`;
        float scale = `+s+`;
        float inv = scale * inversesqrt(variance + float(`+a+`));
        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));
      }
    `},Th=function(r,t,e,n,o,a){this.packedInputs=!0,this.packedOutput=!0,this.variableNames=["x","mean","variance"],oe(r,t),oe(r,e);var i="vec4(0.0)";n!=null&&(oe(r,n),this.variableNames.push("offset"),i="getOffsetAtOutCoords()");var s="vec4(1.0)";o!=null&&(oe(r,o),this.variableNames.push("scale"),s="getScaleAtOutCoords()"),this.outputShape=r,this.userCode=`
      void main() {
        vec4 offset = `+i+`;
        vec4 scale = `+s+`;

        vec4 x = getXAtOutCoords();
        vec4 mean = getMeanAtOutCoords();
        vec4 variance = getVarianceAtOutCoords();

        vec4 inv = scale * inversesqrt(variance + vec4(`+a+`));

        setOutput((x - mean) * inv + offset);
      }
    `},Nh="return areal * breal - aimag * bimag;",Fh="return areal * bimag + aimag * breal;",ni=function(r,t,e){this.variableNames=["AReal","AImag","BReal","BImag"],this.outputShape=oe(t,e),this.userCode=`
      float binaryOpComplex(
          float areal, float aimag, float breal, float bimag) {
        `+r+`
      }

      void main() {
        float areal = getARealAtOutCoords();
        float aimag = getAImagAtOutCoords();
        float breal = getBRealAtOutCoords();
        float bimag = getBImagAtOutCoords();
        setOutput(binaryOpComplex(areal, aimag, breal, bimag));
      }
    `},$r="return a + b;",Qr="return a - b;",ti="return a * b;",hu="return (a < 0.) ? b * a : a;",be=function(r,t,e){this.variableNames=["A","B"],this.outputShape=oe(t,e),this.userCode=`
      float binaryOperation(float a, float b) {
        `+r+`
      }

      void main() {
        float a = getAAtOutCoords();
        float b = getBAtOutCoords();
        setOutput(binaryOperation(a, b));
      }
    `},du=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`,fn=function(r,t,e,n){n===void 0&&(n=!1),this.variableNames=["A","B"],this.supportsBroadcasting=!0,this.packedInputs=!0,this.packedOutput=!0,this.outputShape=oe(t,e);var o=this.outputShape.length,a="";if(n)if(o===0||Y(this.outputShape)===1)a=`
          result.y = 0.;
          result.z = 0.;
          result.w = 0.;
        `;else if(a=`
          `+pe(o)+` coords = getOutputCoords();
        `,o===1)a+=`
            result.y = (coords + 1) >= `+this.outputShape[0]+` ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `;else{var i=We("coords",o);a+=`
            bool nextRowOutOfBounds =
              (`+i[o-2]+" + 1) >= "+this.outputShape[o-2]+`;
            bool nextColOutOfBounds =
              (`+i[o-1]+" + 1) >= "+this.outputShape[o-1]+`;
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `}this.userCode=`
      vec4 binaryOperation(vec4 a, vec4 b) {
        `+r+`
      }

      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();

        vec4 result = binaryOperation(a, b);
        `+a+`

        setOutput(result);
      }
    `},_h=function(){function r(t){this.variableNames=["A"],this.outputShape=t,this.userCode=`
      uniform float minVal;
      uniform float maxVal;

      void main() {
        float value = getAAtOutCoords();
        if (isnan(value)) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, minVal, maxVal));
      }
    `}return r.prototype.getCustomSetupFunc=function(t,e){var n=this;return function(o,a){n.minLoc==null&&(n.minLoc=o.getUniformLocationNoThrow(a,"minVal"),n.maxLoc=o.getUniformLocationNoThrow(a,"maxVal")),o.gl.uniform1f(n.minLoc,t),o.gl.uniform1f(n.maxLoc,e)}},r}(),Oh=function(){function r(t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t,this.userCode=`
      uniform float minVal;
      uniform float maxVal;

      void main() {
        vec4 value = getAAtOutCoords();

        if (any(isnan(value))) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, vec4(minVal), vec4(maxVal)));
      }
    `}return r.prototype.getCustomSetupFunc=function(t,e){var n=this;return function(o,a){n.minLoc==null&&(n.minLoc=o.getUniformLocationNoThrow(a,"minVal"),n.maxLoc=o.getUniformLocationNoThrow(a,"maxVal")),o.gl.uniform1f(n.minLoc,t),o.gl.uniform1f(n.maxLoc,e)}},r}(),Mh=function(r){this.variableNames=["real","imag"],this.outputShape=r,this.userCode=`
      void main() {
        float re = abs(getRealAtOutCoords());
        float im = abs(getImagAtOutCoords());
        float mx = max(re, im);

        // sadly the length function in glsl is not underflow-safe
        // (at least not on Intel GPUs). So the safe solution is
        // to ensure underflow-safety in all cases.
        setOutput(
          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))
        );
      }
    `},Bh=function(r){this.outputShape=[],this.outputShape=Vn(r,1),this.variableNames=r.map(function(s,u){return"T"+u});var t=new Array(r.length-1);t[0]=r[0][1];for(var e=1;e<t.length;e++)t[e]=t[e-1]+r[e][1];var n=["if (yC < "+t[0]+") setOutput(getT0(yR, yC));"];for(e=1;e<t.length;e++){var o=t[e-1];n.push("else if (yC < "+t[e]+") setOutput(getT"+e+"(yR, yC-"+o+"));")}var a=t.length,i=t[t.length-1];n.push("else setOutput(getT"+a+"(yR, yC-"+i+"));"),this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int yR = coords.x;
        int yC = coords.y;

        `+n.join(`
        `)+`
      }
    `},Ph=function(r,t){this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[],this.outputShape=Vn(r,t);var e=this.outputShape,n=e.length,o=pe(n),a=We("coords",n),i=["x","y","z","w","u","v"].slice(0,n);this.variableNames=r.map(function(v,g){return"T"+g});var s=new Array(r.length-1);s[0]=r[0][t];for(var u=1;u<s.length;u++)s[u]=s[u-1]+r[u][t];var l=i[t],c=i.slice(-2),f=i.join(),h="if ("+l+" < "+s[0]+`) {
        return getChannel(
            getT0(`+f+"), vec2("+c.join()+`));
        }`;for(u=1;u<s.length;u++){var d=s[u-1];h+=`
        if (`+l+" < "+s[u]+"  && "+l+" >= "+s[u-1]+`) {
          return getChannel(
            getT`+u+"("+$t(i,l,d)+`),
            vec2(`+$t(c,l,d)+`));
        }`}var p=s.length,m=s[s.length-1];h+=`
        return getChannel(
          getT`+p+"("+$t(i,l,m)+`),
          vec2(`+$t(c,l,m)+"));",this.userCode=`
      float getValue(`+i.map(function(v){return"int "+v})+`) {
        `+h+`
      }

      void main() {
        `+o+` coords = getOutputCoords();
        vec4 result = vec4(getValue(`+a+`), 0., 0., 0.);

        `+a[n-1]+" = "+a[n-1]+` + 1;
        if (`+a[n-1]+" < "+e[n-1]+`) {
          result.g = getValue(`+a+`);
        }

        `+a[n-2]+" = "+a[n-2]+` + 1;
        if (`+a[n-2]+" < "+e[n-2]+`) {
          result.a = getValue(`+a+`);
        }

        `+a[n-1]+" = "+a[n-1]+` - 1;
        if (`+a[n-2]+" < "+e[n-2]+` &&
            `+a[n-1]+" < "+e[n-1]+`) {
          result.b = getValue(`+a+`);
        }
        setOutput(result);
      }
    `};function $t(r,t,e){var n=r.indexOf(t);return r.map(function(o,a){return a===n?o+" - "+e:o}).join()}var Lh=function(r){this.variableNames=["x","dy"],this.outputShape=r.filterShape;var t=r.strideHeight,e=r.strideWidth,n=r.padInfo.top,o=r.padInfo.left,a=r.dataFormat==="channelsLast";this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int d2 = coords.w;

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int b = 0; b < `+r.batchSize+`; b++) {
          for (int yR = 0; yR < `+r.outHeight+`; yR++) {
            int xR = wR + yR * `+t+" - "+n+`;

            if (xR < 0 || xR >= `+r.inHeight+`) {
              continue;
            }

            for (int yC = 0; yC < `+r.outWidth+`; yC++) {
              int xC = wC + yC * `+e+" - "+o+`;

              if (xC < 0 || xC >= `+r.inWidth+`) {
                continue;
              }

              if (`+a+`) {
                float dyValue = getDy(b, yR, yC, d2);
                float xValue = getX(b, xR, xC, d1);
                dotProd += (xValue * dyValue);
              } else {
                float dyValue = getDy(b, d2, yR, yC);
                float xValue = getX(b, d1, xR, xC);
                dotProd += (xValue * dyValue);
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `},Wh=function(r){this.variableNames=["dy","W"],this.outputShape=r.inShape;var t=r.filterHeight,e=r.filterWidth,n=r.strideHeight,o=r.strideWidth,a=r.dataFormat==="channelsLast",i=t-1-r.padInfo.top,s=e-1-r.padInfo.left,u=a?1:2,l=a?2:3,c=a?3:1;this.userCode=`
      const ivec2 pads = ivec2(`+i+", "+s+`);

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[`+c+`];

        ivec2 dyCorner = ivec2(coords[`+u+"], coords["+l+`]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < `+t+`; wR++) {
          float dyR = float(dyRCorner + wR) / `+n+`.0;

          if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = `+t+` - 1 - wR;

          for (int wC = 0; wC < `+e+`; wC++) {
            float dyC = float(dyCCorner + wC) / `+o+`.0;

            if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = `+e+` - 1 - wC;

            for (int d2 = 0; d2 < `+r.outChannels+`; d2++) {

              if (`+a+`) {
                float xValue = getDy(batch, idyR, idyC, d2);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              } else {
                float xValue = getDy(batch, d2, idyR, idyC);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `},Uh=function(r){this.variableNames=["x","dy"],this.outputShape=r.filterShape;var t=r.strideDepth,e=r.strideHeight,n=r.strideWidth,o=r.padInfo.front,a=r.padInfo.top,i=r.padInfo.left;this.userCode=`
      void main() {
        ivec5 coords = getOutputCoords();
        int wF = coords.x;
        int wR = coords.y;
        int wC = coords.z;
        int d1 = coords.w;
        int d2 = coords.u;

        float dotProd = 0.0;

        for (int b = 0; b < `+r.batchSize+`; b++) {
          for (int yF = 0; yF < `+r.outDepth+`; yF++) {
            int xF = wF + yF * `+t+" - "+o+`;

            if (xF < 0 || xF >= `+r.inDepth+`) {
              continue;
            }

            for (int yR = 0; yR < `+r.outHeight+`; yR++) {
              int xR = wR + yR * `+e+" - "+a+`;

              if (xR < 0 || xR >= `+r.inHeight+`) {
                continue;
              }

              for (int yC = 0; yC < `+r.outWidth+`; yC++) {
                int xC = wC + yC * `+n+" - "+i+`;

                if (xC < 0 || xC >= `+r.inWidth+`) {
                  continue;
                }

                float dyValue = getDy(b, yF, yR, yC, d2);
                float xValue = getX(b, xF, xR, xC, d1);
                dotProd += (xValue * dyValue);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `},zh=function(r){this.variableNames=["dy","W"],this.outputShape=r.inShape;var t=r.filterDepth,e=r.filterHeight,n=r.filterWidth,o=r.strideDepth,a=r.strideHeight,i=r.strideWidth,s=t-1-r.padInfo.front,u=e-1-r.padInfo.top,l=n-1-r.padInfo.left;this.userCode=`
      const ivec3 pads = ivec3(`+s+", "+u+", "+l+`);

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.u;


        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyFCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        float dotProd = 0.0;
        for (int wF = 0; wF < `+t+`; wF++) {
          float dyF = float(dyFCorner + wF) / `+o+`.0;

          if (dyF < 0.0 || dyF >= `+r.outDepth+`.0 || fract(dyF) > 0.0) {
            continue;
          }
          int idyF = int(dyF);

          int wFPerm = `+t+` - 1 - wF;

          for (int wR = 0; wR < `+e+`; wR++) {
            float dyR = float(dyRCorner + wR) / `+a+`.0;

            if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 ||
              fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            int wRPerm = `+e+` - 1 - wR;

            for (int wC = 0; wC < `+n+`; wC++) {
              float dyC = float(dyCCorner + wC) / `+i+`.0;

              if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              int wCPerm = `+n+` - 1 - wC;

              for (int d2 = 0; d2 < `+r.outChannels+`; d2++) {
                float xValue = getDy(batch, idyF, idyR, idyC, d2);
                float wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `},Vh=function(r){this.variableNames=["x","dy"],this.outputShape=r.filterShape;var t=r.strideHeight,e=r.strideWidth,n=r.padInfo.top,o=r.padInfo.left,a=r.outChannels/r.inChannels;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int dm = coords.w;
        int d2 = d1 * `+a+` + dm;

        float dotProd = 0.0;

        // TO DO: Vec4 over the batch size
        for (int b = 0; b < `+r.batchSize+`; b++) {
          for (int yR = 0; yR < `+r.outHeight+`; yR++) {
            int xR = wR + yR * `+t+" - "+n+`;

            if (xR < 0 || xR >= `+r.inHeight+`) {
              continue;
            }

            for (int yC = 0; yC < `+r.outWidth+`; yC++) {
              int xC = wC + yC * `+e+" - "+o+`;

              if (xC < 0 || xC >= `+r.inWidth+`) {
                continue;
              }

              float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);
            }
          }
        }
        setOutput(dotProd);
      }
    `},Gh=function(r){this.variableNames=["dy","W"],this.outputShape=r.inShape;var t=r.filterHeight,e=r.filterWidth,n=r.strideHeight,o=r.strideWidth,a=t-1-r.padInfo.top,i=e-1-r.padInfo.left,s=r.outChannels/r.inChannels;this.userCode=`
      const ivec2 pads = ivec2(`+a+", "+i+`);

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];
        ivec2 dyCorner = coords.yz - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        float dotProd = 0.0;

        for (int wR = 0; wR < `+t+`; wR++) {
          float dyR = float(dyRCorner + wR) / `+n+`.0;

          if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = `+t+` - 1 - wR;

          for (int wC = 0; wC < `+e+`; wC++) {
            float dyC = float(dyCCorner + wC) / `+o+`.0;

            if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = `+e+` - 1 - wC;

            // TO DO: Vec4 over the channelMul
            for (int dm = 0; dm < `+s+`; dm++) {
              int d2 = d1 * `+s+` + dm;
              float xValue = getDy(batch, idyR, idyC, d2);
              float wValue = getW(wRPerm, wCPerm, d1, dm);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutput(dotProd);
      }
    `},ri=function(r,t,e,n){t===void 0&&(t=!1),e===void 0&&(e=null),n===void 0&&(n=!1),this.variableNames=["x","W"],this.outputShape=r.outShape;var o=r.padInfo.top,a=r.padInfo.left,i=r.strideHeight,s=r.strideWidth,u=r.dilationHeight,l=r.dilationWidth,c=r.filterHeight,f=r.filterWidth,h=4*Math.floor(r.inChannels/4),d=r.inChannels%4,p=r.dataFormat==="channelsLast",m=p?1:2,v=p?2:3,g=p?3:1,y="",x="";e&&(y=n?`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          `+e+`
        }`:`
          float activation(float x) {
            `+e+`
          }
        `,x="result = activation(result);");var b=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),this.userCode=`
      `+y+`

      const ivec2 strides = ivec2(`+i+", "+s+`);
      const ivec2 pads = ivec2(`+o+", "+a+`);

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d2 = coords[`+g+`];

        ivec2 xRCCorner =
            ivec2(coords[`+m+"], coords["+v+`]) * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < `+c+`; wR++) {
          int xR = xRCorner + wR * `+u+`;

          if (xR < 0 || xR >= `+r.inHeight+`) {
            continue;
          }

          for (int wC = 0; wC < `+f+`; wC++) {
            int xC = xCCorner + wC * `+l+`;

            if (xC < 0 || xC >= `+r.inWidth+`) {
              continue;
            }

            for (int d1 = 0; d1 < `+h+`; d1 += 4) {
              vec4 wValues = vec4(
                getW(wR, wC, d1, d2),
                getW(wR, wC, d1 + 1, d2),
                getW(wR, wC, d1 + 2, d2),
                getW(wR, wC, d1 + 3, d2)
              );

              if (`+p+`) {
                vec4 xValues = vec4(
                  getX(batch, xR, xC, d1),
                  getX(batch, xR, xC, d1 + 1),
                  getX(batch, xR, xC, d1 + 2),
                  getX(batch, xR, xC, d1 + 3)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec4 xValues = vec4(
                  getX(batch, d1, xR, xC),
                  getX(batch, d1 + 1, xR, xC),
                  getX(batch, d1 + 2, xR, xC),
                  getX(batch, d1 + 3, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }
            }

            if (`+(d===1)+`) {

              if (`+p+`) {
                dotProd +=
                    getX(batch, xR, xC, `+h+`) *
                    getW(wR, wC, `+h+`, d2);
              } else {
                dotProd +=
                    getX(batch, `+h+`, xR, xC) *
                    getW(wR, wC, `+h+`, d2);
              }

            } else if (`+(d===2)+`) {
              vec2 wValues = vec2(
                getW(wR, wC, `+h+`, d2),
                getW(wR, wC, `+h+` + 1, d2)
              );

              if (`+p+`) {
                vec2 xValues = vec2(
                  getX(batch, xR, xC, `+h+`),
                  getX(batch, xR, xC, `+h+` + 1)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec2 xValues = vec2(
                  getX(batch, `+h+`, xR, xC),
                  getX(batch, `+h+` + 1, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            } else if (`+(d===3)+`) {
              vec3 wValues = vec3(
                getW(wR, wC, `+h+`, d2),
                getW(wR, wC, `+h+` + 1, d2),
                getW(wR, wC, `+h+` + 2, d2)
              );

              if (`+p+`) {
                vec3 xValues = vec3(
                  getX(batch, xR, xC, `+h+`),
                  getX(batch, xR, xC, `+h+` + 1),
                  getX(batch, xR, xC, `+h+` + 2)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec3 xValues = vec3(
                  getX(batch, `+h+`, xR, xC),
                  getX(batch, `+h+` + 1, xR, xC),
                  getX(batch, `+h+` + 2, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            }
          }
        }

        float result = dotProd;
        `+b+`
        `+x+`
        setOutput(result);
      }
    `},Hh=function(r){this.variableNames=["x","W"],this.outputShape=r.outShape;var t=r.padInfo.front,e=r.padInfo.top,n=r.padInfo.left,o=r.strideDepth,a=r.strideHeight,i=r.strideWidth,s=r.dilationDepth,u=r.dilationHeight,l=r.dilationWidth,c=r.filterDepth,f=r.filterHeight,h=r.filterWidth,d=4*Math.floor(r.inChannels/4),p=r.inChannels%4;this.userCode=`
      const ivec3 strides = ivec3(`+o+", "+a+", "+i+`);
      const ivec3 pads = ivec3(`+t+", "+e+", "+n+`);

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d2 = coords.u;

        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xFCorner = xFRCCorner.x;
        int xRCorner = xFRCCorner.y;
        int xCCorner = xFRCCorner.z;

        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get
        // y(yF, yR, yC, d2). ? = to be determined. : = across all
        // values in that axis.
        float dotProd = 0.0;
        for (int wF = 0; wF < `+c+`; wF++) {
          int xF = xFCorner + wF * `+s+`;

          if (xF < 0 || xF >= `+r.inDepth+`) {
            continue;
          }

          for (int wR = 0; wR < `+f+`; wR++) {
            int xR = xRCorner + wR * `+u+`;

            if (xR < 0 || xR >= `+r.inHeight+`) {
              continue;
            }

            for (int wC = 0; wC < `+h+`; wC++) {
              int xC = xCCorner + wC * `+l+`;

              if (xC < 0 || xC >= `+r.inWidth+`) {
                continue;
              }

              for (int d1 = 0; d1 < `+d+`; d1 += 4) {
                vec4 xValues = vec4(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                vec4 wValues = vec4(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (`+(p===1)+`) {
                dotProd +=
                  getX(batch, xF, xR, xC, `+d+`) *
                  getW(wF, wR, wC, `+d+`, d2);
              } else if (`+(p===2)+`) {
                vec2 xValues = vec2(
                  getX(batch, xF, xR, xC, `+d+`),
                  getX(batch, xF, xR, xC, `+d+` + 1)
                );
                vec2 wValues = vec2(
                  getW(wF, wR, wC, `+d+`, d2),
                  getW(wF, wR, wC, `+d+` + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (`+(p===3)+`) {
                vec3 xValues = vec3(
                  getX(batch, xF, xR, xC, `+d+`),
                  getX(batch, xF, xR, xC, `+d+` + 1),
                  getX(batch, xF, xR, xC, `+d+` + 2)
                );
                vec3 wValues = vec3(
                  getW(wF, wR, wC, `+d+`, d2),
                  getW(wF, wR, wC, `+d+` + 1, d2),
                  getW(wF, wR, wC, `+d+` + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `},oi=function(r,t,e,n){t===void 0&&(t=!1),e===void 0&&(e=null),n===void 0&&(n=!1),this.variableNames=["x","W"],this.outputShape=r.outShape;var o=r.inHeight,a=r.inWidth,i=r.padInfo.top,s=r.padInfo.left,u=r.strideHeight,l=r.strideWidth,c=r.dilationHeight,f=r.dilationWidth,h=r.filterHeight,d=r.filterWidth,p=r.outChannels/r.inChannels,m="",v="";e&&(m=n?`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          `+e+`
        }`:`
          float activation(float x) {
            `+e+`
          }
        `,v="result = activation(result);");var g=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),this.userCode=`
      `+m+`

      const ivec2 strides = ivec2(`+u+", "+l+`);
      const ivec2 pads = ivec2(`+i+", "+s+`);

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / `+p+`;
        int q = d2 - d1 * `+p+`;

        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        // TO DO(dsmilkov): Flatten the two for loops and vec4 the operations.
        for (int wR = 0; wR < `+h+`; wR++) {
          int xR = xRCorner + wR * `+c+`;

          if (xR < 0 || xR >= `+o+`) {
            continue;
          }

          for (int wC = 0; wC < `+d+`; wC++) {
            int xC = xCCorner + wC * `+f+`;

            if (xC < 0 || xC >= `+a+`) {
              continue;
            }

            float xVal = getX(batch, xR, xC, d1);
            float wVal = getW(wR, wC, d1, q);
            dotProd += xVal * wVal;
          }
        }

        float result = dotProd;
        `+g+`
        `+v+`
        setOutput(result);
      }
    `},ai=function(r,t,e,n){t===void 0&&(t=!1),e===void 0&&(e=null),n===void 0&&(n=!1),this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=r.outShape;for(var o=r.inHeight,a=r.inWidth,i=r.padInfo.top,s=r.padInfo.left,u=r.strideHeight,l=r.strideWidth,c=r.dilationHeight,f=r.dilationWidth,h=r.filterHeight,d=r.filterWidth,p=d,m="int xR; int xC; int xCOffset;",v=0;v<h;v++)for(var g=0;g<d;g++)m+=`
          vec4 xTexelR`+v+"C"+2*g+` = vec4(0.);
          vec4 wR`+v+"C"+g+` = vec4(0.);
          vec4 xR`+v+"C"+g+" = vec4(0.);";for(v=0;v<h;v++)for(var y=0;y<p;y++){if(m+=`
          xR = xRCorner + `+v*c+`;
          xC = xCCorner + `+(g=2*y)*f+`;
        `,l===1){if(g<d&&(m+=s%2==1?`
                xCOffset = xC + 1;
                if(xR >= 0 && xR < `+o+" && xCOffset >= 0 && xCOffset < "+a+`) {
                  xTexelR`+v+"C"+g+` = getX(batch, xR, xCOffset, d1);

                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if(xCOffset + 1 >= `+a+`) {
                    xTexelR`+v+"C"+g+`.zw = vec2(0.);
                  }
                } else {
                  xTexelR`+v+"C"+g+` = vec4(0.);
                }

                xCOffset = xC + 1 - 2;
                if(xR >= 0 && xR < `+o+" && xCOffset >= 0 && xCOffset < "+a+`) {
                  vec4 previous = getX(batch, xR, xCOffset, d1);

                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if(xCOffset + 1 >= `+a+`) {
                    previous.zw = vec2(0.);
                  }

                  xR`+v+"C"+g+" = vec4(previous.zw, xTexelR"+v+"C"+g+`.xy);
                } else {
                  xR`+v+"C"+g+" = vec4(0, 0, xTexelR"+v+"C"+g+`.xy);
                }
              `:`
                if(xR >= 0 && xR < `+o+" && xC >= 0 && xC < "+a+`) {
                  xTexelR`+v+"C"+g+` = getX(batch, xR, xC, d1);
                } else {
                  xTexelR`+v+"C"+g+` = vec4(0.);
                }

                xR`+v+"C"+g+" = xTexelR"+v+"C"+g+`;
              `,g+1<d)){var x=s%2==0?Wo(f):f;f%2==0&&s%2==1||f%2!=0&&s%2!=1?(m+=`
                  xCOffset = xC + `+s%2+" + "+x+`;

                  if(xR >= 0 && xR < `+o+` &&
                    xCOffset >= 0 && xCOffset < `+a+`) {
                    xTexelR`+v+"C"+(g+2)+` = getX(batch, xR, xCOffset, d1);
                  }
                `,f>1&&(m+=`
                    xCOffset -= 2;
                    if(xR >= 0 && xR < `+o+` &&
                      xCOffset >= 0 && xCOffset < `+a+`) {
                      xTexelR`+v+"C"+g+` = getX(batch, xR, xCOffset, d1);
                    } else {
                      xTexelR`+v+"C"+g+` = vec4(0.);
                    }
                  `),m+=`
                  xR`+v+"C"+(g+1)+` = vec4(
                    xTexelR`+v+"C"+g+".zw, xTexelR"+v+"C"+(g+2)+`.xy);
                `):m+=`
                  xCOffset = xC + `+x+`;

                  if(xR >= 0 && xR < `+o+` &&
                    xCOffset >= 0 && xCOffset < `+a+`) {
                    xTexelR`+v+"C"+(g+2)+` = getX(batch, xR, xCOffset, d1);
                  }

                  xR`+v+"C"+(g+1)+" = xTexelR"+v+"C"+(g+2)+`;
                `}}else g<d&&(m+=`
              if(xR >= 0 && xR < `+o+`) {
            `,s%2==1?(m+=`
                xCOffset = xC + 1 - `+l+`;
                if(xCOffset >= 0 && xCOffset < `+a+`) {
                  xTexelR`+v+"C"+g+` = getX(batch, xR, xCOffset, d1);
                } else {
                  xTexelR`+v+"C"+g+` = vec4(0.);
                }

                if(xC + 1 >= 0 && xC + 1 < `+a+`) {
                  xTexelR`+v+"C"+(g+2)+` = getX(batch, xR, xC + 1, d1);
                } else {
                  xTexelR`+v+"C"+(g+2)+` = vec4(0.);
                }

                xR`+v+"C"+g+` = vec4(
                  xTexelR`+v+"C"+g+".zw, xTexelR"+v+"C"+(g+2)+`.zw);
              `,g+1<d&&(m+=`
                  vec4 final = vec4(0.);
                  xCOffset = xC + 1 + `+l+`;
                  if(xCOffset >= 0 && xCOffset < `+a+`) {
                    final = getX(batch, xR, xCOffset, d1);
                  }
                  xR`+v+"C"+(g+1)+" = vec4(xTexelR"+v+"C"+(g+2)+`.xy, final.xy);
                `)):(m+=`
                if(xC >= 0 && xC < `+a+`) {
                  xTexelR`+v+"C"+g+` = getX(batch, xR, xC, d1);
                } else {
                  xTexelR`+v+"C"+g+` = vec4(0.);
                }

                xCOffset = xC + `+l+`;
                if(xCOffset >= 0 && xCOffset < `+a+`) {
                  xTexelR`+v+"C"+(g+2)+` = getX(batch, xR, xCOffset, d1);
                } else {
                  xTexelR`+v+"C"+(g+2)+` = vec4(0.);
                }

                xR`+v+"C"+g+` = vec4(
                  xTexelR`+v+"C"+g+".xy, xTexelR"+v+"C"+(g+2)+`.xy);
              `,g+1<d&&(m+=`
                  xR`+v+"C"+(g+1)+` = vec4(
                    xTexelR`+v+"C"+g+".zw, xTexelR"+v+"C"+(g+2)+`.zw);
                `)),m+="}");g<d&&(m+=`
            vec4 wTexelR`+v+"C"+g+" = getW("+v+", "+g+`, d1, q);
            wR`+v+"C"+g+" = vec4(wTexelR"+v+"C"+g+".xz, wTexelR"+v+"C"+g+`.xz);
          `,g+1<d&&(m+=`
              vec4 wTexelR`+v+"C"+(g+1)+" = getW("+v+", "+(g+1)+`, d1, q);
              wR`+v+"C"+(g+1)+` =
                vec4(wTexelR`+v+"C"+(g+1)+".xz, wTexelR"+v+"C"+(g+1)+".xz);"))}for(v=0;v<h;v++)for(g=0;g<d;g++)m+="dotProd += xR"+v+"C"+g+" * wR"+v+"C"+g+";";var b="",w="";e&&(b=n?`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          `+e+`
        }`:`vec4 activation(vec4 x) {
          `+e+`
        }`,w="result = activation(result);");var R=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),this.userCode=`
      `+b+`

      const ivec2 strides = ivec2(`+u+", "+l+`);
      const ivec2 pads = ivec2(`+i+", "+s+`);

      void main() {

        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2;
        int q = 0;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        vec4 dotProd = vec4(0.);

        `+m+`

        vec4 result = dotProd;
        `+R+`
        `+w+`
        setOutput(result);
      }
    `},qh=function(r,t,e,n,o){this.variableNames=["Image","Boxes","BoxInd"],this.outputShape=[];var a=r[0],i=r[1],s=r[2],u=r[3],l=t[0],c=e[0],f=e[1];this.outputShape=[l,c,f,u];var h=n==="bilinear"?1:0,d=[i-1+".0",s-1+".0"],p=d[0],m=d[1],v=c>1?[""+(i-1)/(c-1),"(y2-y1) * height_ratio","y1*"+p+" + float(y)*(height_scale)"]:["0.0","0.0","0.5 * (y1+y2) * "+p],g=v[0],y=v[1],x=v[2],b=f>1?[""+(s-1)/(f-1),"(x2-x1) * width_ratio","x1*"+m+" + float(x)*(width_scale)"]:["0.0","0.0","0.5 * (x1+x2) * "+m],w=b[0],R=b[1],A=b[2];this.userCode=`
      const float height_ratio = float(`+g+`);
      const float width_ratio = float(`+w+`);
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int y = coords[1];
        int x = coords[2];
        int d = coords[3];

        // get box vals
        float y1 = getBoxes(b,0);
        float x1 = getBoxes(b,1);
        float y2 = getBoxes(b,2);
        float x2 = getBoxes(b,3);

        // get image in batch index
        int bInd = round(getBoxInd(b));
        if(bInd < 0 || bInd >= `+a+`) {
          return;
        }

        float height_scale = `+y+`;
        float width_scale = `+R+`;

        float in_y = `+x+`;
        if( in_y < 0.0 || in_y > `+p+` ) {
          setOutput(float(`+o+`));
          return;
        }
        float in_x = `+A+`;
        if( in_x < 0.0 || in_x > `+m+` ) {
          setOutput(float(`+o+`));
          return;
        }

        vec2 sourceFracIndexCR = vec2(in_x,in_y);
        if(`+h+` == 1) {
          // Compute the four integer indices.
          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);
          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));

          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);
          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);
          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);
          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);

          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);

          float top = topLeft + (topRight - topLeft) * fracCR.x;
          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          float newValue = top + (bottom - top) * fracCR.y;
          setOutput(newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          ivec2 sourceNearestCR = ivec2(floor(
            sourceFracIndexCR + vec2(0.5,0.5)));
          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutput(newValue);
        }
      }
    `},Kh=function(r,t,e){this.variableNames=["x"],this.outputShape=r;var n=r.length,o=r[r.length-1],a=e?"<":">";this.userCode=`
      int getIndex(int i) {
        `+(e?"return "+o+" -i - 1;":"return i;")+`
      }

      void main() {
        `+pe(n)+` coords = getOutputCoords();
        int end = `+ii(n,"coords")+`;
        float val = 0.0;
        for (int i = `+o+` - 1; i >= 0; i -= 1) {
          int idx = getIndex(i);
          if (idx `+a+` end) {
            continue;
          }
          if (idx == end && `+t+`) {
            continue;
          }
          `+ii(n,"coords")+` = idx;
          val += getX(`+function(i,s){if(i===1)return""+s;if(i===2)return s+".x, "+s+".y";if(i===3)return s+".x, "+s+".y, "+s+".z";if(i===4)return s+".x, "+s+".y, "+s+".z, "+s+".w";throw Error("Cumulative sum for rank "+i+" is not yet supported")}(n,"coords")+`);
        }
        setOutput(val);
      }
    `};function ii(r,t){if(r===1)return""+t;if(r===2)return t+".y";if(r===3)return t+".z";if(r===4)return t+".w";throw Error("Cumulative sum for rank "+r+" is not yet supported")}var jh=function(r){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outPackingScheme=Ft.DENSE;var t=kt(r),e=Oe();this.outputShape=r,this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        `+Pn(["r","c","d"],r)+`
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx *
          vec2(`+t[0]+", "+t[1]+`));
        int index = 4 * (resTexRC.x * `+t[1]+` + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getA(rc.x, rc.y, rc.z);
        }

        `+e.output+` = result;
      }
    `},Xh=function(r){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outPackingScheme=Ft.DENSE;var t=kt(r),e=Oe();this.outputShape=r,this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        `+Pn(["r","c","d"],r)+`
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx *
          vec2(`+t[0]+", "+t[1]+`));
        int index = 4 * (resTexRC.x * `+t[1]+` + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getChannel(getA(rc.x, rc.y, rc.z), vec2(rc.y, rc.z));
        }

        `+e.output+` = result;
      }
    `},Yh=function(){function r(t,e,n){this.variableNames=["x"],this.outputShape=[],this.outputShape=t,this.blockSize=e,this.dataFormat=n,this.userCode=`
    void main() {
      ivec4 coords = getOutputCoords();
      int b = coords[0];
      int h = `+this.getHeightCoordString()+`;
      int w = `+this.getWidthCoordString()+`;
      int d = `+this.getDepthCoordString()+`;

      int in_h = h / `+e+`;
      int offset_h = imod(h, `+e+`);
      int in_w = w / `+e+`;
      int offset_w = imod(w, `+e+`);
      int offset_d = (offset_h * `+e+` + offset_w) *
        `+this.getOutputDepthSize()+`;
      int in_d = d + offset_d;

      float result = `+this.getInputSamplingString()+`;
      setOutput(result);
    }
  `}return r.prototype.getHeightCoordString=function(){return this.dataFormat==="NHWC"?"coords[1]":"coords[2]"},r.prototype.getWidthCoordString=function(){return this.dataFormat==="NHWC"?"coords[2]":"coords[3]"},r.prototype.getDepthCoordString=function(){return this.dataFormat==="NHWC"?"coords[3]":"coords[1]"},r.prototype.getOutputDepthSize=function(){return this.dataFormat==="NHWC"?this.outputShape[3]:this.outputShape[1]},r.prototype.getInputSamplingString=function(){return this.dataFormat==="NHWC"?"getX(b, in_h, in_w, in_d)":"getX(b, in_d, in_h, in_w)"},r}(),$h=function(r){this.variableNames=["X"],this.outputShape=[r,r],this.userCode=`
      void main() {
          ivec2 coords = getOutputCoords();
          float val = coords[0] == coords[1] ? getX(coords[0]) : 0.0;
          setOutput(val);
      }
    `},Qh=function(r){this.variableNames=["A"],this.outTexUsage=Ge.DOWNLOAD;var t=Oe();this.outputShape=r,this.userCode=`
      `+cu+`

      void main() {
        float x = getAAtOutCoords();
        `+t.output+` = encode_float(x);
      }
    `},Jh=function(r){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outTexUsage=Ge.DOWNLOAD;var t=Oe();this.outputShape=r,this.userCode=`
      `+cu+`

      void main() {
        ivec3 coords = getOutputCoords();
        float x = getChannel(getAAtOutCoords(), vec2(coords.y, coords.z));
        `+t.output+` = encode_float(x);
      }
    `},Zh=function(r,t,e){e===void 0&&(e=!1),this.variableNames=["A"];var n=Oe(),o=t[0],a=t[1];this.outputShape=r;var i="result";e&&(i="floor(result * 255. + 0.5)"),this.userCode=`
      `+pa(r)+`

      void main() {
        ivec3 coords = getOutputCoords();

        int flatIndex = getFlatIndex(coords);
        int offset = imod(flatIndex, 4);

        flatIndex = idiv(flatIndex, 4, 1.);
        
        int r = flatIndex / `+a+`;
        int c = imod(flatIndex, `+a+`);
        vec2 uv = (vec2(c, r) + halfCR) / vec2(`+a+".0, "+o+`.0);
        vec4 values = `+n.texture2D+`(A, uv);

        float result;

        if(offset == 0) {
          result = values[0];
        } else if(offset == 1) {
          result = values[1];
        } else if(offset == 2) {
          result = values[2];
        } else {
          result = values[3];
        }

        `+n.output+" = vec4("+i+`, 0., 0., 0.);
      }
    `},ed=function(r,t,e){e===void 0&&(e=!1),this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0;var n=Oe(),o=t[0],a=t[1];this.outputShape=r;var i="",s="result";e&&(s="floor(result * 255. + 0.5)");for(var u=0;u<=1;u++)for(var l=0;l<=1;l++){var c=2*u+l;i+=`
          localCoords = coords;
          if(localCoords[2] + `+l+" < "+r[2]+`) {
            localCoords[2] += `+l+`;
            if(localCoords[1] + `+u+" < "+r[1]+`) {
              localCoords[1] += `+u+`;

              flatIndex = getFlatIndex(localCoords);
              offset = imod(flatIndex, 4);

              flatIndex = idiv(flatIndex, 4, 1.);

              r = flatIndex / `+a+`;
              c = imod(flatIndex, `+a+`);
              uv = (vec2(c, r) + halfCR) / vec2(`+a+".0, "+o+`.0);
              values = `+n.texture2D+`(A, uv);

              if(offset == 0) {
                result[`+c+`] = values[0];
              } else if(offset == 1) {
                result[`+c+`] = values[1];
              } else if(offset == 2) {
                result[`+c+`] = values[2];
              } else {
                result[`+c+`] = values[3];
              }
            }
          }
        `}this.userCode=`
      `+pa(r)+`

      void main() {
        ivec3 coords = getOutputCoords();

        vec4 result = vec4(0.);
        int flatIndex, r, c, offset;
        ivec3 localCoords;
        vec2 uv;
        vec4 values;

        `+i+`

        `+n.output+" = "+s+`;
      }
    `},nd="return real * expR - imag * expI;",td="return real * expI + imag * expR;",si=function(r,t,e){this.variableNames=["real","imag"];var n=t[1];this.outputShape=t;var o=e?"2.0 * "+Math.PI:"-2.0 * "+Math.PI,a=e?n+".0":"1.0";this.userCode=`
      const float exponentMultiplier = `+o+`;

      float unaryOpComplex(float real, float expR, float imag, float expI) {
        `+r+`
      }

      float mulMatDFT(int batch, int index) {
        float indexRatio = float(index) / float(`+n+`);
        float exponentMultiplierTimesIndexRatio =
            exponentMultiplier * indexRatio;

        float result = 0.0;

        for (int i = 0; i < `+n+`; i++) {
          // x = (-2|2 * PI / N) * index * i;
          float x = exponentMultiplierTimesIndexRatio * float(i);
          float expR = cos(x);
          float expI = sin(x);
          float real = getReal(batch, i);
          float imag = getImag(batch, i);

          result +=
              unaryOpComplex(real, expR, imag, expI) / `+a+`;
        }

        return result;
      }

      void main() {
        ivec2 coords = getOutputCoords();
        setOutput(mulMatDFT(coords[0], coords[1]));
      }
    `},rd=function(){function r(t,e){this.outputShape=[],this.variableNames=["x"],this.outputShape=t,this.userCode=`
      uniform float value;
      void main() {
        // Input can be obtained from uniform value.
        setOutput(value);
      }
    `}return r.prototype.getCustomSetupFunc=function(t){var e=this;return function(n,o){e.valueLoc==null&&(e.valueLoc=n.getUniformLocationNoThrow(o,"value")),n.gl.uniform1f(e.valueLoc,t)}},r}(),od=function(r,t,e){this.variableNames=["A","indices"];var n=r.slice();n[e]=t,this.outputShape=n,this.rank=n.length;var o=pe(this.rank),a=function(i,s){var u=i.length;if(u>4)throw Error("Gather for rank "+u+" is not yet supported");if(u===1)return"int(getIndices(resRC))";for(var l=["resRC.x","resRC.y","resRC.z","resRC.w"],c=[],f=0;f<i.length;f++)f===s?c.push("int(getIndices("+l[f]+"))"):c.push(""+l[f]);return c.join()}(r,e);this.userCode=`
      void main() {
        `+o+` resRC = getOutputCoords();
        setOutput(getA(`+a+`));
      }
    `},ad=function(r,t,e){this.sliceDim=r,this.strides=t,this.variableNames=["x","indices"],this.outputShape=e;var n=pe(t.length),o=pe(e.length),a=this.sliceDim>1?"strides[j]":"strides";this.userCode=`
        `+n+" strides = "+n+"("+this.strides+`);
         void main() {
          `+o+` coords = getOutputCoords();
          int flattenIndex = 0;
          for (int j = 0; j < `+this.sliceDim+`; j++) {
            int index = round(getIndices(coords[0], j));
            flattenIndex += index * `+a+`;
          }
          setOutput(getX(flattenIndex, coords[1]));
        }
      `};function pu(r,t){var e=Oe();return ns(r,t,e.version+`
    precision highp float;
    `+e.attribute+` vec3 clipSpacePos;
    `+e.attribute+` vec2 uv;
    `+e.varyingVs+` vec2 resultUV;

    void main() {
      gl_Position = vec4(clipSpacePos, 1);
      resultUV = uv;
    }`)}function vu(r,t){return as(r,t,new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0]))}function mu(r,t){return is(r,t,new Uint16Array([0,1,2,2,1,3]))}function qt(r,t,e,n,o,a,i){us(e,n);var s=ss(r,t),u=r.TEXTURE_2D;return K(r,t,function(){return r.bindTexture(u,s)}),K(r,t,function(){return r.texParameteri(u,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE)}),K(r,t,function(){return r.texParameteri(u,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}),K(r,t,function(){return r.texParameteri(u,r.TEXTURE_MIN_FILTER,r.NEAREST)}),K(r,t,function(){return r.texParameteri(u,r.TEXTURE_MAG_FILTER,r.NEAREST)}),K(r,t,function(){return r.texImage2D(u,0,o,e,n,0,a,i,null)}),K(r,t,function(){return r.bindTexture(r.TEXTURE_2D,null)}),s}function gu(r,t,e,n,o){var a=br(e,n);return qt(r,t,a[0],a[1],o.internalFormatFloat,o.textureFormatFloat,r.FLOAT)}function yu(r,t,e,n,o){var a=br(e,n);return qt(r,t,a[0],a[1],o.internalFormatHalfFloat,o.textureFormatFloat,o.textureTypeHalfFloat)}function xu(r,t,e,n,o){var a=br(e,n);return qt(r,t,a[0],a[1],r.RGBA,r.RGBA,r.UNSIGNED_BYTE)}function bu(r,t,e,n,o){var a=Gt(e,n);return qt(r,t,a[0],a[1],o.internalFormatPackedFloat,r.RGBA,r.FLOAT)}function wu(r,t,e,n,o){var a=Gt(e,n);return qt(r,t,a[0],a[1],o.internalFormatPackedHalfFloat,r.RGBA,o.textureTypeHalfFloat)}function Cu(r,t,e,n){return K(r,t,function(){return r.bindBuffer(r.ARRAY_BUFFER,n)}),Eo(r,t,e,"clipSpacePos",n,3,20,0)&&Eo(r,t,e,"uv",n,2,20,12)}function Eu(r,t,e,n,o,a,i){var s,u,l;K(r,t,function(){return r.bindTexture(r.TEXTURE_2D,e)}),a instanceof Uint8Array?(s=new Uint8Array(n*o*4),u=r.UNSIGNED_BYTE,l=r.RGBA):(s=new Float32Array(n*o*4),u=r.FLOAT,l=i.internalFormatPackedFloat),s.set(a),K(r,t,function(){return r.texImage2D(r.TEXTURE_2D,0,l,n,o,0,r.RGBA,u,s)}),K(r,t,function(){return r.bindTexture(r.TEXTURE_2D,null)})}function Ru(r,t,e,n){K(r,t,function(){return r.bindTexture(r.TEXTURE_2D,e)}),n.data instanceof Uint8Array?K(r,t,function(){return r.texImage2D(r.TEXTURE_2D,0,r.RGBA,n.width,n.height,0,r.RGBA,r.UNSIGNED_BYTE,n.data)}):K(r,t,function(){return r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,n)}),K(r,t,function(){return r.bindTexture(r.TEXTURE_2D,null)})}function Iu(r,t,e,n,o){var a=r.createBuffer();K(r,t,function(){return r.bindBuffer(r.PIXEL_PACK_BUFFER,a)});var i=16*e*n;return K(r,t,function(){return r.bufferData(r.PIXEL_PACK_BUFFER,i,r.STREAM_READ)}),K(r,t,function(){return r.readPixels(0,0,n,e,r.RGBA,r.FLOAT,0)}),K(r,t,function(){return r.bindBuffer(r.PIXEL_PACK_BUFFER,null)}),a}function ku(r,t,e){var n=r,o=new Float32Array(e);return n.bindBuffer(n.PIXEL_PACK_BUFFER,t),n.getBufferSubData(n.PIXEL_PACK_BUFFER,0,o),n.bindBuffer(n.PIXEL_PACK_BUFFER,null),o}function Su(r,t,e,n,o){var a=br(e,n),i=a[0],s=a[1],u=new Uint8Array(e*n*4);return K(r,t,function(){return r.readPixels(0,0,i,s,o.downloadTextureFormat,r.UNSIGNED_BYTE,u)}),new Float32Array(u.buffer)}function Au(r,t,e,n,o,a,i,s){var u=r,l=new Float32Array(function(c,f){var h=Gt(c,f);return h[0]*h[1]*4}(a,i));return u.bindBuffer(u.PIXEL_PACK_BUFFER,t),u.getBufferSubData(u.PIXEL_PACK_BUFFER,0,l),u.bindBuffer(u.PIXEL_PACK_BUFFER,null),l}function Du(r,t,e,n){var o=new Float32Array(e*n*4);return K(r,t,function(){return r.readPixels(0,0,n,e,r.RGBA,r.FLOAT,o)}),o}var id=Object.freeze({createVertexShader:pu,createVertexBuffer:vu,createIndexBuffer:mu,createFloat32MatrixTexture:gu,createFloat16MatrixTexture:yu,createUnsignedBytesMatrixTexture:xu,createPackedMatrixTexture:bu,createFloat16PackedMatrixTexture:wu,bindVertexProgramAttributeStreams:Cu,uploadDenseMatrixToTexture:Eu,uploadPixelDataToTexture:Ru,createBufferFromOutputTexture:Iu,downloadFloat32MatrixFromBuffer:ku,downloadByteEncodedFloatMatrixFromOutputTexture:Su,downloadPackedMatrixFromBuffer:Au,downloadMatrixFromPackedOutputTexture:Du}),Tu=function(){function r(t){this.outputTexture=null,this.program=null,this.disposed=!1,this.vertexAttrsAreBound=!1,this.itemsToPoll=[];var e=M().getNumber("WEBGL_VERSION");t!=null?(this.gl=t,Ji(e,t)):this.gl=an(e);var n="WEBGL_color_buffer_float";if(M().getNumber("WEBGL_VERSION")===1){if(this.textureFloatExtension=Et(this.gl,this.debug,"OES_texture_float"),He(this.gl,"OES_texture_half_float"))this.textureHalfFloatExtension=Et(this.gl,this.debug,"OES_texture_half_float");else if(M().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support half float textures, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.");if(this.colorBufferFloatExtension=this.gl.getExtension(n),He(this.gl,"EXT_color_buffer_half_float"))this.colorBufferHalfFloatExtension=Et(this.gl,this.debug,"EXT_color_buffer_half_float");else if(M().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support color renderable half floats, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.")}else if(n="EXT_color_buffer_float",He(this.gl,n))this.colorBufferFloatExtension=this.gl.getExtension(n);else{if(!He(this.gl,"EXT_color_buffer_half_float"))throw new Error("GL context does not support color renderable floats");this.colorBufferHalfFloatExtension=this.gl.getExtension("EXT_color_buffer_half_float")}this.vertexBuffer=vu(this.gl,this.debug),this.indexBuffer=mu(this.gl,this.debug),this.framebuffer=ls(this.gl,this.debug),this.textureConfig=qo(this.gl,this.textureHalfFloatExtension)}return Object.defineProperty(r.prototype,"debug",{get:function(){return M().getBool("DEBUG")},enumerable:!0,configurable:!0}),r.prototype.dispose=function(){var t=this;if(!this.disposed){this.program!=null&&console.warn("Disposing a GPGPUContext that still has a bound WebGLProgram. This is probably a resource leak, delete the program with GPGPUContext.deleteProgram before disposing."),this.outputTexture!=null&&console.warn("Disposing a GPGPUContext that still has a bound output matrix texture.  This is probably a resource leak, delete the output matrix texture with GPGPUContext.deleteMatrixTexture before disposing.");var e=this.gl;K(e,this.debug,function(){return e.finish()}),K(e,this.debug,function(){return e.bindFramebuffer(e.FRAMEBUFFER,null)}),K(e,this.debug,function(){return e.deleteFramebuffer(t.framebuffer)}),K(e,this.debug,function(){return e.bindBuffer(e.ARRAY_BUFFER,null)}),K(e,this.debug,function(){return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null)}),K(e,this.debug,function(){return e.deleteBuffer(t.indexBuffer)}),this.disposed=!0}},r.prototype.createFloat32MatrixTexture=function(t,e){return this.throwIfDisposed(),gu(this.gl,this.debug,t,e,this.textureConfig)},r.prototype.createFloat16MatrixTexture=function(t,e){return this.throwIfDisposed(),yu(this.gl,this.debug,t,e,this.textureConfig)},r.prototype.createUnsignedBytesMatrixTexture=function(t,e){return this.throwIfDisposed(),xu(this.gl,this.debug,t,e,this.textureConfig)},r.prototype.uploadPixelDataToTexture=function(t,e){this.throwIfDisposed(),Ru(this.gl,this.debug,t,e)},r.prototype.uploadDenseMatrixToTexture=function(t,e,n,o){this.throwIfDisposed(),Eu(this.gl,this.debug,t,e,n,o,this.textureConfig)},r.prototype.createFloat16PackedMatrixTexture=function(t,e){return this.throwIfDisposed(),wu(this.gl,this.debug,t,e,this.textureConfig)},r.prototype.createPackedMatrixTexture=function(t,e){return this.throwIfDisposed(),bu(this.gl,this.debug,t,e,this.textureConfig)},r.prototype.deleteMatrixTexture=function(t){var e=this;this.throwIfDisposed(),this.outputTexture===t&&(Ro(this.gl,this.debug,this.framebuffer),this.outputTexture=null),K(this.gl,this.debug,function(){return e.gl.deleteTexture(t)})},r.prototype.downloadByteEncodedFloatMatrixFromOutputTexture=function(t,e,n){var o=this;return this.downloadMatrixDriver(t,function(){return Su(o.gl,o.debug,e,n,o.textureConfig)})},r.prototype.downloadPackedMatrixFromBuffer=function(t,e,n,o,a,i){return Au(this.gl,t,0,0,0,a,i,this.textureConfig)},r.prototype.downloadFloat32MatrixFromBuffer=function(t,e){return ku(this.gl,t,e)},r.prototype.createBufferFromTexture=function(t,e,n){this.bindTextureToFrameBuffer(t);var o=Iu(this.gl,this.debug,e,n,this.textureConfig);return this.unbindTextureToFrameBuffer(),o},r.prototype.createAndWaitForFence=function(){var t=this.createFence(this.gl);return this.pollFence(t)},r.prototype.createFence=function(t){var e,n,o=this;if(M().getBool("WEBGL_FENCE_API_ENABLED")){var a=t,i=a.fenceSync(a.SYNC_GPU_COMMANDS_COMPLETE,0);t.flush(),n=function(){var s=a.clientWaitSync(i,0,0);return s===a.ALREADY_SIGNALED||s===a.CONDITION_SATISFIED},e=i}else M().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0?(e=this.beginQuery(),this.endQuery(),n=function(){return o.isQueryAvailable(e,M().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))}):n=function(){return!0};return{query:e,isFencePassed:n}},r.prototype.downloadMatrixFromPackedTexture=function(t,e,n){var o=this;return this.downloadMatrixDriver(t,function(){return Du(o.gl,o.debug,e,n)})},r.prototype.createProgram=function(t){this.throwIfDisposed();var e=this.gl,n=ts(e,this.debug,t),o=pu(e,this.debug),a=rs(e,this.debug);return K(e,this.debug,function(){return e.attachShader(a,o)}),K(e,this.debug,function(){return e.attachShader(a,n)}),os(e,this.debug,a),this.debug&&or(e,this.debug,a),this.vertexAttrsAreBound||(this.setProgram(a),this.vertexAttrsAreBound=Cu(e,this.debug,this.program,this.vertexBuffer)),a},r.prototype.deleteProgram=function(t){var e=this;this.throwIfDisposed(),t===this.program&&(this.program=null),t!=null&&K(this.gl,this.debug,function(){return e.gl.deleteProgram(t)})},r.prototype.setProgram=function(t){var e=this;this.throwIfDisposed(),this.program=t,this.program!=null&&this.debug&&or(this.gl,this.debug,this.program),K(this.gl,this.debug,function(){return e.gl.useProgram(t)})},r.prototype.getUniformLocation=function(t,e,n){return n===void 0&&(n=!0),this.throwIfDisposed(),n?fs(this.gl,this.debug,t,e):hs(this.gl,t,e)},r.prototype.getAttributeLocation=function(t,e){var n=this;return this.throwIfDisposed(),K(this.gl,this.debug,function(){return n.gl.getAttribLocation(t,e)})},r.prototype.getUniformLocationNoThrow=function(t,e){return this.throwIfDisposed(),this.gl.getUniformLocation(t,e)},r.prototype.setInputMatrixTexture=function(t,e,n){this.throwIfDisposed(),this.throwIfNoProgram(),ds(this.gl,this.debug,this.program,t,e,n)},r.prototype.setOutputMatrixTexture=function(t,e,n){this.setOutputMatrixTextureDriver(t,n,e)},r.prototype.setOutputPackedMatrixTexture=function(t,e,n){this.throwIfDisposed();var o=Gt(e,n),a=o[0],i=o[1];this.setOutputMatrixTextureDriver(t,a,i)},r.prototype.setOutputMatrixWriteRegion=function(t,e,n,o){this.setOutputMatrixWriteRegionDriver(n,t,o,e)},r.prototype.setOutputPackedMatrixWriteRegion=function(t,e,n,o){throw new Error("setOutputPackedMatrixWriteRegion not implemented.")},r.prototype.debugValidate=function(){this.program!=null&&or(this.gl,this.debug,this.program),Rt(this.gl)},r.prototype.executeProgram=function(){this.throwIfDisposed(),this.throwIfNoProgram();var t=this.gl;this.debug&&this.debugValidate(),K(t,this.debug,function(){return t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0)})},r.prototype.blockUntilAllProgramsCompleted=function(){var t=this;this.throwIfDisposed(),K(this.gl,this.debug,function(){return t.gl.finish()})},r.prototype.getQueryTimerExtension=function(){return this.disjointQueryTimerExtension==null&&(this.disjointQueryTimerExtension=Et(this.gl,this.debug,M().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2?"EXT_disjoint_timer_query_webgl2":"EXT_disjoint_timer_query")),this.disjointQueryTimerExtension},r.prototype.getQueryTimerExtensionWebGL2=function(){return this.getQueryTimerExtension()},r.prototype.getQueryTimerExtensionWebGL1=function(){return this.getQueryTimerExtension()},r.prototype.beginQuery=function(){if(M().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2){var t=this.gl,e=this.getQueryTimerExtensionWebGL2(),n=t.createQuery();return t.beginQuery(e.TIME_ELAPSED_EXT,n),n}var o=this.getQueryTimerExtensionWebGL1(),a=o.createQueryEXT();return o.beginQueryEXT(o.TIME_ELAPSED_EXT,a),a},r.prototype.endQuery=function(){if(M().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")!==2){var t=this.getQueryTimerExtensionWebGL1();t.endQueryEXT(t.TIME_ELAPSED_EXT)}else{var e=this.gl,n=this.getQueryTimerExtensionWebGL2();e.endQuery(n.TIME_ELAPSED_EXT)}},r.prototype.waitForQueryAndGetTime=function(t){return j(this,void 0,void 0,function(){var e=this;return X(this,function(n){switch(n.label){case 0:return[4,vo(function(){return e.disposed||e.isQueryAvailable(t,M().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))})];case 1:return n.sent(),[2,this.getQueryTime(t,M().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))]}})})},r.prototype.getQueryTime=function(t,e){if(e===0)return null;if(e===2){var n=this.gl;return n.getQueryParameter(t,n.QUERY_RESULT)/1e6}var o=this.getQueryTimerExtensionWebGL1();return o.getQueryObjectEXT(t,o.QUERY_RESULT_EXT)/1e6},r.prototype.isQueryAvailable=function(t,e){if(e===0)return!0;if(e===2){var n=this.gl,o=this.getQueryTimerExtensionWebGL2(),a=n.getQueryParameter(t,n.QUERY_RESULT_AVAILABLE);return this.disjoint==null&&(this.disjoint=this.gl.getParameter(o.GPU_DISJOINT_EXT)),a&&!this.disjoint}return a=(o=this.getQueryTimerExtensionWebGL1()).getQueryObjectEXT(t,o.QUERY_RESULT_AVAILABLE_EXT),this.disjoint==null&&(this.disjoint=this.gl.getParameter(o.GPU_DISJOINT_EXT)),a&&!this.disjoint},r.prototype.pollFence=function(t){var e=this;return new Promise(function(n){e.addItemToPoll(function(){return t.isFencePassed()},function(){return n()})})},r.prototype.pollItems=function(){for(var t=function(n){for(var o=0;o<n.length&&n[o]();++o);return o-1}(this.itemsToPoll.map(function(n){return n.isDoneFn})),e=0;e<=t;++e)(0,this.itemsToPoll[e].resolveFn)();this.itemsToPoll=this.itemsToPoll.slice(t+1)},r.prototype.addItemToPoll=function(t,e){var n=this;this.itemsToPoll.push({isDoneFn:t,resolveFn:e}),this.itemsToPoll.length>1||vo(function(){return n.pollItems(),n.itemsToPoll.length===0})},r.prototype.bindTextureToFrameBuffer=function(t){this.throwIfDisposed(),ar(this.gl,this.debug,t,this.framebuffer),this.debug&&Rt(this.gl)},r.prototype.unbindTextureToFrameBuffer=function(){this.outputTexture!=null?(ar(this.gl,this.debug,this.outputTexture,this.framebuffer),this.debug&&Rt(this.gl)):Ro(this.gl,this.debug,this.framebuffer)},r.prototype.downloadMatrixDriver=function(t,e){this.bindTextureToFrameBuffer(t);var n=e();return this.unbindTextureToFrameBuffer(),n},r.prototype.setOutputMatrixTextureDriver=function(t,e,n){this.throwIfDisposed();var o=this.gl;ar(o,this.debug,t,this.framebuffer),this.debug&&Rt(o),this.outputTexture=t,K(o,this.debug,function(){return o.viewport(0,0,e,n)}),K(o,this.debug,function(){return o.scissor(0,0,e,n)})},r.prototype.setOutputMatrixWriteRegionDriver=function(t,e,n,o){var a=this;this.throwIfDisposed(),K(this.gl,this.debug,function(){return a.gl.scissor(t,e,n,o)})},r.prototype.throwIfDisposed=function(){if(this.disposed)throw new Error("Attempted to use disposed GPGPUContext.")},r.prototype.throwIfNoProgram=function(){if(this.program==null)throw new Error("No GPU program is currently set.")},r}();function ui(r,t){if(r.length!==t.length)throw Error("Binary was compiled with "+r.length+" inputs, but was executed with "+t.length+" inputs");r.forEach(function(e,n){var o=e.logicalShape,a=t[n],i=a.shape;if(!Re(o,i))throw Error("Binary was compiled with different shapes than the current args. Shapes "+o+" and "+i+" must match");if(!e.isUniform||!a.isUniform){var s=e.texShape,u=a.isUniform?null:a.texData.texShape;if(!Re(s,u))throw Error("Binary was compiled with different texture shapes than the current args. Shape "+s+" and "+u+" must match")}})}var sd=function(r,t,e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=r;for(var n=e.filterWidth,o=e.inChannels,a=e.strideWidth,i=e.strideHeight,s=e.padInfo,u=e.outWidth,l=e.dilationWidth,c=e.dilationHeight,f=e.dataFormat,h=s.left,d=s.top,p=o*n,m=Oe(),v=f==="channelsLast",g=v?0:1,y=v?1:2,x="",b=0;b<=1;b++)for(var w=0;w<=1;w++)x+=`
          blockIndex = rc.y + `+w+`;
          pos = rc.x + `+b+`;

          if(blockIndex < `+r[1]+" && pos < "+r[0]+`) {
            offsetY = int(blockIndex / (`+u+")) * "+i+" - "+d+`;
            d0 = offsetY + `+c+" * (pos / "+p+`);

            if(d0 < `+t[g]+` && d0 >= 0) {

              offsetX = int(mod(float(blockIndex), `+u+".) * "+a+". - "+h+`.);
              d1 = offsetX + `+l+" * (int(mod(float(pos), "+p+".) / "+o+`.));

              if(d1 < `+t[y]+` && d1 >= 0) {

                ch = int(mod(float(pos), `+o+`.));

                if (`+v+`) {
                  innerDims = vec2(d1, ch);
                  result[`+(2*b+w)+`] = getChannel(
                    getA(d0, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                } else {
                  innerDims = vec2(d0, d1);
                  result[`+(2*b+w)+`] = getChannel(
                    getA(ch, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                }
              }
            }
          }
        `;this.userCode=`
      void main() {
        ivec2 rc = getOutputCoords();

        vec4 result = vec4(0);

        int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
        vec2 innerDims;

        `+x+`

        `+m.output+` = result;
      }
    `},ud=function(r,t,e,n,o){this.variableNames=["x"],this.outputShape=[];var a,i=t,s=r[3]-1;this.outputShape=r;var u="float("+e+") + float("+n+") * sum";a=o===.5?"inversesqrt("+u+")":o===1?"1.0/("+u+")":"exp(log("+u+") * float(-"+o+"));",this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];
        int d = coords[3];
        float x = getX(b, r, c, d);
        float sum = 0.0;
        for (int j = -`+i+"; j <= "+i+`; j++) {
          int idx = d + j;
          if (idx >= 0 && idx <=  `+s+`) {
            float z = getX(b, r, c, idx);
            sum += z * z;
          }
        }
        float val = x * `+a+`;
        setOutput(val);
      }
    `},ld=function(r,t,e,n,o){this.variableNames=["inputImage","outputImage","dy"],this.outputShape=[],this.outputShape=r,this.depth=r[3],this.depthRadius=t,this.bias=e,this.alpha=n,this.beta=o,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];

        float result = 0.0;
        for (int d = 0; d < `+this.depth+`; ++d) {
          int depthBegin = int(max(0.0, float(d - `+t+`)));
          int depthEnd = int(min(float(`+this.depth+`),
              float(d + `+t+` + 1)));

          const int MIN_DEPTH_BEGIN = 0;
          const int MAX_DEPTH_END = `+this.depth+`;

          float norm = 0.0;
          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd) {
              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);
            }
            else {
              break;
            }
          }

          norm = float(`+n+") * norm + float("+e+`);

          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd){
              float dyi = -2.0 * float(`+n+`)
                * float(`+o+`)
                * getInputImage(b ,r ,c, k) * getOutputImage(b, r, c, d)
                / norm;
              if (k == d) {
                dyi += pow(norm, -1.0 * `+o+`);
              }
              if (k == coords[3]) {
                dyi *= getDy(b, r, c, d);
                result += dyi;
              }
            }
            else {
              break;
            }
          }
      }
      setOutput(result);
      }
    `},cd=function(r,t,e,n,o){this.variableNames=["x"],this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0;var a,i=t,s=r[3]-1;this.outputShape=r;var u="float("+e+") + float("+n+") * sum";a=o===.5?"inversesqrt("+u+")":o===1?"1.0/("+u+")":"exp(log("+u+") * float(-"+o+"));",this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords.x;
        int r = coords.y;
        int c = coords.z;
        int d = coords.w;

        bool hasNextCol = d < `+this.outputShape[3]+`;
        bool hasNextRow = c < `+this.outputShape[2]+`;

        vec4 sum = vec4(0.);
        vec4 xFragAtOutputCoords = getX(b, r, c, d);

        vec4 xAtOutputCoords = vec4(
          getChannel(xFragAtOutputCoords, vec2(c, d)),
          hasNextCol ?
            getChannel(xFragAtOutputCoords, vec2(c, d + 1)) : 0.0,
          hasNextRow ?
            getChannel(xFragAtOutputCoords , vec2(c + 1, d)) : 0.0,
          (hasNextRow && hasNextCol) ?
            getChannel(xFragAtOutputCoords, vec2(c + 1, d + 1)) : 0.0
        );

        int firstChannel = d - `+i+`;
        vec2 cache = vec2(0.);
        if(firstChannel >= 0){
          vec4 firstChannelFrag = getX(b, r, c, firstChannel);
          cache.x = getChannel(firstChannelFrag, vec2(c, firstChannel));
            if(hasNextRow){
              cache.y = getChannel(firstChannelFrag, vec2(c + 1, firstChannel));
            }
        }

        ivec2 depth = ivec2(d, d + 1);
        for (int j = - `+i+"; j <= "+i+`; j++) {
          ivec2 idx = depth + j;
          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));
          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(`+s+`));

          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;
          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;

          if(depthInRange || depthPlusOneInRange){
            vec4 z = vec4(0.);
            vec4 xFragAtCurrentDepth;
            z.xz = cache.xy;
            if(depthPlusOneInRange && hasNextCol){
              xFragAtCurrentDepth = idx.y != d ?
                getX(b, r, c, idx.y) : xFragAtOutputCoords;
              z.y = getChannel(xFragAtCurrentDepth, vec2(c, idx.y));
              if(hasNextRow){
                z.w = getChannel(xFragAtCurrentDepth, vec2(c + 1, idx.y));
              }
            }
            cache.xy = z.yw;
            sum += z * z;
          }
        }
        vec4 result = xAtOutputCoords * `+a+`;
        setOutput(result);
      }
    `},fd=function(r){this.variableNames=["dy","maxPos"],this.outputShape=r.inShape;var t=r.strideHeight,e=r.strideWidth,n=r.dilationHeight,o=r.effectiveFilterHeight,a=r.effectiveFilterWidth,i=o-1-r.padInfo.top,s=a-1-r.padInfo.left,u=o*a-1;this.userCode=`
      const ivec2 pads = ivec2(`+i+", "+s+`);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < `+o+`;
          wR += `+n+`) {
          float dyR = float(dyRCorner + wR) / `+t+`.0;

          if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < `+a+`; wC++) {
            float dyC = float(dyCCorner + wC) / `+e+`.0;

            if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);
            int maxPosValue = `+u+` - int(getMaxPos(b, idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            int curPosValue = wR * `+a+` + wC;
            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

            dotProd += dyValue * mask;
          }
        }
        setOutput(dotProd);
      }
    `},hd=function(r){this.variableNames=["dy","maxPos"],this.outputShape=r.inShape;var t=r.strideDepth,e=r.strideHeight,n=r.strideWidth,o=r.dilationDepth,a=r.dilationHeight,i=r.dilationWidth,s=r.effectiveFilterDepth,u=r.effectiveFilterHeight,l=r.effectiveFilterWidth,c=s-1-r.padInfo.front,f=u-1-r.padInfo.top,h=l-1-r.padInfo.left,d=s*u*l-1;this.userCode=`
      const ivec3 pads = ivec3(`+c+", "+f+", "+h+`);

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < `+s+`;
           wD += `+o+`) {
          float dyD = float(dyDCorner + wD) / `+t+`.0;

          if (dyD < 0.0 || dyD >= `+r.outDepth+`.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < `+u+`;
              wR += `+a+`) {
            float dyR = float(dyRCorner + wR) / `+e+`.0;

            if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < `+l+`;
                wC += `+i+`) {
              float dyC = float(dyCCorner + wC) / `+n+`.0;

              if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);
              int maxPosValue = `+d+` -
                  int(getMaxPos(batch, idyD, idyR, idyC, ch));

              // Get the current value, check it against the value from the
              // position matrix.
              int curPosValue =
                  wD * `+u+" * "+l+` +
                  wR * `+l+` + wC;
              float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

              dotProd += dyValue * mask;
            }
          }
        }
        setOutput(dotProd);
      }
    `},Jr=function(r,t,e,n,o,a,i){e===void 0&&(e=!1),n===void 0&&(n=!1),o===void 0&&(o=!1),a===void 0&&(a=null),i===void 0&&(i=!1),this.variableNames=["matrixA","matrixB"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t;var s=e?r[1]:r[2],u=Math.ceil(s/2),l=e?"i * 2, rc.y":"rc.y, i * 2",c=n?"rc.z, i * 2":"i * 2, rc.z",f=e?["a.xxyy","a.zzww"]:["a.xxzz","a.yyww"],h=n?["b.xzxz","b.ywyw"]:["b.xyxy","b.zwzw"],d="",p="";a&&(d=i?`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          `+a+`
        }`:`vec4 activation(vec4 x) {
          `+a+`
        }`,p="result = activation(result);");var m=o?"result += getBiasAtOutCoords();":"";o&&this.variableNames.push("bias"),i&&this.variableNames.push("preluActivationWeights"),this.userCode=`
      `+d+`

      const float sharedDimension = `+u+`.0;

      vec4 dot2x2ARowBCol(ivec3 rc) {
        vec4 result = vec4(0);
        for (int i = 0; i < `+u+`; i++) {
          vec4 a = getMatrixA(rc.x, `+l+`);
          vec4 b = getMatrixB(rc.x, `+c+`);

          // These swizzled products need to be separately added.
          // See: https://github.com/tensorflow/tfjs/issues/1735
          result += (`+f[0]+" * "+h[0]+`);
          result += (`+f[1]+" * "+h[1]+`);
        }
        return result;
      }

      void main() {
        ivec3 rc = getOutputCoords();
        vec4 result = dot2x2ARowBCol(rc);

        `+m+`

        `+p+`

        setOutput(result);
      }
    `},dd=function(){function r(t,e,n){this.variableNames=["probs"],this.outputShape=[t,n],this.userCode=`
      uniform float seed;

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];

        float r = random(seed);
        float cdf = 0.0;

        for (int i = 0; i < `+(e-1)+`; i++) {
          cdf += getProbs(batch, i);

          if (r < cdf) {
            setOutput(float(i));
            return;
          }
        }

        // If no other event happened, last event happened.
        setOutput(float(`+(e-1)+`));
      }
    `}return r.prototype.getCustomSetupFunc=function(t){var e=this;return function(n,o){e.seedLoc==null&&(e.seedLoc=n.getUniformLocation(o,"seed")),n.gl.uniform1f(e.seedLoc,t)}},r}(),pd=function(r,t,e,n){this.variableNames=["indices"],this.outputShape=[r,t],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int index = round(getIndices(coords.x));
        setOutput(mix(float(`+n+"), float("+e+`),
                      float(index == coords.y)));
      }
    `},vd=function(r){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outputShape=r;var t=r.length;if(t===0)this.userCode=`
        void main() {
          setOutput(vec4(getA(), 0., 0., 0.));
        }
      `;else{var e=We("rc",t),n=pe(t),o=function(s,u,l){if(s===1)return"rc > "+u[0];for(var c="",f=s-2;f<s;f++)c+=l[f]+" >= "+u[f],f<s-1&&(c+="||");return c}(t,r,e),a=function(s,u,l,c){if(s===1)return"";var f=c.slice(-2);return`
    int r = `+f[0]+`;
    int c = `+f[1]+`;
    int rp1 = r + 1;
    int cp1 = c + 1;

    bool cEdge = cp1 >= `+u+`;
    bool rEdge = rp1 >= `+l+`;
  `}(t,r[r.length-1],r[r.length-2],e),i=function(s,u){var l=s.length,c=function(f,h){for(var d=[],p=0;p<=1;p++)for(var m=0;m<=1;m++){for(var v=(p===0?"r":"rp1")+", "+(m===0?"c":"cp1"),g=2;g<f;g++)v=h[h.length-1-g]+","+v;d.push(v)}return d}(l,u);return l===1?`getA(rc),
            rc + 1 >= `+s[0]+` ? 0. : getA(rc + 1),
            0, 0`:"getA("+c[0]+`),
          cEdge ? 0. : getA(`+c[1]+`),
          rEdge ? 0. : getA(`+c[2]+`),
          rEdge || cEdge ? 0. : getA(`+c[3]+")"}(r,e);this.userCode=`
        void main() {
          `+n+` rc = getOutputCoords();

          if(`+o+`) {
            setOutput(vec4(0));
          } else {
            `+a+`

            setOutput(vec4(`+i+`));
          }
        }
      `}},md=function(r,t,e){this.variableNames=["x"],this.outputShape=t.map(function(u,l){return u[0]+r[l]+u[1]});var n=r.length,o=pe(n),a=t.map(function(u){return u[0]}).join(","),i=t.map(function(u,l){return u[0]+r[l]}).join(","),s=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,n);this.userCode=n!==1?`
      `+o+" start = "+o+"("+a+`);
      `+o+" end = "+o+"("+i+`);

      void main() {
        `+o+` outC = getOutputCoords();
        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          setOutput(float(`+e+`));
        } else {
          `+o+` coords = outC - start;
          setOutput(getX(`+s+`));
        }
      }
    `:`
        int start = `+a+`;
        int end = `+i+`;

        void main() {
          int outC = getOutputCoords();
          if (outC < start || outC >= end) {
            setOutput(float(`+e+`));
          } else {
            setOutput(getX(outC - start));
          }
        }
      `},gd=function(r,t,e){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t.map(function(v,g){return v[0]+r[g]+v[1]});for(var n=r.length,o=pe(n),a=t.map(function(v){return v[0]}).join(","),i=t.map(function(v,g){return v[0]+r[g]}).join(","),s=We("rc",n),u=We("source",n),l=s[n-1]+" < "+this.outputShape[n-1],c=n===1?"source":"vec2("+u.slice(-2).join()+")",f=[o+" rc = outputLoc;",s[n-1]+` += 1;
       if(`+l+`) {
      `,n===1?"":`}
       rc = outputLoc;
       `+s[n-2]+` += 1;
       if(`+s[n-2]+" < "+this.outputShape[n-2]+") {",n===1?"":"  "+s[n-1]+` += 1;
         if(`+l+") {"],h=n===1?"rc < start || rc >= end":"any(lessThan(rc, start)) || any(greaterThanEqual(rc, end))",d="",p=0,m=n===1?2:4;p<m;p++)d+=`
        `+f[p]+`
        if (`+h+`) {
          result[`+p+"] = float("+e+`);
        } else {
          `+o+` source = rc - start;
          result[`+p+"] = getChannel(getX("+u.join()+"), "+c+`);
        }
      `;d+=n===1?"} ":"}}",this.userCode=`
      const `+o+" start = "+o+"("+a+`);
      const `+o+" end = "+o+"("+i+`);

      void main() {
        `+o+` outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        `+d+`
        setOutput(result);
      }
    `},Zr=function(r,t,e){if(this.variableNames=["x"],t==="avg"&&e)throw new Error("Cannot compute positions for average pool.");var n=r.filterWidth,o=r.strideHeight,a=r.strideWidth,i=r.dilationHeight,s=r.dilationWidth,u=r.effectiveFilterHeight,l=r.effectiveFilterWidth,c=r.padInfo.top,f=r.padInfo.left;this.outputShape=r.outShape;var h=t==="avg",d="0.0";if(h||(d="-1.0 / 1e-20"),e)this.userCode=`
        const ivec2 strides = ivec2(`+o+", "+a+`);
        const ivec2 pads = ivec2(`+c+", "+f+`);

        void main() {
          ivec4 coords = getOutputCoords();
          int batch = coords[0];
          int d = coords[3];

          ivec2 xRCCorner = coords.yz * strides - pads;
          int xRCorner = xRCCorner.x;
          int xCCorner = xRCCorner.y;

          // max/min x(?, ?, d) to get y(yR, yC, d).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;
          float avgValue = 0.0;

          for (int wR = 0; wR < `+u+`;
              wR += `+i+`) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= `+r.inHeight+`) {
              continue;
            }

            for (int wC = 0; wC < `+l+`;
                wC += `+s+`) {
              int xC = xCCorner + wC;

              if (xC < 0 || xC >= `+r.inWidth+`) {
                continue;
              }

              float value = getX(batch, xR, xC, d);

              // If a min / max value has already been found, use it. If not,
              // use the current value.
              float currMinMaxValue = mix(
                  value, minMaxValue, minMaxValueFound);
              if (value >= currMinMaxValue) {
                minMaxValue = value;
                minMaxValueFound = 1.0;
                minMaxPosition = wR * `+l+` + wC;
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;else{var p=t+"("+t+"("+t+"(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";t==="avg"&&(p="avgValue / count");var m=4*Math.floor(n/4),v=n%4,g=`
      if (`+h+`) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = max(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec2 strides = ivec2(`+o+", "+a+`);
      const ivec2 pads = ivec2(`+c+", "+f+`);
      const float initializationValue = `+d+`;
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xR, int xC, int d) {
        if (xC < 0 || xC >= `+r.inWidth+`) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xR, xC, d);
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d = coords[3];

        ivec2 xRCCorner = coords.yz * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(`+d+`);
        float avgValue = 0.0;
        count = 0.0;

        for (int wR = 0; wR < `+u+`;
            wR += `+i+`) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= `+r.inHeight+`) {
            continue;
          }

          for (int wC = 0; wC < `+m+`; wC += 4) {
            int xC = xCCorner + wC * `+s+`;

            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + `+s+`, d),
              getValue(batch, xR, xC + 2 * `+s+`, d),
              getValue(batch, xR, xC + 3 * `+s+`, d)
            );

            `+g+`
          }

          int xC = xCCorner + `+m+`;
          if (`+(v===1)+`) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              initializationValue,
              initializationValue,
              initializationValue
            );

            `+g+`
          } else if (`+(v===2)+`) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + `+s+`, d),
              initializationValue,
              initializationValue
            );

            `+g+`
          } else if (`+(v===3)+`) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + `+s+`, d),
              getValue(batch, xR, xC + 2 * `+s+`, d),
              initializationValue
            );

            `+g+`
          }
        }
        setOutput(`+p+`);
      }
    `}},eo=function(r,t,e){if(this.variableNames=["x"],t==="avg"&&e)throw new Error("Cannot compute positions for average pool.");var n=r.filterWidth,o=r.strideDepth,a=r.strideHeight,i=r.strideWidth,s=r.dilationDepth,u=r.dilationHeight,l=r.dilationWidth,c=r.effectiveFilterDepth,f=r.effectiveFilterHeight,h=r.effectiveFilterWidth,d=r.padInfo.front,p=r.padInfo.top,m=r.padInfo.left;this.outputShape=r.outShape;var v=t==="avg",g="0.0";if(v||(g="-1.0 / 1e-20"),e)this.userCode=`
        const ivec3 strides =
            ivec3(`+o+", "+a+", "+i+`);
        const ivec3 pads = ivec3(`+d+", "+p+", "+m+`);

        void main() {
          ivec5 coords = getOutputCoords();
          int batch = coords.x;
          int ch = coords.u;

          ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
          int xDCorner = xCorner.x;
          int xRCorner = xCorner.y;
          int xCCorner = xCorner.z;

          // max/min x(?, ?, ?, ch) to get y(yD, yR, yC, ch).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;

          for (int wD = 0; wD < `+c+`;
              wD += `+s+`) {
            int xD = xDCorner + wD;

            if (xD < 0 || xD >= `+r.inDepth+`) {
              continue;
            }

            for (int wR = 0; wR < `+f+`;
                wR += `+u+`) {
              int xR = xRCorner + wR;

              if (xR < 0 || xR >= `+r.inHeight+`) {
                continue;
              }

              for (int wC = 0; wC < `+h+`;
                  wC += `+l+`) {
                int xC = xCCorner + wC;

                if (xC < 0 || xC >= `+r.inWidth+`) {
                  continue;
                }

                float value = getX(batch, xD, xR, xC, ch);

                // If a min / max value has already been found, use it. If not,
                // use the current value.
                float currMinMaxValue = mix(
                    value, minMaxValue, minMaxValueFound);
                if (value >= currMinMaxValue) {
                  minMaxValue = value;
                  minMaxValueFound = 1.0;
                  minMaxPosition =
                      wD * `+f+" * "+h+` +
                      wR * `+h+` + wC;;
                }
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;else{var y=t+"("+t+"("+t+"(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";t==="avg"&&(y="avgValue / count");var x=4*Math.floor(n/4),b=n%4,w=`
      if (`+v+`) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = max(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec3 strides =
        ivec3(`+o+", "+a+", "+i+`);
      const ivec3 pads = ivec3(`+d+", "+p+", "+m+`);
      const float initializationValue = `+g+`;
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xD, int xR, int xC, int ch) {
        if (xC < 0 || xC >= `+r.inWidth+`) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xD, xR, xC, ch);
      }

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xDCorner = xCorner.x;
        int xRCorner = xCorner.y;
        int xCCorner = xCorner.z;

        // max/min x(?, ?, ?, d) to get y(yD, yR, yC, ch).
        // ? = to be determined
        vec4 minMaxValue = vec4(`+g+`);
        float avgValue = 0.0;
        count = 0.0;

        for (int wD = 0; wD < `+c+`;
            wD += `+s+`) {
          int xD = xDCorner + wD;

          if (xD < 0 || xD >= `+r.inDepth+`) {
            continue;
          }

          for (int wR = 0; wR < `+f+`;
            wR += `+u+`) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= `+r.inHeight+`) {
              continue;
            }

            for (int wC = 0; wC < `+x+`; wC += 4) {
              int xC = xCCorner + wC * `+l+`;

              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + `+l+`, ch),
                getValue(batch, xD, xR, xC + 2 * `+l+`, ch),
                getValue(batch, xD, xR, xC + 3 * `+l+`, ch)
              );

              `+w+`
            }

            int xC = xCCorner + `+x+`;
            if (`+(b===1)+`) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                initializationValue,
                initializationValue,
                initializationValue
              );

              `+w+`
            } else if (`+(b===2)+`) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + `+l+`, ch),
                initializationValue,
                initializationValue
              );

              `+w+`
            } else if (`+(b===3)+`) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + `+l+`, ch),
                getValue(batch, xD, xR, xC + 2 * `+l+`, ch),
                initializationValue
              );

              `+w+`
            }
          }
          setOutput(`+y+`);
        }
      }
    `}},yd=function(r,t){this.variableNames=["x"];var e=r.windowSize,n=r.batchSize,o=r.inSize,a=Math.ceil(o/e);this.outputShape=[n,a];var i="0.0",s="";t==="prod"?i="1.0":t==="min"?(i="1.0 / 1e-20",s="min"):t==="max"&&(i="-1.0 / 1e-20",s="max");var u=t+"("+t+"("+t+"(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";t==="sum"?u="sumValue":t==="prod"?u="prodValue":t==="all"?u="allValue":t==="any"&&(u="anyValue");var l=4*Math.floor(e/4),c=e%4,f=`
      if (`+(t==="sum")+`) {
        sumValue += dot(values, ones);
      } else if (`+(t==="prod")+`) {
        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);
        prodValue *= tmp[0] * tmp[1];
      } else {
        minMaxValue = `+s+`(values, minMaxValue);
      }
    `,h="vec4";t==="all"?(i="1.0",f=`
        bool reducedAllValue = all(values);
        float floatedReducedAllValue = float(reducedAllValue);
        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);
      `,h="bvec4"):t==="any"&&(i="0.0",f=`
        bool reducedAnyValue = any(values);
        float floatedReducedAnyValue = float(reducedAnyValue);
        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);
      `,h="bvec4");var d="";o%e>0&&(d=`
        if (inIdx < 0 || inIdx >= `+o+`) {
          return initializationValue;
        }
      `),this.userCode=`
      const float initializationValue = `+i+`;
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        `+d+`
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * `+e+`;

        vec4 minMaxValue = vec4(`+i+`);
        float prodValue = 1.0;
        float sumValue = 0.0;
        float allValue = 1.0;
        float anyValue = 0.0;

        for (int i = 0; i < `+l+`; i += 4) {
          int inIdx = inOffset + i;
          `+h+" values = "+h+`(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          `+f+`
        }

        int inIdx = inOffset + `+l+`;
        if (`+(c===1)+`) {
          `+h+" values = "+h+`(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          `+f+`
        } else if (`+(c===2)+`) {
          `+h+" values = "+h+`(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          `+f+`
        } else if (`+(c===3)+`) {
          `+h+" values = "+h+`(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          `+f+`
        }
        setOutput(`+u+`);
      }
    `},xd=function(r,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=r;for(var e="",n=0;n<4;n++){var o="thisRC = rc;";n%2==1&&(o+="thisRC.z += 1;"),n>1&&(o+="thisRC.y += 1;"),e+=`
        `+o+`
        `+(n>0?"if(thisRC.y < rows && thisRC.z < cols){":"")+`
          int flatIndex = getFlatIndex(thisRC);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[`+n+`] =
            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);
        `+(n>0?"}":"")+`
      `}this.userCode=`
      
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      `+Pn(["r","c","d"],t)+`
      return ivec3(r, c, d);
    }
  
      `+pa(r)+`

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.);

        ivec3 thisRC;
        int rows = `+r[1]+`;
        int cols = `+r[2]+`;

        `+e+`

        setOutput(result);
      }
    `},bd=function(r,t,e){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t.shape;var n=t.shape,o=n[1],a=n[2],i=r.shape,s=i[1],u=i[2],l=[e&&s>1?o-1:o,e&&u>1?a-1:a],c=[e&&s>1?s-1:s,e&&u>1?u-1:u],f=l[0]/c[0],h=l[1]/c[1],d=1/f,p=1/h,m=2*Math.ceil(d)+2,v=2*Math.ceil(p)+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(`+f+`);
        const float widthScale = float(`+h+`);

        const float invHeightScale = float(`+d+`);
        const float invWidthScale = float(`+p+`);

        const int winHeight = int(`+m+`);
        const int winWidth = int(`+v+`);

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(startRLerp - float(winHeight / 2));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(startCLerp - float(winWidth / 2));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= `+s+`) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= `+u+`) {
              continue;
            }

            float dxR = float(dyR) * heightScale;
            int topDxRIndex = int(floor(dxR));
            int bottomDxRIndex = int(min(ceil(dxR), `+(o-1)+`.0));
            float dxRLerp = dxR - float(topDxRIndex);
            float inverseDxRLerp = 1.0 - dxRLerp;

            float dxC = float(dyC) * widthScale;
            int leftDxCIndex = int(floor(dxC));
            int rightDxCIndex = int(min(ceil(dxC), `+(a-1)+`.0));
            float dxCLerp = dxC - float(leftDxCIndex);
            float inverseDxCLerp = 1.0 - dxCLerp;

            if (r == topDxRIndex && c == leftDxCIndex) {
              // topLeft
              accumulator +=
                getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;
            }

            if (r == topDxRIndex && c == rightDxCIndex) {
              // topRight
              accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;
            }

            if (r == bottomDxRIndex && c == leftDxCIndex) {
              // bottomLeft
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;
            }

            if (r == bottomDxRIndex && c == rightDxCIndex) {
              // bottomRight
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `},wd=function(r,t,e,n){this.variableNames=["A"],this.outputShape=[];var o=r[0],a=r[1],i=r[2],s=r[3];this.outputShape=[o,t,e,s];var u=[n&&t>1?a-1:a,n&&e>1?i-1:i],l=[n&&t>1?t-1:t,n&&e>1?e-1:e];this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          `+u[0]/l[0]+`,
          `+u[1]/l[1]+`);
      const vec2 inputShapeRC = vec2(`+a+".0, "+i+`.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = vec2(yRC) * effectiveInputOverOutputRatioRC;

        // Compute the four integer indices.
        ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);
        ivec2 sourceCeilRC = ivec2(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);
        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);
        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);
        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);

        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

        float top = topLeft + (topRight - topLeft) * fracRC.y;
        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
        float newValue = top + (bottom - top) * fracRC.x;

        setOutput(newValue);
      }
    `},Cd=function(r,t,e,n){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];var o=r[0],a=r[1],i=r[2],s=r[3];this.outputShape=[o,t,e,s];var u=[n&&t>1?a-1:a,n&&e>1?i-1:i],l=[n&&t>1?t-1:t,n&&e>1?e-1:e];this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          `+u[0]/l[0]+`,
          `+u[1]/l[1]+`,
          `+u[1]/l[1]+`);
      const vec3 inputShapeRC = vec3(`+a+".0, "+i+`.0,
                                     `+i+`.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = vec3(yRC) * effectiveInputOverOutputRatioRC;

        // Compute the four integer indices.
        ivec3 sourceFloorRC = ivec3(sourceFracIndexRC);
        ivec3 sourceCeilRC = ivec3(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < `+(s-1)+`;
        bool hasNextRow = coords.z < `+(e-1)+`;

        // In parallel, construct four corners for all four components in
        // packed 2x2 cell.
        vec4 topLeft = vec4(
          getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 bottomLeft = vec4(
          getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 topRight = vec4(
          getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec4 bottomRight = vec4(
          getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec3 fracRC = sourceFracIndexRC - vec3(sourceFloorRC);

        vec4 top = mix(topLeft, topRight, fracRC.yyzz);
        vec4 bottom = mix(bottomLeft, bottomRight, fracRC.yyzz);
        vec4 newValue = mix(top, bottom, fracRC.x);

        setOutput(newValue);
      }
    `},Ed=function(r,t,e){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t.shape;var n=t.shape,o=n[1],a=n[2],i=r.shape,s=i[1],u=i[2],l=[e&&s>1?o-1:o,e&&u>1?a-1:a],c=[e&&s>1?s-1:s,e&&u>1?u-1:u],f=l[0]/c[0],h=l[1]/c[1],d=1/f,p=1/h,m=2*Math.ceil(d)+2,v=2*Math.ceil(p)+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(`+f+`);
        const float widthScale = float(`+h+`);

        const float invHeightScale = float(`+d+`);
        const float invWidthScale = float(`+p+`);

        const int winHeight = int(`+m+`);
        const int winWidth = int(`+v+`);

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(floor(startRLerp - float(winHeight / 2)));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(floor(startCLerp - float(winWidth / 2)));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= `+s+`) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= `+u+`) {
              continue;
            }

            float sourceFracRow =
              float(`+l[0]+`) *
                (float(dyR) / float(`+c[0]+`));

            float sourceFracCol =
                float(`+l[1]+`) *
                  (float(dyC) / float(`+c[1]+`));

            int sourceNearestRow = int(min(
                float(int(`+o+`) - 1),
                `+e+` ? float(round(sourceFracRow)) :
                                  float(floor(sourceFracRow))));

            int sourceNearestCol = int(min(
                float(int(`+a+`) - 1),
                `+e+` ? float(round(sourceFracCol)) :
                                  float(floor(sourceFracCol))));

            if (r == sourceNearestRow && c == sourceNearestCol) {
              accumulator += getDy(b, dyR, dyC, d);
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `},Rd=function(r,t,e,n){this.variableNames=["A"],this.outputShape=[];var o=r[0],a=r[1],i=r[2],s=r[3];this.outputShape=[o,t,e,s];var u=[n&&t>1?a-1:a,n&&e>1?i-1:i],l=[n&&t>1?t-1:t,n&&e>1?e-1:e],c=n?"0.5":"0.0";this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          `+u[0]/l[0]+`,
          `+u[1]/l[1]+`);
      const vec2 inputShapeRC = vec2(`+a+".0, "+i+`.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = vec2(yRC) * effectiveInputOverOutputRatioRC;

        // Compute the coordinators of nearest neighbor point.
        ivec2 sourceNearestRC = ivec2(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + `+c+`)));

        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);

        setOutput(newValue);
      }
    `},Id=function(r,t){this.variableNames=["x"];var e=r.length;if(e>4)throw new Error("WebGL backend: Reverse of rank-"+e+" tensor is not yet supported");if(this.outputShape=r,e!==1){var n=r.map(function(a,i){return function(s){return t.indexOf(s)!==-1&&r[s]!==1?r[s]+" - coords["+s+"] - 1":"coords["+s+"]"}(i)}).join(","),o=pe(e);this.userCode=`
      void main() {
        `+o+` coords = getOutputCoords();
        setOutput(getX(`+n+`));
      }
    `}else this.userCode=`
        void main() {
          int coord = getOutputCoords();
          setOutput(getX(`+r[0]+` - coord - 1));
        }
      `},kd=function(r,t){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0;var e=r.length;if(e>4)throw new Error("WebGL backend: Reverse of rank-"+e+" tensor is not yet supported");this.outputShape=r;var n=We("rc",e),o=n[e-1]+" + 1 < "+this.outputShape[e-1],a=n[e-2]+" + 1 < "+this.outputShape[e-2],i=pe(e);function s(u){var l=r.map(function(c,f){return function(h,d){return t.indexOf(h)!==-1&&r[h]!==1?r[h]+" - "+d[h]+" - 1":""+d[h]}(f,u)});return"getChannel(getX("+l.join(",")+"), vec2("+l.slice(-2).join(",")+"))"}this.userCode=e===1?`
        void main(){
          int rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = getChannel(getX(`+r[0]+` - rc - 1),
            `+r[0]+` - rc - 1);
          if(`+o+`){
              result.g = getChannel(getX(`+r[0]+` - (rc  + 1) - 1),
                `+r[0]+` - (rc  + 1) - 1);
          }
          setOutput(result);
        }
      `:`
        void main() {
          `+i+` rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = `+function(u){return s(u)}(n.slice())+`;
          if(`+o+`){
            result.g = `+function(u){return u[e-1]="("+u[e-1]+" + 1)",s(u)}(n.slice())+`;
          }
          if(`+a+`) {
            result.b = `+function(u){return u[e-2]="("+u[e-2]+" + 1)",s(u)}(n.slice())+`;
            if(`+o+`) {
              result.a = `+function(u){return u[e-1]="("+u[e-1]+" + 1)",u[e-2]="("+u[e-2]+" + 1)",s(u)}(n.slice())+`;
            }
          }
          setOutput(result);
        }
    `},li=function(r,t,e,n,o,a,i){this.variableNames=["updates","indices","defaultValue"],this.outputShape=a;var s=pe(o.length),u=pe(a.length),l="";e===1?l="i":e===2&&(l="i, j");var c="getIndices("+l+")",f="";n===1?f="i":n===2&&(f="i, coords[1]");var h="getUpdates("+f+")",d=t>1?"strides[j]":"strides";this.userCode=`
        `+s+" strides = "+s+"("+o+`);

        void main() {
          `+u+` coords = getOutputCoords();
          float sum = 0.0;
          bool found = false;
          for (int i = 0; i < `+r+`; i++) {
            int flattenedIndex = 0;
            for (int j = 0; j < `+t+`; j++) {
              int index = round(`+c+`);
              flattenedIndex += index * `+d+`;
            }
            if (flattenedIndex == coords[0]) {
              sum += `+h+`;
              found = true;
            }
          }
          setOutput(mix(getDefaultValue(), sum, float(found)));
        }
      `},Sd=function(r,t){this.variableNames=["x","segmentIds"];var e=r.windowSize,n=r.batchSize,o=r.inSize,a=r.numSegments,i=a*Math.ceil(o/e);this.outputShape=[n,i];var s=4*Math.floor(e/4),u=e%4,l=`
        sumValue += dot(values, segFilter);
    `,c="";o%e>0&&(c=`
        if (inIdx < 0 || inIdx >= `+o+`) {
          return initializationValue;
        }
      `);var f="";o%e>0&&(f=`
        if (inIdx < 0 || inIdx >= `+o+`) {
          return -1.0;
        }
      `),this.userCode=`
      const float initializationValue = 0.0;

      float getValue(int batch, int inIdx) {
        `+c+`
        return getX(batch, inIdx);
      }

      float getSegmentIdAtIndex(int inIdx) {
        `+f+`
        return getSegmentIds(inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = int(floor(float(outIdx) / float(
          `+a+")) * float("+e+`));
        int currentSeg = int(mod(float(outIdx), float(`+a+`)));

        float sumValue = 0.0;

        for (int i = 0; i < `+s+`; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0
          );

          `+l+`
        }

        int inIdx = inOffset + `+s+`;
        if (`+(u===1)+`) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            0,
            0,
            0
          );

          `+l+`
        } else if (`+(u===2)+`) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
              0,
              0
          );

          `+l+`
        } else if (`+(u===3)+`) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            0
          );

          `+l+`
        }
        setOutput(sumValue);
      }
    `},Ad=function(r,t,e){var n,o;if(this.variableNames=["c","a","b"],this.outputShape=t,e>4)throw Error("Where for rank "+e+" is not yet supported");if(e===1)o="resRC",n="resRC";else{for(var a=["resRC.x","resRC.y","resRC.z","resRC.w"],i=[],s=[],u=0;u<t.length;u++)s.push(""+a[u]),u<r&&i.push(""+a[u]);n=i.join(),o=s.join()}var l=pe(e);this.userCode=`
      void main() {
        `+l+` resRC = getOutputCoords();
        float cVal = getC(`+n+`);
        if (cVal >= 1.0) {
          setOutput(getA(`+o+`));
        } else {
          setOutput(getB(`+o+`));
        }
      }
    `},Dd=function(){function r(t){this.variableNames=["source"],this.outputShape=t,this.rank=t.length;var e,n=pe(this.rank),o="uniform int start["+this.rank+"];",a=function(i){if(i===1)return"sourceLoc";if(i<=6)return no.slice(0,i).map(function(s){return"sourceLoc."+s}).join(",");throw Error("Slicing for rank "+i+" is not yet supported")}(this.rank);e=`
        `+n+` sourceLoc;
        `+n+` coords = getOutputCoords();
        `+t.map(function(i,s){return"sourceLoc."+no[s]+" = start["+s+"] + coords."+no[s]+";"}).join(`
`)+`
      `,this.userCode=`
      `+o+`
      void main() {
        `+e+`
        setOutput(getSource(`+a+`));
      }
    `}return r.prototype.getCustomSetupFunc=function(t){var e=this;if(t.length!==this.rank)throw Error("The rank ("+this.rank+") of the program must match the length of start ("+t.length+")");return function(n,o){e.startLoc==null&&(e.startLoc=n.getUniformLocationNoThrow(o,"start"),e.startLoc==null)||n.gl.uniform1iv(e.startLoc,t)}},r}(),no=["x","y","z","w","u","v"],Td=function(){function r(t){this.variableNames=["source"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t,this.rank=t.length;var e=pe(this.rank),n=We("coords",this.rank),o=We("sourceLoc",this.rank),a=this.rank===1?"sourceLoc":"vec2("+o.slice(-2).join()+")",i="getChannel(getSource("+o.join()+"), "+a+")",s=`
      result.x = `+i+`;
      if (++`+n[this.rank-1]+" < "+t[this.rank-1]+`) {
        ++`+o[this.rank-1]+`;
        result.y = `+i+`;
        --`+o[this.rank-1]+`;
      }
    `,u=this.rank===1?"":`
      --`+n[this.rank-1]+`;
      if (++`+n[this.rank-2]+" < "+t[this.rank-2]+`) {
        ++`+o[this.rank-2]+`;
        result.z = `+i+`;
        if (++`+n[this.rank-1]+" < "+t[this.rank-1]+`) {
          ++`+o[this.rank-1]+`;
          result.w = `+i+`;
        }
      }
    `,l=this.rank<=4?`sourceLoc = coords +
            `+e+"("+t.map(function(c,f){return"start["+f+"]"}).join()+");":t.map(function(c,f){return o[f]+" = "+n[f]+" + start["+f+"];"}).join(`
`);this.userCode=`
      uniform int start[`+this.rank+`];
      void main() {
        `+e+` coords = getOutputCoords();
        `+e+` sourceLoc;
        `+l+`
        vec4 result = vec4(0.);
        `+s+`
        `+u+`
        setOutput(result);
      }
    `}return r.prototype.getCustomSetupFunc=function(t){var e=this;if(t.length!==this.rank)throw Error("The rank ("+this.rank+") of the program must match the length of start ("+t.length+")");return function(n,o){e.startLoc==null&&(e.startLoc=n.getUniformLocationNoThrow(o,"start"),e.startLoc==null)||n.gl.uniform1iv(e.startLoc,t)}},r}(),Nd=function(r,t,e){this.variableNames=["x"],this.outputShape=e;var n=e.length,o=pe(e.length),a=pe(e.length),i="";if(n===1)i="coords * strides + begin";else{var s=0;i=e.map(function(u,l){return s++,e.length===1?"coords * strides["+l+"] + begin["+l+"]":"coords["+(s-1)+"] * strides["+l+"] + begin["+l+"]"}).join(",")}this.userCode=`
      `+o+" begin = "+o+"("+r+`);
      `+o+" strides = "+o+"("+t+`);

      void main() {
        `+a+` coords = getOutputCoords();
        setOutput(getX(`+i+`));
      }
    `},Fd=function(){function r(t){this.gpgpu=t,this.numUsedTextures=0,this.numFreeTextures=0,this.freeTextures={},this.logEnabled=!1,this.usedTextures={}}return r.prototype.acquireTexture=function(t,e,n){var o,a=ci(e,n),i=fi(t,a,n);if(i in this.freeTextures||(this.freeTextures[i]=[]),i in this.usedTextures||(this.usedTextures[i]=[]),this.freeTextures[i].length>0){this.numFreeTextures--,this.numUsedTextures++,this.log();var s=this.freeTextures[i].shift();return this.usedTextures[i].push(s),s}return this.numUsedTextures++,this.log(),a===ze.PACKED_2X2_FLOAT32?o=this.gpgpu.createPackedMatrixTexture(t[0],t[1]):a===ze.PACKED_2X2_FLOAT16?o=this.gpgpu.createFloat16PackedMatrixTexture(t[0],t[1]):a===ze.UNPACKED_FLOAT32?o=this.gpgpu.createFloat32MatrixTexture(t[0],t[1]):a===ze.UNPACKED_FLOAT16?o=this.gpgpu.createFloat16MatrixTexture(t[0],t[1]):a===ze.PACKED_4X1_UNSIGNED_BYTE&&(o=this.gpgpu.createUnsignedBytesMatrixTexture(t[0],t[1])),this.usedTextures[i].push(o),o},r.prototype.releaseTexture=function(t,e,n,o){if(this.freeTextures!=null){var a=fi(e,ci(n,o),o);a in this.freeTextures||(this.freeTextures[a]=[]),this.freeTextures[a].push(t),this.numFreeTextures++,this.numUsedTextures--;var i=this.usedTextures[a],s=i.indexOf(t);if(s<0)throw new Error("Cannot release a texture that was never provided by this texture manager");i.splice(s,1),this.log()}},r.prototype.log=function(){if(this.logEnabled){var t=this.numFreeTextures+this.numUsedTextures;console.log("Free/Used",this.numFreeTextures+" / "+this.numUsedTextures,"("+t+")")}},r.prototype.getNumUsedTextures=function(){return this.numUsedTextures},r.prototype.getNumFreeTextures=function(){return this.numFreeTextures},r.prototype.dispose=function(){var t=this;if(this.freeTextures!=null){for(var e in this.freeTextures)this.freeTextures[e].forEach(function(n){t.gpgpu.deleteMatrixTexture(n)});for(var e in this.usedTextures)this.usedTextures[e].forEach(function(o){t.gpgpu.deleteMatrixTexture(o)});this.freeTextures=null,this.usedTextures=null,this.numUsedTextures=0,this.numFreeTextures=0}},r}();function ci(r,t){if(r===Ge.UPLOAD)return ze.PACKED_2X2_FLOAT32;if(r===Ge.RENDER||r==null)return function(e){return M().getBool("WEBGL_RENDER_FLOAT32_ENABLED")?e?ze.PACKED_2X2_FLOAT32:ze.UNPACKED_FLOAT32:e?ze.PACKED_2X2_FLOAT16:ze.UNPACKED_FLOAT16}(t);if(r===Ge.DOWNLOAD||r===Ge.PIXELS)return ze.PACKED_4X1_UNSIGNED_BYTE;throw new Error("Unknown logical texture type "+r)}function fi(r,t,e){return r[0]+"_"+r[1]+"_"+t+"_"+e}var _d=function(r,t){this.variableNames=["A"];for(var e=new Array(r.length),n=0;n<e.length;n++)e[n]=r[n]*t[n];this.outputShape=e,this.rank=e.length;var o=pe(this.rank),a=function(i){var s=i.length;if(s>5)throw Error("Tile for rank "+s+" is not yet supported");if(s===1)return"imod(resRC, "+i[0]+")";for(var u=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u"],l=[],c=0;c<i.length;c++)l.push("imod("+u[c]+", "+i[c]+")");return l.join()}(r);this.userCode=`
      void main() {
        `+o+` resRC = getOutputCoords();
        setOutput(getA(`+a+`));
      }
    `},Od=function(r,t){this.variableNames=["A"];for(var e=new Array(r.length),n=0;n<e.length;n++)e[n]=r[t[n]];this.outputShape=e,this.rank=e.length;var o=pe(this.rank),a=function(i){var s=i.length;if(s>6)throw Error("Transpose for rank "+s+" is not yet supported");for(var u=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u","resRC.v"],l=new Array(s),c=0;c<i.length;c++)l[i[c]]=u[c];return l.join()}(t);this.userCode=`
    void main() {
      `+o+` resRC = getOutputCoords();
      setOutput(getA(`+a+`));
    }
    `},Md=function(r,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0;for(var e=new Array(r.length),n=0;n<e.length;n++)e[n]=r[t[n]];if(this.outputShape=e,this.rank=e.length,this.rank>6)throw Error("Packed transpose for rank "+this.rank+" is not yet supported.");var o=pe(this.rank),a=lu("rc",this.rank),i=new Array(this.rank);for(n=0;n<t.length;n++)i[t[n]]=a[n];var s="vec2("+i.slice(-2).join()+")",u="++"+a[this.rank-1]+" < "+e[this.rank-1],l="getChannel(getA("+i.join()+"), "+s+")";this.userCode=`
    void main() {
      `+o+` rc = getOutputCoords();
      vec4 result = vec4(0.);
      result[0] = `+l+`;
      if(`+u+`) {
        result[1] = `+l+`;
      }
      --`+a[this.rank-1]+`;
      if(++`+a[this.rank-2]+" < "+e[this.rank-2]+`) {
        result[2] = `+l+`;
        if(`+u+`) {
          result[3] = `+l+`;
        }
      }
      setOutput(result);
    }
    `},va=1.7580993408473768,ma=1.0507009873554805,ne=function(r,t){this.variableNames=["A"],this.outputShape=r,this.userCode=`
      float unaryOperation(float x) {
        `+t+`
      }

      void main() {
        float x = getAAtOutCoords();
        float y = unaryOperation(x);

        setOutput(y);
      }
    `},Ze="if (isnan(x)) return x;",Bd="return x;",hi="return abs(x);",Nu=Ze+`
  return (x < 0.0) ? 0.0 : x;
`,Fu=Ze+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,_u="return (x >= 0.0) ? x : (exp(x) - 1.0);",Pd=`
  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.
  // see: https://arxiv.org/abs/1706.02515
  float scaleAlpha = `+va+`;
  float scale = `+ma+`;
  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);
`,di="return -x;",pi="return ceil(x);",vi="return floor(x);",mi="return exp(x);",gi="return exp(x) - 1.0;",Ld=Ze+`
  return sin(x);
`,Wd=Ze+`
  return cos(x);
`,Ud=Ze+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return asin(x);
`,zd=Ze+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return acos(x);
`,Vd=Ze+`
  return atan(x);
`,Gd=Ze+"return log(x + sqrt(x * x + 1.0));",Hd=Ze+`
  if (x < 1.0) return NAN;
  return log(x + sqrt(x * x - 1.0));`,qd=Ze+`
  if ((x < -1.0) || (x > 1.0)) return NAN;
  return (log(1.0 + x) - log(1.0 - x)) / 2.0;`,Qt="return x;",Kd="return x;",Ou=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,Mu=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,Bu=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,Ct=function(r,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=r,this.userCode=`
      vec4 unaryOperation(vec4 x) {
        `+t+`
      }

      void main() {
        vec4 x = getAAtOutCoords();
        vec4 y = unaryOperation(x);

        setOutput(y);
      }
    `},jd=function(r){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outputShape=r;var t=r.length,e=We("rc",t),n=pe(t),o=function(s,u){if(s===1)return"rc";for(var l="",c=0;c<s;c++)l+=u[c],c<s-1&&(l+=",");return l}(t,e),a=e.slice(-2),i=t<=1?"rc":"vec2("+a.join(",")+")";this.userCode=`
      void main() {
        `+n+` rc = getOutputCoords();
        vec4 packedInput = getA(`+o+`);

        setOutput(getChannel(packedInput, `+i+`));
      }
    `},Jt={};function Zt(r,t){if(t===void 0&&(t=!1),r==="linear")return t?Kd:Bd;if(r==="relu")return t?Ou:Nu;if(r==="elu")return t?Bu:_u;if(r==="relu6")return t?Mu:Fu;if(r==="prelu")return t?du:hu;throw new Error("Activation "+r+" has not been implemented for the WebGL backend.")}var Xd=600,Pu=function(r){function t(e){var n,o=r.call(this)||this;if(o.pendingRead=new WeakMap,o.pendingDisposal=new WeakSet,o.dataRefCount=new WeakMap,o.numBytesInGPU=0,o.uploadWaitMs=0,o.downloadWaitMs=0,o.warnedAboutMemory=!1,o.pendingDeletes=0,o.disposed=!1,!M().getBool("HAS_WEBGL"))throw new Error("WebGL is not supported on this device");if(e==null){var a=an(M().getNumber("WEBGL_VERSION"));o.binaryCache=((n=M().getNumber("WEBGL_VERSION"))in Jt||(Jt[n]={}),Jt[n]),o.gpgpu=new Tu(a),o.canvas=a.canvas,o.gpgpuCreatedLocally=!0}else o.gpgpu=e,o.binaryCache={},o.gpgpuCreatedLocally=!1,o.canvas=e.gl.canvas;return o.textureManager=new Fd(o.gpgpu),o.numMBBeforeWarning=M().global.screen==null?1024:M().global.screen.height*M().global.screen.width*window.devicePixelRatio*Xd/1024/1024,o.texData=new ia(o,D),o}return $e(t,r),t.prototype.numDataIds=function(){return this.texData.numDataIds()+(this.cpuBackend?this.cpuBackend.numDataIds():0)-this.pendingDeletes},t.prototype.write=function(e,n,o){if(M().getBool("DEBUG")&&this.checkNumericalProblems(e),o==="complex64"&&e!=null)throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");var a={};return this.texData.set(a,{shape:n,dtype:o,values:e,usage:Ge.UPLOAD}),a},t.prototype.move=function(e,n,o,a){if(M().getBool("DEBUG")&&this.checkNumericalProblems(n),a==="complex64")throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");this.texData.set(e,{shape:o,dtype:a,values:n,usage:Ge.UPLOAD})},t.prototype.readSync=function(e){var n=this.texData.get(e),o=n.values,a=n.dtype,i=n.complexTensors,s=n.slice,u=n.shape,l=n.isPacked;if(s!=null){var c=void 0;c=l?new Ct(u,Qt):new ne(u,Qt);var f=this.runWebGLProgram(c,[{dataId:e,shape:u,dtype:a}],a),h=this.readSync(f.dataId);return this.disposeData(f.dataId),h}if(o!=null)return this.convertAndCacheOnCPU(e);if(a==="string")return o;var d,p,m=this.activeTimers!=null;return m&&(d=Ke()),a==="complex64"?p=Do(i.real.dataSync(),i.imag.dataSync()):p=this.getValuesFromTexture(e),m&&(this.downloadWaitMs+=Ke()-d),this.convertAndCacheOnCPU(e,p)},t.prototype.read=function(e){return j(this,void 0,void 0,function(){var n,o,a,i,s,u,l,c,f,h,d,p,m,v,g,y,x,b,w,R,A,k;return X(this,function(I){switch(I.label){case 0:if(this.pendingRead.has(e))return n=this.pendingRead.get(e),[2,new Promise(function(S){return n.push(S)})];if(o=this.texData.get(e),a=o.values,i=o.shape,s=o.slice,u=o.dtype,l=o.complexTensors,c=o.isPacked,s!=null)return f=void 0,f=c?new Ct(i,Qt):new ne(i,Qt),h=this.runWebGLProgram(f,[{dataId:e,shape:i,dtype:u}],u),d=this.read(h.dataId),this.disposeData(h.dataId),[2,d];if(a!=null)return[2,this.convertAndCacheOnCPU(e)];if(!M().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")&&M().getNumber("WEBGL_VERSION")===2)throw new Error("tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and WEBGL_VERSION=2 not yet supported.");return p=null,u!=="complex64"&&M().get("WEBGL_BUFFER_SUPPORTED")&&(m=this.decode(e),v=this.texData.get(m.dataId),p=(k=this.gpgpu).createBufferFromTexture.apply(k,[v.texture].concat(kt(i)))),this.pendingRead.set(e,[]),u==="complex64"?[3,2]:[4,this.gpgpu.createAndWaitForFence()];case 1:I.sent(),I.label=2;case 2:return u!=="complex64"?[3,4]:[4,Promise.all([l.real.data(),l.imag.data()])];case 3:return y=I.sent(),x=y[0],b=y[1],g=Do(x,b),[3,5];case 4:p==null?g=this.getValuesFromTexture(e):(w=Y(i),g=this.gpgpu.downloadFloat32MatrixFromBuffer(p,w)),I.label=5;case 5:return m!=null&&this.disposeData(m.dataId),R=this.convertAndCacheOnCPU(e,g),A=this.pendingRead.get(e),this.pendingRead.delete(e),A.forEach(function(S){return S(R)}),this.pendingDisposal.has(e)&&(this.pendingDisposal.delete(e),this.disposeData(e),this.pendingDeletes--),[2,R]}})})},t.prototype.checkNumericalProblems=function(e){if(e!=null)for(var n=0;n<e.length;n++){var o=e[n];if(!Zi(o))throw M().getBool("WEBGL_RENDER_FLOAT32_CAPABLE")?Error("The value "+o+" cannot be represented with your current settings. Consider enabling float32 rendering: 'tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', true);'"):Error("The value "+o+" cannot be represented on this device.")}},t.prototype.getValuesFromTexture=function(e){var n,o=this.texData.get(e),a=o.shape,i=o.dtype,s=o.isPacked,u=Y(a);if(M().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")){var l=this.decode(e),c=this.texData.get(l.dataId),f=(n=this.gpgpu).downloadMatrixFromPackedTexture.apply(n,[c.texture].concat(kt(a))).subarray(0,u);return this.disposeData(l.dataId),f}var h=M().getBool("WEBGL_PACK")&&s===!0,d=h?ir(a):a,p=h?new Jh(d):new Qh(d),m=this.runWebGLProgram(p,[{shape:d,dtype:i,dataId:e}],"float32"),v=this.texData.get(m.dataId),g=this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(v.texture,v.texShape[0],v.texShape[1]).subarray(0,u);return this.disposeData(m.dataId),g},t.prototype.time=function(e){return j(this,void 0,void 0,function(){var n,o,a,i,s,u,l;return X(this,function(c){switch(c.label){case 0:return n=this.activeTimers,o=[],a=!1,this.programTimersStack==null?(this.programTimersStack=o,a=!0):this.activeTimers.push(o),this.activeTimers=o,e(),i=vn(this.activeTimers.map(function(f){return f.query})).filter(function(f){return f!=null}),s=vn(this.activeTimers.map(function(f){return f.name})).filter(function(f){return f!=null}),this.activeTimers=n,a&&(this.programTimersStack=null),u={uploadWaitMs:this.uploadWaitMs,downloadWaitMs:this.downloadWaitMs,kernelMs:null,wallMs:null},M().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?[4,Promise.all(i)]:[3,2];case 1:return l=c.sent(),u.kernelMs=Pi(l),u.getExtraProfileInfo=function(){return l.map(function(f,h){return{name:s[h],ms:f}}).map(function(f){return f.name+": "+f.ms}).join(", ")},[3,3];case 2:u.kernelMs={error:"WebGL query timers are not supported in this environment."},c.label=3;case 3:return this.uploadWaitMs=0,this.downloadWaitMs=0,[2,u]}})})},t.prototype.memory=function(){return{unreliable:!1,numBytesInGPU:this.numBytesInGPU}},t.prototype.startTimer=function(){return M().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?this.gpgpu.beginQuery():{startMs:Ke(),endMs:null}},t.prototype.endTimer=function(e){return M().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?(this.gpgpu.endQuery(),e):(e.endMs=Ke(),e)},t.prototype.getQueryTime=function(e){return j(this,void 0,void 0,function(){var n;return X(this,function(o){return M().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?[2,this.gpgpu.waitForQueryAndGetTime(e)]:[2,(n=e).endMs-n.startMs]})})},t.prototype.disposeData=function(e){if(!this.pendingDisposal.has(e)){if(this.pendingRead.has(e))return this.pendingDisposal.add(e),void this.pendingDeletes++;if(this.texData.has(e)){this.releaseGPUData(e);var n=this.texData.get(e).complexTensors;n!=null&&(n.real.dispose(),n.imag.dispose()),this.texData.delete(e)}}},t.prototype.releaseGPUData=function(e){var n=this.texData.get(e),o=n.texture,a=n.dtype,i=n.texShape,s=n.usage,u=n.isPacked,l=n.slice,c=l&&l.origDataId||e,f=this.dataRefCount.get(c);f>1?this.dataRefCount.set(c,f-1):(this.dataRefCount.delete(c),o!=null&&(this.numBytesInGPU-=this.computeBytes(i,a),this.textureManager.releaseTexture(o,i,s,u)));var h=this.texData.get(e);h.texture=null,h.texShape=null,h.isPacked=!1,h.slice=null},t.prototype.getTexture=function(e){return this.uploadToGPU(e),this.texData.get(e).texture},t.prototype.getDataInfo=function(e){return this.texData.get(e)},t.prototype.getCPUBackend=function(){return M().getBool("WEBGL_CPU_FORWARD")?(this.cpuBackend==null&&(this.cpuBackend=D.findBackend("cpu")),this.cpuBackend):null},t.prototype.shouldExecuteOnCPU=function(e,n){var o=this;return n===void 0&&(n=128),this.getCPUBackend()!=null&&e.every(function(a){return o.texData.get(a.dataId).texture==null&&a.size<n})},t.prototype.getGPGPUContext=function(){return this.gpgpu},t.prototype.complex=function(e,n){var o=this.makeOutput(e.shape,"complex64");return this.texData.get(o.dataId).complexTensors={real:D.keep(e.clone()),imag:D.keep(n.clone())},o},t.prototype.real=function(e){return this.texData.get(e.dataId).complexTensors.real.clone()},t.prototype.imag=function(e){return this.texData.get(e.dataId).complexTensors.imag.clone()},t.prototype.slice=function(e,n,o){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.slice(e,n,o);if(Y(o)===0)return Ne([],o,e.dtype);var a=this.texData.get(e.dataId).isPacked,i=oa(e.shape,n,o);if(a||!i){var s=M().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Td(o):new Dd(o),u=s.getCustomSetupFunc(n);return this.compileAndRun(s,[e],null,u)}return this.uploadToGPU(e.dataId),this.shallowSlice(e,n,o)},t.prototype.shallowSlice=function(e,n,o){var a=this.texData.get(e.dataId),i=this.makeOutput(o,e.dtype),s=this.texData.get(i.dataId);Object.assign(s,a),s.shape=o,s.dtype=e.dtype;var u=aa(n,e.strides);a.slice&&(u+=a.slice.flatOffset),s.slice={flatOffset:u,origDataId:a.slice&&a.slice.origDataId||e.dataId};var l=this.dataRefCount.get(s.slice.origDataId)||1;return this.dataRefCount.set(s.slice.origDataId,l+1),i},t.prototype.stridedSlice=function(e,n,o,a){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.stridedSlice(e,n,o,a);var i=Sr(n,o,a);if(i.some(function(u){return u===0}))return Ne([],i);var s=new Nd(n,a,i);return this.compileAndRun(s,[e])},t.prototype.reverse=function(e,n){var o=M().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new kd(e.shape,n):new Id(e.shape,n);return this.compileAndRun(o,[e])},t.prototype.concat=function(e,n){if(e[0].dtype==="complex64"){var o=e.map(function(d){return Ve(d)}),a=e.map(function(d){return je(d)});return Ae(this.concat(o,n),this.concat(a,n))}if(this.shouldExecuteOnCPU(e))return this.cpuBackend.concat(e,n);if(e.length===1)return e[0];if(e.length>M().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER")){var i=Math.floor(e.length/2),s=this.concat(e.slice(0,i),n),u=this.concat(e.slice(i),n);return this.concat([s,u],n)}if(M().getBool("WEBGL_PACK_ARRAY_OPERATIONS")&&e[0].rank>1){var l=new Ph(e.map(function(d){return d.shape}),n);return this.compileAndRun(l,e)}var c=Vn(e.map(function(d){return d.shape}),n),f=e.map(function(d){return d.as2D(-1,Y(d.shape.slice(n)))}),h=new Bh(f.map(function(d){return d.shape}));return this.compileAndRun(h,f).reshape(c)},t.prototype.neg=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.neg(e);if(M().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,di,e.dtype);var n=new ne(e.shape,di);return this.compileAndRun(n,[e])},t.prototype.batchMatMul=function(e,n,o,a){var i=o?e.shape[2]:e.shape[1],s=a?n.shape[1]:n.shape[2],u=o?e.shape[1]:e.shape[2],l=e.shape[0];if((i===1||s===1)&&u>1e3){o&&(e=e.transpose([0,2,1])),a&&(n=n.transpose([0,2,1]));var c=s===1?e:e.as3D(l,u,1),f=s===1?2:1,h=s===1?n.as3D(l,1,u):n;return this.multiply(c,h).sum(f,!0)}var d=De(e.dtype,n.dtype),p=new Jr(e.shape,[l,i,s],o,a);return this.compileAndRun(p,[e,n],d)},t.prototype.fusedBatchMatMul=function(e){var n=e.a,o=e.b,a=e.transposeA,i=e.transposeB,s=e.bias,u=e.activation,l=e.preluActivationWeights,c=a?n.shape[2]:n.shape[1],f=i?o.shape[1]:o.shape[2],h=n.shape[0],d=De(n.dtype,o.dtype),p=s!=null,m=l!=null,v=u?Zt(u,!0):null,g=new Jr(n.shape,[h,c,f],a,i,p,v,m),y=[n,o];return s&&y.push(s),l&&y.push(l),this.compileAndRun(g,y,d)},t.prototype.multiply=function(e,n){if(e.dtype==="complex64"){var o=this.texData.get(e.dataId),a=this.texData.get(n.dataId),i=new ni(Nh,e.shape,n.shape),s=new ni(Fh,e.shape,n.shape),u=[this.makeComplexComponentTensorInfo(e,o.complexTensors.real),this.makeComplexComponentTensorInfo(e,o.complexTensors.imag),this.makeComplexComponentTensorInfo(n,a.complexTensors.real),this.makeComplexComponentTensorInfo(n,a.complexTensors.imag)],l=this.compileAndRun(i,u),c=this.compileAndRun(s,u),f=this.complex(l,c);return l.dispose(),c.dispose(),f}if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.multiply(e,n);if(M().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,ti,e.dtype);var h=new be(ti,e.shape,n.shape);return this.compileAndRun(h,[e,n],e.dtype)},t.prototype.batchNormalization=function(e,n,o,a,i,s){var u=[e,n,o],l=null;s!=null&&(l=s.shape,u.push(s));var c=null;if(i!=null&&(c=i.shape,u.push(i)),M().getBool("WEBGL_PACK_NORMALIZATION")){var f=new Th(e.shape,n.shape,o.shape,l,c,a);return this.compileAndRun(f,u)}var h=new Dh(e.shape,n.shape,o.shape,l,c,a);return this.compileAndRun(h,u)},t.prototype.localResponseNormalization4D=function(e,n,o,a,i){var s=M().getBool("WEBGL_PACK_NORMALIZATION")?new cd(e.shape,n,o,a,i):new ud(e.shape,n,o,a,i);return this.compileAndRun(s,[e])},t.prototype.LRNGrad=function(e,n,o,a,i,s,u){var l=new ld(n.shape,a,i,s,u);return this.compileAndRun(l,[n,o,e])},t.prototype.tile=function(e,n){if(e.dtype==="string"){var o=this.readSync(e.dataId).map(function(i){return Tt(i)});return su(ee(e.shape,e.dtype,o),n)}var a=new _d(e.shape,n);return this.compileAndRun(a,[e])},t.prototype.pad=function(e,n,o){var a=M().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new gd(e.shape,n,o):new md(e.shape,n,o);return this.compileAndRun(a,[e])},t.prototype.transpose=function(e,n){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.transpose(e,n);var o=M().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Md(e.shape,n):new Od(e.shape,n);return this.compileAndRun(o,[e])},t.prototype.gather=function(e,n,o){if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.gather(e,n,o);var a=new od(e.shape,n.size,o);return this.compileAndRun(a,[e,n])},t.prototype.batchToSpaceND=function(e,n,o){E(e.rank<=4,function(){return"batchToSpaceND for rank > 4 with a WebGL backend not implemented yet"});var a=n.reduce(function(f,h){return f*h}),i=pr(e.shape,n,a),s=vr(i.length,n.length),u=mr(e.shape,n,a),l=$s(o,n.length),c=Qs(u,o,n.length);return e.reshape(i).transpose(s).reshape(u).slice(l,c)},t.prototype.spaceToBatchND=function(e,n,o){E(e.rank<=4,function(){return"spaceToBatchND for rank > 4 with a WebGL backend not implemented yet"});var a=n.reduce(function(h,d){return h*d}),i=[[0,0]];i.push.apply(i,o);for(var s=1+n.length;s<e.shape.length;++s)i.push([0,0]);var u=e.pad(i),l=pr(u.shape,n,a,!1),c=vr(l.length,n.length,!1),f=mr(u.shape,n,a,!1);return u.reshape(l).transpose(c).reshape(f)},t.prototype.reduce=function(e,n,o){var a=e.shape[0],i=e.shape[1],s=sr(i),u=new yd({windowSize:s,inSize:i,batchSize:a},n),l=this.compileAndRun(u,[e],o);return l.shape[1]===1?l:this.reduce(l,n,o)},t.prototype.argReduce=function(e,n,o){o===void 0&&(o=null);var a=e.shape[0],i=e.shape[1];o!=null&&(a=o.shape[0],i=o.shape[1]);var s=sr(i),u=new bh({windowSize:s,inSize:i,batchSize:a},n,o==null),l=[e];o!=null&&l.push(o);var c=this.compileAndRun(u,l,"int32");return c.shape[1]===1?c:this.argReduce(e,n,c)},t.prototype.argReducePacked=function(e,n,o){o===void 0&&(o=null);var a=o!=null?o.shape:e.shape,i=sr(a[a.length-1]),s=new kh(a,i,n,o==null),u=o==null?[e]:[e,o],l=this.compileAndRun(s,u,"int32");return l.rank===e.rank?this.argReducePacked(e,n,l):l},t.prototype.sum=function(e,n){Le("sum",n,e.rank);var o=Te(e.shape,n),a=o[0],i=Y(o[1]),s=e.as2D(-1,i),u=nr(e.dtype);return this.reduce(s,"sum",u).reshape(a)},t.prototype.prod=function(e,n){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.prod(e,n);var o=Te(e.shape,n),a=o[0],i=Y(o[1]),s=e.as2D(-1,i),u=nr(e.dtype);return this.reduce(s,"prod",u).reshape(a)},t.prototype.unsortedSegmentSum=function(e,n,o){var a=0,i=Qe([a],e.rank),s=e;i!=null&&(s=e.transpose(i),a=Je(1,e.rank)[0]);var u=function(d,p,m){for(var v=[],g=d.length,y=0;y<g;y++)y!==p?v.push(d[y]):v.push(m);return v}(s.shape,a,o),l=Y([s.shape[a]]),c=s.as2D(-1,l),f=nr(e.dtype),h=this.segOpCompute(c,"unsortedSegmentSum",n,f,o).reshape(u);return i!=null&&(h=h.transpose(wr(i))),h},t.prototype.segOpCompute=function(e,n,o,a,i){var s=e.shape[0],u=e.shape[1],l=function(h,d){var p,m=!1;for(h<=ra?(p=h,m=!0):p=fr(h,Math.floor(Math.sqrt(h)));!m;)p>d||p===h?m=!0:p=fr(h,p+1);return p}(u,i),c=new Sd({windowSize:l,inSize:u,batchSize:s,numSegments:i}),f=this.compileAndRun(c,[e,o],a);return f.shape[1]===i?f:(o=Bt(0,i).tile([u/l]),this.segOpCompute(f,n,o,a,i))},t.prototype.argMinMaxReduce=function(e,n,o){var a=[n];if(Le("arg"+o.charAt(0).toUpperCase()+o.slice(1),a,e.rank),!M().getBool("WEBGL_PACK_REDUCE")||e.rank<=2){var i=Te(e.shape,a),s=i[0],u=Y(i[1]),l=e.as2D(-1,u);return this.argReduce(l,o).reshape(s)}return this.argReducePacked(e,o)},t.prototype.argMin=function(e,n){return this.argMinMaxReduce(e,n,"min")},t.prototype.argMax=function(e,n){return this.argMinMaxReduce(e,n,"max")},t.prototype.cumsum=function(e,n,o,a){if(n!==e.rank-1)throw new Error("WebGL cumsum shader expects an inner-most axis="+(e.rank-1)+" but got axis="+n);var i=new Kh(e.shape,o,a);return this.compileAndRun(i,[e])},t.prototype.equal=function(e,n){if(M().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(equal(a, b));
`,"bool");var o=new be("return float(a == b);",e.shape,n.shape);return this.compileAndRun(o,[e,n],"bool")},t.prototype.notEqual=function(e,n){if(M().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(notEqual(a, b));
`,"bool");var o=new be("return float(a != b);",e.shape,n.shape);return this.compileAndRun(o,[e,n],"bool")},t.prototype.less=function(e,n){if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.less(e,n);if(M().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(lessThan(a, b));
`,"bool");var o=new be("return float(a < b);",e.shape,n.shape);return this.compileAndRun(o,[e,n],"bool")},t.prototype.lessEqual=function(e,n){if(M().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(lessThanEqual(a, b));
`,"bool");var o=new be("return float(a <= b);",e.shape,n.shape);return this.compileAndRun(o,[e,n],"bool")},t.prototype.greater=function(e,n){if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.greater(e,n);if(M().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(greaterThan(a, b));
`,"bool");var o=new be("return float(a > b);",e.shape,n.shape);return this.compileAndRun(o,[e,n],"bool")},t.prototype.greaterEqual=function(e,n){if(M().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(greaterThanEqual(a, b));
`,"bool");var o=new be("return float(a >= b);",e.shape,n.shape);return this.compileAndRun(o,[e,n],"bool")},t.prototype.logicalNot=function(e){var n=new ne(e.shape,"return float(!(x >= 1.0));");return this.compileAndRun(n,[e])},t.prototype.logicalAnd=function(e,n){if(M().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(
    vec4(greaterThanEqual(a, vec4(1.0))) *
    vec4(greaterThanEqual(b, vec4(1.0))));
`,"bool");var o=new be("return float(a >= 1.0 && b >= 1.0);",e.shape,n.shape);return this.compileAndRun(o,[e,n],"bool")},t.prototype.logicalOr=function(e,n){if(M().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return min(
    vec4(greaterThanEqual(a, vec4(1.0))) +
    vec4(greaterThanEqual(b, vec4(1.0))),
    vec4(1.0));
`,"bool");var o=new be("return float(a >= 1.0 || b >= 1.0);",e.shape,n.shape);return this.compileAndRun(o,[e,n],"bool")},t.prototype.select=function(e,n,o){var a=new Ad(e.rank,n.shape,n.rank);return this.compileAndRun(a,[e,n,o],De(n.dtype,o.dtype))},t.prototype.where=function(e){hr("tf.where() in webgl locks the UI thread. Call tf.whereAsync() instead");var n=e.dataSync();return da(e.shape,n)},t.prototype.topk=function(e,n,o){return uu(e.dataSync(),e.shape,e.dtype,n)},t.prototype.min=function(e,n){Le("min",n,e.rank);var o=Te(e.shape,n),a=o[0],i=Y(o[1]),s=e.as2D(-1,i);return this.reduce(s,"min",s.dtype).reshape(a)},t.prototype.minimum=function(e,n){if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.minimum(e,n);var o=M().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new fn(`
  vec4 result = vec4(min(a, b));
  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));
  
  result.r = isNaN.r > 0. ? NAN : result.r;
  result.g = isNaN.g > 0. ? NAN : result.g;
  result.b = isNaN.b > 0. ? NAN : result.b;
  result.a = isNaN.a > 0. ? NAN : result.a;

  return result;
`,e.shape,n.shape):new be(`
  if (isnan(a)) return a;
  if (isnan(b)) return b;

  return min(a, b);
`,e.shape,n.shape);return this.compileAndRun(o,[e,n])},t.prototype.mod=function(e,n){var o=M().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new fn(`
  vec4 result = mod(a, b);
  vec4 isNaN = vec4(equal(b, vec4(0.0)));
  
  result.r = isNaN.r > 0. ? NAN : result.r;
  result.g = isNaN.g > 0. ? NAN : result.g;
  result.b = isNaN.b > 0. ? NAN : result.b;
  result.a = isNaN.a > 0. ? NAN : result.a;

  return result;
`,e.shape,n.shape):new be(`if (b == 0.0) return NAN;
  return mod(a, b);`,e.shape,n.shape);return this.compileAndRun(o,[e,n])},t.prototype.max=function(e,n){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.max(e,n);Le("max",n,e.rank);var o=Te(e.shape,n),a=o[0],i=Y(o[1]),s=e.as2D(-1,i);return this.reduce(s,"max",s.dtype).reshape(a)},t.prototype.maximum=function(e,n){if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.maximum(e,n);var o=M().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new fn(`
  vec4 result = vec4(max(a, b));
  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));
  
  result.r = isNaN.r > 0. ? NAN : result.r;
  result.g = isNaN.g > 0. ? NAN : result.g;
  result.b = isNaN.b > 0. ? NAN : result.b;
  result.a = isNaN.a > 0. ? NAN : result.a;

  return result;
`,e.shape,n.shape):new be(`
  if (isnan(a)) return a;
  if (isnan(b)) return b;

  return max(a, b);
`,e.shape,n.shape);return this.compileAndRun(o,[e,n])},t.prototype.all=function(e,n){Le("all",n,e.rank);var o=Te(e.shape,n),a=o[0],i=Y(o[1]),s=e.as2D(-1,i);return this.reduce(s,"all",s.dtype).reshape(a)},t.prototype.any=function(e,n){Le("any",n,e.rank);var o=Te(e.shape,n),a=o[0],i=Y(o[1]),s=e.as2D(-1,i);return this.reduce(s,"any",s.dtype).reshape(a)},t.prototype.realDivide=function(e,n){if(M().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  // vec4 one = vec4(equal(a, b));
  // return one + (vec4(1.0) - one) * a / b;
  vec4 result = a / b;
  if(a.x == b.x) {
    result.x = 1.;
  }
  if(a.y == b.y) {
    result.y = 1.;
  }
  if(a.z == b.z) {
    result.z = 1.;
  }
  if(a.w == b.w) {
    result.w = 1.;
  }

  return result;
`,"float32",!0);var o=new be(`
if (a == b) {
  return 1.0;
};
return a / b;`,e.shape,n.shape);return this.compileAndRun(o,[e,n],"float32")},t.prototype.floorDiv=function(e,n){if(M().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  ivec4 ia = round(a);
  ivec4 ib = round(b);
  bvec4 cond = notEqual(ib, ivec4(0));
  ivec4 result = ivec4(0);
  vec4 s = sign(a) * sign(b);

  // Windows (D3D) wants guaranteed non-zero int division at compile-time.
  if (cond[0]) {
    result[0] = idiv(ia[0], ib[0], s[0]);
  }
  if (cond[1]) {
    result[1] = idiv(ia[1], ib[1], s[1]);
  }
  if (cond[2]) {
    result[2] = idiv(ia[2], ib[2], s[2]);
  }
  if (cond[3]) {
    result[3] = idiv(ia[3], ib[3], s[3]);
  }
  return vec4(result);
`,"int32");var o=new be(`
  float s = sign(a) * sign(b);
  int ia = round(a);
  int ib = round(b);
  if (ib != 0) {
    // Windows (D3D) wants guaranteed non-zero int division at compile-time.
    return float(idiv(ia, ib, s));
  } else {
    return NAN;
  }
`,e.shape,n.shape);return this.compileAndRun(o,[e,n],"int32")},t.prototype.add=function(e,n){if(e.dtype==="complex64"&&n.dtype==="complex64")return this.complexSeparableBinaryOp(e,n,$r);if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.add(e,n);var o=De(e.dtype,n.dtype);if(M().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,$r,o);var a=new be($r,e.shape,n.shape);return this.compileAndRun(a,[e,n],o)},t.prototype.packedUnaryOp=function(e,n,o){var a=new Ct(e.shape,n);return this.compileAndRun(a,[e],o)},t.prototype.packedBinaryOp=function(e,n,o,a,i){i===void 0&&(i=!1);var s=new fn(o,e.shape,n.shape,i);return this.compileAndRun(s,[e,n],a)},t.prototype.complexSeparableBinaryOp=function(e,n,o){var a=this,i=this.texData.get(e.dataId),s=this.texData.get(n.dataId),u=[[i.complexTensors.real,s.complexTensors.real],[i.complexTensors.imag,s.complexTensors.imag]].map(function(h){var d=h[0],p=h[1],m=a.makeComplexComponentTensorInfo(e,d),v=a.makeComplexComponentTensorInfo(n,p),g=new be(o,e.shape,n.shape);return a.compileAndRun(g,[m,v],De(d.dtype,p.dtype))}),l=u[0],c=u[1],f=this.complex(l,c);return l.dispose(),c.dispose(),f},t.prototype.makeComplexComponentTensorInfo=function(e,n){return{dataId:n.dataId,dtype:n.dtype,shape:e.shape}},t.prototype.addN=function(e){if(e.length===1)return e[0];if(e.length>M().get("WEBGL_MAX_TEXTURES_IN_SHADER")){var n=Math.floor(e.length/2),o=this.addN(e.slice(0,n)),a=this.addN(e.slice(n));return this.addN([o,a])}var i=e.map(function(l){return l.dtype}).reduce(function(l,c){return De(l,c)}),s=e.map(function(l){return l.shape}),u=M().getBool("WEBGL_PACK")?new xh(e[0].shape,s):new yh(e[0].shape,s);return this.compileAndRun(u,e,i)},t.prototype.subtract=function(e,n){if(e.dtype==="complex64"&&n.dtype==="complex64")return this.complexSeparableBinaryOp(e,n,Qr);if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.subtract(e,n);var o=De(e.dtype,n.dtype);if(M().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,Qr,e.dtype);var a=new be(Qr,e.shape,n.shape);return this.compileAndRun(a,[e,n],o)},t.prototype.pow=function(e,n){var o=M().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new fn(`
  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.
  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));
  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);
  vec4 result = multiplier * pow(abs(a), b);

  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS
  bvec4 isExpZero = equal(b, vec4(0.0));
  result.r = isExpZero.r ? 1.0 : result.r;
  result.g = isExpZero.g ? 1.0 : result.g;
  result.b = isExpZero.b ? 1.0 : result.b;
  result.a = isExpZero.a ? 1.0 : result.a;

  vec4 isNaN = vec4(lessThan(a, vec4(0.0))) * vec4(lessThan(floor(b), b));
  
  result.r = isNaN.r > 0. ? NAN : result.r;
  result.g = isNaN.g > 0. ? NAN : result.g;
  result.b = isNaN.b > 0. ? NAN : result.b;
  result.a = isNaN.a > 0. ? NAN : result.a;

  return result;
`,e.shape,n.shape):new be(`
if(a < 0.0 && floor(b) < b){
  return NAN;
}
if (b == 0.0) {
  return 1.0;
}
return (round(mod(b, 2.0)) != 1) ?
    pow(abs(a), b) : sign(a) * pow(abs(a), b);
`,e.shape,n.shape),a=De(e.dtype,n.dtype);return this.compileAndRun(o,[e,n],a)},t.prototype.ceil=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.ceil(e);if(M().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,pi,e.dtype);var n=new ne(e.shape,pi);return this.compileAndRun(n,[e])},t.prototype.floor=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.floor(e);if(M().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,vi,e.dtype);var n=new ne(e.shape,vi);return this.compileAndRun(n,[e])},t.prototype.sign=function(e){var n=new ne(e.shape,`
  if (isnan(x)) { return 0.0; }
  return sign(x);
`);return this.compileAndRun(n,[e])},t.prototype.isNaN=function(e){var n=new ne(e.shape,"return float(isnan(x));");return this.compileAndRun(n,[e],"bool")},t.prototype.isInf=function(e){var n=new ne(e.shape,"return float(isinf(x));");return this.compileAndRun(n,[e],"bool")},t.prototype.isFinite=function(e){var n=new ne(e.shape,"return float(!isnan(x) && !isinf(x));");return this.compileAndRun(n,[e],"bool")},t.prototype.round=function(e){var n=new ne(e.shape,`
  // OpenGL ES does not support round function.
  // The algorithm is based on banker's rounding.
  float base = floor(x);
  if ((x - base) < 0.5) {
    return floor(x);
  } else if ((x - base) > 0.5) {
    return ceil(x);
  } else {
    if (mod(base, 2.0) == 0.0) {
      return base;
    } else {
      return base + 1.0;
    }
  }
`);return this.compileAndRun(n,[e])},t.prototype.exp=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.exp(e);if(M().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,mi,e.dtype);var n=new ne(e.shape,mi);return this.compileAndRun(n,[e])},t.prototype.expm1=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.expm1(e);if(M().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,gi,e.dtype);var n=new ne(e.shape,gi);return this.compileAndRun(n,[e])},t.prototype.softmax=function(e,n){var o=ke([n],e.shape),a=this.max(e,o),i=Be(a.shape,o),s=this.subtract(e,a.reshape(i)),u=this.exp(s),l=this.sum(u,o).reshape(i);return this.realDivide(u,l)},t.prototype.log=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.log(e);if(M().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,`
  vec4 result = log(x);
  vec4 isNaN = vec4(lessThan(x, vec4(0.0)));
  result.r = isNaN.r == 1.0 ? NAN : result.r;
  result.g = isNaN.g == 1.0 ? NAN : result.g;
  result.b = isNaN.b == 1.0 ? NAN : result.b;
  result.a = isNaN.a == 1.0 ? NAN : result.a;

  return result;
`,e.dtype);var n=new ne(e.shape,`if (x < 0.0) return NAN;
  return log(x);`);return this.compileAndRun(n,[e])},t.prototype.log1p=function(e){var n=new ne(e.shape,"return log(1.0 + x);");return this.compileAndRun(n,[e])},t.prototype.sqrt=function(e){var n=new ne(e.shape,"return sqrt(x);");return this.compileAndRun(n,[e])},t.prototype.rsqrt=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.rsqrt(e);var n=new ne(e.shape,"return inversesqrt(x);");return this.compileAndRun(n,[e])},t.prototype.reciprocal=function(e){var n=new ne(e.shape,"return 1.0 / x;");return this.compileAndRun(n,[e])},t.prototype.relu=function(e){var n;return n=M().getBool("WEBGL_PACK")?new Ct(e.shape,Ou):new ne(e.shape,Nu),this.compileAndRun(n,[e])},t.prototype.relu6=function(e){var n;return n=M().getBool("WEBGL_PACK")?new Ct(e.shape,Mu):new ne(e.shape,Fu),this.compileAndRun(n,[e])},t.prototype.prelu=function(e,n){var o=M().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new fn(du,e.shape,n.shape):new be(hu,e.shape,n.shape);return this.compileAndRun(o,[e,n])},t.prototype.elu=function(e){if(M().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,Bu,e.dtype);var n=new ne(e.shape,_u);return this.compileAndRun(n,[e])},t.prototype.eluDer=function(e,n){var o=M().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new fn(`
  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));
  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));
`,e.shape,n.shape):new be("return (b >= 1.0) ? a : a * (b + 1.0);",e.shape,n.shape);return this.compileAndRun(o,[e,n])},t.prototype.selu=function(e){var n=new ne(e.shape,Pd);return this.compileAndRun(n,[e])},t.prototype.int=function(e){var n=new ne(e.shape,"return float(int(x));");return this.compileAndRun(n,[e],"int32")},t.prototype.clip=function(e,n,o){var a,i=(a=M().getBool("WEBGL_PACK_CLIP")?new Oh(e.shape):new _h(e.shape)).getCustomSetupFunc(n,o);return this.compileAndRun(a,[e],null,i)},t.prototype.abs=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.abs(e);if(M().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,hi,e.dtype);var n=new ne(e.shape,hi);return this.compileAndRun(n,[e])},t.prototype.complexAbs=function(e){var n=this.texData.get(e.dataId),o=new Mh(e.shape),a=[this.makeComplexComponentTensorInfo(e,n.complexTensors.real),this.makeComplexComponentTensorInfo(e,n.complexTensors.imag)];return this.compileAndRun(o,a)},t.prototype.sigmoid=function(e){var n=new ne(e.shape,"return 1.0 / (1.0 + exp(-1.0 * x));");return this.compileAndRun(n,[e])},t.prototype.softplus=function(e){var n=new ne(e.shape,`
  float epsilon = 1.1920928955078125e-7;
  float threshold = log(epsilon) + 2.0;

  bool too_large = x > -threshold;
  bool too_small = x < threshold;

  float result;
  float exp_x = exp(x);

  if (too_large){
    result = x;
  }
  else if (too_small){
    result = exp_x;
  }
  else{
    result = log(exp_x + 1.0);
  }
  return result;
`);return this.compileAndRun(n,[e])},t.prototype.sin=function(e){var n=new ne(e.shape,Ld);return this.compileAndRun(n,[e])},t.prototype.cos=function(e){var n=new ne(e.shape,Wd);return this.compileAndRun(n,[e])},t.prototype.tan=function(e){var n=new ne(e.shape,"return tan(x);");return this.compileAndRun(n,[e])},t.prototype.asin=function(e){var n=new ne(e.shape,Ud);return this.compileAndRun(n,[e])},t.prototype.acos=function(e){var n=new ne(e.shape,zd);return this.compileAndRun(n,[e])},t.prototype.atan=function(e){var n=new ne(e.shape,Vd);return this.compileAndRun(n,[e])},t.prototype.atan2=function(e,n){var o=M().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new fn(`
  vec4 result = atan(a, b);
  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));
  
  result.r = isNaN.r > 0. ? NAN : result.r;
  result.g = isNaN.g > 0. ? NAN : result.g;
  result.b = isNaN.b > 0. ? NAN : result.b;
  result.a = isNaN.a > 0. ? NAN : result.a;

  return result;
`,e.shape,n.shape):new be(`
  if (isnan(a)) return a;
  if (isnan(b)) return b;

  return atan(a, b);
`,e.shape,n.shape);return this.compileAndRun(o,[e,n])},t.prototype.sinh=function(e){var n=new ne(e.shape,`
  float e2x = exp(x);
  return (e2x - 1.0 / e2x) / 2.0;
`);return this.compileAndRun(n,[e])},t.prototype.cosh=function(e){var n=new ne(e.shape,`
  float e2x = exp(-x);
  return (e2x + 1.0 / e2x) / 2.0;
`);return this.compileAndRun(n,[e])},t.prototype.tanh=function(e){var n=new ne(e.shape,`
  float e2x = exp(-2.0 * abs(x));
  return sign(x) * (1.0 - e2x) / (1.0 + e2x);
`);return this.compileAndRun(n,[e])},t.prototype.asinh=function(e){var n=new ne(e.shape,Gd);return this.compileAndRun(n,[e])},t.prototype.acosh=function(e){var n=new ne(e.shape,Hd);return this.compileAndRun(n,[e])},t.prototype.atanh=function(e){var n=new ne(e.shape,qd);return this.compileAndRun(n,[e])},t.prototype.erf=function(e){var n=new ne(e.shape,`
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  float p = 0.3275911;
  float a1 = 0.254829592;
  float a2 = -0.284496736;
  float a3 = 1.421413741;
  float a4 = -1.453152027;
  float a5 = 1.061405429;

  float sign = sign(x);
  x = abs(x);
  float t = 1.0 / (1.0 + p * x);
  return sign * (1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x));
`);return this.compileAndRun(n,[e])},t.prototype.step=function(e,n){var o=new ne(e.shape,function(a){return a===void 0&&(a=0),Ze+`
    return x > 0.0 ? 1.0 : float(`+a+`);
  `}(n));return this.compileAndRun(o,[e])},t.prototype.conv2dByMatMul=function(e,n,o,a,i,s){var u=e.shape,l=this.texData.get(e.dataId),c=o.inChannels,f=u[0]*u[1]*u[2],h=o.outChannels,d=o.dataFormat==="channelsLast",p=(f===1||h===1)&&c>1e3,m=u[2]%2!=0&&!!l.isPacked;if(p||!M().getBool("WEBGL_LAZILY_UNPACK")||!M().getBool("WEBGL_PACK_BINARY_OPERATIONS")||!m){var v=d?u[0]*u[1]*u[2]:u[0]*u[2]*u[3],g=this.reshape(e,[1,v,o.inChannels]),y=this.reshape(n,[1,o.inChannels,o.outChannels]);return this.reshape(this.fusedBatchMatMul({a:g,b:y,transposeA:!1,transposeB:!1,bias:a,activation:i,preluActivationWeights:s}),o.outShape)}var x=d?u[0]*u[1]*(u[2]+1):u[0]*u[2]*(u[3]+1),b={dataId:e.dataId,shape:[1,x,o.inChannels],dtype:e.dtype},w=l.shape;l.shape=l.shape.slice(),l.shape[l.shape.length-2]++,E(It(l.shape,b.shape),function(){return"packed reshape "+l.shape+" to "+b.shape+" isn't free"});var R=this.reshape(n,[1,o.inChannels,o.outChannels]),A=this.fusedBatchMatMul({a:b,b:R,transposeA:!1,transposeB:!1,bias:a,activation:i,preluActivationWeights:s}),k=this.texData.get(A.dataId);return E(k.isPacked,function(){return"batchMatMul result is expected to be packed"}),l.shape=w,k.shape=o.outShape,D.makeTensorFromDataId(A.dataId,o.outShape,A.dtype)},t.prototype.conv2dWithIm2Row=function(e,n,o,a,i,s){var u=o.filterWidth,l=o.filterHeight,c=o.inChannels,f=o.outWidth,h=o.outHeight,d=o.dataFormat==="channelsLast",p=u*l*c,m=h*f,v=[p,m],g=e.squeeze([0]),y=n.reshape([1,p,-1]),x=new sd(v,g.shape,o),b=this.compileAndRun(x,[g]).reshape([1,v[0],v[1]]),w=a!=null,R=s!=null,A=i?Zt(i,!0):null,k=new Jr(b.shape,[1,m,o.outChannels],!0,!1,w,A,R),I=[b,y];a&&I.push(a),R&&I.push(s);var S=this.compileAndRun(k,I);return d?S.reshape([1,h,f,o.outChannels]):S.reshape([1,o.outChannels,h,f])},t.prototype.fusedConv2d=function(e){var n=e.input,o=e.filter,a=e.convInfo,i=e.bias,s=e.activation,u=e.preluActivationWeights;if(a.filterHeight===1&&a.filterWidth===1&&a.dilationHeight===1&&a.dilationWidth===1&&a.strideHeight===1&&a.strideWidth===1&&(a.padInfo.type==="SAME"||a.padInfo.type==="VALID"))return this.conv2dByMatMul(n,o,a,i,s,u);if(M().getBool("WEBGL_CONV_IM2COL")&&n.shape[0]===1)return this.conv2dWithIm2Row(n,o,a,i,s,u);var l=i!=null,c=u!=null,f=s?Zt(s,!1):null,h=new ri(a,l,f,c),d=[n,o];return i&&d.push(i),u&&d.push(u),this.compileAndRun(h,d)},t.prototype.conv2d=function(e,n,o){if(o.filterHeight===1&&o.filterWidth===1&&o.dilationHeight===1&&o.dilationWidth===1&&o.strideHeight===1&&o.strideWidth===1&&(o.padInfo.type==="SAME"||o.padInfo.type==="VALID"))return this.conv2dByMatMul(e,n,o);if(M().getBool("WEBGL_CONV_IM2COL")&&e.shape[0]===1)return this.conv2dWithIm2Row(e,n,o);var a=new ri(o);return this.compileAndRun(a,[e,n])},t.prototype.conv2dDerInput=function(e,n,o){var a=new Wh(o);return this.compileAndRun(a,[e,n])},t.prototype.conv2dDerFilter=function(e,n,o){var a=new Lh(o);return this.compileAndRun(a,[e,n])},t.prototype.fusedDepthwiseConv2D=function(e){var n,o=e.input,a=e.filter,i=e.convInfo,s=e.bias,u=e.activation,l=e.preluActivationWeights,c=M().getBool("WEBGL_PACK_DEPTHWISECONV")&&i.strideWidth<=2&&i.outChannels/i.inChannels==1,f=u?Zt(u,c):null,h=[o,a],d=s!=null,p=l!=null;return d&&h.push(s),p&&h.push(l),c?(n=new ai(i,d,f,p),this.compileAndRun(n,h)):(n=new oi(i,d,f,p),this.compileAndRun(n,h))},t.prototype.depthwiseConv2D=function(e,n,o){var a;return M().getBool("WEBGL_PACK_DEPTHWISECONV")&&o.strideWidth<=2&&o.outChannels/o.inChannels==1?(a=new ai(o),this.compileAndRun(a,[e,n])):(a=new oi(o),this.compileAndRun(a,[e,n]))},t.prototype.depthwiseConv2DDerInput=function(e,n,o){var a=new Gh(o);return this.compileAndRun(a,[e,n])},t.prototype.depthwiseConv2DDerFilter=function(e,n,o){var a=new Vh(o);return this.compileAndRun(a,[e,n])},t.prototype.conv3d=function(e,n,o){var a=new Hh(o);return this.compileAndRun(a,[e,n])},t.prototype.conv3dDerInput=function(e,n,o){var a=new zh(o);return this.compileAndRun(a,[e,n])},t.prototype.conv3dDerFilter=function(e,n,o){var a=new Uh(o);return this.compileAndRun(a,[e,n])},t.prototype.maxPool=function(e,n){var o=new Zr(n,"max",!1);return this.compileAndRun(o,[e])},t.prototype.avgPool=function(e,n){var o=new Zr(n,"avg",!1);return this.compileAndRun(o,[e],"float32")},t.prototype.maxPoolBackprop=function(e,n,o,a){var i=new Zr(a,"max",!0),s=this.compileAndRun(i,[n]),u=new fd(a),l=this.compileAndRun(u,[e,s],n.dtype);return s.dispose(),l},t.prototype.avgPoolBackprop=function(e,n,o){var a=new Sh(o);return this.compileAndRun(a,[e],n.dtype)},t.prototype.cast=function(e,n){return la(e,n,this)},t.prototype.unstack=function(e,n){for(var o=e.shape[n],a=new Array(e.rank-1),i=0,s=0;s<e.rank;s++)s!==n&&(a[i++]=e.shape[s]);var u=new Array(e.rank).fill(0),l=e.shape.slice();l[n]=1;var c=new Array(o);for(s=0;s<c.length;s++)u[n]=s,c[s]=this.slice(e,u,l).reshape(a);return c},t.prototype.avgPool3d=function(e,n){var o=new eo(n,"avg",!1);return this.compileAndRun(o,[e],"float32")},t.prototype.avgPool3dBackprop=function(e,n,o){var a=new Ah(o);return this.compileAndRun(a,[e],n.dtype)},t.prototype.maxPool3d=function(e,n){var o=new eo(n,"max",!1);return this.compileAndRun(o,[e],"float32")},t.prototype.maxPool3dBackprop=function(e,n,o,a){var i=new eo(a,"max",!0),s=this.compileAndRun(i,[n]),u=new hd(a),l=this.compileAndRun(u,[e,s],n.dtype);return s.dispose(),l},t.prototype.reshape=function(e,n){var o=this.texData.get(e.dataId);if(o.isPacked&&!It(e.shape,n)&&(o.texture===null||!It(o.shape,n))){var a=this.packedReshape(e,n);return D.makeTensorFromDataId(a.dataId,a.shape,a.dtype)}return yr(e,n)},t.prototype.resizeBilinear=function(e,n,o,a){var i=M().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new Cd(e.shape,n,o,a):new wd(e.shape,n,o,a);return this.compileAndRun(i,[e],"float32")},t.prototype.resizeBilinearBackprop=function(e,n,o){var a=new bd(e,n,o);return this.compileAndRun(a,[e])},t.prototype.resizeNearestNeighbor=function(e,n,o,a){var i=new Rd(e.shape,n,o,a);return this.compileAndRun(i,[e])},t.prototype.resizeNearestNeighborBackprop=function(e,n,o){var a=new Ed(e,n,o);return this.compileAndRun(a,[e])},t.prototype.multinomial=function(e,n,o,a){var i=n?e:Dr(e),s=i.shape[0],u=i.shape[1],l=new dd(s,u,o),c=l.getCustomSetupFunc(a);return this.compileAndRun(l,[i],"int32",c)},t.prototype.oneHot=function(e,n,o,a){var i=new pd(e.size,n,o,a);return this.compileAndRun(i,[e])},t.prototype.diag=function(e){var n=new $h(e.size);return this.compileAndRun(n,[e])},t.prototype.nonMaxSuppression=function(e,n,o,a,i){return hr("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead"),fa(e.dataSync(),n.dataSync(),o,a,i)},t.prototype.cropAndResize=function(e,n,o,a,i,s){var u=new qh(e.shape,n.shape,a,i,s);return this.compileAndRun(u,[e,n,o],"float32")},t.prototype.depthToSpace=function(e,n,o){E(n>1,function(){return"blockSize should be > 1 for depthToSpace, but was: "+n});var a=e.shape[0],i=o==="NHWC"?e.shape[1]:e.shape[2],s=o==="NHWC"?e.shape[2]:e.shape[3],u=o==="NHWC"?e.shape[3]:e.shape[1],l=i*n,c=s*n,f=u/(n*n),h=new Yh(o==="NHWC"?[a,l,c,f]:[a,f,l,c],n,o);return this.compileAndRun(h,[e])},t.prototype.split=function(e,n,o){return iu(e,n,o)},t.prototype.scatterND=function(e,n,o){var a=Pt(0,e,o),i=a.sliceRank,s=a.numUpdates,u=a.sliceSize,l=a.strides,c=a.outputSize,f=[c/u,u],h=e.reshape([s,i]),d=n.reshape([s,u]);if(c===0)return yr(Ne([]),o);var p=$(0),m=new li(s,i,h.rank,d.rank,l,f);return this.compileAndRun(m,[d,h,p]).reshape(o)},t.prototype.sparseToDense=function(e,n,o,a){var i=Pt(0,e,o),s=i.sliceRank,u=i.numUpdates,l=i.strides,c=i.outputSize,f=new li(u,s,e.rank,n.rank,l,[c,1]);return this.compileAndRun(f,[n,e,a]).reshape(o)},t.prototype.fft=function(e){return this.fftImpl(e,!1)},t.prototype.ifft=function(e){return this.fftImpl(e,!0)},t.prototype.fftImpl=function(e,n){var o=this.texData.get(e.dataId),a=new si(nd,e.shape,n),i=new si(td,e.shape,n),s=[this.makeComplexComponentTensorInfo(e,o.complexTensors.real),this.makeComplexComponentTensorInfo(e,o.complexTensors.imag)],u=this.compileAndRun(a,s),l=this.compileAndRun(i,s),c=this.complex(u,l).as2D(e.shape[0],e.shape[1]);return u.dispose(),l.dispose(),c},t.prototype.gatherND=function(e,n){var o=n.shape,a=o[o.length-1],i=ta(e,n),s=i[0],u=i[1],l=i[2],c=i[3],f=n.reshape([u,a]),h=e.reshape([e.size/l,l]),d=new ad(a,c,[u,l]);return this.compileAndRun(d,[h,f]).reshape(s)},t.prototype.fill=function(e,n,o){if((o=o||pt(n))==="string"){var a=Dt(o,Y(e));return a.fill(n),D.makeTensor(a,e,o,this)}var i=new rd(e,n),s=i.getCustomSetupFunc(n);return this.compileAndRun(i,[],o,s)},t.prototype.onesLike=function(e){if(e.dtype==="string")throw new Error("onesLike is not supported under string dtype");return this.fill(e.shape,1,e.dtype)},t.prototype.zerosLike=function(e){return this.fill(e.shape,e.dtype==="string"?"":0,e.dtype)},t.prototype.linspace=function(e,n,o){return ca(e,n,o)},t.prototype.makeTensorInfo=function(e,n){var o=this.write(null,e,n);return this.texData.get(o).usage=null,{dataId:o,shape:e,dtype:n}},t.prototype.makeOutput=function(e,n){var o=this.makeTensorInfo(e,n).dataId;return D.makeTensorFromDataId(o,e,n,this)},t.prototype.unpackTensor=function(e){var n=new jd(e.shape);return this.runWebGLProgram(n,[e],e.dtype)},t.prototype.packTensor=function(e){var n=new vd(e.shape);return this.runWebGLProgram(n,[e],e.dtype,null,!0)},t.prototype.packedReshape=function(e,n){var o=[_t(e.shape)].concat(Ot(e.shape)),a={dtype:e.dtype,shape:o,dataId:e.dataId},i=[_t(n)].concat(Ot(n)),s=new xd(i,o),u=this.runWebGLProgram(s,[a],e.dtype,null,!0);return{dataId:u.dataId,shape:n,dtype:u.dtype}},t.prototype.decode=function(e){var n,o=this.texData.get(e),a=o.isPacked,i=o.shape,s=o.dtype,u=ir(i);return n=a?new Xh(u):new jh(u),{dtype:s,shape:i,dataId:this.runWebGLProgram(n,[{shape:u,dtype:s,dataId:e}],s,null,!0).dataId}},t.prototype.runWebGLProgram=function(e,n,o,a,i){var s=this;i===void 0&&(i=!1);var u=this.makeTensorInfo(e.outputShape,o),l=this.texData.get(u.dataId);if(e.packedOutput&&(l.isPacked=!0),e.outPackingScheme===Ft.DENSE){var c=kt(e.outputShape);l.texShape=c.map(function(x){return 2*x})}if(e.outTexUsage!=null&&(l.usage=e.outTexUsage),Y(u.shape)===0)return l.values=ft(u.dtype,0),u;var f=[],h=n.map(function(x){if(x.dtype==="complex64")throw new Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");var b=s.texData.get(x.dataId);if(b.texture==null){if(!e.packedInputs&&Y(x.shape)<=M().getNumber("WEBGL_SIZE_UPLOAD_UNIFORM"))return{shape:x.shape,texData:null,isUniform:!0,uniformValues:b.values};e.packedInputs&&(b.isPacked=!0,b.shape=x.shape)}else if(!!b.isPacked!=!!e.packedInputs)x=b.isPacked?s.unpackTensor(x):s.packTensor(x),f.push(x),b=s.texData.get(x.dataId);else if(b.isPacked&&!It(b.shape,x.shape)){var w=x,R=x.shape;x.shape=b.shape,x=s.packedReshape(x,R),f.push(x),b=s.texData.get(x.dataId),w.shape=R}return s.uploadToGPU(x.dataId),{shape:x.shape,texData:b,isUniform:!1}});this.uploadToGPU(u.dataId);var d,p={shape:u.shape,texData:l,isUniform:!1},m=function(x,b,w){var R="";b.concat(w).forEach(function(I){var S=I.texData!=null&&I.texData.slice!=null&&I.texData.slice.flatOffset>0,F=I.isUniform?"uniform":I.texData.texShape;R+=I.shape+"_"+F+"_"+S});var A=x.userCode,k=x.constructor.name;return k+="_"+R+"_"+A}(e,h,p),v=this.getAndSaveBinary(m,function(){return function(x,b,w,R){var A=b.userCode,k=w.map(function(P,G){var H={logicalShape:P.shape,texShape:P.isUniform?null:P.texData.texShape,isUniform:P.isUniform,isPacked:!P.isUniform&&P.texData.isPacked,flatOffset:null};return P.texData!=null&&P.texData.slice!=null&&P.texData.slice.flatOffset>0&&(H.flatOffset=P.texData.slice.flatOffset),{name:b.variableNames[G],shapeInfo:H}}),I=k.map(function(P){return P.shapeInfo}),S={logicalShape:R.shape,texShape:R.texData.texShape,isUniform:!1,isPacked:R.texData.isPacked,flatOffset:null},F=wh(k,S,A,b.packedInputs),N=x.createProgram(F),W=null,L=x.getUniformLocation(N,"NAN",!1);M().getNumber("WEBGL_VERSION")===1&&(W=x.getUniformLocation(N,"INFINITY",!1));for(var B={},V=0;V<b.variableNames.length;V++){var z=b.variableNames[V];B[z]=x.getUniformLocation(N,z,!1),B["offset"+z]=x.getUniformLocation(N,"offset"+z,!1)}return{program:b,source:F,webGLProgram:N,uniformLocations:B,inShapeInfos:I,outShapeInfo:S,infLoc:W,nanLoc:L}}(s.gpgpu,e,h,p)}),g=this.activeTimers!=null;if(g&&(d=this.startTimer()),function(x,b,w,R,A){ui(b.inShapeInfos,w),ui([b.outShapeInfo],[R]);var k=R.texData.texture,I=R.texData.texShape;R.texData.isPacked?x.setOutputPackedMatrixTexture(k,I[0],I[1]):x.setOutputMatrixTexture(k,I[0],I[1]),x.setProgram(b.webGLProgram),M().getNumber("WEBGL_VERSION")===1&&b.infLoc!==null&&x.gl.uniform1f(b.infLoc,1/0),b.nanLoc!==null&&x.gl.uniform1f(b.nanLoc,NaN),w.forEach(function(S,F){var N=b.program.variableNames[F],W=b.uniformLocations[N],L=b.uniformLocations["offset"+N];if(W!=null)if(S.isUniform)if(Y(S.shape)<2)x.gl.uniform1f(W,S.uniformValues[0]);else{var B=S.uniformValues;B instanceof Float32Array||(B=new Float32Array(B)),x.gl.uniform1fv(W,B)}else S.texData.slice!=null&&L!=null&&x.gl.uniform1i(L,S.texData.slice.flatOffset),x.setInputMatrixTexture(S.texData.texture,W,F)}),A!=null&&A(x,b.webGLProgram),x.executeProgram()}(this.gpgpu,v,h,p,a),f.forEach(function(x){return s.disposeData(x.dataId)}),g&&(d=this.endTimer(d),this.activeTimers.push({name:e.constructor.name,query:this.getQueryTime(d)})),!M().getBool("WEBGL_LAZILY_UNPACK")&&l.isPacked&&i===!1){var y=this.unpackTensor(u);return this.disposeData(u.dataId),y}return u},t.prototype.compileAndRun=function(e,n,o,a,i){i===void 0&&(i=!1),o=o||n[0].dtype;var s=this.runWebGLProgram(e,n,o,a,i);return D.makeTensorFromDataId(s.dataId,s.shape,s.dtype)},t.prototype.getAndSaveBinary=function(e,n){return e in this.binaryCache||(this.binaryCache[e]=n()),this.binaryCache[e]},t.prototype.getTextureManager=function(){return this.textureManager},t.prototype.dispose=function(){var e=this;this.disposed||(M().getBool("IS_TEST")||Object.keys(this.binaryCache).forEach(function(n){e.gpgpu.deleteProgram(e.binaryCache[n].webGLProgram),delete e.binaryCache[n]}),this.textureManager.dispose(),this.canvas!=null&&typeof HTMLCanvasElement<"u"&&this.canvas instanceof HTMLCanvasElement?this.canvas.remove():this.canvas=null,this.gpgpuCreatedLocally&&(this.gpgpu.program=null,this.gpgpu.dispose()),this.disposed=!0)},t.prototype.floatPrecision=function(){var e=this;return this.floatPrecisionValue==null&&(this.floatPrecisionValue=Ee(function(){if(!M().get("WEBGL_RENDER_FLOAT32_ENABLED")){var n=M().getBool("DEBUG");M().set("DEBUG",!1);var o=e.abs($(1e-8)).dataSync()[0];if(M().set("DEBUG",n),o>0)return 32}return 16})),this.floatPrecisionValue},t.prototype.epsilon=function(){return this.floatPrecision()===32?1e-7:1e-4},t.prototype.uploadToGPU=function(e){var n,o=this.texData.get(e),a=o.shape,i=o.dtype,s=o.values,u=o.texture,l=o.usage,c=o.isPacked;if(u==null){var f,h=this.activeTimers!=null;h&&(f=Ke());var d=o.texShape;if(d==null&&(d=ms(a,c),o.texShape=d),s!=null){var p=ir(a),m=void 0,v=d[1],g=d[0],y=s instanceof Uint8Array;c?(v=(n=Gt(d[0],d[1]))[0],g=n[1],m=new ed(p,[g,v],y)):m=new Zh(p,[g,v],y);var x=this.makeTensorInfo([g,v],i);this.texData.get(x.dataId).usage=y?Ge.PIXELS:Ge.UPLOAD,this.gpgpu.uploadDenseMatrixToTexture(this.getTexture(x.dataId),v,g,s);var b=this.runWebGLProgram(m,[x],i,null,!0),w=this.texData.get(b.dataId);o.texture=w.texture,o.texShape=w.texShape,o.isPacked=w.isPacked,o.usage=w.usage,this.disposeData(x.dataId),this.texData.delete(b.dataId),o.values=null,h&&(this.uploadWaitMs+=Ke()-f)}else{var R=this.acquireTexture(d,l,i,c);o.texture=R}}},t.prototype.convertAndCacheOnCPU=function(e,n){var o=this.texData.get(e),a=o.dtype;return this.releaseGPUData(e),n!=null&&(o.values=function(i,s){if(s==="float32"||s==="complex64")return i;if(s==="int32"||s==="bool"){for(var u=s==="int32"?new Int32Array(i.length):new Uint8Array(i.length),l=0;l<u.length;++l)u[l]=Math.round(i[l]);return u}throw new Error("Unknown dtype "+s)}(n,a)),o.values},t.prototype.acquireTexture=function(e,n,o,a){if(this.numBytesInGPU+=this.computeBytes(e,o),!this.warnedAboutMemory&&this.numBytesInGPU>1024*this.numMBBeforeWarning*1024){var i=(this.numBytesInGPU/1024/1024).toFixed(2);this.warnedAboutMemory=!0,console.warn("High memory usage in GPU: "+i+" MB, most likely due to a memory leak")}return this.textureManager.acquireTexture(e,n,a)},t.prototype.computeBytes=function(e,n){return e[0]*e[1]*Uo(n)},t}(sa);Qi()&&D.registerBackend("webgl",function(){return new Pu},2);var Lu=T({square_:function(r){var t=C(r,"x","square"),e=[t];return D.runKernelFunc(function(n,o){return o([t]),n.square(t)},{x:t},null,"Square",{},e,[])}}),Ut="SquaredDifference",ga=T({squaredDifference_:function(r,t){var e,n=C(r,"a","squaredDifference"),o=C(t,"b","squaredDifference");e=ve(n,o),n=e[0],o=e[1],oe(n.shape,o.shape);var a={a:n,b:o},i=[n,o];return D.runKernelFunc(function(s,u){var l=s.squaredDifference(n,o);return u([n,o]),l},a,function(s,u){var l=u[0],c=u[1],f=$(2);return{a:function(){return s.mul(l.sub(c).mul(f))},b:function(){return s.mul(c.sub(l).mul(f))}}},Ut,{},i,[])}}),Wu=T({abs_:function(r){var t=C(r,"x","abs");return t.dtype==="complex64"?D.runKernelFunc(function(e){return e.complexAbs(t)},{$x:t}):D.runKernelFunc(function(e,n){var o=e.abs(t);return n([t]),o},{x:t},function(e,n){var o=n[0];return{x:function(){return e.mul(o.toFloat().step(-1))}}},"Abs")}}),Uu=T({acos_:function(r){var t=C(r,"x","acos");return D.runKernelFunc(function(e,n){var o=e.acos(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.divStrict($(1).sub(o.toFloat().square()).sqrt()).neg()}}})}}),zu=T({acosh_:function(r){var t=C(r,"x","acosh");return D.runKernelFunc(function(e,n){var o=e.acosh(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.divStrict(o.toFloat().square().sub(1).sqrt())}}})}}),Vu=T({asin_:function(r){var t=C(r,"x","asin");return D.runKernelFunc(function(e,n){var o=e.asin(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.divStrict($(1).sub(o.toFloat().square()).sqrt())}}})}}),Gu=T({asinh_:function(r){var t=C(r,"x","asinh");return D.runKernelFunc(function(e,n){var o=e.asinh(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.divStrict($(1).add(o.toFloat().square()).sqrt())}}})}}),Hu=T({atan_:function(r){var t=C(r,"x","atan");return D.runKernelFunc(function(e,n){var o=e.atan(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.div(o.toFloat().square().add(1))}}})}}),qu=T({atanh_:function(r){var t=C(r,"x","atanh");return D.runKernelFunc(function(e,n){var o=e.atanh(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.div($(1).sub(o.toFloat().square()))}}})}}),Ku=T({ceil_:function(r){var t=C(r,"x","ceil");return D.runKernelFunc(function(e){return e.ceil(t)},{$x:t},function(e){return{$x:function(){return ue(e)}}})}}),ju=T({clipByValue_:function(r,t,e){var n=C(r,"x","clipByValue");E(t<=e,function(){return"Error in clip: min ("+t+") must be less than or equal to max ("+e+")."});var o=[n],a={min:t,max:e};return D.runKernelFunc(function(i,s){var u=i.clip(n,t,e);return s([n]),u},{x:n},function(i,s){var u=s[0];return{x:function(){return i.where(u.greaterEqual(t).logicalAnd(u.lessEqual(e)),ue(i))}}},"ClipByValue",a,o)}}),Xu=T({cos_:function(r){var t=C(r,"x","cos"),e=[t];return D.runKernelFunc(function(n,o){var a=n.cos(t);return o([t]),a},{x:t},function(n,o){var a=o[0];return{x:function(){return a.toFloat().sin().neg().mul(n)}}},"Cos",{},e)}}),Yu=T({cosh_:function(r){var t=C(r,"x","cosh");return D.runKernelFunc(function(e,n){var o=e.cosh(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return o.toFloat().sinh().mulStrict(e)}}})}}),$u=T({erf_:function(r){var t=C(r,"x","erf");return E(t.dtype==="int32"||t.dtype==="float32",function(){return"Input dtype must be `int32` or `float32`."}),t.dtype==="int32"&&(t=t.toFloat()),D.runKernelFunc(function(e,n){var o=e.erf(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.mul(o.square().neg().exp().mul(2/Math.sqrt(Math.PI)))}}})}}),Qu=T({exp_:function(r){var t=C(r,"x","exp");return D.runKernelFunc(function(e,n){var o=e.exp(t);return n([o]),o},{x:t},function(e,n){return{x:function(){return e.mulStrict(n[0])}}},"Exp",{},[],[!0])}}),Ju=T({expm1_:function(r){var t=C(r,"x","expm1");return D.runKernelFunc(function(e,n){var o=e.expm1(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.mul(o.exp())}}})}}),Zu=T({floor_:function(r){var t=C(r,"x","floor");return D.runKernelFunc(function(e){return e.floor(t)},{$x:t},function(e){return{$x:function(){return ue(e)}}})}}),el=T({log_:function(r){var t=C(r,"x","log"),e=[t];return D.runKernelFunc(function(n,o){var a=n.log(t);return o([t]),a},{x:t},function(n,o){var a=o[0];return{x:function(){return n.div(a.toFloat())}}},"Log",{},e)}}),nl=T({log1p_:function(r){var t=C(r,"x","log1p");return D.runKernelFunc(function(e,n){var o=e.log1p(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.div(o.add(1))}}})}}),tl=T({logSigmoid_:function(r){var t=C(r,"x","logSigmoid");return D.runKernelFunc(function(e,n){var o=e.softplus(t.neg()).neg();return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.mul(o.neg().sigmoid())}}})}}),ya=T({neg_:function(r){var t=C(r,"x","neg"),e=[t];return D.runKernelFunc(function(n){return n.neg(t)},{x:t},function(n){return{x:function(){return n.neg()}}},"Neg",{},e)}}),rl=T({reciprocal_:function(r){var t=C(r,"x","reciprocal");return D.runKernelFunc(function(e,n){var o=e.reciprocal(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.div(o.square().neg())}}})}}),ol=T({round_:function(r){var t=C(r,"x","round");return D.runKernelFunc(function(e){return e.round(t)},{$x:t},function(e){return{$x:function(){return ue(e)}}})}}),xa=T({rsqrt_:function(r){var t=C(r,"x","rsqrt"),e=[t];return D.runKernelFunc(function(n,o){var a=n.rsqrt(t);return o([t]),a},{x:t},function(n,o){var a=o[0];return{x:function(){return n.div(a.pow(1.5).mul(2)).neg()}}},"Rsqrt",{},e)}}),al=T({sigmoid_:function(r){var t=C(r,"x","sigmoid");return D.runKernelFunc(function(e,n){var o=e.sigmoid(t);return n([o]),o},{x:t},function(e,n){var o=n[0];return{x:function(){return e.mul(o.mul($(1).sub(o)))}}},"Sigmoid")}}),il=T({sign_:function(r){var t=C(r,"x","sign");return D.runKernelFunc(function(e){return e.sign(t)},{$x:t},function(e){return{$x:function(){return ue(e)}}})}}),sl=T({isNaN_:function(r){var t=C(r,"x","isNaN");return D.runKernelFunc(function(e){return e.isNaN(t)},{$x:t},function(e){return{$x:function(){return ue(e)}}})}}),ul=T({isInf_:function(r){var t=C(r,"x","isInf");return D.runKernelFunc(function(e){return e.isInf(t)},{$x:t},function(e){return{$x:function(){return ue(e)}}})}}),ll=T({isFinite_:function(r){var t=C(r,"x","isFinite");return D.runKernelFunc(function(e){return e.isFinite(t)},{$x:t},function(e){return{$x:function(){return ue(e)}}})}}),cl=T({sin_:function(r){var t=C(r,"x","sin"),e=[t];return D.runKernelFunc(function(n,o){var a=n.sin(t);return o([t]),a},{x:t},function(n,o){var a=o[0];return{x:function(){return a.toFloat().cos().mul(n)}}},"Sin",{},e)}}),fl=T({sinh_:function(r){var t=C(r,"x","sinh");return D.runKernelFunc(function(e,n){var o=e.sinh(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return o.toFloat().cosh().mulStrict(e)}}})}}),hl=T({softplus_:function(r){var t=C(r,"x","softplus");return D.runKernelFunc(function(e,n){var o=e.softplus(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.mul(o.sigmoid())}}})}}),dl=T({sqrt_:function(r){var t=C(r,"x","sqrt");return D.runKernelFunc(function(e,n){var o=e.sqrt(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.div(o.toFloat().sqrt().mul(2))}}})}}),pl=T({step_:function(r,t){t===void 0&&(t=0);var e=C(r,"x","step");return D.runKernelFunc(function(n){return n.step(e,t)},{$x:e},function(n){return{$x:function(){return ue(n)}}})}}),vl=T({tan_:function(r){var t=C(r,"x","tan");return D.runKernelFunc(function(e,n){var o=e.tan(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return e.div(o.cos().square())}}})}}),ml=T({tanh_:function(r){var t=C(r,"x","tanh");return D.runKernelFunc(function(e,n){var o=e.tanh(t);return n([o]),o},{x:t},function(e,n){var o=n[0];return{x:function(){return $(1).sub(o.square()).mulStrict(e)}}},"Tanh",{},null,[!0])}});function gl(r,t,e,n,o,a){var i,s,u=C(r,"x","batchNorm"),l=C(t,"mean","batchNorm"),c=C(e,"variance","batchNorm");return o!=null&&(i=C(o,"scale","batchNorm")),n!=null&&(s=C(n,"offset","batchNorm")),E(u.rank===2,function(){return"Error in batchNorm3D: x must be rank 3 but got rank "+u.rank+"."}),E(l.rank===2||l.rank===1,function(){return"Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank "+l.rank+"."}),E(c.rank===2||c.rank===1,function(){return"Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank "+c.rank+"."}),i!=null&&E(i.rank===2||i.rank===1,function(){return"Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank "+i.rank+"."}),s!=null&&E(s.rank===2||s.rank===1,function(){return"Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank "+s.rank+"."}),Kt(u,l,c,s,i,a)}function yl(r,t,e,n,o,a){var i,s,u=C(r,"x","batchNorm"),l=C(t,"mean","batchNorm"),c=C(e,"variance","batchNorm");return o!=null&&(i=C(o,"scale","batchNorm")),n!=null&&(s=C(n,"offset","batchNorm")),E(u.rank===3,function(){return"Error in batchNorm3D: x must be rank 3 but got rank "+u.rank+"."}),E(l.rank===3||l.rank===1,function(){return"Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank "+l.rank+"."}),E(c.rank===3||c.rank===1,function(){return"Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank "+c.rank+"."}),i!=null&&E(i.rank===3||i.rank===1,function(){return"Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank "+i.rank+"."}),s!=null&&E(s.rank===3||s.rank===1,function(){return"Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank "+s.rank+"."}),Kt(u,l,c,s,i,a)}function xl(r,t,e,n,o,a){var i,s,u=C(r,"x","batchNorm"),l=C(t,"mean","batchNorm"),c=C(e,"variance","batchNorm");return o!=null&&(i=C(o,"scale","batchNorm")),n!=null&&(s=C(n,"offset","batchNorm")),E(u.rank===4,function(){return"Error in batchNorm4D: x must be rank 4 but got rank "+u.rank+"."}),E(l.rank===4||l.rank===1,function(){return"Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank "+l.rank+"."}),E(c.rank===4||c.rank===1,function(){return"Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank "+c.rank+"."}),i!=null&&E(i.rank===4||i.rank===1,function(){return"Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank "+i.rank+"."}),s!=null&&E(s.rank===4||s.rank===1,function(){return"Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank "+s.rank+"."}),Kt(u,l,c,s,i,a)}function Kt(r,t,e,n,o,a){a==null&&(a=.001);var i,s,u,l=C(r,"x","batchNorm"),c=C(t,"mean","batchNorm"),f=C(e,"variance","batchNorm");o!=null&&(i=C(o,"scale","batchNorm")),n!=null&&(s=C(n,"offset","batchNorm")),E(c.rank===f.rank,function(){return"Batch normalization gradient requires mean and variance to have equal ranks."}),E(s==null||c.rank===s.rank,function(){return"Batch normalization gradient requires mean and offset to have equal ranks."}),E(i==null||c.rank===i.rank,function(){return"Batch normalization gradient requires mean and scale to have equal ranks."}),u=l.rank===0||l.rank===1?l.as4D(1,1,1,l.size):l.rank===2?l.as4D(1,1,l.shape[0],l.shape[1]):l.rank===3?l.as4D(1,l.shape[0],l.shape[1],l.shape[2]):l;var h=[l,c,f,i];return D.runKernelFunc(function(d,p){var m=d.batchNormalization(u,er(c),er(f),a,er(i),er(s));return p([l,c,f,i]),m},{x:l,mean:c,variance:f,scale:i,offset:s},function(d,p){var m=p,v=m[0],g=m[1],y=m[2],x=m[3],b=x??$(1),w=Ie(g.shape,u.shape),R=[];if(g.rank===1){for(var A=0;A<u.shape.length-1;++A)R.push(u.shape[A]);R.push(1)}var k=v.sub(g),I=d.mul(b),S=xa(y.add($(a))),F=S.mul(S).mul(S).mul($(-.5));return{x:function(){return g.rank===1?d.mul(at(S.as4D(1,1,1,g.shape[0]),R)).mul(b).reshape(v.shape):d.mul(S).mul(b).reshape(v.shape)},mean:function(){var N=S.mul($(-1)).mul(I);return g.rank===1&&(N=N.sum(w)),N.reshape(g.shape)},variance:function(){var N=F.mul(k).mul(I);return g.rank===1&&(N=N.sum(w)),N.reshape(g.shape)},scale:function(){var N=k.mul(S),W=d.mul(N);return g.rank===1&&(W=W.sum(w)),W.reshape(g.shape)},offset:function(){var N=d;return g.rank===1&&(N=N.sum(w)),N.reshape(g.shape)}}},"BatchNormalization",{varianceEpsilon:a},h).reshape(l.shape)}function er(r){return r==null?null:r.rank===0?r.as1D():r.rank===1?r:r.rank===2?r.as4D(1,1,r.shape[0],r.shape[1]):r.rank===3?r.as4D(1,r.shape[0],r.shape[1],r.shape[2]):r}function Nr(){Ko("tf.batchNormalization() is going away. Use tf.batchNorm() instead, and note the positional argument change of scale, offset, and varianceEpsilon")}var bl=T({batchNormalization2d_:function(r,t,e,n,o,a){return n===void 0&&(n=.001),Nr(),gl(r,t,e,a,o,n)}}),wl=T({batchNormalization3d_:function(r,t,e,n,o,a){return n===void 0&&(n=.001),Nr(),yl(r,t,e,a,o,n)}}),Cl=T({batchNormalization4d_:function(r,t,e,n,o,a){return n===void 0&&(n=.001),Nr(),xl(r,t,e,a,o,n)}}),El=T({batchNormalization_:function(r,t,e,n,o,a){return n===void 0&&(n=.001),Nr(),Kt(r,t,e,a,o,n)}}),Rl=T({batchNorm_:Kt}),Il=T({batchNorm2d_:gl}),kl=T({batchNorm3d_:yl}),Sl=T({batchNorm4d_:xl}),jt=T({logicalAnd_:function(r,t){var e=C(r,"a","logicalAnd","bool"),n=C(t,"b","logicalAnd","bool");return oe(e.shape,n.shape),D.runKernelFunc(function(o){return o.logicalAnd(e,n)},{a:e,b:n},null,"LogicalAnd")}}),Al=T({logicalNot_:function(r){var t=C(r,"x","logicalNot","bool");return D.runKernelFunc(function(e){return e.logicalNot(t)},{$x:t})}}),ba=T({logicalOr_:function(r,t){var e=C(r,"a","logicalOr","bool"),n=C(t,"b","logicalOr","bool");return oe(e.shape,n.shape),D.runKernelFunc(function(o){return o.logicalOr(e,n)},{$a:e,$b:n})}}),Dl=T({logicalXor_:function(r,t){var e=C(r,"a","logicalXor","bool"),n=C(t,"b","logicalXor","bool");return oe(e.shape,n.shape),ba(r,t).logicalAnd(jt(r,t).logicalNot())}}),Sn=T({where_:function(r,t,e){var n=C(t,"a","where"),o=C(e,"b","where"),a=C(r,"condition","where","bool");return fe(n.shape,o.shape,"Error in where: "),a.rank===1?E(a.shape[0]===n.shape[0],function(){return"The first dimension of `a` must match the size of `condition`."}):fe(a.shape,o.shape,"Error in where: "),D.runKernelFunc(function(i,s){var u=i.select(a,n,o);return s([a]),u},{$condition:a,$a:n,$b:o},function(i,s){var u=s[0];return{$condition:function(){return ue(u).toFloat()},$a:function(){return i.mul(u.cast(i.dtype))},$b:function(){return i.mul(u.logicalNot().cast(i.dtype))}}})}}),wa=function(r){return j(this,void 0,void 0,function(){var t,e,n;return X(this,function(o){switch(o.label){case 0:return[4,(t=C(r,"condition","whereAsync","bool")).data()];case 1:return e=o.sent(),n=da(t.shape,e),r!==t&&t.dispose(),[2,n]}})})},qn=T({add_:function(r,t){var e,n=C(r,"a","add"),o=C(t,"b","add");e=ve(n,o),n=e[0],o=e[1];var a=oe(n.shape,o.shape);return D.runKernelFunc(function(i){return i.add(n,o)},{a:n,b:o},function(i){return{a:function(){var s=i,u=Ie(n.shape,a);return u.length>0&&(s=s.sum(u)),s.reshape(n.shape)},b:function(){var s=i,u=Ie(o.shape,a);return u.length>0&&(s=s.sum(u)),s.reshape(o.shape)}}},"Add")}}),Tl=T({addN_:function(r){E(Array.isArray(r),function(){return"The argument passed to tf.addN() must be a list of tensors"}),E(r.length>=1,function(){return"Must pass at least one tensor to tf.addN(), but got "+r.length});var t=r.map(function(o,a){return C(o,"tensors"+a,"addN")}),e=t[0];t.forEach(function(o){if(o.dtype!==e.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")}),t.forEach(function(o){if(!Re(o.shape,e.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")});var n=t;return D.runKernelFunc(function(o){return o.addN(t)},n,function(o){var a={};return t.forEach(function(i,s){a[s]=function(){return o.clone()}}),a},"AddN")}}),Nl=T({addStrict_:function(r,t){var e=C(r,"a","addStrict"),n=C(t,"b","addStrict");return fe(e.shape,n.shape,"Error in addStrict: "),e.add(n)}}),Fl=T({atan2_:function(r,t){var e,n=C(r,"a","atan2"),o=C(t,"b","atan2");e=ve(n,o),n=e[0],o=e[1];var a=oe(n.shape,o.shape);return D.runKernelFunc(function(i,s){var u=i.atan2(n,o);return s([n,o]),u},{$a:n,$b:o},function(i,s){var u=s[0],l=s[1];return{$a:function(){var c=qn(u.square(),l.square()),f=i.mul(l.div(c)),h=Ie(u.shape,a);return h.length>0&&(f=f.sum(h)),f.reshape(u.shape)},$b:function(){var c=qn(u.square(),l.square()),f=ya(i.mul(u.div(c))),h=Ie(l.shape,a);return h.length>0&&(f=f.sum(h)),f.reshape(l.shape)}}})}}),Fr=T({div_:function(r,t){var e,n=C(r,"a","div"),o=C(t,"b","div");if(e=ve(n,o),n=e[0],o=e[1],n.dtype==="int32"&&o.dtype==="int32")return Ca(n,o);var a=oe(n.shape,o.shape);return D.runKernelFunc(function(i,s){var u=i.realDivide(n,o);return s([n,o]),u},{a:n,b:o},function(i,s){var u=s[0],l=s[1];return{a:function(){var c=i.div(l.toFloat()),f=Ie(u.shape,a);return f.length>0?c.sum(f).reshape(u.shape):c},b:function(){var c=i.mul(u.toFloat()),f=Ie(l.shape,a);f.length>0&&(c=c.sum(f).reshape(l.shape));var h=l.square();return c.div(h.toFloat()).neg()}}},"Div")}}),_l=T({divNoNan_:function(r,t){var e,n=C(r,"a","div"),o=C(t,"b","div");n=(e=ve(n,o))[0],o=e[1];var a=Fr(n,o),i=ue(a),s=o.equal(i);return Sn(s,i,a)}}),Ol=T({divStrict_:function(r,t){var e=C(r,"a","div"),n=C(t,"b","div");return fe(e.shape,n.shape,"Error in divideStrict: "),e.div(n)}}),Ca=T({floorDiv_:function(r,t){var e,n=C(r,"a","floorDiv"),o=C(t,"b","floorDiv");e=ve(n,o),n=e[0],o=e[1];var a=oe(n.shape,o.shape);return D.runKernelFunc(function(i,s){var u=i.floorDiv(n,o);return s([n,o]),u},{a:n,b:o},function(i,s){var u=s[0],l=s[1];return{a:function(){var c=i.div(l.toFloat()),f=Ie(u.shape,a);return f.length>0?c.sum(f).reshape(u.shape):c},b:function(){var c=i.mul(u.toFloat()),f=Ie(l.shape,a);f.length>0&&(c=c.sum(f).reshape(l.shape));var h=l.square();return c.div(h.toFloat()).neg()}}},"FloorDiv")}}),_r=T({maximum_:function(r,t){var e,n=C(r,"a","maximum"),o=C(t,"b","maximum");return e=ve(n,o),n=e[0],o=e[1],n.dtype==="bool"&&(n=n.toInt(),o=o.toInt()),oe(n.shape,o.shape),D.runKernelFunc(function(a,i){var s=a.maximum(n,o);return i([n,o]),s},{a:n,b:o},function(a,i){var s=i[0],u=i[1];return{a:function(){return a.mul(s.greaterEqual(u).toFloat())},b:function(){return a.mul(s.less(u).toFloat())}}},"Maximum")}}),Ml=T({maximumStrict_:function(r,t){var e=C(r,"a","maximumStrict"),n=C(t,"b","maximumStrict");return fe(e.shape,n.shape,"Error in maximumStrict: "),e.maximum(n)}}),Ea=T({minimum_:function(r,t){var e,n=C(r,"a","minimum"),o=C(t,"b","minimum");return e=ve(n,o),n=e[0],o=e[1],n.dtype==="bool"&&(n=n.toInt(),o=o.toInt()),oe(n.shape,o.shape),D.runKernelFunc(function(a,i){var s=a.minimum(n,o);return i([n,o]),s},{a:n,b:o},function(a,i){var s=i[0],u=i[1];return{a:function(){return a.mul(s.lessEqual(u).toFloat())},b:function(){return a.mul(s.greater(u).toFloat())}}},"Minimum")}}),Bl=T({minimumStrict_:function(r,t){var e=C(r,"a","minimumStrict"),n=C(t,"b","minimumStrict");return fe(e.shape,n.shape,"Error in minimumStrict: "),e.minimum(n)}}),Pl=T({mod_:function(r,t){var e,n=C(r,"a","mod"),o=C(t,"b","mod");e=ve(n,o),n=e[0],o=e[1];var a=oe(n.shape,o.shape);return D.runKernelFunc(function(i,s){var u=i.mod(n,o);return s([n,o]),u},{$a:n,$b:o},function(i,s){var u=s[0],l=s[1];return{$a:function(){var c=Ie(u.shape,a);return c.length>0?i.sum(c).reshape(u.shape):i},$b:function(){var c=i.mul(u.div(l).floor().neg()),f=Ie(l.shape,a);return f.length>0?c.sum(f).reshape(l.shape):c}}})}}),Ll=T({modStrict_:function(r,t){var e=C(r,"a","modStrict"),n=C(t,"b","modStrict");return fe(e.shape,n.shape,"Error in modStrict: "),e.mod(n)}}),Ln=T({mul_:function(r,t){var e,n=C(r,"a","mul"),o=C(t,"b","mul");e=ve(n,o),n=e[0],o=e[1];var a=oe(n.shape,o.shape);return D.runKernelFunc(function(i,s){var u=i.multiply(n,o);return s([n,o]),u},{a:n,b:o},function(i,s){var u=s[0],l=s[1];return{a:function(){var c=i.mul(l.toFloat()),f=Ie(u.shape,a);return f.length>0?c.sum(f).reshape(u.shape):c},b:function(){var c=i.mul(u.toFloat()),f=Ie(l.shape,a);return f.length>0?c.sum(f).reshape(l.shape):c}}},"Mul")}}),Wl=T({mulStrict_:function(r,t){var e=C(r,"a","mul"),n=C(t,"b","mul");return fe(e.shape,n.shape,"Error in multiplyStrict: "),e.mul(n)}}),zt=T({pow_:function(r,t){var e,n=C(r,"base","pow"),o=C(t,"exp","pow");e=ve(n,o),n=e[0],o=e[1];var a=oe(n.shape,o.shape),i=[n,o];return D.runKernelFunc(function(s,u){var l=s.pow(n,o);return u([n,o,l]),l},{a:n,b:o},function(s,u){var l=u[0],c=u[1],f=u[2];return{a:function(){var h=c.toFloat(),d=s.mul(h.mul(l.pow(h.sub($(1))))),p=Ie(l.shape,a);return p.length>0&&(d=d.sum(p)),d.reshape(l.shape)},b:function(){var h=l.greater(0),d=l.log().where(h,ue(l)),p=s.mul(f.mul(d)),m=Ie(c.shape,a);return m.length>0&&(p=p.sum(m)),p.reshape(c.shape)}}},"Pow",{},i,[!0])}}),Ul=T({powStrict_:function(r,t){return fe(r.shape,t.shape,"Error in powStrict: "),r.pow(t)}}),zl=T({squaredDifferenceStrict_:function(r,t){var e=C(r,"a","squaredDifferenceStrict"),n=C(t,"b","squaredDifferenceStrict");return fe(e.shape,n.shape,"Error in squaredDifferenceStrict: "),e.squaredDifference(n)}}),An=T({sub_:function(r,t){var e,n=C(r,"a","sub"),o=C(t,"b","sub");e=ve(n,o),n=e[0],o=e[1];var a=oe(n.shape,o.shape);return D.runKernelFunc(function(i){return i.subtract(n,o)},{a:n,b:o},function(i){return{a:function(){var s=i,u=Ie(n.shape,a);return u.length>0&&(s=s.sum(u)),s.reshape(n.shape)},b:function(){var s=i,u=Ie(o.shape,a);return u.length>0&&(s=s.sum(u)),s.neg().reshape(o.shape)}}},"Sub")}}),Vl=T({subStrict_:function(r,t){var e=C(r,"a","subStrict"),n=C(t,"b","subStrict");return fe(e.shape,n.shape,"Error in subStrict: "),e.sub(n)}}),Ra=T({equal_:function(r,t){var e,n=C(r,"a","equal"),o=C(t,"b","equal");return e=ve(n,o),n=e[0],o=e[1],oe(n.shape,o.shape),D.runKernelFunc(function(a){return a.equal(n,o)},{$a:n,$b:o})}}),Gl=T({equalStrict_:function(r,t){var e=C(r,"a","equalStrict"),n=C(t,"b","equalStrict");return fe(e.shape,n.shape,"Error in equalStrict: "),e.equal(n)}}),Hl=T({greater_:function(r,t){var e,n=C(r,"a","greater"),o=C(t,"b","greater");return e=ve(n,o),n=e[0],o=e[1],oe(n.shape,o.shape),D.runKernelFunc(function(a){return a.greater(n,o)},{a:n,b:o},null,"Greater")}}),Ia=T({greaterEqual_:function(r,t){var e,n=C(r,"a","greaterEqual"),o=C(t,"b","greaterEqual");return e=ve(n,o),n=e[0],o=e[1],oe(n.shape,o.shape),D.runKernelFunc(function(a,i){var s=a.greaterEqual(n,o);return i([n,o]),s},{a:n,b:o},function(a,i){var s=i[0],u=i[1];return{a:function(){return ue(s)},b:function(){return ue(u)}}},"GreaterEqual")}}),ql=T({greaterEqualStrict_:function(r,t){var e=C(r,"a","greaterEqualStrict"),n=C(t,"b","greaterEqualStrict");return fe(e.shape,n.shape,"Error in greaterEqualStrict: "),e.greaterEqual(n)}}),Kl=T({greaterStrict_:function(r,t){var e=C(r,"a","greaterStrict"),n=C(t,"b","greaterStrict");return fe(e.shape,n.shape,"Error in greaterStrict: "),e.greater(n)}}),jl=T({less_:function(r,t){var e,n=C(r,"a","less"),o=C(t,"b","less");return e=ve(n,o),n=e[0],o=e[1],oe(n.shape,o.shape),D.runKernelFunc(function(a){return a.less(n,o)},{a:n,b:o},null,"Less")}}),Xl=T({lessEqual_:function(r,t){var e,n=C(r,"a","lessEqual"),o=C(t,"b","lessEqual");return e=ve(n,o),n=e[0],o=e[1],oe(n.shape,o.shape),D.runKernelFunc(function(a,i){var s=a.lessEqual(n,o);return i([n,o]),s},{a:n,b:o},null,"LessEqual")}}),Yl=T({lessEqualStrict_:function(r,t){var e=C(r,"a","lessEqualStrict"),n=C(t,"b","lessEqualStrict");return fe(e.shape,n.shape,"Error in lessEqualStrict: "),e.lessEqual(n)}}),$l=T({lessStrict_:function(r,t){var e=C(r,"a","lessStrict"),n=C(t,"b","lessStrict");return fe(e.shape,n.shape,"Error in lessStrict: "),e.less(n)}}),Ql=T({notEqual_:function(r,t){var e,n=C(r,"a","notEqual"),o=C(t,"b","notEqual");return e=ve(n,o),n=e[0],o=e[1],oe(n.shape,o.shape),D.runKernelFunc(function(a){return a.notEqual(n,o)},{a:n,b:o},null,"NotEqual")}}),Jl=T({notEqualStrict_:function(r,t){var e=C(r,"a","notEqualStrict"),n=C(t,"b","notEqualStrict");return fe(e.shape,n.shape,"Error in notEqualStrict: "),e.notEqual(n)}});function yi(r,t){for(var e=[],n=r;n<t;++n)e.push(n);return e}function xi(r){for(var t=[],e=0;e<r.length;++e)for(var n=0;n<r[e].length;++n)t.push(r[e][n]);return t}var Or=T({gather_:function(r,t,e){e===void 0&&(e=0);var n=C(r,"x","gather"),o=C(t,"indices","gather","int32");e=ke(e,n.shape)[0];var a=function(i,s,u){for(var l=i.shape[u],c=[],f=1,h=1,d=0;d<u;d++)c.push(i.shape[d]),f*=i.shape[d];for(d=0;d<s.rank;d++)c.push(s.shape[d]);for(d=u+1;d<i.rank;d++)c.push(i.shape[d]),h*=i.shape[d];return{batchSize:f,sliceSize:h,dimSize:l,outputShape:c}}(n,o,e);return D.runKernelFunc(function(i,s){var u=i.gather(n,o.flatten(),e);return s([o]),u},{x:n,indices:o},function(i,s){var u=s[0];return{x:function(){var l=n.shape,c=u.size,f=l.slice(0,e),h=f.length,d=l.slice(e,l.length).slice(1),p=d.length,m=yi(0,h),v=yi(h+1,h+1+p),g=xi([f,[c],d]),y=i.reshape(g),x=u.reshape([c]),b=xi([[h],m,v]),w=y.transpose(b),R=ka(w,x,n.shape[e]),A=wr(b);return R=R.transpose(A)},indices:function(){return u}}},"Gather",{axis:e}).reshape(a.outputShape)}}),ka=T({unsortedSegmentSum_:function(r,t,e){var n=C(r,"x","unsortedSegmentSum"),o=C(t,"segmentIds","unsortedSegmentSum","int32");return E(we(e),function(){return"numSegments must be of dtype int"}),D.runKernelFunc(function(a,i){var s=a.unsortedSegmentSum(n,o,e);return i([o]),s},{$x:n},function(a,i){var s=i[0];return{$x:function(){return function(u,l){for(var c=_r(l,ue(l)),f=Or(u,c),h=Ia(l,$(0,"int32")),d=f.rank-h.rank,p=0;p<d;++p)h=hn(h,p+1);h=jt(h,jn(f.shape,"bool"));var m=ue(f);return Sn(h,f,m)}(a,s)}}})}}),Zl=function(r,t,e){return j(this,void 0,void 0,function(){var n,o,a,i,s,u,l,c,f,h,d,p,m;return X(this,function(v){switch(v.label){case 0:for(n=C(r,"tensor","boolMask"),o=C(t,"mask","boolMask","bool"),a=e??0,i=o.rank,s=n.shape,E(i>0,function(){return"mask cannot be scalar"}),fe(s.slice(a,a+i),o.shape,"mask's shape must match the first K dimensions of tensor's shape,"),u=1,l=a;l<a+i;l++)u*=s[l];return c=s.slice(0,a).concat([u],s.slice(a+i)),f=n.reshape(c),h=o.reshape([-1]),[4,wa(h)];case 1:return d=v.sent(),p=d.squeeze([1]),m=Or(f,p,a),r!==n&&n.dispose(),t!==o&&o.dispose(),p.dispose(),f.dispose(),h.dispose(),d.dispose(),[2,m]}})})};function ec(r,t,e,n,o,a,i){a===void 0&&(a="NHWC"),E(r.length===t.rank,function(){return"Length of inShape ("+r.length+") and rank of dy ("+t.rank+") must match"});var s=r,u=t,l=!1;t.rank===3&&(l=!0,u=t.as4D(1,t.shape[0],t.shape[1],t.shape[2]),s=[1,r[0],r[1],r[2]]),E(s.length===4,function(){return"Error in conv2dDerInput: inShape must be length 4, but got length "+s.length+"."}),E(u.rank===4,function(){return"Error in conv2dDerInput: dy must be rank 4, but got rank "+u.rank}),E(e.rank===4,function(){return"Error in conv2dDerInput: filter must be rank 4, but got rank "+e.rank});var c=a==="NHWC"?s[3]:s[1],f=a==="NHWC"?u.shape[3]:u.shape[1];E(c===e.shape[2],function(){return"Error in conv2dDerInput: depth of input ("+c+") must match input depth for filter "+e.shape[2]+"."}),E(f===e.shape[3],function(){return"Error in conv2dDerInput: depth of output ("+f+") must match output depth for filter "+e.shape[3]+"."}),i!=null&&E(we(o),function(){return"Error in conv2dDerInput: pad must be an integer when using, dimRoundingMode "+i+" but got pad "+o+"."});var h=Tr(a),d=Tn(s,e.shape,n,1,o,i,!1,h),p=D.runKernelFunc(function(m,v){var g=m.conv2dDerInput(u,e,d);return v([e,u]),g},{dy4D:u,filter:e},function(m,v){var g=v[0],y=v[1];return{dy4D:function(){return gt(m,g,n,o,a,1,i)},filter:function(){return Sa(m,y,g.shape,n,o,a,i)}}});return l?p.as3D(p.shape[1],p.shape[2],p.shape[3]):p}function to(r){var t=function(a){return typeof a=="number"?[a,a,a]:a.length===2?[a[0],a[1],1]:a}(r),e=t[0],n=t[1],o=t[2];return e===1&&n===1&&o===1}function nc(r,t,e,n,o){E(r.length===t.rank,function(){return"Length of inShape ("+r.length+") and rank of dy ("+t.rank+") must match"});var a=r,i=t,s=!1;t.rank===4&&(s=!0,i=t.as5D(1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]),a=[1,r[0],r[1],r[2],r[3]]);var u=a[4],l=i.shape[4];E(a.length===5,function(){return"Error in conv3dDerInput: inShape must be length 5, but got length "+a.length+"."}),E(i.rank===5,function(){return"Error in conv3dDerInput: dy must be rank 5, but got rank "+i.rank}),E(e.rank===5,function(){return"Error in conv3dDerInput: filter must be rank 5, but got rank "+e.rank}),E(u===e.shape[3],function(){return"Error in conv3dDerInput: depth of input ("+u+") must match input depth for filter "+e.shape[3]+"."}),E(l===e.shape[4],function(){return"Error in conv3dDerInput: depth of output ("+l+") must match output depth for filter "+e.shape[4]+"."});var c=Wt(a,e.shape,n,1,o),f=D.runKernelFunc(function(h){return h.conv3dDerInput(i,e,c)},{dy5D:i});return s?f.as4D(f.shape[1],f.shape[2],f.shape[3],f.shape[4]):f}var tc=T({conv1d_:function(r,t,e,n,o,a,i){o===void 0&&(o="NWC"),a===void 0&&(a=1);var s=C(r,"x","conv1d"),u=C(t,"filter","conv1d"),l=s,c=!1;s.rank===2&&(c=!0,l=s.as3D(1,s.shape[0],s.shape[1])),E(l.rank===3,function(){return"Error in conv1d: input must be rank 3, but got rank "+l.rank+"."}),E(u.rank===3,function(){return"Error in conv1d: filter must be rank 3, but got rank "+u.rank+"."}),i!=null&&E(we(n),function(){return"Error in conv1d: pad must be an integer when using, dimRoundingMode "+i+" but got pad "+n+"."}),E(l.shape[2]===u.shape[1],function(){return"Error in conv1d: depth of input ("+l.shape[2]+") must match input depth for filter "+u.shape[1]+"."}),E(Pe(e,a),function(){return"Error in conv1D: Either stride or dilation must be 1. Got stride "+e+" and dilation '"+a+"'"}),E(o==="NWC",function(){return"Error in conv1d: got dataFormat of "+o+" but only NWC is currently supported."});var f=u.as4D(1,u.shape[0],u.shape[1],u.shape[2]),h=l.as4D(l.shape[0],1,l.shape[1],l.shape[2]),d=gt(h,f,[1,e],n,"NHWC",[1,a],i);return c?d.as2D(d.shape[2],d.shape[3]):d.as3D(d.shape[0],d.shape[2],d.shape[3])}}),gt=T({conv2d_:function(r,t,e,n,o,a,i){o===void 0&&(o="NHWC"),a===void 0&&(a=[1,1]);var s=C(r,"x","conv2d"),u=C(t,"filter","conv2d"),l=s,c=!1;s.rank===3&&(c=!0,l=s.as4D(1,s.shape[0],s.shape[1],s.shape[2])),E(l.rank===4,function(){return"Error in conv2d: input must be rank 4, but got rank "+l.rank+"."}),E(u.rank===4,function(){return"Error in conv2d: filter must be rank 4, but got rank "+u.rank+"."}),i!=null&&E(we(n),function(){return"Error in conv2d: pad must be an integer when using, dimRoundingMode "+i+" but got pad "+n+"."});var f=o==="NHWC"?l.shape[3]:l.shape[1];E(f===u.shape[2],function(){return"Error in conv2d: depth of input ("+f+") must match input depth for filter "+u.shape[2]+"."}),E(Pe(e,a),function(){return"Error in conv2D: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+a+"'"});var h=Tr(o),d=Tn(l.shape,u.shape,e,a,n,i,!1,h),p=[u,l],m=D.runKernelFunc(function(v,g){var y=v.conv2d(l,u,d);return g([u,l]),y},{x:l,filter:u},function(v,g){var y=g,x=y[0],b=y[1];return E(Hn(a),function(){return"Error in gradient of conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '"+a+"'"}),{x:function(){return oc(b.shape,v,x,e,n,o)},filter:function(){return Sa(b,v,x.shape,e,n,o)}}},"Conv2D",d,p);return c?m.as3D(m.shape[1],m.shape[2],m.shape[3]):m}}),rc=T({conv3d_:function(r,t,e,n,o,a){o===void 0&&(o="NDHWC"),a===void 0&&(a=[1,1,1]);var i=C(r,"x","conv3d"),s=C(t,"filter","conv3d"),u=i,l=!1;i.rank===4&&(l=!0,u=i.as5D(1,i.shape[0],i.shape[1],i.shape[2],i.shape[3])),E(u.rank===5,function(){return"Error in conv3d: input must be rank 5, but got rank "+u.rank+"."}),E(s.rank===5,function(){return"Error in conv3d: filter must be rank 5, but got rank "+s.rank+"."}),E(u.shape[4]===s.shape[3],function(){return"Error in conv3d: depth of input ("+u.shape[4]+") must match input depth for filter "+s.shape[3]+"."}),E(function(h,d){return to(h)||to(d)}(e,a),function(){return"Error in conv3D: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+a+"'"}),E(o==="NDHWC",function(){return"Error in conv3d: got dataFormat of "+o+" but only NDHWC is currently supported."});var c=Wt(u.shape,s.shape,e,a,n),f=D.runKernelFunc(function(h,d){var p=h.conv3d(u,s,c);return d([u,s]),p},{x:u,$filter:s},function(h,d){E(to(a),function(){return"Error in gradient of conv3D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '"+a+"'"});var p=d[0],m=d[1];return{x:function(){return nc(p.shape,h,m,e,n)},$filter:function(){return function(v,g,y,x,b){var w=v;v.rank===4&&(w=v.as5D(1,v.shape[0],v.shape[1],v.shape[2],v.shape[3]));var R=g;R.rank===4&&(R=g.as5D(1,g.shape[0],g.shape[1],g.shape[2],g.shape[3])),E(w.rank===5,function(){return"Error in conv3dDerFilter: input must be rank 5, but got shape "+w.shape+"."}),E(R.rank===5,function(){return"Error in conv3dDerFilter: dy must be rank 5, but got shape "+R.shape+"."}),E(y.length===5,function(){return"Error in conv3dDerFilter: filterShape must be length 5, but got "+y+"."}),E(w.shape[4]===y[3],function(){return"Error in conv3dDerFilter: depth of input "+w.shape[4]+") must match input depth in filter ("+y[3]+"."}),E(R.shape[4]===y[4],function(){return"Error in conv3dDerFilter: depth of dy ("+R.shape[4]+") must match output depth for filter ("+y[4]+")."});var A=Wt(w.shape,y,x,1,b);return D.runKernelFunc(function(k){return k.conv3dDerFilter(w,R,A)},{x5D:w,dy5D:R})}(p,h,m.shape,e,n)}}});return l?f.as4D(f.shape[1],f.shape[2],f.shape[3],f.shape[4]):f}}),Sa=T({conv2dDerFilter_:function(r,t,e,n,o,a,i){a===void 0&&(a="NHWC");var s=r;r.rank===3&&(s=r.as4D(1,r.shape[0],r.shape[1],r.shape[2]));var u=t;u.rank===3&&(u=t.as4D(1,t.shape[0],t.shape[1],t.shape[2])),E(s.rank===4,function(){return"Error in conv2dDerFilter: input must be rank 4, but got shape "+s.shape+"."}),E(u.rank===4,function(){return"Error in conv2dDerFilter: dy must be rank 4, but got shape "+u.shape+"."}),E(e.length===4,function(){return"Error in conv2dDerFilter: filterShape must be length 4, but got "+e+"."});var l=a==="NHWC"?s.shape[3]:s.shape[1],c=a==="NHWC"?u.shape[3]:u.shape[1];E(l===e[2],function(){return"Error in conv2dDerFilter: depth of input "+l+") must match input depth in filter ("+e[2]+"."}),E(c===e[3],function(){return"Error in conv2dDerFilter: depth of dy ("+c+") must match output depth for filter ("+e[3]+")."}),i!=null&&E(we(o),function(){return"Error in conv2dDerFilter: pad must be an integer when using, dimRoundingMode "+i+" but got pad "+o+"."});var f=Tr(a),h=Tn(s.shape,e,n,1,o,i,!1,f);return D.runKernelFunc(function(d){return d.conv2dDerFilter(s,u,h)},{x4D:s,dy4D:u})}}),oc=T({conv2dDerInput_:ec}),Mr=T({depthwiseConv2d_:function(r,t,e,n,o,a,i){a===void 0&&(a=[1,1]);var s=C(r,"x","depthwiseConv2d"),u=C(t,"filter","depthwiseConv2d"),l=s,c=!1;s.rank===3&&(c=!0,l=s.as4D(1,s.shape[0],s.shape[1],s.shape[2])),E(l.rank===4,function(){return"Error in depthwiseConv2d: input must be rank 4, but got rank "+l.rank+"."}),E(u.rank===4,function(){return"Error in depthwiseConv2d: filter must be rank 4, but got rank "+u.rank+"."}),E(l.shape[3]===u.shape[2],function(){return"Error in depthwiseConv2d: number of input channels ("+l.shape[3]+") must match the inChannels dimension in filter "+u.shape[2]+"."}),a==null&&(a=[1,1]),E(Pe(e,a),function(){return"Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+a+"'"}),i!=null&&E(we(n),function(){return"Error in depthwiseConv2d: pad must be an integer when using, dimRoundingMode "+i+" but got pad "+n+"."});var f=Tn(l.shape,u.shape,e,a,n,i,!0),h=[l,u],d=D.runKernelFunc(function(p,m){var v=p.depthwiseConv2D(l,u,f);return m([l,u]),v},{x:l,filter:u},function(p,m){E(Hn(a),function(){return"Error in gradient of depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '"+a+"'"});var v=m[0],g=m[1];return{x:function(){return ac(v.shape,p,g,f)},filter:function(){return ic(v,p,g.shape,f)}}},"DepthwiseConv2dNative",f,h);return c?d.as3D(d.shape[1],d.shape[2],d.shape[3]):d}}),ac=T({depthwiseConv2dDerInput_:function(r,t,e,n){var o=t,a=!1;t.rank===3&&(a=!0,o=t.as4D(1,t.shape[0],t.shape[1],t.shape[2]));var i=D.runKernelFunc(function(s){return s.depthwiseConv2DDerInput(o,e,n)},{dy4D:o});return a?i.as3D(i.shape[1],i.shape[2],i.shape[3]):i}}),ic=T({depthwiseConv2dDerFilter_:function(r,t,e,n){var o=r;r.rank===3&&(o=r.as4D(1,r.shape[0],r.shape[1],r.shape[2]));var a=t;return a.rank===3&&(a=t.as4D(1,t.shape[0],t.shape[1],t.shape[2])),D.runKernelFunc(function(i){return i.depthwiseConv2DDerFilter(o,a,n)},{x4D:o,dy4D:a})}}),sc=T({separableConv2d_:function(r,t,e,n,o,a,i){a===void 0&&(a=[1,1]),i===void 0&&(i="NHWC");var s=C(r,"x","separableConv2d"),u=C(t,"depthwiseFilter","separableConv2d"),l=C(e,"pointwiseFilter","separableConv2d"),c=s,f=!1;if(s.rank===3&&(f=!0,c=s.as4D(1,s.shape[0],s.shape[1],s.shape[2])),i==="NCHW")throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");E(c.rank===4,function(){return"Error in separableConv2d: input must be rank 4, but got rank "+c.rank+"."}),E(u.rank===4,function(){return"Error in separableConv2d: depthwise filter must be rank 4, but got rank "+u.rank+"."}),E(l.rank===4,function(){return"Error in separableConv2d: pointwise filter must be rank 4, but got rank "+u.rank+"."}),E(l.shape[0]===1,function(){return"Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got "+l.shape[0]+"."}),E(l.shape[1]===1,function(){return"Error in separableConv2d: the second dimension of pointwise filter must be 1, but got "+l.shape[1]+"."});var h=u.shape[2],d=u.shape[3];E(l.shape[2]===h*d,function(){return"Error in separableConv2d: the third dimension of pointwise filter must be "+h*d+", but got "+l.shape[2]+"."});var p=Mr(c,u,n,o,i,a),m=gt(p,l,1,"valid",i);return f?m.as3D(m.shape[1],m.shape[2],m.shape[3]):m}}),uc=T({conv2dTranspose_:function(r,t,e,n,o,a){return ec(e,C(r,"x","conv2dTranspose"),C(t,"filter","conv2dTranspose"),n,o,"NHWC",a)}}),lc=T({conv3dTranspose_:function(r,t,e,n,o){return nc(e,C(r,"x","conv3dTranspose"),C(t,"filter","conv3dTranspose"),n,o)}}),Aa=T({matMul_:function(r,t,e,n){var o;e===void 0&&(e=!1),n===void 0&&(n=!1);var a=C(r,"a","matMul"),i=C(t,"b","matMul");o=ve(a,i),a=o[0],i=o[1];var s=e?a.shape[a.rank-2]:a.shape[a.rank-1],u=n?i.shape[i.rank-1]:i.shape[i.rank-2],l=e?a.shape[a.rank-1]:a.shape[a.rank-2],c=n?i.shape[i.rank-2]:i.shape[i.rank-1],f=a.shape.slice(0,-2),h=i.shape.slice(0,-2),d=Y(f),p=Y(h);E(a.rank>=2&&i.rank>=2&&a.rank===i.rank,function(){return"Error in matMul: inputs must have the same rank of at least 2, got ranks "+a.rank+" and "+i.rank+"."}),E(Re(f,h),function(){return"Error in matMul: outer dimensions ("+f+") and ("+h+") of Tensors with shapes "+a.shape+" and "+i.shape+" must match."}),E(s===u,function(){return"Error in matMul: inner shapes ("+s+") and ("+u+") of Tensors with shapes "+a.shape+" and "+i.shape+" and transposeA="+e+" and transposeB="+n+" must match."});var m=a.shape.slice(0,-2).concat([l,c]),v=e?a.as3D(d,s,l):a.as3D(d,l,s),g=n?i.as3D(p,c,u):i.as3D(p,u,c),y={transposeA:e,transposeB:n};return D.runKernelFunc(function(x,b){var w=x.batchMatMul(v,g,e,n);return b([v,g]),w},{a:v,b:g},function(x,b){var w=b,R=w[0],A=w[1];return e||n?!e&&n?{a:function(){return x.matMul(A,!1,!1)},b:function(){return x.matMul(R,!0,!1)}}:e&&!n?{a:function(){return A.matMul(x,!1,!0)},b:function(){return R.matMul(x,!1,!1)}}:{a:function(){return A.matMul(x,!0,!0)},b:function(){return x.matMul(R,!0,!0)}}:{a:function(){return x.matMul(A,!1,!0)},b:function(){return R.matMul(x,!0,!1)}}},"BatchMatMul",y).reshape(m)}}),cc=T({dot_:function(r,t){var e=C(r,"t1","dot"),n=C(t,"t2","dot");E(!(e.rank!==1&&e.rank!==2||n.rank!==1&&n.rank!==2),function(){return"Error in dot: inputs must all be rank 1 or 2, but got ranks "+e.rank+" and "+n.rank+"."});var o=e.rank===1?e.size:e.shape[1],a=n.rank===1?n.size:n.shape[0];return E(o===a,function(){return"Error in dot: inner dimensions of inputs must match, but got "+o+" and "+a+"."}),e.rank===1&&n.rank===1?e.as2D(1,-1).matMul(n.as2D(-1,1)).asScalar():e.rank===1&&n.rank===2?e.as2D(1,-1).matMul(n.as2D(n.shape[0],n.shape[1])).as1D():e.rank===2&&n.rank===1?e.matMul(n.as2D(-1,1)).as1D():e.matMul(n.as2D(n.shape[0],n.shape[1]))}}),fc=T({outerProduct_:function(r,t){var e=C(r,"v1","outerProduct"),n=C(t,"v2","outerProduct");return E(e.rank===1&&n.rank===1,function(){return"Error in outerProduct: inputs must be rank 1, but got ranks "+e.rank+" and "+n.rank+"."}),e.as2D(-1,1).matMul(n.as2D(1,-1))}}),yt=T({reverse_:function(r,t){var e=C(r,"x","reverse");if(e.rank===0)return e.clone();var n=ke(t,e.shape);return D.runKernelFunc(function(o){return o.reverse(e,n)},{$x:e},function(o){return{$x:function(){return o.reverse(n)}}}).reshapeAs(e)}}),hc=T({reverse1d_:function(r){var t=C(r,"x","reverse");return E(t.rank===1,function(){return"Error in reverse1D: x must be rank 1 but got rank "+t.rank+"."}),yt(t,0)}}),dc=T({reverse2d_:function(r,t){var e=C(r,"x","reverse");return E(e.rank===2,function(){return"Error in reverse2D: x must be rank 2 but got rank "+e.rank+"."}),yt(e,t)}}),pc=T({reverse3d_:function(r,t){var e=C(r,"x","reverse");return E(e.rank===3,function(){return"Error in reverse3D: x must be rank 3 but got rank "+e.rank+"."}),yt(e,t)}}),vc=T({reverse4d_:function(r,t){var e=C(r,"x","reverse");return E(e.rank===4,function(){return"Error in reverse4D: x must be rank 4 but got rank "+e.rank+"."}),yt(e,t)}});function mc(r,t,e,n,o,a){var i=C(r,"x","maxPool"),s=i,u=!1;i.rank===3&&(u=!0,s=i.as4D(1,i.shape[0],i.shape[1],i.shape[2])),E(s.rank===4,function(){return"Error in maxPool: input must be rank 4 but got rank "+s.rank+"."}),E(Pe(e,n),function(){return"Error in maxPool: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+n+"'"}),a!=null&&E(we(o),function(){return"Error in maxPool: pad must be an integer when using, dimRoundingMode "+a+" but got pad "+o+"."});var l=dt(s.shape,t,e,n,o,a);if(l.filterWidth===1&&l.filterHeight===1&&Re(l.inShape,l.outShape))return i.clone();var c=[s],f=D.runKernelFunc(function(h,d){var p=h.maxPool(s,l);return d([s,p]),p},{x:s},function(h,d){var p=d[0],m=d[1];return{x:function(){return function(v,g,y,x,b,w,R,A){var k=C(v,"dy","maxPoolBackprop"),I=C(g,"input","maxPoolBackprop"),S=C(y,"output","maxPoolBackprop");E(I.rank===k.rank,function(){return"Rank of input ("+I.rank+") does not match rank of dy ("+k.rank+")"}),E(Pe(b,w),function(){return"Error in maxPoolBackProp: Either strides or dilations must be 1. Got strides "+b+" and dilations '"+w+"'"}),E(k.rank===4,function(){return"Error in maxPoolBackprop: dy must be rank 4 but got rank "+k.rank+"."}),E(I.rank===4,function(){return"Error in maxPoolBackprop: input must be rank 4 but got rank "+I.rank+"."});var F=dt(I.shape,x,b,w,R,A);return D.runKernelFunc(function(N){return N.maxPoolBackprop(k,I,S,F)},{$dy:k,$input:I})}(h,p,m,t,e,n,o)}}},"MaxPool",l,c);return u?f.as3D(f.shape[1],f.shape[2],f.shape[3]):f}function gc(r,t,e,n,o,a){var i=C(r,"x","avgPool","float32");E(Pe(e,n),function(){return"Error in avgPool: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+n+"'"});var s=i,u=!1;i.rank===3&&(u=!0,s=i.as4D(1,i.shape[0],i.shape[1],i.shape[2])),E(s.rank===4,function(){return"Error in avgPool: x must be rank 4 but got rank "+s.rank+"."}),a!=null&&E(we(o),function(){return"Error in avgPool: pad must be an integer when using, dimRoundingMode "+a+" but got pad "+o+"."});var l=dt(s.shape,t,e,n,o,a);if(l.filterWidth===1&&l.filterHeight===1&&Re(l.inShape,l.outShape))return i.clone();var c=D.runKernelFunc(function(f){return f.avgPool(s,l)},{x:s},function(f){return{x:function(){return function(h,d,p,m,v,g){var y=C(h,"dy","avgPoolBackprop"),x=C(d,"input","avgPoolBackprop");E(x.rank===y.rank,function(){return"Rank of input ("+x.rank+") does not match rank of dy ("+y.rank+")"}),E(Pe(m,v),function(){return"Error in avgPoolBackprop: Either strides or dilations must be 1. Got strides "+m+" and dilations '"+v+"'"});var b=x,w=y,R=!1;x.rank===3&&(R=!0,b=x.as4D(1,x.shape[0],x.shape[1],x.shape[2]),w=y.as4D(1,y.shape[0],y.shape[1],y.shape[2])),E(w.rank===4,function(){return"Error in avgPoolBackprop: dy must be rank 4 but got rank "+w.rank+"."}),E(b.rank===4,function(){return"Error in avgPoolBackprop: input must be rank 4 but got rank "+b.rank+"."});var A=dt(b.shape,p,m,v,g),k=D.runKernelFunc(function(I){return I.avgPoolBackprop(w,b,A)},{dy4D:w,input4D:b});return R?k.as3D(k.shape[1],k.shape[2],k.shape[3]):k}(f,s,t,e,n,o)}}},"AvgPool",l);return c=c.cast(i.dtype),u?c.as3D(c.shape[1],c.shape[2],c.shape[3]):c}var yc=T({maxPool_:function(r,t,e,n,o){return mc(r,t,e,1,n,o)}}),xc=T({avgPool_:function(r,t,e,n,o){return gc(r,t,e,1,n,o)}}),bc=T({pool_:function(r,t,e,n,o,a){o==null&&(o=[1,1]),a==null&&(a=1),n===0&&(n="valid");var i=C(r,"x","maxPool"),s=i,u=!1;i.rank===3&&(u=!0,s=i.as4D(1,i.shape[0],i.shape[1],i.shape[2])),E(Pe(a,o),function(){return"Error in pool: Either strides or dilations must be 1. Got strides "+a+" and dilations '"+o+"'"});var l,c=dt(s.shape,t,a,o,n),f=[c.dilationHeight,c.dilationWidth];l=n==="same"?function(b,w){var R=b.map(function(I,S){return I+(I-1)*(w[S]-1)}).map(function(I){return I-1}),A=R.map(function(I){return Math.floor(I/2)}),k=R.map(function(I,S){return I-A[S]});return R.map(function(I,S){return[A[S],k[S]]})}([c.filterHeight,c.filterWidth],f):[[0,0],[0,0]];var h=f[0]===1&&f[1]===1,d=function(b,w,R){var A=R.map(function(L){return L[0]}),k=R.map(function(L){return L[1]}),I=b.concat(A,k),S=w.map(function(L,B){return(L-I[B]%L)%L}),F=k.map(function(L,B){return L+S[B]}),N=w.map(function(L,B){return[A[B],F[B]]}),W=w.map(function(L,B){return[0,S[B]]});return[N,W]}([c.inHeight,c.inWidth],f,l),p=d[0],m=d[1],v=h?n:"valid",g=h?s:ea(s,f,p),y=(e==="avg"?function(){return gc(g,t,a,1,v)}:function(){return mc(g,t,a,1,v)})(),x=h?y:Qo(y,f,m);return u?x.as3D(x.shape[1],x.shape[2],x.shape[3]):x}}),wc=T({maxPool3d_:function(r,t,e,n,o,a,i){a===void 0&&(a="NDHWC");var s=C(r,"x","maxPool3d"),u=s,l=!1;s.rank===4&&(l=!0,u=s.as5D(1,s.shape[0],s.shape[1],s.shape[2],s.shape[3])),i==null&&(i=[1,1,1]),E(u.rank===5,function(){return"Error in maxPool3d: x must be rank 5 but got rank "+u.rank+"."}),E(a==="NDHWC",function(){return"Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of "+a}),E(Pe(e,i),function(){return"Error in maxPool3d: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+i+"'"}),o!=null&&E(we(n),function(){return"Error in maxPool3d: pad must be an integer when using, dimRoundingMode "+o+" but got pad "+n+"."});var c=Lt(u.shape,t,e,i,n,o,a),f=D.runKernelFunc(function(h,d){var p=h.maxPool3d(u,c);return d([u,p]),p},{x:u},function(h,d){var p=d[0],m=d[1];return{x:function(){return function(v,g,y,x,b,w,R,A){var k=C(v,"dy","maxPool3dBackprop"),I=C(g,"input","maxPool3dBackprop"),S=C(y,"output","maxPool3dBackprop"),F=k,N=I,W=S,L=!1;I.rank===4&&(L=!0,F=k.as5D(1,k.shape[0],k.shape[1],k.shape[2],k.shape[3]),N=I.as5D(1,I.shape[0],I.shape[1],I.shape[2],I.shape[3]),W=S.as5D(1,S.shape[0],S.shape[1],S.shape[2],S.shape[3])),E(F.rank===5,function(){return"Error in maxPool3dBackprop: dy must be rank 5 but got rank "+F.rank+"."}),E(N.rank===5,function(){return"Error in maxPool3dBackprop: input must be rank 5 but got rank "+N.rank+"."}),E(W.rank===5,function(){return"Error in maxPool3dBackprop: output must be rank 5 but got rank "+W.rank+"."}),w==null&&(w=[1,1,1]),E(Pe(b,w),function(){return"Error in maxPool3dBackprop: Either strides or dilations must be 1. Got strides "+b+" and dilations '"+w+"'"}),A!=null&&E(we(R),function(){return"Error in maxPool3dBackprop: pad must be an integer when using, dimRoundingMode "+A+" but got pad "+R+"."});var B=Lt(N.shape,x,b,w,R,A),V=D.runKernelFunc(function(z){return z.maxPool3dBackprop(F,N,W,B)},{dy5D:F,input5D:N});return L?V.as4D(V.shape[1],V.shape[2],V.shape[3],V.shape[4]):V}(h,p,m,t,e,i,n,o)}}});return l?f.as4D(f.shape[1],f.shape[2],f.shape[3],f.shape[4]):f}}),Cc=T({avgPool3d_:function(r,t,e,n,o,a,i){a===void 0&&(a="NDHWC");var s=C(r,"x","avgPool3d","float32"),u=s,l=!1;s.rank===4&&(l=!0,u=s.as5D(1,s.shape[0],s.shape[1],s.shape[2],s.shape[3])),i==null&&(i=[1,1,1]),E(u.rank===5,function(){return"Error in avgPool3d: x must be rank 5 but got rank "+u.rank+"."}),E(a==="NDHWC",function(){return"Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of "+a}),E(Pe(e,i),function(){return"Error in avgPool3d: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+i+"'"}),o!=null&&E(we(n),function(){return"Error in avgPool3d: pad must be an integer when using, dimRoundingMode "+o+" but got pad "+n+"."});var c=Lt(u.shape,t,e,i,n,o,a),f=D.runKernelFunc(function(h){return h.avgPool3d(u,c)},{x:u},function(h){return{x:function(){return function(d,p,m,v,g,y,x){var b=C(d,"dy","avgPool3dBackprop"),w=C(p,"input","avgPool3dBackprop"),R=b,A=w,k=!1;w.rank===4&&(k=!0,R=b.as5D(1,b.shape[0],b.shape[1],b.shape[2],b.shape[3]),A=w.as5D(1,w.shape[0],w.shape[1],w.shape[2],w.shape[3])),E(R.rank===5,function(){return"Error in avgPool3dBackprop: dy must be rank 5 but got rank "+R.rank+"."}),E(A.rank===5,function(){return"Error in avgPool3dBackprop: input must be rank 5 but got rank "+A.rank+"."}),g==null&&(g=[1,1,1]),E(Pe(v,g),function(){return"Error in avgPool3dBackprop: Either strides or dilations must be 1. Got strides "+v+" and dilations '"+g+"'"}),x!=null&&E(we(y),function(){return"Error in maxPool3dBackprop: pad must be an integer when using, dimRoundingMode "+x+" but got pad "+y+"."});var I=Lt(A.shape,m,v,g,y,x),S=D.runKernelFunc(function(F){return F.avgPool3dBackprop(R,A,I)},{dy5D:R,input5D:A});return k?S.as4D(S.shape[1],S.shape[2],S.shape[3],S.shape[4]):S}(h,u,t,e,i,n,o)}}});return f=f.cast(u.dtype),l?f.as4D(f.shape[1],f.shape[2],f.shape[3],f.shape[4]):f}}),mn=T({slice_:function(r,t,e){var n,o,a=C(r,"x","slice");if(a.rank===0)throw new Error("Slicing scalar is not possible");(n=typeof t=="number"?[t].concat(new Array(a.rank-1).fill(0)):t.length<a.rank?t.concat(new Array(a.rank-t.length).fill(0)):t.slice()).forEach(function(u){E(u!==-1,function(){return"slice() does not support negative begin indexing."})}),o=(o=e==null?new Array(a.rank).fill(-1):typeof e=="number"?[e].concat(new Array(a.rank-1).fill(-1)):e.length<a.rank?e.concat(new Array(a.rank-e.length).fill(-1)):e).map(function(u,l){return u>=0?u:(E(u===-1,function(){return"Negative size values should be exactly -1 but got "+u+" for the slice() size at index "+l+"."}),a.shape[l]-n[l])}),eu(a,n,o);var i=a.shape,s={begin:n,size:o};return D.runKernelFunc(function(u){return u.slice(a,n,o)},{x:a},function(u){for(var l=[],c=0;c<u.rank;c++)l.push([n[c],i[c]-n[c]-o[c]]);return{x:function(){return u.pad(l)}}},"Slice",s)}}),Ec=T({slice1d_:function(r,t,e){var n=C(r,"x","slice1d");return E(n.rank===1,function(){return"slice1d expects a rank-1 tensor, but got a rank-"+n.rank+" tensor"}),mn(n,[t],[e])}}),Rc=T({slice2d_:function(r,t,e){var n=C(r,"x","slice2d");return E(n.rank===2,function(){return"slice2d expects a rank-2 tensor, but got a rank-"+n.rank+" tensor"}),mn(n,t,e)}}),Ic=T({slice3d_:function(r,t,e){var n=C(r,"x","slice3d");return E(n.rank===3,function(){return"slice3d expects a rank-3 tensor, but got a rank-"+n.rank+" tensor"}),mn(n,t,e)}}),kc=T({slice4d_:function(r,t,e){var n=C(r,"x","slice4d");return E(n.rank===4,function(){return"slice4d expects a rank-4 tensor, but got a rank-"+n.rank+" tensor"}),mn(n,t,e)}});function Sc(r,t,e,n,o){return t.rank<e.rank&&(t=t.reshape(Be(t.shape,n))),r.rank<e.rank&&(r=r.reshape(Be(r.shape,n))),{x:function(){var a=r.mul(e.equal(t).cast(r.dtype));return o==null?a:a.transpose(o)}}}var Ac=T({all_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=C(r,"x","all","bool"),o=ke(t,n.shape),a=o,i=Qe(a,n.rank);i!=null&&(n=n.transpose(i),a=Je(a.length,n.rank));var s=D.runKernelFunc(function(l){return l.all(n,a)},{$x:n});if(e){var u=Be(s.shape,o);return s.reshape(u)}return s}}),Dc=T({any_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=C(r,"x","any","bool"),o=ke(t,n.shape),a=o,i=Qe(a,n.rank);i!=null&&(n=n.transpose(i),a=Je(a.length,n.rank));var s=D.runKernelFunc(function(l){return l.any(n,a)},{$x:n});if(e){var u=Be(s.shape,o);return s.reshape(u)}return s}}),Tc=T({argMax_:function(r,t){t===void 0&&(t=0);var e=C(r,"x","argMax");t==null&&(t=0);var n=ke(t,e.shape),o=Qe(n,e.rank);o!=null&&(e=e.transpose(o),n=Je(n.length,e.rank));var a={axis:n[0]},i=[e];return D.runKernelFunc(function(s,u){var l=s.argMax(e,n[0]);return u([e]),l},{x:e},function(s,u){var l=u[0];return{x:function(){return ue(l)}}},"ArgMax",a,i)}}),Nc=T({argMin_:function(r,t){t===void 0&&(t=0);var e=C(r,"x","argMin");t==null&&(t=0);var n=ke(t,e.shape),o=Qe(n,e.rank);return o!=null&&(e=e.transpose(o),n=Je(n.length,e.rank)),D.runKernelFunc(function(a,i){var s=a.argMin(e,n[0]);return i([e]),s},{$x:e},function(a,i){var s=i[0];return{$x:function(){return ue(s)}}})}}),Fc=T({logSumExp_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=C(r,"x","logSumExp"),o=ke(t,n.shape),a=n.max(o,!0),i=n.sub(a).exp().sum(o).log(),s=a.reshape(i.shape).add(i);if(e){var u=Be(s.shape,o);return s.reshape(u)}return s}}),_c=T({max_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=C(r,"x","max"),o=n,a=ke(t,n.shape),i=a,s=Qe(i,n.rank);s!=null&&(n=n.transpose(s),i=Je(i.length,n.rank));var u=[n],l=D.runKernelFunc(function(f,h){var d=f.max(n,i);return h([o,d]),d},{x:n},function(f,h){return Sc(f,h[1],h[0],a,s)},"Max",{axes:i},u,[!0]);if(e){var c=Be(l.shape,a);l=l.reshape(c)}return l}}),Oc=T({mean_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=C(r,"x","mean"),o=ke(t,n.shape),a=Y(Te(n.shape,o)[1]);return Ht(function(i){var s=$(a);return{value:(s.dtype===i.dtype?i:i.cast(s.dtype)).div(s).sum(t,e),gradFunc:function(u){var l=i.shape.slice();return o.forEach(function(c){l[c]=1}),u.reshape(l).mul(jn(i.shape,"float32")).div(a)}}})(n)}}),Mc=T({min_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=C(r,"x","min"),o=n,a=ke(t,n.shape),i=a,s=Qe(i,n.rank);s!=null&&(n=n.transpose(s),i=Je(i.length,n.rank));var u=[n],l=D.runKernelFunc(function(f,h){var d=f.min(n,i);return h([o,d]),d},{x:n},function(f,h){return Sc(f,h[1],h[0],a,s)},"Min",{axes:i},u,[!0]);if(e){var c=Be(l.shape,a);l=l.reshape(c)}return l}}),Bc=T({moments_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=ke(t,(r=C(r,"x","moments")).shape),o=r.mean(n,e),a=o.shape;e||(a=Be(o.shape,n));var i=r.toFloat().sub(o.reshape(a)).square();return{mean:o,variance:i.mean(n,e)}}}),Da=T({sum_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=C(r,"x","sum");n.dtype==="bool"&&(n=n.toInt());var o=ke(t,n.shape);return Ht(function(a){var i=Qe(o,a.rank),s=o,u=a;i!=null&&(u=a.transpose(i),s=Je(s.length,a.rank));var l=function(d){var p=a.shape.slice();return o.forEach(function(m){p[m]=1}),d.reshape(p).mul(jn(a.shape,"float32"))},c={axes:s},f=D.runKernelFunc(function(d){return d.sum(u,s)},{x:u},function(d){return{x:function(){return l(d)}}},"Sum",c);if(e){var h=Be(f.shape,o);f=f.reshape(h)}return{value:f,gradFunc:l}})(n)}}),Pc=T({prod_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=C(r,"x","prod");n.dtype==="bool"&&(n=n.toInt());var o=ke(t,n.shape),a=Qe(o,n.rank),i=o,s=n;a!=null&&(s=n.transpose(a),i=Je(i.length,n.rank));var u=D.runKernelFunc(function(c){return c.prod(s,i)},{permutedX:s});if(e){var l=Be(u.shape,o);u=u.reshape(l)}return u}}),Ta=T({elu_:function(r){var t=C(r,"x","elu");return D.runKernelFunc(function(e,n){var o=e.elu(t);return n([o]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){return D.runKernelFunc(function(a){return a.eluDer(e,o)},{dy:e,y:o})}}})}}),Lc=T({leakyRelu_:function(r,t){t===void 0&&(t=.2);var e=C(r,"x","leakyRelu");return _r($(t).mul(e),e)}}),Na=T({prelu_:function(r,t){var e=C(r,"x","prelu"),n=C(t,"alpha","prelu");return D.runKernelFunc(function(o,a){var i=o.prelu(e,n);return a([e,n]),i},{x:e,alpha:n},function(o,a){var i=a[0],s=a[1],u=i.greater(0);return{x:function(){return Sn(u,o,o.mul(s))},alpha:function(){var l=Sn(u,ue(o),o.mul(i)),c=Ie(s.shape,o.shape);return c.length>0&&(l=l.sum(c)),l.reshape(s.shape)}}},"Prelu")}}),Fa=T({relu_:function(r){var t=C(r,"x","relu");return t.dtype==="bool"?t.toInt():D.runKernelFunc(function(e,n){var o=e.relu(t);return n([t]),o},{x:t},function(e,n){var o=n[0];return{x:function(){return e.mulStrict(o.step().toFloat())}}},"Relu")}}),_a=T({relu6_:function(r){var t=C(r,"x","relu6");return t.dtype==="bool"?t.toInt():D.runKernelFunc(function(e,n){var o=e.relu6(t);return n([t]),o},{x:t},function(e,n){var o=n[0],a=o.lessEqual(6).mul(o.step());return{x:function(){return e.mulStrict(a.toFloat())}}},"Relu6")}}),Wc=T({selu_:function(r){var t=C(r,"x","selu");return D.runKernelFunc(function(e,n){var o=e.selu(t);return n([t]),o},{$x:t},function(e,n){var o=n[0];return{$x:function(){var a=o.greater($(0)),i=$(va),s=$(ma),u=e.mul(s),l=e.mul(i).mul(o.toFloat().exp());return Sn(a,u,l)}}})}}),Uc=T({transpose_:function(r,t){var e=C(r,"x","transpose");if(t==null&&(t=e.shape.map(function(o,a){return a}).reverse()),E(e.rank===t.length,function(){return"Error in transpose: rank of input "+e.rank+" must match length of perm "+t+"."}),t.forEach(function(o){E(o>=0&&o<e.rank,function(){return"All entries in 'perm' must be between 0 and "+(e.rank-1)+" but got "+t})}),e.rank<=1)return e.clone();var n={perm:t};return D.runKernelFunc(function(o){return o.transpose(e,t)},{x:e},function(o){var a=wr(t);return{x:function(){return o.transpose(a)}}},"Transpose",n)}}),zc=T({localResponseNormalization_:function(r,t,e,n,o){t===void 0&&(t=5),e===void 0&&(e=1),n===void 0&&(n=1),o===void 0&&(o=.5);var a=C(r,"x","localResponseNormalization");E(a.rank===4||a.rank===3,function(){return`Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank `+a.rank+"."}),E(we(t),function(){return"Error in localResponseNormalization: depthRadius must be an integer but got depthRadius "+t+"."});var i=a,s=!1;a.rank===3&&(s=!0,i=a.as4D(1,a.shape[0],a.shape[1],a.shape[2]));var u=D.runKernelFunc(function(l,c){var f=l.localResponseNormalization4D(i,t,e,n,o);return c([i,f]),f},{x4D:i},function(l,c){var f=c[0],h=c[1];return{x4D:function(){return D.runKernelFunc(function(d){return d.LRNGrad(l,f,h,t,e,n,o)},{})}}});return s?u.as3D(u.shape[1],u.shape[2],u.shape[3]):u}}),Oa=T({norm_:function(r,t,e,n){t===void 0&&(t="euclidean"),e===void 0&&(e=null),n===void 0&&(n=!1);var o=function s(u,l,c){if(c===void 0&&(c=null),u.rank===0)return u.abs();if(u.rank!==1&&c===null)return s(u.reshape([-1]),l,c);if(u.rank===1||typeof c=="number"||Array.isArray(c)&&c.length===1){if(l===1)return u.abs().sum(c);if(l===1/0)return u.abs().max(c);if(l===-1/0)return u.abs().min(c);if(l==="euclidean"||l===2)return u.abs().pow($(2,"int32")).sum(c).sqrt();throw new Error("Error in norm: invalid ord value: "+l)}if(Array.isArray(c)&&c.length===2){if(l===1)return u.abs().sum(c[0]).max(c[1]-1);if(l===1/0)return u.abs().sum(c[1]).max(c[0]);if(l===-1/0)return u.abs().sum(c[1]).min(c[0]);if(l==="fro"||l==="euclidean")return u.square().sum(c).sqrt();throw new Error("Error in norm: invalid ord value: "+l)}throw new Error("Error in norm: invalid axis: "+c)}(r=C(r,"x","norm"),t,e),a=o.shape;if(n){var i=ke(e,r.shape);a=Be(o.shape,i)}return o.reshape(a)}}),Vc=T({basicLSTMCell_:function(r,t,e,n,o,a){var i=C(r,"forgetBias","basicLSTMCell"),s=C(t,"lstmKernel","basicLSTMCell"),u=C(e,"lstmBias","basicLSTMCell"),l=C(n,"data","basicLSTMCell"),c=C(o,"c","basicLSTMCell"),f=C(a,"h","basicLSTMCell"),h=l.concat(f,1).matMul(s).add(u),d=h.shape[0],p=h.shape[1]/4,m=[d,p],v=h.slice([0,0],m),g=h.slice([0,p],m),y=h.slice([0,2*p],m),x=h.slice([0,3*p],m),b=v.sigmoid().mulStrict(g.tanh()).addStrict(c.mulStrict(i.add(y).sigmoid())),w=b.tanh().mulStrict(x.sigmoid());return[b,w]}}),Gc=T({multiRNNCell_:function(r,t,e,n){for(var o=C(t,"data","multiRNNCell"),a=Mt(e,"c","multiRNNCell"),i=Mt(n,"h","multiRNNCell"),s=o,u=[],l=0;l<r.length;l++){var c=r[l](s,a[l],i[l]);u.push(c[0]),u.push(c[1]),s=c[1]}var f=[],h=[];for(l=0;l<u.length;l+=2)f.push(u[l]),h.push(u[l+1]);return[f,h]}}),Hc=T({movingAverage_:function(r,t,e,n,o){o===void 0&&(o=!0);var a=C(r,"v","movingAverage"),i=C(t,"x","movingAverage"),s=C(e,"decay","movingAverage");$i(a,i),E(Re(a.shape,i.shape),function(){return"Shape mismatch in v and x"});var u=$(1),l=u.sub(s),c=i.sub(a).mul(l);if(o){E(n!=null,function(){return"When using zeroDebias: true, step is required."});var f=C(n,"step","movingAverage");c=c.div(u.sub(zt(s,f)))}return a.add(c)}}),qc=T({stridedSlice_:function(r,t,e,n,o,a,i,s,u){if(o===void 0&&(o=0),a===void 0&&(a=0),i===void 0&&(i=0),s===void 0&&(s=0),u===void 0&&(u=0),n==null&&(n=new Array(t.length)),i!==0)throw new Error("ellipsis mask is not yet supported");var l=C(r,"x","stridedSlice"),c=So(s),f=l.shape.slice();c.forEach(function(v){t[v]=0,e[v]=1,f.splice(v,0,1)}),l=l.reshape(f);for(var h=0;h<l.rank;h++)t[h]=nu(o,t,n,l.shape,h),e[h]=tu(a,e,n,l.shape,h),n[h]=n[h]||1;var d=So(u);d.forEach(function(v){e[v]=t[v]+1,n[v]=1});var p=Sr(t,e,n),m=p.filter(function(v,g){return d.indexOf(g)===-1});return n.every(function(v){return v===1})?mn(l,t,p).reshape(m):D.runKernelFunc(function(v){return v.stridedSlice(l,t,e,n)},{$x:l}).reshape(m)}}),Kc=T({topk_:function(r,t,e){t===void 0&&(t=1),e===void 0&&(e=!0);var n=C(r,"x","topk");if(n.rank===0)throw new Error("topk() expects the input to be of rank 1 or higher");var o=n.shape[n.shape.length-1];if(t>o)throw new Error("'k' passed to topk() must be <= the last dimension ("+o+") but got "+t);var a=D.runKernelFunc(function(i){return i.topk(n,t,e)},{$x:n});return{values:a[0],indices:a[1]}}}),jc=T({scatterND_:function(r,t,e){var n=C(r,"indices","scatterND","int32"),o=C(t,"updates","scatterND");return Zs(o,n,e),D.runKernelFunc(function(a){return a.scatterND(n,o,e)},{indices:n,updates:o},null,"ScatterNd",{shape:e})}}),Br=T({fft_:function(r){E(r.dtype==="complex64",function(){return"The dtype for tf.spectral.fft() must be complex64 but got "+r.dtype+"."});var t=r.shape[r.shape.length-1],e=r.size/t,n=r.as2D(e,t);return D.runKernelFunc(function(o){return o.fft(n)},{input:r}).reshape(r.shape)}}),Vt=T({ifft_:function(r){E(r.dtype==="complex64",function(){return"The dtype for tf.spectral.ifft() must be complex64 but got "+r.dtype+"."});var t=r.shape[r.shape.length-1],e=r.size/t,n=r.as2D(e,t);return D.runKernelFunc(function(o){return o.ifft(n)},{input:r}).reshape(r.shape)}}),Pr=T({rfft_:function(r,t){E(r.dtype==="float32",function(){return"The dtype for rfft() must be real value but got "+r.dtype});var e,n=r.shape[r.shape.length-1],o=r.size/n;if(t!=null&&t<n){var a=r.shape.map(function(g){return 0}),i=r.shape.map(function(g){return g});i[r.shape.length-1]=t,e=r.slice(a,i),n=t}else if(t!=null&&t>n){var s=r.shape.map(function(g){return g});s[r.shape.length-1]=t-n,e=r.concat(ye(s),r.shape.length-1),n=t}else e=r;var u=e.zerosLike(),l=Ae(e,u).as2D(o,n),c=Br(l),f=Math.floor(n/2)+1,h=Ve(c),d=je(c),p=h.split([f,n-f],h.shape.length-1),m=d.split([f,n-f],d.shape.length-1),v=e.shape.slice();return v[e.shape.length-1]=f,Ae(p[0],m[0]).reshape(v)}}),Ma=T({irfft_:function(r){var t=r.shape[r.shape.length-1],e=r.size/t;if(t<=2){var n=r.as2D(e,t),o=Vt(n);return Ve(o)}var a=[e,2*(t-1)],i=Ve(r).as2D(e,t),s=je(r).as2D(e,t),u=i.slice([0,1],[e,t-2]).reverse(1),l=s.slice([0,1],[e,t-2]).reverse(1).mul($(-1)),c=i.concat(u,1),f=s.concat(l,1);return n=Ae(c,f).as2D(a[0],a[1]),o=Vt(n),Ve(o)}}),Xc=Object.freeze({fft:Br,ifft:Vt,rfft:Pr,irfft:Ma}),Yc=T({sparseToDense_:function(r,t,e,n){n===void 0&&(n=0);var o=C(r,"sparseIndices","sparseToDense","int32"),a=C(t,"sparseValues","sparseToDense"),i=C(n,"defaultValue","sparseToDense",a.dtype);return function(s,u,l,c){if(s.dtype!=="int32")throw new Error("tf.sparseToDense() expects the indices to be int32 type, but the dtype was "+s.dtype+".");if(s.rank>2)throw new Error("sparseIndices should be a scalar, vector, or matrix, but got shape "+s.shape+".");var f=s.rank>0?s.shape[0]:1,h=s.rank>1?s.shape[1]:1;if(l.length!==h)throw new Error("outputShape has incorrect number of elements:, "+l.length+", should be: "+h+".");var d=u.size;if(u.rank!==0&&(u.rank!==1||d!==f))throw new Error("sparseValues has incorrect shape "+u.shape+", should be [] or ["+f+"]");if(u.dtype!==c.dtype)throw new Error("sparseValues.dtype must match defaultValues.dtype")}(o,a,e,i),D.runKernelFunc(function(s){return s.sparseToDense(o,a,e,i)},{$sparseIndices:o,$sparseValues:a,$defaultValue:i})}}),$c=T({gatherND_:function(r,t){var e=C(t,"indices","gatherND","int32"),n=C(r,"x","gatherND");return D.runKernelFunc(function(o){return o.gatherND(n,e)},{x:n,indices:e},null,"GatherNd")}}),Qc=T({diag_:function(r){var t=C(r,"x","diag").flatten(),e=r.shape.concat(r.shape);return D.runKernelFunc(function(n){return n.diag(t)},{$x:t}).reshape(e)}}),Jc=T({dropout_:function(r,t,e,n){var o=C(r,"x","dropout");if(E(o.dtype==="float32",function(){return"x has to be a floating point tensor since it's going to be scaled, but got a "+o.dtype+" tensor instead."}),E(t>=0&&t<1,function(){return"rate must be a float in the range [0, 1), but got "+t+"."}),t===0)return r instanceof Se?o.clone():o;var a=function(u,l){if(l==null)return u.shape.slice();if(Re(u.shape,l))return l;if(u.shape.length===l.length){for(var c=[],f=0;f<u.shape.length;f++)l[f]==null&&u.shape[f]!=null?c.push(u.shape[f]):c.push(l[f]);return c}return l}(o,e),i=1-t,s=Zo(a,0,1,"float32",n).add(i).floor().div(i);return o.mul(s)}});function Zc(r,t,e){for(var n=1-r%2,o=new Float32Array(r),a=0;a<r;++a){var i=2*Math.PI*a/(r+n-1);o[a]=t-e*Math.cos(i)}return Gn(o,"float32")}var Lr=T({hannWindow_:function(r){return Zc(r,.5,.5)}}),Ba=T({hammingWindow_:function(r){return Zc(r,.54,.46)}}),Wr=T({frame_:function(r,t,e,n,o){n===void 0&&(n=!1),o===void 0&&(o=0);for(var a=0,i=[];a+t<=r.size;)i.push(mn(r,a,t)),a+=e;if(n)for(;a<r.size;){var s=a+t-r.size,u=Ye([mn(r,a,t-s),Cr([s],o)]);i.push(u),a+=e}return i.length===0?zn([],[0,t]):Ye(i).as2D(i.length,t)}}),Pa=T({stft_:function(r,t,e,n,o){var a;o===void 0&&(o=Lr),n==null&&(a=t,n=Math.floor(Math.pow(2,Math.ceil(Math.log(a)/Math.log(2)))));for(var i=Wr(r,t,e),s=Ln(i,o(t)),u=[],l=0;l<i.shape[0];l++)u.push(Pr(s.slice([l,0],[1,t]),n));return Ye(u)}}),ef=Object.freeze({hannWindow:Lr,hammingWindow:Ba,frame:Wr,stft:Pa}),_e,nf=function(r,t,e){return e===void 0&&(e=1),j(this,void 0,void 0,function(){var n,o,a,i,s,u,l,c,f,h,d,p,m,v;return X(this,function(g){switch(g.label){case 0:return n=C(r,"predictions","inTopK"),o=C(t,"targets","inTopK"),E(n.rank>1,function(){return"inTopK() expects the predictions to be of rank 2 or higher, but got "+n.rank}),E(n.rank-1===o.rank,function(){return"predictions rank should be 1 larger than targets rank, but got predictions rank "+n.rank+" and targets rank "+o.rank}),fe(n.shape.slice(0,n.shape.length-1),o.shape,"predictions's shape should be align with the targets' shape, except the last dimension."),a=n.shape[n.shape.length-1],E(e>0&&e<=a,function(){return"'k' passed to inTopK() must be > 0 && <= the predictions last dimension ("+a+"), but got "+e}),[4,n.data()];case 1:return i=g.sent(),[4,o.data()];case 2:for(s=g.sent(),u=[i.length/a,a],c=u[1],f=ft("bool",l=u[0]),h=0;h<l;h++){for(d=h*c,p=i.subarray(d,d+c),m=[],v=0;v<p.length;v++)m.push({value:p[v],index:v});for(m.sort(function(y,x){return x.value-y.value}),f[h]=0,v=0;v<e;v++)if(m[v].index===s[h]){f[h]=1;break}}return r!==n&&n.dispose(),t!==o&&o.dispose(),[2,Ne(f,o.shape,"bool")]}})})};(function(r){r[r.NONE=0]="NONE",r[r.MEAN=1]="MEAN",r[r.SUM=2]="SUM",r[r.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"})(_e||(_e={}));var Yd=T({absoluteDifference_:function(r,t,e,n){n===void 0&&(n=_e.SUM_BY_NONZERO_WEIGHTS);var o=C(r,"labels","absoluteDifference"),a=C(t,"predictions","absoluteDifference"),i=null;e!=null&&(i=C(e,"weights","absoluteDifference")),fe(o.shape,a.shape,"Error in absoluteDifference: ");var s=o.sub(a).abs();return yn(s,i,n)}}),yn=T({computeWeightedLoss_:function(r,t,e){e===void 0&&(e=_e.SUM_BY_NONZERO_WEIGHTS);var n=C(r,"losses","computeWeightedLoss"),o=null;t!=null&&(o=C(t,"weights","computeWeightedLoss"));var a=o==null?n:n.mul(o);if(e===_e.NONE)return a;if(e===_e.SUM)return a.sum();if(e===_e.MEAN){if(o==null)return a.mean();var i=n.size/o.size,s=a.sum().div(o.sum());return i>1?s.div($(i)):s}if(e===_e.SUM_BY_NONZERO_WEIGHTS){if(o==null)return a.sum().div($(n.size));var u=o.mul(jn(n.shape)).notEqual($(0)).sum().toFloat();return a.sum().div(u)}throw Error("Unknown reduction: "+e)}}),$d=T({cosineDistance_:function(r,t,e,n,o){o===void 0&&(o=_e.SUM_BY_NONZERO_WEIGHTS);var a=C(r,"labels","cosineDistance"),i=C(t,"predictions","cosineDistance"),s=null;n!=null&&(s=C(n,"weights","cosineDistance")),fe(a.shape,i.shape,"Error in cosineDistance: ");var u=$(1).sub(a.mul(i).sum(e,!0));return yn(u,s,o)}}),Qd=T({hingeLoss_:function(r,t,e,n){n===void 0&&(n=_e.SUM_BY_NONZERO_WEIGHTS);var o=C(r,"labels","hingeLoss"),a=C(t,"predictions","hingeLoss"),i=null;e!=null&&(i=C(e,"weights","hingeLoss")),fe(o.shape,a.shape,"Error in hingeLoss: ");var s=$(1);o=$(2).mul(o).sub(s);var u=s.sub(o.mul(a)).relu();return yn(u,i,n)}}),Jd=T({huberLoss_:function(r,t,e,n,o){n===void 0&&(n=1),o===void 0&&(o=_e.SUM_BY_NONZERO_WEIGHTS);var a=C(r,"labels","huberLoss"),i=C(t,"predictions","huberLoss"),s=null;e!=null&&(s=C(e,"weights","huberLoss")),fe(a.shape,i.shape,"Error in huberLoss: ");var u=$(n),l=i.sub(a).abs(),c=Ea(l,u),f=l.sub(c),h=$(.5).mul(c.square()).add(u.mul(f));return yn(h,s,o)}}),Zd=T({logLoss_:function(r,t,e,n,o){n===void 0&&(n=1e-7),o===void 0&&(o=_e.SUM_BY_NONZERO_WEIGHTS);var a=C(r,"labels","logLoss"),i=C(t,"predictions","logLoss"),s=null;e!=null&&(s=C(e,"weights","logLoss")),fe(a.shape,i.shape,"Error in logLoss: ");var u=$(1),l=$(n),c=a.mul(i.add(l).log()).neg().sub(u.sub(a).mul(u.sub(i).add(l).log()));return yn(c,s,o)}}),ep=T({meanSquaredError_:function(r,t,e,n){n===void 0&&(n=_e.SUM_BY_NONZERO_WEIGHTS);var o=C(r,"labels","meanSquaredError"),a=C(t,"predictions","meanSquaredError"),i=null;e!=null&&(i=C(e,"weights","meanSquaredError")),fe(o.shape,a.shape,"Error in meanSquaredError: ");var s=o.squaredDifference(a);return yn(s,i,n)}}),np=T({sigmoidCrossEntropy_:function(r,t,e,n,o){n===void 0&&(n=0),o===void 0&&(o=_e.SUM_BY_NONZERO_WEIGHTS);var a=C(r,"multiClassLabels","sigmoidCrossEntropy"),i=C(t,"logits","sigmoidCrossEntropy"),s=null;if(e!=null&&(s=C(e,"weights","sigmoidCrossEntropy")),fe(a.shape,i.shape,"Error in sigmoidCrossEntropy: "),n>0){var u=$(n),l=$(1),c=$(.5);a=a.mul(l.sub(u)).add(c.mul(u))}var f=function(h,d){var p=C(h,"labels","sigmoidCrossEntropyWithLogits"),m=C(d,"logits","sigmoidCrossEntropyWithLogits");fe(p.shape,m.shape,"Error in sigmoidCrossEntropyWithLogits: ");var v=m.relu(),g=m.mul(p),y=m.abs().neg().exp().log1p();return v.sub(g).add(y)}(a,i);return yn(f,s,o)}}),tp=T({softmaxCrossEntropy_:function(r,t,e,n,o){n===void 0&&(n=0),o===void 0&&(o=_e.SUM_BY_NONZERO_WEIGHTS);var a=C(r,"onehotLabels","softmaxCrossEntropy"),i=C(t,"logits","softmaxCrossEntropy"),s=null;if(e!=null&&(s=C(e,"weights","softmaxCrossEntropy")),fe(a.shape,i.shape,"Error in softmaxCrossEntropy: "),n>0){var u=$(n),l=$(1),c=$(a.shape[1]);a=a.mul(l.sub(u)).add(u.div(c))}var f=function(h,d,p){if(p===void 0&&(p=-1),p===-1&&(p=d.rank-1),p!==d.rank-1)throw Error("Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank "+d.rank+" and dim was "+p);return Ht(function(m,v,g){var y=v.logSumExp([p],!0),x=v.toFloat().sub(y);return g([m,x]),{value:x.mul(m).neg().sum([p]),gradFunc:function(b,w){var R=w[0],A=w[1],k=Be(b.shape,[p]);return[b.reshape(k).mul(R.toFloat().sub(A.exp())),b.reshape(k).mul(A.exp().sub(R.toFloat()))]}}})(h,d)}(a,i);return yn(f,s,o)}}),tf=Object.freeze({get Reduction(){return _e},absoluteDifference:Yd,computeWeightedLoss:yn,cosineDistance:$d,hingeLoss:Qd,huberLoss:Jd,logLoss:Zd,meanSquaredError:ep,sigmoidCrossEntropy:np,softmaxCrossEntropy:tp});function bi(r,t){return t===void 0&&(t=!1),D.tidy(function(){if(r.shape.length!==2)throw new Error("qr2d() requires a 2D Tensor, but got a "+r.shape.length+"D Tensor.");for(var e=r.shape[0],n=r.shape[1],o=Jo(e),a=r.clone(),i=zn([[1]],[1,1]),s=i.clone(),u=e>=n?n:e,l=function(f){var h,d=a,p=s,m=o;h=D.tidy(function(){var v=a.slice([f,f],[e-f,1]),g=v.norm(),y=a.slice([f,f],[1,1]),x=zn([[-1]]).where(y.greater(0),zn([[1]])),b=y.sub(x.mul(g)),w=v.div(b);s=w.shape[0]===1?i.clone():i.concat(w.slice([1,0],[w.shape[0]-1,w.shape[1]]),0);var R=x.matMul(b).div(g).neg(),A=a.slice([f,0],[e-f,n]),k=R.mul(s);if(f===0)a=A.sub(k.matMul(s.transpose().matMul(A)));else{var I=A.sub(k.matMul(s.transpose().matMul(A)));a=a.slice([0,0],[f,n]).concat(I,0)}var S=o.slice([0,f],[e,o.shape[1]-f]);if(f===0)o=S.sub(S.matMul(s).matMul(k.transpose()));else{var F=S.sub(S.matMul(s).matMul(k.transpose()));o=o.slice([0,0],[e,f]).concat(F,1)}return[s,a,o]}),s=h[0],a=h[1],o=h[2],Me([d,p,m])},c=0;c<u;++c)l(c);return!t&&e>n&&(o=o.slice([0,0],[e,n]),a=a.slice([0,0],[n,n])),[o,a]})}var rp=T({bandPart_:function(r,t,e){if(t%1!=0)throw new Error("bandPart(): numLower must be an integer, got "+t+".");if(e%1!=0)throw new Error("bandPart(): numUpper must be an integer, got "+e+".");var n=C(r,"a","bandPart");if(n.rank<2)throw new Error("bandPart(): Rank must be at least 2, got "+n.rank+".");var o=n.shape,a=n.shape.slice(-2),i=a[0],s=a[1];if(!(t<=i))throw new Error("bandPart(): numLower ("+t+") must not be greater than the number of rows ("+i+").");if(!(e<=s))throw new Error("bandPart(): numUpper ("+e+") must not be greater than the number of columns ("+s+").");t<0&&(t=i),e<0&&(e=s);var u=Bt(0,i,1,"int32").reshape([-1,1]),l=Bt(0,s,1,"int32"),c=An(u,l),f=jt(c.lessEqual($(+t,"int32")),c.greaterEqual($(-e,"int32"))),h=ye([i,s],n.dtype);return kn(kr(n.reshape([-1,i,s])).map(function(d){return Sn(f,d,h)})).reshape(o)}}),op=T({gramSchmidt_:function(r){var t;if(Array.isArray(r)){t=!1,E(r!=null&&r.length>0,function(){return"Gram-Schmidt process: input must not be null, undefined, or empty"});for(var e=r[0].shape[0],n=function(u){E(r[u].shape[0]===e,function(){return"Gram-Schmidt: Non-unique lengths found in the input vectors: ("+r[u].shape[0]+" vs. "+e+")"})},o=1;o<r.length;++o)n(o)}else t=!0,r=Er(r,r.shape[0],0).map(function(u){return na(u,[0])});E(r.length<=r[0].shape[0],function(){return"Gram-Schmidt: Number of vectors ("+r.length+") exceeds number of dimensions ("+r[0].shape[0]+")."});var a=[],i=r,s=function(u){a.push(D.tidy(function(){var l=i[u];if(u>0)for(var c=0;c<u;++c){var f=Da(a[c].mulStrict(l)).mul(a[c]);l=l.sub(f)}return l.div(Oa(l,"euclidean"))}))};for(o=0;o<r.length;++o)s(o);return t?kn(a,0):a}}),ap=T({qr_:function(r,t){if(t===void 0&&(t=!1),r.rank<2)throw new Error("qr() requires input tensor to have a rank >= 2, but got rank "+r.rank);if(r.rank===2)return bi(r,t);var e=r.shape.slice(0,r.shape.length-2).reduce(function(i,s){return i*s}),n=kr(r.reshape([e,r.shape[r.shape.length-2],r.shape[r.shape.length-1]]),0),o=[],a=[];return n.forEach(function(i){var s=bi(i,t),u=s[0],l=s[1];o.push(u),a.push(l)}),[kn(o,0).reshape(r.shape),kn(a,0).reshape(r.shape)]}}),rf=Object.freeze({bandPart:rp,gramSchmidt:op,qr:ap});function Ur(r,t,e,n,o,a){n==null&&(n=.5),o==null&&(o=Number.NEGATIVE_INFINITY),a==null&&(a=0);var i=r.shape[0];return e=Math.min(e,i),E(0<=n&&n<=1,function(){return"iouThreshold must be in [0, 1], but was '"+n+"'"}),E(r.rank===2,function(){return"boxes must be a 2D tensor, but was of rank '"+r.rank+"'"}),E(r.shape[1]===4,function(){return"boxes must have 4 columns, but 2nd dimension was "+r.shape[1]}),E(t.rank===1,function(){return"scores must be a 1D tensor"}),E(t.shape[0]===i,function(){return"scores has incompatible shape with boxes. Expected "+i+", but was "+t.shape[0]}),E(0<=a&&a<=1,function(){return"softNmsSigma must be in [0, 1], but was '"+a+"'"}),{maxOutputSize:e,iouThreshold:n,scoreThreshold:o,softNmsSigma:a}}var ip=T({resizeBilinear_:function(r,t,e){e===void 0&&(e=!1);var n=C(r,"images","resizeBilinear");E(n.rank===3||n.rank===4,function(){return"Error in resizeBilinear: x must be rank 3 or 4, but got rank "+n.rank+"."}),E(t.length===2,function(){return"Error in resizeBilinear: new shape must 2D, but got shape "+t+"."});var o=n,a=!1;n.rank===3&&(a=!0,o=n.as4D(1,n.shape[0],n.shape[1],n.shape[2]));var i=t[0],s=t[1],u=D.runKernelFunc(function(l,c){return c([o]),l.resizeBilinear(o,i,s,e)},{x:o},function(l,c){return{x:function(){return D.runKernelFunc(function(f){return f.resizeBilinearBackprop(l,c[0],e)},{})}}},"ResizeBilinear",{alignCorners:e,newHeight:i,newWidth:s});return a?u.as3D(u.shape[1],u.shape[2],u.shape[3]):u}}),sp=T({resizeNearestNeighbor_:function(r,t,e){e===void 0&&(e=!1);var n=C(r,"images","resizeNearestNeighbor");E(n.rank===3||n.rank===4,function(){return"Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank "+n.rank+"."}),E(t.length===2,function(){return"Error in resizeNearestNeighbor: new shape must 2D, but got shape "+t+"."}),E(n.dtype==="float32"||n.dtype==="int32",function(){return"`images` must have `int32` or `float32` as dtype"});var o=n,a=!1;n.rank===3&&(a=!0,o=n.as4D(1,n.shape[0],n.shape[1],n.shape[2]));var i=t[0],s=t[1],u=D.runKernelFunc(function(l,c){return c([o]),l.resizeNearestNeighbor(o,i,s,e)},{batchImages:o},function(l,c){return{batchImages:function(){return D.runKernelFunc(function(f){return f.resizeNearestNeighborBackprop(l,c[0],e)},{})}}});return a?u.as3D(u.shape[1],u.shape[2],u.shape[3]):u}}),up=T({nonMaxSuppression_:function(r,t,e,n,o){n===void 0&&(n=.5),o===void 0&&(o=Number.NEGATIVE_INFINITY);var a=C(r,"boxes","nonMaxSuppression"),i=C(t,"scores","nonMaxSuppression"),s=Ur(a,i,e,n,o);e=s.maxOutputSize,n=s.iouThreshold,o=s.scoreThreshold;var u={maxOutputSize:e,iouThreshold:n,scoreThreshold:o};return D.runKernelFunc(function(l){return l.nonMaxSuppression(a,i,e,n,o)},{boxes:a,scores:i},null,"NonMaxSuppressionV3",u)}}),lp=function(r,t,e,n,o){return n===void 0&&(n=.5),o===void 0&&(o=Number.NEGATIVE_INFINITY),j(this,void 0,void 0,function(){var a,i,s,u,l,c,f;return X(this,function(h){switch(h.label){case 0:return a=C(r,"boxes","nonMaxSuppressionAsync"),i=C(t,"scores","nonMaxSuppressionAsync"),s=Ur(a,i,e,n,o),e=s.maxOutputSize,n=s.iouThreshold,o=s.scoreThreshold,[4,Promise.all([a.data(),i.data()])];case 1:return u=h.sent(),l=u[0],c=u[1],f=fa(l,c,e,n,o),a!==r&&a.dispose(),i!==t&&i.dispose(),[2,f]}})})},cp=T({nonMaxSuppressionWithScore_:function(r,t,e,n,o,a){n===void 0&&(n=.5),o===void 0&&(o=Number.NEGATIVE_INFINITY),a===void 0&&(a=0);var i=C(r,"boxes","nonMaxSuppression"),s=C(t,"scores","nonMaxSuppression"),u=Ur(i,s,e,n,o,a),l={maxOutputSize:e=u.maxOutputSize,iouThreshold:n=u.iouThreshold,scoreThreshold:o=u.scoreThreshold,softNmsSigma:a=u.softNmsSigma},c=D.runKernel("NonMaxSuppressionV5",{boxes:i,scores:s},l);return{selectedIndices:c[0],selectedScores:c[1]}}}),fp=function(r,t,e,n,o,a){return n===void 0&&(n=.5),o===void 0&&(o=Number.NEGATIVE_INFINITY),a===void 0&&(a=0),j(this,void 0,void 0,function(){var i,s,u,l,c,f,h;return X(this,function(d){switch(d.label){case 0:return i=C(r,"boxes","nonMaxSuppressionAsync"),s=C(t,"scores","nonMaxSuppressionAsync"),u=Ur(i,s,e,n,o,a),e=u.maxOutputSize,n=u.iouThreshold,o=u.scoreThreshold,a=u.softNmsSigma,[4,Promise.all([i.data(),s.data()])];case 1:return l=d.sent(),c=l[0],f=l[1],h=ha(c,f,e,n,o,a),i!==r&&i.dispose(),s!==t&&s.dispose(),[2,h]}})})},hp=T({cropAndResize_:function(r,t,e,n,o,a){var i=C(r,"image","cropAndResize"),s=C(t,"boxes","cropAndResize","float32"),u=C(e,"boxInd","cropAndResize","int32");o=o||"bilinear",a=a||0;var l=s.shape[0];return E(i.rank===4,function(){return"Error in cropAndResize: image must be rank 4,but got rank "+i.rank+"."}),E(s.rank===2&&s.shape[1]===4,function(){return"Error in cropAndResize: boxes must be have size ["+l+",4] but had shape "+s.shape+"."}),E(u.rank===1&&u.shape[0]===l,function(){return"Error in cropAndResize: boxInd must be have size ["+l+"] but had shape "+s.shape+"."}),E(n.length===2,function(){return"Error in cropAndResize: cropSize must be of length 2, but got length "+n.length+"."}),E(n[0]>=1&&n[1]>=1,function(){return"cropSize must be atleast [1,1], but was "+n}),E(o==="bilinear"||o==="nearest",function(){return"method must be bilinear or nearest, but was "+o}),D.runKernelFunc(function(c,f){return c.cropAndResize(i,s,u,n,o,a)},{images:i,boxes:s,boxInd:u},null,"CropAndResize",{method:o,extrapolationValue:a,cropSize:n})}}),of=Object.freeze({resizeBilinear:ip,resizeNearestNeighbor:sp,nonMaxSuppression:up,nonMaxSuppressionAsync:lp,nonMaxSuppressionWithScore:cp,nonMaxSuppressionWithScoreAsync:fp,cropAndResize:hp}),La=function(r,t){return!(r>0)||t==="linear"},Wa=function(r,t,e){if(e==null||e==="linear")return r;if(e==="relu")return r.mul(t.step());throw new Error("Gradient for activation "+e+" has not been implemented yet.")},Ua=function(r,t){var e=t,n=Ie(r.shape,t.shape);return n.length>0&&(e=e.sum(n)),e.reshape(r.shape)},za=function(r,t,e){if(t==="linear")return r;if(t==="relu")return Fa(r);if(t==="elu")return Ta(r);if(t==="relu6")return _a(r);if(t==="prelu")return Na(r,e);throw new Error("Unknown fused activation "+t+".")},dp=T({fusedMatMul_:function(r){var t,e=r.a,n=r.b,o=r.transposeA,a=o!==void 0&&o,i=r.transposeB,s=i!==void 0&&i,u=r.bias,l=r.activation,c=l===void 0?"linear":l,f=r.preluActivationWeights;if(La(D.state.gradientDepth,c)===!1){var h=Aa(e,n,a,s);return u!=null&&(h=qn(h,u)),za(h,c,f)}var d=C(e,"a","fused matMul"),p=C(n,"b","fused matMul");t=ve(d,p),d=t[0],p=t[1];var m=a?d.shape[d.rank-2]:d.shape[d.rank-1],v=s?p.shape[p.rank-1]:p.shape[p.rank-2],g=a?d.shape[d.rank-1]:d.shape[d.rank-2],y=s?p.shape[p.rank-2]:p.shape[p.rank-1],x=d.shape.slice(0,-2),b=p.shape.slice(0,-2),w=Y(x),R=Y(b);E(d.rank>=2&&p.rank>=2&&d.rank===p.rank,function(){return"Error in fused matMul: inputs must have the same rank of at least 2, got ranks "+d.rank+" and "+p.rank+"."}),E(Re(x,b),function(){return"Error in fused matMul: outer dimensions ("+x+") and ("+b+") of Tensors with shapes "+d.shape+" and "+p.shape+" must match."}),E(m===v,function(){return"Error in fused matMul: inner shapes ("+m+") and ("+v+") of Tensors with shapes "+d.shape+" and "+p.shape+" and transposeA="+a+" and transposeB="+s+" must match."});var A,k,I=d.shape.slice(0,-2).concat([g,y]),S=a?d.as3D(w,m,g):d.as3D(w,g,m),F=s?p.as3D(R,y,v):p.as3D(R,v,y);u!=null&&oe(I,(A=ve(A=C(u,"bias","fused matMul"),d)[0]).shape),f!=null&&(k=C(f,"prelu weights","fused matMul"));var N={a:S,b:F};u!=null&&(N.bias=A),f!=null&&(N.preluActivationWeights=k);var W=[S,F];return D.runKernelFunc(function(L,B){var V=L.fusedBatchMatMul({a:S,b:F,transposeA:a,transposeB:s,bias:A,activation:c,preluActivationWeights:k});return B([S,F,V]),V},N,function(L,B){var V=B[0],z=B[1],P=B[2],G=Wa(L,P,c),H={};return u!=null&&(H={bias:function(){return Ua(A,G)}}),Object.assign(a||s?!a&&s?{a:function(){return G.matMul(z,!1,!1)},b:function(){return G.matMul(V,!0,!1)}}:a&&!s?{a:function(){return z.matMul(G,!1,!0)},b:function(){return V.matMul(G,!1,!1)}}:{a:function(){return z.matMul(G,!0,!0)},b:function(){return G.matMul(V,!0,!0)}}:{a:function(){return G.matMul(z,!1,!0)},b:function(){return V.matMul(G,!0,!1)}},H)},"_FusedMatMul",{transposeA:a,transposeB:s,activation:c},W,[!0]).reshape(I)}}),pp=T({fusedConv2d_:function(r){var t=r.x,e=r.filter,n=r.strides,o=r.pad,a=r.dataFormat,i=a===void 0?"NHWC":a,s=r.dilations,u=s===void 0?[1,1]:s,l=r.dimRoundingMode,c=r.bias,f=r.activation,h=f===void 0?"linear":f,d=r.preluActivationWeights;if(h=h||"linear",La(D.state.gradientDepth,h)===!1){var p=gt(t,e,n,o,i,u,l);return c!=null&&(p=qn(p,c)),za(p,h,d)}var m=C(t,"x","conv2d"),v=C(e,"filter","conv2d"),g=m,y=!1;m.rank===3&&(y=!0,g=m.as4D(1,m.shape[0],m.shape[1],m.shape[2])),E(g.rank===4,function(){return"Error in fused conv2d: input must be rank 4, but got rank "+g.rank+"."}),E(v.rank===4,function(){return"Error in fused conv2d: filter must be rank 4, but got rank "+v.rank+"."}),l!=null&&E(we(o),function(){return"Error in fused conv2d: pad must be an integer when using, dimRoundingMode "+l+" but got pad "+o+"."}),E(g.shape[3]===v.shape[2],function(){return"Error in conv2d: depth of input ("+g.shape[3]+") must match input depth for filter "+v.shape[2]+"."}),E(Pe(n,u),function(){return"Error in conv2D: Either strides or dilations must be 1. Got strides "+n+" and dilations '"+u+"'"}),E(i==="NHWC",function(){return"Error in conv2d: got dataFormat of "+i+" but only NHWC is currently supported."});var x,b,w=Tn(g.shape,v.shape,n,u,o,l);c!=null&&(x=ve(x=C(c,"bias","fused conv2d"),m)[0],oe(w.outShape,x.shape)),d!=null&&(b=C(d,"prelu weights","fused conv2d"));var R={x:g,filter:v};c!=null&&(R.bias=x),d!=null&&(R.preluActivationWeights=b);var A=[v,g],k=D.runKernelFunc(function(I,S){var F=I.fusedConv2d({input:g,filter:v,convInfo:w,bias:x,activation:h,preluActivationWeights:b});return S([v,g,F]),F},R,function(I,S){var F=S,N=F[0],W=F[1],L=F[2],B=Wa(I,L,h);E(Hn(u),function(){return"Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '"+u+"'"});var V={};return c!=null&&(V={bias:function(){return Ua(x,B)}}),Object.assign({x:function(){return oc(W.shape,B,N,n,o)},filter:function(){return Sa(W,B,N.shape,n,o)}},V)},"FusedConv2D",{convInfo:w,activation:h},A,[!0]);return y?k.as3D(k.shape[1],k.shape[2],k.shape[3]):k}}),vp=T({fusedDepthwiseConv2d_:function(r){var t=r.x,e=r.filter,n=r.strides,o=r.pad,a=r.dataFormat,i=a===void 0?"NHWC":a,s=r.dilations,u=s===void 0?[1,1]:s,l=r.dimRoundingMode,c=r.bias,f=r.activation,h=f===void 0?"linear":f,d=r.preluActivationWeights;if(La(D.state.gradientDepth,h)===!1){var p=Mr(t,e,n,o,i,u,l);return c!=null&&(p=qn(p,c)),za(p,h,d)}var m=C(t,"x","depthwiseConv2d"),v=C(e,"filter","depthwiseConv2d"),g=m,y=!1;m.rank===3&&(y=!0,g=m.as4D(1,m.shape[0],m.shape[1],m.shape[2])),E(g.rank===4,function(){return"Error in fused depthwiseConv2d: input must be rank 4, but got rank "+g.rank+"."}),E(v.rank===4,function(){return"Error in fused depthwiseConv2d: filter must be rank 4, but got rank "+v.rank+"."}),E(g.shape[3]===v.shape[2],function(){return"Error in fused depthwiseConv2d: number of input channels ("+g.shape[3]+") must match the inChannels dimension in filter "+v.shape[2]+"."}),u==null&&(u=[1,1]),E(Pe(n,u),function(){return"Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides "+n+" and dilations '"+u+"'"}),l!=null&&E(we(o),function(){return"Error in fused depthwiseConv2d: pad must be an integer when using dimRoundingMode "+l+" but got pad "+o+"."});var x,b,w=Tn(g.shape,v.shape,n,u,o,l,!0);c!=null&&(x=ve(x=C(c,"bias","fused conv2d"),m)[0],oe(w.outShape,x.shape)),d!=null&&(b=C(d,"prelu weights","fused depthwiseConv2d"));var R={x:g,filter:v};c!=null&&(R.bias=x),d!=null&&(R.preluActivationWeights=b);var A=[v,g],k=D.runKernelFunc(function(I,S){var F=I.fusedDepthwiseConv2D({input:g,filter:v,convInfo:w,bias:x,activation:h,preluActivationWeights:b});return S([v,g,F]),F},R,function(I,S){E(Hn(u),function(){return"Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '"+u+"'"});var F=S[0],N=S[1],W=S[2],L=Wa(I,W,h),B={};return c!=null&&(B={bias:function(){return Ua(x,L)}}),Object.assign({x:function(){return ac(N.shape,L,F,w)},filter:function(){return ic(N,L,F.shape,w)}},B)},"FusedDepthwiseConv2D",{convInfo:w,activation:h},A,[!0]);return y?k.as3D(k.shape[1],k.shape[2],k.shape[3]):k}}),af=Object.freeze({matMul:dp,conv2d:pp,depthwiseConv2d:vp}),mp=Object.freeze({image:of,linalg:rf,losses:tf,spectral:Xc,fused:af,signal:ef,square:Lu,squaredDifference:ga,conv1d:tc,conv2d:gt,conv3d:rc,depthwiseConv2d:Mr,separableConv2d:sc,conv2dTranspose:uc,conv3dTranspose:lc,op:T,batchNormalization2d:bl,batchNormalization3d:wl,batchNormalization4d:Cl,batchNormalization:El,batchNorm:Rl,batchNorm2d:Il,batchNorm3d:kl,batchNorm4d:Sl,booleanMaskAsync:Zl,complex:Ae,real:Ve,imag:je,concat:Ye,concat1d:Ts,concat2d:Ns,concat3d:Fs,concat4d:_s,split:Er,matMul:Aa,dot:cc,outerProduct:fc,reverse:yt,reverse1d:hc,reverse2d:dc,reverse3d:pc,reverse4d:vc,maxPool:yc,avgPool:xc,pool:bc,maxPool3d:wc,avgPool3d:Cc,slice:mn,slice1d:Ec,slice2d:Rc,slice3d:Ic,slice4d:kc,abs:Wu,acos:Uu,acosh:zu,asin:Vu,asinh:Gu,atan:Hu,atanh:qu,ceil:Ku,clipByValue:ju,cos:Xu,cosh:Yu,erf:$u,exp:Qu,expm1:Ju,floor:Zu,log:el,log1p:nl,logSigmoid:tl,neg:ya,reciprocal:rl,round:ol,rsqrt:xa,sigmoid:al,sign:il,isNaN:sl,isInf:ul,isFinite:ll,sin:cl,sinh:fl,softplus:hl,sqrt:dl,step:pl,tan:vl,tanh:ml,all:Ac,any:Dc,argMax:Tc,argMin:Nc,logSumExp:Fc,max:_c,mean:Oc,min:Mc,moments:Bc,sum:Da,prod:Pc,equal:Ra,equalStrict:Gl,greater:Hl,greaterEqual:Ia,greaterEqualStrict:ql,greaterStrict:Kl,less:jl,lessEqual:Xl,lessEqualStrict:Yl,lessStrict:$l,notEqual:Ql,notEqualStrict:Jl,add:qn,addN:Tl,addStrict:Nl,atan2:Fl,div:Fr,divNoNan:_l,divStrict:Ol,floorDiv:Ca,maximum:_r,maximumStrict:Ml,minimum:Ea,minimumStrict:Bl,mod:Pl,modStrict:Ll,mul:Ln,mulStrict:Wl,pow:zt,powStrict:Ul,squaredDifferenceStrict:zl,sub:An,subStrict:Vl,elu:Ta,leakyRelu:Lc,prelu:Na,relu:Fa,relu6:_a,selu:Wc,logicalAnd:jt,logicalNot:Al,logicalOr:ba,logicalXor:Dl,where:Sn,whereAsync:wa,buffer:ee,print:Os,batchToSpaceND:Qo,broadcastTo:Ms,cast:Bs,clone:Ps,cumsum:Ls,depthToSpace:Ws,expandDims:hn,eye:Jo,multinomial:Us,oneHot:dr,pad:mt,pad1d:zs,pad2d:Vs,pad3d:Gs,pad4d:Hs,rand:qs,randomNormal:Ks,randomGamma:js,randomUniform:Zo,reshape:Ir,spaceToBatchND:ea,squeeze:na,stack:kn,tile:at,truncatedNormal:Xs,unstack:kr,setdiff1dAsync:Ys,fill:Cr,linspace:Ds,ones:jn,range:Bt,scalar:$,tensor:Ne,tensor1d:Gn,tensor2d:zn,tensor3d:Xo,tensor4d:bn,tensor5d:ks,tensor6d:Ss,variable:As,zeros:ye,onesLike:Yo,zerosLike:ue,transpose:Uc,softmax:Dr,logSoftmax:ou,localResponseNormalization:zc,norm:Oa,gather:Or,unsortedSegmentSum:ka,basicLSTMCell:Vc,multiRNNCell:Gc,movingAverage:Hc,stridedSlice:qc,topk:Kc,scatterND:jc,fft:Br,ifft:Vt,rfft:Pr,irfft:Ma,sparseToDense:Yc,gatherND:$c,diag:Qc,dropout:Jc,hannWindow:Lr,hammingWindow:Ba,frame:Wr,stft:Pa,inTopKAsync:nf});function U(r,t){Array.isArray(r)||(r=[r]),r.forEach(function(e){e!=null&&E(e.dtype!=="complex64",function(){return t+" does not support complex64 tensors."})})}function ro(r,t,e,n){if(e==="linear")return r.linear(t);if(e==="relu")return r.relu(t);if(e==="elu")return r.elu(t);if(e==="relu6")return r.relu6(t);if(e==="prelu")return r.prelu(t,n);throw new Error("Activation "+e+" has not been implemented for the CPU backend.")}var gp=function(r){function t(){var e=r.call(this)||this;return e.blockSize=48,e.firstUse=!0,e.data=new ia(e,D),e}return $e(t,r),t.prototype.write=function(e,n,o){this.firstUse&&(this.firstUse=!1,M().get("IS_NODE")&&hr(`
============================
Hi there 👋. Looks like you are running TensorFlow.js in Node.js. To speed things up dramatically, install our node backend, which binds to TensorFlow C++, by running npm i @tensorflow/tfjs-node, or npm i @tensorflow/tfjs-node-gpu if you have CUDA. Then call require('@tensorflow/tfjs-node'); (-gpu suffix for CUDA) at the start of your program. Visit https://github.com/tensorflow/tfjs-node for more details.
============================`));var a={};return this.data.set(a,{values:e,dtype:o}),a},t.prototype.move=function(e,n,o,a){this.data.set(e,{values:n,dtype:a})},t.prototype.numDataIds=function(){return this.data.numDataIds()},t.prototype.read=function(e){return j(this,void 0,void 0,function(){return X(this,function(n){return[2,this.readSync(e)]})})},t.prototype.readSync=function(e){var n=this.data.get(e),o=n.dtype,a=n.complexTensors;return o==="complex64"?Do(this.readSync(a.real.dataId),this.readSync(a.imag.dataId)):this.data.get(e).values},t.prototype.bufferSync=function(e){var n=this.readSync(e.dataId),o=n;if(e.dtype==="string")try{o=n.map(function(a){return Tt(a)})}catch{throw new Error("Failed to decode encoded string bytes into utf-8")}return ee(e.shape,e.dtype,o)},t.prototype.makeOutput=function(e,n,o){var a=this.write(e,n,o);return D.makeTensorFromDataId(a,n,o,this)},t.prototype.disposeData=function(e){if(this.data.has(e)){var n=this.data.get(e).complexTensors;n!=null&&(n.real.dispose(),n.imag.dispose()),this.data.delete(e)}},t.prototype.time=function(e){return j(this,void 0,void 0,function(){var n;return X(this,function(o){return n=Ke(),e(),[2,{kernelMs:Ke()-n}]})})},t.prototype.memory=function(){return{unreliable:!0,reasons:["The reported memory is an upper bound. Due to automatic garbage collection, the true allocated memory may be less."]}},t.prototype.complex=function(e,n){var o=this.makeOutput(null,e.shape,"complex64");return this.data.get(o.dataId).complexTensors={real:D.keep(e.clone()),imag:D.keep(n.clone())},o},t.prototype.real=function(e){return this.data.get(e.dataId).complexTensors.real.clone()},t.prototype.imag=function(e){return this.data.get(e.dataId).complexTensors.imag.clone()},t.prototype.slice=function(e,n,o){if(U(e,"slice"),oa(e.shape,n,o)){var a=aa(n,e.strides),i=Y(o);return Ne(this.readSync(e.dataId).subarray(a,a+i),o,e.dtype)}for(var s=ee(o,e.dtype),u=this.bufferSync(e),l=0;l<s.size;++l){var c=s.indexToLoc(l).map(function(f,h){return f+n[h]});s.values[l]=u.get.apply(u,c)}return s.toTensor()},t.prototype.stridedSlice=function(e,n,o,a){U(e,"stridedSlice");var i=Sr(n,o,a);if(i.some(function(d){return d===0}))return Ne([],i);for(var s=ee(i,e.dtype),u=this.bufferSync(e),l=0;l<s.size;l++){for(var c=s.indexToLoc(l),f=new Array(c.length),h=0;h<f.length;h++)f[h]=c[h]*a[h]+n[h];s.set.apply(s,[u.get.apply(u,f)].concat(c))}return s.toTensor()},t.prototype.diag=function(e){for(var n=this.readSync(e.dataId),o=ee([e.size,e.size],e.dtype),a=o.values,i=0;i<n.length;i++)a[i*e.size+i]=n[i];return o.toTensor()},t.prototype.unstack=function(e,n){for(var o=e.shape[n],a=new Array(e.rank-1),i=0,s=0;s<e.rank;s++)s!==n&&(a[i++]=e.shape[s]);var u=new Array(e.rank).fill(0),l=e.shape.slice();l[n]=1;var c=new Array(o);for(s=0;s<c.length;s++)u[n]=s,c[s]=this.slice(e,u,l).reshape(a);return c},t.prototype.reverse=function(e,n){U(e,"reverse");for(var o=ee(e.shape,e.dtype),a=this.bufferSync(e),i=function(u){var l=o.indexToLoc(u),c=l.slice();n.forEach(function(f){return c[f]=e.shape[f]-1-c[f]}),o.set.apply(o,[a.get.apply(a,c)].concat(l))},s=0;s<o.size;s++)i(s);return o.toTensor()},t.prototype.concat=function(e,n){var o=this;if(e[0].dtype==="complex64"){var a=e.map(function(d){return Ve(d)}),i=e.map(function(d){return je(d)});return Ae(this.concat(a,n),this.concat(i,n))}var s=e.map(function(d){var p=Y(d.shape.slice(n));return d.as2D(-1,p)}),u=Vn(s.map(function(d){return d.shape}),1),l=ee(u,e[0].dtype).values;if(s[0].shape[0]===1){var c=0;s.forEach(function(d){l.set(o.readSync(d.dataId),c),c+=d.size})}else{var f=0;s.forEach(function(d){for(var p=o.readSync(d.dataId),m=0,v=0;v<d.shape[0];++v)for(var g=v*u[1]+f,y=0;y<d.shape[1];++y)l[g+y]=p[m++];f+=d.shape[1]})}var h=Vn(e.map(function(d){return d.shape}),n);return Ne(l,h,e[0].dtype)},t.prototype.neg=function(e){return U(e,"neg"),this.multiply($(-1),e)},t.prototype.add=function(e,n){return e.dtype==="complex64"||n.dtype==="complex64"?this.broadcastedBinaryComplexOp(e.cast("complex64"),n.cast("complex64"),function(o,a,i,s){return{real:o+i,imag:a+s}}):this.broadcastedBinaryOp(e,n,De(e.dtype,n.dtype),function(o,a){return o+a})},t.prototype.addN=function(e){var n=this;U(e,"addN");for(var o=e.map(function(c){return n.readSync(c.dataId)}),a=ee(e[0].shape,e[0].dtype),i=a.values,s=0;s<e.length;s++)for(var u=o[s],l=0;l<i.length;l++)i[l]+=u[l];return a.toTensor()},t.prototype.softmax=function(e,n){var o=ke([n],e.shape),a=this.max(e,o),i=Be(a.shape,o),s=this.subtract(e,a.reshape(i)),u=this.exp(s),l=this.sum(u,o).reshape(i);return this.realDivide(u,l)},t.prototype.subtract=function(e,n){return e.dtype==="complex64"||n.dtype==="complex64"?this.broadcastedBinaryComplexOp(e.cast("complex64"),n.cast("complex64"),function(o,a,i,s){return{real:o-i,imag:a-s}}):this.broadcastedBinaryOp(e,n,De(e.dtype,n.dtype),function(o,a){return o-a})},t.prototype.pow=function(e,n){return U([e,n],"pow"),this.broadcastedBinaryOp(e,n,e.dtype,function(o,a){return Math.pow(o,a)})},t.prototype.batchMatMul=function(e,n,o,a){U([e,n],"matMul");for(var i=o?e.shape[1]:e.shape[2],s=o?e.shape[2]:e.shape[1],u=a?n.shape[1]:n.shape[2],l=e.shape[0],c=this.readSync(e.dataId),f=this.readSync(n.dataId),h=o?[e.strides[0],1,e.strides[1]]:[e.strides[0],e.strides[1],1],d=h[0],p=h[1],m=h[2],v=a?[1,n.strides[1],n.strides[0]]:[n.strides[1],1,n.strides[0]],g=v[0],y=v[1],x=v[2],b=s*u,w=ee([l,s,u],e.dtype),R=w.values,A=this.blockSize,k=0;k<l;k++)for(var I=0;I<s;I+=A)for(var S=0;S<u;S+=A)for(var F=0;F<i;F+=A)for(var N=Math.min(I+A,s),W=Math.min(S+A,u),L=Math.min(F+A,i),B=I;B<N;B++)for(var V=S;V<W;V++){for(var z=0,P=F;P<L;P++)z+=c[k*d+B*p+P*m]*f[P*g+V*y+k*x];R[k*b+(B*u+V)]+=z}return w.toTensor()},t.prototype.fusedBatchMatMul=function(e){var n=e.a,o=e.b,a=e.transposeA,i=e.transposeB,s=e.bias,u=e.activation,l=e.preluActivationWeights,c=this.batchMatMul(n,o,a,i);return s&&(c=this.add(c,s)),u&&(c=ro(this,c,u,l)),c},t.prototype.multiply=function(e,n){return e.dtype==="complex64"||n.dtype==="complex64"?this.broadcastedBinaryComplexOp(e.cast("complex64"),n.cast("complex64"),function(o,a,i,s){return{real:o*i-a*s,imag:o*s+a*i}}):this.broadcastedBinaryOp(e,n,De(e.dtype,n.dtype),function(o,a){return o*a})},t.prototype.realDivide=function(e,n){return U([e,n],"realDivide"),this.broadcastedBinaryOp(e,n,"float32",function(o,a){return o/a})},t.prototype.floorDiv=function(e,n){return U([e,n],"floorDiv"),this.broadcastedBinaryOp(e,n,"int32",function(o,a){return Math.floor(o/a)})},t.prototype.sum=function(e,n){U(e,"sum"),Le("sum",n,e.rank);for(var o=Te(e.shape,n),a=o[0],i=o[1],s=ye(a,De(e.dtype,"int32")),u=Y(i),l=this.readSync(s.dataId),c=this.readSync(e.dataId),f=0;f<l.length;++f){for(var h=f*u,d=0,p=0;p<u;++p)d+=c[h+p];l[f]=d}return s},t.prototype.prod=function(e,n){U(e,"sum");for(var o=Te(e.shape,n),a=o[0],i=o[1],s=ye(a,De(e.dtype,"int32")),u=Y(i),l=this.readSync(s.dataId),c=this.readSync(e.dataId),f=0;f<l.length;++f){for(var h=f*u,d=1,p=0;p<u;++p)d*=c[h+p];l[f]=d}return s},t.prototype.unsortedSegmentSum=function(e,n,o){U(e,"unsortedSegmentSum");for(var a=[],i=e.rank-n.rank,s=0;s<i;++s)n=n.expandDims(s+1);for(s=0;s<o;++s){var u=$(s,"int32"),l=Ra(u,n).asType("float32").mul(e).sum(0);a.push(l)}return kn(a)},t.prototype.argMin=function(e,n){U(e,"argMin");var o=[n];Le("argMin",o,e.rank);for(var a=Te(e.shape,o),i=a[0],s=a[1],u=ye(i,"int32"),l=Y(s),c=this.readSync(u.dataId),f=this.readSync(e.dataId),h=0;h<c.length;++h){for(var d=h*l,p=f[d],m=0,v=0;v<l;++v){var g=f[d+v];g<p&&(p=g,m=v)}c[h]=m}return u},t.prototype.argMax=function(e,n){U(e,"argMax");var o=[n];Le("argMax",o,e.rank);for(var a=Te(e.shape,o),i=a[0],s=a[1],u=ye(i,"int32"),l=Y(s),c=this.readSync(u.dataId),f=this.readSync(e.dataId),h=0;h<c.length;++h){for(var d=h*l,p=f[d],m=0,v=0;v<l;++v){var g=f[d+v];g>p&&(p=g,m=v)}c[h]=m}return u},t.prototype.cumsum=function(e,n,o,a){if(U(e,"cumsum"),n!==e.rank-1)throw new Error("backend.cumsum in CPU expects an inner-most axis="+(e.rank-1)+" but got axis="+n);for(var i=De(e.dtype,"int32"),s=ye(e.shape,i),u=this.readSync(s.dataId),l=this.readSync(e.dataId),c=e.shape[e.rank-1],f=a?function(v,g){return v+c-g-1}:function(v,g){return v+g},h=0;h<l.length;h+=c)for(var d=0;d<c;d++){var p=f(h,d);if(d===0)u[p]=o?0:l[p];else{var m=f(h,d-1);u[p]=o?l[m]+u[m]:l[p]+u[m]}}return s},t.prototype.equal=function(e,n){return U([e,n],"equal"),this.broadcastedBinaryOp(e,n,"bool",function(o,a){return o===a?1:0})},t.prototype.notEqual=function(e,n){return U([e,n],"notEqual"),this.broadcastedBinaryOp(e,n,"bool",function(o,a){return o!==a?1:0})},t.prototype.less=function(e,n){return U([e,n],"less"),this.broadcastedBinaryOp(e,n,"bool",function(o,a){return o<a?1:0})},t.prototype.lessEqual=function(e,n){return U([e,n],"lessEqual"),this.broadcastedBinaryOp(e,n,"bool",function(o,a){return o<=a?1:0})},t.prototype.greater=function(e,n){return U([e,n],"greater"),this.broadcastedBinaryOp(e,n,"bool",function(o,a){return o>a?1:0})},t.prototype.greaterEqual=function(e,n){return U([e,n],"greaterEqual"),this.broadcastedBinaryOp(e,n,"bool",function(o,a){return o>=a?1:0})},t.prototype.logicalNot=function(e){U(e,"logicalNot");for(var n=this.readSync(e.dataId),o=new Uint8Array(n.length),a=0;a<n.length;++a)o[a]=n[a]?0:1;return this.makeOutput(o,e.shape,"bool")},t.prototype.logicalAnd=function(e,n){return U([e,n],"logicalAnd"),this.broadcastedBinaryOp(e,n,"bool",function(o,a){return o&&a})},t.prototype.logicalOr=function(e,n){return U([e,n],"logicalOr"),this.broadcastedBinaryOp(e,n,"bool",function(o,a){return o||a})},t.prototype.select=function(e,n,o){U([e,n,o],"select");for(var a=this.readSync(e.dataId),i=this.readSync(n.dataId),s=this.readSync(o.dataId),u=ye(n.shape,De(n.dtype,o.dtype)),l=this.readSync(u.dataId),c=0,f=e.rank===0||e.rank>1||n.rank===1?1:Y(n.shape.slice(1)),h=0;h<a.length;h++)for(var d=0;d<f;d++)a[h]===1?l[c++]=i[h]:l[c++]=s[h];return u},t.prototype.where=function(e){U([e],"where");var n=this.readSync(e.dataId);return da(e.shape,n)},t.prototype.topk=function(e,n,o){return U(e,"topk"),uu(this.readSync(e.dataId),e.shape,e.dtype,n)},t.prototype.min=function(e,n){U(e,"min"),Le("min",n,e.rank);for(var o=Te(e.shape,n),a=o[0],i=o[1],s=ye(a,e.dtype),u=Y(i),l=this.readSync(s.dataId),c=this.readSync(e.dataId),f=0;f<l.length;++f){for(var h=f*u,d=c[h],p=0;p<u;++p){var m=c[h+p];m<d&&(d=m)}l[f]=d}return s},t.prototype.minimum=function(e,n){return U([e,n],"minimum"),this.broadcastedBinaryOp(e,n,e.dtype,function(o,a){return Math.min(o,a)})},t.prototype.mod=function(e,n){return U([e,n],"mod"),this.broadcastedBinaryOp(e,n,e.dtype,function(o,a){var i=o%a;return o<0&&a<0||o>=0&&a>=0?i:(i+a)%a})},t.prototype.max=function(e,n){U(e,"max"),Le("max",n,e.rank);for(var o=Te(e.shape,n),a=o[0],i=o[1],s=ye(a,e.dtype),u=Y(i),l=this.readSync(s.dataId),c=this.readSync(e.dataId),f=0;f<l.length;++f){for(var h=f*u,d=c[h],p=0;p<u;++p){var m=c[h+p];m>d&&(d=m)}l[f]=d}return s},t.prototype.maximum=function(e,n){return U([e,n],"maximum"),this.broadcastedBinaryOp(e,n,e.dtype,function(o,a){return Math.max(o,a)})},t.prototype.all=function(e,n){U(e,"all"),Le("all",n,e.rank);for(var o=Te(e.shape,n),a=o[0],i=o[1],s=ye(a,e.dtype),u=Y(i),l=this.readSync(s.dataId),c=this.readSync(e.dataId),f=0;f<l.length;++f){for(var h=f*u,d=c[h],p=0;p<u;++p){var m=c[h+p];d=d&&m}l[f]=d}return s},t.prototype.any=function(e,n){U(e,"any"),Le("any",n,e.rank);for(var o=Te(e.shape,n),a=o[0],i=o[1],s=ye(a,e.dtype),u=Y(i),l=this.readSync(s.dataId),c=this.readSync(e.dataId),f=0;f<l.length;++f){for(var h=f*u,d=c[h],p=0;p<u;++p){var m=c[h+p];d=d||m}l[f]=d}return s},t.prototype.squaredDifference=function(e,n){return U([e,n],"squaredDifference"),this.broadcastedBinaryOp(e,n,e.dtype,function(o,a){var i=o-a;return i*i})},t.prototype.ceil=function(e){U(e,"ceil");for(var n=this.readSync(e.dataId),o=new Float32Array(n.length),a=0;a<n.length;++a)o[a]=Math.ceil(n[a]);return this.makeOutput(o,e.shape,"float32")},t.prototype.floor=function(e){U(e,"floor");for(var n=this.readSync(e.dataId),o=new Float32Array(n.length),a=0;a<n.length;++a)o[a]=Math.floor(n[a]);return this.makeOutput(o,e.shape,"float32")},t.prototype.sign=function(e){U(e,"x");for(var n=this.readSync(e.dataId),o=new Float32Array(n.length),a=0;a<n.length;++a)n[a]<0?o[a]=-1:n[a]>0?o[a]=1:o[a]=0;return this.makeOutput(o,e.shape,"float32")},t.prototype.isNaN=function(e){U(e,"x");for(var n=this.readSync(e.dataId),o=new Uint8Array(n.length),a=0;a<n.length;++a)Number.isNaN(n[a])&&(o[a]=1);return this.makeOutput(o,e.shape,"bool")},t.prototype.isInf=function(e){U(e,"x");for(var n=this.readSync(e.dataId),o=new Uint8Array(n.length),a=0;a<n.length;++a)Math.abs(n[a])===1/0&&(o[a]=1);return this.makeOutput(o,e.shape,"bool")},t.prototype.isFinite=function(e){U(e,"x");for(var n=this.readSync(e.dataId),o=new Uint8Array(n.length),a=0;a<n.length;++a)Number.isFinite(n[a])&&(o[a]=1);return this.makeOutput(o,e.shape,"bool")},t.prototype.round=function(e){U(e,"round");for(var n=this.readSync(e.dataId),o=new Float32Array(n.length),a=0;a<n.length;++a){var i=Math.floor(n[a]);n[a]-i<.5?o[a]=Math.floor(n[a]):n[a]-i>.5?o[a]=Math.ceil(n[a]):o[a]=i%2==0?i:i+1}return this.makeOutput(o,e.shape,"float32")},t.prototype.exp=function(e){U(e,"exp");for(var n=this.readSync(e.dataId),o=new Float32Array(n.length),a=0;a<n.length;++a)o[a]=Math.exp(n[a]);return this.makeOutput(o,e.shape,"float32")},t.prototype.expm1=function(e){U(e,"expm1");for(var n=this.readSync(e.dataId),o=new Float32Array(n.length),a=0;a<n.length;++a)o[a]=Math.expm1(n[a]);return this.makeOutput(o,e.shape,"float32")},t.prototype.log=function(e){U(e,"log");for(var n=this.readSync(e.dataId),o=new Float32Array(n.length),a=0;a<n.length;++a){var i=n[a];o[a]=Math.log(i)}return this.makeOutput(o,e.shape,"float32")},t.prototype.log1p=function(e){U(e,"log1p");for(var n=this.readSync(e.dataId),o=new Float32Array(n.length),a=0;a<n.length;++a){var i=n[a];o[a]=Math.log1p(i)}return this.makeOutput(o,e.shape,"float32")},t.prototype.sqrt=function(e){U(e,"sqrt");for(var n=this.readSync(e.dataId),o=new Float32Array(n.length),a=0;a<n.length;++a){var i=n[a];o[a]=Math.sqrt(i)}return this.makeOutput(o,e.shape,"float32")},t.prototype.rsqrt=function(e){U(e,"rsqrt");for(var n=this.readSync(e.dataId),o=new Float32Array(n.length),a=0;a<n.length;++a){var i=n[a];o[a]=1/Math.sqrt(i)}return this.makeOutput(o,e.shape,"float32")},t.prototype.reciprocal=function(e){U(e,"reciprocal");for(var n=this.readSync(e.dataId),o=new Float32Array(n.length),a=0;a<n.length;++a)o[a]=1/n[a];return this.makeOutput(o,e.shape,"float32")},t.prototype.linear=function(e){return e},t.prototype.relu=function(e){U(e,"relu");for(var n=ye(e.shape,e.dtype),o=this.readSync(n.dataId),a=this.readSync(e.dataId),i=0;i<a.length;++i)o[i]=Math.max(0,a[i]);return n},t.prototype.relu6=function(e){U(e,"relu");for(var n=ye(e.shape,e.dtype),o=this.readSync(n.dataId),a=this.readSync(e.dataId),i=0;i<a.length;++i)o[i]=Math.min(Math.max(0,a[i]),6);return n},t.prototype.prelu=function(e,n){return U([e,n],"prelu"),this.broadcastedBinaryOp(e,n,e.dtype,function(o,a){return o<0?a*o:o})},t.prototype.elu=function(e){U(e,"elu");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a){var i=o[a];n[a]=i>=0?i:Math.exp(i)-1}return this.makeOutput(n,e.shape,"float32")},t.prototype.eluDer=function(e,n){U([e,n],"eluDer");for(var o=new Float32Array(n.size),a=this.readSync(n.dataId),i=this.readSync(e.dataId),s=0;s<a.length;++s){var u=a[s];o[s]=u>=1?i[s]:i[s]*(u+1)}return this.makeOutput(o,n.shape,"float32")},t.prototype.selu=function(e){U(e,"selu");for(var n=va,o=ma,a=new Float32Array(e.size),i=this.readSync(e.dataId),s=0;s<i.length;++s){var u=i[s];a[s]=u>=0?o*u:n*(Math.exp(u)-1)}return this.makeOutput(a,e.shape,"float32")},t.prototype.clip=function(e,n,o){U(e,"clip");for(var a=new Float32Array(e.size),i=this.readSync(e.dataId),s=0;s<i.length;++s){var u=i[s];a[s]=u>o?o:u<n?n:u}return this.makeOutput(a,e.shape,"float32")},t.prototype.abs=function(e){for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=Math.abs(o[a]);return this.makeOutput(n,e.shape,"float32")},t.prototype.complexAbs=function(e){for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<e.size;++a){var i=o[2*a],s=o[2*a+1];n[a]=Math.hypot(i,s)}return this.makeOutput(n,e.shape,"float32")},t.prototype.int=function(e){U(e,"int");for(var n=new Int32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=o[a];return this.makeOutput(n,e.shape,"int32")},t.prototype.sigmoid=function(e){U(e,"sigmoid");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=1/(1+Math.exp(-o[a]));return this.makeOutput(n,e.shape,"float32")},t.prototype.softplus=function(e){U(e,"softplus");for(var n=Math.log(11920928955078125e-23)+2,o=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i){var s=a[i]>-n,u=a[i]<n,l=Math.exp(a[i]),c=void 0;c=u?l:s?a[i]:Math.log(1+l),o[i]=c}return this.makeOutput(o,e.shape,"float32")},t.prototype.sin=function(e){U(e,"sin");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=Math.sin(o[a]);return this.makeOutput(n,e.shape,"float32")},t.prototype.cos=function(e){U(e,"cos");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=Math.cos(o[a]);return this.makeOutput(n,e.shape,"float32")},t.prototype.tan=function(e){U(e,"tan");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=Math.tan(o[a]);return this.makeOutput(n,e.shape,"float32")},t.prototype.asin=function(e){U(e,"asin");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=Math.asin(o[a]);return this.makeOutput(n,e.shape,"float32")},t.prototype.acos=function(e){U(e,"acos");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=Math.acos(o[a]);return this.makeOutput(n,e.shape,"float32")},t.prototype.atan=function(e){U(e,"atan");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=Math.atan(o[a]);return this.makeOutput(n,e.shape,"float32")},t.prototype.atan2=function(e,n){return U([e,n],"atan2"),this.broadcastedBinaryOp(e,n,e.dtype,function(o,a){return Math.atan2(o,a)})},t.prototype.sinh=function(e){U(e,"sinh");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=Math.sinh(o[a]);return this.makeOutput(n,e.shape,"float32")},t.prototype.cosh=function(e){U(e,"cosh");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=Math.cosh(o[a]);return this.makeOutput(n,e.shape,"float32")},t.prototype.tanh=function(e){U(e,"tanh");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=Li(o[a]);return this.makeOutput(n,e.shape,"float32")},t.prototype.asinh=function(e){U(e,"asinh");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=Math.asinh(o[a]);return this.makeOutput(n,e.shape,"float32")},t.prototype.acosh=function(e){U(e,"acosh");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=Math.acosh(o[a]);return this.makeOutput(n,e.shape,"float32")},t.prototype.atanh=function(e){U(e,"atanh");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a)n[a]=Math.atanh(o[a]);return this.makeOutput(n,e.shape,"float32")},t.prototype.erf=function(e){U(e,"erf");for(var n=new Float32Array(e.size),o=this.readSync(e.dataId),a=0;a<o.length;++a){var i=Math.sign(o[a]),s=Math.abs(o[a]),u=1/(1+.3275911*s);n[a]=i*(1-((((1.061405429*u-1.453152027)*u+1.421413741)*u-.284496736)*u+.254829592)*u*Math.exp(-s*s))}return this.makeOutput(n,e.shape,"float32")},t.prototype.step=function(e,n){n===void 0&&(n=0),U(e,"step");for(var o=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i){var s=a[i];isNaN(s)?o[i]=NaN:o[i]=s>0?1:n}return this.makeOutput(o,e.shape,"float32")},t.prototype.fusedConv2d=function(e){var n=e.input,o=e.filter,a=e.convInfo,i=e.bias,s=e.activation,u=e.preluActivationWeights,l=this.conv2d(n,o,a);return i&&(l=this.add(l,i)),s&&(l=ro(this,l,s,u)),l},t.prototype.conv2d=function(e,n,o){U([e,n],"conv2d");for(var a=o.filterHeight,i=o.filterWidth,s=o.dilationHeight,u=o.dilationWidth,l=o.padInfo.left,c=o.padInfo.top,f=o.dataFormat==="channelsLast",h=ee(o.outShape,e.dtype),d=e.strides[0],p=f?e.strides[1]:e.strides[2],m=f?e.strides[2]:1,v=f?1:e.strides[1],g=h.strides[0],y=f?h.strides[1]:h.strides[2],x=f?h.strides[2]:1,b=f?1:h.strides[1],w=this.readSync(e.dataId),R=this.readSync(n.dataId),A=h.values,k=0;k<o.batchSize;++k)for(var I=k*d,S=k*g,F=0;F<o.outHeight;++F)for(var N=S+F*y,W=F*o.strideHeight-c,L=0;L<a;L++){var B=W+L*s;if(!(B<0||B>=o.inHeight))for(var V=L*n.strides[0],z=I+B*p,P=0;P<o.outWidth;++P)for(var G=N+P*x,H=P*o.strideWidth-l,q=0;q<i;q++){var Q=H+q*u;if(!(Q<0||Q>=o.inWidth))for(var J=z+Q*m,te=V+q*n.strides[1],re=0;re<o.inChannels;++re){for(var ae=w[J+re*v],le=0;le<o.outChannels;++le)A[G+le*b]+=ae*R[te+le];te+=o.outChannels}}}return h.toTensor()},t.prototype.conv3d=function(e,n,o){for(var a=o.filterDepth,i=o.filterHeight,s=o.filterWidth,u=o.dilationDepth,l=o.dilationHeight,c=o.dilationWidth,f=o.padInfo.front,h=o.padInfo.left,d=o.padInfo.top,p=ee(o.outShape,e.dtype),m=this.readSync(e.dataId),v=this.readSync(n.dataId),g=p.values,y=0;y<o.batchSize;++y)for(var x=y*e.strides[0],b=y*p.strides[0],w=0;w<o.outDepth;++w)for(var R=b+w*p.strides[1],A=w*o.strideDepth-f,k=0;k<a;k++){var I=A+k*u;if(!(I<0||I>=o.inDepth))for(var S=k*n.strides[0],F=x+I*e.strides[1],N=0;N<o.outHeight;++N)for(var W=R+N*p.strides[2],L=N*o.strideHeight-d,B=0;B<i;B++){var V=L+B*l;if(!(V<0||V>=o.inHeight))for(var z=S+B*n.strides[1],P=F+V*e.strides[2],G=0;G<o.outWidth;++G)for(var H=W+G*o.outChannels,q=G*o.strideWidth-h,Q=0;Q<s;Q++){var J=q+Q*c;if(!(J<0||J>=o.inWidth))for(var te=z+Q*n.strides[2],re=P+J*o.inChannels,ae=te,le=0;le<o.inChannels;++le){for(var ie=m[re+le],ce=0;ce<o.outChannels;++ce)g[H+ce]+=ie*v[ae+ce];ae+=o.outChannels}}}}return p.toTensor()},t.prototype.conv2dDerInput=function(e,n,o){U([e,n],"conv2dDerInput");for(var a=ee(o.inShape,"float32"),i=a.values,s=this.readSync(e.dataId),u=this.readSync(n.dataId),l=n.strides,c=l[0],f=l[1],h=l[2],d=o.batchSize,p=o.filterHeight,m=o.filterWidth,v=o.inChannels,g=o.inHeight,y=o.inWidth,x=o.outChannels,b=o.outHeight,w=o.outWidth,R=o.strideHeight,A=o.strideWidth,k=o.dataFormat,I=p-1-o.padInfo.top,S=m-1-o.padInfo.left,F=k==="channelsLast",N=a.strides[0],W=F?a.strides[1]:a.strides[2],L=F?a.strides[2]:1,B=F?1:a.strides[1],V=e.strides[0],z=F?e.strides[1]:e.strides[2],P=F?e.strides[2]:1,G=F?1:e.strides[1],H=0;H<d;++H)for(var q=0;q<v;++q)for(var Q=0;Q<g;++Q)for(var J=Q-I,te=Math.max(0,Math.ceil(J/R)),re=Math.min(b,(p+J)/R),ae=0;ae<y;++ae){for(var le=ae-S,ie=Math.max(0,Math.ceil(le/A)),ce=Math.min(w,(m+le)/A),Ce=0,se=te;se<re;++se)for(var de=se*R-J,he=ie;he<ce;++he)for(var xe=V*H+z*se+P*he,me=c*(p-1-de)+f*(m-1-(he*A-le))+h*q,ge=0;ge<x;++ge)Ce+=s[xe+G*ge]*u[me+ge];i[N*H+W*Q+L*ae+B*q]=Ce}return a.toTensor()},t.prototype.conv3dDerInput=function(e,n,o){for(var a=ee(o.inShape,"float32"),i=a.values,s=a.strides,u=s[0],l=s[1],c=s[2],f=s[3],h=this.readSync(e.dataId),d=e.strides,p=d[0],m=d[1],v=d[2],g=d[3],y=this.readSync(n.dataId),x=n.strides,b=x[0],w=x[1],R=x[2],A=x[3],k=o.batchSize,I=o.filterDepth,S=o.filterHeight,F=o.filterWidth,N=o.inChannels,W=o.inDepth,L=o.inHeight,B=o.inWidth,V=o.outChannels,z=o.outDepth,P=o.outHeight,G=o.outWidth,H=o.strideDepth,q=o.strideHeight,Q=o.strideWidth,J=I-1-o.padInfo.front,te=S-1-o.padInfo.top,re=F-1-o.padInfo.left,ae=0;ae<k;++ae)for(var le=0;le<N;++le)for(var ie=0;ie<W;++ie)for(var ce=ie-J,Ce=Math.max(0,Math.ceil(ce/H)),se=Math.min(z,(I+ce)/H),de=0;de<L;++de)for(var he=de-te,xe=Math.max(0,Math.ceil(he/q)),me=Math.min(P,(S+he)/q),ge=0;ge<B;++ge){for(var en=ge-re,nn=Math.max(0,Math.ceil(en/Q)),Ue=Math.min(G,(F+en)/Q),Yn=0,sn=Ce;sn<se;++sn)for(var xn=sn*H-ce,un=xe;un<me;++un)for(var $n=un*q-he,ln=nn;ln<Ue;++ln)for(var Vr=p*ae+m*sn+v*un+g*ln,Qn=b*(I-1-xn)+w*(S-1-$n)+R*(F-1-(ln*Q-en))+A*le,tn=0;tn<V;++tn)Yn+=h[Vr+tn]*y[Qn+tn];i[u*ae+l*ie+c*de+f*ge+le]=Yn}return a.toTensor()},t.prototype.conv2dDerFilter=function(e,n,o){U([e,n],"conv2dDerFilter");for(var a=o.strideHeight,i=o.strideWidth,s=o.filterHeight,u=o.filterWidth,l=o.dataFormat==="channelsLast",c=ee(o.filterShape,"float32"),f=o.padInfo.left,h=o.padInfo.top,d=this.bufferSync(e),p=this.bufferSync(n),m=0;m<s;++m)for(var v=Math.max(0,Math.ceil((h-m)/a)),g=Math.min(o.outHeight,(o.inHeight+h-m)/a),y=0;y<u;++y)for(var x=Math.max(0,Math.ceil((f-y)/i)),b=Math.min(o.outWidth,(o.inWidth+f-y)/i),w=0;w<o.inChannels;++w)for(var R=0;R<o.outChannels;++R){for(var A=0,k=0;k<o.batchSize;++k)for(var I=v;I<g;++I)for(var S=m+I*a-h,F=x;F<b;++F){var N=y+F*i-f;A+=l?d.get(k,S,N,w)*p.get(k,I,F,R):d.get(k,w,S,N)*p.get(k,R,I,F)}c.set(A,m,y,w,R)}return c.toTensor()},t.prototype.conv3dDerFilter=function(e,n,o){for(var a=o.strideDepth,i=o.strideHeight,s=o.strideWidth,u=o.filterDepth,l=o.filterHeight,c=o.filterWidth,f=ee(o.filterShape,"float32"),h=f.values,d=f.strides,p=d[0],m=d[1],v=d[2],g=d[3],y=this.readSync(n.dataId),x=n.strides,b=x[0],w=x[1],R=x[2],A=x[3],k=this.readSync(e.dataId),I=e.strides,S=I[0],F=I[1],N=I[2],W=I[3],L=o.padInfo.front,B=o.padInfo.left,V=o.padInfo.top,z=0;z<u;++z)for(var P=Math.max(0,Math.ceil((L-z)/a)),G=Math.min(o.outDepth,(o.inDepth+L-z)/a),H=z*p,q=0;q<l;++q)for(var Q=Math.max(0,Math.ceil((V-q)/i)),J=Math.min(o.outHeight,(o.inHeight+V-q)/i),te=q*m+H,re=0;re<c;++re)for(var ae=Math.max(0,Math.ceil((B-re)/s)),le=Math.min(o.outWidth,(o.inWidth+B-re)/s),ie=re*v+te,ce=0;ce<o.inChannels;++ce)for(var Ce=ce*g+ie,se=0;se<o.outChannels;++se){for(var de=0,he=0;he<o.batchSize;++he)for(var xe=he*S,me=he*b,ge=P;ge<G;++ge)for(var en=(z+ge*a-L)*F+xe,nn=ge*w+me,Ue=Q;Ue<J;++Ue)for(var Yn=(q+Ue*i-V)*N+en,sn=Ue*R+nn,xn=ae;xn<le;++xn){var un=xn*A+sn;de+=k[(re+xn*s-B)*W+Yn+ce]*y[un+se]}h[Ce+se]=de}return f.toTensor()},t.prototype.fusedDepthwiseConv2D=function(e){var n=e.input,o=e.filter,a=e.convInfo,i=e.bias,s=e.activation,u=e.preluActivationWeights,l=this.depthwiseConv2D(n,o,a);return i&&(l=this.add(l,i)),s&&(l=ro(this,l,s,u)),l},t.prototype.depthwiseConv2D=function(e,n,o){U([e,n],"depthwiseConv2D");for(var a=o.filterHeight,i=o.filterWidth,s=o.dilationHeight,u=o.dilationWidth,l=o.padInfo.left,c=o.padInfo.top,f=o.outChannels/o.inChannels,h=ee(o.outShape,e.dtype),d=this.readSync(e.dataId),p=this.readSync(n.dataId),m=h.values,v=0;v<o.batchSize;++v)for(var g=v*e.strides[0],y=v*h.strides[0],x=0;x<o.outHeight;++x)for(var b=y+x*h.strides[1],w=x*o.strideHeight-l,R=0;R<a;++R){var A=w+R*s;if(!(A<0||A>=o.inHeight))for(var k=R*n.strides[0],I=g+A*e.strides[1],S=0;S<o.outWidth;++S)for(var F=b+S*h.strides[2],N=S*o.strideWidth-c,W=0;W<i;++W){var L=N+W*u;if(!(L<0||L>=o.inWidth))for(var B=k+W*n.strides[1],V=I+L*o.inChannels,z=F,P=B,G=0;G<o.inChannels;++G){for(var H=d[V+G],q=0;q<f;++q)m[z+q]+=H*p[P+q];z+=f,P+=f}}}return h.toTensor()},t.prototype.depthwiseConv2DDerInput=function(e,n,o){U([e,n],"depthwiseConv2DDerInput");for(var a=ee(o.inShape,"float32"),i=a.values,s=a.strides,u=s[0],l=s[1],c=s[2],f=this.readSync(e.dataId),h=e.strides,d=h[0],p=h[1],m=h[2],v=this.readSync(n.dataId),g=n.strides,y=g[0],x=g[1],b=g[2],w=o.batchSize,R=o.filterHeight,A=o.filterWidth,k=o.inChannels,I=o.inHeight,S=o.inWidth,F=o.outChannels,N=o.outHeight,W=o.outWidth,L=o.strideHeight,B=o.strideWidth,V=R-1-o.padInfo.top,z=A-1-o.padInfo.left,P=F/k,G=0;G<w;++G)for(var H=0;H<k;++H)for(var q=0;q<I;++q)for(var Q=q-V,J=Math.max(0,Math.ceil(Q/L)),te=Math.min(N,(R+Q)/L),re=0;re<S;++re){for(var ae=re-z,le=Math.max(0,Math.ceil(ae/B)),ie=Math.min(W,(A+ae)/B),ce=0,Ce=J;Ce<te;++Ce)for(var se=Ce*L-Q,de=le;de<ie;++de)for(var he=d*G+p*Ce+m*de,xe=y*(R-1-se)+x*(A-1-(de*B-ae))+b*H,me=0;me<P;++me)ce+=f[he+(H*P+me)]*v[xe+me];i[u*G+l*q+c*re+H]=ce}return a.toTensor()},t.prototype.depthwiseConv2DDerFilter=function(e,n,o){U([e,n],"depthwiseConv2DDerFilter");for(var a=o.strideHeight,i=o.strideWidth,s=o.filterHeight,u=o.filterWidth,l=ee(o.filterShape,"float32"),c=o.padInfo.left,f=o.padInfo.top,h=o.outChannels/o.inChannels,d=this.bufferSync(e),p=this.bufferSync(n),m=0;m<s;++m)for(var v=Math.max(0,Math.ceil((f-m)/a)),g=Math.min(o.outHeight,(o.inHeight+f-m)/a),y=0;y<u;++y)for(var x=Math.max(0,Math.ceil((c-y)/i)),b=Math.min(o.outWidth,(o.inWidth+c-y)/i),w=0;w<o.outChannels;++w){for(var R=Math.trunc(w/h),A=w%h,k=0,I=0;I<o.batchSize;++I)for(var S=v;S<g;++S)for(var F=m+S*a-f,N=x;N<b;++N){var W=y+N*i-c;k+=d.get(I,F,W,R)*p.get(I,S,N,w)}l.set(k,m,y,R,A)}return l.toTensor()},t.prototype.tile=function(e,n){return U(e,"tile"),su(this.bufferSync(e),n)},t.prototype.pad=function(e,n,o){U(e,"pad");var a=n.map(function(h,d){return h[0]+e.shape[d]+h[1]}),i=n.map(function(h){return h[0]}),s=this.bufferSync(e),u=ee(a,e.dtype);o!==0&&u.values.fill(o);for(var l=0;l<e.size;l++){var c=s.indexToLoc(l),f=c.map(function(h,d){return h+i[d]});u.set.apply(u,[s.get.apply(s,c)].concat(f))}return u.toTensor()},t.prototype.transpose=function(e,n){U(e,"transpose");for(var o=new Array(e.rank),a=0;a<o.length;a++)o[a]=e.shape[n[a]];var i=this.readSync(e.dataId),s=ee(o,e.dtype),u=this.bufferSync(e);for(a=0;a<e.size;++a){for(var l=u.indexToLoc(a),c=new Array(l.length),f=0;f<c.length;f++)c[f]=l[n[f]];var h=s.locToIndex(c);s.values[h]=i[a]}return s.toTensor()},t.prototype.gather=function(e,n,o){U([e,n],"gather");var a=e.shape.slice(),i=this.readSync(n.dataId);a[o]=i.length;for(var s=ee(a,e.dtype),u=this.bufferSync(e),l=0;l<s.size;++l){var c=s.indexToLoc(l),f=c.slice();f[o]=i[c[o]];var h=u.locToIndex(f);s.values[l]=u.values[h]}return s.toTensor()},t.prototype.batchToSpaceND=function(e,n,o){U([e],"batchToSpaceND");var a=n.reduce(function(f,h){return f*h}),i=pr(e.shape,n,a),s=vr(i.length,n.length),u=mr(e.shape,n,a),l=$s(o,n.length),c=Qs(u,o,n.length);return e.reshape(i).transpose(s).reshape(u).slice(l,c)},t.prototype.spaceToBatchND=function(e,n,o){U([e],"spaceToBatchND");var a=n.reduce(function(h,d){return h*d}),i=[[0,0]];i.push.apply(i,o);for(var s=1+n.length;s<e.shape.length;++s)i.push([0,0]);var u=e.pad(i),l=pr(u.shape,n,a,!1),c=vr(l.length,n.length,!1),f=mr(u.shape,n,a,!1);return u.reshape(l).transpose(c).reshape(f)},t.prototype.pool=function(e,n,o){U(e,"pool");for(var a=n.strideHeight,i=n.strideWidth,s=n.dilationHeight,u=n.dilationWidth,l=n.effectiveFilterHeight,c=n.effectiveFilterWidth,f=n.padInfo.top,h=n.padInfo.left,d=o==="max"?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,p=this.readSync(e.dataId),m=ee(n.outShape,e.dtype),v=m.values,g=n.outShape[1]*n.outShape[2]*n.outShape[3],y=n.outShape[2]*n.outShape[3],x=n.outShape[3],b=0;b<n.batchSize;++b)for(var w=b*g,R=b*e.strides[0],A=0;A<n.inChannels;++A)for(var k=0;k<n.outHeight;++k)for(var I=k*a-f,S=Math.max(0,I),F=Math.min(n.inHeight,l+I),N=w+k*y,W=0;W<n.outWidth;++W){for(var L=W*i-h,B=Math.max(0,L),V=Math.min(n.inWidth,c+L),z=d,P=0,G=0,H=S;H<F;H+=s){for(var q=R+H*e.strides[1],Q=B;Q<V;Q+=u){var J=p[q+Q*e.strides[2]+A];o==="max"&&J>z?z=J:o==="avg"&&(P+=J,G++)}if(isNaN(z))break}v[N+W*x+A]=o==="avg"?P/G:z}return m.toTensor()},t.prototype.maxPool=function(e,n){return this.pool(e,n,"max")},t.prototype.maxPoolPositions=function(e,n){for(var o=ee(n.outShape,"int32"),a=n.strideHeight,i=n.strideWidth,s=n.dilationHeight,u=n.dilationWidth,l=n.effectiveFilterHeight,c=n.effectiveFilterWidth,f=n.padInfo.top,h=n.padInfo.left,d=this.bufferSync(e),p=0;p<n.batchSize;++p)for(var m=0;m<n.inChannels;++m)for(var v=0;v<n.outHeight;++v){for(var g=v*a-f,y=g;y<0;)y+=s;for(var x=Math.min(n.inHeight,l+g),b=0;b<n.outWidth;++b){for(var w=b*i-h,R=w;R<0;)R+=u;for(var A=Math.min(n.inWidth,c+w),k=Number.NEGATIVE_INFINITY,I=-1,S=y;S<x;S+=s)for(var F=S-g,N=R;N<A;N+=u){var W=N-w,L=d.get(p,S,N,m);L>k&&(k=L,I=F*c+W)}o.set(I,p,v,b,m)}}return o.toTensor()},t.prototype.maxPoolBackprop=function(e,n,o,a){U([n,o],"maxPoolBackprop");for(var i=this.maxPoolPositions(n,a),s=a.strideHeight,u=a.strideWidth,l=a.dilationHeight,c=a.dilationWidth,f=a.effectiveFilterHeight,h=a.effectiveFilterWidth,d=h-1-a.padInfo.left,p=f-1-a.padInfo.top,m=ee(n.shape,"float32"),v=this.bufferSync(i),g=this.bufferSync(e),y=0;y<a.batchSize;++y)for(var x=0;x<a.inChannels;++x)for(var b=0;b<a.inHeight;++b)for(var w=0;w<a.inWidth;++w){for(var R=b-p,A=w-d,k=0,I=0;I<f;I+=l){var S=(R+I)/s;if(!(S<0||S>=a.outHeight||Math.floor(S)!==S))for(var F=0;F<h;F+=c){var N=(A+F)/u;if(!(N<0||N>=a.outWidth||Math.floor(N)!==N)){var W=f*h-1-v.get(y,S,N,x)===I*h+F?1:0;W!==0&&(k+=g.get(y,S,N,x)*W)}}}m.set(k,y,b,w,x)}return m.toTensor()},t.prototype.avgPoolBackprop=function(e,n,o){U([e,n],"avgPoolBackprop");for(var a=o.strideHeight,i=o.strideWidth,s=o.filterHeight,u=o.filterWidth,l=o.dilationHeight,c=o.dilationWidth,f=o.effectiveFilterHeight,h=o.effectiveFilterWidth,d=h-1-o.padInfo.left,p=f-1-o.padInfo.top,m=ee(n.shape,"float32"),v=1/(s*u),g=this.bufferSync(e),y=0;y<o.batchSize;++y)for(var x=0;x<o.inChannels;++x)for(var b=0;b<o.inHeight;++b)for(var w=0;w<o.inWidth;++w){for(var R=b-p,A=w-d,k=0,I=0;I<f;I+=l){var S=(R+I)/a;if(!(S<0||S>=o.outHeight||Math.floor(S)!==S))for(var F=0;F<h;F+=c){var N=(A+F)/i;N<0||N>=o.outWidth||Math.floor(N)!==N||(k+=g.get(y,S,N,x))}}m.set(k*v,y,b,w,x)}return m.toTensor()},t.prototype.pool3d=function(e,n,o){U(e,"pool3d");for(var a=n.strideDepth,i=n.strideHeight,s=n.strideWidth,u=n.dilationDepth,l=n.dilationHeight,c=n.dilationWidth,f=n.effectiveFilterDepth,h=n.effectiveFilterHeight,d=n.effectiveFilterWidth,p=n.padInfo.front,m=n.padInfo.top,v=n.padInfo.left,g=o==="max"?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,y=this.readSync(e.dataId),x=ee(n.outShape,e.dtype),b=x.values,w=n.outShape[1]*n.outShape[2]*n.outShape[3]*n.outShape[4],R=n.outShape[2]*n.outShape[3]*n.outShape[4],A=n.outShape[3]*n.outShape[4],k=n.outShape[4],I=0;I<n.batchSize;++I)for(var S=I*w,F=I*e.strides[0],N=0;N<n.inChannels;++N)for(var W=0;W<n.outDepth;++W){for(var L=W*a-p,B=L;B<0;)B+=u;for(var V=Math.min(n.inDepth,f+L),z=S+W*R,P=0;P<n.outHeight;++P){for(var G=P*i-m,H=G;H<0;)H+=l;for(var q=Math.min(n.inHeight,h+G),Q=z+P*A,J=0;J<n.outWidth;++J){for(var te=J*s-v,re=te;re<0;)re+=c;for(var ae=Math.min(n.inWidth,d+te),le=Q+J*k,ie=g,ce=0,Ce=0,se=B;se<V;se+=u){for(var de=F+se*e.strides[1],he=H;he<q;he+=l){for(var xe=de+he*e.strides[2],me=re;me<ae;me+=c){var ge=y[xe+me*e.strides[3]+N];if(o==="max"&&ge>ie?ie=ge:o==="avg"&&(ce+=ge,Ce++),isNaN(ie))break}if(isNaN(ie))break}if(isNaN(ie))break}b[le+N]=o==="avg"?ce/Ce:ie}}}return x.toTensor()},t.prototype.avgPool3d=function(e,n){return U(e,"avgPool3d"),this.pool3d(e,n,"avg").toFloat()},t.prototype.avgPool3dBackprop=function(e,n,o){U([e,n],"avgPool3dBackprop");for(var a=o.strideDepth,i=o.strideHeight,s=o.strideWidth,u=o.filterDepth,l=o.filterHeight,c=o.filterWidth,f=o.dilationDepth,h=o.dilationHeight,d=o.dilationWidth,p=o.effectiveFilterDepth,m=o.effectiveFilterHeight,v=o.effectiveFilterWidth,g=p-1-o.padInfo.front,y=v-1-o.padInfo.left,x=m-1-o.padInfo.top,b=ee(n.shape,"float32"),w=1/(u*l*c),R=this.bufferSync(e),A=0;A<o.batchSize;++A)for(var k=0;k<o.inChannels;++k)for(var I=0;I<o.inDepth;++I)for(var S=0;S<o.inHeight;++S)for(var F=0;F<o.inWidth;++F){for(var N=I-g,W=S-x,L=F-y,B=0,V=0;V<p;V+=f){var z=(N+V)/a;if(!(z<0||z>=o.outDepth||Math.floor(z)!==z))for(var P=0;P<m;P+=h){var G=(W+P)/i;if(!(G<0||G>=o.outHeight||Math.floor(G)!==G))for(var H=0;H<v;H+=d){var q=(L+H)/s;q<0||q>=o.outWidth||Math.floor(q)!==q||(B+=R.get(A,z,G,q,k))}}}b.set(B*w,A,I,S,F,k)}return b.toTensor()},t.prototype.maxPool3d=function(e,n){return U(e,"maxPool3d"),this.pool3d(e,n,"max").toFloat()},t.prototype.maxPool3dPositions=function(e,n){for(var o=ee(n.outShape,"int32"),a=n.strideDepth,i=n.strideHeight,s=n.strideWidth,u=n.dilationDepth,l=n.dilationHeight,c=n.dilationWidth,f=n.effectiveFilterDepth,h=n.effectiveFilterHeight,d=n.effectiveFilterWidth,p=n.padInfo.front,m=n.padInfo.top,v=n.padInfo.left,g=this.bufferSync(e),y=0;y<n.batchSize;++y)for(var x=0;x<n.inChannels;++x)for(var b=0;b<n.outDepth;++b){for(var w=b*a-p,R=w;R<0;)R+=u;for(var A=Math.min(n.inDepth,f+w),k=0;k<n.outHeight;++k){for(var I=k*i-m,S=I;S<0;)S+=l;for(var F=Math.min(n.inHeight,h+I),N=0;N<n.outWidth;++N){for(var W=N*s-v,L=W;L<0;)L+=c;for(var B=Math.min(n.inWidth,d+W),V=Number.NEGATIVE_INFINITY,z=-1,P=R;P<A;P+=u)for(var G=P-w,H=S;H<F;H+=l)for(var q=H-I,Q=L;Q<B;Q+=c){var J=Q-W,te=g.get(y,P,H,Q,x);te>=V&&(V=te,z=G*h*d+q*h+J)}o.set(z,y,b,k,N,x)}}}return o.toTensor()},t.prototype.maxPool3dBackprop=function(e,n,o,a){U([n,o],"maxPool3dBackprop");for(var i=this.maxPool3dPositions(n,a),s=a.strideDepth,u=a.strideHeight,l=a.strideWidth,c=a.dilationDepth,f=a.dilationHeight,h=a.dilationWidth,d=a.effectiveFilterDepth,p=a.effectiveFilterHeight,m=a.effectiveFilterWidth,v=d-1-a.padInfo.front,g=m-1-a.padInfo.left,y=p-1-a.padInfo.top,x=ee(n.shape,"float32"),b=this.bufferSync(i),w=this.bufferSync(e),R=0;R<a.batchSize;++R)for(var A=0;A<a.inChannels;++A)for(var k=0;k<a.inDepth;++k)for(var I=0;I<a.inHeight;++I)for(var S=0;S<a.inWidth;++S){for(var F=k-v,N=I-y,W=S-g,L=0,B=0;B<d;B+=c){var V=(F+B)/s;if(!(V<0||V>=a.outDepth||Math.floor(V)!==V))for(var z=0;z<p;z+=f){var P=(N+z)/u;if(!(P<0||P>=a.outHeight||Math.floor(P)!==P))for(var G=0;G<m;G+=h){var H=(W+G)/l;if(!(H<0||H>=a.outWidth||Math.floor(H)!==H)){var q=d*p*m-1-b.get(R,V,P,H,A)===B*p*m+z*m+G?1:0;q!==0&&(L+=w.get(R,V,P,H,A)*q)}}}}x.set(L,R,k,I,S,A)}return x.toTensor()},t.prototype.cast=function(e,n){return la(e,n,this)},t.prototype.reshape=function(e,n){return yr(e,n)},t.prototype.avgPool=function(e,n){return U(e,"avgPool"),this.pool(e,n,"avg").toFloat()},t.prototype.resizeBilinear=function(e,n,o,a){U(e,"resizeBilinear");for(var i=e.shape,s=i[0],u=i[1],l=i[2],c=i[3],f=this.readSync(e.dataId),h=new Float32Array(Y([s,n,o,c])),d=[a&&n>1?u-1:u,a&&o>1?l-1:l],p=[a&&n>1?n-1:n,a&&o>1?o-1:o],m=0,v=d[0]/p[0],g=d[1]/p[1],y=0;y<s;y++)for(var x=0;x<n;x++)for(var b=v*x,w=Math.floor(b),R=b-w,A=Math.min(u-1,Math.ceil(b)),k=y*e.strides[0]+w*e.strides[1],I=y*e.strides[0]+A*e.strides[1],S=0;S<o;S++)for(var F=g*S,N=Math.floor(F),W=F-N,L=Math.min(l-1,Math.ceil(F)),B=k+N*e.strides[2],V=I+N*e.strides[2],z=k+L*e.strides[2],P=I+L*e.strides[2],G=0;G<c;G++){var H=f[B+G],q=f[V+G],Q=H+(f[z+G]-H)*W,J=Q+(q+(f[P+G]-q)*W-Q)*R;h[m++]=J}return Ne(h,[s,n,o,c])},t.prototype.resizeBilinearBackprop=function(e,n,o){U([e,n],"resizeBilinearBackprop");for(var a=n.shape,i=a[0],s=a[1],u=a[2],l=a[3],c=e.shape,f=c[1],h=c[2],d=new Float32Array(i*s*u*l),p=[o&&f>1?s-1:s,o&&h>1?u-1:u],m=[o&&f>1?f-1:f,o&&h>1?h-1:h],v=p[0]/m[0],g=p[1]/m[1],y=this.readSync(e.dataId),x=0,b=0;b<i;b++)for(var w=b*n.strides[0],R=0;R<f;R++)for(var A=R*v,k=Math.floor(A),I=Math.min(Math.ceil(A),s-1),S=w+k*n.strides[1],F=w+I*n.strides[1],N=A-k,W=1-N,L=0;L<h;L++)for(var B=L*g,V=Math.floor(B),z=Math.min(Math.ceil(B),u-1),P=B-V,G=1-P,H=S+V*n.strides[2],q=S+z*n.strides[2],Q=F+V*n.strides[2],J=F+z*n.strides[2],te=W*G,re=W*P,ae=N*G,le=N*P,ie=0;ie<l;ie++){var ce=y[x++];d[H+ie]+=ce*te,d[q+ie]+=ce*re,d[Q+ie]+=ce*ae,d[J+ie]+=ce*le}return bn(d,[i,u,s,l],n.dtype)},t.prototype.resizeNearestNeighbor=function(e,n,o,a){U(e,"resizeNearestNeighbor");for(var i=e.shape,s=i[0],u=i[1],l=i[2],c=i[3],f=this.readSync(e.dataId),h=new Float32Array(s*n*o*c),d=[a&&n>1?u-1:u,a&&o>1?l-1:l],p=[a&&n>1?n-1:n,a&&o>1?o-1:o],m=d[0]/p[0],v=d[1]/p[1],g=0,y=0;y<s;y++)for(var x=y*e.strides[0],b=0;b<n;b++)for(var w=m*b,R=x+Math.min(u-1,a?Math.round(w):Math.floor(w))*e.strides[1],A=0;A<o;A++)for(var k=v*A,I=R+Math.min(l-1,a?Math.round(k):Math.floor(k))*e.strides[2],S=0;S<c;S++){var F=f[I+S];h[g++]=F}return Ne(h,[s,n,o,c],e.dtype)},t.prototype.resizeNearestNeighborBackprop=function(e,n,o){U([e,n],"resizeNearestNeighborBackprop");for(var a=n.shape,i=a[0],s=a[1],u=a[2],l=a[3],c=e.shape,f=c[1],h=c[2],d=new Float32Array(i*s*u*l),p=this.readSync(e.dataId),m=[o&&f>1?s-1:s,o&&h>1?u-1:u],v=[o&&f>1?f-1:f,o&&h>1?h-1:h],g=m[0]/v[0],y=m[1]/v[1],x=1/g,b=1/y,w=2*Math.ceil(x)+2,R=2*Math.ceil(b)+2,A=0;A<i;A++)for(var k=A*n.strides[0],I=0;I<s;I++)for(var S=k+I*n.strides[1],F=Math.floor(I*x),N=Math.floor(F-w/2),W=0;W<u;W++)for(var L=S+W*n.strides[2],B=Math.floor(W*b),V=Math.floor(B-R/2),z=0;z<l;z++){for(var P=0,G=0;G<w;G++){var H=G+N;if(!(H<0||H>=f)){var q=k+H*e.strides[1],Q=H*g;if(I===Math.min(s-1,o?Math.round(Q):Math.floor(Q)))for(var J=0;J<R;J++){var te=J+V;if(!(te<0||te>=h)){var re=q+te*e.strides[2],ae=te*y;W===Math.min(u-1,o?Math.round(ae):Math.floor(ae))&&(P+=p[re+z])}}}}d[L+z]=P}return bn(d,n.shape,n.dtype)},t.prototype.batchNormalization=function(e,n,o,a,i,s){U([e,n,o,i,s],"batchNorm");for(var u=this.readSync(e.dataId),l=this.readSync(n.dataId),c=this.readSync(o.dataId),f=i?this.readSync(i.dataId):new Float32Array([1]),h=s?this.readSync(s.dataId):new Float32Array([0]),d=new Float32Array(u.length),p=h.length,m=f.length,v=c.length,g=l.length,y=0,x=0,b=0,w=0,R=0;R<u.length;++R)d[R]=h[y++]+(u[R]-l[x++])*f[b++]/Math.sqrt(c[w++]+a),y>=p&&(y=0),x>=g&&(x=0),b>=m&&(b=0),w>=v&&(w=0);return bn(d,e.shape)},t.prototype.localResponseNormalization4D=function(e,n,o,a,i){U(e,"localResponseNormalization4D");var s=e.shape[3],u=s-1,l=this.readSync(e.dataId),c=e.size,f=new Float32Array(c);function h(v){for(var g=v%s,y=v-g+Math.max(0,g-n),x=v-g+Math.min(g+n,u),b=0;y<=x;y++){var w=l[y];b+=w*w}return b}for(var d=0;d<c;d++){var p=h(d),m=l[d]*Math.pow(o+a*p,-i);f[d]=m}return bn(f,e.shape)},t.prototype.LRNGrad=function(e,n,o,a,i,s,u){U(e,"LRNGrad");for(var l=e.shape[3],c=this.readSync(e.dataId),f=this.readSync(n.dataId),h=this.readSync(o.dataId),d=new Float32Array(e.size),p=e.size,m=0;m<p;m++){for(var v=m%l,g=m-v+Math.max(0,v-a),y=m-v+Math.min(l,v+a+1),x=0,b=g;b<y;b++)x+=Math.pow(f[b],2);for(x=s*x+i,b=g;b<y;b++){var w=-2*s*u*f[b]*h[m]/x;m===b&&(w+=Math.pow(x,-u)),w*=c[m],d[b]+=w}}return bn(d,e.shape)},t.prototype.multinomial=function(e,n,o,a){U(e,"multinomial");for(var i=n?e:Dr(e),s=i.shape[0],u=i.shape[1],l=ye([s,o],"int32"),c=this.readSync(l.dataId),f=this.readSync(i.dataId),h=0;h<s;++h){var d=h*u,p=new Float32Array(u-1);p[0]=f[d];for(var m=1;m<p.length;++m)p[m]=p[m-1]+f[d+m];for(var v=Rr(a.toString()),g=h*o,y=0;y<o;++y){var x=v();c[g+y]=p.length;for(var b=0;b<p.length;b++)if(x<p[b]){c[g+y]=b;break}}}return l},t.prototype.oneHot=function(e,n,o,a){U(e,"oneHot");var i=new Float32Array(e.size*n);i.fill(a);for(var s=this.readSync(e.dataId),u=0;u<e.size;++u)s[u]>=0&&s[u]<n&&(i[u*n+s[u]]=o);return zn(i,[e.size,n],"int32")},t.prototype.nonMaxSuppression=function(e,n,o,a,i){return U(e,"nonMaxSuppression"),fa(this.readSync(e.dataId),this.readSync(n.dataId),o,a,i)},t.prototype.fft=function(e){return this.fftBatch(e,!1)},t.prototype.ifft=function(e){return this.fftBatch(e,!0)},t.prototype.fftBatch=function(e,n){for(var o=e.shape[0],a=e.shape[1],i=ee(e.shape,"float32"),s=ee(e.shape,"float32"),u=Ve(e).as2D(o,a),l=je(e).as2D(o,a),c=0;c<o;c++)for(var f=u.slice([c,0],[1,a]),h=l.slice([c,0],[1,a]),d=Ae(f,h),p=this.readSync(this.fftImpl(d,n).dataId),m=0;m<a;m++){var v=Za(p,m);i.values[c*a+m]=v.real,s.values[c*a+m]=v.imag}return Ae(i.toTensor(),s.toTensor()).as2D(o,a)},t.prototype.fftImpl=function(e,n){var o=e.as1D(),a=o.size;if(this.isExponentOf2(a)){var i=this.fftRadix2(o,a,n).as2D(e.shape[0],e.shape[1]);return n&&(i=Ae(Ve(i).div($(a)),je(i).div($(a)))),i}var s=this.readSync(e.dataId),u=function(l){for(var c=new Float32Array(l.length/2),f=new Float32Array(l.length/2),h=0;h<l.length;h+=2)c[h/2]=l[h],f[h/2]=l[h+1];return{real:c,imag:f}}(this.fourierTransformByMatmul(s,a,n));return Ae(u.real,u.imag).as2D(e.shape[0],e.shape[1])},t.prototype.isExponentOf2=function(e){return(e&e-1)==0},t.prototype.fftRadix2=function(e,n,o){if(n===1)return e;var a=this.readSync(e.dataId),i=n/2,s=function(g){for(var y=Math.ceil(g.length/4),x=new Float32Array(y),b=new Float32Array(y),w=0;w<g.length;w+=4)x[Math.floor(w/4)]=g[w],b[Math.floor(w/4)]=g[w+1];return{real:x,imag:b}}(a),u=Ae(s.real,s.imag).as1D(),l=function(g){for(var y=Math.floor(g.length/4),x=new Float32Array(y),b=new Float32Array(y),w=2;w<g.length;w+=4)x[Math.floor(w/4)]=g[w],b[Math.floor(w/4)]=g[w+1];return{real:x,imag:b}}(a),c=Ae(l.real,l.imag).as1D();u=this.fftRadix2(u,i,o),c=this.fftRadix2(c,i,o);var f=function(g,y){for(var x=new Float32Array(g/2),b=new Float32Array(g/2),w=0;w<Math.ceil(g/2);w++){var R=(y?2:-2)*Math.PI*(w/g);x[w]=Math.cos(R),b[w]=Math.sin(R)}return{real:x,imag:b}}(n,o),h=Ae(f.real,f.imag).mul(c),d=u.add(h),p=u.sub(h),m=Ve(d).concat(Ve(p)),v=je(d).concat(je(p));return Ae(m,v).as1D()},t.prototype.fourierTransformByMatmul=function(e,n,o){for(var a=new Float32Array(2*n),i=0;i<n;i++){for(var s=0,u=0,l=0;l<n;l++){var c=dh(i*l,n,o),f=Za(e,l);s+=f.real*c.real-f.imag*c.imag,u+=f.real*c.imag+f.imag*c.real}o&&(s/=n,u/=n),hh(a,s,u,i)}return a},t.prototype.depthToSpace=function(e,n,o){E(o==="NHWC",function(){return"Only NHWC dataFormat supported on CPU for depthToSpace. Got "+o}),E(n>1,function(){return"blockSize should be > 1 for depthToSpace, but was: "+n});for(var a=e.shape[0],i=e.shape[1],s=e.shape[2],u=e.shape[3],l=i*n,c=s*n,f=u/(n*n),h=this.readSync(e.dataId),d=new Float32Array(a*l*c*f),p=0,m=0;m<a;++m)for(var v=0;v<l;++v)for(var g=Math.floor(v/n),y=v%n,x=0;x<c;++x)for(var b=Math.floor(x/n),w=(y*n+x%n)*f,R=0;R<f;++R){var A=R+w+u*(b+s*(g+i*m));d[p++]=h[A]}return bn(d,[a,l,c,f])},t.prototype.broadcastedBinaryOp=function(e,n,o,a){var i=oe(e.shape,n.shape),s=ee(i,o),u=this.readSync(e.dataId),l=this.readSync(n.dataId),c=pn(e.shape,i),f=pn(n.shape,i),h=s.values;if(c.length+f.length===0)for(var d=0;d<h.length;++d)h[d]=a(u[d%u.length],l[d%l.length]);else{var p=this.bufferSync(e),m=this.bufferSync(n),v=function(g){var y=s.indexToLoc(g),x=y.slice(-e.rank);c.forEach(function(A){return x[A]=0});var b=p.locToIndex(x),w=y.slice(-n.rank);f.forEach(function(A){return w[A]=0});var R=m.locToIndex(w);h[g]=a(u[b],l[R])};for(d=0;d<h.length;++d)v(d)}return s.toTensor()},t.prototype.broadcastedBinaryComplexOp=function(e,n,o){var a=oe(e.shape,n.shape),i=ee(a,"float32"),s=ee(a,"float32"),u=this.readSync(e.dataId),l=this.readSync(n.dataId),c=pn(e.shape,a),f=pn(n.shape,a),h=i.values,d=s.values;if(c.length+f.length===0)for(var p=0;p<h.length;p++){var m=p%u.length,v=p%l.length,g=o(u[2*m],u[2*m+1],l[2*v],l[2*v+1]);h[p]=g.real,d[p]=g.imag}else{var y=this.bufferSync(this.data.get(e.dataId).complexTensors.real),x=this.bufferSync(this.data.get(n.dataId).complexTensors.real),b=function(w){var R=i.indexToLoc(w),A=R.slice(-e.rank);c.forEach(function(N){return A[N]=0});var k=y.locToIndex(A),I=R.slice(-n.rank);f.forEach(function(N){return I[N]=0});var S=x.locToIndex(I),F=o(u[2*k],u[2*k+1],l[2*S],l[2*S+1]);h[w]=F.real,d[w]=F.imag};for(p=0;p<h.length;p++)b(p)}return this.complex(i.toTensor(),s.toTensor())},t.prototype.split=function(e,n,o){return iu(e,n,o)},t.prototype.dispose=function(){},t.prototype.floatPrecision=function(){return 32},t.prototype.epsilon=function(){return 1e-7},t.prototype.cropAndResize=function(e,n,o,a,i,s){for(var u=e.shape,l=u[0],c=u[1],f=u[2],h=u[3],d=n.shape[0],p=a[0],m=a[1],v=ee([d,p,m,h],"float32"),g=this.readSync(n.dataId),y=this.readSync(o.dataId),x=this.readSync(e.dataId),b=e.strides,w=v.strides,R=0;R<d;R++){var A=4*R,k=g[A],I=g[A+1],S=g[A+2],F=g[A+3],N=y[R];if(!(N>=l))for(var W=p>1?(S-k)*(c-1)/(p-1):0,L=m>1?(F-I)*(f-1)/(m-1):0,B=0;B<p;B++){var V=p>1?k*(c-1)+B*W:.5*(k+S)*(c-1);if(V<0||V>c-1)for(var z=0;z<m;z++)for(var P=0;P<h;P++){var G=P+z*w[2]+B*w[1]+R*w[0];v.values[G]=s}else if(i==="bilinear"){var H=Math.floor(V),q=Math.ceil(V),Q=V-H;for(z=0;z<m;z++)if((se=m>1?I*(f-1)+z*L:.5*(I+F)*(f-1))<0||se>f-1)for(P=0;P<h;P++)G=P+z*w[2]+B*w[1]+R*w[0],v.values[G]=s;else{var J=Math.floor(se),te=Math.ceil(se),re=se-J;for(P=0;P<h;P++){var ae=x[G=P+J*b[2]+H*b[1]+N*b[0]],le=x[G=P+te*b[2]+H*b[1]+N*b[0]],ie=x[G=P+J*b[2]+q*b[1]+N*b[0]],ce=ae+(le-ae)*re,Ce=ie+(x[G=P+te*b[2]+q*b[1]+N*b[0]]-ie)*re;G=P+z*w[2]+B*w[1]+R*w[0],v.values[G]=ce+(Ce-ce)*Q}}}else for(z=0;z<m;++z){var se;if((se=m>1?I*(f-1)+z*L:.5*(I+F)*(f-1))<0||se>f-1)for(P=0;P<h;P++)G=P+z*w[2]+B*w[1]+R*w[0],v.values[G]=s;else{var de=Math.round(se),he=Math.round(V);for(P=0;P<h;P++){var xe=P+de*b[2]+he*b[1]+N*b[0],me=P+z*w[2]+B*w[1]+R*w[0];v.values[me]=x[xe]}}}}}return v.toTensor()},t.prototype.sparseToDense=function(e,n,o,a){var i=Pt(0,e,o),s=i.sliceRank,u=i.numUpdates,l=i.sliceSize,c=i.strides,f=i.outputSize;return this.scatter(e,n,o,f,l,u,s,c,a,!1)},t.prototype.gatherND=function(e,n){var o=n.shape,a=o[o.length-1],i=ta(e,n),s=i[0],u=i[1],l=i[2],c=i[3];if(u===0)return Ne([],s,e.dtype);for(var f=new ht([u,l],e.dtype),h=this.readSync(n.dataId),d=this.readSync(e.dataId),p=0;p<u;p++){for(var m=[],v=0,g=0;g<a;g++){var y=h[p*a+g];v+=y*c[g],m.push(y)}if(v<0||v>=e.size/l)throw new Error("Invalid indices: "+m+" does not index into "+e.shape);for(var x=0;x<l;x++)f.values[p*l+x]=d[v*l+x]}return f.toTensor().reshape(s)},t.prototype.scatterND=function(e,n,o){var a=Pt(0,e,o),i=a.sliceRank,s=a.numUpdates,u=a.sliceSize,l=a.strides,c=a.outputSize,f=$(0);return this.scatter(e,n,o,c,u,s,i,l,f,!0)},t.prototype.fill=function(e,n,o){var a=Dt(o=o||pt(n),Y(e));return a.fill(n),D.makeTensor(a,e,o,this)},t.prototype.onesLike=function(e){if(e.dtype==="string")throw new Error("onesLike is not supported for string tensors");return this.fill(e.shape,1,e.dtype)},t.prototype.zerosLike=function(e){var n=Dt(e.dtype,Y(e.shape));return this.makeOutput(n,e.shape,e.dtype)},t.prototype.linspace=function(e,n,o){return ca(e,n,o)},t.prototype.scatter=function(e,n,o,a,i,s,u,l,c,f){var h=[a/i,i],d=this.readSync(e.dataId),p=this.readSync(n.dataId);if(a===0)return Ne([],o,n.dtype);var m=new ht(h,n.dtype);m.values.fill(this.readSync(c.dataId)[0]);for(var v=0;v<s;v++){for(var g=[],y=0,x=0;x<u;x++){var b=d[v*u+x];g.push(b),y+=b*l[x]}if(y<0||y>=a/i)throw new Error("Invalid indices: "+g+" does not index into "+o);for(var w=0;w<i;w++)f?m.values[y*i+w]+=p[v*i+w]:m.values[y*i+w]=n.rank===0?p[0]:p[v*i+w]}return m.toTensor().reshape(o)},t}(sa);D.registerBackend("cpu",function(){return new gp},1);for(var oo=0,wi=[{kernelName:"NonMaxSuppressionV5",backendName:"cpu",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=r.attrs,o=t,a=o.boxes,i=o.scores,s=n,u=s.maxOutputSize,l=s.iouThreshold,c=s.scoreThreshold,f=s.softNmsSigma,h=e;U(a,"NonMaxSuppressionWithScore");var d=ha(h.data.get(a.dataId).values,h.data.get(i.dataId).values,u,l,c,f);return[d.selectedIndices,d.selectedScores]}},{kernelName:"Square",backendName:"cpu",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=t.x,o=e;U(n,"square");for(var a=o.data.get(n.dataId).values,i=new Float32Array(a.length),s=0;s<a.length;++s){var u=a[s];i[s]=u*u}return{dataId:o.write(i,n.shape,n.dtype),shape:n.shape,dtype:n.dtype}}},{kernelName:Ut,backendName:"cpu",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=t,o=n.a,a=n.b,i=e;U([o,a],Ut);var s=i.data.get(o.dataId).values,u=i.data.get(a.dataId).values,l=function(h,d,p,m,v,g){var y=oe(h,d),x=y.length,b=Xe(y),w=ft(v,Y(y)),R=h.length,A=d.length,k=Xe(h),I=Xe(d),S=pn(h,y),F=pn(d,y);if(S.length+F.length===0)for(var N=0;N<w.length;++N)w[N]=g(p[N%p.length],m[N%m.length]);else{var W=function(L){var B=ji(L,x,b),V=B.slice(-R);S.forEach(function(H){return V[H]=0});var z=go(V,R,k),P=B.slice(-A);F.forEach(function(H){return P[H]=0});var G=go(P,A,I);w[L]=g(p[z],m[G])};for(N=0;N<w.length;++N)W(N)}return[w,y]}(o.shape,a.shape,s,u,o.dtype,function(h,d){var p=h-d;return p*p}),c=l[0],f=l[1];return{dataId:i.write(c,f,o.dtype),shape:f,dtype:o.dtype}}}];oo<wi.length;oo++)Po(wi[oo]);var Zn,yp=function(r){this.variableNames=["A"];var t=Oe(),e=r[0],n=r[1];this.outputShape=r,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(`+n+".0, "+e+`.0);

        vec4 values = `+t.texture2D+`(A, uv);
        float value;
        if (depth == 0) {
          value = values.r;
        } else if (depth == 1) {
          value = values.g;
        } else if (depth == 2) {
          value = values.b;
        } else if (depth == 3) {
          value = values.a;
        }

        setOutput(floor(value * 255.0 + 0.5));
      }
    `},xp=function(r){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0;var t=Oe(),e=r[0],n=r[1];this.outputShape=r,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];

        vec4 result = vec4(0.);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            texC = coords[1] + row;
            depth = coords[2] + col;

            vec2 uv = (vec2(texC, texR) + halfCR) /
                       vec2(`+n+".0, "+e+`.0);
            vec4 values = `+t.texture2D+`(A, uv);
            float value;
            if (depth == 0) {
              value = values.r;
            } else if (depth == 1) {
              value = values.g;
            } else if (depth == 2) {
              value = values.b;
            } else if (depth == 3) {
              value = values.a;
            }

            result[row * 2 + col] = floor(value * 255.0 + 0.5);
          }
        }

        `+t.output+` = result;
      }
    `};for(var ao=0,Ci=[{kernelName:"FromPixels",backendName:"webgl",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=r.attrs,o=t.pixels,a=n.numChannels,i=typeof HTMLVideoElement<"u"&&o instanceof HTMLVideoElement,s=typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement,u=i?[o.videoWidth,o.videoHeight]:[o.width,o.height],l=u[0],c=u[1],f=[c,l],h=[c,l,a];(s||i)&&(Zn==null&&(Zn=document.createElement("canvas").getContext("2d")),Zn.canvas.width=l,Zn.canvas.height=c,Zn.drawImage(o,0,0,l,c),o=Zn.canvas);var d=e.makeTensorInfo(f,"int32");e.texData.get(d.dataId).usage=Ge.PIXELS,e.gpgpu.uploadPixelDataToTexture(e.getTexture(d.dataId),o);var p=M().getBool("WEBGL_PACK")?new xp(h):new yp(h),m=e.runWebGLProgram(p,[d],"int32");return e.disposeData(d.dataId),m}},{kernelName:"NonMaxSuppressionV5",backendName:"webgl",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=r.attrs;hr("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");var o=t,a=o.boxes,i=o.scores,s=n,u=s.maxOutputSize,l=s.iouThreshold,c=s.scoreThreshold,f=s.softNmsSigma,h=e,d=ha(h.readSync(a.dataId),h.readSync(i.dataId),u,l,c,f);return[d.selectedIndices,d.selectedScores]}},{kernelName:"Square",backendName:"webgl",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=t.x,o=e,a=new ne(n.shape,"return x * x;");return o.runWebGLProgram(a,[n],n.dtype)}},{kernelName:Ut,backendName:"webgl",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=t,o=n.a,a=n.b,i=e,s=M().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new fn("return (a - b) * (a - b);",o.shape,a.shape):new be("return (a - b) * (a - b);",o.shape,a.shape);return i.compileAndRun(s,[o,a])}}];ao<Ci.length;ao++)Po(Ci[ao]);for(var io=0,Ei=[{kernelName:"Square",gradFunc:function(r,t){var e=t[0];return{x:function(){return r.mul(e.toFloat().mul(2))}}}},{kernelName:Ut,gradFunc:function(r,t){var e=t[0],n=t[1],o=$(2);return{a:function(){return Ln(r,Ln(o,An(e,n)))},b:function(){return Ln(r,Ln(o,An(n,e)))}}}}];io<Ei.length;io++)Bi(Ei[io]);var bp=function(){function r(){}return r.prototype.fetch=function(t,e){return fetch(t,e)},r.prototype.now=function(){return performance.now()},r.prototype.encode=function(t,e){if(e!=="utf-8"&&e!=="utf8")throw new Error("Browser's encoder only supports utf-8, but got "+e);return this.textEncoder==null&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(t)},r.prototype.decode=function(t,e){return new TextDecoder(e).decode(t)},r}();M().get("IS_BROWSER")&&M().setPlatform("browser",new bp);var so,wp=function(){return require("node-fetch")},Cp=function(){function r(){this.util=require("util"),this.textEncoder=new this.util.TextEncoder}return r.prototype.fetch=function(t,e){return M().global.fetch!=null?M().global.fetch(t,e):(so==null&&(so=wp()),so(t,e))},r.prototype.now=function(){var t=process.hrtime();return 1e3*t[0]+t[1]/1e6},r.prototype.encode=function(t,e){if(e!=="utf-8"&&e!=="utf8")throw new Error("Node built-in encoder only supports utf-8, but got "+e);return this.textEncoder.encode(t)},r.prototype.decode=function(t,e){return t.length===0?"":new this.util.TextDecoder(e).decode(t)},r}();M().get("IS_NODE")&&M().setPlatform("node",new Cp);var To={float32:4,int32:4,uint16:2,uint8:1,bool:1},xr=4;function sf(r,t){for(var e={},n=0,o=function(s){var u=s.name,l=s.dtype,c=s.shape,f=Y(c),h=void 0;if("quantization"in s){var d=s.quantization;if(d.dtype!=="uint8"&&d.dtype!=="uint16")throw new Error("Weight "+s.name+" has unknown quantization dtype "+d.dtype+". Supported quantization dtypes are: 'uint8' and 'uint16'.");var p=To[d.dtype],m=r.slice(n,n+f*p),v=d.dtype==="uint8"?new Uint8Array(m):new Uint16Array(m);if(l==="float32")h=Float32Array.from(v,function(R){return R*d.scale+d.min});else{if(l!=="int32")throw new Error("Unsupported dtype in weight '"+u+"': "+l);h=Int32Array.from(v,function(R){return Math.round(R*d.scale+d.min)})}n+=f*p}else if(l==="string"){var g=Y(s.shape);h=[];for(var y=0;y<g;y++){var x=new Uint32Array(r.slice(n,n+xr))[0];n+=xr;var b=new Uint8Array(r.slice(n,n+x));h.push(b),n+=x}}else{var w=To[l];if(m=r.slice(n,n+f*w),l==="float32")h=new Float32Array(m);else if(l==="int32")h=new Int32Array(m);else{if(l!=="bool")throw new Error("Unsupported dtype in weight '"+u+"': "+l);h=new Uint8Array(m)}n+=f*w}e[u]=Ne(h,c,l)},a=0,i=t;a<i.length;a++)o(i[a]);return e}function Ep(r){if(r===null)throw new Error("Invalid input value: "+JSON.stringify(r));var t=0,e=[];r.forEach(function(a){if(t+=a.byteLength,e.push(a.byteLength===a.buffer.byteLength?a:new a.constructor(a)),!(a instanceof Float32Array||a instanceof Int32Array||a instanceof Uint8Array))throw new Error("Unsupported TypedArray subtype: "+a.constructor.name)});var n=new Uint8Array(t),o=0;return e.forEach(function(a){n.set(new Uint8Array(a.buffer),o),o+=a.byteLength}),n.buffer}var No=typeof Buffer<"u"&&(typeof Blob>"u"||typeof atob>"u"||typeof btoa>"u");function Ri(r){return No?Buffer.byteLength(r):new Blob([r]).size}function Va(r){var t=0;r.forEach(function(o){t+=o.byteLength});var e=new Uint8Array(t),n=0;return r.forEach(function(o){e.set(new Uint8Array(o),n),n+=o.byteLength}),e.buffer}function Ii(r){for(r=r.trim();r.endsWith("/");)r=r.slice(0,r.length-1);var t=r.split("/");return t[t.length-1]}function Xt(r){if(r.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:r.modelTopology==null?0:Ri(JSON.stringify(r.modelTopology)),weightSpecsBytes:r.weightSpecs==null?0:Ri(JSON.stringify(r.weightSpecs)),weightDataBytes:r.weightData==null?0:r.weightData.byteLength}}var qe=function(){function r(){this.saveRouters=[],this.loadRouters=[]}return r.getInstance=function(){return r.instance==null&&(r.instance=new r),r.instance},r.registerSaveRouter=function(t){r.getInstance().saveRouters.push(t)},r.registerLoadRouter=function(t){r.getInstance().loadRouters.push(t)},r.getSaveHandlers=function(t){return r.getHandlers(t,"save")},r.getLoadHandlers=function(t,e){return r.getHandlers(t,"load",e)},r.getHandlers=function(t,e,n){var o=[];return(e==="load"?r.getInstance().loadRouters:r.getInstance().saveRouters).forEach(function(a){var i=a(t,n);i!==null&&o.push(i)}),o},r}(),st="://",Rn=function(){function r(){this.managers={}}return r.getInstance=function(){return r.instance==null&&(r.instance=new r),r.instance},r.registerManager=function(t,e){E(t!=null,function(){return"scheme must not be undefined or null."}),t.endsWith(st)&&(t=t.slice(0,t.indexOf(st))),E(t.length>0,function(){return"scheme must not be an empty string."});var n=r.getInstance();E(n.managers[t]==null,function(){return"A model store manager is already registered for scheme '"+t+"'."}),n.managers[t]=e},r.getManager=function(t){var e=this.getInstance().managers[t];if(e==null)throw new Error("Cannot find model manager for scheme '"+t+"'");return e},r.getSchemes=function(){return Object.keys(this.getInstance().managers)},r}();function ur(r){if(r.indexOf(st)===-1)throw new Error("The url string provided does not contain a scheme. Supported schemes are: "+Rn.getSchemes().join(","));return{scheme:r.split(st)[0],path:r.split(st)[1]}}function ki(r,t,e){return e===void 0&&(e=!1),j(this,void 0,void 0,function(){var n,o,a,i,s,u,l,c,f;return X(this,function(h){switch(h.label){case 0:return E(r!==t,function(){return"Old path and new path are the same: '"+r+"'"}),E((n=qe.getLoadHandlers(r)).length>0,function(){return"Copying failed because no load handler is found for source URL "+r+"."}),E(n.length<2,function(){return"Copying failed because more than one ("+n.length+") load handlers for source URL "+r+"."}),o=n[0],E((a=qe.getSaveHandlers(t)).length>0,function(){return"Copying failed because no save handler is found for destination URL "+t+"."}),E(a.length<2,function(){return"Copying failed because more than one ("+n.length+") save handlers for destination URL "+t+"."}),i=a[0],s=ur(r).scheme,u=ur(r).path,l=s===ur(r).scheme,[4,o.load()];case 1:return c=h.sent(),e&&l?[4,Rn.getManager(s).removeModel(u)]:[3,3];case 2:h.sent(),h.label=3;case 3:return[4,i.save(c)];case 4:return f=h.sent(),!e||l?[3,6]:[4,Rn.getManager(s).removeModel(u)];case 5:h.sent(),h.label=6;case 6:return[2,f.modelArtifactsInfo]}})})}var Wn="models_store",En="model_info_store";function uf(){if(!M().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");var r=window||self,t=r.indexedDB||r.mozIndexedDB||r.webkitIndexedDB||r.msIndexedDB||r.shimIndexedDB;if(t==null)throw new Error("The current browser does not appear to support IndexedDB.");return t}function Fo(r){var t=r.result;t.createObjectStore(Wn,{keyPath:"modelPath"}),t.createObjectStore(En,{keyPath:"modelPath"})}var ut=function(){function r(t){if(this.indexedDB=uf(),t==null||!t)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=t}return r.prototype.save=function(t){return j(this,void 0,void 0,function(){return X(this,function(e){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return[2,this.databaseAction(this.modelPath,t)]})})},r.prototype.load=function(){return j(this,void 0,void 0,function(){return X(this,function(t){return[2,this.databaseAction(this.modelPath)]})})},r.prototype.databaseAction=function(t,e){var n=this;return new Promise(function(o,a){var i=n.indexedDB.open("tensorflowjs",1);i.onupgradeneeded=function(){return Fo(i)},i.onsuccess=function(){var s=i.result;if(e==null){var u=s.transaction(Wn,"readonly"),l=u.objectStore(Wn).get(n.modelPath);l.onsuccess=function(){if(l.result==null)return s.close(),a(new Error("Cannot find model with path '"+n.modelPath+"' in IndexedDB."));o(l.result.modelArtifacts)},l.onerror=function(m){return s.close(),a(l.error)},u.oncomplete=function(){return s.close()}}else{var c,f=Xt(e),h=s.transaction(En,"readwrite"),d=h.objectStore(En),p=d.put({modelPath:n.modelPath,modelArtifactsInfo:f});p.onsuccess=function(){var m=(c=s.transaction(Wn,"readwrite")).objectStore(Wn).put({modelPath:n.modelPath,modelArtifacts:e,modelArtifactsInfo:f});m.onsuccess=function(){return o({modelArtifactsInfo:f})},m.onerror=function(v){var g=(d=h.objectStore(En)).delete(n.modelPath);g.onsuccess=function(){return s.close(),a(m.error)},g.onerror=function(y){return s.close(),a(m.error)}}},p.onerror=function(m){return s.close(),a(p.error)},h.oncomplete=function(){c==null?s.close():c.oncomplete=function(){return s.close()}}}},i.onerror=function(s){return a(i.error)}})},r.URL_SCHEME="indexeddb://",r}(),Si=function(r){return M().getBool("IS_BROWSER")&&!Array.isArray(r)&&r.startsWith(ut.URL_SCHEME)?(t=r.slice(ut.URL_SCHEME.length),new ut(t)):null;var t};qe.registerSaveRouter(Si),qe.registerLoadRouter(Si);var Rp=function(){function r(){this.indexedDB=uf()}return r.prototype.listModels=function(){return j(this,void 0,void 0,function(){var t=this;return X(this,function(e){return[2,new Promise(function(n,o){var a=t.indexedDB.open("tensorflowjs",1);a.onupgradeneeded=function(){return Fo(a)},a.onsuccess=function(){var i=a.result,s=i.transaction(En,"readonly"),u=s.objectStore(En).getAll();u.onsuccess=function(){for(var l={},c=0,f=u.result;c<f.length;c++){var h=f[c];l[h.modelPath]=h.modelArtifactsInfo}n(l)},u.onerror=function(l){return i.close(),o(u.error)},s.oncomplete=function(){return i.close()}},a.onerror=function(i){return o(a.error)}})]})})},r.prototype.removeModel=function(t){return j(this,void 0,void 0,function(){var e=this;return X(this,function(n){var o;return t=(o=t).startsWith(ut.URL_SCHEME)?o.slice(ut.URL_SCHEME.length):o,[2,new Promise(function(a,i){var s=e.indexedDB.open("tensorflowjs",1);s.onupgradeneeded=function(){return Fo(s)},s.onsuccess=function(){var u,l=s.result,c=l.transaction(En,"readwrite"),f=c.objectStore(En),h=f.get(t);h.onsuccess=function(){if(h.result==null)return l.close(),i(new Error("Cannot find model with path '"+t+"' in IndexedDB."));var d=f.delete(t),p=function(){var m=(u=l.transaction(Wn,"readwrite")).objectStore(Wn).delete(t);m.onsuccess=function(){return a(h.result.modelArtifactsInfo)},m.onerror=function(v){return i(h.error)}};d.onsuccess=p,d.onerror=function(m){return p(),l.close(),i(h.error)}},h.onerror=function(d){return l.close(),i(h.error)},c.oncomplete=function(){u==null?l.close():u.oncomplete=function(){return l.close()}}},s.onerror=function(u){return i(s.error)}})]})})},r}();if(M().getBool("IS_BROWSER"))try{Rn.registerManager(ut.URL_SCHEME,new Rp)}catch{}var dn="/",ot="tensorflowjs_models",lf="info",Ip="model_topology",kp="weight_specs",Sp="weight_data",Ap="model_metadata";function cf(r){return{info:[ot,r,lf].join(dn),topology:[ot,r,Ip].join(dn),weightSpecs:[ot,r,kp].join(dn),weightData:[ot,r,Sp].join(dn),modelMetadata:[ot,r,Ap].join(dn)}}function Dp(r){var t=r.split(dn);if(t.length<3)throw new Error("Invalid key format: "+r);return t.slice(1,t.length-1).join(dn)}var lt=function(){function r(t){if(!M().getBool("IS_BROWSER")||typeof window>"u"||window.localStorage===void 0)throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,t==null||!t)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=t,this.keys=cf(this.modelPath)}return r.prototype.save=function(t){return j(this,void 0,void 0,function(){var e,n,o;return X(this,function(a){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");e=JSON.stringify(t.modelTopology),n=JSON.stringify(t.weightSpecs),o=Xt(t);try{return this.LS.setItem(this.keys.info,JSON.stringify(o)),this.LS.setItem(this.keys.topology,e),this.LS.setItem(this.keys.weightSpecs,n),this.LS.setItem(this.keys.weightData,function(i){if(No)return Buffer.from(i).toString("base64");for(var s=new Uint8Array(i),u="",l=0,c=s.length;l<c;l++)u+=String.fromCharCode(s[l]);return btoa(u)}(t.weightData)),this.LS.setItem(this.keys.modelMetadata,JSON.stringify({format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy,userDefinedMetadata:t.userDefinedMetadata})),[2,{modelArtifactsInfo:o}]}catch{throw this.LS.removeItem(this.keys.info),this.LS.removeItem(this.keys.topology),this.LS.removeItem(this.keys.weightSpecs),this.LS.removeItem(this.keys.weightData),this.LS.removeItem(this.keys.modelMetadata),new Error("Failed to save model '"+this.modelPath+"' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes="+o.modelTopologyBytes+", weightSpecsBytes="+o.weightSpecsBytes+", weightDataBytes="+o.weightDataBytes+".")}return[2]})})},r.prototype.load=function(){return j(this,void 0,void 0,function(){var t,e,n,o,a,i,s;return X(this,function(u){if((t=JSON.parse(this.LS.getItem(this.keys.info)))==null)throw new Error("In local storage, there is no model with name '"+this.modelPath+"'");if(t.modelTopologyType!=="JSON")throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");if(e={},(n=JSON.parse(this.LS.getItem(this.keys.topology)))==null)throw new Error("In local storage, the topology of model '"+this.modelPath+"' is missing.");if(e.modelTopology=n,(o=JSON.parse(this.LS.getItem(this.keys.weightSpecs)))==null)throw new Error("In local storage, the weight specs of model '"+this.modelPath+"' are missing.");if(e.weightSpecs=o,(a=this.LS.getItem(this.keys.modelMetadata))!=null&&(i=JSON.parse(a),e.format=i.format,e.generatedBy=i.generatedBy,e.convertedBy=i.convertedBy,e.userDefinedMetadata=i.userDefinedMetadata),(s=this.LS.getItem(this.keys.weightData))==null)throw new Error("In local storage, the binary weight values of model '"+this.modelPath+"' are missing.");return e.weightData=function(l){if(No){var c=Buffer.from(l,"base64");return c.buffer.slice(c.byteOffset,c.byteOffset+c.byteLength)}for(var f=atob(l),h=new Uint8Array(f.length),d=0;d<f.length;++d)h.set([f.charCodeAt(d)],d);return h.buffer}(s),[2,e]})})},r.URL_SCHEME="localstorage://",r}(),Ai=function(r){return M().getBool("IS_BROWSER")&&!Array.isArray(r)&&r.startsWith(lt.URL_SCHEME)?(t=r.slice(lt.URL_SCHEME.length),new lt(t)):null;var t};qe.registerSaveRouter(Ai),qe.registerLoadRouter(Ai);var Tp=function(){function r(){E(M().getBool("IS_BROWSER"),function(){return"Current environment is not a web browser"}),E(typeof window>"u"||window.localStorage!==void 0,function(){return"Current browser does not appear to support localStorage"}),this.LS=window.localStorage}return r.prototype.listModels=function(){return j(this,void 0,void 0,function(){var t,e,n,o,a,i;return X(this,function(s){for(t={},e=ot+dn,n=dn+lf,o=0;o<this.LS.length;++o)(a=this.LS.key(o)).startsWith(e)&&a.endsWith(n)&&(i=Dp(a),t[i]=JSON.parse(this.LS.getItem(a)));return[2,t]})})},r.prototype.removeModel=function(t){return j(this,void 0,void 0,function(){var e,n;return X(this,function(o){var a;if(t=(a=t).startsWith(lt.URL_SCHEME)?a.slice(lt.URL_SCHEME.length):a,e=cf(t),this.LS.getItem(e.info)==null)throw new Error("Cannot find model at path '"+t+"'");return n=JSON.parse(this.LS.getItem(e.info)),this.LS.removeItem(e.info),this.LS.removeItem(e.topology),this.LS.removeItem(e.weightSpecs),this.LS.removeItem(e.weightData),[2,n]})})},r}();if(M().getBool("IS_BROWSER"))try{Rn.registerManager(lt.URL_SCHEME,new Tp)}catch{}var Np="model",Fp=".json",_p=".weights.bin";function Di(r){return new Promise(function(t){return setTimeout(t)}).then(r)}var uo=function(){function r(t){if(!M().getBool("IS_BROWSER"))throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");t.startsWith(r.URL_SCHEME)&&(t=t.slice(r.URL_SCHEME.length)),t!=null&&t.length!==0||(t=Np),this.modelTopologyFileName=t+Fp,this.weightDataFileName=t+_p}return r.prototype.save=function(t){return j(this,void 0,void 0,function(){var e,n,o,a,i,s;return X(this,function(u){switch(u.label){case 0:if(typeof document>"u")throw new Error("Browser downloads are not supported in this environment since `document` is not present");if(e=window.URL.createObjectURL(new Blob([t.weightData],{type:"application/octet-stream"})),!(t.modelTopology instanceof ArrayBuffer))return[3,1];throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");case 1:return n=[{paths:["./"+this.weightDataFileName],weights:t.weightSpecs}],o={modelTopology:t.modelTopology,format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy,weightsManifest:n},a=window.URL.createObjectURL(new Blob([JSON.stringify(o)],{type:"application/json"})),(i=this.jsonAnchor==null?document.createElement("a"):this.jsonAnchor).download=this.modelTopologyFileName,i.href=a,[4,Di(function(){return i.dispatchEvent(new MouseEvent("click"))})];case 2:return u.sent(),t.weightData==null?[3,4]:((s=this.weightDataAnchor==null?document.createElement("a"):this.weightDataAnchor).download=this.weightDataFileName,s.href=e,[4,Di(function(){return s.dispatchEvent(new MouseEvent("click"))})]);case 3:u.sent(),u.label=4;case 4:return[2,{modelArtifactsInfo:Xt(t)}]}})})},r.URL_SCHEME="downloads://",r}(),Op=function(){function r(t){if(t==null||t.length<1)throw new Error("When calling browserFiles, at least 1 file is required, but received "+t);this.files=t}return r.prototype.load=function(){return j(this,void 0,void 0,function(){var t,e,n=this;return X(this,function(o){return t=this.files[0],e=this.files.slice(1),[2,new Promise(function(a,i){var s=new FileReader;s.onload=function(u){var l=JSON.parse(u.target.result),c=l.modelTopology;if(c!=null){e.length===0&&a({modelTopology:c});var f=l.weightsManifest;if(f!=null){var h;try{h=n.checkManifestAndWeightFiles(f,e)}catch(v){return void i(v)}var d=[],p=[],m=[];f.forEach(function(v){v.paths.forEach(function(g){p.push(g),m.push(null)}),d.push.apply(d,v.weights)}),f.forEach(function(v){v.paths.forEach(function(g){var y=new FileReader;y.onload=function(x){var b=x.target.result,w=p.indexOf(g);m[w]=b,m.indexOf(null)===-1&&a({modelTopology:c,weightSpecs:d,weightData:Va(m),format:l.format,generatedBy:l.generatedBy,convertedBy:l.convertedBy,userDefinedMetadata:l.userDefinedMetadata})},y.onerror=function(x){return i("Failed to weights data from file of path '"+g+"'.")},y.readAsArrayBuffer(h[g])})})}else i(new Error("weightManifest field is missing from file "+t.name))}else i(new Error("modelTopology field is missing from file "+t.name))},s.onerror=function(u){return i("Failed to read model topology and weights manifest JSON from file '"+t.name+"'. BrowserFiles supports loading Keras-style tf.Model artifacts only.")},s.readAsText(t)})]})})},r.prototype.checkManifestAndWeightFiles=function(t,e){for(var n=[],o=e.map(function(u){return Ii(u.name)}),a={},i=0,s=t;i<s.length;i++)s[i].paths.forEach(function(u){var l=Ii(u);if(n.indexOf(l)!==-1)throw new Error("Duplicate file basename found in weights manifest: '"+l+"'");if(n.push(l),o.indexOf(l)===-1)throw new Error("Weight file with basename '"+l+"' is not provided.");a[u]=e[o.indexOf(l)]});if(n.length!==e.length)throw new Error("Mismatch in the number of files in weights manifest ("+n.length+") and the number of weight files provided ("+e.length+").");return a},r}();function Ti(r,t,e,n){(function(a){E(a!=null&&Array.isArray(a)&&a.length>0,function(){return"promises must be a none empty array"})})(r),function(a,i){E(a>=0&&a<=1,function(){return"Progress fraction must be in range [0, 1], but got startFraction "+a}),E(i>=0&&i<=1,function(){return"Progress fraction must be in range [0, 1], but got endFraction "+i}),E(i>=a,function(){return"startFraction must be no more than endFraction, but got startFraction "+a+" and endFraction "+i})}(e=e??0,n=n??1);var o=0;return Promise.all(r.map(function(a){return a.then(function(i){var s=e+ ++o/r.length*(n-e);return t(s),i}),a}))}function ff(r,t){return j(this,void 0,void 0,function(){var e,n,o,a,i,s,u,l,c;return X(this,function(f){switch(f.label){case 0:return t==null&&(t={}),e=t.fetchFunc==null?M().platform.fetch:t.fetchFunc,n=r.map(function(h){return e(h,t.requestInit,{isBinary:!0})}),o=0,a=.5,t.onProgress!=null?[3,2]:[4,Promise.all(n)];case 1:return i=f.sent(),[3,4];case 2:return[4,Ti(n,t.onProgress,o,a)];case 3:i=f.sent(),f.label=4;case 4:return s=i.map(function(h){return h.arrayBuffer()}),u=.5,l=1,t.onProgress!=null?[3,6]:[4,Promise.all(s)];case 5:return c=f.sent(),[3,8];case 6:return[4,Ti(s,t.onProgress,u,l)];case 7:c=f.sent(),f.label=8;case 8:return[2,c]}})})}function Ni(r){var t=this;return function(e,n,o){return n===void 0&&(n=""),j(t,void 0,void 0,function(){var a,i,s,u,l,c,f,h,d,p;return X(this,function(m){switch(m.label){case 0:if(a=e.map(function(){return!1}),i={},s=o!=null?o.map(function(){return!1}):[],u=[],e.forEach(function(v,g){var y=0;v.weights.forEach(function(x){var b="quantization"in x?x.quantization.dtype:x.dtype,w=To[b]*Y(x.shape),R=function(){a[g]=!0,i[g]==null&&(i[g]=[]),i[g].push({manifestEntry:x,groupOffset:y,sizeBytes:w})};o!=null?o.forEach(function(A,k){A===x.name&&(R(),s[k]=!0)}):R(),u.push(x.name),y+=w})}),!s.every(function(v){return v}))throw l=o.filter(function(v,g){return!s[g]}),new Error("Could not find weights in manifest with names: "+l.join(", ")+`. 
Manifest JSON has weights with names: `+u.join(", ")+".");return c=a.reduce(function(v,g,y){return g&&v.push(y),v},[]),f=[],c.forEach(function(v){e[v].paths.forEach(function(g){var y=n+(n.endsWith("/")?"":"/")+g;f.push(y)})}),[4,r(f)];case 1:return h=m.sent(),d={},p=0,c.forEach(function(v){for(var g=e[v].paths.length,y=0,x=0;x<g;x++)y+=h[p+x].byteLength;for(var b=new ArrayBuffer(y),w=new Uint8Array(b),R=0,A=0;A<g;A++){var k=new Uint8Array(h[p+A]);w.set(k,R),R+=k.byteLength}i[v].forEach(function(I){var S=sf(b.slice(I.groupOffset,I.groupOffset+I.sizeBytes),[I.manifestEntry]);for(var F in S)d[F]=S[F]}),p+=g}),[2,d]}})})}}qe.registerSaveRouter(function(r){return M().getBool("IS_BROWSER")&&!Array.isArray(r)&&r.startsWith(uo.URL_SCHEME)?function(t){return t===void 0&&(t="model"),new uo(t)}(r.slice(uo.URL_SCHEME.length)):null});var hf=function(){function r(t,e){if(this.DEFAULT_METHOD="POST",e==null&&(e={}),this.weightPathPrefix=e.weightPathPrefix,this.onProgress=e.onProgress,e.fetchFunc!=null?(E(typeof e.fetchFunc=="function",function(){return"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)"}),this.fetch=e.fetchFunc):this.fetch=M().platform.fetch,E(t!=null&&t.length>0,function(){return"URL path for http must not be null, undefined or empty."}),Array.isArray(t)&&E(t.length===2,function(){return"URL paths for http must have a length of 2, (actual length is "+t.length+")."}),this.path=t,e.requestInit!=null&&e.requestInit.body!=null)throw new Error("requestInit is expected to have no pre-existing body, but has one.");this.requestInit=e.requestInit||{}}return r.prototype.save=function(t){return j(this,void 0,void 0,function(){var e,n,o,a;return X(this,function(i){switch(i.label){case 0:if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");return(e=Object.assign({method:this.DEFAULT_METHOD},this.requestInit)).body=new FormData,n=[{paths:["./model.weights.bin"],weights:t.weightSpecs}],o={modelTopology:t.modelTopology,format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy,userDefinedMetadata:t.userDefinedMetadata,weightsManifest:n},e.body.append("model.json",new Blob([JSON.stringify(o)],{type:"application/json"}),"model.json"),t.weightData!=null&&e.body.append("model.weights.bin",new Blob([t.weightData],{type:"application/octet-stream"}),"model.weights.bin"),[4,this.fetch(this.path,e)];case 1:if((a=i.sent()).ok)return[2,{modelArtifactsInfo:Xt(t),responses:[a]}];throw new Error("BrowserHTTPRequest.save() failed due to HTTP response status "+a.status+".")}})})},r.prototype.load=function(){return j(this,void 0,void 0,function(){var t,e,n,o,a,i,s,u,l,c,f,h;return X(this,function(d){switch(d.label){case 0:return[4,this.fetch(this.path,this.requestInit)];case 1:if(!(t=d.sent()).ok)throw new Error("Request to "+this.path+" failed with status code "+t.status+". Please verify this URL points to the model JSON of the model to load.");d.label=2;case 2:return d.trys.push([2,4,,5]),[4,t.json()];case 3:return e=d.sent(),[3,5];case 4:throw d.sent(),n="Failed to parse model JSON of response from "+this.path+".",this.path.endsWith(".pb")?n+=" Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.":n+=" Please make sure the server is serving valid JSON for this request.",new Error(n);case 5:if(o=e.modelTopology,a=e.weightsManifest,i=e.generatedBy,s=e.convertedBy,u=e.format,l=e.userDefinedMetadata,o==null&&a==null)throw new Error("The JSON from HTTP path "+this.path+" contains neither model topology or manifest for weights.");return a==null?[3,7]:[4,this.loadWeights(a)];case 6:h=d.sent(),c=h[0],f=h[1],d.label=7;case 7:return[2,{modelTopology:o,weightSpecs:c,weightData:f,userDefinedMetadata:l,generatedBy:i,convertedBy:s,format:u}]}})})},r.prototype.loadWeights=function(t){return j(this,void 0,void 0,function(){var e,n,o,a,i,s,u,l,c,f,h;return X(this,function(d){switch(d.label){case 0:for(e=Array.isArray(this.path)?this.path[1]:this.path,n=function(p){var m=p.lastIndexOf("/"),v=p.lastIndexOf("?"),g=p.substring(0,m),y=v>m?p.substring(v):"";return[g+"/",y]}(e),o=n[0],a=n[1],i=this.weightPathPrefix||o,s=[],u=0,l=t;u<l.length;u++)c=l[u],s.push.apply(s,c.weights);return f=[],t.forEach(function(p){p.paths.forEach(function(m){f.push(i+m+a)})}),[4,ff(f,{requestInit:this.requestInit,fetchFunc:this.fetch,onProgress:this.onProgress})];case 1:return h=d.sent(),[2,[s,Va(h)]]}})})},r.URL_SCHEME_REGEX=/^https?:\/\//,r}();function _o(r){return r.match(hf.URL_SCHEME_REGEX)!=null}var Fi=function(r,t){return typeof fetch>"u"?null:(Array.isArray(r)?r.every(function(e){return _o(e)}):_o(r))?Oo(r,{onProgress:t}):null};function Oo(r,t){return new hf(r,t)}qe.registerSaveRouter(Fi),qe.registerLoadRouter(Fi);var lo=function(){function r(t){this.modelArtifacts=t}return r.prototype.load=function(){return j(this,void 0,void 0,function(){return X(this,function(t){return[2,this.modelArtifacts]})})},r}(),Mp=function(){function r(t){this.saveHandler=t}return r.prototype.save=function(t){return j(this,void 0,void 0,function(){return X(this,function(e){return[2,this.saveHandler(t)]})})},r}(),Bp=Object.freeze({browserFiles:function(r){return new Op(r)},browserHTTPRequest:function(r,t){return Oo(r,t)},concatenateArrayBuffers:Va,decodeWeights:sf,encodeWeights:function(r,t){return j(this,void 0,void 0,function(){var e,n,o,a,i,s=this;return X(this,function(u){switch(u.label){case 0:for(e=[],n=[],o=Array.isArray(r)?r.map(function(l){return l.name}):Object.keys(r),a=function(l){var c=o[l],f=Array.isArray(r)?r[l].tensor:r[c];if(f.dtype!=="float32"&&f.dtype!=="int32"&&f.dtype!=="bool"&&f.dtype!=="string")throw new Error("Unsupported dtype in weight '"+c+"': "+f.dtype);var h={name:c,shape:f.shape,dtype:f.dtype};if(f.dtype==="string"){var d=new Promise(function(p){return j(s,void 0,void 0,function(){var m,v,g,y,x,b,w;return X(this,function(R){switch(R.label){case 0:return[4,f.bytes()];case 1:for(m=R.sent(),v=m.reduce(function(A,k){return A+k.length},0)+xr*m.length,g=new Uint8Array(v),y=0,x=0;x<m.length;x++)b=m[x],w=new Uint8Array(new Uint32Array([b.length]).buffer),g.set(w,y),y+=xr,g.set(b,y),y+=b.length;return p(g),[2]}})})});n.push(d)}else n.push(f.data());t!=null&&(h.group=t),e.push(h)},i=0;i<o.length;++i)a(i);return[4,Promise.all(n)];case 1:return[2,{data:Ep(u.sent()),specs:e}]}})})},fromMemory:function(r,t,e,n){return arguments.length===1?r.modelTopology!=null||r.weightSpecs!=null?new lo(r):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new lo({modelTopology:r})):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new lo({modelTopology:r,weightSpecs:t,weightData:e,trainingConfig:n}))},getLoadHandlers:function(r,t){return qe.getLoadHandlers(r,t)},getModelArtifactsInfoForJSON:Xt,getSaveHandlers:function(r){return qe.getSaveHandlers(r)},http:Oo,isHTTPScheme:_o,loadWeights:function(r,t,e,n){return t===void 0&&(t=""),j(this,void 0,void 0,function(){return X(this,function(o){return[2,Ni(function(a){return ff(a,{requestInit:n})})(r,t,e)]})})},registerLoadRouter:function(r){return qe.registerLoadRouter(r)},registerSaveRouter:function(r){return qe.registerSaveRouter(r)},weightsLoaderFactory:Ni,withSaveHandler:function(r){return new Mp(r)},copyModel:function(r,t){return j(this,void 0,void 0,function(){return X(this,function(e){return[2,ki(r,t,!1)]})})},listModels:function(){return j(this,void 0,void 0,function(){var r,t,e,n,o,a,i;return X(this,function(s){switch(s.label){case 0:r=Rn.getSchemes(),t={},e=0,n=r,s.label=1;case 1:return e<n.length?(o=n[e],[4,Rn.getManager(o).listModels()]):[3,4];case 2:for(i in a=s.sent())t[o+st+i]=a[i];s.label=3;case 3:return e++,[3,1];case 4:return[2,t]}})})},moveModel:function(r,t){return j(this,void 0,void 0,function(){return X(this,function(e){return[2,ki(r,t,!0)]})})},removeModel:function(r){return j(this,void 0,void 0,function(){var t;return X(this,function(e){return t=ur(r),[2,Rn.getManager(t.scheme).removeModel(t.path)]})})}}),et,Pp=T({confusionMatrix_:function(r,t,e){var n=C(r,"labels","confusionMatrix"),o=C(t,"predictions","confusionMatrix");E(e==null||e>0&&Number.isInteger(e),function(){return"If provided, numClasses must be a positive integer, but got "+e}),E(n.rank===1,function(){return"Expected the rank of labels to be 1, but got "+n.rank}),E(o.rank===1,function(){return"Expected the rank of predictions to be 1, but got "+o.rank}),E(n.shape[0]===o.shape[0],function(){return"Mismatch in the number of examples: "+n.shape[0]+" vs. "+o.shape[0]+". Labels and predictions should have the same number of elements."}),E(e>0&&Number.isInteger(e),function(){return"numClasses is required to be a positive integer, but got "+e});var a=dr(n.asType("int32"),e),i=dr(o.asType("int32"),e);return a.transpose().matMul(i).asType("int32")}}),Lp=Object.freeze({confusionMatrix:Pp}),Wp=T({fromPixels_:function(r,t){if(t===void 0&&(t=3),t>4)throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");if(r==null)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");var e=!1,n=!1,o=!1,a=!1,i=!1;if(r.data instanceof Uint8Array)e=!0;else if(typeof ImageData<"u"&&r instanceof ImageData)n=!0;else if(typeof HTMLVideoElement<"u"&&r instanceof HTMLVideoElement)o=!0;else if(typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement)a=!0;else{if(r.getContext==null)throw new Error("pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was "+r.constructor.name);i=!0}if(o&&o&&r.readyState<2)throw new Error("The video element has not loaded data yet. Please wait for `loadeddata` event on the <video> element.");if(Bo("FromPixels",D.backendName)!=null)return D.runKernel("FromPixels",{pixels:r},{numChannels:t});var s,u,l=o?[r.videoWidth,r.videoHeight]:[r.width,r.height],c=l[0],f=l[1];if(i?s=r.getContext("2d").getImageData(0,0,c,f).data:n||e?s=r.data:(a||o)&&(et==null&&(et=document.createElement("canvas").getContext("2d")),et.canvas.width=c,et.canvas.height=f,et.drawImage(r,0,0,c,f),s=et.getImageData(0,0,c,f).data),t===4)u=new Int32Array(s);else{var h=c*f;u=new Int32Array(h*t);for(var d=0;d<h;d++)for(var p=0;p<t;++p)u[d*t+p]=s[4*d+p]}return Xo(u,[f,c,t],"int32")}}),Up=Object.freeze({toPixels:function(r,t){return j(this,void 0,void 0,function(){var e,n,o,a,i,s,u,l,c,f,h,d,p,m,v,g,y,x,b,w,R,A,k;return X(this,function(I){switch(I.label){case 0:if(e=C(r,"img","toPixels"),r instanceof Se||(e=e.toInt()),e.rank!==2&&e.rank!==3)throw new Error("toPixels only supports rank 2 or 3 tensors, got rank "+e.rank+".");if(n=e.shape.slice(0,2),o=n[0],a=n[1],(i=e.rank===2?1:e.shape[2])>4||i===2)throw new Error("toPixels only supports depth of size 1, 3 or 4 but got "+i);return[4,e.data()];case 1:return s=I.sent(),u=e.min(),l=e.max(),[4,Promise.all([u.data(),l.data()])];case 2:if(c=I.sent(),f=c[0],h=c[1],d=f[0],p=h[0],u.dispose(),l.dispose(),e.dtype==="float32"){if(d<0||p>1)throw new Error("Tensor values for a float32 Tensor must be in the range [0 - 1] but got range ["+d+" - "+p+"].")}else{if(e.dtype!=="int32")throw new Error("Unsupported type for toPixels: "+e.dtype+". Please use float32 or int32 tensors.");if(d<0||p>255)throw new Error("Tensor values for a int32 Tensor must be in the range [0 - 255] but got range ["+d+" - "+p+"].")}for(m=e.dtype==="float32"?255:1,v=new Uint8ClampedArray(a*o*4),g=0;g<o*a;++g)y=void 0,x=void 0,b=void 0,w=void 0,i===1?(y=s[g]*m,x=s[g]*m,b=s[g]*m,w=255):i===3?(y=s[3*g]*m,x=s[3*g+1]*m,b=s[3*g+2]*m,w=255):i===4&&(y=s[4*g]*m,x=s[4*g+1]*m,b=s[4*g+2]*m,w=s[4*g+3]*m),v[(R=4*g)+0]=Math.round(y),v[R+1]=Math.round(x),v[R+2]=Math.round(b),v[R+3]=Math.round(w);return t!=null&&(t.width=a,t.height=o,A=t.getContext("2d"),k=new ImageData(v,a,o),A.putImageData(k,0,0)),e!==r&&e.dispose(),[2,v]}})})},fromPixels:Wp}),df=function(){function r(){}return r.prototype.getClassName=function(){return this.constructor.className},r.fromConfig=function(t,e){return new t(e)},r}(),pf=function(){function r(){this.classNameMap={}}return r.getMap=function(){return r.instance==null&&(r.instance=new r),r.instance},r.register=function(t){r.getMap().classNameMap[t.className]=[t,t.fromConfig]},r}();function Nn(r){E(r.className!=null,function(){return"Class being registered does not have the static className property defined."}),E(typeof r.className=="string",function(){return"className is required to be a string, but got type "+typeof r.className}),E(r.className.length>0,function(){return"Class being registered has an empty-string as its className, which is disallowed."}),pf.register(r)}var zp=Object.freeze({Serializable:df,SerializationMap:pf,registerClass:Nn}),Vp=.001,vf=.1;function co(){return D.backend.floatPrecision()===32?Vp:vf}function fo(r,t,e){var n=!0;if((Fe(r)||Fe(t))&&(n=!1),Fe(r)&&Fe(t)&&(n=!0),n){var o=r.constructor.name,a=t.constructor.name;if(o!==a)throw new Error("Arrays are of different type. Actual: "+o+". Expected: "+a)}if(Array.isArray(r)&&Array.isArray(t)){var i=on(r),s=on(t);if(!Re(i,s))throw new Error("Arrays have different shapes. Actual: ["+i+"]. Expected: ["+s+"]")}var u=Fe(r)?r:vn(r),l=Fe(t)?t:vn(t);if(u.length!==l.length)throw new Error("Arrays have different lengths actual: "+u.length+" vs expected: "+l.length+`.
Actual:   `+u+`.
Expected: `+l+".");for(var c=0;c<l.length;++c){var f=u[c],h=l[c];if(!e(f,h))throw new Error("Arrays differ: actual["+c+"] = "+f+", expected["+c+"] = "+h+`.
Actual:   `+u+`.
Expected: `+l+".")}}function ho(r,t,e){return!isFinite(r)&&!isFinite(t)||!(isNaN(r)||isNaN(t)||Math.abs(r-t)>e)}var Gp=Object.freeze({TEST_EPSILON_FLOAT16:vf,expectArraysClose:function(r,t,e){return e==null&&(e=co()),fo(r,t,function(n,o){return ho(n,o,e)})},testEpsilon:co,expectPromiseToFail:function(r,t){r().then(function(){return t.fail()},function(){return t()})},expectArraysEqual:function(r,t){var e=typeof t=="string"||typeof t=="number"||typeof t=="boolean"?[t]:t;return Cn(r)||Cn(r[0])||Cn(t)||Cn(t[0])?fo(r,e,function(n,o){return n==o}):fo(r,t,function(n,o){return ho(n,o,0)})},expectNumbersClose:function(r,t,e){if(e==null&&(e=co()),!ho(r,t,e))throw new Error("Numbers differ: actual === "+r+", expected === "+t)},expectValuesInRange:function(r,t,e){for(var n=0;n<r.length;n++)if(r[n]<t||r[n]>e)throw new Error("Value out of range:"+r[n]+" low: "+t+", high: "+e)},expectArrayBuffersEqual:function(r,t){expect(new Float32Array(r)).toEqual(new Float32Array(t))}}),Hp="1.7.0",qp=Object.freeze({gpgpu_util:id,webgl_util:Ff,forceHalfFloat:function(){M().set("WEBGL_FORCE_F16_TEXTURES",!0)},MathBackendWebGL:Pu,setWebGLContext:Ji,GPGPUContext:Tu}),Fn=function(r){function t(){return r!==null&&r.apply(this,arguments)||this}return $e(t,r),t.prototype.minimize=function(e,n,o){n===void 0&&(n=!1);var a=this.computeGradients(e,o),i=a.value,s=a.grads;if(o!=null){var u=o.map(function(l){return{name:l.name,tensor:s[l.name]}});this.applyGradients(u)}else this.applyGradients(s);return Me(s),n?i:(i.dispose(),null)},Object.defineProperty(t.prototype,"iterations",{get:function(){return this.iterations_==null&&(this.iterations_=0),this.iterations_},enumerable:!0,configurable:!0}),t.prototype.incrementIterations=function(){this.iterations_=this.iterations+1},t.prototype.computeGradients=function(e,n){return ru(e,n)},t.prototype.dispose=function(){this.iterations_!=null&&Me(this.iterations_)},t.prototype.saveIterations=function(){return j(this,void 0,void 0,function(){return X(this,function(e){return this.iterations_==null&&(this.iterations_=0),[2,{name:"iter",tensor:$(this.iterations_,"int32")}]})})},t.prototype.getWeights=function(){return j(this,void 0,void 0,function(){return X(this,function(e){throw new Error("getWeights() is not implemented for this optimizer yet.")})})},t.prototype.setWeights=function(e){return j(this,void 0,void 0,function(){return X(this,function(n){throw new Error("setWeights() is not implemented for this optimizer class "+this.getClassName())})})},t.prototype.extractIterations=function(e){return j(this,void 0,void 0,function(){var n;return X(this,function(o){switch(o.label){case 0:return n=this,[4,e[0].tensor.data()];case 1:return n.iterations_=o.sent()[0],[2,e.slice(1)]}})})},t}(df);Object.defineProperty(Fn,Symbol.hasInstance,{value:function(r){return r.minimize!=null&&r.computeGradients!=null&&r.applyGradients!=null}});var Ga=function(r){function t(e,n,o){o===void 0&&(o=null);var a=r.call(this)||this;return a.learningRate=e,a.rho=n,a.epsilon=o,a.accumulatedGrads=[],a.accumulatedUpdates=[],o==null&&(a.epsilon=D.backend.epsilon()),a}return $e(t,r),t.prototype.applyGradients=function(e){var n=this;(Array.isArray(e)?e.map(function(o){return o.name}):Object.keys(e)).forEach(function(o,a){var i=D.registeredVariables[o];n.accumulatedGrads[a]==null&&(n.accumulatedGrads[a]={originalName:o+"/accum_grad",variable:Ee(function(){return ue(i).variable(!1)})}),n.accumulatedUpdates[a]==null&&(n.accumulatedUpdates[a]={originalName:o+"/accum_var",variable:Ee(function(){return ue(i).variable(!1)})});var s=Array.isArray(e)?e[a].tensor:e[o];if(s!=null){var u=n.accumulatedGrads[a].variable,l=n.accumulatedUpdates[a].variable;Ee(function(){var c=u.mul(n.rho).add(s.square().mul(1-n.rho)),f=l.add(n.epsilon).sqrt().div(u.add(n.epsilon).sqrt()).mul(s),h=l.mul(n.rho).add(f.square().mul(1-n.rho));u.assign(c),l.assign(h);var d=f.mul(-n.learningRate).add(i);i.assign(d)})}}),this.incrementIterations()},t.prototype.dispose=function(){this.accumulatedUpdates!=null&&(Me(this.accumulatedGrads.map(function(e){return e.variable})),Me(this.accumulatedUpdates.map(function(e){return e.variable})))},t.prototype.getWeights=function(){return j(this,void 0,void 0,function(){var e;return X(this,function(n){switch(n.label){case 0:return e=this.accumulatedGrads.concat(this.accumulatedUpdates),[4,this.saveIterations()];case 1:return[2,[n.sent()].concat(e.map(function(o){return{name:o.originalName,tensor:o.variable}}))]}})})},t.prototype.setWeights=function(e){return j(this,void 0,void 0,function(){var n;return X(this,function(o){switch(o.label){case 0:return[4,this.extractIterations(e)];case 1:return e=o.sent(),n=e.length/2,this.accumulatedGrads=e.slice(0,n).map(function(a){return{originalName:a.name,variable:a.tensor.variable(!1)}}),this.accumulatedUpdates=e.slice(n,2*n).map(function(a){return{originalName:a.name,variable:a.tensor.variable(!1)}}),[2]}})})},t.prototype.getConfig=function(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}},t.fromConfig=function(e,n){return new e(n.learningRate,n.rho,n.epsilon)},t.className="Adadelta",t}(Fn);Nn(Ga);var Ha=function(r){function t(e,n){n===void 0&&(n=.1);var o=r.call(this)||this;return o.learningRate=e,o.initialAccumulatorValue=n,o.accumulatedGrads=[],o}return $e(t,r),t.prototype.applyGradients=function(e){var n=this;(Array.isArray(e)?e.map(function(o){return o.name}):Object.keys(e)).forEach(function(o,a){var i=D.registeredVariables[o];n.accumulatedGrads[a]==null&&(n.accumulatedGrads[a]={originalName:o+"/accumulator",variable:Ee(function(){return Cr(i.shape,n.initialAccumulatorValue).variable(!1)})});var s=Array.isArray(e)?e[a].tensor:e[o];if(s!=null){var u=n.accumulatedGrads[a].variable;Ee(function(){var l=u.add(s.square());u.assign(l);var c=s.div(l.add(D.backend.epsilon()).sqrt()).mul(-n.learningRate).add(i);i.assign(c)})}}),this.incrementIterations()},t.prototype.dispose=function(){this.accumulatedGrads!=null&&Me(this.accumulatedGrads.map(function(e){return e.variable}))},t.prototype.getWeights=function(){return j(this,void 0,void 0,function(){return X(this,function(e){switch(e.label){case 0:return[4,this.saveIterations()];case 1:return[2,[e.sent()].concat(this.accumulatedGrads.map(function(n){return{name:n.originalName,tensor:n.variable}}))]}})})},t.prototype.setWeights=function(e){return j(this,void 0,void 0,function(){return X(this,function(n){switch(n.label){case 0:return[4,this.extractIterations(e)];case 1:return e=n.sent(),this.accumulatedGrads=e.map(function(o){return{originalName:o.name,variable:o.tensor.variable(!1)}}),[2]}})})},t.prototype.getConfig=function(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}},t.fromConfig=function(e,n){return new e(n.learningRate,n.initialAccumulatorValue)},t.className="Adagrad",t}(Fn);Nn(Ha);var qa=function(r){function t(e,n,o,a){a===void 0&&(a=null);var i=r.call(this)||this;return i.learningRate=e,i.beta1=n,i.beta2=o,i.epsilon=a,i.accumulatedFirstMoment=[],i.accumulatedSecondMoment=[],Ee(function(){i.accBeta1=$(n).variable(),i.accBeta2=$(o).variable()}),a==null&&(i.epsilon=D.backend.epsilon()),i}return $e(t,r),t.prototype.applyGradients=function(e){var n=this,o=Array.isArray(e)?e.map(function(a){return a.name}):Object.keys(e);Ee(function(){var a=An(1,n.accBeta1),i=An(1,n.accBeta2);o.forEach(function(s,u){var l=D.registeredVariables[s];n.accumulatedFirstMoment[u]==null&&(n.accumulatedFirstMoment[u]={originalName:s+"/m",variable:Ee(function(){return ue(l).variable(!1)})}),n.accumulatedSecondMoment[u]==null&&(n.accumulatedSecondMoment[u]={originalName:s+"/v",variable:Ee(function(){return ue(l).variable(!1)})});var c=Array.isArray(e)?e[u].tensor:e[s];if(c!=null){var f=n.accumulatedFirstMoment[u].variable,h=n.accumulatedSecondMoment[u].variable,d=f.mul(n.beta1).add(c.mul(1-n.beta1)),p=h.mul(n.beta2).add(c.square().mul(1-n.beta2)),m=d.div(a),v=p.div(i);f.assign(d),h.assign(p);var g=m.div(v.sqrt().add(n.epsilon)).mul(-n.learningRate).add(l);l.assign(g)}}),n.accBeta1.assign(n.accBeta1.mul(n.beta1)),n.accBeta2.assign(n.accBeta2.mul(n.beta2))}),this.incrementIterations()},t.prototype.dispose=function(){this.accBeta1.dispose(),this.accBeta2.dispose(),this.accumulatedFirstMoment!=null&&Me(this.accumulatedFirstMoment.map(function(e){return e.variable})),this.accumulatedSecondMoment!=null&&Me(this.accumulatedSecondMoment.map(function(e){return e.variable}))},t.prototype.getWeights=function(){return j(this,void 0,void 0,function(){var e;return X(this,function(n){switch(n.label){case 0:return e=this.accumulatedFirstMoment.concat(this.accumulatedSecondMoment),[4,this.saveIterations()];case 1:return[2,[n.sent()].concat(e.map(function(o){return{name:o.originalName,tensor:o.variable}}))]}})})},t.prototype.setWeights=function(e){return j(this,void 0,void 0,function(){var n,o=this;return X(this,function(a){switch(a.label){case 0:return[4,this.extractIterations(e)];case 1:return e=a.sent(),Ee(function(){o.accBeta1.assign(zt(o.beta1,o.iterations_+1)),o.accBeta2.assign(zt(o.beta2,o.iterations_+1))}),n=e.length/2,this.accumulatedFirstMoment=e.slice(0,n).map(function(i){return{originalName:i.name,variable:i.tensor.variable(!1)}}),this.accumulatedSecondMoment=e.slice(n,2*n).map(function(i){return{originalName:i.name,variable:i.tensor.variable(!1)}}),[2]}})})},t.prototype.getConfig=function(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}},t.fromConfig=function(e,n){return new e(n.learningRate,n.beta1,n.beta2,n.epsilon)},t.className="Adam",t}(Fn);Nn(qa);var Ka=function(r){function t(e,n,o,a,i){a===void 0&&(a=null),i===void 0&&(i=0);var s=r.call(this)||this;return s.learningRate=e,s.beta1=n,s.beta2=o,s.epsilon=a,s.decay=i,s.accumulatedFirstMoment=[],s.accumulatedWeightedInfNorm=[],Ee(function(){s.iteration=$(0).variable(),s.accBeta1=$(n).variable()}),a==null&&(s.epsilon=D.backend.epsilon()),s}return $e(t,r),t.prototype.applyGradients=function(e){var n=this,o=Array.isArray(e)?e.map(function(a){return a.name}):Object.keys(e);Ee(function(){var a=An(1,n.accBeta1),i=Fr(-n.learningRate,n.iteration.mul(n.decay).add(1));o.forEach(function(s,u){var l=D.registeredVariables[s];n.accumulatedFirstMoment[u]==null&&(n.accumulatedFirstMoment[u]={originalName:s+"/m",variable:ue(l).variable(!1)}),n.accumulatedWeightedInfNorm[u]==null&&(n.accumulatedWeightedInfNorm[u]={originalName:s+"/v",variable:ue(l).variable(!1)});var c=Array.isArray(e)?e[u].tensor:e[s];if(c!=null){var f=n.accumulatedFirstMoment[u].variable,h=n.accumulatedWeightedInfNorm[u].variable,d=f.mul(n.beta1).add(c.mul(1-n.beta1)),p=h.mul(n.beta2),m=c.abs(),v=p.maximum(m);f.assign(d),h.assign(v);var g=i.div(a).mul(d.div(v.add(n.epsilon))).add(l);l.assign(g)}}),n.iteration.assign(n.iteration.add(1)),n.accBeta1.assign(n.accBeta1.mul(n.beta1))}),this.incrementIterations()},t.prototype.dispose=function(){this.accBeta1.dispose(),this.iteration.dispose(),this.accumulatedFirstMoment!=null&&Me(this.accumulatedFirstMoment.map(function(e){return e.variable})),this.accumulatedWeightedInfNorm!=null&&Me(this.accumulatedWeightedInfNorm.map(function(e){return e.variable}))},t.prototype.getWeights=function(){return j(this,void 0,void 0,function(){return X(this,function(e){throw new Error("getWeights() is not implemented for Adamax yet.")})})},t.prototype.setWeights=function(e){return j(this,void 0,void 0,function(){return X(this,function(n){throw new Error("setWeights() is not implemented for Adamax yet.")})})},t.prototype.getConfig=function(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}},t.fromConfig=function(e,n){return new e(n.learningRate,n.beta1,n.beta2,n.epsilon,n.decay)},t.className="Adamax",t}(Fn);Nn(Ka);var zr=function(r){function t(e){var n=r.call(this)||this;return n.learningRate=e,n.setLearningRate(e),n}return $e(t,r),t.prototype.applyGradients=function(e){var n=this;(Array.isArray(e)?e.map(function(o){return o.name}):Object.keys(e)).forEach(function(o,a){var i=Array.isArray(e)?e[a].tensor:e[o];if(i!=null){var s=D.registeredVariables[o];Ee(function(){var u=n.c.mul(i).add(s);s.assign(u)})}}),this.incrementIterations()},t.prototype.setLearningRate=function(e){this.learningRate=e,this.c!=null&&this.c.dispose(),this.c=Es($(-e))},t.prototype.dispose=function(){this.c.dispose()},t.prototype.getWeights=function(){return j(this,void 0,void 0,function(){return X(this,function(e){switch(e.label){case 0:return[4,this.saveIterations()];case 1:return[2,[e.sent()]]}})})},t.prototype.setWeights=function(e){return j(this,void 0,void 0,function(){return X(this,function(n){switch(n.label){case 0:return[4,this.extractIterations(e)];case 1:if((e=n.sent()).length!==0)throw new Error("SGD optimizer does not have settable weights.");return[2]}})})},t.prototype.getConfig=function(){return{learningRate:this.learningRate}},t.fromConfig=function(e,n){return new e(n.learningRate)},t.className="SGD",t}(Fn);Nn(zr);var ja=function(r){function t(e,n,o){o===void 0&&(o=!1);var a=r.call(this,e)||this;return a.learningRate=e,a.momentum=n,a.useNesterov=o,a.accumulations=[],a.m=$(a.momentum),a}return $e(t,r),t.prototype.applyGradients=function(e){var n=this;(Array.isArray(e)?e.map(function(o){return o.name}):Object.keys(e)).forEach(function(o,a){var i=D.registeredVariables[o];n.accumulations[a]==null&&(n.accumulations[a]={originalName:o+"/momentum",variable:Ee(function(){return ue(i).variable(!1)})});var s=n.accumulations[a].variable,u=Array.isArray(e)?e[a].tensor:e[o];u!=null&&Ee(function(){var l,c=n.m.mul(s).add(u);l=n.useNesterov?n.c.mul(u.add(c.mul(n.m))).add(i):n.c.mul(c).add(i),s.assign(c),i.assign(l)})}),this.incrementIterations()},t.prototype.dispose=function(){this.m.dispose(),this.accumulations!=null&&Me(this.accumulations.map(function(e){return e.variable}))},t.prototype.setMomentum=function(e){this.momentum=e},t.prototype.getWeights=function(){return j(this,void 0,void 0,function(){return X(this,function(e){switch(e.label){case 0:return[4,this.saveIterations()];case 1:return[2,[e.sent()].concat(this.accumulations.map(function(n){return{name:n.originalName,tensor:n.variable}}))]}})})},t.prototype.setWeights=function(e){return j(this,void 0,void 0,function(){return X(this,function(n){switch(n.label){case 0:return[4,this.extractIterations(e)];case 1:return e=n.sent(),this.accumulations=e.map(function(o){return{originalName:o.name,variable:o.tensor.variable(!1)}}),[2]}})})},t.prototype.getConfig=function(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}},t.fromConfig=function(e,n){return new e(n.learningRate,n.momentum,n.useNesterov)},t.className="Momentum",t}(zr);Nn(ja);var Xa=function(r){function t(e,n,o,a,i){n===void 0&&(n=.9),o===void 0&&(o=0),a===void 0&&(a=null),i===void 0&&(i=!1);var s=r.call(this)||this;if(s.learningRate=e,s.decay=n,s.momentum=o,s.epsilon=a,s.accumulatedMeanSquares=[],s.accumulatedMoments=[],s.accumulatedMeanGrads=[],s.centered=i,a==null&&(s.epsilon=D.backend.epsilon()),e==null)throw new Error("learningRate for RMSPropOptimizer must be defined.");return s}return $e(t,r),t.prototype.applyGradients=function(e){var n=this;(Array.isArray(e)?e.map(function(o){return o.name}):Object.keys(e)).forEach(function(o,a){var i=D.registeredVariables[o];n.accumulatedMeanSquares[a]==null&&(n.accumulatedMeanSquares[a]={originalName:o+"/rms",variable:Ee(function(){return ue(i).variable(!1)})}),n.accumulatedMoments[a]==null&&(n.accumulatedMoments[a]={originalName:o+"/momentum",variable:Ee(function(){return ue(i).variable(!1)})}),n.accumulatedMeanGrads[a]==null&&n.centered&&(n.accumulatedMeanGrads[a]={originalName:o+"/mg",variable:Ee(function(){return ue(i).variable(!1)})});var s=Array.isArray(e)?e[a].tensor:e[o];if(s!=null){var u=n.accumulatedMeanSquares[a].variable,l=n.accumulatedMoments[a].variable;Ee(function(){var c=u.mul(n.decay).add(s.square().mul(1-n.decay));if(n.centered){var f=n.accumulatedMeanGrads[a].variable,h=f.mul(n.decay).add(s.mul(1-n.decay)),d=l.mul(n.momentum).add(s.mul(n.learningRate).div(c.sub(h.square().add(n.epsilon)).sqrt()));u.assign(c),f.assign(h),l.assign(d);var p=i.sub(d);i.assign(p)}else{var m=u.mul(n.decay).add(s.square().mul(1-n.decay));d=l.mul(n.momentum).add(s.mul(n.learningRate).div(m.add(n.epsilon).sqrt())),u.assign(m),l.assign(d),p=i.sub(d),i.assign(p)}})}}),this.incrementIterations()},t.prototype.dispose=function(){this.accumulatedMeanSquares!=null&&Me(this.accumulatedMeanSquares.map(function(e){return e.variable})),this.accumulatedMeanGrads!=null&&this.centered&&Me(this.accumulatedMeanGrads.map(function(e){return e.variable})),this.accumulatedMoments!=null&&Me(this.accumulatedMoments.map(function(e){return e.variable}))},t.prototype.getWeights=function(){return j(this,void 0,void 0,function(){var e;return X(this,function(n){switch(n.label){case 0:return e=this.accumulatedMeanSquares.concat(this.accumulatedMoments),this.centered&&e.push.apply(e,this.accumulatedMeanGrads),[4,this.saveIterations()];case 1:return[2,[n.sent()].concat(e.map(function(o){return{name:o.originalName,tensor:o.variable}}))]}})})},t.prototype.setWeights=function(e){return j(this,void 0,void 0,function(){var n;return X(this,function(o){switch(o.label){case 0:return[4,this.extractIterations(e)];case 1:return e=o.sent(),n=this.centered?e.length/3:e.length/2,this.accumulatedMeanSquares=e.slice(0,n).map(function(a){return{originalName:a.name,variable:a.tensor.variable(!1)}}),this.accumulatedMoments=e.slice(n,2*n).map(function(a){return{originalName:a.name,variable:a.tensor.variable(!1)}}),this.centered&&(this.accumulatedMeanGrads=e.slice(2*n,3*n).map(function(a){return{originalName:a.name,variable:a.tensor.variable(!1)}})),[2]}})})},t.prototype.getConfig=function(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}},t.fromConfig=function(e,n){return new e(n.learningRate,n.decay,n.momentum,n.epsilon,n.centered)},t.className="RMSProp",t}(Fn);Nn(Xa);var On=function(){function r(){}return r.sgd=function(t){return new zr(t)},r.momentum=function(t,e,n){return n===void 0&&(n=!1),new ja(t,e,n)},r.rmsprop=function(t,e,n,o,a){return e===void 0&&(e=.9),n===void 0&&(n=0),o===void 0&&(o=null),a===void 0&&(a=!1),new Xa(t,e,n,o,a)},r.adam=function(t,e,n,o){return t===void 0&&(t=.001),e===void 0&&(e=.9),n===void 0&&(n=.999),o===void 0&&(o=null),new qa(t,e,n,o)},r.adadelta=function(t,e,n){return t===void 0&&(t=.001),e===void 0&&(e=.95),n===void 0&&(n=null),new Ga(t,e,n)},r.adamax=function(t,e,n,o,a){return t===void 0&&(t=.002),e===void 0&&(e=.9),n===void 0&&(n=.999),o===void 0&&(o=null),a===void 0&&(a=0),new Ka(t,e,n,o,a)},r.adagrad=function(t,e){return e===void 0&&(e=.1),new Ha(t,e)},r}(),Kp={sgd:On.sgd,momentum:On.momentum,adadelta:On.adadelta,adagrad:On.adagrad,rmsprop:On.rmsprop,adamax:On.adamax,adam:On.adam},jp=typeof requestAnimationFrame<"u"?requestAnimationFrame:typeof setImmediate<"u"?setImmediate:function(r){return r()};function Xp(){return new Promise(function(r){return jp(function(){return r()})})}Se.prototype.squaredDifference=function(r){return ga(this,r)},O=mp;const Yp=Object.freeze(Object.defineProperty({__proto__:null,AdadeltaOptimizer:Ga,AdagradOptimizer:Ha,AdamOptimizer:qa,AdamaxOptimizer:Ka,DataStorage:ia,get ENV(){return Mo},Environment:Oi,KernelBackend:sa,MomentumOptimizer:ja,Optimizer:Fn,RMSPropOptimizer:Xa,get Rank(){return yo},get Reduction(){return _e},SGDOptimizer:zr,Tensor:Se,TensorBuffer:ht,Variable:Nt,abs:Wu,acos:Uu,acosh:zu,add:qn,addN:Tl,addStrict:Nl,all:Ac,any:Dc,argMax:Tc,argMin:Nc,asin:Vu,asinh:Gu,atan:Hu,atan2:Fl,atanh:qu,avgPool:xc,avgPool3d:Cc,backend:Xf,backend_util:fh,basicLSTMCell:Vc,batchNorm:Rl,batchNorm2d:Il,batchNorm3d:kl,batchNorm4d:Sl,batchNormalization:El,batchNormalization2d:bl,batchNormalization3d:wl,batchNormalization4d:Cl,batchToSpaceND:Qo,booleanMaskAsync:Zl,broadcastTo:Ms,browser:Up,buffer:ee,cast:Bs,ceil:Ku,clipByValue:ju,clone:Ps,complex:Ae,concat:Ye,concat1d:Ts,concat2d:Ns,concat3d:Fs,concat4d:_s,conv1d:tc,conv2d:gt,conv2dTranspose:uc,conv3d:rc,conv3dTranspose:lc,cos:Xu,cosh:Yu,cumsum:Ls,customGrad:Ht,deprecationWarn:Ko,depthToSpace:Ws,depthwiseConv2d:Mr,diag:Qc,disableDeprecationWarnings:Mf,dispose:Me,disposeVariables:Bf,div:Fr,divNoNan:_l,divStrict:Ol,dot:cc,dropout:Jc,elu:Ta,enableDebugMode:Of,enableProdMode:_f,engine:Pf,env:M,equal:Ra,equalStrict:Gl,erf:$u,exp:Qu,expandDims:hn,expm1:Ju,eye:Jo,fft:Br,fill:Cr,findBackend:qf,findBackendFactory:Kf,floor:Zu,floorDiv:Ca,frame:Wr,fused:af,gather:Or,gatherND:$c,gather_util:oh,getBackend:Gf,getGradient:Mi,getKernel:Bo,getKernelsForBackend:po,grad:sh,grads:uh,greater:Hl,greaterEqual:Ia,greaterEqualStrict:ql,greaterStrict:Kl,hammingWindow:Ba,hannWindow:Lr,ifft:Vt,imag:je,image:of,inTopKAsync:nf,io:Bp,irfft:Ma,isFinite:ll,isInf:ul,isNaN:sl,keep:Es,leakyRelu:Lc,less:jl,lessEqual:Xl,lessEqualStrict:Yl,lessStrict:$l,linalg:rf,linspace:Ds,localResponseNormalization:zc,log:el,log1p:nl,logSigmoid:tl,logSoftmax:ou,logSumExp:Fc,logicalAnd:jt,logicalNot:Al,logicalOr:ba,logicalXor:Dl,losses:tf,matMul:Aa,math:Lp,max:_c,maxPool:yc,maxPool3d:wc,maximum:_r,maximumStrict:Ml,mean:Oc,memory:Lf,min:Mc,minimum:Ea,minimumStrict:Bl,mod:Pl,modStrict:Ll,moments:Bc,movingAverage:Hc,mul:Ln,mulStrict:Wl,multiRNNCell:Gc,multinomial:Us,neg:ya,nextFrame:Xp,norm:Oa,notEqual:Ql,notEqualStrict:Jl,oneHot:dr,ones:jn,onesLike:Yo,op:T,outerProduct:fc,pad:mt,pad1d:zs,pad2d:Vs,pad3d:Gs,pad4d:Hs,pool:bc,pow:zt,powStrict:Ul,prelu:Na,print:Os,prod:Pc,profile:Wf,rand:qs,randomGamma:js,randomNormal:Ks,randomUniform:Zo,range:Bt,ready:Vf,real:Ve,reciprocal:rl,registerBackend:jf,registerGradient:Bi,registerKernel:Po,relu:Fa,relu6:_a,removeBackend:Hf,reshape:Ir,reverse:yt,reverse1d:hc,reverse2d:dc,reverse3d:pc,reverse4d:vc,rfft:Pr,round:ol,rsqrt:xa,scalar:$,scatterND:jc,scatter_util:ah,selu:Wc,separableConv2d:sc,serialization:zp,setBackend:zf,setPlatform:Yf,setdiff1dAsync:Ys,sigmoid:al,sign:il,signal:ef,sin:cl,sinh:fl,slice:mn,slice1d:Ec,slice2d:Rc,slice3d:Ic,slice4d:kc,slice_util:ih,softmax:Dr,softplus:hl,spaceToBatchND:ea,sparseToDense:Yc,spectral:Xc,split:Er,sqrt:dl,square:Lu,squaredDifference:ga,squaredDifferenceStrict:zl,squeeze:na,stack:kn,step:pl,stft:Pa,stridedSlice:qc,sub:An,subStrict:Vl,sum:Da,sumOutType:nr,tan:vl,tanh:ml,tensor:Ne,tensor1d:Gn,tensor2d:zn,tensor3d:Xo,tensor4d:bn,tensor5d:ks,tensor6d:Ss,tensor_util:Sf,test_util:Gp,tidy:Ee,tile:at,time:Uf,topk:Kc,train:Kp,transpose:Uc,truncatedNormal:Xs,unregisterGradient:wf,unregisterKernel:bf,unsortedSegmentSum:ka,unstack:kr,util:Cf,valueAndGrad:lh,valueAndGrads:ch,variable:As,variableGrads:ru,version_core:Hp,webgl:qp,where:Sn,whereAsync:wa,zeros:ye,zerosLike:ue},Symbol.toStringTag,{value:"Module"}));export{Yp as A,Fa as B,An as C,Ne as F,ye as G,Cr as H,al as I,sc as J,bn as L,Gn as M,of as O,kn as P,Nt as S,kr as U,Uc as W,Ye as Y,Ee as Z,zn as a,$ as b,Aa as c,Ln as d,Bp as e,xc as f,Dr as g,yc as h,Up as i,Xo as j,ju as k,Mr as l,Rl as m,Ir as n,at as o,mn as p,gt as q,qn as r,Fr as s,mt as t,ya as u,Qu as v,Se as w,Ic as x,hn as y,_c as z};
