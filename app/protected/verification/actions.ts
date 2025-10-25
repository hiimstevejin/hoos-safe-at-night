"use server";

import { createClient } from "@/lib/supabase/server";

// This is the function you will import and call
export async function verifyUvaStudent() {
  const supabase = createClient();

  // 1. Get the user on the server
  const {
    data: { user },
    error: authError,
  } = await (await supabase).auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in to verify.");
  }

  // 3. This is the data to upload
  console.log(user.id);
  const updateData = {
    is_verified: true,
    is_uva_student: true,
  };

  // 4. Perform the upsert
  const { error: updateError } = await (await supabase)
    .from("profiles")
    .update(updateData)
    .eq("user_id", user.id); // Find the row where user_id matches

  if (updateError) {
    console.error("Supabase upsert error:", updateError);
    throw new Error(updateError.message);
  }

  // 5. Return a success message
  return { message: "Verification Successful!" };
}
