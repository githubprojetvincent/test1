import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Radar, Wifi, Smartphone, Monitor, Tv, RefreshCw} from 'lucide-react';
import './style.css';

type Device={name:string; ip:string; type:string; angle:number; distance:number; online:boolean};
const demo:Device[]=[
 {name:'Téléphone',ip:'192.168.1.12',type:'phone',angle:35,distance:28,online:true},
 {name:'PC Bureau',ip:'192.168.1.20',type:'pc',angle:145,distance:55,online:true},
 {name:'TV Salon',ip:'192.168.1.31',type:'tv',angle:245,distance:42,online:true},
];

function App(){
 const [scanning,setScanning]=useState(false); const [devices,setDevices]=useState< Device[]>(demo);
 const scan=()=>{setScanning(true);setTimeout(()=>{setDevices(demo);setScanning(false)},1200)};
 return <main><header><div><h1>WiFi Radar</h1><p>Surveillance de votre réseau local</p></div><button onClick={scan} disabled={scanning}><RefreshCw size={18} className={scanning?'spin':''}/> {scanning?'SCAN EN COURS':'LANCER LE SCAN'}</button></header>
 <section className="stats"><div><b>{devices.length}</b><span>Appareils détectés</span></div><div><b>✓</b><span>Réseau sécurisé</span></div><div><b>2.4 / 5</b><span>GHz</span></div></section>
 <section className="layout"><div className="radar"><div className="rings"></div><div className="cross h"></div><div className="cross v"></div><div className="center"><Wifi/></div>{devices.map((d,i)=><div key={i} className="blip" style={{left:`calc(50% + ${Math.sin(d.angle*Math.PI/180)*d.distance}% - 9px)`,top:`calc(50% - ${Math.cos(d.angle*Math.PI/180)*d.distance}% - 9px)`}} title={`${d.name} — ${d.ip}`}></div>)}<span className="label n">N</span><span className="label e">E</span><span className="label s">S</span><span className="label w">W</span></div>
 <aside><h2>Appareils présents</h2>{devices.map((d,i)=><article key={i}><div className="icon">{d.type==='phone'?<Smartphone/>:d.type==='tv'?<Tv/>:<Monitor/>}</div><div><strong>{d.name}</strong><small>{d.ip}</small></div><i className="online"></i></article>)}<p className="note">Le radar indique les appareils détectés sur votre réseau. Il ne permet pas de déterminer directement la présence d'une personne.</p></aside></section></main>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);