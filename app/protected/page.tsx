import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MapView from "@/components/MapView"; // <- 그냥 임포트 (MapView는 "use client")

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
    <div className="flex w-full flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border p-3">
        <span className="text-sm">hi</span>
        <span className="text-sm">{profile?.uid}</span>
        <span className="text-sm">{profile?.name}</span>
        <span className="text-sm">{profile?.gender}</span>
        <span className="text-sm">{profile?.age}</span>
        <span className="text-sm">{String(profile?.is_verified)}</span>
        <span className="text-sm">{String(profile?.is_uva_student)}</span>
        <span className="text-sm">{profile?.created_at}</span>
      </div>
      <MapView />
    </div>
  );
}
