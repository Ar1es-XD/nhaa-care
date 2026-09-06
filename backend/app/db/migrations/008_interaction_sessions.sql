-- Migration 008: Omnichannel Interaction Sessions
CREATE TABLE interaction_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id) ON DELETE CASCADE,
    channel channel_enum NOT NULL,
    interaction_direction VARCHAR(10) CHECK (interaction_direction IN ('INBOUND', 'OUTBOUND')),
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    audio_recording_s3_key VARCHAR(500),
    raw_transcript_anonymized TEXT,
    detected_language VARCHAR(20),
    is_completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
