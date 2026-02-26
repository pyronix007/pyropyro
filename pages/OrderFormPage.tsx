
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Send, CheckCircle2, User, Music, FileText, Check, Sliders, Mic, Zap, Globe, Loader2, MessageSquare, AlertCircle, Languages, Mail } from 'lucide-react';
import { OrderFormData, PlatformType, VocalLanguageStyle } from '../types';
import { PLATFORMS, MUSICAL_STYLES, LANGUAGES, TEMPOS, MOODS, ADMIN_EMAIL } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { supabase } from '../supabase';

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { id: 1, label: 'ARTISTE', icon: User },
    { id: 2, label: 'SON', icon: Music },
    { id: 3, label: 'VIBE', icon: Sliders },
    { id: 4, label: 'VALIDE', icon: CheckCircle2 },
  ];

  return (
    <div className="flex items-center justify-between max-w-4xl mx-auto mb-20 px-6">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-6 relative z-10">
            <div className={`h-20 w-20 md:h-24 md:w-24 rounded-[2rem] flex items-center justify-center transition-all duration-700 border-2 ${
              currentStep >= step.id 
                ? 'bg-gradient-to-br from-pyronix-orange to-red-600 border-white/20 text-white shadow-[0_0_30px_rgba(255,94,0,0.4)] scale-110' 
                : 'bg-white/5 border-white/10 text-gray-700'
            }`}>
              {currentStep > step.id ? <Check size={40} /> : <step.icon size={36} className="md:size-[40px]" />}
            </div>
            <span className={`text-sm md:text-xl font-black uppercase tracking-[0.3em] text-center ${currentStep >= step.id ? 'text-white' : 'text-gray-700'}`}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex-grow h-[3px] mx-4 md:mx-6 -mt-12 relative overflow-hidden rounded-full">
               <div className="absolute inset-0 bg-white/5"></div>
               <div 
                 className="absolute inset-0 bg-gradient-to-r from-pyronix-orange to-pyronix-magenta transition-all duration-1000"
                 style={{ width: currentStep > step.id ? '100%' : '0%' }}
               ></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const OrderFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    email: '', platform: 'TikTok', platform_other: '', handle: '', title: '',
    styles: [], styles_other: '', voice: 'female',
    vocalLanguageStyle: 'native',
    duo_config: { 
      voice1: { gender: 'female', languages: [], other: '' }, 
      voice2: { gender: 'male', languages: [], other: '' } 
    },
    subject: '', languages: [], languages_other: '', mood: 'Énergique', mood_other: '', energy: 3, tempo: 'moyen', acceptTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email valide requis";
      if (!formData.handle) newErrors.handle = "Pseudo requis";
    } else if (currentStep === 2) {
      if (!formData.title) newErrors.title = "Titre obligatoire";
      if (formData.styles.length === 0) newErrors.styles = "Choisissez au moins 1 style";
      if (formData.languages.length === 0) newErrors.languages = "Choisissez au moins 1 langue";
    } else if (currentStep === 3) {
      if (formData.subject.trim().length < 200) newErrors.subject = "L'histoire est trop courte (min 200 car.)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep(step)) { setStep(prev => prev + 1); window.scrollTo(0, 0); } };
  const handlePrev = () => { setStep(prev => prev - 1); window.scrollTo(0, 0); };

  const handleLanguageToggle = (lang: string) => {
    const maxAllowed = formData.voice === 'duo' ? 2 : 1;
    let newLangs = [...formData.languages];
    if (newLangs.includes(lang)) {
      newLangs = newLangs.filter(l => l !== lang);
    } else {
      if (newLangs.length < maxAllowed) newLangs.push(lang);
      else if (maxAllowed === 1) newLangs = [lang];
    }
    setFormData({ ...formData, languages: newLangs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) return handleNext();
    if (!formData.acceptTerms) return;
    setIsSubmitting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Génère un résumé de briefing pour le projet "${formData.title}" de l'artiste ${formData.handle}. Styles: ${formData.styles.join(', ')}. Interprétation: ${formData.vocalLanguageStyle === 'native' ? 'Langue native' : 'Français avec accent'}. Mood: ${formData.mood}.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      const summary = response.text || "Prêt pour la prod.";
      
      // SAUVEGARDE SUR SUPABASE
      const { acceptTerms, ...orderData } = formData;
      const { error } = await supabase.from('orders').insert([{
        ...orderData,
        status: 'new',
        ai_summary: summary
      }]);

      if (error) throw error;

      // ENVOI EMAIL
      const vocalStyleStr = formData.vocalLanguageStyle === 'native' ? "Langue native" : "Français avec accent";
      const mailSubject = encodeURIComponent(`[STUDIO] COMMANDE : ${formData.title} (${formData.handle})`);
      const mailBody = encodeURIComponent(`NOUVELLE COMMANDE DISPONIBLE DANS LE DASHBOARD STUDIO\n\nArtiste: ${formData.handle}\nContact: ${formData.email}\nRésumé IA: ${summary}`);

      window.location.href = `mailto:${ADMIN_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

      navigate('/merci', { state: { email: formData.email } });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi au studio. Vérifiez votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 md:py-24 px-4 max-w-7xl mx-auto">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 relative">
          <h1 className="text-6xl md:text-9xl font-outfit font-black mb-8 tracking-tighter uppercase leading-none">STUDIO <span className="text-pyronix-cyan">PATCH</span></h1>
          <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
            <Mail size={18} className="text-pyronix-orange" />
            <p className="text-gray-400 font-black tracking-[0.2em] text-xs md:text-sm uppercase italic">Transmission Cloud Sécurisée</p>
          </div>
        </div>

        <StepIndicator currentStep={step} />

        <div className="relative">
          <form onSubmit={handleSubmit} className="glass-morphism rounded-[2.5rem] border-4 border-charcoal p-6 md:p-16 shadow-2xl relative overflow-hidden">
            {step === 1 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-[#fbff00] text-black px-6 py-2 inline-block text-xs font-black uppercase shadow-md">EMAIL_PROJET</div>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="votre@email.com" className={`w-full bg-black/40 border-b-2 p-6 text-xl outline-none focus:border-pyronix-orange transition-all text-white rounded-t-xl ${errors.email ? 'border-red-500' : 'border-white/10'}`} />
                  </div>
                  <div className="space-y-6">
                    <div className="bg-[#fbff00] text-black px-6 py-2 inline-block text-xs font-black uppercase shadow-md">ARTIST_HANDLE</div>
                    <input type="text" value={formData.handle} onChange={(e) => setFormData({...formData, handle: e.target.value})} placeholder="@votrepseudo" className={`w-full bg-black/40 border-b-2 p-6 text-xl outline-none focus:border-pyronix-cyan transition-all text-white rounded-t-xl ${errors.handle ? 'border-red-500' : 'border-white/10'}`} />
                  </div>
                </div>
                <div className="space-y-8">
                  <label className="text-lg md:text-xl font-black text-gray-300 uppercase tracking-widest">Diffusion / Réseau</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {PLATFORMS.map(p => (
                      <button key={p} type="button" onClick={() => setFormData({...formData, platform: p as PlatformType})} className={`py-4 rounded-xl text-xs font-black tracking-widest uppercase border-2 transition-all ${formData.platform === p ? 'bg-pyronix-orange text-white border-pyronix-orange shadow-lg' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="space-y-6 text-center">
                  <div className="bg-[#fbff00] text-black px-8 py-3 inline-block text-sm font-black uppercase shadow-lg mb-4">TRACK_NAME</div>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="NOM DU HIT" className={`w-full bg-transparent border-b-4 outline-none py-6 text-white font-black text-4xl md:text-8xl uppercase text-center tracking-tighter transition-all ${errors.title ? 'border-red-500' : 'border-white/10 focus:border-pyronix-magenta'}`} />
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <label className="text-lg md:text-xl font-black text-gray-300 uppercase tracking-widest">Styles (Max 4)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar p-2 border-2 border-white/5 rounded-2xl">
                      {MUSICAL_STYLES.map(s => (
                        <button key={s} type="button" onClick={() => setFormData({...formData, styles: formData.styles.includes(s) ? formData.styles.filter(i => i !== s) : [...formData.styles, s].slice(0, 4)})} className={`px-2 py-3 rounded-xl text-[9px] font-black tracking-widest border-2 transition-all flex items-center justify-center text-center leading-tight ${formData.styles.includes(s) ? 'bg-pyronix-cyan text-black border-pyronix-cyan shadow-lg' : 'bg-black/40 text-gray-500 border-white/10 hover:border-white/20'}`}>{s.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="space-y-6">
                      <label className="text-lg md:text-xl font-black text-gray-300 uppercase tracking-widest">Voix</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setFormData({...formData, voice: 'female'})} className={`py-8 rounded-2xl text-base font-black uppercase border-2 transition-all ${formData.voice === 'female' ? 'bg-pyronix-magenta text-white border-pyronix-magenta shadow-xl' : 'bg-black/40 border-white/10 text-gray-500'}`}>Femme Solo</button>
                        <button type="button" onClick={() => setFormData({...formData, voice: 'male'})} className={`py-8 rounded-2xl text-base font-black uppercase border-2 transition-all ${formData.voice === 'male' ? 'bg-pyronix-cyan text-black border-pyronix-cyan shadow-xl' : 'bg-black/40 border-white/10 text-gray-500'}`}>Homme Solo</button>
                      </div>
                    </div>

                    <div className="space-y-6 bg-white/5 p-6 rounded-[2rem] border border-white/10">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h4 className="text-gray-300 font-black tracking-widest uppercase flex items-center gap-2 text-sm">
                          <Globe size={20} className="text-pyronix-cyan" /> Langue
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                        {LANGUAGES.map(l => (
                          <button key={l} type="button" onClick={() => handleLanguageToggle(l)} className={`py-3 rounded-xl text-[9px] font-black uppercase border-2 transition-all ${formData.languages.includes(l) ? 'bg-pyronix-cyan text-black border-pyronix-cyan' : 'border-white/5 text-gray-600'}`}>{l}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-[#fbff00] text-black px-6 py-2">
                    <div className="text-xs font-black uppercase flex items-center gap-3"><FileText size={16}/> HISTOIRE (MIN 200)</div>
                    <div className={`text-xl font-black ${formData.subject.length < 200 ? 'text-red-700' : 'text-green-700'}`}>{formData.subject.length}/200</div>
                  </div>
                  <textarea value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="Raconte ton histoire ici..." className={`w-full bg-black/60 border-2 outline-none p-6 md:p-10 rounded-3xl min-h-[350px] text-white font-medium text-xl md:text-2xl leading-relaxed ${errors.subject ? 'border-red-500' : 'border-white/10 focus:border-pyronix-orange'}`} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="bg-black/60 p-8 md:p-12 rounded-[3rem] border-4 border-white/10 shadow-2xl relative">
                   <h3 className="text-4xl md:text-6xl font-outfit font-black uppercase mb-10 border-b-4 border-white/10 pb-6 text-center text-gradient-pyronix">VALIDATION</h3>
                   <label className="flex items-center gap-6 cursor-pointer group bg-white/5 p-8 rounded-[2rem] border-2 border-white/10 hover:border-pyronix-orange transition-all duration-500">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border-2 transition-all ${formData.acceptTerms ? 'bg-pyronix-orange border-pyronix-orange text-white' : 'border-white/20 text-transparent'}`}><Check size={32} /></div>
                      <input type="checkbox" checked={formData.acceptTerms} onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})} className="hidden" />
                      <span className="text-xl font-black text-gray-400 group-hover:text-white uppercase tracking-tighter transition-colors">CONFIRMER ET ENVOYER AU CLOUD</span>
                   </label>
                </div>
              </div>
            )}

            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
              {step > 1 ? (
                <button type="button" onClick={handlePrev} className="w-full md:w-auto px-10 py-6 rounded-2xl text-gray-500 hover:text-white font-black text-xl tracking-widest transition-all uppercase flex items-center justify-center gap-4 group"><ChevronLeft size={28} /> PRÉCÉDENT</button>
              ) : <div className="hidden md:block" />}
              <button type="button" onClick={step === 4 ? handleSubmit : handleNext} disabled={isSubmitting || (step === 4 && !formData.acceptTerms)} className="w-full md:w-auto bg-white text-black hover:bg-pyronix-cyan px-16 py-8 rounded-2xl font-black text-2xl tracking-widest uppercase transition-all shadow-xl flex items-center justify-center gap-4 group">
                {isSubmitting ? <Loader2 className="animate-spin" size={32} /> : step === 4 ? "VALIDER" : "CONTINUER"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderFormPage;
