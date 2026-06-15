import { supabase } from "@/lib/supabase";

export async function getProfileByAddress(address: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("wallet_address", address)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 is Supabase's "No rows found" error
      console.error("Error fetching Supabase profile:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Failed to fetch database profile:", err);
    return null;
  }
}

export async function getAllProfiles() {
  try {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) {
      console.error("Error fetching all Supabase profiles:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Failed to fetch all database profiles:", err);
    return [];
  }
}