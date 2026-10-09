
import { supabase } from "./supabase";

export async function awardConstellationStars(completedMinutes) {
  const { data: authData, error: authError } =
    await supabase.auth.getUser();

  if (authError || !authData.user) {
    throw new Error("Sign in to save constellation progress.");
  }

  const minutes = Math.floor(completedMinutes);

  if (!Number.isFinite(minutes) || minutes < 10) {
    throw new Error("At least 10 completed minutes are required.");
  }

  const { data, error } = await supabase.rpc(
    "award_constellation_stars",
    { p_minutes: minutes }
  );

  if (error) throw error;

  return data;
}