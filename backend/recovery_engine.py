from models import Diagnosis, Prediction, Decision, PaymentAction, FailureReason

class RecoveryEngine:
    def diagnose(self, transaction: dict) -> Diagnosis:
        failure_type = transaction["failure_type"]
        evidence = [
            f"Failure reported as: {failure_type}",
            f"Customer success rate: {transaction['customer_success_rate']*100:.1f}%",
            f"Previous payments: {transaction['previous_payments']}",
            f"Current retry count: {transaction['retry_count']}"
        ]
        
        if failure_type == "issuer_unavailable":
            evidence.append("Bank issuer currently showing elevated failure rates")
        elif failure_type == "insufficient_funds":
            evidence.append("Transaction declined due to non-sufficient funds code")
            
        return Diagnosis(
            transaction_id=transaction["transaction_id"],
            root_cause=FailureReason(failure_type),
            evidence=evidence
        )
        
    def predict(self, transaction: dict, diagnosis: Diagnosis) -> Prediction:
        base_prob = transaction["customer_success_rate"] * (1 - transaction["risk_score"])
        
        if diagnosis.root_cause in [FailureReason.ISSUER_UNAVAILABLE, FailureReason.NETWORK_ERROR]:
            prob = min(0.85, base_prob * 1.5)
        elif diagnosis.root_cause == FailureReason.EXPIRED_CARD:
            prob = base_prob * 0.4
        elif diagnosis.root_cause == FailureReason.INSUFFICIENT_FUNDS:
            prob = base_prob * 0.5
        elif diagnosis.root_cause == FailureReason.HIGH_RISK:
            prob = 0.01
        else:
            prob = base_prob * 0.8
            
        prob = max(0.0, min(1.0, prob))
        expected_val = prob * transaction["amount"]
        
        risk_level = "HIGH" if transaction["risk_score"] > 0.75 else "MEDIUM" if transaction["risk_score"] > 0.4 else "LOW"
        confidence = "HIGH" if transaction["previous_payments"] > 3 else "MEDIUM"
        
        return Prediction(
            transaction_id=transaction["transaction_id"],
            recovery_probability=prob,
            expected_recovery_value=expected_val,
            confidence=confidence,
            risk_level=risk_level
        )
        
    def decide(self, transaction: dict, diagnosis: Diagnosis, prediction: Prediction) -> Decision:
        if prediction.risk_level == "HIGH":
            return Decision(
                transaction_id=transaction["transaction_id"],
                recommended_action=PaymentAction.ESCALATE,
                reasoning="High risk score detected, manual escalation required."
            )
            
        if prediction.expected_recovery_value < 10.0:
            return Decision(
                transaction_id=transaction["transaction_id"],
                recommended_action=PaymentAction.STOP,
                reasoning="Expected recovery value too low to pursue."
            )
            
        if diagnosis.root_cause in [FailureReason.ISSUER_UNAVAILABLE, FailureReason.NETWORK_ERROR]:
            return Decision(
                transaction_id=transaction["transaction_id"],
                recommended_action=PaymentAction.DELAYED_RETRY,
                reasoning="Temporary issue detected. Delayed retry has high probability of success."
            )
            
        if diagnosis.root_cause == FailureReason.EXPIRED_CARD:
            return Decision(
                transaction_id=transaction["transaction_id"],
                recommended_action=PaymentAction.PAYMENT_UPDATE_REQUEST,
                reasoning="Card is expired. Need customer to update payment details."
            )
            
        if diagnosis.root_cause == FailureReason.INSUFFICIENT_FUNDS:
            return Decision(
                transaction_id=transaction["transaction_id"],
                recommended_action=PaymentAction.ALTERNATE_PAYMENT_METHOD,
                reasoning="Insufficient funds. Best approach is suggesting alternate payment method."
            )
            
        if diagnosis.root_cause == FailureReason.B2B_RECEIVABLE_OVERDUE:
            return Decision(
                transaction_id=transaction["transaction_id"],
                recommended_action=PaymentAction.B2B_EMAIL_CHASER,
                reasoning="High value B2B transaction overdue. Best approach is a polite automated email chaser to secure a Promise to Pay."
            )
            
        if diagnosis.root_cause == FailureReason.CHECKOUT_ABANDONED:
            return Decision(
                transaction_id=transaction["transaction_id"],
                recommended_action=PaymentAction.HINGLISH_WHATSAPP_NUDGE,
                reasoning="Customer abandoned checkout. Conversational Hinglish WhatsApp nudge has the highest conversion rate."
            )
            
        # Default fallback
        return Decision(
            transaction_id=transaction["transaction_id"],
            recommended_action=PaymentAction.DELAYED_RETRY,
            reasoning="Fallback strategy: Delayed retry."
        )
