import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database.types"; // Adjust path if your types are located elsewhere

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export async function getProfileByAddress(address: string): Promise<ProfileRow | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("wallet_address", address.toLowerCase())
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

export async function getAllProfiles(): Promise<any[]> {
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

export async function saveProfile(profileData: ProfileInsert): Promise<void> {
  try {
    const { error } = await supabase.from("profiles").insert(profileData);
    if (error) {
      console.error("Error saving profile to Supabase:", error);
    }
  } catch (err) {
    console.error("Exception when saving profile:", err);
  }
}

export async function updateProfile(address: string, profileData: ProfileUpdate): Promise<void> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        name: profileData.name,
        city: profileData.city,
        country: profileData.country,
        bio: profileData.bio,
        guide: profileData.guide
      })
      .eq("wallet_address", address.toLowerCase())
    if (error) {
      console.error("Error updating profile in Supabase:", error);
    }
  } catch (err) {
    console.error("Exception when updating profile:", err);
  }
}