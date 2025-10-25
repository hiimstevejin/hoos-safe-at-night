import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard",
  referrer: "no-referrer" as const,
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. AUTHENTICATION CHECK
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // If the user is NOT authenticated, redirect to the public login page.
  if (!user) {
    return redirect(`/login?next=${encodeURIComponent("/auth/login")}`);
  }

  // Query the 'profiles' table using the authenticated user's ID.
  let { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    // 1. Check if the email ends with the desired domain
    const isUvaEmail = user.email?.endsWith("@virginia.edu") || false;

    // 2. Prepare the new profile data
    const newProfileData = {
      user_id: user.id, // Link to the auth.users table
      email: user.email,
      name: user.user_metadata?.name || "New User", // Get name from provider (Google, etc.)

      // Your custom logic:
      is_uva_student: isUvaEmail,
      is_verified: isUvaEmail,
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(newProfileData, { onConflict: "user_id" });

    if (error) {
      console.error("Failed to upsert profile:", error);
      throw new Error(error.message);
    }
    profile = newProfileData;
  }

  const userData = {
    name: user.user_metadata.name || "User",
    email: user.email || "No Email",
    avatar: user.user_metadata.avatar_url || "/default-avatar.png", // Fallback avatar TODO
  };

  // If the user is logged in AND has a profile, render the protected content.
  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
