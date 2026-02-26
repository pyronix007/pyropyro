
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Home, PlusCircle, ArrowRight, Mail } from 'lucide-react';
import { ADMIN_EMAIL } from '../constants';

const ThankYou: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email || "votre email";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center animate-in zoom-in-95 duration-500 py-20">
      <div className="bg-pyronix-orange/10 p-10 rounded-full mb-12 shadow-[0_0_50px_rgba(255,94,0,0.1)]">
        <CheckCircle2 size={100} className="text-pyronix-orange animate-pulse" />
      </div>
      <h1 className="text-5xl md:text-8xl font-outfit font-black mb-8 uppercase tracking-tighter leading-none">C'EST EN <span className="text-pyronix-cyan">BOÎTE !</span></h1>
      <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed font-medium italic">
        Ta demande a bien été transmise à Pyronix Music. Un briefing a été généré pour la production de ton hit. Tu recevras un email de suivi à <span className="text-white font-black underline decoration-pyronix-orange underline-offset-4">{email}</span>.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl mb-20">
        <Link to="/" className="bg-white/5 border-2 border-white/10 hover:border-white/20 py-8 px-10 rounded-[2rem] font-black text-xl tracking-widest flex items-center justify-center gap-4 transition-all uppercase group">
          <Home size={28} className="group-hover:-translate-y-1 transition-transform" /> ACCUEIL
        </Link>
        <Link to="/commander" className="bg-gradient-to-r from-pyronix-orange to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-8 px-10 rounded-[2rem] font-black text-xl tracking-widest flex items-center justify-center gap-4 transition-all shadow-xl uppercase group">
          AUTRE COMMANDE <PlusCircle size={28} className="group-hover:rotate-90 transition-transform" />
        </Link>
      </div>

      <div className="p-12 bg-charcoal/50 backdrop-blur-md border-4 border-white/5 rounded-[3.5rem] max-w-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Mail size={120} />
        </div>
        <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-widest">Besoin de modifier ?</h4>
        <p className="text-gray-500 mb-8 text-lg font-medium leading-relaxed italic">Si tu as oublié un détail crucial, n'hésite pas à envoyer un message direct au studio.</p>
        <a 
          href={`mailto:${ADMIN_EMAIL}?subject=Modification Commande`} 
          className="inline-flex items-center gap-4 text-pyronix-orange font-black text-xl hover:text-white transition-all uppercase tracking-[0.2em] border-b-2 border-pyronix-orange pb-2"
        >
          CONTACTER PYRONIX <ArrowRight size={24} />
        </a>
      </div>
    </div>
  );
};

export default ThankYou;
