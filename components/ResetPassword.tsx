import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { validatePassword, PasswordValidationResult } from '../utils/validation';

interface Props {
    onSuccess: () => void;
}

export const ResetPassword: React.FC<Props> = ({ onSuccess }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [validation, setValidation] = useState<PasswordValidationResult | null>(null);

    useEffect(() => {
        // Check if we actually have a session (user clicked email link)
        // Supabase auto-logs in user when they click the reset link
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setErrorMsg('Sessão inválida ou expirada. Solicite uma nova redefinição de senha.');
            }
        });
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        if (newPassword !== confirmPassword) {
            setErrorMsg('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        const val = validatePassword(newPassword);
        if (!val.valid) {
            setErrorMsg(val.error || 'Senha fraca.');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            alert("Senha atualizada com sucesso!");
            onSuccess();

        } catch (error: any) {
            console.error('Update password error:', error);
            setErrorMsg(error.message || 'Erro ao atualizar senha.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-white mb-2">Redefinir Senha</h2>
                    <p className="text-slate-400 text-sm">
                        Crie uma nova senha segura para sua conta.
                    </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-5">
                    <div>
                        <Input
                            label="Nova Senha"
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setValidation(validatePassword(e.target.value));
                            }}
                            placeholder="••••••••"
                            required
                        />
                        {validation && (newPassword.length > 0) && (
                            <div className="mt-2 space-y-1 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-slate-400">Força da senha:</span>
                                    <span className={`text-xs font-bold uppercase ${validation.strength === 'strong' ? 'text-emerald-400' :
                                            validation.strength === 'medium' ? 'text-amber-400' : 'text-rose-400'
                                        }`}>{validation.strength === 'strong' ? 'Forte' : validation.strength === 'medium' ? 'Média' : 'Fraca'}</span>
                                </div>
                                {/* Checklist */}
                                <div className="grid grid-cols-1 gap-1">
                                    <StatusItem valid={newPassword.length >= 8} label="Mínimo 8 caracteres" />
                                    <StatusItem valid={/[A-Z]/.test(newPassword)} label="Uma letra maiúscula" />
                                    <StatusItem valid={/[a-z]/.test(newPassword)} label="Uma letra minúscula" />
                                    <StatusItem valid={/[0-9]/.test(newPassword)} label="Um número" />
                                </div>
                            </div>
                        )}
                    </div>

                    <Input
                        label="Confirmar Senha"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center">
                            {errorMsg}
                        </div>
                    )}

                    <Button type="submit" fullWidth disabled={loading || (validation && !validation.valid)}>
                        {loading ? 'Atualizando...' : 'Atualizar Senha'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

const StatusItem = ({ valid, label }: { valid: boolean, label: string }) => (
    <div className={`flex items-center gap-2 text-[10px] ${valid ? 'text-emerald-400' : 'text-slate-500'}`}>
        <span>{valid ? '✓' : '○'}</span>
        <span>{label}</span>
    </div>
);
