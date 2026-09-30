import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { LEVELS, REGLAMENTO } from './reglamentoData';

const levelById = (id) => LEVELS.find(l => l.id === id) || LEVELS[0];

// Texto con **negrita** y [[punto a definir]]
function Rich({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|\[\[[^\]]+\]\])/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith('**')) return <strong key={i} className="text-[#f3e5ab]">{p.slice(2, -2)}</strong>;
    if (p.startsWith('[[')) return <span key={i} className="bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded px-1.5 py-0.5 text-xs mx-0.5">{p.slice(2, -2)}</span>;
    return <span key={i}>{p}</span>;
  });
}

export function LevelBadge({ level }) {
  const l = levelById(level);
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#f3e5ab]/50 bg-[#f3e5ab]/10 text-[#f3e5ab]">
      <span>{l.icon}</span>{l.name}
    </span>
  );
}

// Bloque de progreso + código de invitación (perfil)
export function ProgressBlock({ currentUser }) {
  const [stats, setStats] = useState({ approved: 0, guests: [] });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const { count } = await supabase.from('posts').select('id', { count: 'exact', head: true })
        .eq('author_id', currentUser.id).eq('status', 'approved');
      const { data: guests } = await supabase.from('profiles').select('id, level').eq('invited_by', currentUser.id);
      setStats({ approved: count || 0, guests: guests || [] });
    })();
  }, [currentUser?.id, currentUser?.level]);

  const lvl = levelById(currentUser.level);
  const idx = LEVELS.findIndex(l => l.id === lvl.id);
  const next = LEVELS[idx + 1];
  const days = Math.floor((Date.now() - new Date(currentUser.created_at || Date.now())) / 86400000);
  const guestsArtesano = stats.guests.filter(g => ['artesano', 'maestro', 'medici'].includes(g.level)).length;
  const link = `${window.location.origin}/?ref=${currentUser.invite_code || ''}`;

  let checks = [];
  if (next?.id === 'discipulo') checks = [
    ['Perfil verificado', !!currentUser.curated],
    [`Obras aprobadas: ${stats.approved}/3`, stats.approved >= 3]
  ];
  if (next?.id === 'artesano') checks = [
    [`Antigüedad: ${days}/60 días`, days >= 60],
    [`Obras aprobadas: ${stats.approved}/10`, stats.approved >= 10]
  ];
  if (next?.id === 'maestro') checks = [
    [`Invitados que llegaron a Artesano: ${guestsArtesano}/5`, guestsArtesano >= 5]
  ];

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) { alert(link); }
  };

  return (
    <div className="bg-black/60 border border-[#f3e5ab]/40 rounded-2xl p-6 space-y-4">
      <h3 className="text-sm uppercase tracking-widest text-[#f3e5ab] font-bold">Mi nivel</h3>
      <div className="flex items-center gap-3">
        <LevelBadge level={lvl.id} />
        <span className="text-xs text-gray-400">{lvl.unlocks}</span>
      </div>
      {next ? (
        <div className="space-y-2">
          <p className="text-xs text-gray-300">Para llegar a <b className="text-[#f3e5ab]">{next.icon} {next.name}</b>:</p>
          {checks.length > 0 ? checks.map(([t, ok], i) => (
            <p key={i} className={`text-sm ${ok ? 'text-green-300' : 'text-gray-300'}`}>{ok ? '✅' : '⬜'} {t}</p>
          )) : <p className="text-sm text-gray-300">{next.how}</p>}
          <p className="text-xs text-gray-500">Los ascensos los confirma la curaduría.</p>
        </div>
      ) : <p className="text-sm text-green-300">Llegaste al nivel más alto.</p>}
      <div className="border-t border-white/10 pt-4 space-y-2">
        <p className="text-xs text-gray-300">Tu código de invitación: <b className="text-[#f3e5ab] text-base tracking-widest">{currentUser.invite_code || '…'}</b></p>
        <p className="text-xs text-gray-400">Invitados: {stats.guests.length} · que llegaron a Artesano: {guestsArtesano}</p>
        <button type="button" onClick={copy} className="bg-[#f3e5ab]/15 border border-[#f3e5ab]/50 text-[#f3e5ab] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#f3e5ab] hover:text-black transition">
          {copied ? '¡Copiado!' : 'Copiar enlace de invitación'}
        </button>
      </div>
    </div>
  );
}

