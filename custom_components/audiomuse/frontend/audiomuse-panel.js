var N=globalThis,U=N.ShadowRoot&&(N.ShadyCSS===void 0||N.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),et=new WeakMap,S=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(U&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=et.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&et.set(e,t))}return t}toString(){return this.cssText}},st=r=>new S(typeof r=="string"?r:r+"",void 0,B),D=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new S(e,r,B)},it=(r,t)=>{if(U)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=N.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},j=U?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return st(e)})(r):r;var{is:xt,defineProperty:At,getOwnPropertyDescriptor:Et,getOwnPropertyNames:St,getOwnPropertySymbols:wt,getPrototypeOf:kt}=Object,O=globalThis,rt=O.trustedTypes,Ct=rt?rt.emptyScript:"",Pt=O.reactiveElementPolyfillSupport,w=(r,t)=>r,W={toAttribute(r,t){switch(t){case Boolean:r=r?Ct:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},at=(r,t)=>!xt(r,t),nt={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:at};Symbol.metadata??=Symbol("metadata"),O.litPropertyMetadata??=new WeakMap;var m=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=nt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&At(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:n}=Et(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);n?.call(this,a),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??nt}static _$Ei(){if(this.hasOwnProperty(w("elementProperties")))return;let t=kt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(w("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(w("properties"))){let e=this.properties,s=[...St(e),...wt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(j(i))}else t!==void 0&&e.push(j(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return it(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:W).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:W;this._$Em=i;let o=a.fromAttribute(e,n.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){let a=this.constructor;if(i===!1&&(n=this[t]),s??=a.getPropertyOptions(t),!((s.hasChanged??at)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),n!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:a}=n,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,n,o)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};m.elementStyles=[],m.shadowRootOptions={mode:"open"},m[w("elementProperties")]=new Map,m[w("finalized")]=new Map,Pt?.({ReactiveElement:m}),(O.reactiveElementVersions??=[]).push("2.1.2");var Z=globalThis,ot=r=>r,L=Z.trustedTypes,lt=L?L.createPolicy("lit-html",{createHTML:r=>r}):void 0,_t="$lit$",g=`lit$${Math.random().toFixed(9).slice(2)}$`,mt="?"+g,Tt=`<${mt}>`,b=document,C=()=>b.createComment(""),P=r=>r===null||typeof r!="object"&&typeof r!="function",G=Array.isArray,Mt=r=>G(r)||typeof r?.[Symbol.iterator]=="function",V=`[ 	
\f\r]`,k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ht=/-->/g,dt=/>/g,v=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ct=/'/g,pt=/"/g,yt=/^(?:script|style|textarea|title)$/i,Q=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),d=Q(1),zt=Q(2),Bt=Q(3),x=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),ut=new WeakMap,$=b.createTreeWalker(b,129);function gt(r,t){if(!G(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return lt!==void 0?lt.createHTML(t):t}var It=(r,t)=>{let e=r.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",a=k;for(let o=0;o<e;o++){let l=r[o],p,u,c=-1,_=0;for(;_<l.length&&(a.lastIndex=_,u=a.exec(l),u!==null);)_=a.lastIndex,a===k?u[1]==="!--"?a=ht:u[1]!==void 0?a=dt:u[2]!==void 0?(yt.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=v):u[3]!==void 0&&(a=v):a===v?u[0]===">"?(a=i??k,c=-1):u[1]===void 0?c=-2:(c=a.lastIndex-u[2].length,p=u[1],a=u[3]===void 0?v:u[3]==='"'?pt:ct):a===pt||a===ct?a=v:a===ht||a===dt?a=k:(a=v,i=void 0);let y=a===v&&r[o+1].startsWith("/>")?" ":"";n+=a===k?l+Tt:c>=0?(s.push(p),l.slice(0,c)+_t+l.slice(c)+g+y):l+g+(c===-2?o:y)}return[gt(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},T=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,a=0,o=t.length-1,l=this.parts,[p,u]=It(t,e);if(this.el=r.createElement(p,s),$.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=$.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(_t)){let _=u[a++],y=i.getAttribute(c).split(g),H=/([.?@])?(.*)/.exec(_);l.push({type:1,index:n,name:H[2],strings:y,ctor:H[1]==="."?K:H[1]==="?"?F:H[1]==="@"?J:E}),i.removeAttribute(c)}else c.startsWith(g)&&(l.push({type:6,index:n}),i.removeAttribute(c));if(yt.test(i.tagName)){let c=i.textContent.split(g),_=c.length-1;if(_>0){i.textContent=L?L.emptyScript:"";for(let y=0;y<_;y++)i.append(c[y],C()),$.nextNode(),l.push({type:2,index:++n});i.append(c[_],C())}}}else if(i.nodeType===8)if(i.data===mt)l.push({type:2,index:n});else{let c=-1;for(;(c=i.data.indexOf(g,c+1))!==-1;)l.push({type:7,index:n}),c+=g.length-1}n++}}static createElement(t,e){let s=b.createElement("template");return s.innerHTML=t,s}};function A(r,t,e=r,s){if(t===x)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,n=P(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=A(r,i._$AS(r,t.values),i,s)),t}var q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??b).importNode(e,!0);$.currentNode=i;let n=$.nextNode(),a=0,o=0,l=s[0];for(;l!==void 0;){if(a===l.index){let p;l.type===2?p=new M(n,n.nextSibling,this,t):l.type===1?p=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(p=new Y(n,this,t)),this._$AV.push(p),l=s[++o]}a!==l?.index&&(n=$.nextNode(),a++)}return $.currentNode=b,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},M=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=A(this,t,e),P(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==x&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Mt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(b.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=T.createElement(gt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new q(i,this),a=n.u(this.options);n.p(e),this.T(a),this._$AH=n}}_$AC(t){let e=ut.get(t.strings);return e===void 0&&ut.set(t.strings,e=new T(t)),e}k(t){G(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new r(this.O(C()),this.O(C()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ot(t).nextSibling;ot(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(t,e=this,s,i){let n=this.strings,a=!1;if(n===void 0)t=A(this,t,e,0),a=!P(t)||t!==this._$AH&&t!==x,a&&(this._$AH=t);else{let o=t,l,p;for(t=n[0],l=0;l<n.length-1;l++)p=A(this,o[s+l],e,l),p===x&&(p=this._$AH[l]),a||=!P(p)||p!==this._$AH[l],p===h?t=h:t!==h&&(t+=(p??"")+n[l+1]),this._$AH[l]=p}a&&!i&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},K=class extends E{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},F=class extends E{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},J=class extends E{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=A(this,t,e,0)??h)===x)return;let s=this._$AH,i=t===h&&s!==h||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==h&&(s===h||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Y=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){A(this,t)}};var Rt=Z.litHtmlPolyfillSupport;Rt?.(T,M),(Z.litHtmlVersions??=[]).push("3.3.3");var ft=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let n=e?.renderBefore??null;s._$litPart$=i=new M(t.insertBefore(C(),n),n,void 0,e??{})}return i._$AI(r),i};var X=globalThis,f=class extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ft(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};f._$litElement$=!0,f.finalized=!0,X.litElementHydrateSupport?.({LitElement:f});var Ht=X.litElementPolyfillSupport;Ht?.({LitElement:f});(X.litElementVersions??=[]).push("4.2.2");var z=12,vt="audiomuse.entry",$t="audiomuse.player";function bt(r,t=60){let e=r.replace(/\s+/g," ").trim().replace(/^[.!?]+|[.!?]+$/g,"");if(e.length>t){let s=e.slice(0,t);e=(s.includes(" ")?s.slice(0,s.lastIndexOf(" ")):s).replace(/[,;:-]+$/,"")}return e?e[0].toUpperCase()+e.slice(1):"AudioMuse playlist"}function tt(r){let t=[...r];for(let e=t.length-1;e>0;e--){let s=Math.floor(Math.random()*(e+1));[t[e],t[s]]=[t[s],t[e]]}return t}function I(r){return r&&typeof r=="object"&&"message"in r?String(r.message):String(r)}var R=class extends f{constructor(){super();this._loading=!1;this.narrow=!1,this._entryId="",this._prompt="",this._count=25,this._name="",this._nameTouched=!1,this._busy="",this._error="",this._tracks=null,this._model=null,this._saved=null,this._player="",this._ideas=[],this._shownIdeas=[],this._ideasError="",this._loadError=""}updated(e){e.has("hass")&&this.hass&&!this._info&&!this._loading&&this._load()}get _entry(){return this._info?.entries.find(e=>e.entry_id===this._entryId)}get _canPlay(){return!!(this._entry?.playback&&this._info?.music_assistant&&this._info.players.length)}async _load(){if(this.hass){this._loading=!0;try{let e=await this.hass.callWS({type:"audiomuse/info"});this._info=e;let s=localStorage.getItem(vt),i=e.entries.find(n=>n.entry_id===s)??e.entries[0];i&&this._selectEntry(i.entry_id,!1),this._loadError=""}catch(e){this._loadError=I(e)}finally{this._loading=!1}}}_selectEntry(e,s=!0){let i=this._info?.entries.find(o=>o.entry_id===e);if(!i||!this._info)return;this._entryId=e,s&&localStorage.setItem(vt,e),this._count=i.default_count;let n=this._info.players.map(o=>o.entity_id),a=localStorage.getItem($t);this._player=a&&n.includes(a)&&a||i.default_player&&n.includes(i.default_player)&&i.default_player||n[0]||"",this._tracks=null,this._saved=null,this._error="",this._loadIdeas()}async _loadIdeas(){if(!(!this.hass||!this._entryId))try{let e=await this.hass.callWS({type:"audiomuse/ideas",entry_id:this._entryId});this._ideas=e.ideas,this._shownIdeas=tt(e.ideas).slice(0,z),this._ideasError=""}catch(e){this._ideasError=I(e)}}_moreIdeas(){let e=new Set(this._shownIdeas),s=tt(this._ideas.filter(i=>!e.has(i)));this._shownIdeas=(s.length>=z?s:tt(this._ideas)).slice(0,z)}async _make(e){e!==void 0&&(this._prompt=e,this._nameTouched=!1);let s=this._prompt.trim();if(!(!s||!this.hass||this._busy)){this._busy="make",this._error="",this._tracks=null,this._saved=null;try{let i=await this.hass.callWS({type:"audiomuse/instant",entry_id:this._entryId,prompt:s,count:this._count});this._tracks=i.tracks,this._model=i.ai_model,this._nameTouched||(this._name=bt(s))}catch(i){this._error=I(i)}finally{this._busy=""}}}async _save(e){if(!(!this.hass||!this._tracks?.length||this._busy)){this._busy=e?"play":"save",this._error="";try{let s={type:"audiomuse/save",entry_id:this._entryId,name:this._name.trim()||bt(this._prompt),item_ids:this._tracks.map(i=>i.item_id)};e&&this._player&&(s.play_on=this._player),this._saved=await this.hass.callWS(s)}catch(s){this._error=I(s)}finally{this._busy=""}}}async _playSaved(){if(!(!this.hass||!this._saved?.playlist_id||!this._player||this._busy)){this._busy="play",this._error="";try{await this.hass.callWS({type:"audiomuse/play",entry_id:this._entryId,playlist_id:this._saved.playlist_id,entity_id:this._player}),this._saved={...this._saved,played_on:this._player}}catch(e){this._error=I(e)}finally{this._busy=""}}}_playerName(e){return this._info?.players.find(s=>s.entity_id===e)?.name??e??""}_toggleMenu(){this.dispatchEvent(new Event("hass-toggle-menu",{bubbles:!0,composed:!0}))}render(){return d`
      <div class="toolbar">
        ${this.narrow?customElements.get("ha-menu-button")?d`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:d`<button class="menu" aria-label="Menu" @click=${this._toggleMenu}>☰</button>`:h}
        <div class="title">AudioMuse</div>
        ${this._info&&this._info.entries.length>1?d`<select
              class="server"
              aria-label="AudioMuse-AI server"
              .value=${this._entryId}
              @change=${e=>this._selectEntry(e.target.value)}
            >
              ${this._info.entries.map(e=>d`<option value=${e.entry_id}>${e.title}</option>`)}
            </select>`:h}
      </div>
      <div class="content">${this._renderBody()}</div>
    `}_renderBody(){if(this._loadError)return d`<div class="card"><p class="error">Could not load AudioMuse: ${this._loadError}</p>
        <button @click=${()=>this._load()}>Try again</button></div>`;if(!this._info)return d`<div class="card"><p class="muted">Loading…</p></div>`;if(!this._info.entries.length)return d`<div class="card"><p>No AudioMuse-AI server is set up. Add one under
        <strong>Settings → Devices &amp; services → Add integration → AudioMuse-AI</strong>.</p></div>`;let e=this._entry;return d`
      ${this._renderStatus(e)}
      <div class="grid">
        <section class="card make">${this._renderMake(e)}</section>
        <section class="card ideas">${this._renderIdeas()}</section>
      </div>
    `}_renderStatus(e){let s=[e.songs_analysed!=null?`${e.songs_analysed.toLocaleString(this.hass?.language)} songs analysed`:null,e.music_server?`${e.music_server}`:null,e.version?`AudioMuse-AI ${e.version}`:null,e.busy_workers?"analysis running":null].filter(Boolean);return d`<div class="status">${s.join(" \xB7 ")}</div>`}_renderMake(e){let s=this._busy!=="";return d`
      <h2>Make a playlist</h2>
      <textarea
        rows="3"
        aria-label="What do you want to hear?"
        placeholder="Describe what you want to hear, e.g. relaxed acoustic songs for a rainy afternoon"
        .value=${this._prompt}
        @input=${i=>this._prompt=i.target.value}
        @keydown=${i=>{i.key==="Enter"&&(i.ctrlKey||i.metaKey)&&this._make()}}
      ></textarea>
      <div class="row">
        <label class="count"
          >Songs
          <input
            type="number"
            min=${this._info.min_count}
            max=${this._info.max_count}
            .value=${String(this._count)}
            @change=${i=>{let n=parseInt(i.target.value,10);Number.isNaN(n)||(this._count=Math.min(Math.max(n,this._info.min_count),this._info.max_count))}}
        /></label>
        <button class="primary" ?disabled=${s||!this._prompt.trim()} @click=${()=>this._make()}>
          Make playlist
        </button>
      </div>
      ${this._busy==="make"?d`<div class="working"><span class="spinner"></span>Asking the AI to pick songs… this usually takes
            10–30 seconds.</div>`:h}
      ${this._error?d`<div class="error" role="alert">${this._error}</div>`:h}
      ${this._tracks?this._renderResult(e):h}
    `}_renderResult(e){let s=this._tracks,i=this._busy!=="",n=e.music_server_type??"this",a=h;return e.playback?this._info.music_assistant?this._info.players.length?e.playback_verified||(a=d`<p class="hint">Playback on ${n} servers hasn't been tested yet. If it doesn't
        work, please report it.</p>`):a=d`<p class="hint">No Music Assistant speakers found.</p>`:a=d`<p class="hint">Add the Music Assistant integration to play playlists on your speakers.</p>`:a=d`<p class="hint">Playing on speakers isn't available for ${n} servers. Save the
        playlist and play it from your music app.</p>`,d`
      <div class="result">
        <div class="result-head">
          <strong>${s.length} songs</strong>${this._model?d`<span class="muted"> · picked by ${this._model}</span>`:h}
        </div>
        <ol class="tracks">
          ${s.map(o=>d`<li>
              <span class="track-title">${o.title}</span>
              <span class="track-meta">${o.artist}${o.album?d` · ${o.album}`:h}</span>
            </li>`)}
        </ol>
        <label class="name"
          >Playlist name
          <input
            .value=${this._name}
            @input=${o=>{this._name=o.target.value,this._nameTouched=!0}}
        /></label>
        <div class="actions">
          ${this._canPlay?d`<select
                  aria-label="Speaker"
                  .value=${this._player}
                  @change=${o=>{this._player=o.target.value,localStorage.setItem($t,this._player)}}
                >
                  ${this._info.players.map(o=>d`<option value=${o.entity_id} ?selected=${o.entity_id===this._player}>${o.name}</option>`)}
                </select>
                <button class="primary" ?disabled=${i} @click=${()=>this._save(!0)}>
                  ${this._busy==="play"?"Starting\u2026":"Save & play"}
                </button>`:h}
          <button ?disabled=${i} @click=${()=>this._save(!1)}>
            ${this._busy==="save"?"Saving\u2026":"Save to library"}
          </button>
        </div>
        ${a}
        ${this._saved?d`<div class="saved" role="status">
              ✓ Saved as <strong>${this._saved.playlist_name}</strong>${this._saved.played_on?d` and playing on <strong>${this._playerName(this._saved.played_on)}</strong>`:h}. It will show up in your music apps.
              ${this._saved.playlist_id&&this._canPlay&&this._saved.played_on!==this._player?d`<button class="link" ?disabled=${i} @click=${()=>this._playSaved()}>
                    Play on ${this._playerName(this._player)}
                  </button>`:h}
            </div>`:h}
      </div>
    `}_renderIdeas(){return d`
      <h2>Playlist ideas</h2>
      <p class="muted">Suggestions from your library. Tap one to make it.</p>
      ${this._ideasError?d`<p class="error">${this._ideasError}</p>`:d`<div class="chips">
            ${this._shownIdeas.map(e=>d`<button class="chip" ?disabled=${this._busy!==""} @click=${()=>this._make(e)}>
                ${e}
              </button>`)}
          </div>`}
      ${this._ideas.length>z?d`<button class="link" @click=${()=>this._moreIdeas()}>More ideas</button>`:h}
    `}};R.properties={hass:{attribute:!1},narrow:{type:Boolean},_info:{state:!0},_entryId:{state:!0},_prompt:{state:!0},_count:{state:!0},_name:{state:!0},_nameTouched:{state:!0},_busy:{state:!0},_error:{state:!0},_tracks:{state:!0},_model:{state:!0},_saved:{state:!0},_player:{state:!0},_ideas:{state:!0},_shownIdeas:{state:!0},_ideasError:{state:!0},_loadError:{state:!0}},R.styles=D`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, inherit));
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      height: var(--header-height, 56px);
      padding: 0 12px;
      box-sizing: border-box;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, var(--text-primary-color, #fff));
      border-bottom: var(--app-header-border-bottom, none);
    }
    .title {
      flex: 1;
      font-size: 20px;
      margin-left: 8px;
    }
    .menu {
      background: none;
      border: none;
      color: inherit;
      font-size: 22px;
      cursor: pointer;
    }
    .server {
      max-width: 50%;
    }
    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
    }
    .status {
      color: var(--secondary-text-color);
      font-size: 14px;
      margin: 0 4px 12px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      align-items: start;
    }
    @media (min-width: 900px) {
      .grid {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
      }
    }
    .card {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      box-shadow: var(--ha-card-box-shadow, none);
      padding: 16px;
    }
    h2 {
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 12px;
    }
    textarea,
    input,
    select {
      font: inherit;
      color: var(--primary-text-color);
      background: var(--secondary-background-color, transparent);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      padding: 8px 10px;
      box-sizing: border-box;
    }
    textarea {
      width: 100%;
      resize: vertical;
    }
    .row,
    .actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
    }
    .row .primary {
      margin-left: auto;
    }
    .count input {
      width: 5em;
      margin-left: 6px;
    }
    label {
      font-size: 14px;
      color: var(--secondary-text-color);
    }
    .name {
      display: block;
      margin-top: 12px;
    }
    .name input {
      display: block;
      width: 100%;
      margin-top: 4px;
    }
    button {
      font: inherit;
      cursor: pointer;
      border-radius: 18px;
      padding: 8px 16px;
      border: 1px solid var(--primary-color);
      background: transparent;
      color: var(--primary-color);
    }
    button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    button.link {
      border: none;
      padding: 4px 0;
      border-radius: 0;
      text-decoration: underline;
    }
    .working {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 12px;
      color: var(--secondary-text-color);
    }
    .spinner {
      width: 18px;
      height: 18px;
      border: 3px solid var(--divider-color, #ccc);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
      flex: none;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    .error {
      color: var(--error-color, #db4437);
      margin-top: 12px;
    }
    .muted {
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
      margin: 8px 0 0;
    }
    .result {
      margin-top: 16px;
      border-top: 1px solid var(--divider-color, #ddd);
      padding-top: 12px;
    }
    .tracks {
      margin: 8px 0 0;
      padding-left: 1.6em;
      max-height: 420px;
      overflow-y: auto;
    }
    .tracks li {
      padding: 4px 0;
    }
    .track-title {
      display: block;
    }
    .track-meta {
      display: block;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .saved {
      margin-top: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 8px 0;
    }
    .chip {
      border-color: var(--divider-color, #ccc);
      color: var(--primary-text-color);
      padding: 6px 12px;
      font-size: 14px;
      text-align: left;
    }
  `;customElements.get("audiomuse-panel")||customElements.define("audiomuse-panel",R);export{bt as nameFromPrompt};
