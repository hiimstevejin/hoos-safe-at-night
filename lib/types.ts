export type Post = {
  post_id: string;
  uid: string;
  title: string;
  description: string;
  starting_position: { lat: number; long: number };
  destination: { lat: number; long: number };
  status: string;
  // status: "pending" | "confirmed" | "expired";
  created_at: string;
  profiles: {
    name: string;
  } | null;
};


export type Profile = {
  user_id: string;
  age: number;
  gender:string;
  is_verified: boolean;
  is_uva_student: boolean;
  name: string;
  created_at: string;
};