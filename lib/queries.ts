import { supabase } from './supabaseClient';

export async function getClients() {
  const { data, error } = await supabase.from('clients_ffs').select('*');
  if (error) throw error;
  return data;
}

export async function getTopMetrics(clientId: string, start: string, end: string) {
  const { data, error } = await supabase.rpc('get_top_metrics', {
    input_client_id: clientId,
    input_start_date: start,
    input_end_date: end,
  });
  if (error) throw error;
  return data?.[0];
}

export async function getHumanEngagementStats(clientId: string, start: string, end: string) {
  const { data, error } = await supabase.rpc('get_human_engagement_stats', {
    in_client_id: clientId,
    in_start: start,
    in_end: end,
  });
  if (error) throw error;
  return data?.[0];
}
