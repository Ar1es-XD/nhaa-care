import pytest
from app.core.security import evaluate_abac_access

def test_abac_same_district_access():
    counselor_lko = {"role": "CERTIFIED_COUNSELOR", "jurisdiction": {"district_code": "UP_LKO"}}
    case_lko = {"district_code": "UP_LKO"}
    assert evaluate_abac_access(counselor_lko, case_lko) is True

def test_abac_cross_district_blocked():
    counselor_lko = {"role": "CERTIFIED_COUNSELOR", "jurisdiction": {"district_code": "UP_LKO"}}
    case_ngp = {"district_code": "MH_NGP"}
    assert evaluate_abac_access(counselor_lko, case_ngp) is False

def test_abac_national_monitor_access():
    national_admin = {"role": "NATIONAL_MONITOR"}
    case_any = {"district_code": "RJ_JPR"}
    assert evaluate_abac_access(national_admin, case_any) is True
