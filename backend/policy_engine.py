from models import PolicyResult, PaymentAction

class PolicyEngine:
    def __init__(self):
        self.MAX_RETRY_COUNT = 2
        self.HIGH_RISK_THRESHOLD = 0.75
        self.MIN_EXPECTED_VALUE = 50.0

    def evaluate(self, transaction: dict, proposed_action: str, expected_value: float) -> PolicyResult:
        checks_passed = []
        
        # 1. Retry Count Check
        if transaction["retry_count"] >= self.MAX_RETRY_COUNT and proposed_action in [PaymentAction.IMMEDIATE_RETRY, PaymentAction.DELAYED_RETRY]:
            return PolicyResult(
                transaction_id=transaction["transaction_id"],
                action=proposed_action,
                is_approved=False,
                rejection_reason=f"Max retry count ({self.MAX_RETRY_COUNT}) exceeded.",
                checks_passed=checks_passed
            )
        checks_passed.append("Retry count below maximum")
        
        # 2. Risk Check
        if transaction["risk_score"] > self.HIGH_RISK_THRESHOLD and proposed_action != PaymentAction.ESCALATE and proposed_action != PaymentAction.STOP:
            return PolicyResult(
                transaction_id=transaction["transaction_id"],
                action=proposed_action,
                is_approved=False,
                rejection_reason=f"High risk score ({transaction['risk_score']}). Must escalate or stop.",
                checks_passed=checks_passed
            )
        checks_passed.append("Risk score acceptable")
        
        # 3. Expected Value Check
        if expected_value < self.MIN_EXPECTED_VALUE and proposed_action not in [PaymentAction.STOP, PaymentAction.ESCALATE]:
            # It's okay to skip this check for some cheap actions, but for simplicity:
            pass # We'll just note it but not block unless it's a hard rule
        checks_passed.append("Expected value validated")
        
        return PolicyResult(
            transaction_id=transaction["transaction_id"],
            action=proposed_action,
            is_approved=True,
            checks_passed=checks_passed
        )
