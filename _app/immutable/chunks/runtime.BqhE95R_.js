var Dn=Array.isArray,Nn=Array.from,In=Object.defineProperty,_t=Object.getOwnPropertyDescriptor,$t=Object.getOwnPropertyDescriptors,Pn=Object.prototype,bn=Array.prototype,Zt=Object.getPrototypeOf;function Cn(t){return typeof t=="function"}const Fn=()=>{};function qn(t){return t()}function Wt(t){for(var n=0;n<t.length;n++)t[n]()}const E=2,dt=4,Z=8,st=16,m=32,W=64,tt=128,k=256,V=512,y=1024,R=2048,M=4096,I=8192,b=16384,zt=32768,yt=65536,Ln=1<<17,Jt=1<<19,Et=1<<20,ct=Symbol("$state"),Yn=Symbol("legacy props");function wt(t){return t===this.v}function Qt(t,n){return t!=t?n==n:t!==n||t!==null&&typeof t=="object"||typeof t=="function"}function mt(t){return!Qt(t,this.v)}function Xt(t){throw new Error("https://svelte.dev/e/effect_in_teardown")}function tn(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function nn(t){throw new Error("https://svelte.dev/e/effect_orphan")}function rn(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function Mn(){throw new Error("https://svelte.dev/e/hydration_failed")}function jn(t){throw new Error("https://svelte.dev/e/props_invalid_value")}function Un(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function Bn(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function en(){throw new Error("https://svelte.dev/e/state_unsafe_local_read")}function ln(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let z=!1;function Hn(){z=!0}const Vn=1,Gn=2,Kn=4,$n=8,Zn=16,Wn=4,zn=1,Jn=2,sn="[",un="[!",on="]",Tt={},Qn=Symbol();function ut(t,n){var r={f:0,v:t,reactions:null,equals:wt,version:0};return r}function Xn(t){return gt(ut(t))}function an(t,n=!1){var e;const r=ut(t);return n||(r.equals=mt),z&&f!==null&&f.l!==null&&((e=f.l).s??(e.s=[])).push(r),r}function tr(t,n=!1){return gt(an(t,n))}function gt(t){return a!==null&&a.f&E&&(w===null?Tn([t]):w.push(t)),t}function nr(t,n){return a!==null&&it()&&a.f&(E|st)&&(w===null||!w.includes(t))&&ln(),fn(t,n)}function fn(t,n){return t.equals(n)||(t.v=n,t.version=Ut(),At(t,R),it()&&o!==null&&o.f&y&&!(o.f&m)&&(v!==null&&v.includes(t)?(g(o,R),X(o)):A===null?gn([t]):A.push(t))),n}function At(t,n){var r=t.reactions;if(r!==null)for(var e=it(),l=r.length,s=0;s<l;s++){var u=r[s],i=u.f;i&R||!e&&u===o||(g(u,n),i&(y|k)&&(i&E?At(u,M):X(u)))}}function Rt(t){console.warn("https://svelte.dev/e/hydration_mismatch")}let P=!1;function rr(t){P=t}let T;function F(t){if(t===null)throw Rt(),Tt;return T=t}function er(){return F(C(T))}function lr(t){if(P){if(C(T)!==null)throw Rt(),Tt;T=t}}function sr(){for(var t=0,n=T;;){if(n.nodeType===8){var r=n.data;if(r===on){if(t===0)return n;t-=1}else(r===sn||r===un)&&(t+=1)}var e=C(n);n.remove(),n=e}}var vt,St,xt;function ur(){if(vt===void 0){vt=window;var t=Element.prototype,n=Node.prototype;St=_t(n,"firstChild").get,xt=_t(n,"nextSibling").get,t.__click=void 0,t.__className="",t.__attributes=null,t.__styles=null,t.__e=void 0,Text.prototype.__t=void 0}}function nt(t=""){return document.createTextNode(t)}function rt(t){return St.call(t)}function C(t){return xt.call(t)}function or(t,n){if(!P)return rt(t);var r=rt(T);if(r===null)r=T.appendChild(nt());else if(n&&r.nodeType!==3){var e=nt();return r==null||r.before(e),F(e),e}return F(r),r}function ar(t,n){if(!P){var r=rt(t);return r instanceof Comment&&r.data===""?C(r):r}return T}function ir(t,n=1,r=!1){let e=P?T:t;for(var l;n--;)l=e,e=C(e);if(!P)return e;var s=e==null?void 0:e.nodeType;if(r&&s!==3){var u=nt();return e===null?l==null||l.after(u):e.before(u),F(u),u}return F(e),e}function fr(t){t.textContent=""}function _n(t){var n=E|R;o===null?n|=k:o.f|=Et;var r=a!==null&&a.f&E?a:null;const e={children:null,ctx:f,deps:null,equals:wt,f:n,fn:t,reactions:null,v:null,version:0,parent:r??o};return r!==null&&(r.children??(r.children=[])).push(e),e}function _r(t){const n=_n(t);return n.equals=mt,n}function Ot(t){var n=t.children;if(n!==null){t.children=null;for(var r=0;r<n.length;r+=1){var e=n[r];e.f&E?ot(e):O(e)}}}function cn(t){for(var n=t.parent;n!==null;){if(!(n.f&E))return n;n=n.parent}return null}function kt(t){var n,r=o;$(cn(t));try{Ot(t),n=Bt(t)}finally{$(r)}return n}function Dt(t){var n=kt(t),r=(x||t.f&k)&&t.deps!==null?M:y;g(t,r),t.equals(n)||(t.v=n,t.version=Ut())}function ot(t){Ot(t),Y(t,0),g(t,b),t.v=t.children=t.deps=t.ctx=t.reactions=null}function Nt(t){o===null&&a===null&&nn(),a!==null&&a.f&k&&tn(),at&&Xt()}function vn(t,n){var r=n.last;r===null?n.last=n.first=t:(r.next=t,t.prev=r,n.last=t)}function j(t,n,r,e=!0){var l=(t&W)!==0,s=o,u={ctx:f,deps:null,deriveds:null,nodes_start:null,nodes_end:null,f:t|R,first:null,fn:n,last:null,next:null,parent:l?null:s,prev:null,teardown:null,transitions:null,version:0};if(r){var i=D;try{pt(!0),Q(u),u.f|=zt}catch(_){throw O(u),_}finally{pt(i)}}else n!==null&&X(u);var p=r&&u.deps===null&&u.first===null&&u.nodes_start===null&&u.teardown===null&&(u.f&Et)===0;if(!p&&!l&&e&&(s!==null&&vn(u,s),a!==null&&a.f&E)){var h=a;(h.children??(h.children=[])).push(u)}return u}function cr(t){Nt();var n=o!==null&&(o.f&m)!==0&&f!==null&&!f.m;if(n){var r=f;(r.e??(r.e=[])).push({fn:t,effect:o,reaction:a})}else{var e=It(t);return e}}function vr(t){return Nt(),pn(t)}function pr(t){const n=j(W,t,!0);return(r={})=>new Promise(e=>{r.outro?yn(n,()=>{O(n),e(void 0)}):(O(n),e(void 0))})}function It(t){return j(dt,t,!1)}function pn(t){return j(Z,t,!0)}function hr(t){return hn(t)}function hn(t,n=0){return j(Z|st|n,t,!0)}function dr(t,n=!0){return j(Z|m,t,!0,n)}function Pt(t){var n=t.teardown;if(n!==null){const r=at,e=a;ht(!0),K(null);try{n.call(null)}finally{ht(r),K(e)}}}function bt(t){var n=t.deriveds;if(n!==null){t.deriveds=null;for(var r=0;r<n.length;r+=1)ot(n[r])}}function Ct(t,n=!1){var r=t.first;for(t.first=t.last=null;r!==null;){var e=r.next;O(r,n),r=e}}function dn(t){for(var n=t.first;n!==null;){var r=n.next;n.f&m||O(n),n=r}}function O(t,n=!0){var r=!1;if((n||t.f&Jt)&&t.nodes_start!==null){for(var e=t.nodes_start,l=t.nodes_end;e!==null;){var s=e===l?null:C(e);e.remove(),e=s}r=!0}Ct(t,n&&!r),bt(t),Y(t,0),g(t,b);var u=t.transitions;if(u!==null)for(const p of u)p.stop();Pt(t);var i=t.parent;i!==null&&i.first!==null&&Ft(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes_start=t.nodes_end=null}function Ft(t){var n=t.parent,r=t.prev,e=t.next;r!==null&&(r.next=e),e!==null&&(e.prev=r),n!==null&&(n.first===t&&(n.first=e),n.last===t&&(n.last=r))}function yn(t,n){var r=[];qt(t,r,!0),En(r,()=>{O(t),n&&n()})}function En(t,n){var r=t.length;if(r>0){var e=()=>--r||n();for(var l of t)l.out(e)}else n()}function qt(t,n,r){if(!(t.f&I)){if(t.f^=I,t.transitions!==null)for(const u of t.transitions)(u.is_global||r)&&n.push(u);for(var e=t.first;e!==null;){var l=e.next,s=(e.f&yt)!==0||(e.f&m)!==0;qt(e,n,s?r:!1),e=l}}}function yr(t){Lt(t,!0)}function Lt(t,n){if(t.f&I){U(t)&&Q(t),t.f^=I;for(var r=t.first;r!==null;){var e=r.next,l=(r.f&yt)!==0||(r.f&m)!==0;Lt(r,l?n:!1),r=e}if(t.transitions!==null)for(const s of t.transitions)(s.is_global||n)&&s.in()}}let G=!1,et=[];function Yt(){G=!1;const t=et.slice();et=[],Wt(t)}function Er(t){G||(G=!0,queueMicrotask(Yt)),et.push(t)}function wn(){G&&Yt()}const Mt=0,mn=1;let B=!1,H=Mt,q=!1,L=null,D=!1,at=!1;function pt(t){D=t}function ht(t){at=t}let S=[],N=0;let a=null;function K(t){a=t}let o=null;function $(t){o=t}let w=null;function Tn(t){w=t}let v=null,d=0,A=null;function gn(t){A=t}let jt=1,x=!1,f=null;function Ut(){return++jt}function it(){return!z||f!==null&&f.l===null}function U(t){var u,i;var n=t.f;if(n&R)return!0;if(n&M){var r=t.deps,e=(n&k)!==0;if(r!==null){var l;if(n&V){for(l=0;l<r.length;l++)((u=r[l]).reactions??(u.reactions=[])).push(t);t.f^=V}for(l=0;l<r.length;l++){var s=r[l];if(U(s)&&Dt(s),e&&o!==null&&!x&&!((i=s==null?void 0:s.reactions)!=null&&i.includes(t))&&(s.reactions??(s.reactions=[])).push(t),s.version>t.version)return!0}}(!e||o!==null&&!x)&&g(t,y)}return!1}function An(t,n){for(var r=n;r!==null;){if(r.f&tt)try{r.fn(t);return}catch{r.f^=tt}r=r.parent}throw B=!1,t}function Rn(t){return(t.f&b)===0&&(t.parent===null||(t.parent.f&tt)===0)}function J(t,n,r,e){if(B){if(r===null&&(B=!1),Rn(n))throw t;return}r!==null&&(B=!0);{An(t,n);return}}function Bt(t){var ft;var n=v,r=d,e=A,l=a,s=x,u=w,i=f,p=t.f;v=null,d=0,A=null,a=p&(m|W)?null:t,x=!D&&(p&k)!==0,w=null,f=t.ctx;try{var h=(0,t.fn)(),_=t.deps;if(v!==null){var c;if(Y(t,d),_!==null&&d>0)for(_.length=d+v.length,c=0;c<v.length;c++)_[d+c]=v[c];else t.deps=_=v;if(!x)for(c=d;c<_.length;c++)((ft=_[c]).reactions??(ft.reactions=[])).push(t)}else _!==null&&d<_.length&&(Y(t,d),_.length=d);return h}finally{v=n,d=r,A=e,a=l,x=s,w=u,f=i}}function Sn(t,n){let r=n.reactions;if(r!==null){var e=r.indexOf(t);if(e!==-1){var l=r.length-1;l===0?r=n.reactions=null:(r[e]=r[l],r.pop())}}r===null&&n.f&E&&(v===null||!v.includes(n))&&(g(n,M),n.f&(k|V)||(n.f^=V),Y(n,0))}function Y(t,n){var r=t.deps;if(r!==null)for(var e=n;e<r.length;e++)Sn(t,r[e])}function Q(t){var n=t.f;if(!(n&b)){g(t,y);var r=o,e=f;o=t;try{n&st?dn(t):Ct(t),bt(t),Pt(t);var l=Bt(t);t.teardown=typeof l=="function"?l:null,t.version=jt}catch(s){J(s,t,r,e||t.ctx)}finally{o=r}}}function Ht(){if(N>1e3){N=0;try{rn()}catch(t){if(L!==null)J(t,L,null);else throw t}}N++}function Vt(t){var n=t.length;if(n!==0){Ht();var r=D;D=!0;try{for(var e=0;e<n;e++){var l=t[e];l.f&y||(l.f^=y);var s=[];Gt(l,s),xn(s)}}finally{D=r}}}function xn(t){var n=t.length;if(n!==0)for(var r=0;r<n;r++){var e=t[r];if(!(e.f&(b|I)))try{U(e)&&(Q(e),e.deps===null&&e.first===null&&e.nodes_start===null&&(e.teardown===null?Ft(e):e.fn=null))}catch(l){J(l,e,null,e.ctx)}}}function On(){if(q=!1,N>1001)return;const t=S;S=[],Vt(t),q||(N=0,L=null)}function X(t){H===Mt&&(q||(q=!0,queueMicrotask(On))),L=t;for(var n=t;n.parent!==null;){n=n.parent;var r=n.f;if(r&(W|m)){if(!(r&y))return;n.f^=y}}S.push(n)}function Gt(t,n){var r=t.first,e=[];t:for(;r!==null;){var l=r.f,s=(l&m)!==0,u=s&&(l&y)!==0,i=r.next;if(!u&&!(l&I))if(l&Z){if(s)r.f^=y;else try{U(r)&&Q(r)}catch(c){J(c,r,null,r.ctx)}var p=r.first;if(p!==null){r=p;continue}}else l&dt&&e.push(r);if(i===null){let c=r.parent;for(;c!==null;){if(t===c)break t;var h=c.next;if(h!==null){r=h;continue t}c=c.parent}}r=i}for(var _=0;_<e.length;_++)p=e[_],n.push(p),Gt(p,n)}function Kt(t){var n=H,r=S;try{Ht();const l=[];H=mn,S=l,q=!1,Vt(r);var e=t==null?void 0:t();return wn(),(S.length>0||l.length>0)&&Kt(),N=0,L=null,e}finally{H=n,S=r}}async function wr(){await Promise.resolve(),Kt()}function mr(t){var _;var n=t.f,r=(n&E)!==0;if(r&&n&b){var e=kt(t);return ot(t),e}if(a!==null){w!==null&&w.includes(t)&&en();var l=a.deps;v===null&&l!==null&&l[d]===t?d++:v===null?v=[t]:v.push(t),A!==null&&o!==null&&o.f&y&&!(o.f&m)&&A.includes(t)&&(g(o,R),X(o))}else if(r&&t.deps===null)for(var s=t,u=s.parent,i=s;u!==null;)if(u.f&E){var p=u;i=p,u=p.parent}else{var h=u;(_=h.deriveds)!=null&&_.includes(i)||(h.deriveds??(h.deriveds=[])).push(i);break}return r&&(s=t,U(s)&&Dt(s)),t.v}function Tr(t){const n=a;try{return a=null,t()}finally{a=n}}const kn=~(R|M|y);function g(t,n){t.f=t.f&kn|n}function gr(t,n=!1,r){f={p:f,c:null,e:null,m:!1,s:t,x:null,l:null},z&&!n&&(f.l={s:null,u:null,r1:[],r2:ut(!1)})}function Ar(t){const n=f;if(n!==null){const u=n.e;if(u!==null){var r=o,e=a;n.e=null;try{for(var l=0;l<u.length;l++){var s=u[l];$(s.effect),K(s.reaction),It(s.fn)}}finally{$(r),K(e)}}f=n.p,n.m=!0}return{}}function Rr(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(ct in t)lt(t);else if(!Array.isArray(t))for(let n in t){const r=t[n];typeof r=="object"&&r&&ct in r&&lt(r)}}}function lt(t,n=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!n.has(t)){n.add(t),t instanceof Date&&t.getTime();for(let e in t)try{lt(t[e],n)}catch{}const r=Zt(t);if(r!==Object.prototype&&r!==Array.prototype&&r!==Map.prototype&&r!==Set.prototype&&r!==Date.prototype){const e=$t(r);for(let l in e){const s=e[l].get;if(s)try{s.call(t)}catch{}}}}}export{st as $,_n as A,Hn as B,In as C,K as D,yt as E,$ as F,Dn as G,un as H,a as I,o as J,ur as K,rt as L,sn as M,C as N,Tt as O,on as P,Rt as Q,Mn as R,fr as S,Nn as T,Qn as U,pr as V,nt as W,zn as X,Jn as Y,Fn as Z,O as _,er as a,zt as a0,It as a1,Cn as a2,Er as a3,Wn as a4,nr as a5,tr as a6,ct as a7,Pn as a8,bn as a9,ut as aa,Un as ab,_t as ac,Bn as ad,Zt as ae,pn as af,jn as ag,Ln as ah,Kn as ai,mt as aj,m as ak,W as al,Vn as am,Gn as an,$n as ao,Yn as ap,_r as aq,an as ar,Zn as as,Kt as at,wr as au,Xn as av,Qt as aw,hn as b,rr as c,yr as d,dr as e,T as f,gr as g,P as h,ar as i,Ar as j,or as k,lr as l,ir as m,f as n,z as o,yn as p,Tr as q,sr as r,F as s,hr as t,cr as u,vr as v,Wt as w,mr as x,qn as y,Rr as z};