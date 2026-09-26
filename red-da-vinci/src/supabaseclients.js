import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vcndijfdyhhdoaatsmzb.supabase.co';
const supabaseAnonKey = 'sb_publishable_baT3iYXct8uuiPCXwlrwVg_y7kQ4dHf';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
