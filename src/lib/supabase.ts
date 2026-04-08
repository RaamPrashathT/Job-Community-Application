import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadResume(file: File, userId: string) {
  // Extract extension and generate a clean, unique filename
  const fileExt = file.name.split('.').pop()
  // Using Date.now() is slightly safer for collisions than Math.random()
  const fileName = `${userId}-${Date.now()}.${fileExt}`

  // We upload directly to the root of the 'assets' bucket
  const { data, error } = await supabase.storage
    .from('assets')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false // Prevents accidental overwriting of identically named files
    })

  if (error) {
    console.error("Supabase Upload Error:", error.message)
    throw error
  }

  // Use the built-in Supabase method to safely generate the public URL
  // We use data.path which is returned securely from the successful upload
  const { data: publicUrlData } = supabase.storage
    .from('assets')
    .getPublicUrl(data.path)
  
  return publicUrlData.publicUrl
}