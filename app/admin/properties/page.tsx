'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/i18n';

interface Property {
  id: number;
  title: string;
  titleAr: string;
  price: number;
  type: string;
  purpose: string;
  cityName: string;
  districtName: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  featured: boolean;
  createdAt: string;
  image: string;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [purpose, setPurpose] = useState('all');
  const [type, setType] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, [search, purpose, type]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (purpose !== 'all') params.set('purpose', purpose);
      if (type !== 'all') params.set('type', type);

      const res = await fetch(`/api/admin/properties?${params.toString()}`);
      if (res.ok) {
        setProperties(await res.json());
      }
    } catch (e) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property listing?')) return;

    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Property deleted successfully');
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error('Failed to delete property');
      }
    } catch {
      toast.error('Error deleting property');
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (res.ok) {
        toast.success('Featured status updated');
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, featured: !currentFeatured } : p))
        );
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Property Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage all real estate listings on NFT KSA.</p>
        </div>
        <Link href="/admin/properties/new">
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 shadow-lg shadow-emerald-600/20">
            <Plus className="h-4 w-4" /> Add New Property
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search by title, city, district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <Select value={purpose} onValueChange={setPurpose}>
            <SelectTrigger className="bg-slate-800/60 border-slate-700 text-white">
              <SelectValue placeholder="All Purposes" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="all">All (Sale & Rent)</SelectItem>
              <SelectItem value="Sale">For Sale</SelectItem>
              <SelectItem value="Rent">For Rent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-slate-800/60 border-slate-700 text-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Land">Land</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading listings...</div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No properties match your filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Property</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.image}
                          alt={prop.title}
                          className="h-12 w-12 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-white line-clamp-1 max-w-xs">{prop.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{prop.titleAr}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{prop.districtName}, {prop.cityName}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">
                      {formatPrice(prop.price, 'en', prop.purpose as any)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${prop.purpose === 'Sale'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                      >
                        {prop.purpose}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-300">{prop.type}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(prop.id, prop.featured)}
                        className={`p-1.5 rounded-lg border transition-all ${prop.featured
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                          }`}
                        title="Toggle Featured"
                      >
                        <Star className={`h-4 w-4 ${prop.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <Link href={`/properties/${prop.id}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/properties/${prop.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-400">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(prop.id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
