-- Migration 007: Case Milestones
CREATE TABLE case_milestones (
    milestone_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES case_master(case_id) ON DELETE CASCADE,
    milestone_type milestone_type_enum NOT NULL,
    scheduled_date DATE,
    actual_date DATE,
    court_name VARCHAR(150),
    outcome_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
