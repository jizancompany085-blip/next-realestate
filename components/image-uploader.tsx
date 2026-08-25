'use client';

import { useState, useRef } from 'react';
import { Link2, UploadCloud, Image as ImageIcon, Check, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/locale-provider';
import { toast } from 'sonner';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const { locale } = useLocale();
  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error(locale === 'ar' ? 'يرجى اختيار ملف صورة صالح' : 'Please select a valid image file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      onChange(data.url);
      toast.success(locale === 'ar' ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully!');
    } catch {
      toast.error(locale === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          {label}
        </label>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-800/60 border border-slate-700/60 w-fit">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === 'url'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Link2 className="h-3.5 w-3.5" />
          <span>{locale === 'ar' ? 'رابط مباشر (URL)' : 'Paste Image URL'}</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('file')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === 'file'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span>{locale === 'ar' ? 'رفع من الكمبيوتر' : 'Upload from PC'}</span>
        </button>
      </div>

      {/* Input Field Based on Selected Mode */}
      {mode === 'url' ? (
        <div className="space-y-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.pexels.com/... or /uploads/..."
            className="bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-slate-700 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center justify-center py-2 text-emerald-400 gap-2 text-xs">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{locale === 'ar' ? 'جاري رفع الصورة...' : 'Uploading image file...'}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
              <div className="p-3 rounded-full bg-slate-800 border border-slate-700 text-emerald-400">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-white">
                {locale === 'ar'
                  ? 'اسحب الصورة هنا أو اضغط للاختيار من جهازك'
                  : 'Drag & drop image file here, or click to browse'}
              </p>
              <p className="text-[11px] text-slate-500">JPG, PNG, WEBP (Max 10MB)</p>
            </div>
          )}
        </div>
      )}

      {/* Live Thumbnail Preview */}
      {value && (
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <img
            src={value}
            alt="Preview"
            className="h-12 w-12 rounded-lg object-cover border border-slate-700 shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex-1 overflow-hidden text-xs">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> {locale === 'ar' ? 'معاينة الصورة' : 'Image Preview'}
            </span>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{value}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800"
            title="Clear image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
