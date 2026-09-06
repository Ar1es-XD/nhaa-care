-- Migration 016: Row-Level Security Policies for Identity Protection
ALTER TABLE identity_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_master ENABLE ROW LEVEL SECURITY;

-- Default policy: Identity vault strictly inaccessible to normal queries
CREATE POLICY vault_isolation_policy ON identity_vault
    FOR ALL
    TO authenticated
    USING (current_setting('app.current_user_role', true) = 'SUPER_ADMIN' 
           OR current_setting('app.break_glass_active', true) = 'true');
