import{e as b,g as w,bG as c,bH as f,s as k,m as S,h as x,r as R,i as M,j as m,w as $,y as U,M as j,N as _}from"./index-DLaGDpFt.js";function A(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function X(t){return parseFloat(t)}function q(t){return b("MuiSkeleton",t)}w("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const D=t=>{const{classes:a,variant:e,animation:n,hasChildren:s,width:i,height:r}=t;return U({root:["root",e,n,s&&"withChildren",s&&!i&&"fitContent",s&&!r&&"heightAuto"]},q,a)},o=c`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`,l=c`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`,E=typeof o!="string"?f`
        animation: ${o} 2s ease-in-out 0.5s infinite;
      `:null,I=typeof l!="string"?f`
        animation: ${l} 2s linear 0.5s infinite;
      `:null,N=k("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,a)=>{const{ownerState:e}=t;return[a.root,a[e.variant],e.animation!==!1&&a[e.animation],e.hasChildren&&a.withChildren,e.hasChildren&&!e.width&&a.fitContent,e.hasChildren&&!e.height&&a.heightAuto]}})(S(({theme:t})=>{const a=A(t.shape.borderRadius)||"px",e=X(t.shape.borderRadius);return{display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:x(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em",variants:[{props:{variant:"text"},style:{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${e}${a}/${Math.round(e/.6*10)/10}${a}`,"&:empty:before":{content:'"\\00a0"'}}},{props:{variant:"circular"},style:{borderRadius:"50%"}},{props:{variant:"rounded"},style:{borderRadius:(t.vars||t).shape.borderRadius}},{props:({ownerState:n})=>n.hasChildren,style:{"& > *":{visibility:"hidden"}}},{props:({ownerState:n})=>n.hasChildren&&!n.width,style:{maxWidth:"fit-content"}},{props:({ownerState:n})=>n.hasChildren&&!n.height,style:{height:"auto"}},{props:{animation:"pulse"},style:E||{animation:`${o} 2s ease-in-out 0.5s infinite`}},{props:{animation:"wave"},style:{position:"relative",overflow:"hidden",WebkitMaskImage:"-webkit-radial-gradient(white, black)","&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(t.vars||t).palette.action.hover},
                transparent
              )`,content:'""',position:"absolute",transform:"translateX(-100%)",bottom:0,left:0,right:0,top:0}}},{props:{animation:"wave"},style:{"&::after":I||{animation:`${l} 2s linear 0.5s infinite`}}}]}})),W=R.forwardRef(function(a,e){const n=M({props:a,name:"MuiSkeleton"}),{animation:s="pulse",className:i,component:r="span",height:u,style:g,variant:v="text",width:y,...d}=n,h={...n,animation:s,component:r,variant:v,hasChildren:!!d.children},C=D(h);return m.jsx(N,{as:r,ref:e,className:$(C.root,i),ownerState:h,...d,style:{width:y,height:u,...g}})});var p={},B=_;Object.defineProperty(p,"__esModule",{value:!0});var K=p.default=void 0,O=B(j()),P=m;K=p.default=(0,O.default)((0,P.jsx)("path",{d:"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"}),"Search");export{W as S,K as d};
