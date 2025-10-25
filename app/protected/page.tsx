import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
// import MapView from "@/components/MapView"; // <- 그냥 임포트 (MapView는 "use client")
import CreatePostWrapper from "@/components/create-post-wrapper";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="flex h-vh w-full items-center justify-center gap-2">
      <CreatePostWrapper profile={profile} />
      {/* <h1>hi</h1>
      <h1>{profile.uid}</h1>
      <h1>{profile.name}</h1>
      <h1>{profile.gender}</h1>
      <h1>{profile.age}</h1>
      <h1>{profile.is_verified}</h1>
      <h1>{profile.is_uva_student}</h1>
      <h1>{profile.created_at}</h1> */}
      {/* <MapView/> */}
    </div>
  );
}
