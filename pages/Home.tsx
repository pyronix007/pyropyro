
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Radio, Activity, Send, Sparkles, Youtube, Play, ExternalLink, Info } from 'lucide-react';
import { DEMO_TRACKS } from '../constants';

const FeatureCard = ({ icon: Icon, title, desc, gradient }: { icon: any, title: string, desc: string, gradient: string }) => (
  <div className="glass-morphism p-10 md:p-8 rounded-[2.5rem] hover:scale-[1.05] transition-all duration-500 group relative overflow-hidden border-white/5 text-left">
    <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 blur transition duration-500`}></div>
    <div className={`h-24 w-24 md:h-16 md:w-16 rounded-2xl flex items-center justify-center mb-10 md:mb-6 bg-white/5 border border-white/10 group-hover:border-white/20 transition-all`}>
      <Icon size={40} className="group-hover:scale-110 transition-transform" />
    </div>
    <h3 className="text-3xl md:text-2xl font-black mb-6 md:mb-3 tracking-tight uppercase text-white">{title}</h3>
    <p className="text-gray-400 text-lg md:text-base leading-relaxed font-medium">{desc}</p>
  </div>
);

const VideoDemo: React.FC<{ track: any }> = ({ track }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbUrl = `https://img.youtube.com/vi/${track.youtubeId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${track.youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className={`relative glass-morphism p-6 rounded-[2.5rem] md:rounded-[2rem] border-2 transition-all duration-500 hover:shadow-2xl overflow-hidden group border-white/10 ${track.glow} hover:scale-[1.03]`}>
      <div className="flex flex-col gap-6 relative z-10 text-white">
        <div className="flex justify-between items-start">
           <div className="space-y-1 text-left">
             <h4 className="font-black text-2xl md:text-xl uppercase tracking-tighter leading-tight text-white">{track.title}</h4>
             <p className={`text-xs font-bold tracking-[0.2em] uppercase opacity-80 ${track.accent}`}>{track.style}</p>
           </div>
           <a href={`https://www.youtube.com/watch?v=${track.youtubeId}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-red-600 transition-colors">
             <Youtube size={20} className="text-white" />
           </a>
        </div>
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border border-white/5 cursor-pointer" onClick={() => setIsPlaying(true)}>
           {!isPlaying ? (
             <>
               <img src={thumbUrl} alt={track.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${track.youtubeId}/hqdefault.jpg` }} />
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="h-20 w-20 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20 text-white shadow-2xl group-hover:scale-110 transition-transform">
                     <Play size={32} fill="white" className="ml-1" />
                  </div>
                  <span className="mt-4 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Lire l'extrait</span>
               </div>
             </>
           ) : (
             <iframe src={embedUrl} title={track.title} className="absolute inset-0 w-full h-full z-10" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
           )}
        </div>
        <div className="flex items-center justify-between pt-2">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 tracking-widest">
              <Activity size={12} className="text-pyronix-cyan" /> PROD. BY PYRONIX
           </div>
           <a href={`https://www.youtube.com/watch?v=${track.youtubeId}`} target="_blank" className="text-[9px] font-black uppercase tracking-tighter px-3 py-1 rounded bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">LIEN DIRECT</a>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-1000 relative pb-20 text-white">
      {/* Wave background decorative effect */}
      <div className="absolute top-[20%] left-0 w-full h-[600px] pointer-events-none opacity-10 overflow-hidden z-0 flex items-center justify-center">
        <svg viewBox="0 0 1440 320" className="w-full h-full animate-wave">
          <path fill="#ff5e00" fillOpacity="0.5" d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,181.3C672,149,768,107,864,117.3C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <section className="relative pt-32 pb-40 px-4 text-center">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-4 px-10 py-4 rounded-full glass-morphism border-white/10 text-lg md:text-xl font-black tracking-[0.5em] text-pyronix-cyan mb-16 md:mb-12 uppercase animate-pulse">
            <Radio size={24} /> Studio de Production Masterclass
          </div>
          
          {/* Nouveau titre Kinetic avec couleurs */}
          <h1 className="text-7xl md:text-[11rem] font-outfit font-black mb-16 md:mb-10 leading-[0.85] tracking-tighter uppercase flex flex-col items-center">
            <span className="text-outline-cyan opacity-80 scale-90 md:scale-75 origin-bottom">FEEL THE</span>
            <span className="gradient-magma animate-jitter relative z-10 drop-shadow-[0_0_20px_rgba(255,94,0,0.5)]">POWER</span>
            <span className="text-pyronix-magenta animate-glow-pulse tracking-[0.15em] md:tracking-[0.25em] scale-95 md:scale-90">OF SOUND</span>
          </h1>

          <p className="text-gray-400 text-3xl md:text-3xl mb-24 md:mb-16 max-w-4xl mx-auto font-bold italic leading-tight px-8 md:px-4">
            "Élevez votre identité artistique. Pyronix transforme vos visions en productions légendaires."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 md:gap-8 px-8 md:px-4">
            <Link to="/commander" className="w-full sm:w-auto bg-gradient-to-r from-pyronix-orange to-red-600 text-white px-20 py-12 md:py-8 rounded-[3rem] md:rounded-[2rem] font-black text-4xl md:text-2xl tracking-tight transition-all transform hover:scale-110 hover:-rotate-1 flex items-center justify-center gap-8 md:gap-4 shadow-[0_0_50px_rgba(255,94,0,0.3)]">
              PASSER EN STUDIO <ChevronRight size={40} className="md:size-6" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-8xl font-outfit font-black tracking-tighter uppercase mb-10 md:mb-6">Studio <span className="text-pyronix-magenta">Vibes</span></h2>
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 bg-white/5 px-4 py-1 rounded-full border border-white/10 max-w-fit mx-auto">
               <Info size={14} className="text-pyronix-cyan" />
               <p className="text-[10px] font-black uppercase tracking-widest">En cas d'erreur de lecture, utilisez les liens directs YouTube.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10">
            {DEMO_TRACKS.map(track => (
              <VideoDemo key={track.id} track={track} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 px-4 bg-white/[0.02] backdrop-blur-3xl border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-12 text-left">
          <FeatureCard 
            icon={Sparkles} 
            title="Mixage HD" 
            desc="Un son cristallin qui perce n'importe quelle enceinte avec une dynamique professionnelle certifiée." 
            gradient="from-pyronix-orange to-yellow-500"
          />
          <FeatureCard 
            icon={Zap} 
            title="Vibe Unique" 
            desc="On crée ton identité sonore propre, pas une simple copie des tendances éphémères actuelles." 
            gradient="from-pyronix-cyan to-blue-500"
          />
          <FeatureCard 
            icon={Send} 
            title="Livraison Pro" 
            desc="Reçois tes fichiers stem et masterisés en ultra haute qualité WAV et/ou MP3 HD." 
            gradient="from-pyronix-magenta to-pink-500"
          />
        </div>
      </section>

      <section className="py-40 px-8 md:px-4 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto glass-morphism p-20 md:p-24 rounded-[4.5rem] border-white/10 relative group overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-6xl md:text-9xl font-outfit font-black mb-20 md:mb-16 leading-none tracking-tighter uppercase text-white">Ton Hit <br /> T'attend.</h2>
            <Link to="/commander" className="inline-flex items-center gap-8 bg-white text-black px-20 py-12 md:py-10 rounded-[3rem] md:rounded-[2rem] font-black text-4xl md:text-4xl tracking-tighter hover:bg-pyronix-cyan hover:text-black transition-all shadow-2xl hover:scale-105 active:scale-95 w-full md:w-auto justify-center">
              LANCER LE BRIEFING <Send size={40} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
