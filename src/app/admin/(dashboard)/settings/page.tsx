import { getSiteSettings } from "@/lib/site-settings";
import { supabaseServer } from "@/lib/supabase/server";
import { SiteNameForm } from "@/components/admin/SiteNameForm";
import { LogoUploadForm } from "@/components/admin/LogoUploadForm";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  const supabase = await supabaseServer();
  // getSession() reads the already-verified session from cookies with no
  // network round-trip — safe here since the proxy already called the
  // network-verified getUser() to gate this route before we ever render.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="max-w-2xl space-y-10">
      <h1 className="text-lg font-semibold text-slate-900">Settings</h1>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-medium text-slate-900">Branding</h2>
        <p className="mt-1 text-sm text-slate-500">
          Shown on the landing page and in the admin sidebar.
        </p>
        <div className="mt-5 space-y-6">
          <SiteNameForm initialName={settings.site_name} />
          <LogoUploadForm initialLogoUrl={settings.logo_url} />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="font-medium text-slate-900">Password</h2>
        <p className="mt-1 text-sm text-slate-500">Change the password for {session?.user.email}.</p>
        <div className="mt-5">
          <ChangePasswordForm email={session?.user.email ?? ""} />
        </div>
      </section>
    </div>
  );
}
