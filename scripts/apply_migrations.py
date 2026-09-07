#!/usr/bin/env python3
"""
NHAA-Care Database Migration & Seed Runner
Executes versioned SQL migrations against PostgreSQL / Supabase in transactional order.
"""

import os
import sys
import argparse
from pathlib import Path
from datetime import datetime, timezone
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Default database URL
DEFAULT_DB_URL = "postgresql://postgres:postgres@localhost:5432/nhaa_care_db"

def get_db_url() -> str:
    return os.getenv("DATABASE_URL", DEFAULT_DB_URL)

def get_migrations_dir() -> Path:
    base = Path(__file__).resolve().parent.parent
    migrations_dir = base / "backend" / "app" / "db" / "migrations"
    if not migrations_dir.exists():
        migrations_dir = Path("backend/app/db/migrations").resolve()
    return migrations_dir

def ensure_database_exists(db_url: str):
    """If pointing to a local PostgreSQL instance, ensure target database exists."""
    try:
        from urllib.parse import urlparse
        parsed = urlparse(db_url)
        dbname = parsed.path.lstrip('/')
        if not dbname or parsed.hostname not in ['localhost', '127.0.0.1']:
            return
        
        admin_url = db_url.replace(f"/{dbname}", "/postgres")
        conn = psycopg2.connect(admin_url)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (dbname,))
        if not cur.fetchone():
            cur.execute(f'CREATE DATABASE "{dbname}"')
            print(f"[DB INIT] Created database '{dbname}'")
        cur.close()
        conn.close()
    except Exception as e:
        pass

