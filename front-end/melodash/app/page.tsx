"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Play, Pause, SkipForward, SkipBack, Home, Search,
  LayoutDashboard, Wallet, Music2, CheckCircle2,
  AlertCircle, TrendingUp, Clock, Zap, Mail, ArrowRight,
  ShieldCheck, Globe, Users, Mic2, Star, Sparkles, PlusCircle,
  BarChart3, Headphones, DollarSign, User
} from 'lucide-react';

// --- TYPES ---
interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  cover: string;
}

interface UserData {
  name?: string;
  email?: string;
  [key: string]: any;
}

// ---CONFIGURAÇÕES E CORES---
const MONAD_COLORS = {
  bg: '#0C0C0C',
  primary: '#23154eef',
  accent: '#ca0374ee',
  deepPurple: '#201443',
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)'
};

const MONTHLY_GOAL_HOURS = 100;
const CASHBACK_THRESHOLD_PERCENT = 90;
const SUBSCRIPTION_FEE = 20;

// --- MOCK DATA ---
const MOCK_TRACKS = [
  { id: '1', title: 'Monad Speed', artist: 'Giga Gas', duration: 185, cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop' },
  { id: '2', title: 'Parallel Execution', artist: 'The Devs', duration: 210, cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=300&fit=crop' },
  { id: '3', title: 'Throughput High', artist: 'TPS Master', duration: 145, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop' },
  { id: '4', title: 'EVM Killer', artist: 'Ethereum Rival', duration: 198, cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop' },
];

// --- CUSTOM HOOK: useMeloDash ---
const useMeloDash = () => {
  const [totalSecondsListened, setTotalSecondsListened] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackSecondsElapsed, setTrackSecondsElapsed] = useState(0);
  const [playHistory, setPlayHistory] = useState<string[]>([]);
  const [isValidSession, setIsValidSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null); // 'user' ou 'artist'
  const [userData, setUserData] = useState<UserData>({});

  useEffect(() => {
    const channel = new BroadcastChannel('melodash_session');
    channel.postMessage({ type: 'NEW_SESSION_ATTEMPT' });
    channel.onmessage = (event) => {
      if (event.data.type === 'NEW_SESSION_ATTEMPT') channel.postMessage({ type: 'SESSION_ALREADY_EXISTS' });
      if (event.data.type === 'SESSION_ALREADY_EXISTS') { setIsValidSession(false); setIsPlaying(false); }
    };
    return () => channel.close();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlaying && isValidSession && currentTrack) {
      interval = setInterval(() => setTrackSecondsElapsed(prev => prev + 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isPlaying, isValidSession, currentTrack]);

  useEffect(() => {
    if (trackSecondsElapsed >= 30 && currentTrack) {
      const lastThree = playHistory.slice(-3);
      const isBot = lastThree.length === 3 && lastThree.every(id => id === currentTrack.id);
      if (!isBot) setTotalSecondsListened(prev => prev + 1);
    }
  }, [trackSecondsElapsed, currentTrack, playHistory]);

  const togglePlay = useCallback(() => isValidSession && setIsPlaying(!isPlaying), [isPlaying, isValidSession]);

  const selectTrack = useCallback((track: Track) => {
    if (!isValidSession) return;
    if (currentTrack?.id === track.id) { togglePlay(); return; }
    if (currentTrack) setPlayHistory(prev => [...prev.slice(-5), currentTrack.id]);
    setCurrentTrack(track);
    setTrackSecondsElapsed(0);
    setIsPlaying(true);
  }, [currentTrack, togglePlay, isValidSession]);

  const stats = useMemo(() => {
    const hours = totalSecondsListened / 3600;
    const progress = Math.min((hours / MONTHLY_GOAL_HOURS) * 100, 100);
    const isEligibleForCashback = progress >= CASHBACK_THRESHOLD_PERCENT;
    const estimatedCashback = isEligibleForCashback ? (hours / MONTHLY_GOAL_HOURS) * (SUBSCRIPTION_FEE * 0.1 * 100) : 0;
    return { hours: hours.toFixed(2), progress, isEligibleForCashback, estimatedCashback: estimatedCashback.toFixed(2) };
  }, [totalSecondsListened]);

  const login = (role: string, data: UserData = {}) => {
    setUserRole(role);
    setUserData(data);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return {
    currentTrack, isPlaying, trackSecondsElapsed, togglePlay, selectTrack,
    stats, isValidSession, isAuthenticated, userRole, userData, login, logout, setUserRole
  };
};

// --- COMPONENTES DE UI ---

const ProgressBar = ({ progress, color }: { progress: number; color: string }) => (
  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
    <div className="h-full transition-all duration-500 ease-out rounded-full" style={{ width: `${progress}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
  </div>
);

const TrackCard = ({ track, isActive, onSelect }: { track: Track; isActive: boolean; onSelect: (track: Track) => void }) => (
  <div onClick={() => onSelect(track)} className={`group relative flex flex-col p-3 rounded-xl transition-all cursor-pointer border ${isActive ? 'border-[#836EF9] bg-[#836EF9]/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
    <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
      <img src={track.cover} alt={track.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
      <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {isActive ? <Pause fill="white" /> : <Play fill="white" />}
      </div>
    </div>
    <h3 className="font-bold text-sm truncate">{track.title}</h3>
    <p className="text-xs text-white/50 truncate">{track.artist}</p>
  </div>
);

// --- VIEW: LOGIN / ONBOARDING ---
interface LoginViewProps {
  onLogin: (role: string, data?: object) => void;
  userRole: string | null;
  setUserRole: (role: string | null) => void;
}

const LoginView = ({ onLogin, userRole, setUserRole }: LoginViewProps) => {
  const [step, setStep] = useState(1); // 1: CTA, 2: Role, 3: Method, 4: Email Form
  const [formData, setFormData] = useState({ name: '', email: '', extra: '' });

  const handleRoleSelect = (role: string) => {
    setUserRole(role);
    setStep(3);
  };

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole) {
      onLogin(userRole, formData);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#23154eef]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#A0055D]/10 rounded-full blur-[150px]" />

      <div className="max-w-xl w-full relative z-10">

        {step === 1 && (
          <div className="text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#23154eef] to-[#A0055D] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#836EF9]/30">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-none">
             ONDE TODO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#836EF9] to-[#A0055D]">MUNDO GANHA!</span>
            </h1>
            <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
              Ganhe <span className="text-white font-bold">cashback</span> como fã ou <span className="text-white font-bold">royalties paralelos</span> como artista na rede Monad.
            </p>
            <button onClick={() => setStep(2)} className="group items-center gap-3 bg-white text-black px-8 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all">
              Começar Agora 
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-bottom-8 duration-500 text-center">
            <h2 className="text-3xl font-black mb-8">Quem é você no ecossistema?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div onClick={() => handleRoleSelect('user')} className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-[#836EF9] hover:bg-[#836EF9]/5 transition-all cursor-pointer">
                <Users className="w-12 h-12 text-[#836EF9] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Sou Fã</h3>
                <p className="text-white/40 text-sm">Quero ouvir e lucrar com meus artistas favoritos.</p>
              </div>
              <div onClick={() => handleRoleSelect('artist')} className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-[#A0055D] hover:bg-[#A0055D]/5 transition-all cursor-pointer">
                <Mic2 className="w-12 h-12 text-[#A0055D] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Sou Artista</h3>
                <p className="text-white/40 text-sm">Quero gerenciar meus royalties e crescer na Web3.</p>
              </div>
            </div>
            <button onClick={() => setStep(1)} className="mt-8 text-white/30 text-sm hover:text-white">Voltar</button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-10 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#836EF9] mb-2 block">Acesso {userRole === 'user' ? 'Fã' : 'Artista'}</span>
              <h2 className="text-2xl font-bold">Escolha seu método</h2>
            </div>
            <div className="space-y-4">
              <button onClick={() => { if (userRole) onLogin(userRole); }} className="w-full flex items-center justify-center gap-3 bg-[#201443] py-5 rounded-2xl font-bold hover:bg-[#725df0] transition-all">
                <Wallet className="w-6 h-6" /> Conectar Carteira
              </button>
              <div className="relative py-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div><div className="relative flex justify-center text-[10px] uppercase"><span className="bg-[#0C0C0C] px-4 text-white/30 font-black">ou</span></div></div>
              <button onClick={() => setStep(4)} className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all">
                <Mail className="w-6 h-6" /> Entrar com E-mail
              </button>
            </div>
            <button onClick={() => setStep(2)} className="mt-8 block mx-auto text-white/30 text-sm hover:text-white">Voltar</button>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-10 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">{userRole === 'user' ? 'Perfil do Ouvinte' : 'Perfil do Artista'}</h2>
              <p className="text-white/40 text-sm mt-2">Personalize sua experiência no MeloDash</p>
            </div>
            <form onSubmit={handleSubmitEmail} className="space-y-4">
              <input required type="text" placeholder="Seu Nome" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#836EF9]" onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <input required type="email" placeholder="E-mail" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#836EF9]" onChange={e => setFormData({ ...formData, email: e.target.value })} />

              {userRole === 'user' ? (
                <select className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#836EF9] text-white/60" onChange={e => setFormData({ ...formData, extra: e.target.value })}>
                  <option value="">Seu gênero favorito?</option>
                  <option value="hiphop">Hip Hop</option>
                  <option value="pop">Pop</option>
                  <option value="eletronica">Eletrônica</option>
                  <option value="rock">Rock</option>
                </select>
              ) : (
                <input type="url" placeholder="Link do seu Portfólio (Soundcloud/Spotify)" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#A0055D]" onChange={e => setFormData({ ...formData, extra: e.target.value })} />
              )}

              <button type="submit" className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${userRole === 'user' ? 'bg-[#836EF9]' : 'bg-[#A0055D]'}`}>
                Finalizar Cadastro
              </button>
            </form>
            <button onClick={() => setStep(3)} className="mt-6 block mx-auto text-white/30 text-sm hover:text-white">Voltar</button>
          </div>
        )}

      </div>
    </div>
  );
};

// --- VIEW: ARTIST DASHBOARD ---

const ArtistDashboard = ({ userData, logout }: { userData: UserData; logout: () => void }) => {
  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white p-6 md:p-12 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#A0055D] flex items-center justify-center"><Mic2 className="text-white" /></div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter">STUDIO <span className="text-[#A0055D]">ARTISTA</span></h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Bem-vindo, {userData.name || 'Artista'}</p>
          </div>
        </div>
        <button onClick={logout} className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-red-500/50 transition-all"><AlertCircle size={20} className="text-white/30" /></button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden">
          <DollarSign className="absolute -right-4 -bottom-4 w-24 h-24 text-[#A0055D]/10" />
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Receita Total</p>
          <h2 className="text-4xl font-black">1.240 <span className="text-sm text-white/30 font-normal">USDC</span></h2>
          <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold">
            <TrendingUp size={14} /> +12% esse mês
          </div>
        </div>
        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Plays Totais</p>
          <h2 className="text-4xl font-black">45.8K</h2>
          <p className="text-white/30 text-xs mt-4">Tempo médio: 3min 12s</p>
        </div>
        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Fãs Engajados</p>
          <h2 className="text-4xl font-black">892</h2>
          <p className="text-white/30 text-xs mt-4">Atingiram o threshold de 90%</p>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black tracking-tight">Suas Obras</h2>
          <button className="flex items-center gap-2 bg-[#A0055D] px-4 py-2 rounded-xl text-sm font-bold"><PlusCircle size={18} /> Novo Upload</button>
        </div>
        <div className="space-y-4">
          {MOCK_TRACKS.slice(0, 2).map(track => (
            <div key={track.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-4">
                <img src={track.cover} className="w-12 h-12 rounded-lg" />
                <div>
                  <h4 className="font-bold">{track.title}</h4>
                  <p className="text-xs text-white/40">Lançado há 12 dias</p>
                </div>
              </div>
              <div className="flex gap-8 text-right">
                <div><p className="text-[10px] text-white/30 font-bold uppercase">Plays</p><p className="font-mono text-sm">12.4k</p></div>
                <div><p className="text-[10px] text-white/30 font-bold uppercase">Ganhos</p><p className="font-mono text-sm text-[#A0055D]">420 USDC</p></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- APP PRINCIPAL ---

export default function App() {
  const {
    currentTrack, isPlaying, togglePlay, selectTrack,
    stats, isValidSession, isAuthenticated, userRole, userData, login, logout, setUserRole, trackSecondsElapsed
  } = useMeloDash();

  const [activeTab, setActiveTab] = useState('home');

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-white flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md p-10 rounded-3xl bg-white/5 border border-red-500/20 backdrop-blur-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black mb-3">Sessão Única Exigida</h1>
          <p className="text-white/50 leading-relaxed">O protocolo MeloDash na Monad exige apenas uma aba ativa para validação de recompensas anti-bot.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView onLogin={login} userRole={userRole} setUserRole={setUserRole} />;
  }

  // ROTEAMENTO DE DASHBOARDS
  if (userRole === 'artist') {
    return <ArtistDashboard userData={userData} logout={logout} />;
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white font-sans selection:bg-[#23154eef]/30 pb-32 md:pb-0 md:pl-64 animate-in fade-in duration-1000">

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-[#0C0C0C] border-r border-white/10 flex-col p-8 z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#23154eef] to-[#A0055D] flex items-center justify-center shadow-lg shadow-[#836EF9]/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">MELODASH</span>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { id: 'home', icon: Home, label: 'Início' },
            { id: 'search', icon: Search, label: 'Buscar' },
            { id: 'dashboard', icon: LayoutDashboard, label: 'Ganhos' },
            { id: 'wallet', icon: Wallet, label: 'Carteira' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-[#23154eef] text-white shadow-xl shadow-[#836EF9]/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={logout} className="mt-auto p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all text-left group">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#836EF9]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Fã Premium</span>
          </div>
          <div className="flex items-center justify-between overflow-hidden">
            <span className="text-sm font-bold truncate">{userData.name || '0x71C...3a2f'}</span>
            <AlertCircle className="w-4 h-4 text-white/10 group-hover:text-red-500" />
          </div>
        </button>
      </aside>

      {/* Main Content (USER) */}
      <main className="p-6 md:p-12 max-w-7xl mx-auto">
        <header className="md:hidden flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#836EF9] to-[#A0055D] flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-black tracking-tighter">MELODASH</span>
          </div>
          <div onClick={logout} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <User className="w-5 h-5 text-[#836EF9]" />
          </div>
        </header>

        {/* Dashboard de Ganhos */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-gradient-to-br from-[#1a1135] to-[#0C0C0C] border border-white/10 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Sparkles className="w-40 h-40 text-[#836EF9]" /></div>
            <div className="relative z-10">
              <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Meta Mensal</h2>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black">{stats.hours}h</span>
                <span className="text-white/30 text-base font-bold">/ {MONTHLY_GOAL_HOURS}h</span>
              </div>
              <ProgressBar progress={stats.progress} color={stats.progress >= 90 ? '#4ade80' : '#836EF9'} />
              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md">
                  <p className="text-white/40 text-[9px] uppercase font-black tracking-widest mb-2">Cashback Est.</p>
                  <p className="text-2xl font-black text-[#836EF9]">${stats.estimatedCashback} <span className="text-xs">USDC</span></p>
                </div>
                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md">
                  <p className="text-white/40 text-[9px] uppercase font-black tracking-widest mb-2">Artistas Apoiados</p>
                  <p className="text-2xl font-black text-[#A0055D]">12 <span className="text-xs text-white/30 font-bold uppercase">Indie</span></p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col justify-center items-center text-center shadow-2xl">
            <Star className="w-12 h-12 text-[#A0055D] mb-4" />
            <h3 className="font-black text-xl mb-2">Sua Assinatura</h3>
            <p className="text-white/40 text-sm mb-8">Status: Ativo ($20/mês)</p>
            <button className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm hover:scale-[1.02] transition-transform">Gerenciar</button>
          </div>
        </section>

        {/* Music Grid */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tighter">Ouvir Agora</h2>
            <button className="text-[#836EF9] text-sm font-bold hover:underline">Ver tudo</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {MOCK_TRACKS.map(track => (
              <TrackCard key={track.id} track={track} isActive={currentTrack?.id === track.id} onSelect={selectTrack} />
            ))}
          </div>
        </section>
      </main>

      {/* Sticky Player */}
      {currentTrack && (
        <div className="fixed bottom-20 md:bottom-0 left-0 right-0 h-28 bg-[#0C0C0C]/95 backdrop-blur-3xl border-t border-white/5 px-6 md:px-12 flex items-center justify-between z-50">
          <div className="flex items-center gap-5 w-1/3">
            <img src={currentTrack.cover} className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover shadow-2xl" />
            <div className="overflow-hidden">
              <h4 className="font-black text-sm md:text-lg truncate tracking-tight">{currentTrack.title}</h4>
              <p className="text-xs text-white/40 font-bold uppercase tracking-widest truncate">{currentTrack.artist}</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 w-1/3">
            <button onClick={togglePlay} className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-all">
              {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
            </button>
            <div className="hidden md:flex items-center gap-4 w-full max-w-md text-[10px] font-mono text-white/20">
              <span>{Math.floor(trackSecondsElapsed / 60)}:{String(trackSecondsElapsed % 60).padStart(2, '0')}</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#836EF9] to-[#A0055D]" style={{ width: `${(trackSecondsElapsed / currentTrack.duration) * 100}%` }} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-5 w-1/3">
            <div className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${trackSecondsElapsed >= 30 ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-white/30'}`}>
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-tighter">{trackSecondsElapsed >= 30 ? 'Validado' : `${30 - trackSecondsElapsed}s`}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0C0C0C]/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-6 z-40">
        {[Home, Search, LayoutDashboard, Wallet].map((Icon, i) => (
          <button key={i} className={`p-3 rounded-2xl ${i === 0 ? 'text-[#836EF9] bg-[#836EF9]/10' : 'text-white/20'}`}><Icon className="w-6 h-6" /></button>
        ))}
      </nav>

      <style dangerouslySetInnerHTML={{
        __html: `
        .animate-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}