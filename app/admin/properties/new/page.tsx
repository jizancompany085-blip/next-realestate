'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from '@/components/image-uploader';
import { useLocale } from '@/components/locale-provider';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';

export default function AddPropertyPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    type: 'Villa',
    purpose: 'Sale',
    cityName: 'Riyadh',
    cityNameAr: 'الرياض',
    districtName: 'Hittin',
    districtNameAr: 'حطين',
    bedrooms: '4',
    bathrooms: '5',
    area: '450',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    latitude: '24.7725',
    longitude: '46.6042',
    features: 'Pool, Garden, Smart Home, Driver Room, Elevator',
    featuresAr: 'مسبح, حديقة, منزل ذكي, غرفة سائق, مصعد',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        features: formData.features.split(',').map((s) => s.trim()).filter(Boolean),
        featuresAr: formData.featuresAr.split(',').map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create property');
      }

      toast.success(locale === 'ar' ? 'تم إضافة العقار بنجاح' : 'Property created successfully!');
      router.push('/admin/properties');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Error creating property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/properties">
          <Button variant="outline" size="icon" className="border-slate-800 bg-slate-900 text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {locale === 'ar' ? 'إضافة إعلان عقاري جديد' : 'Add New Property Listing'}
          </h1>
          <p className="text-slate-400 text-sm">
            {locale === 'ar' ? 'أدخل تفاصيل العقار باللغتين العربية والإنجليزية.' : 'Enter property details in English and Arabic.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Titles */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Title (English)</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g. Luxury Villa in Hittin"
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Title (Arabic)</Label>
            <Input
              value={formData.titleAr}
              onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
              required
              dir="rtl"
              placeholder="مثال: فيلا فاخرة في حي حطين"
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Pricing, Purpose, Type */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Price (SAR)</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              placeholder="4500000"
              className="bg-slate-800/60 border-slate-700 text-white font-bold"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Purpose</Label>
            <Select
              value={formData.purpose}
              onValueChange={(val) => setFormData({ ...formData, purpose: val })}
            >
              <SelectTrigger className="bg-slate-800/60 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                <SelectItem value="Sale">For Sale</SelectItem>
                <SelectItem value="Rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Property Type</Label>
            <Select
              value={formData.type}
              onValueChange={(val) => setFormData({ ...formData, type: val })}
            >
              <SelectTrigger className="bg-slate-800/60 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Land">Land</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Shop">Shop</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">City (English)</Label>
            <Input
              value={formData.cityName}
              onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
              required
              placeholder="Riyadh"
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">City (Arabic)</Label>
            <Input
              value={formData.cityNameAr}
              onChange={(e) => setFormData({ ...formData, cityNameAr: e.target.value })}
              required
              dir="rtl"
              placeholder="الرياض"
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">District (English)</Label>
            <Input
              value={formData.districtName}
              onChange={(e) => setFormData({ ...formData, districtName: e.target.value })}
              required
              placeholder="Hittin"
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">District (Arabic)</Label>
            <Input
              value={formData.districtNameAr}
              onChange={(e) => setFormData({ ...formData, districtNameAr: e.target.value })}
              required
              dir="rtl"
              placeholder="حطين"
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Specs */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Bedrooms</Label>
            <Input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Bathrooms</Label>
            <Input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Area (m²)</Label>
            <Input
              type="number"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Dual Image Input */}
        <div className="space-y-4">
          <ImageUploader
            label={locale === 'ar' ? 'صورة الغلاف للعقار' : 'Property Cover Image'}
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />

          <div className="space-y-2">
            <Label className="text-slate-300">Featured on Homepage</Label>
            <Select
              value={formData.featured ? 'true' : 'false'}
              onValueChange={(v) => setFormData({ ...formData, featured: v === 'true' })}
            >
              <SelectTrigger className="bg-slate-800/60 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                <SelectItem value="true">Yes (Featured)</SelectItem>
                <SelectItem value="false">No (Standard)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Description (English)</Label>
            <Textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Description (Arabic)</Label>
            <Textarea
              rows={4}
              dir="rtl"
              value={formData.descriptionAr}
              onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Features (Comma-separated, English)</Label>
            <Input
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Pool, Garden, Smart Home"
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Features (Comma-separated, Arabic)</Label>
            <Input
              value={formData.featuresAr}
              onChange={(e) => setFormData({ ...formData, featuresAr: e.target.value })}
              dir="rtl"
              placeholder="مسبح, حديقة, منزل ذكي"
              className="bg-slate-800/60 border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 px-8 h-11 shadow-lg shadow-emerald-600/20"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : locale === 'ar' ? 'حفظ ونشر العقار' : 'Save & Publish Property'}
          </Button>
        </div>
      </form>
    </div>
  );
}
