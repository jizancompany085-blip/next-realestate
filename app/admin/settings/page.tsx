'use client';

import { useState } from 'react';
import { ShieldCheck, Save, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [email, setEmail] = useState('admin@NFTksa.com');
  const [name, setName] = useState('System Admin');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setNewPassword('');
      toast.success('Admin settings updated successfully!');
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Admin Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage administrator profile and credentials.</p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Admin Display Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Admin Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <Label className="text-slate-300">Change Password (Optional)</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Info card */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 text-xs flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>
            Database mode: <strong>SQLite (Local Development)</strong>. To connect to <strong>MySQL</strong> in production, update <code>provider = &quot;mysql&quot;</code> in <code>prisma/schema.prisma</code> and set your MySQL <code>DATABASE_URL</code> in <code>.env</code>.
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Save className="h-4 w-4" /> {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
