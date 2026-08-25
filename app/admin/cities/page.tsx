'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plus, Save, Edit, Trash2, X, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUploader } from '@/components/image-uploader';
import { useLocale } from '@/components/locale-provider';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';

interface District {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
}

interface City {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  region: string;
  regionAr: string;
  image: string;
  latitude: number;
  longitude: number;
  popularDistricts: District[];
  _count: { properties: number };
}

export default function AdminCitiesPage() {
  const { locale } = useLocale();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [addingDistrictCityId, setAddingDistrictCityId] = useState<string | null>(null);

  // New City state
  const [cityForm, setCityForm] = useState({
    name: '',
    nameAr: '',
    region: '',
    regionAr: '',
    image: 'https://images.pexels.com/photos/38096888/pexels-photo-38096888.jpeg?auto=compress&cs=tinysrgb&w=800',
    latitude: '24.7136',
    longitude: '46.6753',
  });

  // District state
  const [districtForm, setDistrictForm] = useState({
    name: '',
    nameAr: '',
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cities');
      if (res.ok) setCities(await res.json());
    } catch {
      toast.error('Failed to load cities');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cityForm),
      });

      if (!res.ok) throw new Error('Failed to create city');

      toast.success(locale === 'ar' ? 'تم إضافة المدينة بنجاح' : 'City added successfully!');
      setShowAddModal(false);
      resetCityForm();
      fetchCities();
    } catch (err: any) {
      toast.error(err.message || 'Error creating city');
    }
  };

  const handleUpdateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCity) return;

    try {
      const res = await fetch(`/api/admin/cities/${editingCity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cityForm),
      });

      if (!res.ok) throw new Error('Failed to update city');

      toast.success(locale === 'ar' ? 'تم تحديث البيانات بنجاح' : 'City updated successfully!');
      setEditingCity(null);
      resetCityForm();
      fetchCities();
    } catch (err: any) {
      toast.error(err.message || 'Error updating city');
    }
  };

  const handleDeleteCity = async (id: string, name: string) => {
    if (!confirm(locale === 'ar' ? `هل أنت تأكد من حذف مدينة ${name}؟` : `Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/cities/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(locale === 'ar' ? 'تم حذف المدينة' : 'City deleted successfully');
        setCities((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error('Failed to delete city');
      }
    } catch {
      toast.error('Error deleting city');
    }
  };

  const handleAddDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingDistrictCityId) return;

    try {
      const res = await fetch('/api/admin/districts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId: addingDistrictCityId,
          ...districtForm,
        }),
      });

      if (!res.ok) throw new Error('Failed to add district');

      toast.success(locale === 'ar' ? 'تم إضافة الحي بنجاح' : 'District added successfully!');
      setAddingDistrictCityId(null);
      setDistrictForm({ name: '', nameAr: '' });
      fetchCities();
    } catch (err: any) {
      toast.error(err.message || 'Error adding district');
    }
  };

  const handleDeleteDistrict = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/districts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(locale === 'ar' ? 'تم حذف الحي' : 'District removed');
        fetchCities();
      }
    } catch {
      toast.error('Failed to remove district');
    }
  };

  const startEditCity = (city: City) => {
    setEditingCity(city);
    setCityForm({
      name: city.name,
      nameAr: city.nameAr,
      region: city.region,
      regionAr: city.regionAr,
      image: city.image,
      latitude: String(city.latitude),
      longitude: String(city.longitude),
    });
  };

  const resetCityForm = () => {
    setCityForm({
      name: '',
      nameAr: '',
      region: '',
      regionAr: '',
      image: 'https://images.pexels.com/photos/38096888/pexels-photo-38096888.jpeg?auto=compress&cs=tinysrgb&w=800',
      latitude: '24.7136',
      longitude: '46.6753',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t(locale, 'adminCities')}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {locale === 'ar'
              ? 'إدارة المدن السعودية والأحياء المرتبطة بها (إضافة، تعديل، حذف).'
              : 'Manage Saudi Arabian cities and neighborhoods (Add, Edit, Delete).'}
          </p>
        </div>
        <Button
          onClick={() => {
            resetCityForm();
            setEditingCity(null);
            setShowAddModal(!showAddModal);
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 shadow-lg shadow-emerald-600/20"
        >
          <Plus className="h-4 w-4" /> {t(locale, 'addNewCity')}
        </Button>
      </div>

      {/* Add / Edit City Modal Form */}
      {(showAddModal || editingCity) && (
        <form
          onSubmit={editingCity ? handleUpdateCity : handleCreateCity}
          className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-400" />
              {editingCity
                ? locale === 'ar'
                  ? `تعديل بيانات مدينة (${editingCity.name})`
                  : `Edit City (${editingCity.name})`
                : t(locale, 'addNewCity')}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setEditingCity(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">City Name (English)</Label>
              <Input
                value={cityForm.name}
                onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                required
                placeholder="e.g. Riyadh"
                className="bg-slate-800/60 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">City Name (Arabic)</Label>
              <Input
                value={cityForm.nameAr}
                onChange={(e) => setCityForm({ ...cityForm, nameAr: e.target.value })}
                required
                dir="rtl"
                placeholder="مثال: الرياض"
                className="bg-slate-800/60 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Region (English)</Label>
              <Input
                value={cityForm.region}
                onChange={(e) => setCityForm({ ...cityForm, region: e.target.value })}
                placeholder="e.g. Riyadh Province"
                className="bg-slate-800/60 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Region (Arabic)</Label>
              <Input
                value={cityForm.regionAr}
                onChange={(e) => setCityForm({ ...cityForm, regionAr: e.target.value })}
                dir="rtl"
                placeholder="مثال: منطقة الرياض"
                className="bg-slate-800/60 border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Dual Image Input Component */}
          <ImageUploader
            label={locale === 'ar' ? 'صورة الغلاف للمدينة' : 'City Cover Image'}
            value={cityForm.image}
            onChange={(url) => setCityForm({ ...cityForm, image: url })}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAddModal(false);
                setEditingCity(null);
              }}
              className="text-slate-400 hover:text-white"
            >
              {locale === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
              <Save className="h-4 w-4" /> {locale === 'ar' ? 'حفظ البيانات' : 'Save City'}
            </Button>
          </div>
        </form>
      )}

      {/* Add District Inline Dialog */}
      {addingDistrictCityId && (
        <form
          onSubmit={handleAddDistrict}
          className="bg-slate-900 border border-blue-500/40 rounded-2xl p-4 space-y-3 shadow-xl animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm">
              {locale === 'ar' ? 'إضافة حي جديد للمدينة' : 'Add New District to City'}
            </h4>
            <button
              type="button"
              onClick={() => setAddingDistrictCityId(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              placeholder="District Name (EN) e.g. An Nakheel"
              value={districtForm.name}
              onChange={(e) => setDistrictForm({ ...districtForm, name: e.target.value })}
              required
              className="bg-slate-800/60 border-slate-700 text-white text-xs"
            />
            <Input
              placeholder="اسم الحي (عربي) مثال: النخيل"
              value={districtForm.nameAr}
              onChange={(e) => setDistrictForm({ ...districtForm, nameAr: e.target.value })}
              required
              dir="rtl"
              className="bg-slate-800/60 border-slate-700 text-white text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAddingDistrictCityId(null)}
              className="text-xs text-slate-400"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1">
              <Plus className="h-3.5 w-3.5" /> Add District
            </Button>
          </div>
        </form>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400">Loading cities...</div>
        ) : cities.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400">No cities added yet.</div>
        ) : (
          cities.map((city) => (
            <div
              key={city.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group"
            >
              {/* Image header with quick actions */}
              <div className="h-40 relative overflow-hidden bg-slate-800">
                <img src={city.image} alt={city.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 flex items-center gap-1 bg-slate-950/70 backdrop-blur-md p-1 rounded-xl border border-slate-700/60">
                  <button
                    onClick={() => startEditCity(city)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    title={locale === 'ar' ? 'تعديل المدينة' : 'Edit City'}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCity(city.id, city.name)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title={locale === 'ar' ? 'حذف المدينة' : 'Delete City'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {city.name} ({city.nameAr})
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-emerald-400" />{' '}
                      {locale === 'ar' ? city.regionAr : city.region}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    {city._count?.properties || 0} {locale === 'ar' ? 'عقار' : 'Listings'}
                  </span>
                </div>
              </div>

              {/* Districts Section */}
              <div className="p-4 flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {locale === 'ar' ? 'الأحياء الشهيرة' : 'Popular Districts'} ({city.popularDistricts?.length || 0})
                  </p>
                  <button
                    onClick={() => setAddingDistrictCityId(city.id)}
                    className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1 font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" /> {locale === 'ar' ? 'إضافة حي' : 'Add District'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {city.popularDistricts?.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No districts added.</span>
                  ) : (
                    city.popularDistricts?.map((d) => (
                      <span
                        key={d.id}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs border border-slate-700/60 flex items-center gap-1.5"
                      >
                        <span>{d.name} ({d.nameAr})</span>
                        <button
                          onClick={() => handleDeleteDistrict(d.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                          title="Remove district"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
