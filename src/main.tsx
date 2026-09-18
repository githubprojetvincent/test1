import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowUpRight, CalendarDays, Dumbbell, Ruler, Save,
  Settings, TrendingUp, UserRound, Weight, X
} from 'lucide-react';
import './style.css';

type SetRow = { weight: string; reps: string };
type Session = {
  id: number; date: string; name: string; duration: string; sets: number;
  exercises: string; note: string;
};
type Measure = {
  weight: string; height: string; shoulders: string; chest: string; arm: string;
  waist: string; thigh: string; calf: string;
};

const starterSessions: Session[] = [
  { id: 1, date: new Date().toISOString().slice(0,10), name: 'Push', duration: '62', sets: 16, exercises: 'Développé couché, Élévations latérales, Triceps', note: 'Bonne séance' },
  { id: 2, date: '2026-09-15', name: 'Pull', duration: '58', sets: 15, exercises: 'Tractions, Rowing, Curl biceps', note: '' },
  { id: 3, date: '2026-09-13', name: 'Legs', duration: '70', sets: 18, exercises: 'Squat, Presse, Leg curl', note: '' },
];

const starterMeasures: Measure = {
  weight: '', height: '', shoulders: '', chest: '', arm: '', waist: '', thigh: '', calf: ''
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch { return fallback; }
}

