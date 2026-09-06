-- Migration 017: TimescaleDB Hypertable Setup & Compression
-- Convert distress_snapshots into hypertable if extension exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'timescaledb') THEN
        PERFORM create_hypertable('distress_snapshots', 'measured_at', chunk_time_interval => INTERVAL '7 days');
        ALTER TABLE distress_snapshots SET (
            timescaledb.compress,
            timescaledb.compress_segmentby = 'case_id'
        );
        PERFORM add_compression_policy('distress_snapshots', INTERVAL '30 days');
    END IF;
END $$;
