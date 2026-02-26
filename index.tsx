
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, ChevronRight, ChevronLeft, Zap, Radio, Send, CheckCircle2, 
  Play, Activity, Youtube, Eye, Loader2, Lock, Check, Mail, Info, Globe, Mic, Users, AlertCircle, FileText, ArrowLeft
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { OrderFormData, PlatformType, VoiceOption } from './types';
import { PLATFORMS, MUSICAL_STYLES, LANGUAGES, TEMPOS, MOODS, ADMIN_EMAIL, ADMIN_PASS, DEMO_TRACKS } from './constants';

// Dictionary for display labels
const voiceLabels: Record<string, string> = {
  'female_solo': 'Femme Solo',
  'male_solo': 'Homme Solo',
  'duo_ff': 'Duo F+F',
  'duo_hh': 'Duo H+H',
  'duo_fh': 'Duo H+F'
};

// --- BACKGROUND COMPONENTS ---

const BackgroundDecorations = () => {
  const notes = ['♪', '♫', '♬', '𝄞', '♭', '♯', '𝄢'];
  const colors = ['#ff5e00', '#00f2ff', '#ff00e1'];

  const floatingNotes = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      char: notes[i % notes.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 20}s`,
      duration: `${15 + Math.random() * 10}s`,
      size: `${20 + Math.random() * 40}px`
    }));
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      color: colors[i % colors.length],
      delay: `${Math.random() * 5}s`
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {floatingNotes.map(note => (
        <div 
          key={note.id} 
          className="music-note-anim" 
          style={{ 
            '--left': note.left, 
            '--delay': note.delay, 
            '--duration': note.duration, 
            '--size': note.size 
          } as any}
        >
          {note.char}
        </div>
      ))}
      {particles.map(p => (
        <div 
          key={p.id} 
          className="particle-anim" 
          style={{ 
            '--top': p.top, 
            '--left': p.left, 
            '--delay': p.delay,
            color: p.color,
            backgroundColor: p.color
          } as any}
        />
      ))}
      <div className="equalizer-container">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="eq-bar" 
            style={{ 
              animationDelay: `${Math.random()}s`,
              backgroundColor: colors[i % colors.length],
              height: `${10 + Math.random() * 40}px`,
              width: '4px'
            }}
          />
        ))}
      </div>
    </div>
  );
};

// --- UI COMPONENTS ---

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 py-4 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="h-10 w-10 bg-pyronix-orange rounded-lg flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,94,0,0.5)]">P</div>
          <span className="font-black tracking-[0.3em] text-lg uppercase hidden sm:block text-white">PYRONIX <span className="text-pyronix-orange">MUSIC</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/" className={`text-xs font-black tracking-widest hover:text-pyronix-orange transition-colors ${location.pathname === '/' ? 'text-pyronix-orange' : 'text-gray-400'}`}>ACCUEIL</Link>
          <Link to="/commander" className="bg-gradient-to-r from-pyronix-orange to-red-600 text-white px-8 py-3 rounded-full text-xs font-black tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2">COMMANDER <ChevronRight size={14}/></Link>
        </nav>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={28}/> : <Menu size={28}/>}</button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-t border-white/5 p-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-black uppercase tracking-tighter italic text-white text-center">Accueil</Link>
          <Link to="/commander" onClick={() => setIsOpen(false)} className="bg-pyronix-orange text-white py-6 rounded-2xl text-center font-black text-xl uppercase tracking-widest">Commander</Link>
        </div>
      )}
    </header>
  );
};

const VideoDemo = ({ track }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbUrl = `https://img.youtube.com/vi/${track.youtubeId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${track.youtubeId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;

  return (
    <div className={`glass-morphism p-5 rounded-[2rem] transition-all duration-500 border-2 shadow-2xl ${track.color} ${track.glow} hover:scale-[1.02] group text-white`}>
      <div className="space-y-4 text-left">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-black text-lg uppercase tracking-tight leading-none mb-1">{track.title}</h4>
            <p className={`text-[9px] font-bold uppercase tracking-widest ${track.accent}`}>{track.style}</p>
          </div>
          <a href={`https://www.youtube.com/watch?v=${track.youtubeId}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-red-600 transition-colors">
            <Youtube size={16} />
          </a>
        </div>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-charcoal shadow-inner border border-white/5 cursor-pointer" onClick={() => setIsPlaying(true)}>
           {!isPlaying ? (
             <>
               <img src={thumbUrl} alt={track.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${track.youtubeId}/hqdefault.jpg` }} />
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                  <div className="h-16 w-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 text-white shadow-2xl group-hover:scale-125 transition-transform duration-500">
                     <Play size={28} fill="white" className="ml-1" />
                  </div>
                  <span className="mt-4 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Lire l'extrait</span>
               </div>
             </>
           ) : (
             <iframe src={embedUrl} title={track.title} className="absolute top-0 left-0 w-full h-full border-0 z-10" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
           )}
        </div>
        <div className="flex items-center justify-between pt-1">
           <div className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-500 tracking-widest">
              <Activity size={10} className={track.accent} /> EXCLUSIVITÉ STUDIO
           </div>
           <a href={`https://www.youtube.com/watch?v=${track.youtubeId}`} target="_blank" className="text-[8px] font-black uppercase px-2 py-1 rounded bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">LIEN DIRECT</a>
        </div>
      </div>
    </div>
  );
};

