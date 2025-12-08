
import { createClient } from '@supabase/supabase-js';

// CREDENCIAIS DO SUPABASE - Carregadas de variáveis de ambiente
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kyrpsgsseussenrchovc.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5cnBzZ3NzZXVzc2VucmNob3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5Nzg3NjYsImV4cCI6MjA4MDU1NDc2Nn0.1n-Hu8Do7SQrou0KrS5BNetQ4uWUSGH3K3FT5aJvJg0';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase credentials não configuradas. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getCurrentUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Tenta buscar no Supabase
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    // Se der erro (ex: tabela não existe ou usuário novo), tentamos recuperar do LocalStorage
    // para garantir que o usuário não perca seus dados se a nuvem falhar.
    const { safeGetItem } = await import('../utils/storage');
    const localResult = safeGetItem(`trainer_profile_${user.id}`);
    if (localResult.success && localResult.value) {
        try {
          return JSON.parse(localResult.value);
        } catch (e) {
          console.error('Erro ao fazer parse do perfil local:', e);
        }
    }

    // Tabela não existe? Modo Offline silencioso.
    if (error.code === '42P01' || error.message?.includes('Could not find the table')) {
        console.warn("Supabase: Tabela 'profiles' não encontrada. Usando dados locais se disponíveis.");
        return null;
    }

    // Código PGRST116 = Nenhuma linha encontrada (Usuário novo sem perfil)
    if (error.code === 'PGRST116') {
        return null;
    }
    
    // Log detalhado em vez de [object Object]
    console.warn('Aviso: Perfil não carregado do Supabase. Detalhes:', error.message || error);
    return null;
  }
  
  // Se sucesso no Supabase, retorna e atualiza local
  const profile = {
      name: data.name,
      logoUrl: data.logo_url,
      primaryColor: data.primary_color,
      secondaryColor: data.secondary_color
  };
  
  // Mantém cache local atualizado com verificação de quota
  const { safeSetItem } = await import('../utils/storage');
  const saveResult = safeSetItem(`trainer_profile_${user.id}`, JSON.stringify(profile));
  if (!saveResult.success) {
    console.warn('Aviso: Não foi possível salvar perfil localmente:', saveResult.error);
  }
  
  return profile;
};

export const saveUserProfile = async (profile: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // 1. SALVAMENTO GARANTIDO (LocalStorage com verificação de quota)
    // Isso assegura que o app funcione mesmo se o banco de dados falhar.
    const { safeSetItem } = await import('../utils/storage');
    const localResult = safeSetItem(`trainer_profile_${user.id}`, JSON.stringify(profile));
    if (!localResult.success) {
        console.error("Erro ao salvar no LocalStorage:", localResult.error);
        // Não lançamos erro aqui, apenas logamos, pois ainda tentamos salvar no Supabase
    }

    // 2. TENTATIVA DE SINCRONIZAÇÃO (Supabase)
    const payload = {
        id: user.id,
        name: profile.name,
        logo_url: profile.logoUrl,
        primary_color: profile.primaryColor,
        secondary_color: profile.secondaryColor,
    };

    try {
        const { error } = await supabase.from('profiles').upsert(payload);

        if (error) {
            // Se a tabela não existir, tratamos como um aviso de modo offline, não um erro crítico.
            if (error.code === '42P01' || error.message?.includes('Could not find the table')) {
                console.warn("Modo Offline: Tabela 'profiles' não encontrada no Supabase. Dados salvos apenas localmente.");
                return;
            }

            // Logamos o erro de forma legível para outros casos
            console.error("Erro ao sincronizar com Supabase:", error.message, error.details);
            return; 
        }
    } catch (e: any) {
        console.error("Erro inesperado ao salvar perfil no Supabase:", e);
        // Não lançamos erro, pois os dados já foram salvos localmente
    }
};
