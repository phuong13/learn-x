import{r as o,j as i}from"./index-CjWvOQUe.js";function w({children:u,color:d="rgba(255, 255, 255, 0.3)",duration:n=500,className:f,...m}){const[e,c]=o.useState([]),a=o.useRef(null),r=o.useRef(0),h=t=>{const l=a.current;if(!l)return;const s=l.getBoundingClientRect(),p=t.clientX-s.left,x=t.clientY-s.top,g=Math.max(s.width,s.height)*2,R={x:p,y:x,size:g,id:r.current};r.current=r.current+1,c([...e,R])};return o.useEffect(()=>{if(e.length>0){const t=setTimeout(()=>{c(e.slice(1))},n);return()=>clearTimeout(t)}},[e,n]),i.jsxs("button",{ref:a,className:`py-2 px-4  bg-gradient-to-br from-[#5BCEC9] to-[#14919B]
    shadow-md hover:shadow-lg text-white rounded-lg relative overflow-hidden ${f||""}`,onClick:h,...m,children:[e.map(t=>i.jsx("span",{style:{position:"absolute",left:t.x-t.size/2,top:t.y-t.size/2,width:t.size,height:t.size,borderRadius:"50%",backgroundColor:d,transform:"scale(0)",animation:`ripple ${n}ms linear`}},t.id)),u,i.jsx("style",{jsx:!0,children:`
        @keyframes ripple {
          to {
            transform: scale(1);
            opacity: 0;
          }
        }
      `})]})}export{w as R};
