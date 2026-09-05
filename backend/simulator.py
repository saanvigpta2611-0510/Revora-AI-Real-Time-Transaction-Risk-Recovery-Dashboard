import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import uuid

def generate_synthetic_data(num_records=10000):
    np.random.seed(42)
    random.seed(42)
    
    failure_types = [
        "issuer_unavailable", "network_error", "expired_card", 
        "insufficient_funds", "authentication_failed", 
        "checkout_abandoned", "subscription_failed", "high_risk",
        "b2b_receivable_overdue"
    ]
    
    failure_probs = [0.2, 0.1, 0.1, 0.15, 0.15, 0.1, 0.05, 0.05, 0.1]
    
    payment_methods = ["UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING"]
    banks = ["HDFC", "SBI", "ICICI", "AXIS", "KOTAK"]
    
    data = []
    
    for i in range(num_records):
        failure_type = np.random.choice(failure_types, p=failure_probs)
        amount = round(np.random.lognormal(mean=7, sigma=1.5), 2)
        amount = max(100.0, min(amount, 100000.0))
        
        # Correlate risk and success rate with failure types
        if failure_type == "high_risk":
            risk_score = np.random.uniform(0.7, 1.0)
            customer_success_rate = np.random.uniform(0.1, 0.5)
        elif failure_type == "insufficient_funds":
            risk_score = np.random.uniform(0.3, 0.7)
            customer_success_rate = np.random.uniform(0.4, 0.8)
        else:
            risk_score = np.random.uniform(0.01, 0.4)
            customer_success_rate = np.random.uniform(0.7, 0.99)
            
        retry_count = np.random.choice([0, 1, 2, 3], p=[0.7, 0.2, 0.08, 0.02])
        
        record = {
            "transaction_id": f"TXN{random.randint(100000, 999999)}",
            "merchant_id": f"MERCH{random.randint(100, 999)}",
            "merchant_name": f"Merchant {random.randint(1, 50)}",
            "customer_id": f"CUST{random.randint(1000, 9999)}",
            "amount": amount,
            "payment_method": random.choice(payment_methods),
            "bank": random.choice(banks),
            "failure_type": failure_type,
            "customer_success_rate": round(customer_success_rate, 2),
            "previous_payments": np.random.poisson(lam=5),
            "retry_count": retry_count,
            "timestamp": (datetime.now() - timedelta(minutes=random.randint(1, 10000))).isoformat(),
            "risk_score": round(risk_score, 2)
        }
        data.append(record)
        
    return pd.DataFrame(data)

def simulate_action_outcome(transaction, action):
    # Returns (is_successful, outcome_reason)
    failure_type = transaction["failure_type"]
    
    # Base probability modifier based on risk and success rate
    base_prob = transaction["customer_success_rate"] * (1 - transaction["risk_score"])
    
    if action == "delayed_retry":
        if failure_type in ["issuer_unavailable", "network_error"]:
            return (random.random() < 0.8 * base_prob, "delayed_retry_resolved_temp_issue")
        elif failure_type == "insufficient_funds":
            return (random.random() < 0.4 * base_prob, "funds_added_before_retry")
        else:
            return (random.random() < 0.2 * base_prob, "delayed_retry_generic_success")
            
    elif action == "immediate_retry":
        if failure_type == "network_error":
            return (random.random() < 0.6 * base_prob, "immediate_retry_success")
        elif failure_type == "insufficient_funds":
            return (random.random() < 0.05 * base_prob, "still_insufficient_funds")
        else:
            return (random.random() < 0.1 * base_prob, "immediate_retry_failed")
            
    elif action == "payment_update_request":
        if failure_type == "expired_card":
            return (random.random() < 0.7 * base_prob, "card_updated_by_user")
        elif failure_type == "insufficient_funds":
            return (random.random() < 0.5 * base_prob, "user_provided_new_method")
        else:
            return (random.random() < 0.3 * base_prob, "user_updated_payment")
            
    elif action == "payment_reminder":
        if failure_type == "checkout_abandoned":
            return (random.random() < 0.6 * base_prob, "user_completed_checkout")
        elif failure_type == "subscription_failed":
            return (random.random() < 0.4 * base_prob, "user_renewed_subscription")
        else:
            return (random.random() < 0.1 * base_prob, "ignored_reminder")
            
    elif action == "alternate_payment_method":
        if failure_type in ["insufficient_funds", "authentication_failed", "issuer_unavailable"]:
            return (random.random() < 0.5 * base_prob, "switched_to_upi_or_other")
        return (random.random() < 0.2 * base_prob, "alternate_method_failed")
        
    elif action == "hinglish_whatsapp_nudge":
        if random.random() < 0.6 * base_prob:
            return (True, "whatsapp_payment_completed")
        else:
            return (False, "whatsapp_ignored")
            
    elif action == "b2b_email_chaser":
        if random.random() < 0.5 * base_prob:
            return (True, "promise_to_pay_recorded")
        else:
            return (False, "b2b_no_response")

    elif action == "escalate":
        return (False, "escalated_for_manual_review")
        
    elif action == "stop":
        return (False, "stopped")
        
    return (False, "unknown_action")
