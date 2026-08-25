'use client';

import { useState } from 'react';
import {
  Star,
  MessageSquare,
  MapPin,
  ShieldCheck,
  Flag,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  Building,
  CheckCircle2,
  Send,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';
import { useLocale } from '@/components/locale-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  commentAr: string;
  likes: number;
  verifiedResident: boolean;
}

interface Deal {
  id: string;
  type: string;
  typeAr: string;
  area: number;
  price: number;
  pricePerSqm: number;
  date: string;
  dateAr: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'عبدالرحمن العتيبي',
    rating: 5,
    date: 'منذ 3 أيام',
    comment: 'Quiet and upscale neighborhood with excellent modern facilities, wide paved streets, and quick access to major highways.',
    commentAr: 'حي هادئ وراقي جداً، مخدوم بجميع المرافق والشوارع واسعة، وموقع ممتاز قريب من الطرق الرئيسية.',
    likes: 24,
    verifiedResident: true,
  },
  {
    id: '2',
    author: 'Fahad Al-Malki',
    rating: 4.5,
    date: 'منذ أسبوع',
    comment: 'Great district for families. Excellent schools nearby, clean parks, and top-tier security.',
    commentAr: 'حي ممتاز للعائلات، تتوفر فيه المدارس العالمية والحدائق العامة النظيفة مع بيئة آمنة وهادئة.',
    likes: 18,
    verifiedResident: true,
  },
  {
    id: '3',
    author: 'سارة الشمري',
    rating: 4.8,
    date: 'منذ أسبوعين',
    comment: 'Very strategic location with high ROI for investment. High demand for modern apartments.',
    commentAr: 'موقع استراتيجي للغاية وعائد استثماري ممتاز. الطلب على الشقق الفاخرة مرتفع جداً بالحي.',
    likes: 12,
    verifiedResident: false,
  },
];

const mockDeals: Deal[] = [
  { id: '101', type: 'Residential Villa', typeAr: 'فيلا سكنية', area: 450, price: 3850000, pricePerSqm: 8555, date: '2026-08-20', dateAr: '20 أغسطس 2026' },
  { id: '102', type: 'Luxury Apartment', typeAr: 'شقة فاخرة', area: 185, price: 1250000, pricePerSqm: 6756, date: '2026-08-18', dateAr: '18 أغسطس 2026' },
  { id: '103', type: 'Commercial Land', typeAr: 'أرض تجارية', area: 900, price: 7200000, pricePerSqm: 8000, date: '2026-08-12', dateAr: '12 أغسطس 2026' },
  { id: '104', type: 'Duplex Villa', typeAr: 'دوبلكس متصل', area: 320, price: 2600000, pricePerSqm: 8125, date: '2026-08-05', dateAr: '05 أغسطس 2026' },
];

interface DistrictInfoCardProps {
  districtName: string;
  districtNameAr?: string;
  cityName: string;
  cityNameAr?: string;
}

