'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Mail, Phone, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: string;
  property?: { id: number; title: string; cityName: string };
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) setInquiries(await res.json());
    } catch {
      toast.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(`Inquiry marked as ${status.toLowerCase()}`);
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        );
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;

    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Inquiry deleted');
        setInquiries((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      toast.error('Error deleting inquiry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Inquiries Inbox</h1>
          <p className="text-slate-400 text-sm mt-1">Customer inquiries submitted from the website.</p>
        </div>
        <div className="text-sm text-slate-400">
          Total Messages: <strong className="text-white">{inquiries.length}</strong>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900/80 rounded-2xl border border-slate-800">
            Loading inquiries...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900/80 rounded-2xl border border-slate-800">
            No inquiries received yet.
          </div>
        ) : (
          inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`p-5 rounded-2xl border transition-all ${
                inq.status === 'UNREAD'
                  ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-sm">
                    {inq.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{inq.name}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-slate-500" /> {inq.email}
                      </span>
                      {inq.phone && (
                        <span className="flex items-center gap-1" dir="ltr">
                          <Phone className="h-3 w-3 text-slate-500" /> {inq.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      inq.status === 'UNREAD'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {inq.status}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(inq.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Message text */}
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line mb-3">
                {inq.message}
              </p>

              {/* Property link */}
              {inq.property && (
                <div className="text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-xl mb-3">
                  Property Inquiry: <strong>{inq.property.title}</strong> ({inq.property.cityName})
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                {inq.status === 'UNREAD' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(inq.id, 'READ')}
                    className="border-slate-700 text-slate-300 text-xs gap-1.5"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Mark as Read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(inq.id)}
                  className="text-slate-400 hover:text-red-400 text-xs gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
