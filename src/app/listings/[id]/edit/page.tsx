import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getListingById } from "@/lib/listings";
import { breadcrumbLink } from "@/lib/uiStyles";
import { auth } from "@/auth";
import { EditListingForm } from "@/components/EditListingForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListingById(id);
  
  if (!listing) {
    notFound();
  }

  const session = await auth();
  const isOwner = session?.user?.email === listing.publisherEmail;

  // רק בעל המודעה יכול לערוך
  if (!isOwner) {
    redirect(`/listings/${id}`);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
        <Link href="/" className={breadcrumbLink}>דף הבית</Link>
        <ArrowRight className="h-3 w-3" />
        <Link href="/listings" className={breadcrumbLink}>מודעות</Link>
        <ArrowRight className="h-3 w-3" />
        <Link href={`/listings/${id}`} className={breadcrumbLink}>{listing.title}</Link>
        <ArrowRight className="h-3 w-3" />
        <span>עריכה</span>
      </div>

      {/* כותרת */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
          עריכת מודעה
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          ערוך את פרטי המודעה שלך
        </p>
      </div>

      {/* טופס עריכה */}
      <EditListingForm listing={listing} />
    </div>
  );
}