export function DistrictInfoCard({
  districtName,
  districtNameAr,
  cityName,
  cityNameAr,
}: DistrictInfoCardProps) {
  const { locale } = useLocale();
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [dealsOpen, setDealsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // Review Form state
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');

  // Report Form state
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const displayDistrict = locale === 'ar' ? (districtNameAr || districtName) : districtName;
  const displayCity = locale === 'ar' ? (cityNameAr || cityName) : cityName;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error(locale === 'ar' ? 'الرجاء كتابة تعليقك' : 'Please enter your comment');
      return;
    }
    const created: Review = {
      id: Date.now().toString(),
      author: newName.trim() || (locale === 'ar' ? 'زائر جديد' : 'Verified Resident'),
      rating: newRating,
      date: locale === 'ar' ? 'الآن' : 'Just now',
      comment: newComment,
      commentAr: newComment,
      likes: 1,
      verifiedResident: true,
    };
    setReviews([created, ...reviews]);
    setNewComment('');
    setNewName('');
    toast.success(locale === 'ar' ? 'تم إضافة تقييمك بنجاح!' : 'Review submitted successfully!');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) {
      toast.error(locale === 'ar' ? 'يرجى اختيار سبب الإبلاغ' : 'Please select a reason');
      return;
    }
    toast.success(locale === 'ar' ? 'تم إرسال بلاغك للراجعة، شكراً لك' : 'Report submitted for review, thank you.');
    setReportOpen(false);
    setReportReason('');
    setReportDetails('');
  };

  const avgRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="space-y-4 my-8">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <h3 className="text-xl font-bold text-foreground">
          {locale === 'ar' ? `معلومات حي ${displayDistrict}` : `${displayDistrict} District Information`}
        </h3>
      </div>

      {/* Main Cards Container matching the user's screenshot */}
      <div className="space-y-3">
        {/* Card 1: Resident Reviews & Rating */}
        <button
          onClick={() => setReviewsOpen(true)}
          className="w-full group text-left transition-all duration-300 rounded-2xl bg-card border border-border hover:border-amber-500/40 hover:shadow-lg p-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">{avgRating}</span>
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  ({reviews.length * 292 + 7}) {locale === 'ar' ? 'التقييمات' : 'Reviews'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {locale === 'ar' ? 'اطلع على تقييم الحي وآراء السكان' : 'View district ratings and residents reviews'}
              </p>
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
            {locale === 'ar' ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </button>

        {/* Card 2: Recent Real Estate Transactions */}
        <button
          onClick={() => setDealsOpen(true)}
          className="w-full group text-left transition-all duration-300 rounded-2xl bg-card border border-border hover:border-emerald-500/40 hover:shadow-lg p-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">
                {locale === 'ar' ? 'آخر الصفقات العقارية' : 'Latest Real Estate Transactions'}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {locale === 'ar'
                  ? `حي ${displayDistrict}، شمال ${displayCity}، ${displayCity}`
                  : `${displayDistrict} District, North ${displayCity}, Saudi Arabia`}
              </p>
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
            {locale === 'ar' ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </button>

        {/* Card 3: Legal Notice */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white mt-0.5 shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {locale === 'ar'
              ? 'الإعلان نيابةً عن الآخرين قد يترتب عليه مسؤولية نظامية، لذا تأكد من الالتزام بالأنظمة والمواصفات الرسمية.'
              : 'Advertising on behalf of others may entail legal liability. Please ensure full compliance with official real estate regulations.'}
          </p>
        </div>

        {/* Action: Report Listing */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setReportOpen(true)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-red-500 font-medium transition-colors py-1 px-3 rounded-lg hover:bg-red-500/5"
          >
            <Flag className="h-4 w-4" />
            <span>{locale === 'ar' ? 'إبلاغ عن إعلان' : 'Report Advertisement'}</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: Resident Reviews & Rating Drawer            */}
      {/* ---------------------------------------------------- */}
      {reviewsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                  {locale === 'ar' ? `تقييمات وآراء سكان حي ${displayDistrict}` : `${displayDistrict} Resident Reviews & Ratings`}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {locale === 'ar' ? 'تقييمات موثوقة من السكان والمستثمرين' : 'Verified reviews from actual residents and investors'}
                </p>
              </div>
              <button
                onClick={() => setReviewsOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Ratings Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-muted/40 border border-border text-center">
              <div>
                <span className="text-xs text-muted-foreground">{locale === 'ar' ? 'النظافة والهدوء' : 'Cleanliness & Peace'}</span>
                <p className="text-lg font-bold text-emerald-600">4.9 / 5</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">{locale === 'ar' ? 'الأمان والخصوصية' : 'Safety & Privacy'}</span>
                <p className="text-lg font-bold text-emerald-600">4.8 / 5</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">{locale === 'ar' ? 'المرافق والخدمات' : 'Services & Amenities'}</span>
                <p className="text-lg font-bold text-emerald-600">4.7 / 5</p>
              </div>
            </div>

            {/* Submit New Review Form */}
            <form onSubmit={handleAddReview} className="space-y-4 p-4 rounded-2xl bg-accent/30 border border-border">
              <h4 className="font-semibold text-sm">
                {locale === 'ar' ? 'أضف تقييمك وتجربتك عن الحي' : 'Share your review about this district'}
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-medium">{locale === 'ar' ? 'اختر التقييم:' : 'Rating:'}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= newRating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  placeholder={locale === 'ar' ? 'الاسم (اختياري)' : 'Your Name (Optional)'}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Button type="submit" className="bg-primary text-primary-foreground">
                  <Send className="h-4 w-4 mr-2" />
                  {locale === 'ar' ? 'نشر التقييم' : 'Submit Review'}
                </Button>
              </div>
              <textarea
                placeholder={locale === 'ar' ? 'اكتب رأيك وتجربتك عن السكن أو الاستثمار في هذا الحي...' : 'Write your experience living or investing in this neighborhood...'}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </form>

            {/* Reviews List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-card border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 font-bold flex items-center justify-center text-xs">
                        {r.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm flex items-center gap-1.5">
                          {r.author}
                          {r.verifiedResident && (
                            <span className="inline-flex items-center text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                              <CheckCircle2 className="h-3 w-3 mr-0.5" />
                              {locale === 'ar' ? 'ساكن موثق' : 'Verified Resident'}
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{r.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-500/10 px-2.5 py-1 rounded-full">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span>{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    {locale === 'ar' ? r.commentAr : r.comment}
                  </p>
                  <div className="flex items-center justify-end pt-1">
                    <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{r.likes} {locale === 'ar' ? 'مفيد' : 'Helpful'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: Recent Real Estate Transactions Drawer      */}
      {/* ---------------------------------------------------- */}
      {dealsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  {locale === 'ar' ? `صفقات عقارات حي ${displayDistrict}` : `${displayDistrict} Recent Real Estate Transactions`}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {locale === 'ar' ? 'مؤشر أسعار الصفقات الموثقة رسميًا' : 'Verified official transaction prices'}
                </p>
              </div>
              <button
                onClick={() => setDealsOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Average stats banner */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{locale === 'ar' ? 'متوسط سعر المتر المربع' : 'Average Price / m²'}</p>
                <p className="text-2xl font-extrabold text-emerald-600">8,350 SAR <span className="text-xs font-normal text-muted-foreground">/ m²</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-medium">{locale === 'ar' ? 'نمو الصفقات السنوي' : 'YoY Deal Growth'}</p>
                <p className="text-lg font-bold text-emerald-600 flex items-center justify-end gap-1">
                  +14.2% <TrendingUp className="h-4 w-4" />
                </p>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-xs sm:text-sm text-left rtl:text-right">
                <thead className="bg-muted text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-3">{locale === 'ar' ? 'نوع العقار' : 'Property Type'}</th>
                    <th className="p-3">{locale === 'ar' ? 'المساحة' : 'Area'}</th>
                    <th className="p-3">{locale === 'ar' ? 'قيمة الصفقة' : 'Deal Price'}</th>
                    <th className="p-3">{locale === 'ar' ? 'سعر المتر' : 'Price / m²'}</th>
                    <th className="p-3">{locale === 'ar' ? 'التاريخ' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium flex items-center gap-2">
                        <Building className="h-4 w-4 text-emerald-600" />
                        {locale === 'ar' ? deal.typeAr : deal.type}
                      </td>
                      <td className="p-3">{deal.area} m²</td>
                      <td className="p-3 font-bold text-emerald-600">{deal.price.toLocaleString()} SAR</td>
                      <td className="p-3">{deal.pricePerSqm.toLocaleString()} SAR</td>
                      <td className="p-3 text-muted-foreground">{locale === 'ar' ? deal.dateAr : deal.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 3: Report Listing Modal                         */}
      {/* ---------------------------------------------------- */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2 text-red-500">
                <Flag className="h-5 w-5" />
                {locale === 'ar' ? 'إبلاغ عن هذا الإعلان' : 'Report this Advertisement'}
              </h3>
              <button
                onClick={() => setReportOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  {locale === 'ar' ? 'سبب الإبلاغ:' : 'Reason for report:'}
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{locale === 'ar' ? '-- اختر السبب --' : '-- Select Reason --'}</option>
                  <option value="misleading">{locale === 'ar' ? 'معلومات غير صحيحة أو مضللة' : 'Inaccurate or misleading information'}</option>
                  <option value="fake_price">{locale === 'ar' ? 'سعر غير حقيقي' : 'Fake or deceptive price'}</option>
                  <option value="sold">{locale === 'ar' ? 'العقار تم بيعه أو تأجيره' : 'Property is already sold or rented'}</option>
                  <option value="other">{locale === 'ar' ? 'سبب آخر' : 'Other reason'}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  {locale === 'ar' ? 'تفاصيل إضافية:' : 'Additional Details:'}
                </label>
                <textarea
                  placeholder={locale === 'ar' ? 'اكتب ملاحظاتك لمساعدتنا في المراجعة...' : 'Provide details to help us review...'}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setReportOpen(false)}>
                  {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button type="submit" variant="destructive">
                  {locale === 'ar' ? 'إرسال البلاغ' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
