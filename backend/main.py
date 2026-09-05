from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import pandas as pd
from database import init_db, save_transactions, get_db
from simulator import generate_synthetic_data
from agent import ReviveAgent
import json
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup
    init_db()
    
    # Generate initial seed data if not present
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT count(*) FROM transactions")
    count = c.fetchone()[0]
    if count == 0:
        print("Generating synthetic data...")
        df = generate_synthetic_data(10000)
        save_transactions(df)
        print(f"Generated {len(df)} synthetic transactions.")
    conn.close()
    
    yield
    # Teardown

app = FastAPI(title="REVIVE AI API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/metrics")
def get_metrics():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM metrics ORDER BY timestamp DESC LIMIT 1")
    row = c.fetchone()
    conn.close()
    
    if not row:
        return {
            "revenue_at_risk": 0.0,
            "baseline_recovery": 0.0,
            "ai_recovered": 0.0,
            "incremental_recovery": 0.0,
            "recovery_rate": 0.0,
            "total_failed": 0,
            "total_recovered": 0,
            "total_escalated": 0,
            "total_stopped": 0,
            "total_failed_interventions": 0
        }
        
    return dict(row)

@app.post("/api/recovery/run")
def run_recovery():
    agent = ReviveAgent()
    metrics = agent.run_batch()
    return {"status": "success", "metrics": metrics}

from pydantic import BaseModel
import random
from datetime import datetime

class InjectRequest(BaseModel):
    amount: float
    failure_type: str

@app.post("/api/recovery/inject")
def inject_transaction(req: InjectRequest):
    # Construct synthetic transaction based on user inputs
    transaction = {
        "transaction_id": f"MANUAL{random.randint(1000, 9999)}",
        "merchant_id": f"MERCH{random.randint(100, 999)}",
        "merchant_name": "Test Merchant",
        "customer_id": f"CUST{random.randint(1000, 9999)}",
        "amount": req.amount,
        "payment_method": "CREDIT_CARD",
        "bank": "HDFC",
        "failure_type": req.failure_type,
        "customer_success_rate": 0.85,
        "previous_payments": 5,
        "retry_count": 0,
        "timestamp": datetime.now().isoformat(),
        "risk_score": 0.2 if req.failure_type != "high_risk" else 0.9
    }
    
    # Save to db
    df = pd.DataFrame([transaction])
    save_transactions(df)
    
    # Process it
    agent = ReviveAgent()
    result = agent.process_single(transaction)
    
    # Update metrics so dashboard count increments
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM metrics ORDER BY timestamp DESC LIMIT 1")
    row = c.fetchone()
    if row:
        m = dict(row)
        amt = req.amount
        is_recovered = 1 if result["final_status"] in ["recovered", "promise_to_pay"] else 0
        rec_amt = amt if is_recovered else 0
        
        m["total_failed"] += 1
        m["revenue_at_risk"] += amt
        if is_recovered:
            m["total_recovered"] += 1
            m["ai_recovered"] += rec_amt
            m["incremental_recovery"] += rec_amt
        elif result["final_status"] == "escalated":
            m["total_escalated"] += 1
        elif result["final_status"] == "stopped":
            m["total_stopped"] += 1
        else:
            m["total_failed_interventions"] += 1
            
        m["recovery_rate"] = (m["total_recovered"] / m["total_failed"]) * 100
        
        c.execute("""
            INSERT INTO metrics 
            (run_id, timestamp, revenue_at_risk, baseline_recovery, ai_recovered, incremental_recovery, recovery_rate, total_failed, total_recovered, total_escalated, total_stopped, total_failed_interventions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (f"manual_{transaction['transaction_id']}", datetime.now().isoformat(), m["revenue_at_risk"], m["baseline_recovery"], m["ai_recovered"], m["incremental_recovery"], m["recovery_rate"], m["total_failed"], m["total_recovered"], m["total_escalated"], m["total_stopped"], m["total_failed_interventions"]))
        conn.commit()
    conn.close()
    
    return {"status": "success", "result": result, "transaction": transaction}

@app.get("/api/audit")
def get_audit_logs(limit: int = 50):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = c.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        d = dict(row)
        d["evidence"] = json.loads(d["evidence"])
        d["policy_checks"] = json.loads(d["policy_checks"])
        d["transcript"] = json.loads(d["transcript"]) if d.get("transcript") else None
        results.append(d)
        
    return results

@app.get("/api/transactions")
def get_transactions(limit: int = 50):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM transactions LIMIT ?", (limit,))
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]
    
@app.get("/api/audit/{transaction_id}")
def get_audit_detail(transaction_id: str):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM audit_logs WHERE transaction_id = ?", (transaction_id,))
    row = c.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Audit not found")
        
    d = dict(row)
    d["evidence"] = json.loads(d["evidence"])
    d["policy_checks"] = json.loads(d["policy_checks"])
    d["transcript"] = json.loads(d["transcript"]) if d.get("transcript") else None
    return d

@app.get("/api/analytics/failure_types")
def get_failure_types():
    conn = get_db()
    c = conn.cursor()
    
    # Get total amount and count by failure type
    c.execute("""
        SELECT failure_type, COUNT(*) as count, SUM(amount) as total_amount
        FROM transactions
        GROUP BY failure_type
        ORDER BY total_amount DESC
    """)
    tx_rows = c.fetchall()
    
    # Get recovered amount and count by failure type
    c.execute("""
        SELECT t.failure_type, COUNT(*) as recovered_count, SUM(a.recovered_amount) as recovered_amount
        FROM audit_logs a
        JOIN transactions t ON a.transaction_id = t.transaction_id
        WHERE a.final_status = 'recovered'
        GROUP BY t.failure_type
    """)
    rec_rows = c.fetchall()
    
    conn.close()
    
    # Merge data
    results = {}
    for r in tx_rows:
        results[r["failure_type"]] = {
            "failure_type": r["failure_type"],
            "count": r["count"],
            "total_amount": r["total_amount"],
            "recovered_count": 0,
            "recovered_amount": 0.0
        }
        
    for r in rec_rows:
        if r["failure_type"] in results:
            results[r["failure_type"]]["recovered_count"] = r["recovered_count"]
            results[r["failure_type"]]["recovered_amount"] = r["recovered_amount"]
            
    return list(results.values())
