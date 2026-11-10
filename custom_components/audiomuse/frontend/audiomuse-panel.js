var U=globalThis,L=U.ShadowRoot&&(U.ShadyCSS===void 0||U.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,D=Symbol(),st=new WeakMap,w=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==D)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(L&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=st.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&st.set(t,e))}return e}toString(){return this.cssText}},it=r=>new w(typeof r=="string"?r:r+"",void 0,D),W=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,a)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[a+1],r[0]);return new w(t,r,D)},rt=(r,e)=>{if(L)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=U.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},j=L?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return it(t)})(r):r;var{is:At,defineProperty:St,getOwnPropertyDescriptor:Et,getOwnPropertyNames:wt,getOwnPropertySymbols:kt,getPrototypeOf:Rt}=Object,O=globalThis,at=O.trustedTypes,Tt=at?at.emptyScript:"",Mt=O.reactiveElementPolyfillSupport,k=(r,e)=>r,q={toAttribute(r,e){switch(e){case Boolean:r=r?Tt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},ot=(r,e)=>!At(r,e),nt={attribute:!0,type:String,converter:q,reflect:!1,useDefault:!1,hasChanged:ot};Symbol.metadata??=Symbol("metadata"),O.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=nt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&St(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:a}=Et(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:i,set(n){let d=i?.call(this);a?.call(this,n),this.requestUpdate(e,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??nt}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;let e=Rt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){let t=this.properties,s=[...wt(t),...kt(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(j(i))}else e!==void 0&&t.push(j(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let a=(s.converter?.toAttribute!==void 0?s.converter:q).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),n=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:q;this._$Em=i;let d=n.fromAttribute(t,a.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(e!==void 0){let n=this.constructor;if(i===!1&&(a=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??ot)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),a!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,a]of s){let{wrapped:n}=a,d=this[i];n!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,a,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[k("elementProperties")]=new Map,y[k("finalized")]=new Map,Mt?.({ReactiveElement:y}),(O.reactiveElementVersions??=[]).push("2.1.2");var Z=globalThis,lt=r=>r,B=Z.trustedTypes,ht=B?B.createPolicy("lit-html",{createHTML:r=>r}):void 0,mt="$lit$",f=`lit$${Math.random().toFixed(9).slice(2)}$`,yt="?"+f,Pt=`<${yt}>`,x=document,T=()=>x.createComment(""),M=r=>r===null||typeof r!="object"&&typeof r!="function",G=Array.isArray,It=r=>G(r)||typeof r?.[Symbol.iterator]=="function",V=`[ 	
\f\r]`,R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,dt=/-->/g,ct=/>/g,v=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ut=/'/g,pt=/"/g,gt=/^(?:script|style|textarea|title)$/i,X=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),o=X(1),Wt=X(2),jt=X(3),A=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),_t=new WeakMap,b=x.createTreeWalker(x,129);function ft(r,e){if(!G(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ht!==void 0?ht.createHTML(e):e}var Ct=(r,e)=>{let t=r.length-1,s=[],i,a=e===2?"<svg>":e===3?"<math>":"",n=R;for(let d=0;d<t;d++){let l=r[d],u,p,c=-1,m=0;for(;m<l.length&&(n.lastIndex=m,p=n.exec(l),p!==null);)m=n.lastIndex,n===R?p[1]==="!--"?n=dt:p[1]!==void 0?n=ct:p[2]!==void 0?(gt.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=v):p[3]!==void 0&&(n=v):n===v?p[0]===">"?(n=i??R,c=-1):p[1]===void 0?c=-2:(c=n.lastIndex-p[2].length,u=p[1],n=p[3]===void 0?v:p[3]==='"'?pt:ut):n===pt||n===ut?n=v:n===dt||n===ct?n=R:(n=v,i=void 0);let g=n===v&&r[d+1].startsWith("/>")?" ":"";a+=n===R?l+Pt:c>=0?(s.push(u),l.slice(0,c)+mt+l.slice(c)+f+g):l+f+(c===-2?d:g)}return[ft(r,a+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},P=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,n=0,d=e.length-1,l=this.parts,[u,p]=Ct(e,t);if(this.el=r.createElement(u,s),b.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=b.nextNode())!==null&&l.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(mt)){let m=p[n++],g=i.getAttribute(c).split(f),H=/([.?@])?(.*)/.exec(m);l.push({type:1,index:a,name:H[2],strings:g,ctor:H[1]==="."?Q:H[1]==="?"?K:H[1]==="@"?Y:E}),i.removeAttribute(c)}else c.startsWith(f)&&(l.push({type:6,index:a}),i.removeAttribute(c));if(gt.test(i.tagName)){let c=i.textContent.split(f),m=c.length-1;if(m>0){i.textContent=B?B.emptyScript:"";for(let g=0;g<m;g++)i.append(c[g],T()),b.nextNode(),l.push({type:2,index:++a});i.append(c[m],T())}}}else if(i.nodeType===8)if(i.data===yt)l.push({type:2,index:a});else{let c=-1;for(;(c=i.data.indexOf(f,c+1))!==-1;)l.push({type:7,index:a}),c+=f.length-1}a++}}static createElement(e,t){let s=x.createElement("template");return s.innerHTML=e,s}};function S(r,e,t=r,s){if(e===A)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,a=M(e)?void 0:e._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=S(r,i._$AS(r,e.values),i,s)),e}var F=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??x).importNode(t,!0);b.currentNode=i;let a=b.nextNode(),n=0,d=0,l=s[0];for(;l!==void 0;){if(n===l.index){let u;l.type===2?u=new I(a,a.nextSibling,this,e):l.type===1?u=new l.ctor(a,l.name,l.strings,this,e):l.type===6&&(u=new J(a,this,e)),this._$AV.push(u),l=s[++d]}n!==l?.index&&(a=b.nextNode(),n++)}return b.currentNode=x,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},I=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=S(this,e,t),M(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==A&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):It(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&M(this._$AH)?this._$AA.nextSibling.data=e:this.T(x.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=P.createElement(ft(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let a=new F(i,this),n=a.u(this.options);a.p(t),this.T(n),this._$AH=a}}_$AC(e){let t=_t.get(e.strings);return t===void 0&&_t.set(e.strings,t=new P(e)),t}k(e){G(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let a of e)i===t.length?t.push(s=new r(this.O(T()),this.O(T()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=lt(e).nextSibling;lt(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(e,t=this,s,i){let a=this.strings,n=!1;if(a===void 0)e=S(this,e,t,0),n=!M(e)||e!==this._$AH&&e!==A,n&&(this._$AH=e);else{let d=e,l,u;for(e=a[0],l=0;l<a.length-1;l++)u=S(this,d[s+l],t,l),u===A&&(u=this._$AH[l]),n||=!M(u)||u!==this._$AH[l],u===h?e=h:e!==h&&(e+=(u??"")+a[l+1]),this._$AH[l]=u}n&&!i&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Q=class extends E{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},K=class extends E{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},Y=class extends E{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=S(this,e,t,0)??h)===A)return;let s=this._$AH,i=e===h&&s!==h||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==h&&(s===h||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},J=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){S(this,e)}};var Nt=Z.litHtmlPolyfillSupport;Nt?.(P,I),(Z.litHtmlVersions??=[]).push("3.3.3");var $t=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let a=t?.renderBefore??null;s._$litPart$=i=new I(e.insertBefore(T(),a),a,void 0,t??{})}return i._$AI(r),i};var tt=globalThis,$=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=$t(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};$._$litElement$=!0,$.finalized=!0,tt.litElementHydrateSupport?.({LitElement:$});var Ht=tt.litElementPolyfillSupport;Ht?.({LitElement:$});(tt.litElementVersions??=[]).push("4.2.2");var Ut=300,z=12,vt="audiomuse.entry",bt="audiomuse.player";function xt(r,e=60){let t=r.replace(/\s+/g," ").trim().replace(/^[.!?]+|[.!?]+$/g,"");if(t.length>e){let s=t.slice(0,e);t=(s.includes(" ")?s.slice(0,s.lastIndexOf(" ")):s).replace(/[,;:-]+$/,"")}return t?t[0].toUpperCase()+t.slice(1):"AudioMuse playlist"}function et(r){let e=[...r];for(let t=e.length-1;t>0;t--){let s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}return e}function C(r){return r==null?"? songs":`${r.toLocaleString()} song${r===1?"":"s"}`}function Lt(r,e=Date.now()){let t=Date.parse(r);if(Number.isNaN(t))return"";let s=Math.round((e-t)/6e4);if(s<1)return"just now";if(s<60)return`${s} min ago`;let i=Math.round(s/60);if(i<24)return`${i} h ago`;let a=Math.round(i/24);if(a<=6)return`${a} day${a===1?"":"s"} ago`;let n=new Date(t),d=l=>String(l).padStart(2,"0");return`${d(n.getDate())}-${d(n.getMonth()+1)}-${n.getFullYear()}`}function _(r){return r&&typeof r=="object"&&"message"in r?String(r.message):String(r)}var N=class extends ${constructor(){super();this._loading=!1;this._searchSeq=0;this.narrow=!1,this._entryId="",this._prompt="",this._count=25,this._name="",this._nameTouched=!1,this._busy="",this._error="",this._result=null,this._saved=null,this._player="",this._artistQuery="",this._artistResults=[],this._artistSearching=!1,this._selectedArtist="",this._similar=null,this._similarLoading=!1,this._includeSimilar=4,this._artistError="",this._radios=null,this._radiosBusy=!1,this._radiosMsg="",this._radiosError="",this._recent=[],this._toastRecent="",this._ideas=[],this._shownIdeas=[],this._ideasError="",this._loadError=""}updated(t){t.has("hass")&&this.hass&&!this._info&&!this._loading&&this._load()}get _entry(){return this._info?.entries.find(t=>t.entry_id===this._entryId)}get _canPlay(){return!!(this._entry?.playback&&this._info?.music_assistant&&this._info.players.length)}async _load(){if(this.hass){this._loading=!0;try{let t=await this.hass.callWS({type:"audiomuse/info"});this._info=t;let s=localStorage.getItem(vt),i=t.entries.find(a=>a.entry_id===s)??t.entries[0];i&&this._selectEntry(i.entry_id,!1),this._loadError=""}catch(t){this._loadError=_(t)}finally{this._loading=!1}}}_selectEntry(t,s=!0){let i=this._info?.entries.find(d=>d.entry_id===t);if(!i||!this._info)return;this._entryId=t,s&&localStorage.setItem(vt,t),this._count=i.default_count;let a=this._info.players.map(d=>d.entity_id),n=localStorage.getItem(bt);this._player=n&&a.includes(n)&&n||i.default_player&&a.includes(i.default_player)&&i.default_player||a[0]||"",this._result=null,this._saved=null,this._error="",this._artistQuery="",this._artistResults=[],this._selectedArtist="",this._similar=null,this._radiosMsg="",this._loadIdeas(),this._loadRadios(),this._loadRecent()}async _loadIdeas(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/ideas",entry_id:this._entryId});this._ideas=t.ideas,this._shownIdeas=et(t.ideas).slice(0,z),this._ideasError=""}catch(t){this._ideasError=_(t)}}_moreIdeas(){let t=new Set(this._shownIdeas),s=et(this._ideas.filter(i=>!t.has(i)));this._shownIdeas=(s.length>=z?s:et(this._ideas)).slice(0,z)}async _make(t){t!==void 0&&(this._prompt=t,this._nameTouched=!1);let s=this._prompt.trim();if(!(!s||!this.hass||this._busy)){this._busy="make",this._error="",this._result=null,this._saved=null;try{let i=await this.hass.callWS({type:"audiomuse/instant",entry_id:this._entryId,prompt:s,count:this._count});this._result={tracks:i.tracks,model:i.ai_model,source:"instant",detail:s,label:""},this._nameTouched||(this._name=xt(s))}catch(i){this._error=_(i)}finally{this._busy=""}}}async _save(t){if(!(!this.hass||!this._result?.tracks.length||this._busy)){this._busy=t?"play":"save",this._error="";try{let s={type:"audiomuse/save",entry_id:this._entryId,name:this._name.trim()||xt(this._result.detail),item_ids:this._result.tracks.map(i=>i.item_id),source:this._result.source,detail:this._result.detail};t&&this._player&&(s.play_on=this._player),this._saved=await this.hass.callWS(s),this._loadRecent()}catch(s){this._error=_(s)}finally{this._busy=""}}}async _playSaved(){if(!(!this.hass||!this._saved?.playlist_id||!this._player||this._busy)){this._busy="play",this._error="";try{await this.hass.callWS({type:"audiomuse/play",entry_id:this._entryId,playlist_id:this._saved.playlist_id,entity_id:this._player}),this._saved={...this._saved,played_on:this._player}}catch(t){this._error=_(t)}finally{this._busy=""}}}_onArtistInput(t){if(this._artistQuery=t,window.clearTimeout(this._searchTimer),t.trim().length<2){this._artistResults=[],this._artistSearching=!1;return}this._searchTimer=window.setTimeout(()=>{this._searchArtists(t.trim())},Ut)}async _searchArtists(t){if(!this.hass)return;let s=++this._searchSeq;this._artistSearching=!0,this._artistError="";try{let i=await this.hass.callWS({type:"audiomuse/search_artists",entry_id:this._entryId,query:t});s===this._searchSeq&&(this._artistResults=i.artists)}catch(i){s===this._searchSeq&&(this._artistError=_(i))}finally{s===this._searchSeq&&(this._artistSearching=!1)}}async _pickArtist(t){if(this.hass){this._selectedArtist=t,this._artistQuery=t,this._artistResults=[],this._similar=null,this._similarLoading=!0,this._artistError="";try{let s=await this.hass.callWS({type:"audiomuse/similar_artists",entry_id:this._entryId,artist:t,count:10});this._similar=s.artists}catch(s){this._artistError=_(s)}finally{this._similarLoading=!1}}}async _makeArtistMix(){let t=this._selectedArtist;if(!(!this.hass||!t||this._busy)){this._busy="make",this._error="",this._result=null,this._saved=null,this.shadowRoot?.querySelector(".make")?.scrollIntoView({behavior:"smooth",block:"start"});try{let s=await this.hass.callWS({type:"audiomuse/artist_mix",entry_id:this._entryId,artist:t,include_similar:this._includeSimilar,count:this._count}),i=s.artists.length-1;this._result={tracks:s.tracks,model:null,source:"artist",detail:t,label:i>0?`${t} and ${i} similar artist${i===1?"":"s"}`:t},this._name=i>0?`${t} and similar`:t,this._nameTouched=!1}catch(s){this._error=_(s)}finally{this._busy=""}}}async _loadRadios(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/radios",entry_id:this._entryId});this._radios=t.radios,this._radiosError=""}catch(t){this._radiosError=_(t)}}async _runRadios(){if(!(!this.hass||this._radiosBusy)){this._radiosBusy=!0,this._radiosMsg="",this._radiosError="";try{let t=await this.hass.callWS({type:"audiomuse/run_radios",entry_id:this._entryId}),s=t.playlists_created??0;this._radiosMsg=`Refreshed ${s} Radio playlist${s===1?"":"s"}.`+(t.failed.length?` Failed: ${t.failed.join(", ")}.`:" They keep the Radio's name in your music apps.")}catch(t){this._radiosError=_(t)}finally{this._radiosBusy=!1}}}async _loadRecent(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/recent",entry_id:this._entryId});this._recent=t.items}catch{this._recent=[]}}async _playRecent(t){if(!(!this.hass||!t.playlist_id||!this._player||this._busy)){this._busy="play",this._error="";try{await this.hass.callWS({type:"audiomuse/play",entry_id:this._entryId,playlist_id:t.playlist_id,entity_id:this._player}),this._toastRecent=`Playing ${t.playlist_name} on ${this._playerName(this._player)}`}catch(s){this._toastRecent=_(s)}finally{this._busy=""}}}async _forgetRecent(t){this.hass&&(await this.hass.callWS({type:"audiomuse/recent_remove",item_id:t.id}),this._recent=this._recent.filter(s=>s.id!==t.id))}_playerName(t){return this._info?.players.find(s=>s.entity_id===t)?.name??t??""}_toggleMenu(){this.dispatchEvent(new Event("hass-toggle-menu",{bubbles:!0,composed:!0}))}render(){return o`
      <div class="toolbar">
        ${this.narrow?customElements.get("ha-menu-button")?o`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:o`<button class="menu" aria-label="Menu" @click=${this._toggleMenu}>☰</button>`:h}
        <div class="title">AudioMuse</div>
        ${this._info&&this._info.entries.length>1?o`<select
              class="server"
              aria-label="AudioMuse-AI server"
              .value=${this._entryId}
              @change=${t=>this._selectEntry(t.target.value)}
            >
              ${this._info.entries.map(t=>o`<option value=${t.entry_id}>${t.title}</option>`)}
            </select>`:h}
      </div>
      <div class="content">${this._renderBody()}</div>
    `}_renderBody(){if(this._loadError)return o`<div class="card"><p class="error">Could not load AudioMuse: ${this._loadError}</p>
        <button @click=${()=>this._load()}>Try again</button></div>`;if(!this._info)return o`<div class="card"><p class="muted">Loading…</p></div>`;if(!this._info.entries.length)return o`<div class="card"><p>No AudioMuse-AI server is set up. Add one under
        <strong>Settings → Devices &amp; services → Add integration → AudioMuse-AI</strong>.</p></div>`;let t=this._entry;return o`
      ${this._renderStatus(t)}
      <div class="layout">
        <div class="col main">
          <section class="card make">${this._renderMake(t)}</section>
          <section class="card recent">${this._renderRecent()}</section>
        </div>
        <div class="col side">
          <section class="card ideas">${this._renderIdeas()}</section>
          <section class="card artists">${this._renderArtists()}</section>
          <section class="card radios">${this._renderRadios(t)}</section>
        </div>
      </div>
    `}_renderStatus(t){let s=[t.songs_analysed!=null?`${t.songs_analysed.toLocaleString(this.hass?.language)} songs analysed`:null,t.music_server?`${t.music_server}`:null,t.version?`AudioMuse-AI ${t.version}`:null,t.busy_workers?"analysis running":null].filter(Boolean);return o`<div class="status">${s.join(" \xB7 ")}</div>`}_renderMake(t){let s=this._busy!=="";return o`
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
            @change=${i=>{let a=parseInt(i.target.value,10);Number.isNaN(a)||(this._count=Math.min(Math.max(a,this._info.min_count),this._info.max_count))}}
        /></label>
        <button class="primary" ?disabled=${s||!this._prompt.trim()} @click=${()=>this._make()}>
          Make playlist
        </button>
      </div>
      ${this._busy==="make"?o`<div class="working"><span class="spinner"></span>Asking the AI to pick songs… this usually takes
            10–30 seconds.</div>`:h}
      ${this._error?o`<div class="error" role="alert">${this._error}</div>`:h}
      ${this._result?this._renderResult(t):h}
    `}_renderResult(t){let s=this._result,i=s.tracks,a=this._busy!=="",n=t.music_server_type??"this",d=h;return t.playback?this._info.music_assistant?this._info.players.length?t.playback_verified||(d=o`<p class="hint">Playback on ${n} servers hasn't been tested yet. If it doesn't
        work, please report it.</p>`):d=o`<p class="hint">No Music Assistant speakers found.</p>`:d=o`<p class="hint">Add the Music Assistant integration to play playlists on your speakers.</p>`:d=o`<p class="hint">Playing on speakers isn't available for ${n} servers. Save the
        playlist and play it from your music app.</p>`,o`
      <div class="result">
        <div class="result-head">
          <strong>${C(i.length)}</strong>${s.label?o`<span class="muted"> · ${s.label}</span>`:s.model?o`<span class="muted"> · picked by ${s.model}</span>`:h}
        </div>
        <ol class="tracks">
          ${i.map(l=>o`<li>
              <span class="track-title">${l.title}</span>
              <span class="track-meta">${l.artist}${l.album?o` · ${l.album}`:h}</span>
            </li>`)}
        </ol>
        <label class="name"
          >Playlist name
          <input
            .value=${this._name}
            @input=${l=>{this._name=l.target.value,this._nameTouched=!0}}
        /></label>
        <div class="actions">
          ${this._canPlay?o`<select
                  aria-label="Speaker"
                  .value=${this._player}
                  @change=${l=>{this._player=l.target.value,localStorage.setItem(bt,this._player)}}
                >
                  ${this._info.players.map(l=>o`<option value=${l.entity_id} ?selected=${l.entity_id===this._player}>${l.name}</option>`)}
                </select>
                <button class="primary" ?disabled=${a} @click=${()=>this._save(!0)}>
                  ${this._busy==="play"?"Starting\u2026":"Save & play"}
                </button>`:h}
          <button ?disabled=${a} @click=${()=>this._save(!1)}>
            ${this._busy==="save"?"Saving\u2026":"Save to library"}
          </button>
        </div>
        ${d}
        ${this._saved?o`<div class="saved" role="status">
              ✓ Saved as <strong>${this._saved.playlist_name}</strong>${this._saved.played_on?o` and playing on <strong>${this._playerName(this._saved.played_on)}</strong>`:h}. It will show up in your music apps.
              ${this._saved.playlist_id&&this._canPlay&&this._saved.played_on!==this._player?o`<button class="link" ?disabled=${a} @click=${()=>this._playSaved()}>
                    Play on ${this._playerName(this._player)}
                  </button>`:h}
            </div>`:h}
      </div>
    `}_renderIdeas(){return o`
      <h2>Playlist ideas</h2>
      <p class="muted">Suggestions from your library. Tap one to make it.</p>
      ${this._ideasError?o`<p class="error">${this._ideasError}</p>`:o`<div class="chips">
            ${this._shownIdeas.map(t=>o`<button class="chip" ?disabled=${this._busy!==""} @click=${()=>this._make(t)}>
                ${t}
              </button>`)}
          </div>`}
      ${this._ideas.length>z?o`<button class="link" @click=${()=>this._moreIdeas()}>More ideas</button>`:h}
    `}_renderArtists(){let t=this._busy!=="";return o`
      <h2>Similar artists</h2>
      <input
        class="search"
        type="search"
        aria-label="Search artists"
        placeholder="Search your artists"
        .value=${this._artistQuery}
        @input=${s=>this._onArtistInput(s.target.value)}
      />
      ${this._artistSearching?o`<p class="muted">Searching…</p>`:h}
      ${this._artistResults.length?o`<ul class="list">
            ${this._artistResults.map(s=>o`<li>
                <button class="row-button" @click=${()=>this._pickArtist(s.name)}>
                  <span>${s.name}</span><span class="muted">${C(s.track_count)}</span>
                </button>
              </li>`)}
          </ul>`:this._artistQuery.trim().length>=2&&!this._artistSearching&&!this._selectedArtist?o`<p class="muted">No analysed artist matches that.</p>`:h}
      ${this._artistError?o`<p class="error">${this._artistError}</p>`:h}
      ${this._selectedArtist&&!this._artistResults.length?o`
            ${this._similarLoading?o`<p class="muted">Finding similar artists…</p>`:h}
            ${this._similar?o`<p class="muted">Sounds like <strong>${this._selectedArtist}</strong>:</p>
                  ${this._similar.length?o`<ul class="list similar">
                        ${this._similar.map((s,i)=>o`<li class=${i<this._includeSimilar?"included":""}>
                            <button class="row-button" @click=${()=>this._pickArtist(s.name)}>
                              <span>${s.name}</span><span class="muted">${C(s.track_count)}</span>
                            </button>
                          </li>`)}
                      </ul>`:o`<p class="muted">No similar artists found yet.</p>`}
                  <div class="row">
                    <label class="count"
                      >Include
                      <input
                        type="number"
                        min="0"
                        max=${Math.min(20,this._similar.length)}
                        .value=${String(this._includeSimilar)}
                        @change=${s=>{let i=parseInt(s.target.value,10);Number.isNaN(i)||(this._includeSimilar=Math.min(Math.max(i,0),20))}}
                      />
                      similar</label
                    >
                    <button class="primary" ?disabled=${t} @click=${()=>this._makeArtistMix()}>Make a mix</button>
                  </div>`:h}
          `:h}
    `}_renderRadios(t){let s=(this._radios??[]).filter(i=>i.enabled).length;return o`
      <h2>Radios</h2>
      ${this._radiosError?o`<p class="error">${this._radiosError}</p>`:h}
      ${this._radios===null&&!this._radiosError?o`<p class="muted">Loading…</p>`:h}
      ${this._radios&&!this._radios.length?o`<p class="muted">No Radios yet. Create them on AudioMuse-AI's
            <a href=${`${t.url}/alchemy`} target="_blank" rel="noreferrer">Song Alchemy</a> page, then refresh them
            into your library from here.</p>`:h}
      ${this._radios?.length?o`<ul class="list">
              ${this._radios.map(i=>o`<li class="radio ${i.enabled?"":"off"}">
                  <span>${i.name}</span><span class="muted">${C(i.songs)}${i.enabled?"":" \xB7 off"}</span>
                </li>`)}
            </ul>
            <div class="row">
              <button ?disabled=${this._radiosBusy||!s} @click=${()=>this._runRadios()}>
                ${this._radiosBusy?"Refreshing\u2026":"Refresh into library"}
              </button>
            </div>`:h}
      ${this._radiosMsg?o`<p class="hint">${this._radiosMsg}</p>`:h}
    `}_renderRecent(){return o`
      <h2>Recent</h2>
      ${this._recent.length?o`<ul class="list recent-list">
            ${this._recent.map(t=>o`<li>
                <div class="recent-text">
                  <span>${t.playlist_name}</span>
                  <span class="muted"
                    >${Lt(t.created)} · ${C(t.track_count)}${t.detail?o` · ${t.source==="artist"?"artist":"request"}: ${t.detail}`:h}</span
                  >
                </div>
                ${this._canPlay&&t.playlist_id?o`<button ?disabled=${this._busy!==""} @click=${()=>this._playRecent(t)}>Play</button>`:h}
                <button class="icon" aria-label="Forget" title="Forget (the playlist stays in your library)"
                  @click=${()=>this._forgetRecent(t)}>×</button>
              </li>`)}
          </ul>`:o`<p class="muted">Playlists you save from Home Assistant appear here.</p>`}
      ${this._toastRecent?o`<p class="hint" role="status">${this._toastRecent}</p>`:h}
    `}};N.properties={hass:{attribute:!1},narrow:{type:Boolean},_info:{state:!0},_entryId:{state:!0},_prompt:{state:!0},_count:{state:!0},_name:{state:!0},_nameTouched:{state:!0},_busy:{state:!0},_error:{state:!0},_result:{state:!0},_artistQuery:{state:!0},_artistResults:{state:!0},_artistSearching:{state:!0},_selectedArtist:{state:!0},_similar:{state:!0},_similarLoading:{state:!0},_includeSimilar:{state:!0},_artistError:{state:!0},_radios:{state:!0},_radiosBusy:{state:!0},_radiosMsg:{state:!0},_radiosError:{state:!0},_recent:{state:!0},_toastRecent:{state:!0},_saved:{state:!0},_player:{state:!0},_ideas:{state:!0},_shownIdeas:{state:!0},_ideasError:{state:!0},_loadError:{state:!0}},N.styles=W`
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
    .layout {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .col {
      display: contents;
    }
    /* phone order: make, ideas, artists, recent, radios */
    .make { order: 1; }
    .ideas { order: 2; }
    .artists { order: 3; }
    .recent { order: 4; }
    .radios { order: 5; }
    @media (min-width: 900px) {
      .layout {
        flex-direction: row;
        align-items: flex-start;
      }
      .col {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 0;
      }
      .col.main { flex: 2; }
      .col.side { flex: 1; }
    }
    .search {
      width: 100%;
    }
    .list {
      list-style: none;
      margin: 8px 0 0;
      padding: 0;
    }
    .list li {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color, #eee);
    }
    .list li:last-child {
      border-bottom: none;
    }
    .row-button {
      flex: 1;
      display: flex;
      justify-content: space-between;
      gap: 8px;
      border: none;
      border-radius: 6px;
      padding: 4px 6px;
      color: var(--primary-text-color);
      text-align: left;
    }
    .row-button:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .similar li.included .row-button span:first-child {
      font-weight: 500;
    }
    .similar li.included::before {
      content: "✓";
      color: var(--primary-color);
      width: 1em;
    }
    .similar li:not(.included)::before {
      content: "";
      width: 1em;
    }
    .radio {
      justify-content: space-between;
    }
    .radio.off {
      opacity: 0.6;
    }
    .recent-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .recent-text span:first-child {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    button.icon {
      border: none;
      padding: 4px 8px;
      font-size: 18px;
      color: var(--secondary-text-color);
    }
    a {
      color: var(--primary-color);
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
  `;customElements.get("audiomuse-panel")||customElements.define("audiomuse-panel",N);export{xt as nameFromPrompt,C as songs,Lt as whenText};
