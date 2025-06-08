import{r as n,j as i}from"./index-DgiJRG6U.js";function y({children:u,color:f="rgba(255, 255, 255, 0.3)",duration:o=500,className:m,...p}){const[e,c]=n.useState([]),a=n.useRef(null),r=n.useRef(0),d=t=>{const l=a.current;if(!l)return;const s=l.getBoundingClientRect(),x=t.clientX-s.left,h=t.clientY-s.top,R=Math.max(s.width,s.height)*2,g={x,y:h,size:R,id:r.current};r.current=r.current+1,c([...e,g])};return n.useEffect(()=>{if(e.length>0){const t=setTimeout(()=>{c(e.slice(1))},o);return()=>clearTimeout(t)}},[e,o]),i.jsxs("button",{ref:a,className:`py-2 px-4 bg-primaryDark text-white rounded-lg relative overflow-hidden ${m||""}`,onClick:d,...p,children:[e.map(t=>i.jsx("span",{style:{position:"absolute",left:t.x-t.size/2,top:t.y-t.size/2,width:t.size,height:t.size,borderRadius:"50%",backgroundColor:f,transform:"scale(0)",animation:`ripple ${o}ms linear`}},t.id)),u,i.jsx("style",{jsx:!0,children:`
        @keyframes ripple {
          to {
            transform: scale(1);
            opacity: 0;
          }
        }
      `})]})}export{y as R};
