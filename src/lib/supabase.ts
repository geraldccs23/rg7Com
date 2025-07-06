import { createClient } from '@supabase/supabase-js';
import { SalesRecord } from '../types/sales';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are properly set in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function insertSalesRecords(records: SalesRecord[]): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('sales_records')
      .insert(records);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error connecting to database' };
  }
}

export async function fetchSalesRecords(): Promise<SalesRecord[]> {
  try {
    const { data, error } = await supabase
      .from('sales_records')
      .select('*')
      .order('fec_emis', { ascending: false });
    
    if (error) {
      console.error('Error fetching sales records:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error connecting to database:', error);
    return [];
  }
}

export async function deleteSalesRecords(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('sales_records')
      .delete()
      .neq('id', '');
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error connecting to database' };
  }
}