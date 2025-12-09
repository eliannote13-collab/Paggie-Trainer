
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { validateEmail, validatePassword, PasswordValidationResult } from '../utils/validation';
import { withTimeout } from '../utils/api';

interface Props {
  onForgotPassword: () => void;
}

export const Auth: React.FC<Props> = ({ onForgotPassword }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setPasswordValidation(null);

    // Client-side validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setErrorMsg(emailValidation.error || 'E-mail inválido');
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const pwdValidation = validatePassword(password);
      setPasswordValidation(pwdValidation);
      if (!pwdValidation.valid) {
        setErrorMsg(pwdValidation.error || 'Senha inválida');
        setLoading(false);
        return;
      }
    }

    try {
      if (isSignUp) {
        const { error } = await withTimeout(
          supabase.auth.signUp({
            email,
            password,
          }).then(r => {
            if (r.error) throw r.error;
            return r;
          }),
          30000
        );
        alert('Cadastro realizado! Verifique seu email ou faça login.');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
      } else {
        const { error } = await withTimeout(
          supabase.auth.signInWithPassword({
            email,
            password,
          }).then(r => {
            if (r.error) throw r.error;
            return r;
          }),
          30000
        );
      }
    } catch (error: any) {
      if (error.message?.includes('timeout')) {
        setErrorMsg('Tempo de espera esgotado. Verifique sua conexão e tente novamente.');
      } else if (error.message?.includes('Invalid login credentials')) {
        setErrorMsg('E-mail ou senha incorretos.');
      } else if (error.message?.includes('User already registered')) {
        setErrorMsg('Este e-mail já está cadastrado. Faça login ou use outro e-mail.');
      } else {
        setErrorMsg(error.message || 'Erro na autenticação');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">

        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-paggie-cyan/20 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            {isSignUp ? 'Criar Conta' : 'Bem-vindo'}
          </h2>
          <p className="text-slate-400 text-sm">
            {isSignUp ? 'Comece sua jornada profissional.' : 'Acesse seu painel Paggie Trainer.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 relative z-10" aria-label={isSignUp ? "Formulário de cadastro" : "Formulário de login"}>
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: seu@email.com"
            required
            aria-label="E-mail"
            aria-required="true"
          />
          <div>
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (isSignUp && e.target.value) {
                  setPasswordValidation(validatePassword(e.target.value));
                }
              }}
              placeholder="Ex: ••••••••"
              required
              aria-label="Senha"
              aria-describedby={isSignUp && passwordValidation ? "password-help" : undefined}
            />

            {/* Password Strength Validation - Only for Sign Up */}
            {isSignUp && passwordValidation && password && (
              <div id="password-help" className="mt-2 space-y-1">
                <div className={`text-xs ${passwordValidation.valid ? 'text-emerald-400' : 'text-amber-400'}`}>
                  Força: <span className="font-bold capitalize">{passwordValidation.strength || 'weak'}</span>
                </div>
                {passwordValidation.suggestions && passwordValidation.suggestions.length > 0 && (
                  <ul className="text-xs text-slate-500 list-disc list-inside">
                    {passwordValidation.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Forgot Password Link - Only for Login */}
            {!isSignUp && (
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs text-slate-400 hover:text-paggie-cyan transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center" role="alert">
              {errorMsg}
            </div>
          )}

          <Button type="submit" fullWidth disabled={loading} className="mt-4">
            {loading ? 'Processando...' : (isSignUp ? 'Cadastrar' : 'Entrar')}
          </Button>
        </form>

        <div className="mt-6 text-center relative z-10">
          <p className="text-xs text-slate-500">
            {isSignUp ? 'Já tem uma conta?' : 'Não tem conta?'}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-paggie-cyan hover:text-white font-bold transition-colors"
            >
              {isSignUp ? 'Fazer Login' : 'Cadastre-se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
