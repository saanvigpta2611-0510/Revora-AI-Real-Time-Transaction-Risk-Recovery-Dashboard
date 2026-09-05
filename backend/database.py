import sqlite3
import json
from datetime import datetime

DB_PATH = "../data/revive.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS transactions (
            transaction_id TEXT PRIMARY KEY,
            merchant_id TEXT,
            merchant_name TEXT,
            customer_id TEXT,
            amount REAL,
            payment_method TEXT,
            bank TEXT,
            failure_type TEXT,
            customer_success_rate REAL,
            previous_payments INTEGER,
            retry_count INTEGER,
            timestamp TEXT,
            risk_score REAL
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
            event_id TEXT PRIMARY KEY,
            transaction_id TEXT,
            timestamp TEXT,
            diagnosis TEXT,
            evidence TEXT,
            recovery_probability REAL,
            expected_recovery_value REAL,
            selected_action TEXT,
            policy_approved BOOLEAN,
            policy_checks TEXT,
            execution_result TEXT,
            recovered_amount REAL,
            final_status TEXT,
            transcript TEXT
        );
        
        CREATE TABLE IF NOT EXISTS metrics (
            run_id TEXT PRIMARY KEY,
            timestamp TEXT,
            revenue_at_risk REAL,
            baseline_recovery REAL,
            ai_recovered REAL,
            incremental_recovery REAL,
            recovery_rate REAL,
            total_failed INTEGER,
            total_recovered INTEGER,
            total_escalated INTEGER,
            total_stopped INTEGER,
            total_failed_interventions INTEGER
        );
    """)
    conn.commit()
    conn.close()

def save_transactions(transactions_df):
    conn = get_db()
    transactions_df.to_sql('transactions', conn, if_exists='append', index=False)
    conn.close()

def save_audit_log(audit_event):
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO audit_logs (event_id, transaction_id, timestamp, diagnosis, evidence, 
                                recovery_probability, expected_recovery_value, selected_action, 
                                policy_approved, policy_checks, execution_result, recovered_amount, final_status, transcript)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        audit_event.event_id, audit_event.transaction_id, audit_event.timestamp.isoformat(),
        audit_event.diagnosis, json.dumps(audit_event.evidence), audit_event.recovery_probability,
        audit_event.expected_recovery_value, audit_event.selected_action, audit_event.policy_approved,
        json.dumps(audit_event.policy_checks), audit_event.execution_result, audit_event.recovered_amount,
        audit_event.final_status, json.dumps(audit_event.transcript) if audit_event.transcript else None
    ))
    conn.commit()
    conn.close()

def clear_audit_logs():
    conn = get_db()
    c = conn.cursor()
    c.execute("DELETE FROM audit_logs")
    conn.commit()
    conn.close()

def save_metrics(metrics, run_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO metrics (run_id, timestamp, revenue_at_risk, baseline_recovery, ai_recovered,
                            incremental_recovery, recovery_rate, total_failed, total_recovered,
                            total_escalated, total_stopped, total_failed_interventions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        run_id, datetime.now().isoformat(), metrics.revenue_at_risk, metrics.baseline_recovery,
        metrics.ai_recovered, metrics.incremental_recovery, metrics.recovery_rate, metrics.total_failed,
        metrics.total_recovered, metrics.total_escalated, metrics.total_stopped, metrics.total_failed_interventions
    ))
    conn.commit()
    conn.close()