const Home = () => (
  <div className="animate-in fade-in duration-700 pb-20 text-center text-white bg-transparent">
    <section className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-morphism border-white/10 text-[10px] font-black tracking-widest text-pyronix-cyan mb-10 uppercase animate-pulse"><Radio size={12}/> Studio de Production Masterclass</div>
      <h1 className="text-6xl md:text-[8rem] font-outfit font-black mb-10 leading-[0.9] uppercase tracking-tighter text-white">
        <span>FEEL THE</span> <br />
        <span className="gradient-pyronix">POWER</span> <br />
        <span>OF SOUND</span>
      </h1>
      <p className="text-gray-400 text-lg md:text-2xl mb-16 max-w-2xl mx-auto font-medium italic">"L'excellence sonore au service de ton identité artistique."</p>
      <div className="flex justify-center gap-8">
          <Link to="/commander" className="inline-flex items-center gap-4 bg-gradient-to-r from-pyronix-orange to-red-600 text-white px-10 py-5 rounded-2xl font-black text-xl tracking-widest hover:scale-110 transition-all shadow-[0_0_40px_rgba(255,94,0,0.3)]">COMMENCER <ChevronRight size={24}/></Link>
      </div>
    </section>
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white flex items-center justify-center gap-4">
          <Activity className="text-pyronix-orange" /> Studio <span className="text-pyronix-magenta">Vibes</span> <Activity className="text-pyronix-magenta" />
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {DEMO_TRACKS.map(track => <VideoDemo key={track.id} track={track} />)}
      </div>
    </section>
  </div>
);

const OrderForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    email: '', platform: 'TikTok', platform_other: '', handle: '', title: '',
    styles: [], styles_other: '', voice: 'female_solo',
    languages: [], languages_other: '', mood: 'Énergique', mood_other: '', energy: 3, tempo: 'moyen',
    subject: '', acceptTerms: false,
    duo_config: {
      voice1: { gender: 'female', languages: [], other: '' },
      voice2: { gender: 'male', languages: [], other: '' }
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!formData.email) e.email = "Email requis";
      if (!formData.handle) e.handle = "Pseudo requis";
      if (formData.platform === 'Autre' && !formData.platform_other) e.platform_other = "Précisez le réseau";
    } else if (step === 2) {
      if (!formData.title) e.title = "Titre requis";
      if (formData.styles.length === 0) e.styles = "Style requis";
      if (formData.styles.includes('Autre') && !formData.styles_other) e.styles_other = "Précisez le style";
      
      const isDuo = (formData.voice as string).startsWith('duo');
      if (isDuo) {
        if (formData.duo_config?.voice1.languages.length === 0) e.languages_v1 = "Langue requise (Voix 1)";
        if (formData.duo_config?.voice2.languages.length === 0) e.languages_v2 = "Langue requise (Voix 2)";
        if (formData.duo_config?.voice1.languages.includes('Autre') && !formData.duo_config.voice1.other) e.languages_v1_other = "Précisez";
        if (formData.duo_config?.voice2.languages.includes('Autre') && !formData.duo_config.voice2.other) e.languages_v2_other = "Précisez";
      } else {
        if (formData.languages.length === 0) e.languages = "Langue requise";
        if (formData.languages.includes('Autre') && !formData.languages_other) e.languages_other = "Précisez la langue";
      }
    } else if (step === 3) {
      if (formData.mood === 'Autre' && !formData.mood_other) e.mood_other = "Précisez l'ambiance";
      if (formData.subject.length < 200) e.subject = "Minimum 200 caractères requis";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) { setStep(step + 1); window.scrollTo(0, 0); } };
  const handlePrev = () => setStep(step - 1);

  const toggleStyle = (style: string) => {
    if (formData.styles.includes(style)) {
      setFormData({...formData, styles: formData.styles.filter(s => s !== style)});
    } else if (formData.styles.length < 4) {
      setFormData({...formData, styles: [...formData.styles, style]});
    }
  };

  const setSoloLanguage = (lang: string) => {
    setFormData({...formData, languages: [lang]});
  };

  const setDuoLanguage = (voiceIdx: 1 | 2, lang: string) => {
    if (!formData.duo_config) return;
    const config = { ...formData.duo_config };
    if (voiceIdx === 1) config.voice1.languages = [lang];
    else config.voice2.languages = [lang];
    setFormData({ ...formData, duo_config: config });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (step < 4) return handleNext();
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const isDuo = (formData.voice as string).startsWith('duo');
      
      let langDetails = "";
      if (isDuo && formData.duo_config) {
        const l1 = formData.duo_config.voice1.languages.includes('Autre') ? formData.duo_config.voice1.other : formData.duo_config.voice1.languages[0];
        const l2 = formData.duo_config.voice2.languages.includes('Autre') ? formData.duo_config.voice2.other : formData.duo_config.voice2.languages[0];
        langDetails = `Voix 1 : ${l1} | Voix 2 : ${l2}`;
      } else {
        langDetails = formData.languages.includes('Autre') ? formData.languages_other : formData.languages[0];
      }

      const prompt = `Génère un résumé épique du projet musical "${formData.title}" pour l'artiste ${formData.handle}. Styles: ${formData.styles.join(', ')}. Mode: ${voiceLabels[formData.voice as string]}. Vibe: ${formData.mood}. Langues: ${langDetails}.`;
      const aiRes = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      const summary = aiRes.text || "Prêt pour la production.";

      const subject = encodeURIComponent(`NOUVELLE COMMANDE STUDIO : ${formData.title}`);
      const body = encodeURIComponent(`
PROJET PYRONIX MUSIC :
---------------------------
Titre : ${formData.title}
Artiste : ${formData.handle}
Email : ${formData.email}
Réseau : ${formData.platform === 'Autre' ? formData.platform_other : formData.platform}

TECHNIQUE :
---------------------------
Voix : ${voiceLabels[formData.voice as string] || formData.voice}
Styles : ${formData.styles.join(', ')} ${formData.styles_other ? `(${formData.styles_other})` : ''}
Langues : ${langDetails}
Mood : ${formData.mood} ${formData.mood_other ? `(${formData.mood_other})` : ''}
Tempo : ${formData.tempo}
Énergie : ${formData.energy}/5

HISTOIRE :
---------------------------
${formData.subject}

BRIEFING IA :
---------------------------
${summary}
    `);

      const orders = JSON.parse(localStorage.getItem('pyronix_orders') || '[]');
      const newOrder = { ...formData, id: `PY-${Date.now()}`, created_at: new Date().toISOString(), status: 'new', ai_summary: summary };
      localStorage.setItem('pyronix_orders', JSON.stringify([newOrder, ...orders]));

      window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
      setLoading(false);
      navigate('/merci', { state: { email: formData.email } });
    } catch (err) {
      setLoading(false);
      navigate('/merci', { state: { email: formData.email } });
    }
  };

  return (
    <div className="py-20 px-6 max-w-6xl mx-auto pb-40 text-white text-left bg-transparent">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black uppercase mb-4 tracking-widest text-pyronix-orange italic">Studio Patch {step}/4</h2>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-pyronix-orange transition-all duration-500" style={{width: `${(step/4)*100}%`}}></div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="glass-morphism p-8 md:p-16 rounded-[3rem] border-4 border-[#222] shadow-2xl relative">
        {step === 1 && (
          <div className="space-y-12 animate-in slide-in-from-right duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full bg-black/40 border-b-2 p-6 text-xl outline-none focus:border-pyronix-orange transition-all text-white rounded-t-xl ${errors.email ? 'border-red-500' : 'border-white/10'}`} placeholder="votre@email.com" />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Pseudo Artiste</label>
                <input type="text" value={formData.handle} onChange={e => setFormData({...formData, handle: e.target.value})} className={`w-full bg-black/40 border-b-2 p-6 text-xl outline-none focus:border-pyronix-cyan transition-all text-white rounded-t-xl ${errors.handle ? 'border-red-500' : 'border-white/10'}`} placeholder="@pseudo" />
              </div>
            </div>
            <div className="space-y-6">
              <label className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Réseau Social Principal</label>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {PLATFORMS.map(p => (
                  <button key={p} type="button" onClick={() => setFormData({...formData, platform: p as any})} className={`p-4 rounded-xl border-2 text-sm font-black uppercase transition-all ${formData.platform === p ? 'bg-pyronix-orange border-pyronix-orange text-white shadow-lg scale-105' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}>{p}</button>
                ))}
              </div>
              {formData.platform === 'Autre' && (
                <div className="space-y-3 animate-in slide-in-from-top duration-300">
                  <p className="text-xs font-black text-pyronix-orange uppercase tracking-widest">Précisez le réseau :</p>
                  <input type="text" value={formData.platform_other} onChange={e => setFormData({...formData, platform_other: e.target.value})} className={`w-full bg-white/5 border-b-2 p-4 outline-none rounded-lg text-white font-bold ${errors.platform_other ? 'border-red-500' : 'border-pyronix-orange'}`} placeholder="Ex: SoundCloud, Spotify..." />
                  {errors.platform_other && <p className="text-red-500 text-[10px] font-black uppercase">{errors.platform_other}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-16 animate-in slide-in-from-right duration-300">
            <div className="text-center">
              <label className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Titre du Hit</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full bg-transparent border-b-4 outline-none py-8 text-white font-black text-5xl md:text-8xl uppercase text-center tracking-tighter transition-all ${errors.title ? 'border-red-500' : 'border-white/10 focus:border-pyronix-magenta'}`} placeholder="TITRE" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-6">
                <div className="flex justify-between items-center"><label className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Styles (Max 4)</label><span className="text-xl font-black text-pyronix-orange">{formData.styles.length}/4</span></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar p-2 border border-white/5 rounded-2xl bg-black/20">
                  {MUSICAL_STYLES.map(s => <button key={s} type="button" onClick={() => toggleStyle(s)} className={`p-3 rounded-lg text-sm font-bold uppercase border-2 transition-all ${formData.styles.includes(s) ? 'bg-pyronix-cyan text-black border-pyronix-cyan shadow-lg' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}>{s}</button>)}
                </div>
                {formData.styles.includes('Autre') && (
                  <div className="space-y-3 animate-in slide-in-from-top duration-300">
                    <p className="text-xs font-black text-pyronix-cyan uppercase tracking-widest">Précisez le style :</p>
                    <input type="text" value={formData.styles_other} onChange={e => setFormData({...formData, styles_other: e.target.value})} className={`w-full bg-white/5 border-b-2 p-4 outline-none rounded-lg text-white font-bold ${errors.styles_other ? 'border-red-500' : 'border-pyronix-cyan'}`} placeholder="Ex: Metal Symphonique..." />
                    {errors.styles_other && <p className="text-red-500 text-[10px] font-black uppercase">{errors.styles_other}</p>}
                  </div>
                )}
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2"><Mic size={14}/> Texture Voix</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setFormData({...formData, voice: 'female_solo'})} className={`p-4 rounded-xl border-2 text-sm font-black uppercase transition-all ${formData.voice === 'female_solo' ? 'bg-pyronix-magenta text-white border-pyronix-magenta shadow-md' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}>Femme Solo</button>
                    <button type="button" onClick={() => setFormData({...formData, voice: 'male_solo'})} className={`p-4 rounded-xl border-2 text-sm font-black uppercase transition-all ${formData.voice === 'male_solo' ? 'bg-pyronix-cyan text-black border-pyronix-cyan shadow-md' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}>Homme Solo</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[{id:'duo_ff',l:'Duo F+F'},{id:'duo_hh',l:'Duo H+H'},{id:'duo_fh',l:'Duo H+F'}].map(v => (
                      <button key={v.id} type="button" onClick={() => setFormData({...formData, voice: v.id as any})} className={`p-3 rounded-xl border-2 text-xs font-black uppercase transition-all ${formData.voice === v.id ? 'bg-white text-black border-white shadow-md' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}>{v.l}</button>
                    ))}
                  </div>
                </div>
                
                {!((formData.voice as string).startsWith('duo')) ? (
                  <div className="space-y-4 p-6 bg-white/5 rounded-[2rem] border border-white/10">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Globe size={14}/> Langue Solo</label>
                      <span className="text-pyronix-orange font-black text-xs">{formData.languages.length}/1</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                      {LANGUAGES.map(l => <button key={l} type="button" onClick={() => setSoloLanguage(l)} className={`p-2 rounded-lg text-xs font-bold uppercase border transition-all ${formData.languages.includes(l) ? 'bg-pyronix-cyan text-black border-pyronix-cyan shadow-md' : 'border-white/5 text-gray-400 hover:border-white/10 hover:text-white'}`}>{l}</button>)}
                    </div>
                    {formData.languages.includes('Autre') && (
                      <div className="space-y-2 animate-in slide-in-from-top duration-300">
                        <input type="text" value={formData.languages_other} onChange={e => setFormData({...formData, languages_other: e.target.value})} className={`w-full bg-black/40 border-b p-3 outline-none rounded-lg text-white text-xs ${errors.languages_other ? 'border-red-500' : 'border-pyronix-cyan'}`} placeholder="Précisez la langue..." />
                      </div>
                    )}
                    {errors.languages && <p className="text-red-500 text-[10px] font-black uppercase">{errors.languages}</p>}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4 p-6 bg-white/5 rounded-[2rem] border border-white/10">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Globe size={14} className="text-pyronix-cyan" /> 
                          {formData.voice === 'duo_fh' ? 'LANGUE VOIX HOMME' : 'LANGUE VOIX 1'}
                        </label>
                      </div>
                      <div className="grid grid-cols-3 gap-2 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
                        {LANGUAGES.map(l => <button key={l} type="button" onClick={() => setDuoLanguage(1, l)} className={`p-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${formData.duo_config?.voice1.languages.includes(l) ? 'bg-pyronix-cyan text-black border-pyronix-cyan' : 'border-white/5 text-gray-400'}`}>{l}</button>)}
                      </div>
                      {formData.duo_config?.voice1.languages.includes('Autre') && (
                        <input type="text" value={formData.duo_config.voice1.other} onChange={e => setFormData({...formData, duo_config: {...formData.duo_config!, voice1: {...formData.duo_config!.voice1, other: e.target.value}}})} className="w-full bg-black/40 border-b p-2 outline-none rounded-lg text-white text-[10px]" placeholder="Précisez langue 1..." />
                      )}
                      {errors.languages_v1 && <p className="text-red-500 text-[10px] font-black uppercase">{errors.languages_v1}</p>}
                    </div>
                    <div className="space-y-4 p-6 bg-white/5 rounded-[2rem] border border-white/10">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Globe size={14} className="text-pyronix-magenta" /> 
                          {formData.voice === 'duo_fh' ? 'LANGUE VOIX FEMME' : 'LANGUE VOIX 2'}
                        </label>
                      </div>
                      <div className="grid grid-cols-3 gap-2 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
                        {LANGUAGES.map(l => <button key={l} type="button" onClick={() => setDuoLanguage(2, l)} className={`p-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${formData.duo_config?.voice2.languages.includes(l) ? 'bg-pyronix-magenta text-white border-pyronix-magenta' : 'border-white/5 text-gray-400'}`}>{l}</button>)}
                      </div>
                      {formData.duo_config?.voice2.languages.includes('Autre') && (
                        <input type="text" value={formData.duo_config.voice2.other} onChange={e => setFormData({...formData, duo_config: {...formData.duo_config!, voice2: {...formData.duo_config!.voice2, other: e.target.value}}})} className="w-full bg-black/40 border-b p-2 outline-none rounded-lg text-white text-[10px]" placeholder="Précisez langue 2..." />
                      )}
                      {errors.languages_v2 && <p className="text-red-500 text-[10px] font-black uppercase">{errors.languages_v2}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-12 animate-in slide-in-from-right duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Ambiance (Mood)</label>
                <div className="grid grid-cols-2 gap-3">
                  {MOODS.map(m => <button key={m} type="button" onClick={() => setFormData({...formData, mood: m})} className={`p-6 rounded-2xl border-2 text-sm font-black uppercase transition-all ${formData.mood === m ? 'bg-white text-black border-white shadow-xl scale-105' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}>{m}</button>)}
                </div>
                {formData.mood === 'Autre' && (
                  <div className="space-y-3 animate-in slide-in-from-top duration-300 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-xs font-black text-pyronix-orange uppercase tracking-widest">Précisez l'ambiance :</p>
                    <input type="text" value={formData.mood_other} onChange={e => setFormData({...formData, mood_other: e.target.value})} className={`w-full bg-black/40 border-b-2 p-4 outline-none rounded-lg text-white font-bold ${errors.mood_other ? 'border-red-500' : 'border-pyronix-orange'}`} placeholder="Ex: Mélancolique et Brutal..." />
                  </div>
                )}
              </div>
              <div className="space-y-12">
                <div className="space-y-6">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Tempo</label>
                  <div className="grid grid-cols-3 gap-3">
                    {TEMPOS.map(t => <button key={t.value} type="button" onClick={() => setFormData({...formData, tempo: t.value as any})} className={`p-6 rounded-2xl border-2 text-sm font-black uppercase transition-all ${formData.tempo === t.value ? 'bg-pyronix-cyan text-black border-pyronix-cyan shadow-xl scale-105' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}>{t.label}</button>)}
                  </div>
                </div>
                <div className="space-y-6 p-8 bg-black/40 rounded-[2.5rem] border-2 border-white/5">
                  <div className="flex justify-between items-center"><label className="text-sm font-black text-gray-400 uppercase tracking-widest">Énergie</label><span className="text-pyronix-orange font-black text-2xl"><Zap size={24} className="inline mr-2" /> {formData.energy}/5</span></div>
                  <input type="range" min="1" max="5" step="1" value={formData.energy} onChange={(e) => setFormData({...formData, energy: parseInt(e.target.value)})} className="w-full accent-pyronix-orange h-6 bg-black rounded-full appearance-none cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center"><label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><FileText size={14}/> Histoire (Min 200)</label><span className={`font-black ${formData.subject.length < 200 ? 'text-red-500' : 'text-green-500'}`}>{formData.subject.length}/200</span></div>
              <textarea value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="Raconte ton histoire ici..." className={`w-full bg-black/60 border-2 outline-none p-10 rounded-3xl min-h-[450px] text-white font-medium text-2xl md:text-3xl leading-relaxed ${errors.subject ? 'border-red-500' : 'border-white/10 focus:border-pyronix-orange'}`} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-12 animate-in fade-in duration-500">
             <div className="bg-white/5 p-12 rounded-[4rem] border-4 border-charcoal shadow-inner space-y-10">
                <h3 className="text-5xl md:text-7xl font-black text-pyronix-orange uppercase tracking-tighter italic border-b border-white/5 pb-8 text-left">Récapitulatif</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                   <div className="space-y-10">
                      <div>
                        <p className="text-gray-400 font-black uppercase text-sm tracking-widest mb-2">PROJET_ID</p>
                        <p className="text-5xl font-black uppercase text-white leading-tight break-words">{formData.title}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-black uppercase text-sm tracking-widest mb-2">ARTISTE & CONTACT</p>
                        <p className="text-3xl font-black text-pyronix-cyan leading-none">{formData.handle}</p>
                        <p className="text-lg text-gray-500 font-medium italic mt-2">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-black uppercase text-sm tracking-widest mb-2">PLATEFORME</p>
                        <p className="text-2xl font-black text-white">{formData.platform === 'Autre' ? formData.platform_other : formData.platform}</p>
                      </div>
                   </div>

                   <div className="bg-black/20 p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                      <div className="flex justify-between border-b border-white/5 pb-4 items-center">
                        <span className="text-gray-400 font-black uppercase text-sm">STYLES</span>
                        <span className="text-white text-xl font-bold text-right max-w-[60%]">{formData.styles.map(s => s === 'Autre' ? formData.styles_other : s).join(', ')}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-4 items-center">
                        <span className="text-gray-400 font-black uppercase text-sm">VOIX</span>
                        <span className="text-white text-xl font-bold uppercase">{voiceLabels[formData.voice as string] || formData.voice}</span>
                      </div>
                      <div className="flex flex-col border-b border-white/5 pb-4 gap-2">
                        <span className="text-gray-400 font-black uppercase text-sm">LANGUES</span>
                        {(formData.voice as string).startsWith('duo') ? (
                          <div className="space-y-1 text-sm">
                            <p className="flex justify-between font-bold"><span className="text-pyronix-cyan">{formData.voice === 'duo_fh' ? 'Homme' : 'Voix 1'} :</span> <span className="text-white">{formData.duo_config?.voice1.languages.includes('Autre') ? formData.duo_config.voice1.other : formData.duo_config?.voice1.languages[0]}</span></p>
                            <p className="flex justify-between font-bold"><span className="text-pyronix-magenta">{formData.voice === 'duo_fh' ? 'Femme' : 'Voix 2'} :</span> <span className="text-white">{formData.duo_config?.voice2.languages.includes('Autre') ? formData.duo_config.voice2.other : formData.duo_config?.voice2.languages[0]}</span></p>
                          </div>
                        ) : (
                          <span className="text-white text-xl font-bold text-right">{formData.languages.includes('Autre') ? formData.languages_other : formData.languages[0]}</span>
                        )}
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-4 items-center">
                        <span className="text-gray-400 font-black uppercase text-sm">MOOD</span>
                        <span className="text-white text-xl font-bold">{formData.mood === 'Autre' ? formData.mood_other : formData.mood}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-black uppercase text-sm">TEMPO / ENERGIE</span>
                        <span className="text-white text-xl font-bold flex items-center gap-2">
                          <span className="capitalize">{formData.tempo}</span>
                          <span className="text-pyronix-orange flex items-center"><Zap size={18} fill="currentColor" /> {formData.energy}/5</span>
                        </span>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                   <p className="text-gray-400 font-black uppercase text-sm tracking-widest mb-6 flex items-center gap-3">
                     <FileText size={20} className="text-pyronix-orange" /> HISTOIRE DU PROJET
                   </p>
                   <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 italic text-gray-300 text-xl leading-relaxed whitespace-pre-wrap font-medium">
                     "{formData.subject}"
                   </div>
                </div>
             </div>

             <label className="flex items-center gap-6 cursor-pointer group bg-white/5 p-8 rounded-[2rem] border-2 border-white/10 hover:border-pyronix-orange transition-all duration-500">
                <div className={`h-12 w-12 rounded-xl border-2 flex items-center justify-center transition-all ${formData.acceptTerms ? 'bg-pyronix-orange border-pyronix-orange text-white' : 'border-white/20 text-transparent'}`}><Check size={28} /></div>
                <input type="checkbox" checked={formData.acceptTerms} onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})} className="hidden" />
                <span className="text-xl md:text-2xl font-black text-gray-400 group-hover:text-white uppercase tracking-tighter transition-colors">Prêt à envoyer le projet à Pyronix Music</span>
             </label>
          </div>
        )}

        <div className="mt-16 flex flex-col md:flex-row justify-between gap-8">
          {step > 1 && <button type="button" onClick={handlePrev} className="px-12 py-6 text-gray-400 font-black uppercase text-xl hover:text-white transition-all flex items-center gap-4"><ChevronLeft size={36} /> Retour</button>}
          <button type="submit" disabled={loading || (step === 4 && !formData.acceptTerms)} className="flex-grow bg-white text-black py-8 rounded-[2rem] font-black text-3xl uppercase tracking-widest hover:bg-pyronix-orange hover:text-white transition-all disabled:opacity-50 shadow-2xl flex items-center justify-center gap-6">
            {loading ? <Loader2 className="animate-spin" size={40}/> : step === 4 ? <><Mail size={40}/> ENVOYER PAR EMAIL</> : <><ChevronRight size={40}/> CONTINUER</>}
          </button>
        </div>
      </form>
    </div>
  );
};

const ThankYou = () => {
  const location = useLocation();
  const email = location.state?.email || "ton email";
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 animate-in zoom-in-95 duration-500 text-white py-20 bg-transparent">
      <CheckCircle2 size={120} className="text-pyronix-orange mb-10 animate-pulse shadow-[0_0_80px_rgba(255,94,0,0.1)]" />
      <h1 className="text-6xl md:text-9xl font-black uppercase mb-10 leading-none tracking-tighter text-white">STUDIO <br/><span className="text-pyronix-cyan">PATCHÉ !</span></h1>
      <p className="text-gray-400 text-2xl max-w-3xl mx-auto mb-16 leading-relaxed italic font-medium">Ta demande a été transmise. Vérifie tes mails à <span className="text-white font-black">{email}</span>. <br/> Appuie sur "Envoyer" dans ton appli de messagerie !</p>
      <Link to="/" className="px-16 py-8 bg-pyronix-orange text-white rounded-[2rem] font-black uppercase text-2xl tracking-widest hover:scale-110 transition-all shadow-2xl">Accueil</Link>
    </div>
  );
};

const Admin = () => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => { if (sessionStorage.getItem('py_admin') === 'true') setAuth(true); }, []);
  useEffect(() => { if (auth) setOrders(JSON.parse(localStorage.getItem('pyronix_orders') || '[]')); }, [auth]);
  
  const login = (e: any) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) { setAuth(true); sessionStorage.setItem('py_admin', 'true'); }
    else alert("Code studio erroné");
  };

  const updateStatus = (id: string, newStatus: string) => {
    const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem('pyronix_orders', JSON.stringify(updated));
    if (selected?.id === id) setSelected({ ...selected, status: newStatus });
  };

  const statusMap = [
    { id: 'all', label: 'Tous', color: 'bg-white/5' },
    { id: 'new', label: 'Nouveaux', color: 'bg-pyronix-orange' },
    { id: 'in_progress', label: 'En cour', color: 'bg-blue-600' },
    { id: 'done', label: 'Terminer', color: 'bg-green-600' },
    { id: 'delivered', label: 'Livré', color: 'bg-pyronix-magenta' }
  ];

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === activeFilter);

  if (!auth) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center text-white bg-transparent">
      <form onSubmit={login} className="glass-morphism p-12 rounded-[4rem] w-full max-w-md border-4 border-charcoal shadow-2xl">
        <h2 className="text-3xl font-black uppercase mb-12 tracking-widest flex items-center justify-center gap-3 text-white"><Lock size={24} className="text-pyronix-orange" /> ACCÈS STUDIO</h2>
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-black/40 border-2 border-white/10 p-8 rounded-[2rem] outline-none text-center font-black text-3xl tracking-[0.5em] mb-12 focus:border-pyronix-orange text-white" placeholder="CODE" autoFocus />
        <button type="submit" className="w-full bg-pyronix-orange py-8 rounded-[2rem] font-black uppercase text-2xl transition-all text-white">ENTRER</button>
      </form>
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in duration-500 pb-40 text-white text-left bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white leading-none">Journal <span className="text-pyronix-orange">Studio</span></h1>
          <p className="text-gray-500 font-black uppercase text-xs tracking-widest mt-2">Gestion du pipeline de production</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusMap.map(st => (
            <button 
              key={st.id} 
              onClick={() => setActiveFilter(st.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${activeFilter === st.id ? `${st.color} border-white text-white shadow-lg scale-105` : 'bg-black/20 border-white/5 text-gray-500'}`}
            >
              {st.label} ({st.id === 'all' ? orders.length : orders.filter(o => o.status === st.id).length})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-charcoal border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden overflow-x-auto no-scrollbar">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-xs font-black uppercase tracking-widest">
            <tr>
              <th className="p-8">Date</th>
              <th className="p-8">Client</th>
              <th className="p-8">Titre</th>
              <th className="p-8">Statut (Changer)</th>
              <th className="p-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.length > 0 ? filteredOrders.map(o => (
              <tr key={o.id} className="hover:bg-white/5 transition-all">
                <td className="p-8 text-gray-600 text-[10px]">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="p-8 font-black text-pyronix-cyan">{o.handle}</td>
                <td className="p-8 font-black uppercase text-white tracking-widest text-sm">{o.title}</td>
                <td className="p-8">
                  <div className="flex flex-wrap gap-1">
                    {statusMap.filter(s => s.id !== 'all').map(st => (
                      <button 
                        key={st.id} 
                        onClick={() => updateStatus(o.id, st.id)}
                        className={`px-2 py-1 rounded-md text-[8px] font-black uppercase transition-all ${o.status === st.id ? `${st.color} text-white scale-110 shadow-md` : 'bg-black/40 text-gray-600 hover:text-white'}`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="p-8 flex items-center gap-3">
                  <button onClick={() => setSelected(o)} className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-pyronix-cyan transition-colors" title="Fiche Client"><Eye size={20}/></button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="p-20 text-center font-black uppercase tracking-[0.5em] text-gray-700">Aucune commande trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black overflow-y-auto">
           <div className="max-w-6xl w-full my-12 animate-in zoom-in-95 duration-300 relative">
              <div className="bg-white/5 p-12 rounded-[4rem] border-4 border-charcoal shadow-2xl space-y-10 text-left">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-8 gap-6">
                  <h3 className="text-5xl md:text-7xl font-black text-pyronix-orange uppercase tracking-tighter italic">Récapitulatif</h3>
                  <div className="flex flex-wrap gap-2">
                    {statusMap.filter(s => s.id !== 'all').map(st => (
                      <button 
                        key={st.id} 
                        onClick={() => updateStatus(selected.id, st.id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selected.status === st.id ? `${st.color} text-white ring-4 ring-white/10 shadow-lg scale-105` : 'bg-black/40 text-gray-600 hover:text-white'}`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                   <div className="space-y-10">
                      <div>
                        <p className="text-gray-400 font-black uppercase text-sm tracking-widest mb-2">PROJET_ID</p>
                        <p className="text-5xl font-black uppercase text-white leading-tight break-words">{selected.title}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-black uppercase text-sm tracking-widest mb-2">ARTISTE & CONTACT</p>
                        <p className="text-3xl font-black text-pyronix-cyan leading-none">{selected.handle}</p>
                        <p className="text-lg text-gray-500 font-medium italic mt-2">{selected.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-black uppercase text-sm tracking-widest mb-2">PLATEFORME</p>
                        <p className="text-2xl font-black text-white">{selected.platform === 'Autre' ? selected.platform_other : selected.platform}</p>
                      </div>
                   </div>

                   <div className="bg-black/20 p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                      <div className="flex justify-between border-b border-white/5 pb-4 items-center">
                        <span className="text-gray-400 font-black uppercase text-sm">STYLES</span>
                        <span className="text-white text-xl font-bold text-right max-w-[60%]">{selected.styles.map((s: string) => s === 'Autre' ? selected.styles_other : s).join(', ')}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-4 items-center">
                        <span className="text-gray-400 font-black uppercase text-sm">VOIX</span>
                        <span className="text-white text-xl font-bold uppercase">{voiceLabels[selected.voice as string] || selected.voice}</span>
                      </div>
                      <div className="flex flex-col border-b border-white/5 pb-4 gap-2">
                        <span className="text-gray-400 font-black uppercase text-sm">LANGUES</span>
                        {(selected.voice as string).startsWith('duo') ? (
                          <div className="space-y-1 text-sm">
                            <p className="flex justify-between font-bold"><span className="text-pyronix-cyan">{selected.voice === 'duo_fh' ? 'Homme' : 'Voix 1'} :</span> <span className="text-white">{selected.duo_config?.voice1.languages.includes('Autre') ? selected.duo_config.voice1.other : selected.duo_config?.voice1.languages[0]}</span></p>
                            <p className="flex justify-between font-bold"><span className="text-pyronix-magenta">{selected.voice === 'duo_fh' ? 'Femme' : 'Voix 2'} :</span> <span className="text-white">{selected.duo_config?.voice2.languages.includes('Autre') ? selected.duo_config.voice2.other : selected.duo_config?.voice2.languages[0]}</span></p>
                          </div>
                        ) : (
                          <span className="text-white text-xl font-bold text-right">{selected.languages.includes('Autre') ? selected.languages_other : selected.languages[0]}</span>
                        )}
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-4 items-center">
                        <span className="text-gray-400 font-black uppercase text-sm">MOOD</span>
                        <span className="text-white text-xl font-bold">{selected.mood === 'Autre' ? selected.mood_other : selected.mood}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-black uppercase text-sm">TEMPO / ENERGIE</span>
                        <span className="text-white text-xl font-bold flex items-center gap-2">
                          <span className="capitalize">{selected.tempo}</span>
                          <span className="text-pyronix-orange flex items-center"><Zap size={18} fill="currentColor" /> {selected.energy}/5</span>
                        </span>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                   <p className="text-gray-400 font-black uppercase text-sm tracking-widest mb-6 flex items-center gap-3">
                     <FileText size={20} className="text-pyronix-orange" /> HISTOIRE DU PROJET
                   </p>
                   <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 italic text-gray-300 text-xl leading-relaxed whitespace-pre-wrap font-medium">
                     "{selected.subject}"
                   </div>
                </div>

                <button 
                  onClick={() => setSelected(null)} 
                  className="w-full bg-white text-black py-8 rounded-[2rem] font-black text-3xl uppercase tracking-widest hover:bg-pyronix-cyan transition-all shadow-2xl flex items-center justify-center gap-6 mt-12"
                >
                  <ArrowLeft size={40} /> RETOUR À LA LISTE
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <HashRouter>
    <div className="min-h-screen flex flex-col selection:bg-pyronix-orange selection:text-white relative bg-transparent">
      <BackgroundDecorations />
      <Header />
      <main className="flex-grow relative z-10 bg-transparent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/commander" element={<OrderForm />} />
          <Route path="/merci" element={<ThankYou />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <footer className="bg-black/60 border-t border-white/5 py-20 px-6 mt-20 text-center relative z-10 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <h3 className="font-black text-xl tracking-[0.4em] uppercase">PYRONIX <span className="text-pyronix-orange">MUSIC</span></h3>
            <p className="text-gray-600 italic text-sm">Studio de Production Professionnel.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
            <Link to="/" className="hover:text-pyronix-orange transition-colors">Accueil</Link>
            <Link to="/commander" className="hover:text-pyronix-orange transition-colors">Commander</Link>
            <Link to="/admin" className="hover:text-pyronix-orange transition-colors">Admin</Link>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-pyronix-orange italic underline underline-offset-4 decoration-2">{ADMIN_EMAIL}</p>
          </div>
        </div>
      </footer>
    </div>
  </HashRouter>
);

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
