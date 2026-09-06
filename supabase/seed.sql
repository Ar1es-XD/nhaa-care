-- Seed initial administrative jurisdiction for demonstration
INSERT INTO jurisdictions (state_code, state_name, district_code, district_name)
VALUES ('UP', 'Uttar Pradesh', 'UP_LKO', 'Lucknow')
ON CONFLICT (state_code, district_code) DO NOTHING;
