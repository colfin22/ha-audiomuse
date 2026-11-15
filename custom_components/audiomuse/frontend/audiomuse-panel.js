var L=globalThis,U=L.ShadowRoot&&(L.ShadyCSS===void 0||L.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,z=Symbol(),st=new WeakMap,E=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(U&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=st.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&st.set(t,e))}return e}toString(){return this.cssText}},it=a=>new E(typeof a=="string"?a:a+"",void 0,z),j=(a,...e)=>{let t=a.length===1?a[0]:e.reduce((s,i,r)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+a[r+1],a[0]);return new E(t,a,z)},rt=(a,e)=>{if(U)a.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=L.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,a.appendChild(s)}},D=U?a=>a:a=>a instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return it(t)})(a):a;var{is:wt,defineProperty:Et,getOwnPropertyDescriptor:Tt,getOwnPropertyNames:Mt,getOwnPropertySymbols:Rt,getPrototypeOf:It}=Object,O=globalThis,at=O.trustedTypes,Pt=at?at.emptyScript:"",Ct=O.reactiveElementPolyfillSupport,T=(a,e)=>a,q={toAttribute(a,e){switch(e){case Boolean:a=a?Pt:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,e){let t=a;switch(e){case Boolean:t=a!==null;break;case Number:t=a===null?null:Number(a);break;case Object:case Array:try{t=JSON.parse(a)}catch{t=null}}return t}},ot=(a,e)=>!wt(a,e),nt={attribute:!0,type:String,converter:q,reflect:!1,useDefault:!1,hasChanged:ot};Symbol.metadata??=Symbol("metadata"),O.litPropertyMetadata??=new WeakMap;var g=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=nt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Et(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:r}=Tt(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:i,set(n){let c=i?.call(this);r?.call(this,n),this.requestUpdate(e,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??nt}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let e=It(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let t=this.properties,s=[...Mt(t),...Rt(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(D(i))}else e!==void 0&&t.push(D(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:q).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:q;this._$Em=i;let c=n.fromAttribute(t,r.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){if(e!==void 0){let n=this.constructor;if(i===!1&&(r=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??ot)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),r!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:n}=r,c=this[i];n!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,r,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};g.elementStyles=[],g.shadowRootOptions={mode:"open"},g[T("elementProperties")]=new Map,g[T("finalized")]=new Map,Ct?.({ReactiveElement:g}),(O.reactiveElementVersions??=[]).push("2.1.2");var J=globalThis,lt=a=>a,B=J.trustedTypes,ht=B?B.createPolicy("lit-html",{createHTML:a=>a}):void 0,mt="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,gt="?"+b,Nt=`<${gt}>`,x=document,R=()=>x.createComment(""),I=a=>a===null||typeof a!="object"&&typeof a!="function",Z=Array.isArray,Ht=a=>Z(a)||typeof a?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ct=/-->/g,dt=/>/g,$=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ut=/'/g,pt=/"/g,yt=/^(?:script|style|textarea|title)$/i,X=a=>(e,...t)=>({_$litType$:a,strings:e,values:t}),o=X(1),Qt=X(2),Vt=X(3),S=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),_t=new WeakMap,v=x.createTreeWalker(x,129);function bt(a,e){if(!Z(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return ht!==void 0?ht.createHTML(e):e}var Lt=(a,e)=>{let t=a.length-1,s=[],i,r=e===2?"<svg>":e===3?"<math>":"",n=M;for(let c=0;c<t;c++){let h=a[c],u,p,d=-1,m=0;for(;m<h.length&&(n.lastIndex=m,p=n.exec(h),p!==null);)m=n.lastIndex,n===M?p[1]==="!--"?n=ct:p[1]!==void 0?n=dt:p[2]!==void 0?(yt.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=$):p[3]!==void 0&&(n=$):n===$?p[0]===">"?(n=i??M,d=-1):p[1]===void 0?d=-2:(d=n.lastIndex-p[2].length,u=p[1],n=p[3]===void 0?$:p[3]==='"'?pt:ut):n===pt||n===ut?n=$:n===ct||n===dt?n=M:(n=$,i=void 0);let y=n===$&&a[c+1].startsWith("/>")?" ":"";r+=n===M?h+Nt:d>=0?(s.push(u),h.slice(0,d)+mt+h.slice(d)+b+y):h+b+(d===-2?c:y)}return[bt(a,r+(a[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},P=class a{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,n=0,c=e.length-1,h=this.parts,[u,p]=Lt(e,t);if(this.el=a.createElement(u,s),v.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=v.nextNode())!==null&&h.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(mt)){let m=p[n++],y=i.getAttribute(d).split(b),H=/([.?@])?(.*)/.exec(m);h.push({type:1,index:r,name:H[2],strings:y,ctor:H[1]==="."?F:H[1]==="?"?K:H[1]==="@"?Y:A}),i.removeAttribute(d)}else d.startsWith(b)&&(h.push({type:6,index:r}),i.removeAttribute(d));if(yt.test(i.tagName)){let d=i.textContent.split(b),m=d.length-1;if(m>0){i.textContent=B?B.emptyScript:"";for(let y=0;y<m;y++)i.append(d[y],R()),v.nextNode(),h.push({type:2,index:++r});i.append(d[m],R())}}}else if(i.nodeType===8)if(i.data===gt)h.push({type:2,index:r});else{let d=-1;for(;(d=i.data.indexOf(b,d+1))!==-1;)h.push({type:7,index:r}),d+=b.length-1}r++}}static createElement(e,t){let s=x.createElement("template");return s.innerHTML=e,s}};function k(a,e,t=a,s){if(e===S)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,r=I(e)?void 0:e._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(a),i._$AT(a,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=k(a,i._$AS(a,e.values),i,s)),e}var V=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??x).importNode(t,!0);v.currentNode=i;let r=v.nextNode(),n=0,c=0,h=s[0];for(;h!==void 0;){if(n===h.index){let u;h.type===2?u=new C(r,r.nextSibling,this,e):h.type===1?u=new h.ctor(r,h.name,h.strings,this,e):h.type===6&&(u=new G(r,this,e)),this._$AV.push(u),h=s[++c]}n!==h?.index&&(r=v.nextNode(),n++)}return v.currentNode=x,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},C=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=k(this,e,t),I(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==S&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ht(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&I(this._$AH)?this._$AA.nextSibling.data=e:this.T(x.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=P.createElement(bt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let r=new V(i,this),n=r.u(this.options);r.p(t),this.T(n),this._$AH=r}}_$AC(e){let t=_t.get(e.strings);return t===void 0&&_t.set(e.strings,t=new P(e)),t}k(e){Z(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let r of e)i===t.length?t.push(s=new a(this.O(R()),this.O(R()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=lt(e).nextSibling;lt(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},A=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=l}_$AI(e,t=this,s,i){let r=this.strings,n=!1;if(r===void 0)e=k(this,e,t,0),n=!I(e)||e!==this._$AH&&e!==S,n&&(this._$AH=e);else{let c=e,h,u;for(e=r[0],h=0;h<r.length-1;h++)u=k(this,c[s+h],t,h),u===S&&(u=this._$AH[h]),n||=!I(u)||u!==this._$AH[h],u===l?e=l:e!==l&&(e+=(u??"")+r[h+1]),this._$AH[h]=u}n&&!i&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},F=class extends A{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}},K=class extends A{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}},Y=class extends A{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=k(this,e,t,0)??l)===S)return;let s=this._$AH,i=e===l&&s!==l||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==l&&(s===l||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},G=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){k(this,e)}};var Ut=J.litHtmlPolyfillSupport;Ut?.(P,C),(J.litHtmlVersions??=[]).push("3.3.3");var ft=(a,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let r=t?.renderBefore??null;s._$litPart$=i=new C(e.insertBefore(R(),r),r,void 0,t??{})}return i._$AI(a),i};var tt=globalThis,f=class extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ft(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};f._$litElement$=!0,f.finalized=!0,tt.litElementHydrateSupport?.({LitElement:f});var Ot=tt.litElementPolyfillSupport;Ot?.({LitElement:f});(tt.litElementVersions??=[]).push("4.2.2");var $t=[{id:"make",label:"Make a playlist"},{id:"song",label:"Playlist from Similar Song"},{id:"artists",label:"Similar artists"},{id:"alchemy",label:"Song Alchemy"}],vt=300,W=12,Bt=[{icon:"\u{1F3B5}",label:"Similar Song",text:"Similar to By The Way by Red Hot Chili Peppers"},{icon:"\u{1F3B6}",label:"Multi-Song Mix",text:"Similar to Red Hot Chili Peppers - By The Way and Iron Maiden - Run to the Hills"},{icon:"\u{1F451}",label:"From Artist",text:"Songs like Madonna"},{icon:"\u{1F918}",label:"Artists Blend",text:"Sounds like Iron Maiden and Metallica combined"},{icon:"\u{1F3B9}",label:"Sound / Vibe",text:"Calm piano songs"},{icon:"\u{1F4DD}",label:"Lyrics Theme",text:"Songs about heartbreak in the rain",lyrics:!0},{icon:"\u{1F9E0}",label:"AI Brainstorming",text:"Top pop radio songs of 2025"},{icon:"\u{1F483}",label:"Genre / Mood / Year",text:"Sad jazz from the 90s in minor key"},{icon:"\u{1F9ED}",label:"Song Journey",text:"A journey from By The Way by Red Hot Chili Peppers to Run to the Hills by Iron Maiden"},{icon:"\u{1F3C3}",label:"Tempo + Exclusion",text:"Running playlist around 170 BPM, no rap"},{icon:"\u23F1\uFE0F",label:"Time Budget",text:"One hour of chill acoustic music, one song per artist"},{icon:"\u{1F195}",label:"Recently Added",text:"Songs added recently, under 4 minutes, no live versions"}],xt="audiomuse.entry",St="audiomuse.player",kt="audiomuse.tab";function At(a,e=60){let t=a.replace(/\s+/g," ").trim().replace(/^[.!?]+|[.!?]+$/g,"");if(t.length>e){let s=t.slice(0,e);t=(s.includes(" ")?s.slice(0,s.lastIndexOf(" ")):s).replace(/[,;:-]+$/,"")}return t?t[0].toUpperCase()+t.slice(1):"AudioMuse playlist"}function et(a){let e=[...a];for(let t=e.length-1;t>0;t--){let s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}return e}function w(a){return a==null?"? songs":`${a.toLocaleString()} song${a===1?"":"s"}`}function Wt(a,e=Date.now()){let t=Date.parse(a);if(Number.isNaN(t))return"";let s=Math.round((e-t)/6e4);if(s<1)return"just now";if(s<60)return`${s} min ago`;let i=Math.round(s/60);if(i<24)return`${i} h ago`;let r=Math.round(i/24);if(r<=6)return`${r} day${r===1?"":"s"} ago`;let n=new Date(t),c=h=>String(h).padStart(2,"0");return`${c(n.getDate())}-${c(n.getMonth()+1)}-${n.getFullYear()}`}function _(a){return a&&typeof a=="object"&&"message"in a?String(a.message):String(a)}var N=class extends f{constructor(){super();this._loading=!1;this._searchSeq=0;this._songSeq=0;this.narrow=!1,this._entryId="",this._prompt="",this._count=25,this._name="",this._nameTouched=!1,this._busy="",this._error="",this._result=null,this._saved=null,this._player="",this._artistQuery="",this._artistResults=[],this._artistSearching=!1,this._selectedArtist="",this._similar=null,this._similarLoading=!1,this._includeSimilar=4,this._artistError="",this._radios=null,this._radiosBusy=!1,this._radiosMsg="",this._radiosError="",this._recent=[],this._toastRecent="",this._mode="ai",this._makingMode="ai",this._elapsed=0,this._ideas=[],this._shownIdeas=[],this._ideasError="",this._loadError="";let t=localStorage.getItem(kt);this._tab=$t.some(s=>s.id===t)?t:"make",this._resultTab="make",this._similarCount=10,this._why=!0,this._songQuery="",this._songResults=[],this._songSearching=!1,this._songError="",this._seedSong=null,this._seedMode="song",this._anchors=null,this._anchorId=null,this._songCount=25,this._limitPerArtist=!0,this._radius=!0}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._ticker),window.clearTimeout(this._searchTimer),window.clearTimeout(this._songTimer)}_startTicker(){this._elapsed=0,window.clearInterval(this._ticker),this._ticker=window.setInterval(()=>this._elapsed+=1,1e3)}_stopTicker(){window.clearInterval(this._ticker)}_selectTab(t){this._tab=t,localStorage.setItem(kt,t)}updated(t){t.has("hass")&&this.hass&&!this._info&&!this._loading&&this._load()}get _entry(){return this._info?.entries.find(t=>t.entry_id===this._entryId)}get _canPlay(){return!!(this._entry?.playback&&this._info?.music_assistant&&this._info.players.length)}async _load(){if(this.hass){this._loading=!0;try{let t=await this.hass.callWS({type:"audiomuse/info"});this._info=t;let s=localStorage.getItem(xt),i=t.entries.find(r=>r.entry_id===s)??t.entries[0];i&&this._selectEntry(i.entry_id,!1),this._loadError=""}catch(t){this._loadError=_(t)}finally{this._loading=!1}}}async _reload(){this._info=void 0,await this._load()}_selectEntry(t,s=!0){let i=this._info?.entries.find(c=>c.entry_id===t);if(!i||!this._info)return;this._entryId=t,s&&localStorage.setItem(xt,t),this._count=i.default_count,this._songCount=i.default_count,this._mode=i.ai_configured?"ai":"search";let r=this._info.players.map(c=>c.entity_id),n=localStorage.getItem(St);this._player=n&&r.includes(n)&&n||i.default_player&&r.includes(i.default_player)&&i.default_player||r[0]||"",this._result=null,this._saved=null,this._error="",this._artistQuery="",this._artistResults=[],this._selectedArtist="",this._similar=null,this._radiosMsg="",this._songQuery="",this._songResults=[],this._seedSong=null,this._anchors=null,this._anchorId=null,this._loadIdeas(),this._loadAnchors(),this._loadRadios(),this._loadRecent()}async _loadIdeas(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/ideas",entry_id:this._entryId});this._ideas=t.ideas,this._shownIdeas=et(t.ideas).slice(0,W),this._ideasError=""}catch(t){this._ideasError=_(t)}}_moreIdeas(){let t=new Set(this._shownIdeas),s=et(this._ideas.filter(i=>!t.has(i)));this._shownIdeas=(s.length>=W?s:et(this._ideas)).slice(0,W)}async _make(t,s){t!==void 0&&(this._prompt=t,this._nameTouched=!1);let i=this._prompt.trim();if(!i||!this.hass||this._busy)return;let r=s??(this._entry?.ai_configured?this._mode:"search");this._busy="make",this._resultTab="make",this._makingMode=r,this._error="",this._result=null,this._saved=null,this._startTicker();try{if(r==="ai"){let n=await this.hass.callWS({type:"audiomuse/instant",entry_id:this._entryId,prompt:i,count:this._count});this._result={tracks:n.tracks,model:n.ai_model,source:"instant",detail:i,label:""}}else{let n=await this.hass.callWS({type:"audiomuse/search",entry_id:this._entryId,query:i,count:this._count});this._result={tracks:n.tracks,model:null,source:"search",detail:i,label:"quick search"}}this._nameTouched||(this._name=At(i))}catch(n){this._error=_(n)}finally{this._stopTicker(),this._busy=""}}async _save(t){if(!(!this.hass||!this._result?.tracks.length||this._busy)){this._busy=t?"play":"save",this._error="";try{let s={type:"audiomuse/save",entry_id:this._entryId,name:this._name.trim()||At(this._result.detail),item_ids:this._result.tracks.map(i=>i.item_id),source:this._result.source,detail:this._result.detail};t&&this._player&&(s.play_on=this._player),this._saved=await this.hass.callWS(s),this._loadRecent()}catch(s){this._error=_(s)}finally{this._busy=""}}}async _playSaved(){if(!(!this.hass||!this._saved?.playlist_id||!this._player||this._busy)){this._busy="play",this._error="";try{await this.hass.callWS({type:"audiomuse/play",entry_id:this._entryId,playlist_id:this._saved.playlist_id,entity_id:this._player}),this._saved={...this._saved,played_on:this._player}}catch(t){this._error=_(t)}finally{this._busy=""}}}async _useSuggestion(t){this._prompt=t,this._mode="ai",this._nameTouched=!1,this._error="",await this.updateComplete;let s=this.shadowRoot?.querySelector("textarea");s&&(s.focus(),s.setSelectionRange(t.length,t.length))}_onArtistInput(t){if(this._artistQuery=t,window.clearTimeout(this._searchTimer),t.trim().length<2){this._artistResults=[],this._artistSearching=!1;return}this._searchTimer=window.setTimeout(()=>{this._searchArtists(t.trim())},vt)}async _searchArtists(t){if(!this.hass)return;let s=++this._searchSeq;this._artistSearching=!0,this._artistError="";try{let i=await this.hass.callWS({type:"audiomuse/search_artists",entry_id:this._entryId,query:t});s===this._searchSeq&&(this._artistResults=i.artists)}catch(i){s===this._searchSeq&&(this._artistError=_(i))}finally{s===this._searchSeq&&(this._artistSearching=!1)}}async _pickArtist(t){if(this.hass){this._selectedArtist=t,this._artistQuery=t,this._artistResults=[],this._similar=null,this._similarLoading=!0,this._artistError="";try{let s=await this.hass.callWS({type:"audiomuse/similar_artists",entry_id:this._entryId,artist:t,count:this._similarCount,why:this._why});this._similar=s.artists}catch(s){this._artistError=_(s)}finally{this._similarLoading=!1}}}async _makeArtistMix(){let t=this._selectedArtist;if(!(!this.hass||!t||this._busy)){this._busy="make",this._resultTab="artists",this._error="",this._result=null,this._saved=null,this._makingMode="search",this._startTicker();try{let s=await this.hass.callWS({type:"audiomuse/artist_mix",entry_id:this._entryId,artist:t,include_similar:this._includeSimilar,count:this._count}),i=s.artists.length-1;this._result={tracks:s.tracks,model:null,source:"artist",detail:t,label:i>0?`${t} and ${i} similar artist${i===1?"":"s"}`:t},this._name=i>0?`${t} and similar`:t,this._nameTouched=!1}catch(s){this._error=_(s)}finally{this._stopTicker(),this._busy=""}}}async _loadAnchors(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/anchors",entry_id:this._entryId});this._anchors=t.anchors,this._anchorId===null&&t.anchors.length&&(this._anchorId=t.anchors[0].id)}catch{this._anchors=[]}}_onSongInput(t){if(this._songQuery=t,this._seedSong=null,window.clearTimeout(this._songTimer),t.trim().length<2){this._songResults=[],this._songSearching=!1;return}this._songTimer=window.setTimeout(()=>{this._searchSongs(t.trim())},vt)}async _searchSongs(t){if(!this.hass)return;let s=++this._songSeq;this._songSearching=!0,this._songError="";try{let i=await this.hass.callWS({type:"audiomuse/search_tracks",entry_id:this._entryId,query:t});s===this._songSeq&&(this._songResults=i.tracks.slice(0,10))}catch(i){s===this._songSeq&&(this._songError=_(i))}finally{s===this._songSeq&&(this._songSearching=!1)}}_pickSong(t){this._seedSong=t,this._songQuery=t.title,this._songResults=[]}async _findSimilarSongs(){if(!this.hass||this._busy)return;let t=this._seedMode==="anchor"?this._anchors?.find(r=>r.id===this._anchorId):void 0,s=this._seedMode==="song"?this._seedSong:null;if(!s&&!t)return;let i=s?s.title:t.name;this._busy="make",this._resultTab="song",this._makingMode="search",this._error="",this._result=null,this._saved=null,this._startTicker();try{let r=await this.hass.callWS({type:"audiomuse/similar_tracks",entry_id:this._entryId,...s?{item_id:s.item_id}:{anchor_id:t.id},count:this._songCount,limit_per_artist:this._limitPerArtist,radius_similarity:this._radius});this._result={tracks:r.tracks,model:null,source:"song",detail:s?`${s.title} (${s.artist})`:`anchor: ${t.name}`,label:`like ${i}`},this._name=`Like ${i}`,this._nameTouched=!1}catch(r){this._error=_(r)}finally{this._stopTicker(),this._busy=""}}async _loadRadios(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/radios",entry_id:this._entryId});this._radios=t.radios,this._radiosError=""}catch(t){this._radiosError=_(t)}}async _runRadios(){if(!(!this.hass||this._radiosBusy)){this._radiosBusy=!0,this._radiosMsg="",this._radiosError="";try{let t=await this.hass.callWS({type:"audiomuse/run_radios",entry_id:this._entryId}),s=t.playlists_created??0;this._radiosMsg=`Refreshed ${s} Radio playlist${s===1?"":"s"}.`+(t.failed.length?` Failed: ${t.failed.join(", ")}.`:" They keep the Radio's name in your music apps.")}catch(t){this._radiosError=_(t)}finally{this._radiosBusy=!1}}}async _loadRecent(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/recent",entry_id:this._entryId});this._recent=t.items}catch{this._recent=[]}}async _playRecent(t){if(!(!this.hass||!t.playlist_id||!this._player||this._busy)){this._busy="play",this._error="";try{await this.hass.callWS({type:"audiomuse/play",entry_id:this._entryId,playlist_id:t.playlist_id,entity_id:this._player}),this._toastRecent=`Playing ${t.display_name??t.playlist_name} on ${this._playerName(this._player)}`}catch(s){this._toastRecent=_(s)}finally{this._busy=""}}}async _forgetRecent(t){this.hass&&(await this.hass.callWS({type:"audiomuse/recent_remove",item_id:t.id}),this._recent=this._recent.filter(s=>s.id!==t.id))}_playerName(t){return this._info?.players.find(s=>s.entity_id===t)?.name??t??""}_toggleMenu(){this.dispatchEvent(new Event("hass-toggle-menu",{bubbles:!0,composed:!0}))}render(){return o`
      <div class="toolbar">
        ${this.narrow?customElements.get("ha-menu-button")?o`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:o`<button class="menu" aria-label="Menu" @click=${this._toggleMenu}>☰</button>`:l}
        <div class="title">AudioMuse</div>
        ${this._info&&this._info.entries.length>1?o`<select
              class="server"
              aria-label="AudioMuse-AI server"
              .value=${this._entryId}
              @change=${t=>this._selectEntry(t.target.value)}
            >
              ${this._info.entries.map(t=>o`<option value=${t.entry_id}>${t.title}</option>`)}
            </select>`:l}
      </div>
      <div class="content">${this._renderBody()}</div>
    `}_renderBody(){if(this._loadError)return o`<div class="card"><p class="error">Could not load AudioMuse: ${this._loadError}</p>
        <button @click=${()=>this._load()}>Try again</button></div>`;if(!this._info)return o`<div class="card"><p class="muted">Loading…</p></div>`;if(!this._info.entries.length&&this._info.unavailable.length)return o`<div class="card banner">
        <p><strong>${this._info.unavailable.map(s=>s.title).join(", ")}</strong> can't be reached right now.
          Home Assistant keeps retrying in the background.</p>
        ${this._info.unavailable[0].reason?o`<p class="muted">${this._info.unavailable[0].reason}</p>`:l}
        <button @click=${()=>this._reload()}>Try again</button>
      </div>`;if(!this._info.entries.length)return o`<div class="card"><p>No AudioMuse-AI server is set up. Add one under
        <strong>Settings → Devices &amp; services → Add integration → AudioMuse-AI</strong>.</p></div>`;let t=this._entry;return o`
      ${t.available?l:o`<div class="card banner warn" role="alert">AudioMuse-AI isn't answering right now, so actions may
            fail. Home Assistant keeps retrying. <button class="link" @click=${()=>this._reload()}>Refresh</button></div>`}
      ${this._renderStatus(t)}
      <nav class="tabs" role="tablist" aria-label="AudioMuse">
        ${$t.map(s=>o`<button
            role="tab"
            id=${`tab-${s.id}`}
            class="tab ${this._tab===s.id?"on":""}"
            aria-selected=${this._tab===s.id}
            aria-controls="tabpanel"
            @click=${i=>{this._selectTab(s.id),this._scrollTabIntoView(i.currentTarget)}}
          >${s.label}</button>`)}
      </nav>
      <section class="card" id="tabpanel" role="tabpanel" aria-labelledby=${`tab-${this._tab}`}>
        ${this._tab==="make"?o`${this._renderMake(t)}
              <div class="section">${this._renderIdeas()}</div>
              <div class="section">${this._renderRecent()}</div>`:this._tab==="song"?this._renderSong(t):this._tab==="artists"?this._renderArtists(t):o`<h2>Song Alchemy</h2>
                <div class="section first">${this._renderRadios(t)}</div>`}
      </section>
    `}_scrollTabIntoView(t){let s=t.parentElement;if(!s)return;let i=t.offsetLeft-s.offsetLeft,r=i+t.offsetWidth;i<s.scrollLeft?s.scrollLeft=i-8:r>s.scrollLeft+s.clientWidth&&(s.scrollLeft=r-s.clientWidth+8)}_renderOutcome(t,s){return this._resultTab!==t?l:o`
      ${this._busy==="make"?o`<div class="working" role="status"><span class="spinner"></span>${this._makingMode==="ai"?`Asking the AI to pick songs\u2026 ${this._elapsed} s (usually 10\u201330 s)`:`Finding songs\u2026 ${this._elapsed} s`}</div>`:l}
      ${this._error?o`<div class="error" role="alert">${this._error}</div>`:l}
      ${this._result?this._renderResult(s):l}
    `}_renderStatus(t){let s=[t.songs_analysed!=null?`${t.songs_analysed.toLocaleString(this.hass?.language)} songs analysed`:null,t.music_server?`${t.music_server}`:null,t.lyrics_available&&t.lyrics_songs?`${t.lyrics_songs.toLocaleString(this.hass?.language)} with lyrics`:null,t.version?`AudioMuse-AI ${t.version}`:null,t.busy_workers?"analysis running":null].filter(Boolean),i=[t.songs_analysed!=null?w(t.songs_analysed):null,t.music_server?`${t.music_server}`:null,t.version?`${t.version}`:null,t.busy_workers?"analysing":null].filter(Boolean);return o`<div class="status">
      <span class="long">${s.join(" \xB7 ")}</span><span class="short">${i.join(" \xB7 ")}</span>
    </div>`}_renderMake(t){let s=this._busy!=="";return o`
      <h2>Make a playlist</h2>
      <textarea
        rows="3"
        aria-label="What do you want to hear?"
        placeholder="Describe what you want to hear, e.g. relaxed acoustic songs for a rainy afternoon"
        .value=${this._prompt}
        @input=${i=>this._prompt=i.target.value}
        @keydown=${i=>{i.key==="Enter"&&(i.ctrlKey||i.metaKey)&&this._make()}}
      ></textarea>
      ${t.ai_configured?o`<div class="suggestions" role="group" aria-label="Suggestions: tap to fill the box, then edit">
            ${Bt.filter(i=>!i.lyrics||t.lyrics_available).map(i=>o`<button
                class="suggestion"
                title=${i.text}
                ?disabled=${s}
                @click=${()=>this._useSuggestion(i.text)}
              ><span aria-hidden="true">${i.icon}</span> ${i.label}</button>`)}
          </div>`:l}
      <div class="row">
        <div class="mode" role="radiogroup" aria-label="How to pick songs">
          <button
            role="radio"
            aria-checked=${this._mode==="ai"}
            class=${this._mode==="ai"&&t.ai_configured?"on":""}
            ?disabled=${!t.ai_configured||s}
            title=${t.ai_configured?"AudioMuse-AI's AI picks the songs":"Needs an AI provider"}
            @click=${()=>this._mode="ai"}
          >AI pick</button>
          <button
            role="radio"
            aria-checked=${this._mode==="search"||!t.ai_configured}
            class=${this._mode==="search"||!t.ai_configured?"on":""}
            ?disabled=${s}
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
            @change=${i=>{let r=parseInt(i.target.value,10);Number.isNaN(r)||(this._count=Math.min(Math.max(r,this._info.min_count),this._info.max_count))}}
        /></label>
        <button class="primary" ?disabled=${s||!this._prompt.trim()} @click=${()=>this._make()}>
          Make playlist
        </button>
      </div>
      ${t.ai_configured?l:o`<p class="hint">AI pick needs an AI provider. Set one in AudioMuse-AI's
            <a href=${`${t.url}/setup`} target="_blank" rel="noreferrer">Setup Wizard</a> or in this integration's
            options. Quick search works without it.</p>`}
      ${this._renderOutcome("make",t)}
    `}_renderResult(t){let s=this._result,i=s.tracks,r=this._busy!=="",n=t.music_server_type??"this",c=l;return t.playback?this._info.music_assistant?this._info.players.length?t.playback_verified||(c=o`<p class="hint">Playback on ${n} servers hasn't been tested yet. If it doesn't
        work, please report it.</p>`):c=o`<p class="hint">No Music Assistant speakers found.</p>`:c=o`<p class="hint">Add the Music Assistant integration to play playlists on your speakers.</p>`:c=o`<p class="hint">Playing on speakers isn't available for ${n} servers. Save the
        playlist and play it from your music app.</p>`,o`
      <div class="result">
        <div class="result-head">
          <strong>${w(i.length)}</strong>${s.label?o`<span class="muted"> · ${s.label}</span>`:s.model?o`<span class="muted"> · picked by ${s.model}</span>`:l}
        </div>
        <ol class="tracks">
          ${i.map(h=>o`<li>
              <span class="track-title">${h.title}</span>
              <span class="track-meta">${h.artist}${h.album?o` · ${h.album}`:l}</span>
            </li>`)}
        </ol>
        <label class="name"
          >Playlist name
          <input
            .value=${this._name}
            @input=${h=>{this._name=h.target.value,this._nameTouched=!0}}
        /></label>
        <div class="actions">
          ${this._canPlay?o`<select
                  aria-label="Speaker"
                  .value=${this._player}
                  @change=${h=>{this._player=h.target.value,localStorage.setItem(St,this._player)}}
                >
                  ${this._info.players.map(h=>o`<option value=${h.entity_id} ?selected=${h.entity_id===this._player}>${h.name}</option>`)}
                </select>
                <button class="primary" ?disabled=${r} @click=${()=>this._save(!0)}>
                  ${this._busy==="play"?"Starting\u2026":"Save & play"}
                </button>`:l}
          <button ?disabled=${r} @click=${()=>this._save(!1)}>
            ${this._busy==="save"?"Saving\u2026":"Save to library"}
          </button>
        </div>
        ${c}
        ${this._saved?o`<div class="saved" role="status">
              ✓ Saved as <strong>${this._saved.playlist_name}</strong>${this._saved.played_on?o` and playing on <strong>${this._playerName(this._saved.played_on)}</strong>`:l}. It will show up in your music apps.
              ${this._saved.playlist_id&&this._canPlay&&this._saved.played_on!==this._player?o`<button class="link" ?disabled=${r} @click=${()=>this._playSaved()}>
                    Play on ${this._playerName(this._player)}
                  </button>`:l}
            </div>`:l}
      </div>
    `}_renderIdeas(){return o`
      <h3>Playlist ideas</h3>
      <p class="muted">Suggestions from your library. Tap one for a quick playlist (no AI needed).</p>
      ${!this._ideas.length&&!this._ideasError?o`<p class="muted">Loading ideas…</p>`:l}
      ${this._ideasError?o`<p class="error">${this._ideasError}</p>`:o`<div class="chips">
            ${this._shownIdeas.map(t=>o`<button class="chip" ?disabled=${this._busy!==""} @click=${()=>{this._mode="search",this._make(t,"search")}}>
                ${t}
              </button>`)}
          </div>`}
      ${this._ideas.length>W?o`<button class="link" @click=${()=>this._moreIdeas()}>More ideas</button>`:l}
    `}_renderSong(t){let s=this._busy!=="",i=this._anchors??[],r=this._seedMode==="song"?!!this._seedSong:this._anchorId!==null&&i.length>0;return o`
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
      ${this._seedMode==="song"?o`<input
              class="search"
              type="search"
              aria-label="Song, artist or album"
              placeholder="Song, artist or album"
              .value=${this._songQuery}
              @input=${n=>this._onSongInput(n.target.value)}
              @keydown=${n=>{n.key==="Enter"&&this._songResults.length&&this._pickSong(this._songResults[0])}}
            />
            ${this._songSearching?o`<p class="muted">Searching…</p>`:l}
            ${this._songError?o`<p class="error">${this._songError}</p>`:l}
            ${this._songResults.length?o`<ul class="list">
                  ${this._songResults.map(n=>o`<li>
                      <button class="row-button" @click=${()=>this._pickSong(n)}>
                        <span class="artist-text"
                          ><span>${n.title}</span><small>${n.artist}${n.album?` \xB7 ${n.album}`:""}</small></span
                        >
                      </button>
                    </li>`)}
                </ul>`:this._songQuery.trim().length>=2&&!this._songSearching&&!this._seedSong?o`<p class="muted">No analysed song matches that.</p>`:l}
            ${this._seedSong?o`<p class="picked">✓ <strong>${this._seedSong.title}</strong>
                  <span class="muted">${this._seedSong.artist}${this._seedSong.album?` \xB7 ${this._seedSong.album}`:""}</span></p>`:l}`:this._anchors===null?o`<p class="muted">Loading anchors…</p>`:i.length?o`<select
                class="search"
                aria-label="Anchor"
                .value=${String(this._anchorId??"")}
                @change=${n=>this._anchorId=Number(n.target.value)}
              >
                ${i.map(n=>o`<option value=${String(n.id)} ?selected=${n.id===this._anchorId}>${n.name}</option>`)}
              </select>`:o`<p class="muted">No anchors yet. Create them on AudioMuse-AI's
                <a href=${`${t.url}/alchemy`} target="_blank" rel="noreferrer">Song Alchemy</a> page.</p>`}
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._limitPerArtist}
          @change=${n=>this._limitPerArtist=n.target.checked}
        />
        <span>Limit songs per artist<small>Stops one artist taking over the playlist.</small></span>
      </label>
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._radius}
          @change=${n=>this._radius=n.target.checked}
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
            @change=${n=>{let c=parseInt(n.target.value,10);Number.isNaN(c)||(this._songCount=Math.min(Math.max(c,this._info.min_count),this._info.max_count))}}
        /></label>
        <button class="primary" ?disabled=${s||!r} @click=${()=>this._findSimilarSongs()}>
          Find Similar Tracks
        </button>
      </div>
      ${this._renderOutcome("song",t)}
    `}_renderArtists(t){let s=this._busy!=="";return o`
      <h2>Similar artists</h2>
      <p class="intro">Find artists with a similar sound, then make a mix from them.</p>
      <input
        class="search"
        type="search"
        aria-label="Search artists"
        placeholder="Search your artists"
        .value=${this._artistQuery}
        @input=${i=>this._onArtistInput(i.target.value)}
        @keydown=${i=>{i.key==="Enter"&&this._artistResults.length&&this._pickArtist(this._artistResults[0].name)}}
      />
      <div class="row">
        <label class="count"
          >Number of similar artists
          <input
            type="number"
            min="1"
            max="50"
            .value=${String(this._similarCount)}
            @change=${i=>{let r=parseInt(i.target.value,10);Number.isNaN(r)||(this._similarCount=Math.min(Math.max(r,1),50),this._selectedArtist&&this._pickArtist(this._selectedArtist))}}
        /></label>
      </div>
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._why}
          @change=${i=>{this._why=i.target.checked,this._why&&this._selectedArtist&&this._similar?.some(r=>!r.sounds_alike)&&this._pickArtist(this._selectedArtist)}}
        />
        <span>Show component matches (why artists are similar)
          <small>Shows a pair of songs that sound alike for each artist.</small></span>
      </label>
      ${this._artistSearching?o`<p class="muted">Searching…</p>`:l}
      ${this._artistResults.length?o`<ul class="list">
            ${this._artistResults.map(i=>o`<li>
                <button class="row-button" @click=${()=>this._pickArtist(i.name)}>
                  <span>${i.name}</span><span class="muted">${w(i.track_count)}</span>
                </button>
              </li>`)}
          </ul>`:this._artistQuery.trim().length>=2&&!this._artistSearching&&!this._selectedArtist?o`<p class="muted">No analysed artist matches that.</p>`:l}
      ${this._artistError?o`<p class="error">${this._artistError}</p>`:l}
      ${this._selectedArtist&&!this._artistResults.length?o`
            ${this._similarLoading?o`<p class="muted">Finding similar artists…</p>`:l}
            ${this._similar?o`<p class="muted">Sounds like <strong>${this._selectedArtist}</strong>. Tap an artist to see who
                    sounds like them.</p>
                  ${this._similar.length?o`<ul class="list similar">
                        ${this._similar.map((i,r)=>o`<li class=${r<this._includeSimilar?"included":""}>
                            <button class="row-button" @click=${()=>this._pickArtist(i.name)}>
                              <span class="artist-text"
                                ><span>${i.name}</span>${this._why&&i.sounds_alike?o`<small
                                      >"${i.sounds_alike.similar_song}" sounds like ${this._selectedArtist}'s
                                      "${i.sounds_alike.artist_song}"</small
                                    >`:l}</span
                              ><span class="muted">${w(i.track_count)}</span>
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
                        @change=${i=>{let r=parseInt(i.target.value,10);Number.isNaN(r)||(this._includeSimilar=Math.min(Math.max(r,0),20))}}
                      />
                      similar</label
                    >
                    <button class="primary" ?disabled=${s} @click=${()=>this._makeArtistMix()}>Make a mix</button>
                  </div>`:l}
          `:l}
      ${this._renderOutcome("artists",t)}
    `}_renderRadios(t){let s=(this._radios??[]).filter(i=>i.enabled).length;return o`
      <h3>Radios</h3>
      ${this._radiosError?o`<p class="error">${this._radiosError}</p>`:l}
      ${this._radios===null&&!this._radiosError?o`<p class="muted">Loading…</p>`:l}
      ${this._radios&&!this._radios.length?o`<p class="muted">No Radios yet. Create them on AudioMuse-AI's
            <a href=${`${t.url}/alchemy`} target="_blank" rel="noreferrer">Song Alchemy</a> page, then refresh them
            into your library from here.</p>`:l}
      ${this._radios?.length?o`<ul class="list">
              ${this._radios.map(i=>o`<li class="radio ${i.enabled?"":"off"}">
                  <span>${i.name}</span><span class="muted">${w(i.songs)}${i.enabled?"":" \xB7 off"}</span>
                </li>`)}
            </ul>
            <div class="row">
              <button ?disabled=${this._radiosBusy||!s} @click=${()=>this._runRadios()}>
                ${this._radiosBusy?"Refreshing\u2026":"Refresh into library"}
              </button>
            </div>`:l}
      ${this._radiosMsg?o`<p class="hint">${this._radiosMsg}</p>`:l}
    `}_renderRecent(){return o`
      <h3>Recent</h3>
      ${this._recent.length?o`<ul class="list recent-list">
            ${this._recent.map(t=>o`<li>
                <div class="recent-text">
                  <span>${t.display_name??t.playlist_name}</span>
                  <span class="muted"
                    >${Wt(t.created)} · ${w(t.track_count)}${t.detail?o` · ${t.source==="artist"?"artist":t.source==="song"?"song":t.source==="search"?"search":"request"}: ${t.detail}`:l}</span
                  >
                </div>
                ${this._canPlay&&t.playlist_id?o`<button ?disabled=${this._busy!==""} @click=${()=>this._playRecent(t)}>Play</button>`:l}
                <button class="icon" aria-label="Forget" title="Forget (the playlist stays in your library)"
                  @click=${()=>this._forgetRecent(t)}>×</button>
              </li>`)}
          </ul>`:o`<p class="muted">Playlists you save from Home Assistant appear here.</p>`}
      ${this._toastRecent?o`<p class="hint" role="status">${this._toastRecent}</p>`:l}
    `}};N.properties={hass:{attribute:!1},narrow:{type:Boolean},_info:{state:!0},_entryId:{state:!0},_prompt:{state:!0},_count:{state:!0},_name:{state:!0},_nameTouched:{state:!0},_busy:{state:!0},_error:{state:!0},_result:{state:!0},_artistQuery:{state:!0},_artistResults:{state:!0},_artistSearching:{state:!0},_selectedArtist:{state:!0},_similar:{state:!0},_similarLoading:{state:!0},_includeSimilar:{state:!0},_artistError:{state:!0},_radios:{state:!0},_radiosBusy:{state:!0},_radiosMsg:{state:!0},_radiosError:{state:!0},_recent:{state:!0},_toastRecent:{state:!0},_mode:{state:!0},_makingMode:{state:!0},_elapsed:{state:!0},_saved:{state:!0},_player:{state:!0},_ideas:{state:!0},_shownIdeas:{state:!0},_ideasError:{state:!0},_loadError:{state:!0},_tab:{state:!0},_resultTab:{state:!0},_similarCount:{state:!0},_why:{state:!0},_songQuery:{state:!0},_songResults:{state:!0},_songSearching:{state:!0},_songError:{state:!0},_seedSong:{state:!0},_seedMode:{state:!0},_anchors:{state:!0},_anchorId:{state:!0},_songCount:{state:!0},_limitPerArtist:{state:!0},_radius:{state:!0}},N.styles=j`
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
  `;customElements.get("audiomuse-panel")||customElements.define("audiomuse-panel",N);export{Bt as SUGGESTIONS,At as nameFromPrompt,w as songs,Wt as whenText};
