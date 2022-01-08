(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[7],{496:function(e,n,t){"use strict";t.r(n),t.d(n,"default",(function(){return w}));var r=t(9),i=t(11),s=t(12),o=t(13),a=t(14),c=t(1),u=t.n(c),d=t(79),p=t.n(d),l=t(19),h=t(26),f=t.n(h),v=function(e,n,t,r){return new(t||(t=Promise))((function(i,s){function o(e){try{c(r.next(e))}catch(n){s(n)}}function a(e){try{c(r.throw(e))}catch(n){s(n)}}function c(e){var n;e.done?i(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(o,a)}c((r=r.apply(e,n||[])).next())}))},w=function(e){Object(o.a)(t,e);var n=Object(a.a)(t);function t(e,s){var o,a;if(Object(i.a)(this,t),(o=n.call(this))._network=s,o._publicKey=null,o._popup=null,o._handlerAdded=!1,o._nextRequestId=1,o._autoApprove=!1,o._responsePromises=new Map,o.handleMessage=function(e){var n;if(o._injectedProvider&&e.source===window||e.origin===(null===(n=o._providerUrl)||void 0===n?void 0:n.origin)&&e.source===o._popup)if("connected"===e.data.method){var t=new l.b(e.data.params.publicKey);o._publicKey&&o._publicKey.equals(t)||(o._publicKey&&!o._publicKey.equals(t)&&o.handleDisconnect(),o._publicKey=t,o._autoApprove=!!e.data.params.autoApprove,o.emit("connect",o._publicKey))}else if("disconnected"===e.data.method)o.handleDisconnect();else if(e.data.result||e.data.error){var i=o._responsePromises.get(e.data.id);if(i){var s=Object(r.a)(i,2),a=s[0],c=s[1];e.data.result?a(e.data.result):c(new Error(e.data.error))}}},o._beforeUnload=function(){o.disconnect()},function(e){return"object"===typeof e&&null!==e}(a=e)&&"postMessage"in a&&"function"===typeof a.postMessage)o._injectedProvider=e;else{if(!function(e){return"string"===typeof e}(e))throw new Error("provider parameter must be an injected provider or a URL string.");o._providerUrl=new URL(e),o._providerUrl.hash=new URLSearchParams({origin:window.location.origin,network:o._network}).toString()}return o}return Object(s.a)(t,[{key:"handleConnect",value:function(){var e,n=this;return this._handlerAdded||(this._handlerAdded=!0,window.addEventListener("message",this.handleMessage),window.addEventListener("beforeunload",this._beforeUnload)),this._injectedProvider?new Promise((function(e){n.sendRequest("connect",{}),e()})):(window.name="parent",this._popup=window.open(null===(e=this._providerUrl)||void 0===e?void 0:e.toString(),"_blank","location,resizable,width=460,height=675"),new Promise((function(e){n.once("connect",e)})))}},{key:"handleDisconnect",value:function(){var e=this;this._handlerAdded&&(this._handlerAdded=!1,window.removeEventListener("message",this.handleMessage),window.removeEventListener("beforeunload",this._beforeUnload)),this._publicKey&&(this._publicKey=null,this.emit("disconnect")),this._responsePromises.forEach((function(n,t){var i=Object(r.a)(n,2)[1];e._responsePromises.delete(t),i(new Error("Wallet disconnected"))}))}},{key:"sendRequest",value:function(e,n){return v(this,void 0,void 0,u.a.mark((function t(){var r,i=this;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if("connect"===e||this.connected){t.next=2;break}throw new Error("Wallet not connected");case 2:return r=this._nextRequestId,++this._nextRequestId,t.abrupt("return",new Promise((function(t,s){var o,a,c,u;i._responsePromises.set(r,[t,s]),i._injectedProvider?i._injectedProvider.postMessage({jsonrpc:"2.0",id:r,method:e,params:Object.assign({network:i._network},n)}):(null===(o=i._popup)||void 0===o||o.postMessage({jsonrpc:"2.0",id:r,method:e,params:n},null!==(c=null===(a=i._providerUrl)||void 0===a?void 0:a.origin)&&void 0!==c?c:""),i.autoApprove||null===(u=i._popup)||void 0===u||u.focus())})));case 5:case"end":return t.stop()}}),t,this)})))}},{key:"publicKey",get:function(){return this._publicKey}},{key:"connected",get:function(){return null!==this._publicKey}},{key:"autoApprove",get:function(){return this._autoApprove}},{key:"connect",value:function(){return v(this,void 0,void 0,u.a.mark((function e(){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this._popup&&this._popup.close(),e.next=3,this.handleConnect();case 3:case"end":return e.stop()}}),e,this)})))}},{key:"disconnect",value:function(){return v(this,void 0,void 0,u.a.mark((function e(){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!this._injectedProvider){e.next=3;break}return e.next=3,this.sendRequest("disconnect",{});case 3:this._popup&&this._popup.close(),this.handleDisconnect();case 5:case"end":return e.stop()}}),e,this)})))}},{key:"sign",value:function(e,n){return v(this,void 0,void 0,u.a.mark((function t(){var r,i,s;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e instanceof Uint8Array){t.next=2;break}throw new Error("Data must be an instance of Uint8Array");case 2:return t.next=4,this.sendRequest("sign",{data:e,display:n});case 4:return r=t.sent,i=f.a.decode(r.signature),s=new l.b(r.publicKey),t.abrupt("return",{signature:i,publicKey:s});case 8:case"end":return t.stop()}}),t,this)})))}},{key:"signTransaction",value:function(e){return v(this,void 0,void 0,u.a.mark((function n(){var t,r,i;return u.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,this.sendRequest("signTransaction",{message:f.a.encode(e.serializeMessage())});case 2:return t=n.sent,r=f.a.decode(t.signature),i=new l.b(t.publicKey),e.addSignature(i,r),n.abrupt("return",e);case 7:case"end":return n.stop()}}),n,this)})))}},{key:"signAllTransactions",value:function(e){return v(this,void 0,void 0,u.a.mark((function n(){var t,r,i;return u.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,this.sendRequest("signAllTransactions",{messages:e.map((function(e){return f.a.encode(e.serializeMessage())}))});case 2:return t=n.sent,r=t.signatures.map((function(e){return f.a.decode(e)})),i=new l.b(t.publicKey),e=e.map((function(e,n){return e.addSignature(i,r[n]),e})),n.abrupt("return",e);case 7:case"end":return n.stop()}}),n,this)})))}},{key:"diffieHellman",value:function(e){return v(this,void 0,void 0,u.a.mark((function n(){var t;return u.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(e instanceof Uint8Array){n.next=2;break}throw new Error("Data must be an instance of Uint8Array");case 2:return n.next=4,this.sendRequest("diffieHellman",{publicKey:e});case 4:return t=n.sent,n.abrupt("return",t);case 6:case"end":return n.stop()}}),n,this)})))}}]),t}(p.a)}}]);
//# sourceMappingURL=7.c2c3fd65.chunk.js.map