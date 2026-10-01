import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const map = L.map('map').setView([49.18, 2.0], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors'}).addTo(map);

const points=[]; let poly=null; const markers=[];

const canvas=document.querySelector('#preview');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true}); renderer.setPixelRatio(devicePixelRatio); renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(48,2,0.1,1000); camera.position.set(0,18,24); camera.lookAt(0,0,0);
scene.add(new THREE.HemisphereLight(0xa9c7ff,0x1d241d,2));
const grid=new THREE.GridHelper(200,40,0x27313c,0x141a20); grid.rotation.x=0; scene.add(grid);
const group=new THREE.Group(); scene.add(group);

function meters(a,b){const R=6371000, p=Math.PI/180; const dLat=(b.lat-a.lat)*p, dLon=(b.lng-a.lng)*p; const x=dLon*Math.cos((a.lat+b.lat)*p/2), y=dLat; return Math.sqrt(x*x+y*y)*R;}
function totalDistance(){let d=0; for(let i=1;i<points.length;i++)d+=meters(points[i-1],points[i]); return d;}
function project(p,center){const R=6371000,pd=Math.PI/180; return {x:(p.lng-center.lng)*pd*R*Math.cos(center.lat*pd),z:-(p.lat-center.lat)*pd*R};}
function rebuild(){
 group.clear(); if(points.length<2)return;
 const center=points[Math.floor(points.length/2)]; const width=+document.querySelector('#width').value;
 const roadPts=points.map(p=>project(p,center)); const geo=new THREE.BufferGeometry(); const pos=[];
 for(let i=0;i<roadPts.length;i++){
   const a=roadPts[Math.max(0,i-1)],b=roadPts[Math.min(roadPts.length-1,i+1)];
   const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz)||1,nx=-dz/len,nz=dx/len;
   pos.push(roadPts[i].x+nx*width/2,0,roadPts[i].z+nz*width/2);
   pos.push(roadPts[i].x-nx*width/2,0,roadPts[i].z-nz*width/2);
 }
 for(let i=0;i<roadPts.length-1;i++){const k=i*2; geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));}
 const idx=[]; for(let i=0;i<roadPts.length-1;i++){const k=i*2; idx.push(k,k+1,k+2,k+1,k+3,k+2)} geo.setIndex(idx); geo.computeVertexNormals();
 const mat=new THREE.MeshStandardMaterial({color:0x3c4248,roughness:.95});
 group.add(new THREE.Mesh(geo,mat));
 const linePts=roadPts.map(p=>new THREE.Vector3(p.x,.04,p.z)); group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePts),new THREE.LineBasicMaterial({color:0xff6a00})));
 camera.position.set(0,Math.max(22,Math.min(90,totalDistance()/5)),Math.max(28,totalDistance()/6)); camera.lookAt(0,0,0);
}
function refresh(){
 document.querySelector('#pointsStat').textContent=points.length;
 document.querySelector('#distanceStat').textContent=Math.round(totalDistance())+' m';
 document.querySelector('#widthValue').textContent=document.querySelector('#width').value;
 document.querySelector('#jsonPreview').textContent=JSON.stringify(projectData(),null,2);
 rebuild();
}
function projectData(){return {name:'AC RouteForge Track',version:1,settings:{width:+width.value,banking:+banking.value,resolution:resolution.value},route:points.map(p=>({lat:+p.lat.toFixed(7),lng:+p.lng.toFixed(7)})),distance_m:+totalDistance().toFixed(2)}}
map.on('click',e=>{points.push({lat:e.latlng.lat,lng:e.latlng.lng}); const m=L.circleMarker(e.latlng,{radius:5,color:'#ff6a00',fillOpacity:1}).addTo(map); markers.push(m); if(poly)poly.setLatLngs(points); else poly=L.polyline(points,{color:'#ff6a00',weight:3}).addTo(map); refresh()});
document.querySelector('#undoBtn').onclick=()=>{points.pop(); const m=markers.pop(); if(m)m.remove(); if(poly)poly.setLatLngs(points); refresh()};
document.querySelector('#finishBtn').onclick=()=>{if(points.length>2) poly.setLatLngs([...points,points[0]])};
document.querySelector('#newBtn').onclick=()=>location.reload();
document.querySelector('#width').oninput=refresh; document.querySelector('#banking').oninput=refresh; document.querySelector('#resolution').onchange=refresh;
document.querySelector('#exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(projectData(),null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ac-routeforge-track.json'; a.click(); URL.revokeObjectURL(a.href)};
function animate(t){renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);camera.aspect=canvas.clientWidth/canvas.clientHeight;camera.updateProjectionMatrix(); renderer.render(scene,camera);requestAnimationFrame(animate)} requestAnimationFrame(animate); refresh();
