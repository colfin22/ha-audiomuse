var N=globalThis,O=N.ShadowRoot&&(N.ShadyCSS===void 0||N.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,z=Symbol(),rt=new WeakMap,w=class{constructor(s,t,e){if(this._$cssResult$=!0,e!==z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=t}get styleSheet(){let s=this.o,t=this.t;if(O&&s===void 0){let e=t!==void 0&&t.length===1;e&&(s=rt.get(t)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),e&&rt.set(t,s))}return s}toString(){return this.cssText}},at=o=>new w(typeof o=="string"?o:o+"",void 0,z),D=(o,...s)=>{let t=o.length===1?o[0]:s.reduce((e,i,r)=>e+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[r+1],o[0]);return new w(t,o,z)},nt=(o,s)=>{if(O)o.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of s){let e=document.createElement("style"),i=N.litNonce;i!==void 0&&e.setAttribute("nonce",i),e.textContent=t.cssText,o.appendChild(e)}},j=O?o=>o:o=>o instanceof CSSStyleSheet?(s=>{let t="";for(let e of s.cssRules)t+=e.cssText;return at(t)})(o):o;var{is:Tt,defineProperty:Mt,getOwnPropertyDescriptor:It,getOwnPropertyNames:Rt,getOwnPropertySymbols:Pt,getPrototypeOf:Ct}=Object,U=globalThis,ot=U.trustedTypes,Lt=ot?ot.emptyScript:"",Ht=U.reactiveElementPolyfillSupport,T=(o,s)=>o,V={toAttribute(o,s){switch(s){case Boolean:o=o?Lt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,s){let t=o;switch(s){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},ht=(o,s)=>!Tt(o,s),lt={attribute:!0,type:String,converter:V,reflect:!1,useDefault:!1,hasChanged:ht};Symbol.metadata??=Symbol("metadata"),U.litPropertyMetadata??=new WeakMap;var g=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,t=lt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(s,t),!t.noAccessor){let e=Symbol(),i=this.getPropertyDescriptor(s,e,t);i!==void 0&&Mt(this.prototype,s,i)}}static getPropertyDescriptor(s,t,e){let{get:i,set:r}=It(this.prototype,s)??{get(){return this[t]},set(a){this[t]=a}};return{get:i,set(a){let l=i?.call(this);r?.call(this,a),this.requestUpdate(s,l,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??lt}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let s=Ct(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let t=this.properties,e=[...Rt(t),...Pt(t)];for(let i of e)this.createProperty(i,t[i])}let s=this[Symbol.metadata];if(s!==null){let t=litPropertyMetadata.get(s);if(t!==void 0)for(let[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let i=this._$Eu(t,e);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let t=[];if(Array.isArray(s)){let e=new Set(s.flat(1/0).reverse());for(let i of e)t.unshift(j(i))}else s!==void 0&&t.push(j(s));return t}static _$Eu(s,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(s.set(e,this[e]),delete this[e]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return nt(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,t,e){this._$AK(s,e)}_$ET(s,t){let e=this.constructor.elementProperties.get(s),i=this.constructor._$Eu(s,e);if(i!==void 0&&e.reflect===!0){let r=(e.converter?.toAttribute!==void 0?e.converter:V).toAttribute(t,e.type);this._$Em=s,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(s,t){let e=this.constructor,i=e._$Eh.get(s);if(i!==void 0&&this._$Em!==i){let r=e.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:V;this._$Em=i;let l=a.fromAttribute(t,r.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(s,t,e,i=!1,r){if(s!==void 0){let a=this.constructor;if(i===!1&&(r=this[s]),e??=a.getPropertyOptions(s),!((e.hasChanged??ht)(r,t)||e.useDefault&&e.reflect&&r===this._$Ej?.get(s)&&!this.hasAttribute(a._$Eu(s,e))))return;this.C(s,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,t,{useDefault:e,reflect:i,wrapped:r},a){e&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,a??t??this[s]),r!==!0||a!==void 0)||(this._$AL.has(s)||(this.hasUpdated||e||(t=void 0),this._$AL.set(s,t)),i===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[i,r]of e){let{wrapped:a}=r,l=this[i];a!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,r,l)}}let s=!1,t=this._$AL;try{s=this.shouldUpdate(t),s?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw s=!1,this._$EM(),e}s&&this._$AE(t)}willUpdate(s){}_$AE(s){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(s){}firstUpdated(s){}};g.elementStyles=[],g.shadowRootOptions={mode:"open"},g[T("elementProperties")]=new Map,g[T("finalized")]=new Map,Ht?.({ReactiveElement:g}),(U.reactiveElementVersions??=[]).push("2.1.2");var Z=globalThis,ct=o=>o,B=Z.trustedTypes,dt=B?B.createPolicy("lit-html",{createHTML:o=>o}):void 0,yt="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,bt="?"+b,Nt=`<${bt}>`,S=document,I=()=>S.createComment(""),R=o=>o===null||typeof o!="object"&&typeof o!="function",X=Array.isArray,Ot=o=>X(o)||typeof o?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ut=/-->/g,pt=/>/g,$=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_t=/'/g,mt=/"/g,ft=/^(?:script|style|textarea|title)$/i,tt=o=>(s,...t)=>({_$litType$:o,strings:s,values:t}),n=tt(1),Ft=tt(2),Kt=tt(3),x=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),gt=new WeakMap,v=S.createTreeWalker(S,129);function $t(o,s){if(!X(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return dt!==void 0?dt.createHTML(s):s}var Ut=(o,s)=>{let t=o.length-1,e=[],i,r=s===2?"<svg>":s===3?"<math>":"",a=M;for(let l=0;l<t;l++){let c=o[l],u,p,d=-1,m=0;for(;m<c.length&&(a.lastIndex=m,p=a.exec(c),p!==null);)m=a.lastIndex,a===M?p[1]==="!--"?a=ut:p[1]!==void 0?a=pt:p[2]!==void 0?(ft.test(p[2])&&(i=RegExp("</"+p[2],"g")),a=$):p[3]!==void 0&&(a=$):a===$?p[0]===">"?(a=i??M,d=-1):p[1]===void 0?d=-2:(d=a.lastIndex-p[2].length,u=p[1],a=p[3]===void 0?$:p[3]==='"'?mt:_t):a===mt||a===_t?a=$:a===ut||a===pt?a=M:(a=$,i=void 0);let y=a===$&&o[l+1].startsWith("/>")?" ":"";r+=a===M?c+Nt:d>=0?(e.push(u),c.slice(0,d)+yt+c.slice(d)+b+y):c+b+(d===-2?l:y)}return[$t(o,r+(o[t]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),e]},P=class o{constructor({strings:s,_$litType$:t},e){let i;this.parts=[];let r=0,a=0,l=s.length-1,c=this.parts,[u,p]=Ut(s,t);if(this.el=o.createElement(u,e),v.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=v.nextNode())!==null&&c.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(yt)){let m=p[a++],y=i.getAttribute(d).split(b),H=/([.?@])?(.*)/.exec(m);c.push({type:1,index:r,name:H[2],strings:y,ctor:H[1]==="."?K:H[1]==="?"?Y:H[1]==="@"?G:E}),i.removeAttribute(d)}else d.startsWith(b)&&(c.push({type:6,index:r}),i.removeAttribute(d));if(ft.test(i.tagName)){let d=i.textContent.split(b),m=d.length-1;if(m>0){i.textContent=B?B.emptyScript:"";for(let y=0;y<m;y++)i.append(d[y],I()),v.nextNode(),c.push({type:2,index:++r});i.append(d[m],I())}}}else if(i.nodeType===8)if(i.data===bt)c.push({type:2,index:r});else{let d=-1;for(;(d=i.data.indexOf(b,d+1))!==-1;)c.push({type:7,index:r}),d+=b.length-1}r++}}static createElement(s,t){let e=S.createElement("template");return e.innerHTML=s,e}};function k(o,s,t=o,e){if(s===x)return s;let i=e!==void 0?t._$Co?.[e]:t._$Cl,r=R(s)?void 0:s._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(o),i._$AT(o,t,e)),e!==void 0?(t._$Co??=[])[e]=i:t._$Cl=i),i!==void 0&&(s=k(o,i._$AS(o,s.values),i,e)),s}var F=class{constructor(s,t){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:t},parts:e}=this._$AD,i=(s?.creationScope??S).importNode(t,!0);v.currentNode=i;let r=v.nextNode(),a=0,l=0,c=e[0];for(;c!==void 0;){if(a===c.index){let u;c.type===2?u=new C(r,r.nextSibling,this,s):c.type===1?u=new c.ctor(r,c.name,c.strings,this,s):c.type===6&&(u=new J(r,this,s)),this._$AV.push(u),c=e[++l]}a!==c?.index&&(r=v.nextNode(),a++)}return v.currentNode=S,i}p(s){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(s,e,t),t+=e.strings.length-2):e._$AI(s[t])),t++}},C=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,t,e,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=s,this._$AB=t,this._$AM=e,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,t=this._$AM;return t!==void 0&&s?.nodeType===11&&(s=t.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,t=this){s=k(this,s,t),R(s)?s===h||s==null||s===""?(this._$AH!==h&&this._$AR(),this._$AH=h):s!==this._$AH&&s!==x&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):Ot(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==h&&R(this._$AH)?this._$AA.nextSibling.data=s:this.T(S.createTextNode(s)),this._$AH=s}$(s){let{values:t,_$litType$:e}=s,i=typeof e=="number"?this._$AC(s):(e.el===void 0&&(e.el=P.createElement($t(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===i)this._$AH.p(t);else{let r=new F(i,this),a=r.u(this.options);r.p(t),this.T(a),this._$AH=r}}_$AC(s){let t=gt.get(s.strings);return t===void 0&&gt.set(s.strings,t=new P(s)),t}k(s){X(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,i=0;for(let r of s)i===t.length?t.push(e=new o(this.O(I()),this.O(I()),this,this.options)):e=t[i],e._$AI(r),i++;i<t.length&&(this._$AR(e&&e._$AB.nextSibling,i),t.length=i)}_$AR(s=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);s!==this._$AB;){let e=ct(s).nextSibling;ct(s).remove(),s=e}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,t,e,i,r){this.type=1,this._$AH=h,this._$AN=void 0,this.element=s,this.name=t,this._$AM=i,this.options=r,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=h}_$AI(s,t=this,e,i){let r=this.strings,a=!1;if(r===void 0)s=k(this,s,t,0),a=!R(s)||s!==this._$AH&&s!==x,a&&(this._$AH=s);else{let l=s,c,u;for(s=r[0],c=0;c<r.length-1;c++)u=k(this,l[e+c],t,c),u===x&&(u=this._$AH[c]),a||=!R(u)||u!==this._$AH[c],u===h?s=h:s!==h&&(s+=(u??"")+r[c+1]),this._$AH[c]=u}a&&!i&&this.j(s)}j(s){s===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},K=class extends E{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===h?void 0:s}},Y=class extends E{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==h)}},G=class extends E{constructor(s,t,e,i,r){super(s,t,e,i,r),this.type=5}_$AI(s,t=this){if((s=k(this,s,t,0)??h)===x)return;let e=this._$AH,i=s===h&&e!==h||s.capture!==e.capture||s.once!==e.once||s.passive!==e.passive,r=s!==h&&(e===h||i);i&&this.element.removeEventListener(this.name,this,e),r&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},J=class{constructor(s,t,e){this.element=s,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(s){k(this,s)}};var Bt=Z.litHtmlPolyfillSupport;Bt?.(P,C),(Z.litHtmlVersions??=[]).push("3.3.3");var vt=(o,s,t)=>{let e=t?.renderBefore??s,i=e._$litPart$;if(i===void 0){let r=t?.renderBefore??null;e._$litPart$=i=new C(s.insertBefore(I(),r),r,void 0,t??{})}return i._$AI(o),i};var et=globalThis,f=class extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=vt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};f._$litElement$=!0,f.finalized=!0,et.litElementHydrateSupport?.({LitElement:f});var qt=et.litElementPolyfillSupport;qt?.({LitElement:f});(et.litElementVersions??=[]).push("4.2.2");var St=[["happy","Happy"],["sad","Sad"],["aggressive","Aggressive"],["relaxed","Relaxed"],["danceable","Danceable"]];function q(){return{mode:"song",query:"",results:[],searching:!1,song:null,mood:"happy",anchorId:null}}var xt=[{id:"make",label:"Make a playlist"},{id:"song",label:"Playlist from Similar Song"},{id:"artists",label:"Similar artists"},{id:"path",label:"Song Path"},{id:"alchemy",label:"Song Alchemy"}],st=300,W=12,Wt=[{icon:"\u{1F3B5}",label:"Similar Song",text:"Similar to By The Way by Red Hot Chili Peppers"},{icon:"\u{1F3B6}",label:"Multi-Song Mix",text:"Similar to Red Hot Chili Peppers - By The Way and Iron Maiden - Run to the Hills"},{icon:"\u{1F451}",label:"From Artist",text:"Songs like Madonna"},{icon:"\u{1F918}",label:"Artists Blend",text:"Sounds like Iron Maiden and Metallica combined"},{icon:"\u{1F3B9}",label:"Sound / Vibe",text:"Calm piano songs"},{icon:"\u{1F4DD}",label:"Lyrics Theme",text:"Songs about heartbreak in the rain",lyrics:!0},{icon:"\u{1F9E0}",label:"AI Brainstorming",text:"Top pop radio songs of 2025"},{icon:"\u{1F483}",label:"Genre / Mood / Year",text:"Sad jazz from the 90s in minor key"},{icon:"\u{1F9ED}",label:"Song Journey",text:"A journey from By The Way by Red Hot Chili Peppers to Run to the Hills by Iron Maiden"},{icon:"\u{1F3C3}",label:"Tempo + Exclusion",text:"Running playlist around 170 BPM, no rap"},{icon:"\u23F1\uFE0F",label:"Time Budget",text:"One hour of chill acoustic music, one song per artist"},{icon:"\u{1F195}",label:"Recently Added",text:"Songs added recently, under 4 minutes, no live versions"}],kt="audiomuse.entry",Et="audiomuse.player",At="audiomuse.tab";function wt(o,s=60){let t=o.replace(/\s+/g," ").trim().replace(/^[.!?]+|[.!?]+$/g,"");if(t.length>s){let e=t.slice(0,s);t=(e.includes(" ")?e.slice(0,e.lastIndexOf(" ")):e).replace(/[,;:-]+$/,"")}return t?t[0].toUpperCase()+t.slice(1):"AudioMuse playlist"}function it(o){let s=[...o];for(let t=s.length-1;t>0;t--){let e=Math.floor(Math.random()*(t+1));[s[t],s[e]]=[s[e],s[t]]}return s}function A(o){return o==null?"? songs":`${o.toLocaleString()} song${o===1?"":"s"}`}function zt(o,s=Date.now()){let t=Date.parse(o);if(Number.isNaN(t))return"";let e=Math.round((s-t)/6e4);if(e<1)return"just now";if(e<60)return`${e} min ago`;let i=Math.round(e/60);if(i<24)return`${i} h ago`;let r=Math.round(i/24);if(r<=6)return`${r} day${r===1?"":"s"} ago`;let a=new Date(t),l=c=>String(c).padStart(2,"0");return`${l(a.getDate())}-${l(a.getMonth()+1)}-${a.getFullYear()}`}function _(o){return o&&typeof o=="object"&&"message"in o?String(o.message):String(o)}var L=class extends f{constructor(){super();this._loading=!1;this._searchSeq=0;this._songSeq=0;this._pathTimers={};this._pathSeq={start:0,end:0};this.narrow=!1,this._entryId="",this._prompt="",this._count=25,this._name="",this._nameTouched=!1,this._busy="",this._error="",this._result=null,this._saved=null,this._player="",this._artistQuery="",this._artistResults=[],this._artistSearching=!1,this._selectedArtist="",this._similar=null,this._similarLoading=!1,this._includeSimilar=4,this._artistError="",this._radios=null,this._radiosBusy=!1,this._radiosMsg="",this._radiosError="",this._recent=[],this._toastRecent="",this._mode="ai",this._makingMode="ai",this._elapsed=0,this._ideas=[],this._shownIdeas=[],this._ideasError="",this._loadError="";let t=localStorage.getItem(At);this._tab=xt.some(e=>e.id===t)?t:"make",this._resultTab="make",this._similarCount=10,this._why=!0,this._songQuery="",this._songResults=[],this._songSearching=!1,this._songError="",this._seedSong=null,this._seedMode="song",this._anchors=null,this._anchorId=null,this._songCount=25,this._limitPerArtist=!0,this._radius=!0,this._pathStart=q(),this._pathEnd=q(),this._pathCount=25,this._pathExact=!0}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this._ticker),window.clearTimeout(this._searchTimer),window.clearTimeout(this._songTimer),window.clearTimeout(this._pathTimers.start),window.clearTimeout(this._pathTimers.end)}_startTicker(){this._elapsed=0,window.clearInterval(this._ticker),this._ticker=window.setInterval(()=>this._elapsed+=1,1e3)}_stopTicker(){window.clearInterval(this._ticker)}_selectTab(t){this._tab=t,localStorage.setItem(At,t)}updated(t){t.has("hass")&&this.hass&&!this._info&&!this._loading&&this._load()}get _entry(){return this._info?.entries.find(t=>t.entry_id===this._entryId)}get _canPlay(){return!!(this._entry?.playback&&this._info?.music_assistant&&this._info.players.length)}async _load(){if(this.hass){this._loading=!0;try{let t=await this.hass.callWS({type:"audiomuse/info"});this._info=t;let e=localStorage.getItem(kt),i=t.entries.find(r=>r.entry_id===e)??t.entries[0];i&&this._selectEntry(i.entry_id,!1),this._loadError=""}catch(t){this._loadError=_(t)}finally{this._loading=!1}}}async _reload(){this._info=void 0,await this._load()}_selectEntry(t,e=!0){let i=this._info?.entries.find(l=>l.entry_id===t);if(!i||!this._info)return;this._entryId=t,e&&localStorage.setItem(kt,t),this._count=i.default_count,this._songCount=i.default_count,this._pathCount=i.default_count,this._mode=i.ai_configured?"ai":"search";let r=this._info.players.map(l=>l.entity_id),a=localStorage.getItem(Et);this._player=a&&r.includes(a)&&a||i.default_player&&r.includes(i.default_player)&&i.default_player||r[0]||"",this._result=null,this._saved=null,this._error="",this._artistQuery="",this._artistResults=[],this._selectedArtist="",this._similar=null,this._radiosMsg="",this._songQuery="",this._songResults=[],this._seedSong=null,this._anchors=null,this._anchorId=null,this._pathStart=q(),this._pathEnd=q(),this._loadIdeas(),this._loadAnchors(),this._loadRadios(),this._loadRecent()}async _loadIdeas(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/ideas",entry_id:this._entryId});this._ideas=t.ideas,this._shownIdeas=it(t.ideas).slice(0,W),this._ideasError=""}catch(t){this._ideasError=_(t)}}_moreIdeas(){let t=new Set(this._shownIdeas),e=it(this._ideas.filter(i=>!t.has(i)));this._shownIdeas=(e.length>=W?e:it(this._ideas)).slice(0,W)}async _make(t,e){t!==void 0&&(this._prompt=t,this._nameTouched=!1);let i=this._prompt.trim();if(!i||!this.hass||this._busy)return;let r=e??(this._entry?.ai_configured?this._mode:"search");this._busy="make",this._resultTab="make",this._makingMode=r,this._error="",this._result=null,this._saved=null,this._startTicker();try{if(r==="ai"){let a=await this.hass.callWS({type:"audiomuse/instant",entry_id:this._entryId,prompt:i,count:this._count});this._result={tracks:a.tracks,model:a.ai_model,source:"instant",detail:i,label:""}}else{let a=await this.hass.callWS({type:"audiomuse/search",entry_id:this._entryId,query:i,count:this._count});this._result={tracks:a.tracks,model:null,source:"search",detail:i,label:"quick search"}}this._nameTouched||(this._name=wt(i))}catch(a){this._error=_(a)}finally{this._stopTicker(),this._busy=""}}async _save(t){if(!(!this.hass||!this._result?.tracks.length||this._busy)){this._busy=t?"play":"save",this._error="";try{let e={type:"audiomuse/save",entry_id:this._entryId,name:this._name.trim()||wt(this._result.detail),item_ids:this._result.tracks.map(i=>i.item_id),source:this._result.source,detail:this._result.detail};t&&this._player&&(e.play_on=this._player),this._saved=await this.hass.callWS(e),this._loadRecent()}catch(e){this._error=_(e)}finally{this._busy=""}}}async _playSaved(){if(!(!this.hass||!this._saved?.playlist_id||!this._player||this._busy)){this._busy="play",this._error="";try{await this.hass.callWS({type:"audiomuse/play",entry_id:this._entryId,playlist_id:this._saved.playlist_id,entity_id:this._player}),this._saved={...this._saved,played_on:this._player}}catch(t){this._error=_(t)}finally{this._busy=""}}}async _useSuggestion(t){this._prompt=t,this._mode="ai",this._nameTouched=!1,this._error="",await this.updateComplete;let e=this.shadowRoot?.querySelector("textarea");e&&(e.focus(),e.setSelectionRange(t.length,t.length))}_onArtistInput(t){if(this._artistQuery=t,window.clearTimeout(this._searchTimer),t.trim().length<2){this._artistResults=[],this._artistSearching=!1;return}this._searchTimer=window.setTimeout(()=>{this._searchArtists(t.trim())},st)}async _searchArtists(t){if(!this.hass)return;let e=++this._searchSeq;this._artistSearching=!0,this._artistError="";try{let i=await this.hass.callWS({type:"audiomuse/search_artists",entry_id:this._entryId,query:t});e===this._searchSeq&&(this._artistResults=i.artists)}catch(i){e===this._searchSeq&&(this._artistError=_(i))}finally{e===this._searchSeq&&(this._artistSearching=!1)}}async _pickArtist(t){if(this.hass){this._selectedArtist=t,this._artistQuery=t,this._artistResults=[],this._similar=null,this._similarLoading=!0,this._artistError="";try{let e=await this.hass.callWS({type:"audiomuse/similar_artists",entry_id:this._entryId,artist:t,count:this._similarCount,why:this._why});this._similar=e.artists}catch(e){this._artistError=_(e)}finally{this._similarLoading=!1}}}async _makeArtistMix(){let t=this._selectedArtist;if(!(!this.hass||!t||this._busy)){this._busy="make",this._resultTab="artists",this._error="",this._result=null,this._saved=null,this._makingMode="search",this._startTicker();try{let e=await this.hass.callWS({type:"audiomuse/artist_mix",entry_id:this._entryId,artist:t,include_similar:this._includeSimilar,count:this._count}),i=e.artists.length-1;this._result={tracks:e.tracks,model:null,source:"artist",detail:t,label:i>0?`${t} and ${i} similar artist${i===1?"":"s"}`:t},this._name=i>0?`${t} and similar`:t,this._nameTouched=!1}catch(e){this._error=_(e)}finally{this._stopTicker(),this._busy=""}}}async _loadAnchors(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/anchors",entry_id:this._entryId});this._anchors=t.anchors,this._anchorId===null&&t.anchors.length&&(this._anchorId=t.anchors[0].id)}catch{this._anchors=[]}}_onSongInput(t){if(this._songQuery=t,this._seedSong=null,window.clearTimeout(this._songTimer),t.trim().length<2){this._songResults=[],this._songSearching=!1;return}this._songTimer=window.setTimeout(()=>{this._searchSongs(t.trim())},st)}async _searchSongs(t){if(!this.hass)return;let e=++this._songSeq;this._songSearching=!0,this._songError="";try{let i=await this.hass.callWS({type:"audiomuse/search_tracks",entry_id:this._entryId,query:t});e===this._songSeq&&(this._songResults=i.tracks.slice(0,10))}catch(i){e===this._songSeq&&(this._songError=_(i))}finally{e===this._songSeq&&(this._songSearching=!1)}}_pickSong(t){this._seedSong=t,this._songQuery=t.title,this._songResults=[]}async _findSimilarSongs(){if(!this.hass||this._busy)return;let t=this._seedMode==="anchor"?this._anchors?.find(r=>r.id===this._anchorId):void 0,e=this._seedMode==="song"?this._seedSong:null;if(!e&&!t)return;let i=e?e.title:t.name;this._busy="make",this._resultTab="song",this._makingMode="search",this._error="",this._result=null,this._saved=null,this._startTicker();try{let r=await this.hass.callWS({type:"audiomuse/similar_tracks",entry_id:this._entryId,...e?{item_id:e.item_id}:{anchor_id:t.id},count:this._songCount,limit_per_artist:this._limitPerArtist,radius_similarity:this._radius});this._result={tracks:r.tracks,model:null,source:"song",detail:e?`${e.title} (${e.artist})`:`anchor: ${t.name}`,label:`like ${i}`},this._name=`Like ${i}`,this._nameTouched=!1}catch(r){this._error=_(r)}finally{this._stopTicker(),this._busy=""}}_getEnd(t){return t==="start"?this._pathStart:this._pathEnd}_setEnd(t,e){t==="start"?this._pathStart={...this._pathStart,...e}:this._pathEnd={...this._pathEnd,...e}}_setPathMode(t,e){let i=t==="start"?"end":"start",r=this._getEnd(i).mode;this._setEnd(t,{mode:e}),e==="lyrics"&&r!=="lyrics"?this._setEnd(i,{mode:"lyrics"}):e==="song"&&r==="lyrics"?this._setEnd(i,{mode:"song"}):(e==="mood"||e==="anchor")&&r!=="song"&&this._setEnd(i,{mode:"song"}),e==="anchor"&&this._getEnd(t).anchorId===null&&this._anchors?.length&&this._setEnd(t,{anchorId:this._anchors[0].id})}_onPathInput(t,e){if(this._setEnd(t,{query:e,song:null}),window.clearTimeout(this._pathTimers[t]),e.trim().length<2){this._setEnd(t,{results:[],searching:!1});return}this._pathTimers[t]=window.setTimeout(()=>{this._searchPathSongs(t,e.trim())},st)}async _searchPathSongs(t,e){if(!this.hass)return;let i=++this._pathSeq[t];this._setEnd(t,{searching:!0});try{let r=await this.hass.callWS({type:"audiomuse/search_tracks",entry_id:this._entryId,query:e});i===this._pathSeq[t]&&this._setEnd(t,{results:r.tracks.slice(0,8)})}catch(r){i===this._pathSeq[t]&&(this._error=_(r))}finally{i===this._pathSeq[t]&&this._setEnd(t,{searching:!1})}}_pathEndValue(t){if(t.mode==="song"||t.mode==="lyrics")return t.song?{type:"song",id:t.song.item_id}:null;if(t.mode==="mood")return{type:"mood",id:t.mood};let e=this._anchors?.find(i=>i.id===t.anchorId);return e?{type:"anchor",id:e.id}:null}_pathEndLabel(t){return t.mode==="song"||t.mode==="lyrics"?t.song?.title??"":t.mode==="mood"?St.find(([e])=>e===t.mood)?.[1]??t.mood:this._anchors?.find(e=>e.id===t.anchorId)?.name??""}async _findPath(){let t=this._pathEndValue(this._pathStart),e=this._pathEndValue(this._pathEnd);if(!this.hass||this._busy||!t||!e)return;let i=this._pathEndLabel(this._pathStart),r=this._pathEndLabel(this._pathEnd);this._busy="make",this._resultTab="path",this._makingMode="search",this._error="",this._result=null,this._saved=null,this._startTicker();try{let a=await this.hass.callWS({type:"audiomuse/find_path",entry_id:this._entryId,start:t,end:e,count:this._pathCount,exact:this._pathExact,lyrics:this._pathStart.mode==="lyrics"});this._result={tracks:a.tracks,model:null,source:"path",detail:`${i} \u2192 ${r}`,label:`${i} \u2192 ${r}`},this._name=`${i} to ${r}`,this._nameTouched=!1}catch(a){this._error=_(a)}finally{this._stopTicker(),this._busy=""}}async _loadRadios(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/radios",entry_id:this._entryId});this._radios=t.radios,this._radiosError=""}catch(t){this._radiosError=_(t)}}async _runRadios(){if(!(!this.hass||this._radiosBusy)){this._radiosBusy=!0,this._radiosMsg="",this._radiosError="";try{let t=await this.hass.callWS({type:"audiomuse/run_radios",entry_id:this._entryId}),e=t.playlists_created??0;this._radiosMsg=`Refreshed ${e} Radio playlist${e===1?"":"s"}.`+(t.failed.length?` Failed: ${t.failed.join(", ")}.`:" They keep the Radio's name in your music apps.")}catch(t){this._radiosError=_(t)}finally{this._radiosBusy=!1}}}async _loadRecent(){if(!(!this.hass||!this._entryId))try{let t=await this.hass.callWS({type:"audiomuse/recent",entry_id:this._entryId});this._recent=t.items}catch{this._recent=[]}}async _playRecent(t){if(!(!this.hass||!t.playlist_id||!this._player||this._busy)){this._busy="play",this._error="";try{await this.hass.callWS({type:"audiomuse/play",entry_id:this._entryId,playlist_id:t.playlist_id,entity_id:this._player}),this._toastRecent=`Playing ${t.display_name??t.playlist_name} on ${this._playerName(this._player)}`}catch(e){this._toastRecent=_(e)}finally{this._busy=""}}}async _forgetRecent(t){this.hass&&(await this.hass.callWS({type:"audiomuse/recent_remove",item_id:t.id}),this._recent=this._recent.filter(e=>e.id!==t.id))}_playerName(t){return this._info?.players.find(e=>e.entity_id===t)?.name??t??""}_toggleMenu(){this.dispatchEvent(new Event("hass-toggle-menu",{bubbles:!0,composed:!0}))}render(){return n`
      <div class="toolbar">
        ${this.narrow?customElements.get("ha-menu-button")?n`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:n`<button class="menu" aria-label="Menu" @click=${this._toggleMenu}>☰</button>`:h}
        <div class="title">AudioMuse</div>
        ${this._info&&this._info.entries.length>1?n`<select
              class="server"
              aria-label="AudioMuse-AI server"
              .value=${this._entryId}
              @change=${t=>this._selectEntry(t.target.value)}
            >
              ${this._info.entries.map(t=>n`<option value=${t.entry_id}>${t.title}</option>`)}
            </select>`:h}
      </div>
      <div class="content">${this._renderBody()}</div>
    `}_renderBody(){if(this._loadError)return n`<div class="card"><p class="error">Could not load AudioMuse: ${this._loadError}</p>
        <button @click=${()=>this._load()}>Try again</button></div>`;if(!this._info)return n`<div class="card"><p class="muted">Loading…</p></div>`;if(!this._info.entries.length&&this._info.unavailable.length)return n`<div class="card banner">
        <p><strong>${this._info.unavailable.map(e=>e.title).join(", ")}</strong> can't be reached right now.
          Home Assistant keeps retrying in the background.</p>
        ${this._info.unavailable[0].reason?n`<p class="muted">${this._info.unavailable[0].reason}</p>`:h}
        <button @click=${()=>this._reload()}>Try again</button>
      </div>`;if(!this._info.entries.length)return n`<div class="card"><p>No AudioMuse-AI server is set up. Add one under
        <strong>Settings → Devices &amp; services → Add integration → AudioMuse-AI</strong>.</p></div>`;let t=this._entry;return n`
      ${t.available?h:n`<div class="card banner warn" role="alert">AudioMuse-AI isn't answering right now, so actions may
            fail. Home Assistant keeps retrying. <button class="link" @click=${()=>this._reload()}>Refresh</button></div>`}
      ${this._renderStatus(t)}
      <nav class="tabs" role="tablist" aria-label="AudioMuse">
        ${xt.map(e=>n`<button
            role="tab"
            id=${`tab-${e.id}`}
            class="tab ${this._tab===e.id?"on":""}"
            aria-selected=${this._tab===e.id}
            aria-controls="tabpanel"
            @click=${i=>{this._selectTab(e.id),this._scrollTabIntoView(i.currentTarget)}}
          >${e.label}</button>`)}
      </nav>
      <section class="card" id="tabpanel" role="tabpanel" aria-labelledby=${`tab-${this._tab}`}>
        ${this._tab==="make"?n`${this._renderMake(t)}
              <div class="section">${this._renderIdeas()}</div>
              <div class="section">${this._renderRecent()}</div>`:this._tab==="song"?this._renderSong(t):this._tab==="artists"?this._renderArtists(t):this._tab==="path"?this._renderPath(t):n`<h2>Song Alchemy</h2>
                <div class="section first">${this._renderRadios(t)}</div>`}
      </section>
    `}_scrollTabIntoView(t){let e=t.parentElement;if(!e)return;let i=t.offsetLeft-e.offsetLeft,r=i+t.offsetWidth;i<e.scrollLeft?e.scrollLeft=i-8:r>e.scrollLeft+e.clientWidth&&(e.scrollLeft=r-e.clientWidth+8)}_renderOutcome(t,e){return this._resultTab!==t?h:n`
      ${this._busy==="make"?n`<div class="working" role="status"><span class="spinner"></span>${this._makingMode==="ai"?`Asking the AI to pick songs\u2026 ${this._elapsed} s (usually 10\u201330 s)`:`Finding songs\u2026 ${this._elapsed} s`}</div>`:h}
      ${this._error?n`<div class="error" role="alert">${this._error}</div>`:h}
      ${this._result?this._renderResult(e):h}
    `}_renderStatus(t){let e=[t.songs_analysed!=null?`${t.songs_analysed.toLocaleString(this.hass?.language)} songs analysed`:null,t.music_server?`${t.music_server}`:null,t.lyrics_available&&t.lyrics_songs?`${t.lyrics_songs.toLocaleString(this.hass?.language)} with lyrics`:null,t.version?`AudioMuse-AI ${t.version}`:null,t.busy_workers?"analysis running":null].filter(Boolean),i=[t.songs_analysed!=null?A(t.songs_analysed):null,t.music_server?`${t.music_server}`:null,t.version?`${t.version}`:null,t.busy_workers?"analysing":null].filter(Boolean);return n`<div class="status">
      <span class="long">${e.join(" \xB7 ")}</span><span class="short">${i.join(" \xB7 ")}</span>
    </div>`}_renderMake(t){let e=this._busy!=="";return n`
      <h2>Make a playlist</h2>
      <textarea
        rows="3"
        aria-label="What do you want to hear?"
        placeholder="Describe what you want to hear, e.g. relaxed acoustic songs for a rainy afternoon"
        .value=${this._prompt}
        @input=${i=>this._prompt=i.target.value}
        @keydown=${i=>{i.key==="Enter"&&(i.ctrlKey||i.metaKey)&&this._make()}}
      ></textarea>
      ${t.ai_configured?n`<div class="suggestions" role="group" aria-label="Suggestions: tap to fill the box, then edit">
            ${Wt.filter(i=>!i.lyrics||t.lyrics_available).map(i=>n`<button
                class="suggestion"
                title=${i.text}
                ?disabled=${e}
                @click=${()=>this._useSuggestion(i.text)}
              ><span aria-hidden="true">${i.icon}</span> ${i.label}</button>`)}
          </div>`:h}
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
            @change=${i=>{let r=parseInt(i.target.value,10);Number.isNaN(r)||(this._count=Math.min(Math.max(r,this._info.min_count),this._info.max_count))}}
        /></label>
        <button class="primary" ?disabled=${e||!this._prompt.trim()} @click=${()=>this._make()}>
          Make playlist
        </button>
      </div>
      ${t.ai_configured?h:n`<p class="hint">AI pick needs an AI provider. Set one in AudioMuse-AI's
            <a href=${`${t.url}/setup`} target="_blank" rel="noreferrer">Setup Wizard</a> or in this integration's
            options. Quick search works without it.</p>`}
      ${this._renderOutcome("make",t)}
    `}_renderResult(t){let e=this._result,i=e.tracks,r=this._busy!=="",a=t.music_server_type??"this",l=h;return t.playback?this._info.music_assistant?this._info.players.length?t.playback_verified||(l=n`<p class="hint">Playback on ${a} servers hasn't been tested yet. If it doesn't
        work, please report it.</p>`):l=n`<p class="hint">No Music Assistant speakers found.</p>`:l=n`<p class="hint">Add the Music Assistant integration to play playlists on your speakers.</p>`:l=n`<p class="hint">Playing on speakers isn't available for ${a} servers. Save the
        playlist and play it from your music app.</p>`,n`
      <div class="result">
        <div class="result-head">
          <strong>${A(i.length)}</strong>${e.label?n`<span class="muted"> · ${e.label}</span>`:e.model?n`<span class="muted"> · picked by ${e.model}</span>`:h}
        </div>
        <ol class="tracks">
          ${i.map(c=>n`<li>
              <span class="track-title">${c.title}</span>
              <span class="track-meta">${c.artist}${c.album?n` · ${c.album}`:h}</span>
            </li>`)}
        </ol>
        <label class="name"
          >Playlist name
          <input
            .value=${this._name}
            @input=${c=>{this._name=c.target.value,this._nameTouched=!0}}
        /></label>
        <div class="actions">
          ${this._canPlay?n`<select
                  aria-label="Speaker"
                  .value=${this._player}
                  @change=${c=>{this._player=c.target.value,localStorage.setItem(Et,this._player)}}
                >
                  ${this._info.players.map(c=>n`<option value=${c.entity_id} ?selected=${c.entity_id===this._player}>${c.name}</option>`)}
                </select>
                <button class="primary" ?disabled=${r} @click=${()=>this._save(!0)}>
                  ${this._busy==="play"?"Starting\u2026":"Save & play"}
                </button>`:h}
          <button ?disabled=${r} @click=${()=>this._save(!1)}>
            ${this._busy==="save"?"Saving\u2026":"Save to library"}
          </button>
        </div>
        ${l}
        ${this._saved?n`<div class="saved" role="status">
              ✓ Saved as <strong>${this._saved.playlist_name}</strong>${this._saved.played_on?n` and playing on <strong>${this._playerName(this._saved.played_on)}</strong>`:h}. It will show up in your music apps.
              ${this._saved.playlist_id&&this._canPlay&&this._saved.played_on!==this._player?n`<button class="link" ?disabled=${r} @click=${()=>this._playSaved()}>
                    Play on ${this._playerName(this._player)}
                  </button>`:h}
            </div>`:h}
      </div>
    `}_renderIdeas(){return n`
      <h3>Playlist ideas</h3>
      <p class="muted">Suggestions from your library. Tap one for a quick playlist (no AI needed).</p>
      ${!this._ideas.length&&!this._ideasError?n`<p class="muted">Loading ideas…</p>`:h}
      ${this._ideasError?n`<p class="error">${this._ideasError}</p>`:n`<div class="chips">
            ${this._shownIdeas.map(t=>n`<button class="chip" ?disabled=${this._busy!==""} @click=${()=>{this._mode="search",this._make(t,"search")}}>
                ${t}
              </button>`)}
          </div>`}
      ${this._ideas.length>W?n`<button class="link" @click=${()=>this._moreIdeas()}>More ideas</button>`:h}
    `}_renderSong(t){let e=this._busy!=="",i=this._anchors??[],r=this._seedMode==="song"?!!this._seedSong:this._anchorId!==null&&i.length>0;return n`
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
            ${this._songSearching?n`<p class="muted">Searching…</p>`:h}
            ${this._songError?n`<p class="error">${this._songError}</p>`:h}
            ${this._songResults.length?n`<ul class="list">
                  ${this._songResults.map(a=>n`<li>
                      <button class="row-button" @click=${()=>this._pickSong(a)}>
                        <span class="artist-text"
                          ><span>${a.title}</span><small>${a.artist}${a.album?` \xB7 ${a.album}`:""}</small></span
                        >
                      </button>
                    </li>`)}
                </ul>`:this._songQuery.trim().length>=2&&!this._songSearching&&!this._seedSong?n`<p class="muted">No analysed song matches that.</p>`:h}
            ${this._seedSong?n`<p class="picked">✓ <strong>${this._seedSong.title}</strong>
                  <span class="muted">${this._seedSong.artist}${this._seedSong.album?` \xB7 ${this._seedSong.album}`:""}</span></p>`:h}`:this._anchors===null?n`<p class="muted">Loading anchors…</p>`:i.length?n`<select
                class="search"
                aria-label="Anchor"
                .value=${String(this._anchorId??"")}
                @change=${a=>this._anchorId=Number(a.target.value)}
              >
                ${i.map(a=>n`<option value=${String(a.id)} ?selected=${a.id===this._anchorId}>${a.name}</option>`)}
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
            @change=${a=>{let l=parseInt(a.target.value,10);Number.isNaN(l)||(this._songCount=Math.min(Math.max(l,this._info.min_count),this._info.max_count))}}
        /></label>
        <button class="primary" ?disabled=${e||!r} @click=${()=>this._findSimilarSongs()}>
          Find Similar Tracks
        </button>
      </div>
      ${this._renderOutcome("song",t)}
    `}_renderPathEnd(t,e){let i=this._getEnd(t),r=[["song","\u{1F3B5} Song"],...e.lyrics_available?[["lyrics","\u{1F4D6} Lyrics"]]:[],["mood","\u{1F3AD} Mood"],["anchor","\u{1F516} Anchor"]],a=this._anchors??[];return n`<div class="path-end">
      <label class="end-label">${t==="start"?"Start":"End"}</label>
      <div class="mode small" role="radiogroup" aria-label=${t==="start"?"Start type":"End type"}>
        ${r.map(([l,c])=>n`<button
            role="radio"
            aria-checked=${i.mode===l}
            class=${i.mode===l?"on":""}
            @click=${()=>this._setPathMode(t,l)}
          >${c}</button>`)}
      </div>
      ${i.mode==="song"||i.mode==="lyrics"?n`<input
              class="search"
              type="search"
              aria-label=${t==="start"?"Start song":"End song"}
              placeholder="Song, artist or album"
              .value=${i.query}
              @input=${l=>this._onPathInput(t,l.target.value)}
              @keydown=${l=>{l.key==="Enter"&&i.results.length&&this._setEnd(t,{song:i.results[0],query:i.results[0].title,results:[]})}}
            />
            ${i.searching?n`<p class="muted">Searching…</p>`:h}
            ${i.results.length?n`<ul class="list">
                  ${i.results.map(l=>n`<li>
                      <button
                        class="row-button"
                        @click=${()=>this._setEnd(t,{song:l,query:l.title,results:[]})}
                      >
                        <span class="artist-text"
                          ><span>${l.title}</span><small>${l.artist}${l.album?` \xB7 ${l.album}`:""}</small></span
                        >
                      </button>
                    </li>`)}
                </ul>`:i.query.trim().length>=2&&!i.searching&&!i.song?n`<p class="muted">No analysed song matches that.</p>`:h}
            ${i.song?n`<p class="picked">✓ <strong>${i.song.title}</strong>
                  <span class="muted">${i.song.artist}${i.song.album?` \xB7 ${i.song.album}`:""}</span></p>`:h}`:i.mode==="mood"?n`<select
              class="search"
              aria-label=${t==="start"?"Start mood":"End mood"}
              .value=${i.mood}
              @change=${l=>this._setEnd(t,{mood:l.target.value})}
            >
              ${St.map(([l,c])=>n`<option value=${l} ?selected=${l===i.mood}>${c}</option>`)}
            </select>`:a.length?n`<select
                class="search"
                aria-label=${t==="start"?"Start anchor":"End anchor"}
                @change=${l=>this._setEnd(t,{anchorId:Number(l.target.value)})}
              >
                ${a.map(l=>n`<option value=${String(l.id)} ?selected=${l.id===i.anchorId}>${l.name}</option>`)}
              </select>`:n`<p class="muted">No anchors yet. Create them on AudioMuse-AI's
                <a href=${`${e.url}/alchemy`} target="_blank" rel="noreferrer">Song Alchemy</a> page.</p>`}
    </div>`}_renderPath(t){let e=this._busy!=="",i=!!(this._pathEndValue(this._pathStart)&&this._pathEndValue(this._pathEnd));return n`
      <h2>Song Path</h2>
      <p class="intro">Pick a start and an end, and get a playlist that moves gradually from one to the other.</p>
      ${this._renderPathEnd("start",t)} ${this._renderPathEnd("end",t)}
      ${this._pathStart.mode==="lyrics"?n`<p class="hint">Lyrics: the path follows what the songs are about as well as how they sound.</p>`:h}
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
        <button class="primary" ?disabled=${e||!i} @click=${()=>this._findPath()}>Find Path</button>
      </div>
      ${this._renderOutcome("path",t)}
    `}_renderArtists(t){let e=this._busy!=="";return n`
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
      ${this._artistSearching?n`<p class="muted">Searching…</p>`:h}
      ${this._artistResults.length?n`<ul class="list">
            ${this._artistResults.map(i=>n`<li>
                <button class="row-button" @click=${()=>this._pickArtist(i.name)}>
                  <span>${i.name}</span><span class="muted">${A(i.track_count)}</span>
                </button>
              </li>`)}
          </ul>`:this._artistQuery.trim().length>=2&&!this._artistSearching&&!this._selectedArtist?n`<p class="muted">No analysed artist matches that.</p>`:h}
      ${this._artistError?n`<p class="error">${this._artistError}</p>`:h}
      ${this._selectedArtist&&!this._artistResults.length?n`
            ${this._similarLoading?n`<p class="muted">Finding similar artists…</p>`:h}
            ${this._similar?n`<p class="muted">Sounds like <strong>${this._selectedArtist}</strong>. Tap an artist to see who
                    sounds like them.</p>
                  ${this._similar.length?n`<ul class="list similar">
                        ${this._similar.map((i,r)=>n`<li class=${r<this._includeSimilar?"included":""}>
                            <button class="row-button" @click=${()=>this._pickArtist(i.name)}>
                              <span class="artist-text"
                                ><span>${i.name}</span>${this._why&&i.sounds_alike?n`<small
                                      >"${i.sounds_alike.similar_song}" sounds like ${this._selectedArtist}'s
                                      "${i.sounds_alike.artist_song}"</small
                                    >`:h}</span
                              ><span class="muted">${A(i.track_count)}</span>
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
                        @change=${i=>{let r=parseInt(i.target.value,10);Number.isNaN(r)||(this._includeSimilar=Math.min(Math.max(r,0),20))}}
                      />
                      similar</label
                    >
                    <button class="primary" ?disabled=${e} @click=${()=>this._makeArtistMix()}>Make a mix</button>
                  </div>`:h}
          `:h}
      ${this._renderOutcome("artists",t)}
    `}_renderRadios(t){let e=(this._radios??[]).filter(i=>i.enabled).length;return n`
      <h3>Radios</h3>
      ${this._radiosError?n`<p class="error">${this._radiosError}</p>`:h}
      ${this._radios===null&&!this._radiosError?n`<p class="muted">Loading…</p>`:h}
      ${this._radios&&!this._radios.length?n`<p class="muted">No Radios yet. Create them on AudioMuse-AI's
            <a href=${`${t.url}/alchemy`} target="_blank" rel="noreferrer">Song Alchemy</a> page, then refresh them
            into your library from here.</p>`:h}
      ${this._radios?.length?n`<ul class="list">
              ${this._radios.map(i=>n`<li class="radio ${i.enabled?"":"off"}">
                  <span>${i.name}</span><span class="muted">${A(i.songs)}${i.enabled?"":" \xB7 off"}</span>
                </li>`)}
            </ul>
            <div class="row">
              <button ?disabled=${this._radiosBusy||!e} @click=${()=>this._runRadios()}>
                ${this._radiosBusy?"Refreshing\u2026":"Refresh into library"}
              </button>
            </div>`:h}
      ${this._radiosMsg?n`<p class="hint">${this._radiosMsg}</p>`:h}
    `}_renderRecent(){return n`
      <h3>Recent</h3>
      ${this._recent.length?n`<ul class="list recent-list">
            ${this._recent.map(t=>n`<li>
                <div class="recent-text">
                  <span>${t.display_name??t.playlist_name}</span>
                  <span class="muted"
                    >${zt(t.created)} · ${A(t.track_count)}${t.detail?n` · ${t.source==="artist"?"artist":t.source==="song"?"song":t.source==="path"?"path":t.source==="search"?"search":"request"}: ${t.detail}`:h}</span
                  >
                </div>
                ${this._canPlay&&t.playlist_id?n`<button ?disabled=${this._busy!==""} @click=${()=>this._playRecent(t)}>Play</button>`:h}
                <button class="icon" aria-label="Forget" title="Forget (the playlist stays in your library)"
                  @click=${()=>this._forgetRecent(t)}>×</button>
              </li>`)}
          </ul>`:n`<p class="muted">Playlists you save from Home Assistant appear here.</p>`}
      ${this._toastRecent?n`<p class="hint" role="status">${this._toastRecent}</p>`:h}
    `}};L.properties={hass:{attribute:!1},narrow:{type:Boolean},_info:{state:!0},_entryId:{state:!0},_prompt:{state:!0},_count:{state:!0},_name:{state:!0},_nameTouched:{state:!0},_busy:{state:!0},_error:{state:!0},_result:{state:!0},_artistQuery:{state:!0},_artistResults:{state:!0},_artistSearching:{state:!0},_selectedArtist:{state:!0},_similar:{state:!0},_similarLoading:{state:!0},_includeSimilar:{state:!0},_artistError:{state:!0},_radios:{state:!0},_radiosBusy:{state:!0},_radiosMsg:{state:!0},_radiosError:{state:!0},_recent:{state:!0},_toastRecent:{state:!0},_mode:{state:!0},_makingMode:{state:!0},_elapsed:{state:!0},_saved:{state:!0},_player:{state:!0},_ideas:{state:!0},_shownIdeas:{state:!0},_ideasError:{state:!0},_loadError:{state:!0},_tab:{state:!0},_resultTab:{state:!0},_similarCount:{state:!0},_why:{state:!0},_songQuery:{state:!0},_songResults:{state:!0},_songSearching:{state:!0},_songError:{state:!0},_seedSong:{state:!0},_seedMode:{state:!0},_anchors:{state:!0},_anchorId:{state:!0},_songCount:{state:!0},_limitPerArtist:{state:!0},_radius:{state:!0},_pathStart:{state:!0},_pathEnd:{state:!0},_pathCount:{state:!0},_pathExact:{state:!0}},L.styles=D`
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
  `;customElements.get("audiomuse-panel")||customElements.define("audiomuse-panel",L);export{Wt as SUGGESTIONS,wt as nameFromPrompt,A as songs,zt as whenText};
