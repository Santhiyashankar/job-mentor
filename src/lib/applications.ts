import { supabase } from "./supabase";

export type Application = {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  date_applied?: string;
  status: "Applied" | "Interview" | "Rejected" | "Offer"; 
   industry?: string; /// strict union
  notes?: string;
  created_at: string; // now exists for analytics & defaultValues
};


export const fetchApplications = async (user_id: string): Promise<Application[]> => {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user_id)   // filter by current user
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Application[];
};




export const addApplication = async (app: Partial<Application>) => {
  const { data, error } = await supabase.from("applications").insert([app]);
  if (error) throw error;
  return data;
};

export const updateApplication = async (
  id: string,
  app: Partial<Application>
) => {
  const { data, error } = await supabase
    .from("applications")
    .update(app)
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const deleteApplication = async (id: string) => {
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) throw error;
  return true;
};
