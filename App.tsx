
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import OrderFormPage from './pages/OrderFormPage';
import ThankYou from './pages/ThankYou';
import Admin from './pages/Admin';
import { Menu, X, ChevronRight, Zap, Radio } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-4 py-4 md:py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center group relative">
            <div className="absolute inset-0 bg-pyronix-orange blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-500"></div>
            <img 
              src="/pyronix-logo.png" 
              alt="Pyronix Music Logo" 
              className="h-14 md:h-20 w-auto relative z-10 transition-transform duration-500 group-hover:scale-105 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = '<div class="h-12 w-12 bg-pyronix-orange rounded-xl flex items-center justify-center font-black text-2xl">P</div>';
              }}
            />
          </Link>
          
          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full border border-white/10">
            <div className="h-3 w-3 rounded-full bg-red-600 animate-pulse-fast shadow-[0_0_15px_rgba(220,38,38,1)]"></div>
            <span className="text-lg font-black tracking-[0.2em] text-white uppercase">STUDIO SESSION LIVE</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12">
          <Link to="/" className={`text-xl font-black tracking-[0.3em] hover:text-pyronix-orange transition-colors ${location.pathname === '/' ? 'text-pyronix-orange' : 'text-gray-400'}`}>ACCUEIL</Link>
          <Link to="/commander" className="bg-gradient-to-r from-pyronix-orange to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-5 rounded-full text-xl font-black tracking-[0.2em] transition-all transform hover:scale-105 shadow-[0_0_25px_rgba(255,94,0,0.4)] flex items-center gap-3">
            COMMANDER <ChevronRight size={22} />
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-3 hover:bg-white/5 rounded-2xl transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={44} /> : <Menu size={44} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[89px] md:top-[113px] bg-black/98 z-50 p-10 flex flex-col gap-10 animate-in slide-in-from-top duration-300 backdrop-blur-3xl border-t border-white/5">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-6xl font-black tracking-tighter border-b-2 border-white/10 pb-8 hover:text-pyronix-orange transition-colors uppercase italic">ACCUEIL</Link>
          <Link to="/commander" onClick={() => setIsOpen(false)} className="bg-gradient-to-r from-pyronix-orange to-pyronix-magenta text-white py-16 rounded-[3rem] text-center font-black text-4xl tracking-tighter shadow-2xl">COMMANDER UN HIT</Link>
          <div className="mt-auto pb-16 text-center text-white text-xl font-black tracking-[0.3em] uppercase flex items-center justify-center gap-6">
            <Radio className="text-red-600 animate-pulse" size={32} /> 
            PRODUIT PAR PYRONIX MUSIC
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-black border-t border-white/5 py-32 px-4 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-pyronix-orange/50 to-transparent"></div>
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-24 relative z-10 text-center md:text-left">
      <div className="space-y-10 flex flex-col items-center md:items-start">
        <Link to="/" className="inline-block group">
          <img src="/pyronix-logo.png" alt="Pyronix" className="h-24 w-auto transition-all group-hover:brightness-125" />
        </Link>
        <p className="text-gray-300 text-2xl leading-relaxed max-w-sm font-medium italic">
          "L'excellence musicale au service de vos émotions. Chaque morceau est une pièce unique."
        </p>
      </div>
      <div>
        <h4 className="font-black text-xl tracking-[0.4em] text-white mb-12 uppercase border-b-2 border-white/10 pb-6">NAVIGATION</h4>
        <ul className="space-y-8 text-gray-400 text-xl font-black tracking-widest">
          <li><Link to="/" className="hover:text-pyronix-orange transition-colors">ACCUEIL</Link></li>
          <li><Link to="/commander" className="hover:text-pyronix-orange transition-colors">COMMANDER UNE CHANSON</Link></li>
          <li><Link to="/admin" className="hover:text-pyronix-orange transition-colors">PORTAIL ADMINISTRATEUR</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-black text-xl tracking-[0.4em] text-white mb-12 uppercase border-b-2 border-white/10 pb-6">CONTACT & SOCIAL</h4>
        <ul className="space-y-8 text-gray-400 text-xl font-black tracking-widest">
          <li><a href="mailto:pyronixlastar@gmail.com" className="text-pyronix-orange font-black hover:text-white transition-colors underline decoration-2 underline-offset-8">pyronixlastar@gmail.com</a></li>
          <li><a href="https://www.youtube.com/@TheSoundofPyronix" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YOUTUBE OFFICIAL</a></li>
          <li><a href="https://www.tiktok.com/@capitaine_pyronix" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TIKTOK PRODUCTION</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-16 text-white text-base md:text-xl font-black tracking-[0.4em] uppercase text-center">
      <div className="md:text-left opacity-60">&copy; {new Date().getFullYear()} PYRONIX MUSIC. TOUS DROITS RÉSERVÉS.</div>
      <div className="flex gap-20">
        <a href="https://www.youtube.com/@TheSoundofPyronix" target="_blank" rel="noopener noreferrer" className="hover:text-pyronix-orange transition-colors text-2xl">YOUTUBE</a>
        <a href="https://www.tiktok.com/@capitaine_pyronix" target="_blank" rel="noopener noreferrer" className="hover:text-pyronix-magenta transition-colors text-2xl">TIKTOK</a>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col selection:bg-pyronix-orange selection:text-white">
        <Header />
        <main className="flex-grow relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/commander" element={<OrderFormPage />} />
            <Route path="/merci" element={<ThankYou />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
