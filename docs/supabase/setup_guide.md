# Supabase Integration Guide for NHAA-Care

1. Login to Supabase Dashboard or CLI:
   `npx supabase login`
2. Link your project:
   `npx supabase link --project-ref <your-project-ref>`
3. Apply migrations:
   `npx supabase db push`
4. Verify RLS policies on `identity_vault`.
