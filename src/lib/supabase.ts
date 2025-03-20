
import { createClient } from '@supabase/supabase-js';
import { 
  EstimatorSummary, 
  RoomDetail, 
  PricingData,
  RoomType, 
  RoomSize, 
  PaintType, 
  RoomAddOn, 
  VolumeDiscount,
  SpecialCondition,
  Extra
} from '@/types/estimator';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchPricingData(): Promise<PricingData> {
  try {
    const [
      roomTypesRes,
      roomSizesRes,
      roomAddonsRes,
      paintTypesRes,
      volumeDiscountsRes,
      specialConditionsRes,
      extrasRes
    ] = await Promise.all([
      supabase.from('room_types').select('*'),
      supabase.from('room_sizes').select('*'),
      supabase.from('room_addons').select('*'),
      supabase.from('paint_types').select('*'),
      supabase.from('volume_discounts').select('*').order('threshold', { ascending: true }),
      supabase.from('special_conditions').select('*'),
      supabase.from('extras').select('*')
    ]);
    
    // Check for errors
    if (roomTypesRes.error) throw new Error(`Room types error: ${roomTypesRes.error.message}`);
    if (roomSizesRes.error) throw new Error(`Room sizes error: ${roomSizesRes.error.message}`);
    if (roomAddonsRes.error) throw new Error(`Room addons error: ${roomAddonsRes.error.message}`);
    if (paintTypesRes.error) throw new Error(`Paint types error: ${paintTypesRes.error.message}`);
    if (volumeDiscountsRes.error) throw new Error(`Volume discounts error: ${volumeDiscountsRes.error.message}`);
    if (specialConditionsRes.error) throw new Error(`Special conditions error: ${specialConditionsRes.error.message}`);
    if (extrasRes.error) throw new Error(`Extras error: ${extrasRes.error.message}`);
    
    return {
      roomTypes: roomTypesRes.data as RoomType[],
      roomSizes: roomSizesRes.data as RoomSize[],
      roomAddons: roomAddonsRes.data as RoomAddOn[],
      paintTypes: paintTypesRes.data as PaintType[],
      volumeDiscounts: volumeDiscountsRes.data as VolumeDiscount[],
      specialConditions: specialConditionsRes.data as SpecialCondition[],
      extras: extrasRes.data as Extra[]
    };
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    throw error;
  }
}

export async function saveEstimate(contactInfo: any, summary: EstimatorSummary) {
  try {
    // First save lead information
    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .insert([{
        name: contactInfo.fullName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        address: contactInfo.address,
        project_name: contactInfo.projectName,
        created_at: new Date()
      }])
      .select()
      .single();
      
    if (leadError) throw leadError;
    
    // Then save the estimate
    const { data: estimateData, error: estimateError } = await supabase
      .from("estimates")
      .insert({
        lead_id: leadData.id,
        project_name: contactInfo.projectName,
        details: summary.rooms,
        subtotal: summary.subtotal,
        volume_discount: summary.volumeDiscount,
        total_cost: summary.total,
        status: "pending",
        created_at: new Date()
      })
      .select()
      .single();
      
    if (estimateError) throw estimateError;
    
    return { leadData, estimateData };
  } catch (error) {
    console.error('Error saving estimate:', error);
    throw error;
  }
}
