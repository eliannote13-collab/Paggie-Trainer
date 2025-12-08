
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
    <form onSubmit={handleSubmit} className="animate-fade-in space-y-6" aria-label="Formulário de configuração de perfil">
      
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-1">Identidade do Personal</h2>
        <p className="text-slate-400 text-sm">Configure sua marca para os relatórios.</p>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-4">
        <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden relative mb-2 group cursor-pointer hover:border-paggie-cyan transition-colors shadow-lg">
            {profile.logoUrl ? (
                <img src={profile.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
            ) : (
                <div className="text-slate-500 text-xs text-center px-2">
                <span className="block text-2xl mb-1">📷</span>
                Upload Logo
                </div>
            )}
            <input 
                type="file" 
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" 
                onChange={handleImageUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Upload de logo"
            />
            </div>
            <p className="text-xs text-slate-500">Toque para adicionar foto</p>
        </div>

        <Input
            label="Seu Nome / Nome da Marca"
            placeholder="Ex: Iron Fox Performance"
            value={profile.name}
            onChange={(e) => {
              const name = e.target.value;
              const validation = validateTextLength(name, 100, 'Nome');
              if (validation.valid || name.length <= 100) {
                setProfile({ ...profile, name });
              }
            }}
            required
            maxLength={100}
            aria-label="Nome do Personal Trainer"
            aria-required="true"
        />
        {profile.name.length > 80 && (
          <p className="text-xs text-amber-400">
            {100 - profile.name.length} caracteres restantes
          </p>
        )}
        {uploadError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg" role="alert">
            {uploadError}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-400 pl-1">Identidade Visual</h3>
        
        <div 
            className="w-full h-28 rounded-xl relative overflow-hidden shadow-lg transition-all duration-500 border border-slate-700/50"
            style={{ background: `linear-gradient(135deg, ${profile.primaryColor}, ${profile.primaryColor}dd)` }}
        >
            <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm p-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                    {profile.logoUrl && <img src={profile.logoUrl} className="w-8 h-8 rounded-full border border-white/50 object-cover" alt="" />}
                    <div>
                        <p className="text-white font-bold text-sm leading-tight">{profile.name || "Seu Nome"}</p>
                        <p className="text-white/70 text-[10px] uppercase tracking-wider">Relatório Performance</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
             <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {PRESET_COLORS.map((c, i) => (
                    <button
                    key={i}
                    type="button"
                    onClick={() => applyPreset(c.p, c.s)}
                    className="w-8 h-8 rounded-full border border-slate-600 hover:scale-110 transition-transform shadow-lg shrink-0"
                    style={{ background: `linear-gradient(135deg, ${c.p} 50%, ${c.s} 50%)` }}
                    />
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-2">
                    <label className="text-xs text-slate-400 font-medium">Cor Primária</label>
                    <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                        <div 
                            className="relative w-10 h-10 rounded-full shadow-inner border border-slate-600 ring-2 ring-offset-2 ring-offset-slate-900 ring-slate-700 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: profile.primaryColor }}
                        >
                            <input type="color" value={profile.primaryColor} onChange={(e) => setProfile({ ...profile, primaryColor: e.target.value })} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <label className="text-xs text-slate-400 font-medium">Cor Secundária</label>
                    <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                        <div 
                            className="relative w-10 h-10 rounded-full shadow-inner border border-slate-600 ring-2 ring-offset-2 ring-offset-slate-900 ring-slate-700 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: profile.secondaryColor }}
                        >
                            <input type="color" value={profile.secondaryColor} onChange={(e) => setProfile({ ...profile, secondaryColor: e.target.value })} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <Button type="submit" fullWidth disabled={!profile.name || loading}>
        {loading ? 'Salvando Perfil...' : 'Confirmar Identidade'}
      </Button>
    </form>
  );
};
