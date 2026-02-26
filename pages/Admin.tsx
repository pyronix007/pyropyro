
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search, Trash2, Eye, X, ArrowLeft, Lock, FileText, Globe, Languages, Home, Mail, Copy, Loader2, User } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { supabase } from '../supabase';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user;
      setUser(currentUser || null);
      if (currentUser) fetchOrders();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) fetchOrders();
    else setLoading(false);
  }

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching orders:', error);
    else setOrders(data || []);
    setLoading(false);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Erreur d'authentification : " + error.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) alert("Erreur lors de la mise à jour");
    else fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    if (window.confirm("Supprimer définitivement cette commande du cloud ?")) {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) alert("Erreur lors de la suppression");
      else fetchOrders();
    }
  };

  const statusMap = [
    { id: 'new', label: 'Nouveaux', color: 'bg-pyronix-orange' },
    { id: 'in_progress', label: 'En cours', color: 'bg-blue-600' },
    { id: 'done', label: 'Terminés', color: 'bg-green-600' },
    { id: 'delivered', label: 'Livrés', color: 'bg-pyronix-magenta' }
  ];

  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      order.email?.toLowerCase().includes(term) || 
      order.handle?.toLowerCase().includes(term) ||
      order.title?.toLowerCase().includes(term);
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative text-white">
        <form onSubmit={handleLogin} className="glass-morphism p-12 rounded-[4rem] w-full max-w-md border-4 border-charcoal shadow-2xl space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 mb-2"><Lock size={24} className="text-pyronix-orange" /> STUDIO AUTH</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Accès Cloud Sécurisé</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/40 border-2 border-white/10 pl-16 pr-8 py-5 rounded-2xl outline-none focus:border-pyronix-orange text-white font-bold" placeholder="EMAIL ADMIN" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/40 border-2 border-white/10 pl-16 pr-8 py-5 rounded-2xl outline-none focus:border-pyronix-orange text-white font-bold" placeholder="MOT DE PASSE" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-pyronix-orange py-6 rounded-2xl font-black uppercase text-xl transition-all text-white flex items-center justify-center gap-4">
            {loading ? <Loader2 className="animate-spin" /> : "SE CONNECTER"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto animate-in fade-in duration-500 pb-40 text-white text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-white leading-none">Journal <span className="text-pyronix-orange">Studio</span></h1>
          <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest mt-2">Base de données Cloud Pyronix</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-2 bg-red-600/10 border-2 border-red-600/50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
            <LogOut size={16}/> QUITTER LE CLOUD
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6 opacity-50">
          <Loader2 className="animate-spin text-pyronix-orange" size={60} />
          <p className="font-black uppercase tracking-widest text-sm">Synchronisation Cloud...</p>
        </div>
      ) : (
        <>
          <div className="mb-8 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input type="text" placeholder="RECHERCHER DANS LE CLOUD..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-charcoal border border-white/10 focus:border-pyronix-orange outline-none pl-16 pr-8 py-5 rounded-2xl text-white text-lg font-bold uppercase tracking-widest shadow-xl" />
          </div>

          <div className="bg-charcoal border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden overflow-x-auto no-scrollbar">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="p-6">Date</th>
                  <th className="p-6">Artiste</th>
                  <th className="p-6">Titre</th>
                  <th className="p-6">Statut</th>
                  <th className="p-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.length > 0 ? filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-white/5 transition-all group">
                    <td className="p-6 text-gray-600 text-[9px]">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="p-6 font-black text-pyronix-cyan">{o.handle}</td>
                    <td className="p-6 font-black uppercase text-white tracking-widest text-xs">{o.title}</td>
                    <td className="p-6">
                      <select 
                        value={o.status} 
                        onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                        className={`bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-[9px] font-black uppercase outline-none focus:border-white transition-colors cursor-pointer ${statusMap.find(s => s.id === o.status)?.color}`}
                      >
                        {statusMap.map(st => <option key={st.id} value={st.id} className="bg-charcoal">{st.label}</option>)}
                      </select>
                    </td>
                    <td className="p-6 flex items-center justify-center gap-2">
                      <button onClick={() => setSelectedOrder(o)} className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-pyronix-cyan transition-colors"><Eye size={18}/></button>
                      <button onClick={() => deleteOrder(o.id)} className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-gray-600 font-black uppercase tracking-widest">Le cloud est vide</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto">
           <div className="max-w-4xl w-full my-8 animate-in zoom-in-95 duration-300">
              <div className="bg-charcoal p-8 md:p-12 rounded-[3.5rem] border-4 border-white/5 shadow-2xl space-y-8 text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                  <h3 className="text-4xl font-black text-pyronix-orange uppercase tracking-tighter italic">FICHE CLOUD</h3>
                  <button onClick={() => setSelectedOrder(null)} className="p-3 bg-white/5 rounded-full hover:bg-white/10"><X size={24}/></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-8">
                      <div><p className="text-gray-500 font-black uppercase text-[10px] tracking-widest mb-1">PROJET</p><p className="text-4xl font-black uppercase text-white leading-tight">{selectedOrder.title}</p></div>
                      <div><p className="text-gray-500 font-black uppercase text-[10px] tracking-widest mb-1">CLIENT</p><p className="text-2xl font-black text-pyronix-cyan">{selectedOrder.handle}</p><p className="text-sm text-gray-400 italic">{selectedOrder.email}</p></div>
                   </div>

                   <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-gray-400 font-black uppercase text-[10px]">STATUT ACTUEL</span>
                        <span className="text-white font-bold text-sm uppercase">{statusMap.find(s => s.id === selectedOrder.status)?.label}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-gray-400 font-black uppercase text-[10px]">VOIX</span>
                        <span className="text-white font-bold uppercase text-sm">{selectedOrder.voice}</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2"><FileText size={16} className="text-pyronix-orange" /> BRIEFING IA</p>
                   <div className="bg-black/40 p-6 rounded-[1.5rem] border border-white/5 italic text-gray-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">"{selectedOrder.ai_summary || "Aucun résumé généré."}"</div>
                </div>
                
                <button onClick={() => setSelectedOrder(null)} className="w-full bg-white/10 py-5 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-4"><ArrowLeft size={24} /> RETOUR AU JOURNAL</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
