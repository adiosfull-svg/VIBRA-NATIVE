import { supabase } from './supabase';
import { createEntities } from './entityAdapter.ts';

export type { Entity } from './entityAdapter.ts';
export const entities = createEntities(supabase);
