
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
import { supabase } from '@/integrations/supabase/client';

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
    
    // Map the database fields to our application types
    const roomTypes: RoomType[] = roomTypesRes.data.map(rt => ({
      id: rt.id,
      name: rt.name,
      description: rt.description || undefined,
      created_at: rt.created_at
    }));
    
    const roomSizes: RoomSize[] = roomSizesRes.data.map(rs => ({
      id: rs.id,
      size: rs.size,
      room_type_id: rs.room_type_id,
      base_price: rs.base_price,
      created_at: rs.created_at
    }));
    
    // Updated to handle null values correctly for paint types
    const paintTypes: PaintType[] = paintTypesRes.data.map(pt => ({
      id: pt.id,
      name: pt.name,
      upcharge_percentage: pt.percentage_upcharge || 0, // If null, default to 0
      upcharge_amount: pt.fixed_upcharge || 0, // If null, default to 0
      description: pt.description || undefined,
      created_at: pt.created_at
    }));
    
    const roomAddons: RoomAddOn[] = roomAddonsRes.data.map(ra => ({
      id: ra.id,
      name: ra.name,
      cost: ra.value,
      cost_percentage: ra.addon_type === 'percentage' ? ra.value : undefined,
      description: ra.description || undefined,
      category: ra.addon_type,
      created_at: ra.created_at
    }));
    
    const volumeDiscounts: VolumeDiscount[] = volumeDiscountsRes.data.map(vd => ({
      id: vd.id,
      threshold: vd.threshold,
      discount_percentage: vd.discount_percentage,
      description: vd.has_extra ? 'Includes extras' : undefined,
      created_at: vd.created_at
    }));
    
    const specialConditions: SpecialCondition[] = specialConditionsRes.data.map(sc => ({
      id: sc.id,
      name: sc.name,
      discount_percentage: sc.discount_percentage,
      description: sc.description || undefined,
      created_at: sc.created_at
    }));
    
    const extras: Extra[] = extrasRes.data.map(ex => ({
      id: ex.id,
      name: ex.name,
      price: ex.unit_price || 0,
      price_unit: ex.price_type,
      description: ex.conditions,
      category: ex.category,
      created_at: ex.created_at
    }));
    
    return {
      roomTypes,
      roomSizes,
      paintTypes,
      roomAddons,
      volumeDiscounts,
      specialConditions,
      extras
    };
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    throw error;
  }
}

export async function saveEstimate(contactInfo: any, summary: EstimatorSummary) {
  try {
    console.log("Saving estimate with data:", { contactInfo, summary });
    
    // First create a project and get the project ID
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .insert({
        name: contactInfo.projectName,
        guest_email: contactInfo.email,
        description: `Paint project for ${contactInfo.address}`
      })
      .select()
      .single();
      
    if (projectError) {
      console.error("Error creating project:", projectError);
      throw projectError;
    }
    
    console.log("Project created successfully:", projectData);
    
    // Then save lead information with the project ID
    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .insert({
        name: contactInfo.fullName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        address: contactInfo.address,
        project_name: contactInfo.projectName,
        project_id: projectData.id,
        details: JSON.stringify(summary.rooms),
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (leadError) {
      console.error("Error saving lead:", leadError);
      throw leadError;
    }
    
    console.log("Lead saved successfully:", leadData);
    
    // Ensure we have valid labor_cost and material_cost - use default values if not specified
    const laborCost = summary.total * 0.7; // 70% of total as labor cost
    const materialCost = summary.total * 0.3; // 30% of total as material cost
    const estimatedHours = Math.ceil(summary.total / 75); // $75 per hour
    
    // Then save the estimate with the lead ID and project ID
    const { data: estimateData, error: estimateError } = await supabase
      .from("estimates")
      .insert({
        lead_id: leadData.id,
        project_id: projectData.id,
        project_name: contactInfo.projectName,
        details: JSON.stringify(summary),
        subtotal: summary.subtotal,
        discount: summary.volumeDiscount,
        total_cost: summary.total,
        labor_cost: laborCost,
        material_cost: materialCost,
        estimated_hours: estimatedHours,
        status: "pending",
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (estimateError) {
      console.error("Error saving estimate:", estimateError);
      throw estimateError;
    }
    
    console.log("Estimate saved successfully:", estimateData);
    
    return { leadData, estimateData, projectData };
  } catch (error) {
    console.error('Error saving estimate:', error);
    throw error;
  }
}

export async function sendEstimateEmail(estimateId: string, emailData: any) {
  try {
    const { data, error } = await supabase.functions.invoke('send-estimate', {
      body: {
        estimateId,
        emailData
      }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error sending estimate email:', error);
    throw error;
  }
}
