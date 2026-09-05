import pandas as pd
from datetime import datetime
import uuid
from recovery_engine import RecoveryEngine
from policy_engine import PolicyEngine
from simulator import simulate_action_outcome
from models import AuditEvent, DashboardMetrics, PaymentAction
from database import save_audit_log, save_metrics, clear_audit_logs, get_db

class ReviveAgent:
    def __init__(self):
        self.recovery_engine = RecoveryEngine()
        self.policy_engine = PolicyEngine()

    def baseline_strategy(self, transaction: dict) -> tuple:
        # Simple naive strategy: immediate retry if retry_count < 2
        if transaction["retry_count"] < 2 and transaction["failure_type"] not in ["high_risk"]:
            success, _ = simulate_action_outcome(transaction, "immediate_retry")
            return success, transaction["amount"] if success else 0.0
        return False, 0.0

    def run_batch(self):
        clear_audit_logs()
        
        conn = get_db()
        # Fetch up to 5,000 pending transactions for fast simulation
        df = pd.read_sql_query("SELECT * FROM transactions LIMIT 5000", conn)
        conn.close()
        
        run_id = str(uuid.uuid4())
        
        revenue_at_risk = df["amount"].sum()
        baseline_recovery = 0.0
        ai_recovered = 0.0
        
        total_failed = len(df)
        total_recovered = 0
        total_escalated = 0
        total_stopped = 0
        total_failed_interventions = 0
        
        import random # ensure random is available
        
        # Process each transaction
        for _, row in df.iterrows():
            transaction = row.to_dict()
            
            # 1. Baseline
            b_success, b_amt = self.baseline_strategy(transaction)
            baseline_recovery += b_amt
            
            # 2. AI Observe & Diagnose
            diagnosis = self.recovery_engine.diagnose(transaction)
            
            # 3. Predict
            prediction = self.recovery_engine.predict(transaction, diagnosis)
            
            # 4. Decide
            decision = self.recovery_engine.decide(transaction, diagnosis, prediction)
            
            # 5. Policy Check
            policy_result = self.policy_engine.evaluate(
                transaction, decision.recommended_action, prediction.expected_recovery_value
            )
            
            # 6. Execute & Verify
            final_status = "stopped"
            execution_result = "policy_rejected"
            recovered_amount = 0.0
            
            if policy_result.is_approved:
                if policy_result.action == PaymentAction.STOP:
                    final_status = "stopped"
                    execution_result = "stopped_by_ai"
                    total_stopped += 1
                elif policy_result.action == PaymentAction.ESCALATE:
                    final_status = "escalated"
                    execution_result = "escalated_for_manual_review"
                    total_escalated += 1
                else:
                    success, exec_reason = simulate_action_outcome(transaction, policy_result.action)
                    execution_result = exec_reason
                    
                    if exec_reason == "promise_to_pay_recorded":
                        final_status = "promise_to_pay"
                        ai_recovered += transaction["amount"] # Count as recovered for demo purposes
                        total_recovered += 1
                        recovered_amount = transaction["amount"]
                    elif success:
                        final_status = "recovered"
                        recovered_amount = transaction["amount"]
                        ai_recovered += recovered_amount
                        total_recovered += 1
                    else:
                        final_status = "failed"
                        total_failed_interventions += 1
            else:
                total_stopped += 1
                
            # Generate transcript if action was conversational
            transcript = None
            if policy_result.action == PaymentAction.HINGLISH_WHATSAPP_NUDGE and final_status == "recovered":
                transcript = [
                    {"sender": "agent", "message": f"Hi {transaction['customer_id']}, aapka recent payment of ₹{transaction['amount']} incomplete reh gaya tha. Would you like a link to retry via UPI?"},
                    {"sender": "customer", "message": "Haan bhai, link bhej do."},
                    {"sender": "agent", "message": "Great, here is your secure link: https://rzp.io/l/xyz123. Let me know once done!"},
                    {"sender": "customer", "message": "Done, payment successful."},
                    {"sender": "agent", "message": "Payment received! Thank you. Aapka order process ho gaya hai."}
                ]
            elif policy_result.action == PaymentAction.B2B_EMAIL_CHASER and final_status == "promise_to_pay":
                responses = [
                    "Apologies for the delay. Our accounting team was migrating to a new ERP system last week and we completely missed the billing cycle. We've just processed it, it will clear on Friday.",
                    "So sorry about this! The person who normally handles these invoices is on leave. I have approved it in our portal now, you'll see it tomorrow.",
                    "Hi, we had an issue with our corporate card limit. We've spoken to the bank and it's resolved. Payment initiated.",
                    "Thanks for the reminder. Our CFO just signed off on the batch. Expect it by end of week.",
                    "Whoops! Looks like the PO didn't match on our end. Fixed it now. Payment is scheduled for tomorrow."
                ]
                customer_reply = random.choice(responses)
                agent_final = "Thank you for the update. We have recorded your promise to pay and paused further reminders. Have a great week!" if "tomorrow" not in customer_reply else "Thank you for the prompt update. We will monitor the account and reach out if it doesn't clear. Have a great week!"
                
                transcript = [
                    {"sender": "agent", "message": f"Hello, friendly reminder that invoice {transaction['transaction_id']} for ₹{transaction['amount']} is currently overdue. Let us know if there are any issues."},
                    {"sender": "customer", "message": customer_reply},
                    {"sender": "agent", "message": agent_final}
                ]
                
            # 7. Audit
            event_id = str(uuid.uuid4())
            audit_event = AuditEvent(
                event_id=event_id,
                transaction_id=transaction["transaction_id"],
                timestamp=datetime.now(),
                diagnosis=diagnosis.root_cause,
                evidence=diagnosis.evidence,
                recovery_probability=prediction.recovery_probability,
                expected_recovery_value=prediction.expected_recovery_value,
                selected_action=decision.recommended_action,
                policy_approved=policy_result.is_approved,
                policy_checks=policy_result.checks_passed,
                execution_result=execution_result,
                recovered_amount=recovered_amount,
                final_status=final_status,
                transcript=transcript
            )
            
            save_audit_log(audit_event)

        # 8. Metrics
        metrics = DashboardMetrics(
            revenue_at_risk=revenue_at_risk,
            baseline_recovery=baseline_recovery,
            ai_recovered=ai_recovered,
            incremental_recovery=max(0, ai_recovered - baseline_recovery),
            recovery_rate=(total_recovered / total_failed) * 100 if total_failed > 0 else 0,
            total_failed=total_failed,
            total_recovered=total_recovered,
            total_escalated=total_escalated,
            total_stopped=total_stopped,
            total_failed_interventions=total_failed_interventions
        )
        
        save_metrics(metrics, run_id)
        
        return metrics

    def process_single(self, transaction: dict) -> dict:
        import random
        
        diagnosis = self.recovery_engine.diagnose(transaction)
        prediction = self.recovery_engine.predict(transaction, diagnosis)
        decision = self.recovery_engine.decide(transaction, diagnosis, prediction)
        policy_result = self.policy_engine.evaluate(
            transaction, decision.recommended_action, prediction.expected_recovery_value
        )
        
        final_status = "stopped"
        execution_result = "policy_rejected"
        recovered_amount = 0.0
        
        if policy_result.is_approved:
            if policy_result.action == PaymentAction.STOP:
                final_status = "stopped"
                execution_result = "stopped_by_ai"
            elif policy_result.action == PaymentAction.ESCALATE:
                final_status = "escalated"
                execution_result = "escalated_for_manual_review"
            else:
                success, exec_reason = simulate_action_outcome(transaction, policy_result.action)
                execution_result = exec_reason
                if exec_reason == "promise_to_pay_recorded":
                    final_status = "promise_to_pay"
                    recovered_amount = transaction["amount"]
                elif success:
                    final_status = "recovered"
                    recovered_amount = transaction["amount"]
                else:
                    final_status = "failed"
                    
        transcript = None
        if policy_result.action == PaymentAction.HINGLISH_WHATSAPP_NUDGE and final_status == "recovered":
            transcript = [
                {"sender": "agent", "message": f"Hi {transaction['customer_id']}, aapka recent payment of ₹{transaction['amount']} incomplete reh gaya tha. Would you like a link to retry via UPI?"},
                {"sender": "customer", "message": "Haan bhai, link bhej do."},
                {"sender": "agent", "message": "Great, here is your secure link: https://rzp.io/l/xyz123. Let me know once done!"},
                {"sender": "customer", "message": "Done, payment successful."},
                {"sender": "agent", "message": "Payment received! Thank you. Aapka order process ho gaya hai."}
            ]
        elif policy_result.action == PaymentAction.B2B_EMAIL_CHASER and final_status == "promise_to_pay":
            responses = [
                "Apologies for the delay. Our accounting team was migrating to a new ERP system.",
                "So sorry about this! I have approved it in our portal now.",
                "Thanks for the reminder. Expect it by end of week."
            ]
            customer_reply = random.choice(responses)
            agent_final = "Thank you for the update. We have recorded your promise to pay."
            transcript = [
                {"sender": "agent", "message": f"Hello, friendly reminder that invoice {transaction['transaction_id']} for ₹{transaction['amount']} is currently overdue."},
                {"sender": "customer", "message": customer_reply},
                {"sender": "agent", "message": agent_final}
            ]
            
        event_id = str(uuid.uuid4())
        audit_event = AuditEvent(
            event_id=event_id,
            transaction_id=transaction["transaction_id"],
            timestamp=datetime.now(),
            diagnosis=diagnosis.root_cause,
            evidence=diagnosis.evidence,
            recovery_probability=prediction.recovery_probability,
            expected_recovery_value=prediction.expected_recovery_value,
            selected_action=decision.recommended_action,
            policy_approved=policy_result.is_approved,
            policy_checks=policy_result.checks_passed,
            execution_result=execution_result,
            recovered_amount=recovered_amount,
            final_status=final_status,
            transcript=transcript
        )
        
        save_audit_log(audit_event)
        
        return {
            "event_id": audit_event.event_id,
            "transaction_id": audit_event.transaction_id,
            "final_status": audit_event.final_status,
            "action": audit_event.selected_action,
            "reason": audit_event.execution_result
        }
