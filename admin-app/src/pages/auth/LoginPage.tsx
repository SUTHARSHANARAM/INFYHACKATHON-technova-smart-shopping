import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Cpu, Mail, Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg(null);
    try {
      await login(data.email, data.password);
      showToast('Welcome to TechNova Admin Portal!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-sky-500/20">
            <Cpu className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">TechNova Admin Portal</h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-sky-400" /> Authorized System Access Only
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-xs text-rose-400 font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@technova.com"
                {...register('email')}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.password && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-slate-200">Demo Admin Credentials:</p>
          <p>Email: <code className="text-sky-400 font-mono">admin@technova.com</code></p>
          <p>Password: <code className="text-sky-400 font-mono">Admin@123456</code></p>
        </div>
      </div>
    </div>
  );
};