function App() {
  const [tab, setTab] = useState('home');
  const [measures, setMeasures] = useState<Measure>(() => load('muscu-measures', starterMeasures));
  const [sessions, setSessions] = useState<Session[]>(() => load('muscu-sessions', starterSessions));
  const [showSession, setShowSession] = useState(false);
  const [sessionName, setSessionName] = useState('Push');
  const [sessionNote, setSessionNote] = useState('');
  const [rows, setRows] = useState<SetRow[]>([
    {weight:'',reps:''},{weight:'',reps:''},{weight:'',reps:''},{weight:'',reps:''}
  ]);

  const saveMeasures = () => {
    localStorage.setItem('muscu-measures', JSON.stringify(measures));
    setTab('body');
  };

  const totalSessions = sessions.length;
  const avgDuration = Math.round(
    sessions.reduce((sum, s) => sum + (Number(s.duration) || 0), 0) / Math.max(totalSessions, 1)
  );
  const latestWeight = measures.weight || '—';

  const progression = useMemo(() => [
    {label:'Développé couché', value:'80 kg', delta:'+5 kg'},
    {label:'Squat', value:'100 kg', delta:'+10 kg'},
    {label:'Tractions', value:'+15 kg', delta:'+5 kg'},
  ], []);

  const addRow = () => setRows(r => [...r, {weight:'', reps:''}]);
  const removeRow = (i:number) => setRows(r => r.filter((_, idx) => idx !== i));

  const saveSession = () => {
    const filled = rows.filter(r => r.weight || r.reps);
    const newSession: Session = {
      id: Date.now(),
      date: new Date().toISOString().slice(0,10),
      name: sessionName,
      duration: '—',
      sets: filled.length,
      exercises: 'Série enregistrée',
      note: sessionNote
    };
    const next = [newSession, ...sessions];
    setSessions(next);
    localStorage.setItem('muscu-sessions', JSON.stringify(next));
    setShowSession(false);
    setSessionNote('');
    setRows([{weight:'',reps:''},{weight:'',reps:''},{weight:'',reps:''},{weight:'',reps:''}]);
    setTab('sessions');
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo"><Dumbbell size={22}/></div>
          <div>
            <strong>IronTrack</strong>
            <span>Mon suivi musculation</span>
          </div>
        </div>
        <button className="add" onClick={() => setShowSession(true)}><span>＋</span> Nouvelle séance</button>
      </header>

      <main>
        {tab === 'home' && (
          <>
            <section className="hero">
              <div>
                <p className="eyebrow">TON PROGRÈS</p>
                <h1>Simple. Rapide. <span>Régulier.</span></h1>
                <p className="muted">Tout ce qu'il faut pour suivre tes séances sans te perdre dans les tableaux.</p>
              </div>
              <div className="hero-figure"><UserRound size={104}/><div className="figure-glow"/></div>
            </section>

            <section className="stats">
              <Stat icon={<Weight size={18}/>} label="Poids" value={latestWeight} unit={latestWeight === '—' ? '' : 'kg'} />
              <Stat icon={<CalendarDays size={18}/>} label="Séances" value={String(totalSessions)} unit="total" />
              <Stat icon={<Activity size={18}/>} label="Durée moyenne" value={String(avgDuration)} unit="min" />
              <Stat icon={<TrendingUp size={18}/>} label="Objectif" value="Progression" unit="" />
            </section>

            <section className="grid2">
              <Card title="Cette semaine" icon={<CalendarDays size={18}/>} action="Voir les séances" onClick={() => setTab('sessions')}>
                <div className="week">
                  {['L','M','M','J','V','S','D'].map((d,i) => <div key={i} className={'day '+(i<4?'done':'')}><span>{d}</span><b>{i<4?'✓':''}</b></div>)}
                </div>
                <div className="progress-line"><span/><em>4 / 5 séances</em></div>
              </Card>
              <Card title="Tes performances" icon={<TrendingUp size={18}/>} action="Tout voir" onClick={() => setTab('performance')}>
                {progression.map((p, i) => <div className="perf" key={i}><div><strong>{p.label}</strong><small>Record actuel</small></div><b>{p.value}</b><span>{p.delta}</span></div>)}
              </Card>
            </section>

            <section className="quick">
              <button onClick={() => setShowSession(true)}><Dumbbell/><span><b>Commencer une séance</b><small>Enregistre poids & répétitions</small></span><ArrowUpRight/></button>
              <button onClick={() => setTab('body')}><Ruler/><span><b>Mettre mes mensurations</b><small>Poids, taille et corps</small></span><ArrowUpRight/></button>
            </section>
          </>
        )}

        {tab === 'sessions' && (
          <section>
            <div className="pageHead"><div><p className="eyebrow">HISTORIQUE</p><h2>Mes séances</h2><p className="muted">Toutes tes séances au même endroit.</p></div><button className="primary" onClick={() => setShowSession(true)}>＋ Nouvelle séance</button></div>
            <div className="sessionList">
              {sessions.map(s => <article className="session" key={s.id}><div className="sessionDate"><b>{new Date(s.date).getDate()}</b><span>{new Date(s.date).toLocaleDateString('fr-FR',{month:'short'})}</span></div><div className="sessionInfo"><strong>{s.name}</strong><span>{s.exercises}</span><small>{s.duration} min · {s.sets} séries {s.note ? '· '+s.note : ''}</small></div><ArrowUpRight/></article>)}
            </div>
          </section>
        )}

        {tab === 'performance' && (
          <section>
            <div className="pageHead"><div><p className="eyebrow">PROGRESSION</p><h2>Mes performances</h2><p className="muted">Tes records principaux.</p></div></div>
            <div className="performanceGrid">
              {progression.map((p, i) => <div className="bigPerf" key={i}><small>{p.label}</small><strong>{p.value}</strong><span>{p.delta} depuis ton suivi précédent</span><div className="miniChart"><i style={{height:(45+i*14)+'%'}}/><i style={{height:(62+i*10)+'%'}}/><i style={{height:(55+i*13)+'%'}}/><i style={{height:(76+i*7)+'%'}}/><i style={{height:(92)+'%'}}/></div></div>)}
            </div>
          </section>
        )}

        {tab === 'body' && (
          <section>
            <div className="pageHead"><div><p className="eyebrow">MON CORPS</p><h2>Mes mensurations</h2><p className="muted">Remplis une fois, puis mets à jour au fil des semaines.</p></div></div>
            <div className="bodyLayout">
              <div className="silhouette">
                <UserRound size={200} strokeWidth={1.2}/>
                <span className="pin p1">Épaules</span><span className="pin p2">Poitrine</span><span className="pin p3">Bras</span><span className="pin p4">Taille</span><span className="pin p5">Cuisses</span><span className="pin p6">Mollets</span>
              </div>
              <div className="formCard">
                <div className="formRow"><Field label="Poids (kg)" value={measures.weight} onChange={v=>setMeasures({...measures,weight:v})}/><Field label="Taille (cm)" value={measures.height} onChange={v=>setMeasures({...measures,height:v})}/></div>
                <div className="formRow"><Field label="Épaules" value={measures.shoulders} onChange={v=>setMeasures({...measures,shoulders:v})}/><Field label="Poitrine" value={measures.chest} onChange={v=>setMeasures({...measures,chest:v})}/></div>
                <div className="formRow"><Field label="Bras" value={measures.arm} onChange={v=>setMeasures({...measures,arm:v})}/><Field label="Taille" value={measures.waist} onChange={v=>setMeasures({...measures,waist:v})}/></div>
                <div className="formRow"><Field label="Cuisse" value={measures.thigh} onChange={v=>setMeasures({...measures,thigh:v})}/><Field label="Mollet" value={measures.calf} onChange={v=>setMeasures({...measures,calf:v})}/></div>
                <button className="primary save" onClick={saveMeasures}><Save size={18}/> Enregistrer</button>
              </div>
            </div>
          </section>
        )}
      </main>

      <nav className="bottomNav">
        {[
          ['home','Accueil',<Activity size={19}/>],
          ['sessions','Séances',<CalendarDays size={19}/>],
          ['performance','Performances',<TrendingUp size={19}/>],
          ['body','Corps',<Ruler size={19}/>],
        ].map(([id,label,icon]) => <button key={String(id)} className={tab===id?'active':''} onClick={()=>setTab(String(id))}>{icon}<span>{label}</span></button>)}
      </nav>

      {showSession && <div className="modalBack"><div className="modal"><div className="modalHead"><div><p className="eyebrow">NOUVELLE SÉANCE</p><h3>Enregistrer ma séance</h3></div><button onClick={()=>setShowSession(false)}><X/></button></div><label>Type de séance<select value={sessionName} onChange={e=>setSessionName(e.target.value)}><option>Push</option><option>Pull</option><option>Legs</option><option>Full Body</option></select></label><div className="setsTitle"><span>Poids</span><span>Reps</span></div>{rows.map((r,i)=><div className="setRow" key={i}><input placeholder="kg" value={r.weight} onChange={e=>setRows(rows.map((x,j)=>j===i?{...x,weight:e.target.value}:x))}/><input placeholder="reps" value={r.reps} onChange={e=>setRows(rows.map((x,j)=>j===i?{...x,reps:e.target.value}:x))}/>{rows.length>1&&<button onClick={()=>removeRow(i)}><X size={15}/></button>}</div>)}<button className="addSet" onClick={addRow}>＋ Ajouter une série</button><label>Note<textarea value={sessionNote} onChange={e=>setSessionNote(e.target.value)} placeholder="Comment était la séance ?"/></label><button className="primary save" onClick={saveSession}><Save size={18}/> Enregistrer la séance</button></div></div>}
    </div>
  );
}

function Stat({icon,label,value,unit}:{icon:React.ReactNode;label:string;value:string;unit:string}) {
  return <div className="stat"><div className="statIcon">{icon}</div><small>{label}</small><strong>{value}<em>{unit}</em></strong></div>
}
function Card({title,icon,action,onClick,children}:{title:string;icon:React.ReactNode;action:string;onClick:()=>void;children:React.ReactNode}) {
  return <div className="card"><div className="cardHead"><div><span>{icon}</span><strong>{title}</strong></div><button onClick={onClick}>{action}<ArrowUpRight size={14}/></button></div>{children}</div>
}
function Field({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}) {
  return <label className="field"><span>{label}</span><input inputMode="decimal" value={value} onChange={e=>onChange(e.target.value)} placeholder="—"/></label>
}

createRoot(document.getElementById('root')!).render(<App/>);