def apply_migrations(db_url: str, dry_run: bool = False, seed: bool = True):
    print(f"=== NHAA-Care Database Migration Runner ===")
    print(f"Target Database: {db_url.split('@')[-1] if '@' in db_url else db_url}")
    print(f"Mode: {'DRY RUN' if dry_run else 'EXECUTE'}")
    
    migrations_dir = get_migrations_dir()
    if not migrations_dir.exists():
        print(f"[ERROR] Migrations directory not found: {migrations_dir}")
        sys.exit(1)

    sql_files = sorted(migrations_dir.glob("*.sql"))
    print(f"Found {len(sql_files)} migration files in {migrations_dir}")

    if dry_run:
        print("\nPlanned migration sequence:")
        for idx, f in enumerate(sql_files, 1):
            print(f"  [{idx:02d}] {f.name}")
        print("\nDry-run complete. No changes applied.")
        return

    ensure_database_exists(db_url)

    try:
        conn = psycopg2.connect(db_url)
    except Exception as e:
        print(f"[ERROR] Could not connect to database: {e}")
        print("Please ensure PostgreSQL is running and DATABASE_URL is correct.")
        sys.exit(1)

    try:
        # 1. Ensure migrations ledger exists
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS schema_migrations (
                    migration_file VARCHAR(255) PRIMARY KEY,
                    applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()

            cur.execute("SELECT migration_file FROM schema_migrations")
            applied = set(row[0] for row in cur.fetchall())

        # 2. Execute pending migrations
        pending = [f for f in sql_files if f.name not in applied]
        if not pending:
            print("[OK] Database schema is up to date. No pending migrations.")
        else:
            print(f"Applying {len(pending)} pending migrations...")
            for f in pending:
                print(f" -> Applying {f.name}...", end=" ", flush=True)
                sql_content = f.read_text(encoding="utf-8")
                
                with conn.cursor() as cur:
                    try:
                        cur.execute(sql_content)
                        cur.execute(
                            "INSERT INTO schema_migrations (migration_file) VALUES (%s)",
                            (f.name,)
                        )
                        conn.commit()
                        print("SUCCESS")
                    except Exception as err:
                        conn.rollback()
                        print(f"FAILED!\n[ERROR] Migration {f.name} failed: {err}")
                        sys.exit(1)

        # 3. Seed baseline demo data if requested and tables are empty
        if seed:
            seed_baseline_data(conn)

        print("\n[OK] All database operations completed successfully.")

    finally:
        conn.close()

def seed_baseline_data(conn):
    """Seeds initial demonstration data for cases, jurisdictions, and triage alerts."""
    with conn.cursor() as cur:
        # Check if cases already seeded
        cur.execute("SELECT COUNT(*) FROM case_master")
        if cur.fetchone()[0] > 0:
            return

        print("Seeding initial reference jurisdictions & sample cases...")

        # 1. Jurisdictions
        cur.execute("""
            INSERT INTO jurisdictions (state_code, state_name, district_code, district_name, sub_division, police_station_jurisdiction)
            VALUES 
                ('UP', 'Uttar Pradesh', 'UP_LKO', 'Lucknow', 'Lucknow Sadar', 'Sadar Police Station'),
                ('UP', 'Uttar Pradesh', 'UP_VNS', 'Varanasi', 'Varanasi Rural', 'Pindra Police Station'),
                ('MH', 'Maharashtra', 'MH_NGP', 'Nagpur', 'Nagpur Urban', 'Ambazari Police Station')
            ON CONFLICT (state_code, district_code) DO NOTHING;
        """)

        # 2. Users (Counselor, DM, SP)
        cur.execute("""
            INSERT INTO users (full_name, official_email, official_mobile, role, designation, department)
            VALUES 
                ('Dr. Ananya Verma', 'counselor.ananya@sahay.gov.in', '+919999000001', 'CERTIFIED_COUNSELOR', 'Senior Clinical Psychologist', 'Health & Family Welfare'),
                ('R. K. Sharma, IAS', 'dm.lucknow@up.gov.in', '+919999000002', 'DISTRICT_MAGISTRATE', 'District Magistrate, Lucknow', 'Administration'),
                ('S. K. Singh, IPS', 'sp.lucknow@police.gov.in', '+919999000003', 'SUPERINTENDENT_OF_POLICE', 'Superintendent of Police', 'Police')
            ON CONFLICT (official_email) DO NOTHING;
        """)

        # 3. Identity Vault (AES/pgcrypto encrypted identity tokens)
        cur.execute("""
            INSERT INTO identity_vault (
                victim_token, aadhaar_vault_reference, encrypted_full_name, encrypted_phone_number,
                encrypted_current_address, encrypted_caste_category, preferred_language
            ) VALUES (
                'e2b7e120-1a1a-4f5a-9090-000000000001'::uuid,
                'AADH-VAULT-REF-9041',
                pgp_sym_encrypt('Ramesh Kumar', '12345678901234567890123456789012'),
                pgp_sym_encrypt('+91 98765 43210', '12345678901234567890123456789012'),
                pgp_sym_encrypt('Gram Panchayat Sadar, Sector 4, Lucknow, UP', '12345678901234567890123456789012'),
                pgp_sym_encrypt('SC', '12345678901234567890123456789012'),
                'hi'
            ) ON CONFLICT (victim_token) DO NOTHING;
        """)

        # 4. Case Master
        cur.execute("""
            INSERT INTO case_master (
                case_id, case_number, fir_number, police_station, jurisdiction_id, victim_token,
                act_sections, incident_date, case_status, is_witness_protection_active, current_distress_tier, latest_dds_score
            ) VALUES (
                'c0010049-2026-0000-0000-000000000492'::uuid,
                'NHAA/2026/UP/LKO/00492',
                'FIR-482/2026',
                'Sadar Police Station, Lucknow',
                (SELECT jurisdiction_id FROM jurisdictions WHERE district_code = 'UP_LKO' LIMIT 1),
                'e2b7e120-1a1a-4f5a-9090-000000000001'::uuid,
                ARRAY['3(1)(r)', '3(1)(s)', '3(2)(v)'],
                '2026-08-14'::date,
                'UNDER_INVESTIGATION',
                TRUE,
                'TIER_4_CRITICAL',
                88.50
            ),
            (
                'c0010049-2026-0000-0000-000000000118'::uuid,
                'NHAA/2026/MH/NGP/00118',
                'FIR-109/2026',
                'Ambazari Police Station, Nagpur',
                (SELECT jurisdiction_id FROM jurisdictions WHERE district_code = 'MH_NGP' LIMIT 1),
                'e2b7e120-1a1a-4f5a-9090-000000000001'::uuid,
                ARRAY['3(1)(r)', '3(1)(w)'],
                '2026-08-20'::date,
                'CHARGESHEET_FILED',
                FALSE,
                'TIER_3_HIGH',
                64.20
            ) ON CONFLICT (case_number) DO NOTHING;
        """)

        # 5. Relief Compensations (Rule 12)
        cur.execute("""
            INSERT INTO relief_compensations (case_id, stage_name, sanctioned_amount, disbursed_amount, is_disbursed, delay_days)
            VALUES 
                ('c0010049-2026-0000-0000-000000000492'::uuid, 'FIR_STAGE_25PCT', 212500.00, 212500.00, TRUE, 0),
                ('c0010049-2026-0000-0000-000000000492'::uuid, 'CHARGESHEET_STAGE_50PCT', 425000.00, 0.00, FALSE, 14),
                ('c0010049-2026-0000-0000-000000000492'::uuid, 'CONVICTION_STAGE_25PCT', 212500.00, 0.00, FALSE, 0),
                ('c0010049-2026-0000-0000-000000000118'::uuid, 'FIR_STAGE_25PCT', 212500.00, 212500.00, TRUE, 0),
                ('c0010049-2026-0000-0000-000000000118'::uuid, 'CHARGESHEET_STAGE_50PCT', 425000.00, 425000.00, TRUE, 0)
            ON CONFLICT DO NOTHING;
        """)

        # 6. Interaction session & distress snapshot & alert
        cur.execute("""
            INSERT INTO interaction_sessions (
                session_id, case_id, channel, interaction_direction, started_at,
                raw_transcript_anonymized, detected_language
            ) VALUES (
                '10010049-0000-0000-0000-000000000001'::uuid,
                'c0010049-2026-0000-0000-000000000492'::uuid,
                'IVRS_OUTBOUND',
                'OUTBOUND',
                NOW(),
                'kal shaam ko unke aadmi aaye the. Bole ki gawaahi wapas le le nahi toh ghar jala denge. Hum bahut dare hue hain, bache ro rahe hain.',
                'hi'
            ),
            (
                '10010049-0000-0000-0000-000000000002'::uuid,
                'c0010049-2026-0000-0000-000000000118'::uuid,
                'WEB_PORTAL',
                'INBOUND',
                NOW(),
                'Village shopkeeper refused to sell ration after FIR. Nobody is talking to us. We have no food for tomorrow.',
                'en'
            ) ON CONFLICT DO NOTHING;

            INSERT INTO distress_snapshots (
                snapshot_id, session_id, case_id, measured_at,
                threat_intimidation_marker, composite_dds_score,
                risk_tier, model_version, validation_status
            ) VALUES (
                '20010049-0000-0000-0000-000000000001'::uuid,
                '10010049-0000-0000-0000-000000000001'::uuid,
                'c0010049-2026-0000-0000-000000000492'::uuid,
                NOW(),
                0.94, 88.50, 'TIER_4_CRITICAL', 'v1.0.2', 'RESEARCH_PROTOTYPE'
            ),
            (
                '20010049-0000-0000-0000-000000000002'::uuid,
                '10010049-0000-0000-0000-000000000002'::uuid,
                'c0010049-2026-0000-0000-000000000118'::uuid,
                NOW(),
                0.62, 64.20, 'TIER_3_HIGH', 'v1.0.2', 'RESEARCH_PROTOTYPE'
            ) ON CONFLICT DO NOTHING;

            INSERT INTO alert_records (
                alert_id, case_id, snapshot_id, alert_tier, alert_title, alert_description,
                status, sla_breach_at
            ) VALUES (
                '30010049-0000-0000-0000-000000000001'::uuid,
                'c0010049-2026-0000-0000-000000000492'::uuid,
                '20010049-0000-0000-0000-000000000001'::uuid,
                'TIER_4_CRITICAL',
                'CRITICAL_THREAT_DETECTED',
                'Witness intimidation and arson threat detected in IVRS check-in. Requires emergency human clinical validation.',
                'IN_TRIAGE',
                NOW() + INTERVAL '12 minutes'
            ),
            (
                '30010049-0000-0000-0000-000000000002'::uuid,
                'c0010049-2026-0000-0000-000000000118'::uuid,
                '20010049-0000-0000-0000-000000000002'::uuid,
                'TIER_3_HIGH',
                'SOCIAL_BOYCOTT_DETECTED',
                'Economic boycott and refusal of ration after FIR filing reported.',
                'IN_TRIAGE',
                NOW() + INTERVAL '45 minutes'
            ) ON CONFLICT DO NOTHING;
        """)

        conn.commit()
        print("[OK] Baseline demonstration data seeded successfully.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="NHAA-Care Database Migration Runner")
    parser.add_argument("--dry-run", action="store_true", help="Validate and list migrations without applying")
    parser.add_argument("--no-seed", action="store_true", help="Skip seeding initial demo data")
    parser.add_argument("--db-url", type=str, default=None, help="PostgreSQL connection string")
    args = parser.parse_args()

    db_url = args.db_url or get_db_url()
    apply_migrations(db_url, dry_run=args.dry_run, seed=not args.no_seed)