// Controles de nivel (panel admin)
export function AdminLevels() {
  const [profs, setProfs] = useState([]);
  const [q, setQ] = useState('');

  const load = async () => {
    const { data, error } = await supabase.from('profiles').select('id, name, username, level').order('created_at', { ascending: false }).limit(100);
    if (error) console.error(error); else setProfs(data || []);
  };
  useEffect(() => { load(); }, []);

  const setLevel = async (id, level) => {
    const { error } = await supabase.from('profiles').update({ level }).eq('id', id);
    if (error) { alert('Error: ' + error.message); return; }
    load();
  };

  const shown = profs.filter(p => (p.name + ' ' + p.username).toLowerCase().includes(q.toLowerCase()));

  return (
    <section className="space-y-4">
      <h3 className="text-sm uppercase tracking-widest text-[#f3e5ab] font-bold">Niveles de los integrantes</h3>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o usuario"
        className="w-full bg-black/70 border border-white/20 rounded-xl p-3 text-xs text-white" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {shown.map(p => (
          <div key={p.id} className="bg-black/70 p-3 rounded-2xl border border-white/15 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#f3e5ab] truncate">{p.name}</p>
              <p className="text-xs text-gray-400 truncate">@{p.username}</p>
            </div>
            <select value={p.level || 'aprendiz'} onChange={(e) => setLevel(p.id, e.target.value)}
              className="bg-black border border-[#f3e5ab]/40 text-[#f3e5ab] text-xs rounded-lg p-2">
              {LEVELS.map(l => <option key={l.id} value={l.id}>{l.icon} {l.name}</option>)}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}

function Shell({ title, children }) {
  return (
    <main className="w-full max-w-4xl mx-auto bg-black/80 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-[#f3e5ab]/40 shadow-2xl space-y-6">
      <h2 className="text-2xl font-bold text-[#f3e5ab]">{title}</h2>
      {children}
    </main>
  );
}

export function LevelsPage() {
  return (
    <Shell title="🏛️ Escalafón de estatus">
      <p className="text-sm text-gray-300">Los integrantes avanzan por cinco niveles. Las cifras son una propuesta inicial.</p>
      <div className="space-y-4">
        {LEVELS.map((l, i) => (
          <div key={l.id} className="bg-black/60 border border-[#f3e5ab]/30 rounded-2xl p-5 space-y-2">
            <h3 className="text-lg font-bold text-[#f3e5ab]">{l.icon} {i + 1}. {l.name}</h3>
            <p className="text-sm text-gray-300"><b className="text-[#f3e5ab]">Cómo se llega:</b> <Rich text={l.how} /></p>
            <p className="text-sm text-gray-300"><b className="text-[#f3e5ab]">Qué habilita:</b> <Rich text={l.unlocks} /></p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function ReglamentoPage({ rules = [] }) {
  const renderBlock = (b, i) => {
    switch (b.type) {
      case 'p': return <p key={i} className="text-sm text-gray-300 leading-relaxed"><Rich text={b.text} /></p>;
      case 'h': return <h4 key={i} className="text-base font-bold text-[#f3e5ab] pt-2">{b.text}</h4>;
      case 'ul': return <ul key={i} className="list-disc pl-5 space-y-1 text-sm text-gray-300">{b.items.map((t, j) => <li key={j}><Rich text={t} /></li>)}</ul>;
      case 'ol': return <ol key={i} className="list-decimal pl-5 space-y-1 text-sm text-gray-300">{b.items.map((t, j) => <li key={j}><Rich text={t} /></li>)}</ol>;
      case 'table': return (
        <div key={i} className="overflow-x-auto">
          <table className="w-full text-sm border border-white/15">
            <thead><tr>{b.headers.map((h, j) => <th key={j} className="text-left p-2 bg-[#f3e5ab]/10 text-[#f3e5ab] border border-white/15">{h}</th>)}</tr></thead>
            <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k} className="p-2 border border-white/15 text-gray-300 align-top"><Rich text={c} /></td>)}</tr>)}</tbody>
          </table>
        </div>
      );
      case 'rules': return (
        <ol key={i} className="list-decimal pl-5 space-y-2 text-sm text-gray-300">
          {rules.map((r, j) => <li key={j}><b className="text-[#f3e5ab]">{r.t}</b> {r.d}</li>)}
        </ol>
      );
      case 'levels': return (
        <ul key={i} className="space-y-2 text-sm text-gray-300">
          {LEVELS.map(l => <li key={l.id}><b className="text-[#f3e5ab]">{l.icon} {l.name}.</b> <Rich text={l.how} /> <span className="text-gray-400">Habilita: <Rich text={l.unlocks} /></span></li>)}
        </ul>
      );
      default: return null;
    }
  };

  return (
    <Shell title="📜 Reglamento de la Red Da Vinci">
      {REGLAMENTO.map((s, i) => (
        <section key={i} className="space-y-3 border-t border-white/10 pt-5">
          <h3 className="text-lg font-bold text-[#f3e5ab]">{i + 1}. {s.title}</h3>
          {s.blocks.map(renderBlock)}
        </section>
      ))}
    </Shell>
  );
}
