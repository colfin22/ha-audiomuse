var W=globalThis,O=W.ShadowRoot&&(W.ShadyCSS===void 0||W.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,D=Symbol(),rt=new WeakMap,E=class{constructor(i,t,e){if(this._$cssResult$=!0,e!==D)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=t}get styleSheet(){let i=this.o,t=this.t;if(O&&i===void 0){let e=t!==void 0&&t.length===1;e&&(i=rt.get(t)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),e&&rt.set(t,i))}return i}toString(){return this.cssText}},nt=l=>new E(typeof l=="string"?l:l+"",void 0,D),Q=(l,...i)=>{let t=l.length===1?l[0]:i.reduce((e,s,r)=>e+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+l[r+1],l[0]);return new E(t,l,D)},ot=(l,i)=>{if(O)l.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of i){let e=document.createElement("style"),s=W.litNonce;s!==void 0&&e.setAttribute("nonce",s),e.textContent=t.cssText,l.appendChild(e)}},j=O?l=>l:l=>l instanceof CSSStyleSheet?(i=>{let t="";for(let e of i.cssRules)t+=e.cssText;return nt(t)})(l):l;var{is:Tt,defineProperty:Rt,getOwnPropertyDescriptor:It,getOwnPropertyNames:Mt,getOwnPropertySymbols:Pt,getPrototypeOf:Ct}=Object,q=globalThis,lt=q.trustedTypes,Lt=lt?lt.emptyScript:"",Nt=q.reactiveElementPolyfillSupport,T=(l,i)=>l,F={toAttribute(l,i){switch(i){case Boolean:l=l?Lt:null;break;case Object:case Array:l=l==null?l:JSON.stringify(l)}return l},fromAttribute(l,i){let t=l;switch(i){case Boolean:t=l!==null;break;case Number:t=l===null?null:Number(l);break;case Object:case Array:try{t=JSON.parse(l)}catch{t=null}}return t}},ct=(l,i)=>!Tt(l,i),ht={attribute:!0,type:String,converter:F,reflect:!1,useDefault:!1,hasChanged:ct};Symbol.metadata??=Symbol("metadata"),q.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,t=ht){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(i,t),!t.noAccessor){let e=Symbol(),s=this.getPropertyDescriptor(i,e,t);s!==void 0&&Rt(this.prototype,i,s)}}static getPropertyDescriptor(i,t,e){let{get:s,set:r}=It(this.prototype,i)??{get(){return this[t]},set(a){this[t]=a}};return{get:s,set(a){let o=s?.call(this);r?.call(this,a),this.requestUpdate(i,o,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??ht}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let i=Ct(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let t=this.properties,e=[...Mt(t),...Pt(t)];for(let s of e)this.createProperty(s,t[s])}let i=this[Symbol.metadata];if(i!==null){let t=litPropertyMetadata.get(i);if(t!==void 0)for(let[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let s=this._$Eu(t,e);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let t=[];if(Array.isArray(i)){let e=new Set(i.flat(1/0).reverse());for(let s of e)t.unshift(j(s))}else i!==void 0&&t.push(j(i));return t}static _$Eu(i,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(i.set(e,this[e]),delete this[e]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ot(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,t,e){this._$AK(i,e)}_$ET(i,t){let e=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,e);if(s!==void 0&&e.reflect===!0){let r=(e.converter?.toAttribute!==void 0?e.converter:F).toAttribute(t,e.type);this._$Em=i,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(i,t){let e=this.constructor,s=e._$Eh.get(i);if(s!==void 0&&this._$Em!==s){let r=e.getPropertyOptions(s),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:F;this._$Em=s;let o=a.fromAttribute(t,r.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(i,t,e,s=!1,r){if(i!==void 0){let a=this.constructor;if(s===!1&&(r=this[i]),e??=a.getPropertyOptions(i),!((e.hasChanged??ct)(r,t)||e.useDefault&&e.reflect&&r===this._$Ej?.get(i)&&!this.hasAttribute(a._$Eu(i,e))))return;this.C(i,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,t,{useDefault:e,reflect:s,wrapped:r},a){e&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,a??t??this[i]),r!==!0||a!==void 0)||(this._$AL.has(i)||(this.hasUpdated||e||(t=void 0),this._$AL.set(i,t)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[s,r]of e){let{wrapped:a}=r,o=this[s];a!==!0||this._$AL.has(s)||o===void 0||this.C(s,void 0,r,o)}}let i=!1,t=this._$AL;try{i=this.shouldUpdate(t),i?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw i=!1,this._$EM(),e}i&&this._$AE(t)}willUpdate(i){}_$AE(i){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(i){}firstUpdated(i){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[T("elementProperties")]=new Map,y[T("finalized")]=new Map,Nt?.({ReactiveElement:y}),(q.reactiveElementVersions??=[]).push("2.1.2");var X=globalThis,dt=l=>l,U=X.trustedTypes,ut=U?U.createPolicy("lit-html",{createHTML:l=>l}):void 0,bt="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,$t="?"+b,Ht=`<${$t}>`,x=document,I=()=>x.createComment(""),M=l=>l===null||typeof l!="object"&&typeof l!="function",tt=Array.isArray,Wt=l=>tt(l)||typeof l?.[Symbol.iterator]=="function",V=`[ 	
\f\r]`,R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_t=/-->/g,pt=/>/g,f=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),mt=/'/g,yt=/"/g,ft=/^(?:script|style|textarea|title)$/i,et=l=>(i,...t)=>({_$litType$:l,strings:i,values:t}),n=et(1),Vt=et(2),Kt=et(3),S=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),gt=new WeakMap,v=x.createTreeWalker(x,129);function vt(l,i){if(!tt(l)||!l.hasOwnProperty("raw"))throw Error("invalid template strings array");return ut!==void 0?ut.createHTML(i):i}var Ot=(l,i)=>{let t=l.length-1,e=[],s,r=i===2?"<svg>":i===3?"<math>":"",a=R;for(let o=0;o<t;o++){let h=l[o],d,p,u=-1,m=0;for(;m<h.length&&(a.lastIndex=m,p=a.exec(h),p!==null);)m=a.lastIndex,a===R?p[1]==="!--"?a=_t:p[1]!==void 0?a=pt:p[2]!==void 0?(ft.test(p[2])&&(s=RegExp("</"+p[2],"g")),a=f):p[3]!==void 0&&(a=f):a===f?p[0]===">"?(a=s??R,u=-1):p[1]===void 0?u=-2:(u=a.lastIndex-p[2].length,d=p[1],a=p[3]===void 0?f:p[3]==='"'?yt:mt):a===yt||a===mt?a=f:a===_t||a===pt?a=R:(a=f,s=void 0);let g=a===f&&l[o+1].startsWith("/>")?" ":"";r+=a===R?h+Ht:u>=0?(e.push(d),h.slice(0,u)+bt+h.slice(u)+b+g):h+b+(u===-2?o:g)}return[vt(l,r+(l[t]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),e]},P=class l{constructor({strings:i,_$litType$:t},e){let s;this.parts=[];let r=0,a=0,o=i.length-1,h=this.parts,[d,p]=Ot(i,t);if(this.el=l.createElement(d,e),v.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=v.nextNode())!==null&&h.length<o;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(bt)){let m=p[a++],g=s.getAttribute(u).split(b),H=/([.?@])?(.*)/.exec(m);h.push({type:1,index:r,name:H[2],strings:g,ctor:H[1]==="."?Y:H[1]==="?"?G:H[1]==="@"?J:w}),s.removeAttribute(u)}else u.startsWith(b)&&(h.push({type:6,index:r}),s.removeAttribute(u));if(ft.test(s.tagName)){let u=s.textContent.split(b),m=u.length-1;if(m>0){s.textContent=U?U.emptyScript:"";for(let g=0;g<m;g++)s.append(u[g],I()),v.nextNode(),h.push({type:2,index:++r});s.append(u[m],I())}}}else if(s.nodeType===8)if(s.data===$t)h.push({type:2,index:r});else{let u=-1;for(;(u=s.data.indexOf(b,u+1))!==-1;)h.push({type:7,index:r}),u+=b.length-1}r++}}static createElement(i,t){let e=x.createElement("template");return e.innerHTML=i,e}};function k(l,i,t=l,e){if(i===S)return i;let s=e!==void 0?t._$Co?.[e]:t._$Cl,r=M(i)?void 0:i._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(l),s._$AT(l,t,e)),e!==void 0?(t._$Co??=[])[e]=s:t._$Cl=s),s!==void 0&&(i=k(l,s._$AS(l,i.values),s,e)),i}var K=class{constructor(i,t){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:t},parts:e}=this._$AD,s=(i?.creationScope??x).importNode(t,!0);v.currentNode=s;let r=v.nextNode(),a=0,o=0,h=e[0];for(;h!==void 0;){if(a===h.index){let d;h.type===2?d=new C(r,r.nextSibling,this,i):h.type===1?d=new h.ctor(r,h.name,h.strings,this,i):h.type===6&&(d=new Z(r,this,i)),this._$AV.push(d),h=e[++o]}a!==h?.index&&(r=v.nextNode(),a++)}return v.currentNode=x,s}p(i){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(i,e,t),t+=e.strings.length-2):e._$AI(i[t])),t++}},C=class l{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,t,e,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=i,this._$AB=t,this._$AM=e,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,t=this._$AM;return t!==void 0&&i?.nodeType===11&&(i=t.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,t=this){i=k(this,i,t),M(i)?i===c||i==null||i===""?(this._$AH!==c&&this._$AR(),this._$AH=c):i!==this._$AH&&i!==S&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):Wt(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==c&&M(this._$AH)?this._$AA.nextSibling.data=i:this.T(x.createTextNode(i)),this._$AH=i}$(i){let{values:t,_$litType$:e}=i,s=typeof e=="number"?this._$AC(i):(e.el===void 0&&(e.el=P.createElement(vt(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===s)this._$AH.p(t);else{let r=new K(s,this),a=r.u(this.options);r.p(t),this.T(a),this._$AH=r}}_$AC(i){let t=gt.get(i.strings);return t===void 0&&gt.set(i.strings,t=new P(i)),t}k(i){tt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,s=0;for(let r of i)s===t.length?t.push(e=new l(this.O(I()),this.O(I()),this,this.options)):e=t[s],e._$AI(r),s++;s<t.length&&(this._$AR(e&&e._$AB.nextSibling,s),t.length=s)}_$AR(i=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);i!==this._$AB;){let e=dt(i).nextSibling;dt(i).remove(),i=e}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},w=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,t,e,s,r){this.type=1,this._$AH=c,this._$AN=void 0,this.element=i,this.name=t,this._$AM=s,this.options=r,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=c}_$AI(i,t=this,e,s){let r=this.strings,a=!1;if(r===void 0)i=k(this,i,t,0),a=!M(i)||i!==this._$AH&&i!==S,a&&(this._$AH=i);else{let o=i,h,d;for(i=r[0],h=0;h<r.length-1;h++)d=k(this,o[e+h],t,h),d===S&&(d=this._$AH[h]),a||=!M(d)||d!==this._$AH[h],d===c?i=c:i!==c&&(i+=(d??"")+r[h+1]),this._$AH[h]=d}a&&!s&&this.j(i)}j(i){i===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},Y=class extends w{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===c?void 0:i}},G=class extends w{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==c)}},J=class extends w{constructor(i,t,e,s,r){super(i,t,e,s,r),this.type=5}_$AI(i,t=this){if((i=k(this,i,t,0)??c)===S)return;let e=this._$AH,s=i===c&&e!==c||i.capture!==e.capture||i.once!==e.once||i.passive!==e.passive,r=i!==c&&(e===c||s);s&&this.element.removeEventListener(this.name,this,e),r&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},Z=class{constructor(i,t,e){this.element=i,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(i){k(this,i)}};var qt=X.litHtmlPolyfillSupport;qt?.(P,C),(X.litHtmlVersions??=[]).push("3.3.3");var xt=(l,i,t)=>{let e=t?.renderBefore??i,s=e._$litPart$;if(s===void 0){let r=t?.renderBefore??null;e._$litPart$=s=new C(i.insertBefore(I(),r),r,void 0,t??{})}return s._$AI(l),s};var st=globalThis,$=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=xt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};$._$litElement$=!0,$.finalized=!0,st.litElementHydrateSupport?.({LitElement:$});var Ut=st.litElementPolyfillSupport;Ut?.({LitElement:$});(st.litElementVersions??=[]).push("4.2.2");var St=[["happy","Happy"],["sad","Sad"],["aggressive","Aggressive"],["relaxed","Relaxed"],["danceable","Danceable"]];function B(){return{mode:"song",query:"",results:[],searching:!1,song:null,mood:"happy",anchorId:null}}var At=[{id:"make",label:"Make a playlist"},{id:"song",label:"Playlist from Similar Song"},{id:"artists",label:"Similar artists"},{id:"path",label:"Song Path"},{id:"alchemy",label:"Song Alchemy"},{id:"lyrics",label:"Lyrics Search"}],L=300,z=12,Bt=[{icon:"\u{1F3B5}",label:"Similar Song",text:"Similar to By The Way by Red Hot Chili Peppers"},{icon:"\u{1F3B6}",label:"Multi-Song Mix",text:"Similar to Red Hot Chili Peppers - By The Way and Iron Maiden - Run to the Hills"},{icon:"\u{1F451}",label:"From Artist",text:"Songs like Madonna"},{icon:"\u{1F918}",label:"Artists Blend",text:"Sounds like Iron Maiden and Metallica combined"},{icon:"\u{1F3B9}",label:"Sound / Vibe",text:"Calm piano songs"},{icon:"\u{1F4DD}",label:"Lyrics Theme",text:"Songs about heartbreak in the rain",lyrics:!0},{icon:"\u{1F9E0}",label:"AI Brainstorming",text:"Top pop radio songs of 2025"},{icon:"\u{1F483}",label:"Genre / Mood / Year",text:"Sad jazz from the 90s in minor key"},{icon:"\u{1F9ED}",label:"Song Journey",text:"A journey from By The Way by Red Hot Chili Peppers to Run to the Hills by Iron Maiden"},{icon:"\u{1F3C3}",label:"Tempo + Exclusion",text:"Running playlist around 170 BPM, no rap"},{icon:"\u23F1\uFE0F",label:"Time Budget",text:"One hour of chill acoustic music, one song per artist"},{icon:"\u{1F195}",label:"Recently Added",text:"Songs added recently, under 4 minutes, no live versions"}],kt="audiomuse.entry",wt="audiomuse.player",Et="audiomuse.tab";function it(l,i=60){let t=l.replace(/\s+/g," ").trim().replace(/^[.!?]+|[.!?]+$/g,"");if(t.length>i){let e=t.slice(0,i);t=(e.includes(" ")?e.slice(0,e.lastIndexOf(" ")):e).replace(/[,;:-]+$/,"")}return t?t[0].toUpperCase()+t.slice(1):"AudioMuse playlist"}function at(l){let i=[...l];for(let t=i.length-1;t>0;t--){let e=Math.floor(Math.random()*(t+1));[i[t],i[e]]=[i[e],i[t]]}return i}function A(l){return l==null?"? songs":`${l.toLocaleString()} song${l===1?"":"s"}`}function zt(l,i=Date.now()){let t=Date.parse(l);if(Number.isNaN(t))return"";let e=Math.round((i-t)/6e4);if(e<1)return"just now";if(e<60)return`${e} min ago`;let s=Math.round(e/60);if(s<24)return`${s} h ago`;let r=Math.round(s/24);if(r<=6)return`${r} day${r===1?"":"s"} ago`;let a=new Date(t),o=h=>String(h).padStart(2,"0");return`${o(a.getDate())}-${o(a.getMonth()+1)}-${a.getFullYear()}`}function _(l){return l&&typeof l=="object"&&"message"in l?String(l.message):String(l)}var N=class extends ${constructor(){super();this._loading=!1;this._searchSeq=0;this._songSeq=0;this._pathTimers={};this._pathSeq={start:0,end:0};this._alcSeq=0;this._lySeq=0;this._lyAxesLoading=!1;this.narrow=!1,this._entryId="",this._prompt="",this._count=25,this._name="",this._nameTouched=!1,this._busy="",this._error="",this._result=null,this._saved=null,this._player="",this._artistQuery="",this._artistResults=[],this._artistSearching=!1,this._selectedArtist="",this._similar=null,this._similarLoading=!1,this._includeSimilar=4,this._artistError="",this._radios=null,this._radiosBusy=!1,this._radiosMsg="",this._radiosError="",this._recent=[],this._toastRecent="",this._mode="ai",this._makingMode="ai",this._elapsed=0,this._ideas=[],this._shownIdeas=[],this._ideasError="",this._loadError="";let t=localStorage.getItem(Et);this._tab=At.some(e=>e.id===t)?t:"make",this._resultTab="make",this._similarCount=10,this._why=!0,this._songQuery="",this._songResults=[],this._songSearching=!1,this._songError="",this._seedSong=null,this._seedMode="song",this._anchors=null,this._anchorId=null,this._songCount=25,this._limitPerArtist=!0,this._radius=!0,this._pathStart=B(),this._pathEnd=B(),this._pathCount=25,this._pathExact=!0,this._alcPart="mix",this._alcItems=[],this._alcQuery="",this._alcArtists=[],this._alcSongs=[],this._alcSearching=!1,this._alcCount=25,this._alcTemp=1,this._alcSubtract="",this._blendId=null,this._anchorName="",this._alcMsg="",this._renaming=null,this._newRadioAnchor=null,this._newRadioTemp=1,this._newRadioSongs=50,this._alcRemoved=0,this._lyWay="text",this._lyAxes=null,this._lyAxesError="",this._lyTargets={},this._lyText="",this._lyQuery="",this._lyResults=[],this._lySearching=!1,this._lySong=null,this._lyCount=25}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._ticker),window.clearTimeout(this._searchTimer),window.clearTimeout(this._songTimer),window.clearTimeout(this._pathTimers.start),window.clearTimeout(this._pathTimers.end),window.clearTimeout(this._alcTimer),window.clearTimeout(this._lyTimer)}_startTicker(){this._elapsed=0,window.clearInterval(this._ticker),this._ticker=window.setInterval(()=>this._elapsed+=1,1e3)}_stopTicker(){window.clearInterval(this._ticker)}_tabsFor(t){return At.filter(e=>e.id!=="lyrics"||t.lyrics_available)}_selectTab(t){this._tab=t,localStorage.setItem(Et,t),t==="lyrics"&&this._loadLyricsAxes()}updated(t){t.has("hass")&&this.hass&&!this._info&&!this._loading&&this._load()}get _entry(){return this._info?.entries.find(t=>t.entry_id===this._entryId)}get _canPlay(){return!!(this._entry?.playback&&this._info?.music_assistant&&this._info.players.length)}async _load(){if(this.hass){this._loading=!0;try{let t=await this.hass.callWS({type:"audiomuse/info"});this._info=t;let e=localStorage.getItem(kt),s=t.entries.find(r=>r.entry_id===e)??t.entries[0];s&&this._selectEntry(s.entry_id,!1),this._loadError=""}catch(t){this._loadError=_(t)}finally{this._loading=!1}}}async _reload(){this._info=void 0,await this._load()}_selectEntry(t,e=!0){let s=this._info?.entries.find(o=>o.entry_id===t);if(!s||!this._info)return;this._entryId=t,e&&localStorage.setItem(kt,t),this._count=s.default_count,this._songCount=s.default_count,this._pathCount=s.default_count,this._alcCount=s.default_count,this._lyCount=s.default_count,this._mode=s.ai_configured?"ai":"search";let r=this._info.players.map(o=>o.entity_id),a=localStorage.getItem(wt);this._player=a&&r.includes(a)&&a||s.default_player&&r.includes(s.default_player)&&s.default_player||r[0]||"",this._result=null,this._saved=null,this._error="",this._artistQuery="",this._artistResults=[],this._selectedArtist="",this._similar=null,this._radiosMsg="",this._songQuery="",this._songResults=[],this._seedSong=null,this._anchors=null,this._anchorId=null,this._pathStart=B(),this._pathEnd=B(),this._alcItems=[],this._alcQuery="",this._blendId=null,this._alcMsg="",this._lyAxes=null,this._lyTargets={},this._lySong=null,this._lyQuery="",this._lyResults=[],this._loadIdeas(),this._loadAnchors(),this._loadRadios(),this._loadRecent()}async _loadIdeas(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/ideas",entry_id:this._entryId});this._ideas=t.ideas,this._shownIdeas=at(t.ideas).slice(0,z),this._ideasError=""}catch(t){this._ideasError=_(t)}}_moreIdeas(){let t=new Set(this._shownIdeas),e=at(this._ideas.filter(s=>!t.has(s)));this._shownIdeas=(e.length>=z?e:at(this._ideas)).slice(0,z)}async _make(t,e){t!==void 0&&(this._prompt=t,this._nameTouched=!1);let s=this._prompt.trim();if(!s||!this.hass||this._busy)return;let r=e??(this._entry?.ai_configured?this._mode:"search");this._busy="make",this._resultTab="make",this._makingMode=r,this._error="",this._result=null,this._saved=null,this._startTicker();try{if(r==="ai"){let a=await this.hass.callWS({type:"audiomuse/instant",entry_id:this._entryId,prompt:s,count:this._count});this._result={tracks:a.tracks,model:a.ai_model,source:"instant",detail:s,label:""}}else{let a=await this.hass.callWS({type:"audiomuse/search",entry_id:this._entryId,query:s,count:this._count});this._result={tracks:a.tracks,model:null,source:"search",detail:s,label:"quick search"}}this._nameTouched||(this._name=it(s))}catch(a){this._error=_(a)}finally{this._stopTicker(),this._busy=""}}async _save(t){if(!(!this.hass||!this._result?.tracks.length||this._busy)){this._busy=t?"play":"save",this._error="";try{let e={type:"audiomuse/save",entry_id:this._entryId,name:this._name.trim()||it(this._result.detail),item_ids:this._result.tracks.map(s=>s.item_id),source:this._result.source,detail:this._result.detail};t&&this._player&&(e.play_on=this._player),this._saved=await this.hass.callWS(e),this._loadRecent()}catch(e){this._error=_(e)}finally{this._busy=""}}}async _playSaved(){if(!(!this.hass||!this._saved?.playlist_id||!this._player||this._busy)){this._busy="play",this._error="";try{await this.hass.callWS({type:"audiomuse/play",entry_id:this._entryId,playlist_id:this._saved.playlist_id,entity_id:this._player}),this._saved={...this._saved,played_on:this._player}}catch(t){this._error=_(t)}finally{this._busy=""}}}async _useSuggestion(t){this._prompt=t,this._mode="ai",this._nameTouched=!1,this._error="",await this.updateComplete;let e=this.shadowRoot?.querySelector("textarea");e&&(e.focus(),e.setSelectionRange(t.length,t.length))}_onArtistInput(t){if(this._artistQuery=t,window.clearTimeout(this._searchTimer),t.trim().length<2){this._artistResults=[],this._artistSearching=!1;return}this._searchTimer=window.setTimeout(()=>{this._searchArtists(t.trim())},L)}async _searchArtists(t){if(!this.hass)return;let e=++this._searchSeq;this._artistSearching=!0,this._artistError="";try{let s=await this.hass.callWS({type:"audiomuse/search_artists",entry_id:this._entryId,query:t});e===this._searchSeq&&(this._artistResults=s.artists)}catch(s){e===this._searchSeq&&(this._artistError=_(s))}finally{e===this._searchSeq&&(this._artistSearching=!1)}}async _pickArtist(t){if(this.hass){this._selectedArtist=t,this._artistQuery=t,this._artistResults=[],this._similar=null,this._similarLoading=!0,this._artistError="";try{let e=await this.hass.callWS({type:"audiomuse/similar_artists",entry_id:this._entryId,artist:t,count:this._similarCount,why:this._why});this._similar=e.artists}catch(e){this._artistError=_(e)}finally{this._similarLoading=!1}}}async _makeArtistMix(){let t=this._selectedArtist;if(!(!this.hass||!t||this._busy)){this._busy="make",this._resultTab="artists",this._error="",this._result=null,this._saved=null,this._makingMode="search",this._startTicker();try{let e=await this.hass.callWS({type:"audiomuse/artist_mix",entry_id:this._entryId,artist:t,include_similar:this._includeSimilar,count:this._count}),s=e.artists.length-1;this._result={tracks:e.tracks,model:null,source:"artist",detail:t,label:s>0?`${t} and ${s} similar artist${s===1?"":"s"}`:t},this._name=s>0?`${t} and similar`:t,this._nameTouched=!1}catch(e){this._error=_(e)}finally{this._stopTicker(),this._busy=""}}}async _loadAnchors(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/anchors",entry_id:this._entryId});this._anchors=t.anchors,this._anchorId===null&&t.anchors.length&&(this._anchorId=t.anchors[0].id)}catch{this._anchors=[]}}_onSongInput(t){if(this._songQuery=t,this._seedSong=null,window.clearTimeout(this._songTimer),t.trim().length<2){this._songResults=[],this._songSearching=!1;return}this._songTimer=window.setTimeout(()=>{this._searchSongs(t.trim())},L)}async _searchSongs(t){if(!this.hass)return;let e=++this._songSeq;this._songSearching=!0,this._songError="";try{let s=await this.hass.callWS({type:"audiomuse/search_tracks",entry_id:this._entryId,query:t});e===this._songSeq&&(this._songResults=s.tracks.slice(0,10))}catch(s){e===this._songSeq&&(this._songError=_(s))}finally{e===this._songSeq&&(this._songSearching=!1)}}_pickSong(t){this._seedSong=t,this._songQuery=t.title,this._songResults=[]}async _findSimilarSongs(){if(!this.hass||this._busy)return;let t=this._seedMode==="anchor"?this._anchors?.find(r=>r.id===this._anchorId):void 0,e=this._seedMode==="song"?this._seedSong:null;if(!e&&!t)return;let s=e?e.title:t.name;this._busy="make",this._resultTab="song",this._makingMode="search",this._error="",this._result=null,this._saved=null,this._startTicker();try{let r=await this.hass.callWS({type:"audiomuse/similar_tracks",entry_id:this._entryId,...e?{item_id:e.item_id}:{anchor_id:t.id},count:this._songCount,limit_per_artist:this._limitPerArtist,radius_similarity:this._radius});this._result={tracks:r.tracks,model:null,source:"song",detail:e?`${e.title} (${e.artist})`:`anchor: ${t.name}`,label:`like ${s}`},this._name=`Like ${s}`,this._nameTouched=!1}catch(r){this._error=_(r)}finally{this._stopTicker(),this._busy=""}}_getEnd(t){return t==="start"?this._pathStart:this._pathEnd}_setEnd(t,e){t==="start"?this._pathStart={...this._pathStart,...e}:this._pathEnd={...this._pathEnd,...e}}_setPathMode(t,e){let s=t==="start"?"end":"start",r=this._getEnd(s).mode;this._setEnd(t,{mode:e}),e==="lyrics"&&r!=="lyrics"?this._setEnd(s,{mode:"lyrics"}):e==="song"&&r==="lyrics"?this._setEnd(s,{mode:"song"}):(e==="mood"||e==="anchor")&&r!=="song"&&this._setEnd(s,{mode:"song"}),e==="anchor"&&this._getEnd(t).anchorId===null&&this._anchors?.length&&this._setEnd(t,{anchorId:this._anchors[0].id})}_onPathInput(t,e){if(this._setEnd(t,{query:e,song:null}),window.clearTimeout(this._pathTimers[t]),e.trim().length<2){this._setEnd(t,{results:[],searching:!1});return}this._pathTimers[t]=window.setTimeout(()=>{this._searchPathSongs(t,e.trim())},L)}async _searchPathSongs(t,e){if(!this.hass)return;let s=++this._pathSeq[t];this._setEnd(t,{searching:!0});try{let r=await this.hass.callWS({type:"audiomuse/search_tracks",entry_id:this._entryId,query:e});s===this._pathSeq[t]&&this._setEnd(t,{results:r.tracks.slice(0,8)})}catch(r){s===this._pathSeq[t]&&(this._error=_(r))}finally{s===this._pathSeq[t]&&this._setEnd(t,{searching:!1})}}_pathEndValue(t){if(t.mode==="song"||t.mode==="lyrics")return t.song?{type:"song",id:t.song.item_id}:null;if(t.mode==="mood")return{type:"mood",id:t.mood};let e=this._anchors?.find(s=>s.id===t.anchorId);return e?{type:"anchor",id:e.id}:null}_pathEndLabel(t){return t.mode==="song"||t.mode==="lyrics"?t.song?.title??"":t.mode==="mood"?St.find(([e])=>e===t.mood)?.[1]??t.mood:this._anchors?.find(e=>e.id===t.anchorId)?.name??""}async _findPath(){let t=this._pathEndValue(this._pathStart),e=this._pathEndValue(this._pathEnd);if(!this.hass||this._busy||!t||!e)return;let s=this._pathEndLabel(this._pathStart),r=this._pathEndLabel(this._pathEnd);this._busy="make",this._resultTab="path",this._makingMode="search",this._error="",this._result=null,this._saved=null,this._startTicker();try{let a=await this.hass.callWS({type:"audiomuse/find_path",entry_id:this._entryId,start:t,end:e,count:this._pathCount,exact:this._pathExact,lyrics:this._pathStart.mode==="lyrics"});this._result={tracks:a.tracks,model:null,source:"path",detail:`${s} \u2192 ${r}`,label:`${s} \u2192 ${r}`},this._name=`${s} to ${r}`,this._nameTouched=!1}catch(a){this._error=_(a)}finally{this._stopTicker(),this._busy=""}}_onAlchemyInput(t){if(this._alcQuery=t,window.clearTimeout(this._alcTimer),t.trim().length<2){this._alcArtists=[],this._alcSongs=[],this._alcSearching=!1;return}this._alcTimer=window.setTimeout(()=>{this._searchAlchemy(t.trim())},L)}async _searchAlchemy(t){if(!this.hass)return;let e=++this._alcSeq;this._alcSearching=!0;try{let[s,r]=await Promise.all([this.hass.callWS({type:"audiomuse/search_artists",entry_id:this._entryId,query:t}),this.hass.callWS({type:"audiomuse/search_tracks",entry_id:this._entryId,query:t})]);if(e!==this._alcSeq)return;this._alcArtists=s.artists.slice(0,4),this._alcSongs=r.tracks.slice(0,6)}catch(s){e===this._alcSeq&&(this._alcMsg=_(s))}finally{e===this._alcSeq&&(this._alcSearching=!1)}}_addAlchemyItem(t){this._alcItems.some(e=>e.type===t.type&&e.id===t.id)||(this._alcItems=[...this._alcItems,t]),this._alcQuery="",this._alcArtists=[],this._alcSongs=[]}async _runAlchemy(){let t=this._alcItems.filter(r=>r.op==="include");if(!this.hass||this._busy||!t.length)return;let e=t.map(r=>r.label).slice(0,3).join(" + ");this._busy="make",this._resultTab="alchemy",this._makingMode="search",this._error="",this._result=null,this._saved=null,this._blendId=null,this._alcMsg="",this._startTicker();let s=parseFloat(this._alcSubtract);try{this._alcRemoved=0;let r=await this.hass.callWS({type:"audiomuse/alchemy",entry_id:this._entryId,items:this._alcItems.map(({type:a,id:o,op:h})=>({type:a,id:o,op:h})),count:this._alcCount,temperature:this._alcTemp,...Number.isNaN(s)?{}:{subtract_distance:s}});this._result={tracks:r.tracks,model:null,source:"alchemy",detail:e,label:`alchemy: ${e}`},this._blendId=r.blend_id,this._alcRemoved=r.removed??0,this._name=`${e} alchemy`,this._anchorName=e,this._nameTouched=!1}catch(r){this._error=_(r)}finally{this._stopTicker(),this._busy=""}}async _saveAnchor(){if(!(!this.hass||!this._blendId||!this._anchorName.trim()))try{let t=await this.hass.callWS({type:"audiomuse/save_anchor",entry_id:this._entryId,blend_id:this._blendId,name:this._anchorName.trim()});this._alcMsg=`\u2713 Saved anchor "${t.anchor.name}". Use it in Playlist from Similar Song, Song Path and Radios.`,this._loadAnchors()}catch(t){this._alcMsg=_(t)}}async _alchemyCall(t,e){if(this.hass){this._radiosMsg="";try{await this.hass.callWS({entry_id:this._entryId,...t}),this._alcMsg=e}catch(s){this._alcMsg=_(s)}await Promise.all([this._loadAnchors(),this._loadRadios()])}}async _renameAnchor(){let t=this._renaming;!t||!t.name.trim()||(this._renaming=null,await this._alchemyCall({type:"audiomuse/rename_anchor",anchor_id:t.id,name:t.name.trim()},`\u2713 Renamed to "${t.name.trim()}".`))}async _deleteAnchor(t){let s=this._radios?.find(r=>r.anchor_id===t.id)?`Delete the anchor "${t.name}"? Its Radio is deleted too. Playlists already made stay in your library.`:`Delete the anchor "${t.name}"?`;window.confirm(s)&&(this._anchorId===t.id&&(this._anchorId=null),await this._alchemyCall({type:"audiomuse/delete_anchor",anchor_id:t.id},`\u2713 Deleted "${t.name}".`))}async _addRadio(){if(this._newRadioAnchor===null)return;let t=this._anchors?.find(e=>e.id===this._newRadioAnchor);await this._alchemyCall({type:"audiomuse/add_radio",anchor_id:this._newRadioAnchor,temperature:this._newRadioTemp,songs:this._newRadioSongs},`\u2713 Added the Radio "${t?.name??""}".`),this._newRadioAnchor=null}async _updateRadio(t,e){await this._alchemyCall({type:"audiomuse/update_radio",radio_id:t.id,...e},`\u2713 Saved "${t.name}".`)}async _deleteRadio(t){window.confirm(`Delete the Radio "${t.name}"? Its anchor is kept.`)&&await this._alchemyCall({type:"audiomuse/delete_radio",radio_id:t.id},`\u2713 Deleted the Radio "${t.name}".`)}async _loadLyricsAxes(){if(!(!this.hass||!this._entryId||this._lyAxes||this._lyAxesLoading)){this._lyAxesLoading=!0;try{let t=await this.hass.callWS({type:"audiomuse/lyrics_axes",entry_id:this._entryId});this._lyAxes=t.axes,this._lyAxesError=""}catch(t){this._lyAxesError=_(t)}finally{this._lyAxesLoading=!1}}}_onLyricsSongInput(t){if(this._lyQuery=t,this._lySong=null,window.clearTimeout(this._lyTimer),t.trim().length<2){this._lyResults=[],this._lySearching=!1;return}this._lyTimer=window.setTimeout(async()=>{if(!this.hass)return;let e=++this._lySeq;this._lySearching=!0;try{let s=await this.hass.callWS({type:"audiomuse/search_tracks",entry_id:this._entryId,query:t.trim()});e===this._lySeq&&(this._lyResults=s.tracks.slice(0,8))}catch(s){e===this._lySeq&&(this._error=_(s))}finally{e===this._lySeq&&(this._lySearching=!1)}},L)}_lyricsChosen(){return(this._lyAxes??[]).flatMap(t=>{let e=t.labels.find(s=>s.id===this._lyTargets[t.id]);return e?[e.name]:[]})}async _searchLyrics(){if(!this.hass||this._busy)return;let t=this._lyWay,e=Object.fromEntries(Object.entries(this._lyTargets).filter(([,o])=>o)),s=this._lyText.trim();if(t==="axis"&&!Object.keys(e).length||t==="text"&&!s||t==="song"&&!this._lySong)return;let r=this._lyricsChosen().join(" + "),a=t==="axis"?r:t==="text"?s:this._lySong.title;this._busy="make",this._resultTab="lyrics",this._makingMode="search",this._error="",this._result=null,this._saved=null,this._startTicker();try{let o=await this.hass.callWS({type:"audiomuse/lyrics_search",entry_id:this._entryId,count:this._lyCount,...t==="axis"?{targets:e}:t==="text"?{query:s}:{item_id:this._lySong.item_id}}),h=t==="song"?`lyrics like ${a}`:`lyrics: ${a}`;this._result={tracks:o.tracks,model:null,source:"lyrics",detail:a,label:h},this._name=t==="song"?`Lyrics like ${a}`:it(a),this._nameTouched=!1}catch(o){this._error=_(o)}finally{this._stopTicker(),this._busy=""}}async _loadRadios(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/radios",entry_id:this._entryId});this._radios=t.radios,this._radiosError=""}catch(t){this._radiosError=_(t)}}async _runRadios(){if(!(!this.hass||this._radiosBusy)){this._radiosBusy=!0,this._radiosMsg="",this._alcMsg="",this._radiosError="";try{let t=await this.hass.callWS({type:"audiomuse/run_radios",entry_id:this._entryId}),e=t.playlists_created??0;this._radiosMsg=`Refreshed ${e} Radio playlist${e===1?"":"s"}.`+(t.failed.length?` Failed: ${t.failed.join(", ")}.`:" They keep the Radio's name in your music apps.")}catch(t){this._radiosError=_(t)}finally{this._radiosBusy=!1}}}async _loadRecent(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/recent",entry_id:this._entryId});this._recent=t.items}catch{this._recent=[]}}async _playRecent(t){if(!(!this.hass||!t.playlist_id||!this._player||this._busy)){this._busy="play",this._error="";try{await this.hass.callWS({type:"audiomuse/play",entry_id:this._entryId,playlist_id:t.playlist_id,entity_id:this._player}),this._toastRecent=`Playing ${t.display_name??t.playlist_name} on ${this._playerName(this._player)}`}catch(e){this._toastRecent=_(e)}finally{this._busy=""}}}async _forgetRecent(t){this.hass&&(await this.hass.callWS({type:"audiomuse/recent_remove",item_id:t.id}),this._recent=this._recent.filter(e=>e.id!==t.id))}_playerName(t){return this._info?.players.find(e=>e.entity_id===t)?.name??t??""}_toggleMenu(){this.dispatchEvent(new Event("hass-toggle-menu",{bubbles:!0,composed:!0}))}render(){return n`
      <div class="toolbar">
        ${this.narrow?customElements.get("ha-menu-button")?n`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:n`<button class="menu" aria-label="Menu" @click=${this._toggleMenu}>☰</button>`:c}
        <div class="title">AudioMuse</div>
        ${this._info&&this._info.entries.length>1?n`<select
              class="server"
              aria-label="AudioMuse-AI server"
              .value=${this._entryId}
              @change=${t=>this._selectEntry(t.target.value)}
            >
              ${this._info.entries.map(t=>n`<option value=${t.entry_id}>${t.title}</option>`)}
            </select>`:c}
      </div>
      <div class="content">${this._renderBody()}</div>
    `}_renderBody(){if(this._loadError)return n`<div class="card"><p class="error">Could not load AudioMuse: ${this._loadError}</p>
        <button @click=${()=>this._load()}>Try again</button></div>`;if(!this._info)return n`<div class="card"><p class="muted">Loading…</p></div>`;if(!this._info.entries.length&&this._info.unavailable.length)return n`<div class="card banner">
        <p><strong>${this._info.unavailable.map(e=>e.title).join(", ")}</strong> can't be reached right now.
          Home Assistant keeps retrying in the background.</p>
        ${this._info.unavailable[0].reason?n`<p class="muted">${this._info.unavailable[0].reason}</p>`:c}
        <button @click=${()=>this._reload()}>Try again</button>
      </div>`;if(!this._info.entries.length)return n`<div class="card"><p>No AudioMuse-AI server is set up. Add one under
        <strong>Settings → Devices &amp; services → Add integration → AudioMuse-AI</strong>.</p></div>`;let t=this._entry;return n`
      ${t.available?c:n`<div class="card banner warn" role="alert">AudioMuse-AI isn't answering right now, so actions may
            fail. Home Assistant keeps retrying. <button class="link" @click=${()=>this._reload()}>Refresh</button></div>`}
      ${this._renderStatus(t)}
      <nav class="tabs" role="tablist" aria-label="AudioMuse">
        ${this._tabsFor(t).map(e=>n`<button
            role="tab"
            id=${`tab-${e.id}`}
            class="tab ${this._shownTab(t)===e.id?"on":""}"
            aria-selected=${this._shownTab(t)===e.id}
            aria-controls="tabpanel"
            @click=${s=>{this._selectTab(e.id),this._scrollTabIntoView(s.currentTarget)}}
          >${e.label}</button>`)}
      </nav>
      <section class="card" id="tabpanel" role="tabpanel" aria-labelledby=${`tab-${this._shownTab(t)}`}>
        ${this._shownTab(t)==="make"?n`${this._renderMake(t)}
              <div class="section">${this._renderIdeas()}</div>
              <div class="section">${this._renderRecent()}</div>`:this._shownTab(t)==="song"?this._renderSong(t):this._shownTab(t)==="artists"?this._renderArtists(t):this._shownTab(t)==="path"?this._renderPath(t):this._shownTab(t)==="lyrics"?this._renderLyrics(t):this._renderAlchemy(t)}
      </section>
    `}_shownTab(t){return this._tabsFor(t).some(e=>e.id===this._tab)?this._tab:"make"}_scrollTabIntoView(t){let e=t.parentElement;if(!e)return;let s=t.offsetLeft-e.offsetLeft,r=s+t.offsetWidth;s<e.scrollLeft?e.scrollLeft=s-8:r>e.scrollLeft+e.clientWidth&&(e.scrollLeft=r-e.clientWidth+8)}_renderOutcome(t,e){return this._resultTab!==t?c:n`
      ${this._busy==="make"?n`<div class="working" role="status"><span class="spinner"></span>${this._makingMode==="ai"?`Asking the AI to pick songs\u2026 ${this._elapsed} s (usually 10\u201330 s)`:`Finding songs\u2026 ${this._elapsed} s`}</div>`:c}
      ${this._error?n`<div class="error" role="alert">${this._error}</div>`:c}
      ${this._result?this._renderResult(e):c}
    `}_renderStatus(t){let e=[t.songs_analysed!=null?`${t.songs_analysed.toLocaleString(this.hass?.language)} songs analysed`:null,t.music_server?`${t.music_server}`:null,t.lyrics_available&&t.lyrics_songs?`${t.lyrics_songs.toLocaleString(this.hass?.language)} with lyrics`:null,t.version?`AudioMuse-AI ${t.version}`:null,t.busy_workers?"analysis running":null].filter(Boolean),s=[t.songs_analysed!=null?A(t.songs_analysed):null,t.music_server?`${t.music_server}`:null,t.version?`${t.version}`:null,t.busy_workers?"analysing":null].filter(Boolean);return n`<div class="status">
      <span class="long">${e.join(" \xB7 ")}</span><span class="short">${s.join(" \xB7 ")}</span>
    </div>`}_renderMake(t){let e=this._busy!=="";return n`
      <h2>Make a playlist</h2>
      <textarea
        rows="3"
        aria-label="What do you want to hear?"
        placeholder="Describe what you want to hear, e.g. relaxed acoustic songs for a rainy afternoon"
        .value=${this._prompt}
        @input=${s=>this._prompt=s.target.value}
        @keydown=${s=>{s.key==="Enter"&&(s.ctrlKey||s.metaKey)&&this._make()}}
      ></textarea>
      ${t.ai_configured?n`<div class="suggestions" role="group" aria-label="Suggestions: tap to fill the box, then edit">
            ${Bt.filter(s=>!s.lyrics||t.lyrics_available).map(s=>n`<button
                class="suggestion"
                title=${s.text}
                ?disabled=${e}
                @click=${()=>this._useSuggestion(s.text)}
              ><span aria-hidden="true">${s.icon}</span> ${s.label}</button>`)}
          </div>`:c}
      <div class="row">
        <div class="mode" role="radiogroup" aria-label="How to pick songs">
          <button
            role="radio"
            aria-checked=${this._mode==="ai"}
            class=${this._mode==="ai"&&t.ai_configured?"on":""}
            ?disabled=${!t.ai_configured||e}
            title=${t.ai_configured?"AudioMuse-AI's AI picks the songs":"Needs an AI provider"}
            @click=${()=>this._mode="ai"}
          >AI pick</button>
          <button
            role="radio"
            aria-checked=${this._mode==="search"||!t.ai_configured}
            class=${this._mode==="search"||!t.ai_configured?"on":""}
            ?disabled=${e}
            title="AudioMuse-AI's text search: faster, no AI needed"
            @click=${()=>this._mode="search"}
          >Quick search</button>
        </div>
        <label class="count"
          >Songs
          <input
            type="number"
            min=${this._info.min_count}
            max=${this._info.max_count}
            .value=${String(this._count)}
            @change=${s=>{let r=parseInt(s.target.value,10);Number.isNaN(r)||(this._count=Math.min(Math.max(r,this._info.min_count),this._info.max_count))}}
        /></label>
        <button class="primary" ?disabled=${e||!this._prompt.trim()} @click=${()=>this._make()}>
          Make playlist
        </button>
      </div>
      ${t.ai_configured?c:n`<p class="hint">AI pick needs an AI provider. Set one in AudioMuse-AI's
            <a href=${`${t.url}/setup`} target="_blank" rel="noreferrer">Setup Wizard</a> or in this integration's
            options. Quick search works without it.</p>`}
      ${this._renderOutcome("make",t)}
    `}_renderResult(t){let e=this._result,s=e.tracks,r=this._busy!=="",a=t.music_server_type??"this",o=c;return t.playback?this._info.music_assistant?this._info.players.length?t.playback_verified||(o=n`<p class="hint">Playback on ${a} servers hasn't been tested yet. If it doesn't
        work, please report it.</p>`):o=n`<p class="hint">No Music Assistant speakers found.</p>`:o=n`<p class="hint">Add the Music Assistant integration to play playlists on your speakers.</p>`:o=n`<p class="hint">Playing on speakers isn't available for ${a} servers. Save the
        playlist and play it from your music app.</p>`,n`
      <div class="result">
        <div class="result-head">
          <strong>${A(s.length)}</strong>${e.label?n`<span class="muted"> · ${e.label}</span>`:e.model?n`<span class="muted"> · picked by ${e.model}</span>`:c}
        </div>
        <ol class="tracks">
          ${s.map(h=>n`<li>
              <span class="track-title">${h.title}</span>
              <span class="track-meta">${h.artist}${h.album?n` · ${h.album}`:c}</span>
            </li>`)}
        </ol>
        <label class="name"
          >Playlist name
          <input
            .value=${this._name}
            @input=${h=>{this._name=h.target.value,this._nameTouched=!0}}
        /></label>
        <div class="actions">
          ${this._canPlay?n`<select
                  aria-label="Speaker"
                  .value=${this._player}
                  @change=${h=>{this._player=h.target.value,localStorage.setItem(wt,this._player)}}
                >
                  ${this._info.players.map(h=>n`<option value=${h.entity_id} ?selected=${h.entity_id===this._player}>${h.name}</option>`)}
                </select>
                <button class="primary" ?disabled=${r} @click=${()=>this._save(!0)}>
                  ${this._busy==="play"?"Starting\u2026":"Save & play"}
                </button>`:c}
          <button ?disabled=${r} @click=${()=>this._save(!1)}>
            ${this._busy==="save"?"Saving\u2026":"Save to library"}
          </button>
        </div>
        ${o}
        ${this._saved?n`<div class="saved" role="status">
              ✓ Saved as <strong>${this._saved.playlist_name}</strong>${this._saved.played_on?n` and playing on <strong>${this._playerName(this._saved.played_on)}</strong>`:c}. It will show up in your music apps.
              ${this._saved.playlist_id&&this._canPlay&&this._saved.played_on!==this._player?n`<button class="link" ?disabled=${r} @click=${()=>this._playSaved()}>
                    Play on ${this._playerName(this._player)}
                  </button>`:c}
            </div>`:c}
      </div>
    `}_renderIdeas(){return n`
      <h3>Playlist ideas</h3>
      <p class="muted">Suggestions from your library. Tap one for a quick playlist (no AI needed).</p>
      ${!this._ideas.length&&!this._ideasError?n`<p class="muted">Loading ideas…</p>`:c}
      ${this._ideasError?n`<p class="error">${this._ideasError}</p>`:n`<div class="chips">
            ${this._shownIdeas.map(t=>n`<button class="chip" ?disabled=${this._busy!==""} @click=${()=>{this._mode="search",this._make(t,"search")}}>
                ${t}
              </button>`)}
          </div>`}
      ${this._ideas.length>z?n`<button class="link" @click=${()=>this._moreIdeas()}>More ideas</button>`:c}
    `}_renderSong(t){let e=this._busy!=="",s=this._anchors??[],r=this._seedMode==="song"?!!this._seedSong:this._anchorId!==null&&s.length>0;return n`
      <h2>Playlist from Similar Song</h2>
      <p class="intro">Pick a song and get a playlist of songs that sound like it.</p>
      <div class="mode seed" role="radiogroup" aria-label="Start from">
        <button
          role="radio"
          aria-checked=${this._seedMode==="song"}
          class=${this._seedMode==="song"?"on":""}
          @click=${()=>this._seedMode="song"}
        >🎵 Song</button>
        <button
          role="radio"
          aria-checked=${this._seedMode==="anchor"}
          class=${this._seedMode==="anchor"?"on":""}
          @click=${()=>this._seedMode="anchor"}
        >Anchor</button>
      </div>
      ${this._seedMode==="song"?n`<input
              class="search"
              type="search"
              aria-label="Song, artist or album"
              placeholder="Song, artist or album"
              .value=${this._songQuery}
              @input=${a=>this._onSongInput(a.target.value)}
              @keydown=${a=>{a.key==="Enter"&&this._songResults.length&&this._pickSong(this._songResults[0])}}
            />
            ${this._songSearching?n`<p class="muted">Searching…</p>`:c}
            ${this._songError?n`<p class="error">${this._songError}</p>`:c}
            ${this._songResults.length?n`<ul class="list">
                  ${this._songResults.map(a=>n`<li>
                      <button class="row-button" @click=${()=>this._pickSong(a)}>
                        <span class="artist-text"
                          ><span>${a.title}</span><small>${a.artist}${a.album?` \xB7 ${a.album}`:""}</small></span
                        >
                      </button>
                    </li>`)}
                </ul>`:this._songQuery.trim().length>=2&&!this._songSearching&&!this._seedSong?n`<p class="muted">No analysed song matches that.</p>`:c}
            ${this._seedSong?n`<p class="picked">✓ <strong>${this._seedSong.title}</strong>
                  <span class="muted">${this._seedSong.artist}${this._seedSong.album?` \xB7 ${this._seedSong.album}`:""}</span></p>`:c}`:this._anchors===null?n`<p class="muted">Loading anchors…</p>`:s.length?n`<select
                class="search"
                aria-label="Anchor"
                .value=${String(this._anchorId??"")}
                @change=${a=>this._anchorId=Number(a.target.value)}
              >
                ${s.map(a=>n`<option value=${String(a.id)} ?selected=${a.id===this._anchorId}>${a.name}</option>`)}
              </select>`:n`<p class="muted">No anchors yet. Create them on AudioMuse-AI's
                <a href=${`${t.url}/alchemy`} target="_blank" rel="noreferrer">Song Alchemy</a> page.</p>`}
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._limitPerArtist}
          @change=${a=>this._limitPerArtist=a.target.checked}
        />
        <span>Limit songs per artist<small>Stops one artist taking over the playlist.</small></span>
      </label>
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._radius}
          @change=${a=>this._radius=a.target.checked}
        />
        <span>Radius Similarity<small>Orders the songs so they flow into each other.</small></span>
      </label>
      <div class="row">
        <label class="count"
          >Songs
          <input
            type="number"
            min=${this._info.min_count}
            max=${this._info.max_count}
            .value=${String(this._songCount)}
            @change=${a=>{let o=parseInt(a.target.value,10);Number.isNaN(o)||(this._songCount=Math.min(Math.max(o,this._info.min_count),this._info.max_count))}}
        /></label>
        <button class="primary" ?disabled=${e||!r} @click=${()=>this._findSimilarSongs()}>
          Find Similar Tracks
        </button>
      </div>
      ${this._renderOutcome("song",t)}
    `}_renderPathEnd(t,e){let s=this._getEnd(t),r=[["song","\u{1F3B5} Song"],...e.lyrics_available?[["lyrics","\u{1F4D6} Lyrics"]]:[],["mood","\u{1F3AD} Mood"],["anchor","\u{1F516} Anchor"]],a=this._anchors??[];return n`<div class="path-end">
      <label class="end-label">${t==="start"?"Start":"End"}</label>
      <div class="mode small" role="radiogroup" aria-label=${t==="start"?"Start type":"End type"}>
        ${r.map(([o,h])=>n`<button
            role="radio"
            aria-checked=${s.mode===o}
            class=${s.mode===o?"on":""}
            @click=${()=>this._setPathMode(t,o)}
          >${h}</button>`)}
      </div>
      ${s.mode==="song"||s.mode==="lyrics"?n`<input
              class="search"
              type="search"
              aria-label=${t==="start"?"Start song":"End song"}
              placeholder="Song, artist or album"
              .value=${s.query}
              @input=${o=>this._onPathInput(t,o.target.value)}
              @keydown=${o=>{o.key==="Enter"&&s.results.length&&this._setEnd(t,{song:s.results[0],query:s.results[0].title,results:[]})}}
            />
            ${s.searching?n`<p class="muted">Searching…</p>`:c}
            ${s.results.length?n`<ul class="list">
                  ${s.results.map(o=>n`<li>
                      <button
                        class="row-button"
                        @click=${()=>this._setEnd(t,{song:o,query:o.title,results:[]})}
                      >
                        <span class="artist-text"
                          ><span>${o.title}</span><small>${o.artist}${o.album?` \xB7 ${o.album}`:""}</small></span
                        >
                      </button>
                    </li>`)}
                </ul>`:s.query.trim().length>=2&&!s.searching&&!s.song?n`<p class="muted">No analysed song matches that.</p>`:c}
            ${s.song?n`<p class="picked">✓ <strong>${s.song.title}</strong>
                  <span class="muted">${s.song.artist}${s.song.album?` \xB7 ${s.song.album}`:""}</span></p>`:c}`:s.mode==="mood"?n`<select
              class="search"
              aria-label=${t==="start"?"Start mood":"End mood"}
              .value=${s.mood}
              @change=${o=>this._setEnd(t,{mood:o.target.value})}
            >
              ${St.map(([o,h])=>n`<option value=${o} ?selected=${o===s.mood}>${h}</option>`)}
            </select>`:a.length?n`<select
                class="search"
                aria-label=${t==="start"?"Start anchor":"End anchor"}
                @change=${o=>this._setEnd(t,{anchorId:Number(o.target.value)})}
              >
                ${a.map(o=>n`<option value=${String(o.id)} ?selected=${o.id===s.anchorId}>${o.name}</option>`)}
              </select>`:n`<p class="muted">No anchors yet. Create them on AudioMuse-AI's
                <a href=${`${e.url}/alchemy`} target="_blank" rel="noreferrer">Song Alchemy</a> page.</p>`}
    </div>`}_renderPath(t){let e=this._busy!=="",s=!!(this._pathEndValue(this._pathStart)&&this._pathEndValue(this._pathEnd));return n`
      <h2>Song Path</h2>
      <p class="intro">Pick a start and an end, and get a playlist that moves gradually from one to the other.</p>
      ${this._renderPathEnd("start",t)} ${this._renderPathEnd("end",t)}
      ${this._pathStart.mode==="lyrics"?n`<p class="hint">Lyrics: the path follows what the songs are about as well as how they sound.</p>`:c}
      <div class="row">
        <label class="count"
          >Songs in path
          <input
            type="number"
            min=${this._info.min_count}
            max=${this._info.max_count}
            .value=${String(this._pathCount)}
            @change=${r=>{let a=parseInt(r.target.value,10);Number.isNaN(a)||(this._pathCount=Math.min(Math.max(a,this._info.min_count),this._info.max_count))}}
        /></label>
      </div>
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._pathExact}
          @change=${r=>this._pathExact=r.target.checked}
        />
        <span>Keep path size exact<small>On: exactly that many songs. Off: the path may be shorter if there's no good
            link.</small></span>
      </label>
      <div class="row">
        <button class="primary" ?disabled=${e||!s} @click=${()=>this._findPath()}>Find Path</button>
      </div>
      ${this._renderOutcome("path",t)}
    `}_renderLyrics(t){!this._lyAxes&&!this._lyAxesError&&this._loadLyricsAxes();let e=this._busy!=="",s=[["axis","By Axis"],["text","By Text"],["song","By Song"]],r=Object.values(this._lyTargets).some(Boolean),a=this._lyWay==="axis"?r:this._lyWay==="text"?!!this._lyText.trim():!!this._lySong;return n`
      <h2>Lyrics Search</h2>
      <p class="intro">Find songs by what the lyrics are about, not how they sound.</p>
      <div class="mode seed" role="radiogroup" aria-label="Search lyrics">
        ${s.map(([o,h])=>n`<button
            role="radio"
            aria-checked=${this._lyWay===o}
            class=${this._lyWay===o?"on":""}
            @click=${()=>this._lyWay=o}
          >${h}</button>`)}
      </div>
      ${this._lyWay==="axis"?this._lyAxesError?n`<p class="error">${this._lyAxesError}</p>`:this._lyAxes?n`<p class="muted">Pick a value for one or more of these. The more you set, the more specific the
                  search.</p>
                <div class="axes">
                  ${this._lyAxes.map(o=>{let h=o.labels.find(d=>d.id===this._lyTargets[o.id]);return n`<div class="axis">
                      <strong>${o.name}</strong>
                      <small>${o.description}</small>
                      <select
                        aria-label=${o.name}
                        @change=${d=>this._lyTargets={...this._lyTargets,[o.id]:d.target.value}}
                      >
                        <option value="" ?selected=${!h}>— None —</option>
                        ${o.labels.map(d=>n`<option value=${d.id} ?selected=${h?.id===d.id}>${d.name}</option>`)}
                      </select>
                      ${h?.description?n`<small class="picked-desc">${h.description}</small>`:c}
                    </div>`})}
                </div>`:n`<p class="muted">Loading…</p>`:this._lyWay==="text"?n`<textarea
              rows="2"
              aria-label="What the lyrics are about"
              placeholder="Describe the lyrics, e.g. songs about heartbreak in the city at night"
              .value=${this._lyText}
              @input=${o=>this._lyText=o.target.value}
              @keydown=${o=>{o.key==="Enter"&&(o.ctrlKey||o.metaKey)&&this._searchLyrics()}}
            ></textarea>
            <p class="hint">Matched by meaning, not exact words.</p>`:n`<input
                class="search"
                type="search"
                aria-label="Song, artist or album"
                placeholder="Song, artist or album"
                .value=${this._lyQuery}
                @input=${o=>this._onLyricsSongInput(o.target.value)}
              />
              ${this._lySearching?n`<p class="muted">Searching…</p>`:c}
              ${this._lyResults.length?n`<ul class="list">
                    ${this._lyResults.map(o=>n`<li>
                        <button
                          class="row-button"
                          @click=${()=>{this._lySong=o,this._lyQuery=o.title,this._lyResults=[]}}
                        >
                          <span class="artist-text"
                            ><span>${o.title}</span><small>${o.artist}${o.album?` \xB7 ${o.album}`:""}</small></span
                          >
                        </button>
                      </li>`)}
                  </ul>`:this._lyQuery.trim().length>=2&&!this._lySearching&&!this._lySong?n`<p class="muted">No analysed song matches that.</p>`:c}
              ${this._lySong?n`<p class="picked">✓ <strong>${this._lySong.title}</strong>
                    <span class="muted">${this._lySong.artist}</span></p>`:c}
              <p class="hint">Finds songs with similar lyrics and a similar sound. The song itself comes first.</p>`}
      <div class="row">
        <label class="count"
          >Number of results
          <input
            type="number"
            min=${this._info.min_count}
            max=${this._info.max_count}
            .value=${String(this._lyCount)}
            @change=${o=>{let h=parseInt(o.target.value,10);Number.isNaN(h)||(this._lyCount=Math.min(Math.max(h,this._info.min_count),this._info.max_count))}}
        /></label>
        <button class="primary" ?disabled=${e||!a} @click=${()=>this._searchLyrics()}>Search</button>
      </div>
      ${this._renderOutcome("lyrics",t)}
    `}_renderArtists(t){let e=this._busy!=="";return n`
      <h2>Similar artists</h2>
      <p class="intro">Find artists with a similar sound, then make a mix from them.</p>
      <input
        class="search"
        type="search"
        aria-label="Search artists"
        placeholder="Search your artists"
        .value=${this._artistQuery}
        @input=${s=>this._onArtistInput(s.target.value)}
        @keydown=${s=>{s.key==="Enter"&&this._artistResults.length&&this._pickArtist(this._artistResults[0].name)}}
      />
      <div class="row">
        <label class="count"
          >Number of similar artists
          <input
            type="number"
            min="1"
            max="50"
            .value=${String(this._similarCount)}
            @change=${s=>{let r=parseInt(s.target.value,10);Number.isNaN(r)||(this._similarCount=Math.min(Math.max(r,1),50),this._selectedArtist&&this._pickArtist(this._selectedArtist))}}
        /></label>
      </div>
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._why}
          @change=${s=>{this._why=s.target.checked,this._why&&this._selectedArtist&&this._similar?.some(r=>!r.sounds_alike)&&this._pickArtist(this._selectedArtist)}}
        />
        <span>Show component matches (why artists are similar)
          <small>Shows a pair of songs that sound alike for each artist.</small></span>
      </label>
      ${this._artistSearching?n`<p class="muted">Searching…</p>`:c}
      ${this._artistResults.length?n`<ul class="list">
            ${this._artistResults.map(s=>n`<li>
                <button class="row-button" @click=${()=>this._pickArtist(s.name)}>
                  <span>${s.name}</span><span class="muted">${A(s.track_count)}</span>
                </button>
              </li>`)}
          </ul>`:this._artistQuery.trim().length>=2&&!this._artistSearching&&!this._selectedArtist?n`<p class="muted">No analysed artist matches that.</p>`:c}
      ${this._artistError?n`<p class="error">${this._artistError}</p>`:c}
      ${this._selectedArtist&&!this._artistResults.length?n`
            ${this._similarLoading?n`<p class="muted">Finding similar artists…</p>`:c}
            ${this._similar?n`<p class="muted">Sounds like <strong>${this._selectedArtist}</strong>. Tap an artist to see who
                    sounds like them.</p>
                  ${this._similar.length?n`<ul class="list similar">
                        ${this._similar.map((s,r)=>n`<li class=${r<this._includeSimilar?"included":""}>
                            <button class="row-button" @click=${()=>this._pickArtist(s.name)}>
                              <span class="artist-text"
                                ><span>${s.name}</span>${this._why&&s.sounds_alike?n`<small
                                      >"${s.sounds_alike.similar_song}" sounds like ${this._selectedArtist}'s
                                      "${s.sounds_alike.artist_song}"</small
                                    >`:c}</span
                              ><span class="muted">${A(s.track_count)}</span>
                            </button>
                          </li>`)}
                      </ul>`:n`<p class="muted">No similar artists found yet.</p>`}
                  <div class="row">
                    <label class="count"
                      >Include
                      <input
                        type="number"
                        min="0"
                        max=${Math.min(20,this._similar.length)}
                        .value=${String(this._includeSimilar)}
                        @change=${s=>{let r=parseInt(s.target.value,10);Number.isNaN(r)||(this._includeSimilar=Math.min(Math.max(r,0),20))}}
                      />
                      similar</label
                    >
                    <button class="primary" ?disabled=${e} @click=${()=>this._makeArtistMix()}>Make a mix</button>
                  </div>`:c}
          `:c}
      ${this._renderOutcome("artists",t)}
    `}_renderAlchemy(t){return n`
      <h2>Song Alchemy</h2>
      <div class="mode seed" role="tablist" aria-label="Song Alchemy">
        ${[["mix","Alchemy"],["anchors","Anchors"],["radios","Radios"]].map(([s,r])=>n`<button
            role="tab"
            aria-selected=${this._alcPart===s}
            class=${this._alcPart===s?"on":""}
            @click=${()=>{this._alcPart=s,this._alcMsg=""}}
          >${r}</button>`)}
      </div>
      ${this._alcPart==="mix"?this._renderAlchemyMix(t):this._alcPart==="anchors"?this._renderAnchors():this._renderRadios()}
      ${this._alcMsg?n`<p class="hint" role="status">${this._alcMsg}</p>`:c}
    `}_renderAlchemyMix(t){let e=this._busy!=="",s=this._alcItems.some(a=>a.op==="include"),r=this._alcArtists.length||this._alcSongs.length;return n`
      <p class="intro">Pick songs or artists to include, and ones to exclude. AudioMuse-AI blends them into a
        playlist. Exclude removes songs that sound like it; it doesn't ban the artist.</p>
      ${this._alcItems.length?n`<ul class="list items">
            ${this._alcItems.map(a=>n`<li>
                <select
                  class="ie"
                  aria-label=${`Include or exclude ${a.label}`}
                  @change=${o=>{let h=o.target.value;this._alcItems=this._alcItems.map(d=>d===a?{...d,op:h}:d)}}
                >
                  <option value="include" ?selected=${a.op==="include"}>Include</option>
                  <option value="exclude" ?selected=${a.op==="exclude"}>Exclude</option>
                </select>
                <span class="artist-text grow"><span>${a.label}</span><small>${a.sub}</small></span>
                <button
                  class="icon"
                  aria-label=${`Remove ${a.label}`}
                  @click=${()=>this._alcItems=this._alcItems.filter(o=>o!==a)}
                >×</button>
              </li>`)}
          </ul>`:c}
      <input
        class="search"
        type="search"
        aria-label="Add a song or artist"
        placeholder=${this._alcItems.length?"Add another song or artist":"Add a song or artist"}
        .value=${this._alcQuery}
        @input=${a=>this._onAlchemyInput(a.target.value)}
      />
      ${this._alcSearching?n`<p class="muted">Searching…</p>`:c}
      ${r?n`<ul class="list">
            ${this._alcArtists.map(a=>n`<li>
                <button
                  class="row-button"
                  @click=${()=>this._addAlchemyItem({type:"artist",id:a.name,label:a.name,sub:"artist",op:"include"})}
                >
                  <span class="artist-text"><span>${a.name}</span><small>artist</small></span
                  ><span class="muted">${A(a.track_count)}</span>
                </button>
              </li>`)}
            ${this._alcSongs.map(a=>n`<li>
                <button
                  class="row-button"
                  @click=${()=>this._addAlchemyItem({type:"song",id:a.item_id,label:a.title,sub:`song \xB7 ${a.artist}`,op:"include"})}
                >
                  <span class="artist-text"><span>${a.title}</span><small>song · ${a.artist}${a.album?` \xB7 ${a.album}`:""}</small></span>
                </button>
              </li>`)}
          </ul>`:this._alcQuery.trim().length>=2&&!this._alcSearching?n`<p class="muted">No analysed song or artist matches that.</p>`:c}
      <div class="row settings">
        <label class="count"
          >Number of results
          <input
            type="number"
            min=${this._info.min_count}
            max=${this._info.max_count}
            .value=${String(this._alcCount)}
            @change=${a=>{let o=parseInt(a.target.value,10);Number.isNaN(o)||(this._alcCount=Math.min(Math.max(o,this._info.min_count),this._info.max_count))}}
        /></label>
        <label class="count"
          >Sampling temperature (τ)
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            .value=${String(this._alcTemp)}
            @change=${a=>{let o=parseFloat(a.target.value);Number.isNaN(o)||(this._alcTemp=Math.min(Math.max(o,0),10))}}
        /></label>
        <label class="count"
          >Subtract distance threshold
          <input
            type="number"
            class="wide"
            min="0"
            step="0.05"
            placeholder="default"
            .value=${this._alcSubtract}
            @change=${a=>this._alcSubtract=a.target.value.trim()}
        /></label>
      </div>
      <p class="hint">Temperature: lower sticks closer to your blend, higher explores more. Subtract distance: how
        much near your excludes is removed (empty = AudioMuse-AI's default).</p>
      <div class="row">
        <button class="primary" ?disabled=${e||!s} @click=${()=>this._runAlchemy()}>Run Alchemy</button>
      </div>
      ${this._resultTab==="alchemy"&&this._result&&this._alcRemoved&&this._result.tracks.length<this._alcCount?n`<p class="hint warn" role="status">
            Your excludes removed ${A(this._alcRemoved)}, so there are fewer than ${this._alcCount}. To keep more,
            lower the Subtract distance threshold (for example 0.1) and run Alchemy again.
          </p>`:c}
      ${this._renderOutcome("alchemy",t)}
      ${this._resultTab==="alchemy"&&this._result&&this._blendId?n`<div class="section">
            <h3>Save Anchor</h3>
            <p class="muted">Keep this blend to reuse in Playlist from Similar Song, Song Path and Radios.</p>
            <div class="row">
              <input
                class="grow"
                aria-label="Anchor name"
                .value=${this._anchorName}
                @input=${a=>this._anchorName=a.target.value}
              />
              <button ?disabled=${!this._anchorName.trim()} @click=${()=>this._saveAnchor()}>Save Anchor</button>
            </div>
          </div>`:c}
    `}_renderAnchors(){let t=this._anchors??[];return n`
      <p class="intro">Anchors are saved Alchemy blends. Save one from an Alchemy result.</p>
      ${this._anchors===null?n`<p class="muted">Loading…</p>`:t.length?n`<ul class="list">
              ${t.map(e=>this._renaming?.id===e.id?n`<li>
                      <input
                        class="grow"
                        aria-label="New name"
                        .value=${this._renaming.name}
                        @input=${s=>this._renaming={id:e.id,name:s.target.value}}
                        @keydown=${s=>{s.key==="Enter"&&this._renameAnchor(),s.key==="Escape"&&(this._renaming=null)}}
                      />
                      <button class="primary" @click=${()=>this._renameAnchor()}>Save</button>
                      <button @click=${()=>this._renaming=null}>Cancel</button>
                    </li>`:n`<li>
                      <span class="grow">${e.name}${this._radios?.some(s=>s.anchor_id===e.id)?n` <small class="muted">· has a Radio</small>`:c}</span>
                      <button @click=${()=>this._renaming={id:e.id,name:e.name}}>Rename</button>
                      <button class="icon" aria-label=${`Delete ${e.name}`} @click=${()=>this._deleteAnchor(e)}>×</button>
                    </li>`)}
            </ul>`:n`<p class="muted">No anchors yet. Run Alchemy, then use Save Anchor under the result.</p>`}
    `}_renderRadios(){let t=this._radios??[],e=t.filter(a=>a.enabled).length,s=(this._anchors??[]).filter(a=>!t.some(o=>o.anchor_id===a.id)),r=a=>parseFloat(a.target.value);return n`
      <p class="intro">A radio is a saved anchor plus a temperature and a number of songs. Refreshing builds a fresh
        playlist from each one that's on.</p>
      ${this._radiosError?n`<p class="error">${this._radiosError}</p>`:c}
      ${this._radios===null&&!this._radiosError?n`<p class="muted">Loading…</p>`:c}
      ${this._radios&&!t.length?n`<p class="muted">No Radios yet.</p>`:c}
      ${t.length?n`<ul class="list radios">
            ${t.map(a=>n`<li class=${a.enabled?"":"off"}>
                <input
                  type="checkbox"
                  aria-label=${`${a.name} on`}
                  .checked=${a.enabled}
                  @change=${o=>this._updateRadio(a,{enabled:o.target.checked})}
                />
                <span class="grow">${a.name}</span>
                <label class="count small"
                  >τ
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    .value=${String(a.temperature??1)}
                    @change=${o=>{let h=r(o);Number.isNaN(h)||this._updateRadio(a,{temperature:Math.min(Math.max(h,0),10)})}}
                /></label>
                <label class="count small"
                  >Songs
                  <input
                    type="number"
                    min="1"
                    max=${this._info.max_count}
                    .value=${String(a.songs??"")}
                    @change=${o=>{let h=Math.round(r(o));Number.isNaN(h)||this._updateRadio(a,{songs:Math.min(Math.max(h,1),this._info.max_count)})}}
                /></label>
                <button class="icon" aria-label=${`Delete ${a.name}`} @click=${()=>this._deleteRadio(a)}>×</button>
              </li>`)}
          </ul>`:c}
      <div class="section">
        <h3>Add Radio</h3>
        ${s.length?n`<div class="row">
              <select
                aria-label="Anchor for the new Radio"
                @change=${a=>this._newRadioAnchor=Number(a.target.value)}
              >
                <option value="" ?selected=${this._newRadioAnchor===null}>Pick an anchor…</option>
                ${s.map(a=>n`<option value=${String(a.id)} ?selected=${a.id===this._newRadioAnchor}>${a.name}</option>`)}
              </select>
              <label class="count small"
                >τ
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  .value=${String(this._newRadioTemp)}
                  @change=${a=>{let o=r(a);Number.isNaN(o)||(this._newRadioTemp=Math.min(Math.max(o,0),10))}}
              /></label>
              <label class="count small"
                >Songs
                <input
                  type="number"
                  min="1"
                  max=${this._info.max_count}
                  .value=${String(this._newRadioSongs)}
                  @change=${a=>{let o=Math.round(r(a));Number.isNaN(o)||(this._newRadioSongs=Math.min(Math.max(o,1),this._info.max_count))}}
              /></label>
              <button ?disabled=${this._newRadioAnchor===null} @click=${()=>this._addRadio()}>Add Radio</button>
            </div>`:n`<p class="muted">${(this._anchors??[]).length?"Every anchor already has a Radio. Save another anchor from Alchemy to add more.":"Radios are made from anchors. Run Alchemy and save an anchor first."}</p>`}
      </div>
      ${t.length?n`<div class="row">
            <button class="primary" ?disabled=${this._radiosBusy||!e} @click=${()=>this._runRadios()}>
              ${this._radiosBusy?"Refreshing\u2026":"Refresh into library"}
            </button>
          </div>`:c}
      ${this._radiosMsg?n`<p class="hint">${this._radiosMsg}</p>`:c}
    `}_renderRecent(){return n`
      <h3>Recent</h3>
      ${this._recent.length?n`<ul class="list recent-list">
            ${this._recent.map(t=>n`<li>
                <div class="recent-text">
                  <span>${t.display_name??t.playlist_name}</span>
                  <span class="muted"
                    >${zt(t.created)} · ${A(t.track_count)}${t.detail?n` · ${t.source==="artist"?"artist":t.source==="song"?"song":t.source==="path"?"path":t.source==="alchemy"?"alchemy":t.source==="lyrics"?"lyrics":t.source==="search"?"search":"request"}: ${t.detail}`:c}</span
                  >
                </div>
                ${this._canPlay&&t.playlist_id?n`<button ?disabled=${this._busy!==""} @click=${()=>this._playRecent(t)}>Play</button>`:c}
                <button class="icon" aria-label="Forget" title="Forget (the playlist stays in your library)"
                  @click=${()=>this._forgetRecent(t)}>×</button>
              </li>`)}
          </ul>`:n`<p class="muted">Playlists you save from Home Assistant appear here.</p>`}
      ${this._toastRecent?n`<p class="hint" role="status">${this._toastRecent}</p>`:c}
    `}};N.properties={hass:{attribute:!1},narrow:{type:Boolean},_info:{state:!0},_entryId:{state:!0},_prompt:{state:!0},_count:{state:!0},_name:{state:!0},_nameTouched:{state:!0},_busy:{state:!0},_error:{state:!0},_result:{state:!0},_artistQuery:{state:!0},_artistResults:{state:!0},_artistSearching:{state:!0},_selectedArtist:{state:!0},_similar:{state:!0},_similarLoading:{state:!0},_includeSimilar:{state:!0},_artistError:{state:!0},_radios:{state:!0},_radiosBusy:{state:!0},_radiosMsg:{state:!0},_radiosError:{state:!0},_recent:{state:!0},_toastRecent:{state:!0},_mode:{state:!0},_makingMode:{state:!0},_elapsed:{state:!0},_saved:{state:!0},_player:{state:!0},_ideas:{state:!0},_shownIdeas:{state:!0},_ideasError:{state:!0},_loadError:{state:!0},_tab:{state:!0},_resultTab:{state:!0},_similarCount:{state:!0},_why:{state:!0},_songQuery:{state:!0},_songResults:{state:!0},_songSearching:{state:!0},_songError:{state:!0},_seedSong:{state:!0},_seedMode:{state:!0},_anchors:{state:!0},_anchorId:{state:!0},_songCount:{state:!0},_limitPerArtist:{state:!0},_radius:{state:!0},_pathStart:{state:!0},_pathEnd:{state:!0},_pathCount:{state:!0},_pathExact:{state:!0},_alcPart:{state:!0},_alcItems:{state:!0},_alcQuery:{state:!0},_alcArtists:{state:!0},_alcSongs:{state:!0},_alcSearching:{state:!0},_alcCount:{state:!0},_alcTemp:{state:!0},_alcSubtract:{state:!0},_blendId:{state:!0},_anchorName:{state:!0},_alcMsg:{state:!0},_renaming:{state:!0},_newRadioAnchor:{state:!0},_newRadioTemp:{state:!0},_newRadioSongs:{state:!0},_alcRemoved:{state:!0},_lyWay:{state:!0},_lyAxes:{state:!0},_lyAxesError:{state:!0},_lyTargets:{state:!0},_lyText:{state:!0},_lyQuery:{state:!0},_lyResults:{state:!0},_lySearching:{state:!0},_lySong:{state:!0},_lyCount:{state:!0}},N.styles=Q`
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
    .status .short {
      display: none;
    }
    @media (max-width: 600px) {
      .content {
        padding: 10px;
      }
      .status .long {
        display: none;
      }
      .status .short {
        display: inline;
      }
    }
    .tabs {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
      border-bottom: 1px solid var(--divider-color, #ddd);
      margin-bottom: 16px;
    }
    .tabs::-webkit-scrollbar {
      display: none;
    }
    button.tab {
      flex: none;
      border: none;
      border-bottom: 2px solid transparent;
      border-radius: 0;
      padding: 10px 14px;
      color: var(--secondary-text-color);
      font-size: 15px;
    }
    button.tab.on {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    #tabpanel {
      max-width: 860px;
    }
    .section {
      margin-top: 16px;
      border-top: 1px solid var(--divider-color, #ddd);
      padding-top: 12px;
    }
    .section.first {
      margin-top: 0;
      border-top: none;
      padding-top: 0;
    }
    h3 {
      font-size: 16px;
      font-weight: 500;
      margin: 0 0 8px;
    }
    .intro {
      color: var(--secondary-text-color);
      font-size: 14px;
      margin: -6px 0 12px;
    }
    .check {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-top: 10px;
      color: var(--primary-text-color);
    }
    .check input[type="checkbox"] {
      min-height: 0;
      margin: 3px 0 0;
      flex: none;
    }
    .check small,
    .artist-text small {
      display: block;
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    .hint.warn {
      color: var(--warning-color, #b26a00);
    }
    .axes {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 10px;
      margin-top: 8px;
    }
    .axis {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      border-radius: 8px;
      padding: 10px;
    }
    .axis strong {
      display: block;
      font-weight: 500;
      color: var(--primary-color);
    }
    .axis small {
      display: block;
      color: var(--secondary-text-color);
      font-size: 12px;
      margin: 2px 0 8px;
    }
    .axis select {
      width: 100%;
    }
    .axis small.picked-desc {
      margin: 6px 0 0;
    }
    .items select.ie {
      padding: 4px 6px;
      font-size: 13px;
      flex: none;
    }
    .grow {
      flex: 1;
      min-width: 0;
    }
    .row input.grow {
      flex: 1;
      min-width: 8em;
    }
    .count input.wide {
      width: 6.5em;
    }
    .count.small input {
      width: 4em;
      margin-left: 4px;
    }
    .list.radios li {
      flex-wrap: wrap;
    }
    .list.radios .grow {
      min-width: 9em;
    }
    @media (max-width: 600px) {
      .list.radios .grow {
        flex-basis: calc(100% - 40px);
      }
      .list.radios .count.small:first-of-type {
        margin-left: 28px;
      }
    }
    .list li.off .grow {
      opacity: 0.6;
    }
    .path-end {
      margin-bottom: 14px;
    }
    .end-label {
      display: block;
      margin-bottom: 6px;
    }
    .mode.small button {
      padding: 4px 12px;
      font-size: 13px;
    }
    .path-end .search {
      margin-top: 8px;
    }
    .mode.seed {
      margin-bottom: 12px;
    }
    .picked {
      margin: 10px 2px 0;
    }
    .artist-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
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
    .similar li.included .artist-text > span:first-child {
      font-weight: 500;
    }
    .row-button > .muted {
      flex: none;
      white-space: nowrap;
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
    .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .suggestion {
      padding: 3px 10px;
      font-size: 13px;
      border-color: var(--divider-color, #ccc);
      color: var(--primary-text-color);
      border-radius: 14px;
    }
    .mode {
      display: inline-flex;
      border: 1px solid var(--primary-color);
      border-radius: 18px;
      overflow: hidden;
    }
    .mode button {
      border: none;
      border-radius: 0;
      padding: 6px 14px;
    }
    .mode button.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .banner {
      margin-bottom: 12px;
    }
    .banner.warn {
      border-color: var(--warning-color, #ffa600);
    }
    @media (pointer: coarse) {
      button,
      .chip,
      input,
      select {
        min-height: 40px;
      }
      .mode button {
        min-height: 38px;
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
  `;customElements.get("audiomuse-panel")||customElements.define("audiomuse-panel",N);export{Bt as SUGGESTIONS,it as nameFromPrompt,A as songs,zt as whenText};
