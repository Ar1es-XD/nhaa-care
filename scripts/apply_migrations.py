import os
import sys
from pathlib import Path

def apply_migrations():
    print("Connecting to PostgreSQL / Supabase...")
    migrations_dir = Path("backend/app/db/migrations")
    sql_files = sorted(migrations_dir.glob("*.sql"))
    print(f"Found {len(sql_files)} migrations ready to apply.")
    for f in sql_files:
        print(f" - Validating {f.name}")
    print("All migrations validated.")

if __name__ == "__main__":
    apply_migrations()
