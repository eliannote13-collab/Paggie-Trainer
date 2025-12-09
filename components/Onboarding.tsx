
import React, { useState, useEffect } from 'react';
import { TrainerProfile } from '../types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { validateFileUpload, validateTextLength } from '../utils/validation';

interface Props {
  onComplete: (profile: TrainerProfile) => void;
  initialData?: TrainerProfile | null;
}

const PRESET_COLORS = [
  { p: '#EF4444', s: '#1F2937' }, // Red / Dark
  { p: '#3B82F6', s: '#1E3A8A' }, // Blue / Dark Blue
  { p: '#10B981', s: '#064E3B' }, // Emerald / Dark Green
  { p: '#F59E0B', s: '#78350F' }, // Amber / Brown
  { p: '#8B5CF6', s: '#4C1D95' }, // Violet / Dark Violet
  { p: '#EC4899', s: '#831843' }, // Pink / Dark Pink
  { p: '#00AEEF', s: '#0072BC' }, // Paggie Cyan
  { p: '#0f172a', s: '#94a3b8' }, // Black / Slate
];

export const Onboarding: React.FC<Props> = ({ onComplete, initialData }) => {
  const [profile, setProfile] = useState<TrainerProfile>({
    name: '',
    logoUrl: '',
    primaryColor: '#00AEEF',
    secondaryColor: '#0072BC',
  });
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setProfile(initialData);
    }
  }, [initialData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (!file) return;

    // Validate file
    const validation = validateFileUpload(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Erro ao validar arquivo');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setUploadError('Erro ao ler o arquivo. Tente novamente.');
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        setUploadError('Erro ao processar imagem. Verifique se o arquivo é uma imagem válida.');
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setUploadError('Erro ao processar imagem.');
            return;
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setProfile(prev => ({ ...prev, logoUrl: dataUrl }));
          setUploadError(null);
        } catch (error) {
          setUploadError('Erro ao processar imagem.');
        }
      };

      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };

    reader.readAsDataURL(file);
  };

  const applyPreset = (primary: string, secondary: string) => {
    setProfile(prev => ({ ...prev, primaryColor: primary, secondaryColor: secondary }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const nameValidation = validateTextLength(profile.name.trim(), 100, 'Nome');
    if (!nameValidation.valid || !profile.name.trim()) {
      return;
    }

    if (profile.name.trim()) {
      setLoading(true);
      try {
        await onComplete(profile);
      } catch (error) {
        console.error('Erro ao salvar perfil:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-20 pt-8 animate-fade-in">

      {/* Header Section */}
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl font-black text-white tracking-tight">Identidade do Personal</h2>
        <p className="text-slate-400 font-medium text-sm max-w-sm mx-auto">
          Configure a aparência dos seus relatórios para transmitir profissionalismo e confiança.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" aria-label="Formulário de configuração de perfil">

        {/* Card: Basic Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-paggie-cyan/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10 flex flex-col items-center sm:items-start gap-8">

            {/* Logo Upload - Centered */}
            <div className="w-full flex flex-col items-center">
              <div className="relative group/avatar cursor-pointer">
                <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-800 shadow-xl overflow-hidden relative ring-2 ring-slate-700 group-hover/avatar:ring-paggie-cyan transition-all duration-500">
                  {profile.logoUrl ? (
                    <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-slate-500 group-hover/avatar:text-paggie-cyan transition-colors">
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Carregar Logo</span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Alterar</span>
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full z-20"
                  aria-label="Upload de logo"
                />
              </div>
            </div>

            <div className="w-full space-y-2">
              <Input
                label="Nome Profissional / Marca"
                placeholder="Ex: Studio Performance"
                value={profile.name}
                onChange={(e) => {
                  const name = e.target.value;
                  if (name.length <= 100) setProfile({ ...profile, name });
                }}
                required
                maxLength={100}
                aria-label="Nome do Personal Trainer"
              />
              {profile.name.length > 80 && (
                <p className="text-xs text-amber-400 text-right font-medium">
                  {100 - profile.name.length} caracteres
                </p>
              )}
            </div>
          </div>
          {uploadError && (
            <div className="mt-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg font-medium text-center">
              {uploadError}
            </div>
          )}
        </div>

        {/* Card: Brand Identity */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-paggie-cyan rounded-full"></span>
            Identidade Visual
          </h3>

          {/* Preview Card */}
          <div className="w-full relative group perspective-1000">
            <div
              className="w-full h-40 sm:h-48 rounded-2xl relative overflow-hidden shadow-2xl transition-all duration-500 border border-white/10 group-hover:scale-[1.02] transform origin-center"
              style={{ background: `linear-gradient(135deg, ${profile.primaryColor}, ${profile.secondaryColor})` }}
            >
              {/* Glass Overlay Effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 blur-3xl rounded-full pointer-events-none"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center overflow-hidden shadow-lg">
                    {profile.logoUrl && <img src={profile.logoUrl} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div>
                    <p className="text-white font-black text-lg sm:text-2xl leading-none drop-shadow-md">{profile.name || "Seu Nome"}</p>
                    <p className="text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mt-1 shadow-black/50">Personal Trainer</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-3 font-medium">Prévia do cabeçalho dos relatórios</p>
          </div>

          {/* Color Pickers */}
          <div className="space-y-6">
            {/* Presets */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block pl-1">Temas Sugeridos</label>
              <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 scrollbar-hide snap-x">
                {PRESET_COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyPreset(c.p, c.s)}
                    className="w-10 h-10 rounded-full border-2 border-slate-700 hover:border-white hover:scale-110 transition-all shadow-lg shrink-0 snap-center relative group/btn"
                    style={{ background: `linear-gradient(135deg, ${c.p} 50%, ${c.s} 50%)` }}
                  >
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-white opacity-0 group-hover/btn:opacity-100 transition-opacity bg-black/80 px-1 py-0.5 rounded whitespace-nowrap pointer-events-none">Usar</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950/30 p-4 rounded-2xl border border-slate-800/50">
              <div className="flex-1 space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block pl-1">Cor Primária</label>
                <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors group/color">
                  <div
                    className="relative w-12 h-12 rounded-lg shadow-inner border border-slate-700 ring-2 ring-slate-800 group-hover/color:ring-paggie-cyan/50 transition-all overflow-hidden cursor-pointer"
                    style={{ backgroundColor: profile.primaryColor }}
                  >
                    <input type="color" value={profile.primaryColor} onChange={(e) => setProfile({ ...profile, primaryColor: e.target.value })} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                  </div>
                  <span className="font-mono text-sm text-slate-400 uppercase">{profile.primaryColor}</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block pl-1">Cor Secundária</label>
                <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors group/color">
                  <div
                    className="relative w-12 h-12 rounded-lg shadow-inner border border-slate-700 ring-2 ring-slate-800 group-hover/color:ring-paggie-cyan/50 transition-all overflow-hidden cursor-pointer"
                    style={{ backgroundColor: profile.secondaryColor }}
                  >
                    <input type="color" value={profile.secondaryColor} onChange={(e) => setProfile({ ...profile, secondaryColor: e.target.value })} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                  </div>
                  <span className="font-mono text-sm text-slate-400 uppercase">{profile.secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" fullWidth disabled={!profile.name || loading} className="py-5 text-base shadow-xl">
          {loading ? 'Processando...' : 'Confirmar Identidade'}
        </Button>
      </form>
    </div>
  );
};
