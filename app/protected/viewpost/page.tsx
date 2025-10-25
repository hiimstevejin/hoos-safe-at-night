import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostDashboard from "@/components/dashboard/post-dashboard";

const MOCK_CHARLOTTESVILLE_POSTS = [
  {
    post_id: "post_uva1",
    uid: "user_a",
    title: "Walk from Rice Hall to Alderman Library",
    description: "Need to return a book!",
    starting_position: { lat: 38.0305, long: -78.5135 }, // Rice Hall
    destination: { lat: 38.0336, long: -78.5042 }, // Alderman Library
    status: "pending",
    created_at: new Date().toISOString(),
  },
  {
    post_id: "post_uva2",
    uid: "user_b",
    title: "Grocery run from Barracks Road Shopping Center",
    description: "Heading to Ohill after shopping.",
    starting_position: { lat: 38.0538, long: -78.4952 }, // Barracks Road Shopping Center
    destination: { lat: 38.0305, long: -78.5085 }, // O-Hill Dining Hall
    status: "pending",
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    post_id: "post_uva3",
    uid: "user_c",
    title: "From Downtown Mall to Amtrak Station",
    description: "Catching a train!",
    starting_position: { lat: 38.0292, long: -78.4795 }, // Downtown Mall (near Paramount Theater)
    destination: { lat: 38.0295, long: -78.4876 }, // Amtrak Station (Main Street Station)
    status: "pending",
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    post_id: "post_uva4",
    uid: "user_d",
    title: "Walk around UVA Grounds (The Lawn)",
    description: "Just a scenic walk starting from the Rotunda.",
    starting_position: { lat: 38.0357, long: -78.5034 }, // The Rotunda
    destination: { lat: 38.0336, long: -78.5028 }, // South end of the Lawn
    status: "pending",
    created_at: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
  },
  {
    post_id: "post_uva5",
    uid: "user_e",
    title: "To John Paul Jones Arena for a game",
    description: "Coming from Memorial Gymnasium.",
    starting_position: { lat: 38.0322, long: -78.5071 }, // Memorial Gymnasium
    destination: { lat: 38.0505, long: -78.4891 }, // John Paul Jones Arena
    status: "pending",
    created_at: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
  },
];

export default async function ViewPost() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles!uid ( name )
    `
    )
    .eq("status", "pending");
  const validPosts = posts || [];

  return (
    <div className="flex h-vh w-full items-center justify-center">
      {/* <div className="h-full w-full bg-red-400"></div> */}
      <PostDashboard posts={MOCK_CHARLOTTESVILLE_POSTS} />
    </div>
  );
}
