import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database.types";

type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

export async function savePost(postData: PostInsert) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error("Error creating post:", error);
      return { error, data: null };
    }
    return { error: null, data };
  } catch (err) {
    console.error("Exception when creating post:", err);
    return { error: err, data: null };
  }
}

export async function updatePost(postData: PostUpdate) {
  try {
    const { id, ...updatePayload } = postData;

    if (!id) {
      const errorMessage = "Cannot update post: ID is missing.";
      console.error(errorMessage);
      return { error: new Error(errorMessage), data: null };
    }

    const { data, error } = await supabase
      .from("posts")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating post:", error);
      return { error, data: null };
    }
    return { error: null, data };
  } catch (err) {
    console.error("Exception when updating post:", err);
    return { error: err, data: null };
  }
}

export async function deletePost(id: string, txid_deleted: string) {
  try {

    console.log({id, txid_deleted})

    const { data, error } = await supabase
      .from("posts")
      .update({ deleted: true, txid: txid_deleted })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error deleting post:", error);
      return { error, data: null };
    }
    return { error: null, data };
  } catch (err) {
    console.error("Exception when deleting post:", err);
    return { error: err, data: null };
  }
}

export async function getPosts(filters?: { city?: string; type?: 'REQUEST' | 'OFFER' }) {
  try {
    let query = supabase.from("posts").select("*").eq("deleted", false).order("created_at", { ascending: false });

    if (filters?.city) query = query.ilike("city", filters.city);
    if (filters?.type) query = query.eq("type", filters.type);

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception when fetching posts:", err);
    return [];
  }
}