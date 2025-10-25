import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
// We do NOT import useProfile here

export default async function ProtectedPage() {
  const supabase = await createClient();

  // 1. Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // 3. Optional: Handle if the profile doesn't exist yet
  //    (e.g., if the user just signed up and the sync hasn't happened)
  if (profileError || !profile) {
    // You could redirect to a "create-profile" page,
    // or just use the default email.
    console.error("Profile not found or sync pending:", profileError?.message);
  }

  return (
    <div className="flex h-vh w-full items-center justify-center gap-2">
      {/* <h1>hi</h1>
      <h1>{profile.uid}</h1>
      <h1>{profile.name}</h1>
      <h1>{profile.gender}</h1>
      <h1>{profile.age}</h1>
      <h1>{profile.is_verified}</h1>
      <h1>{profile.is_uva_student}</h1>
      <h1>{profile.created_at}</h1> */}
    </div>
  );
}
