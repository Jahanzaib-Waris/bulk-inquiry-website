import { getSiteSettings } from "@/lib/site-settings";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar siteName={settings.site_name} />
      <main className="min-w-0 flex-1 px-6 py-8 sm:px-10">{children}</main>
    </div>
  );
}
