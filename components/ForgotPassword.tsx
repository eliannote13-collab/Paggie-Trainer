import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { validateEmail } from '../utils/validation';

interface Props {
    onBack: () => void;
}

export const ForgotPassword: React.FC<Props> = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            setErrorMsg(emailValidation.error || 'E-mail inválido');
            setLoading(false);
            return;
        }

        try {
            // We don't reveal if the email exists or not for security, 
            // but Supabase usually handles this well.
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setSubmitted(true);
        } catch (error: any) {
            console.error('Reset password error:', error);
            // Even on error, we might want to show success to prevent enumeration, 
            // unless it's a rate limit or network error.
            if (error.message?.includes('Too many requests')) {
                setErrorMsg('Muitas tentativas. Aguarde um pouco e tente novamente.');
            } else {
                // Fallback to success message for generic errors to prevent user enumeration
                setSubmitted(true);
            }
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
                <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                        ✓
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">Verifique seu E-mail</h2>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                        Se o e-mail <strong>{email}</strong> estiver cadastrado em nossa base, você receberá um link para redefinir sua senha em instantes.
                    </p>
                    <Button onClick={onBack} variant="outline" fullWidth>
                        Voltar para Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-white mb-2">Recuperar Senha</h2>
                    <p className="text-slate-400 text-sm">
                        Digite seu e-mail para receber um link de redefinição de senha.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        autoFocus
                    />

                    {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center">
                            {errorMsg}
                        </div>
                    )}

                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Enviando link...' : 'Enviar Link de Recuperação'}
                    </Button>

                    <button
                        type="button"
                        onClick={onBack}
                        disabled={loading}
                        className="w-full text-center text-slate-500 hover:text-white text-xs font-bold mt-4 transition-colors"
                    >
                        Voltar para Login
                    </button>
                </form>
            </div>
        </div>
    );
};
