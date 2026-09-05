from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class FailureReason(str, Enum):
    ISSUER_UNAVAILABLE = "issuer_unavailable"
    NETWORK_ERROR = "network_error"
    EXPIRED_CARD = "expired_card"
    INSUFFICIENT_FUNDS = "insufficient_funds"
    AUTHENTICATION_FAILED = "authentication_failed"
    CHECKOUT_ABANDONED = "checkout_abandoned"
    SUBSCRIPTION_FAILED = "subscription_failed"
    HIGH_RISK = "high_risk"
    B2B_RECEIVABLE_OVERDUE = "b2b_receivable_overdue"

class PaymentAction(str, Enum):
    IMMEDIATE_RETRY = "immediate_retry"
    DELAYED_RETRY = "delayed_retry"
    PAYMENT_UPDATE_REQUEST = "payment_update_request"
    PAYMENT_REMINDER = "payment_reminder"
    ALTERNATE_PAYMENT_METHOD = "alternate_payment_method"
    HINGLISH_WHATSAPP_NUDGE = "hinglish_whatsapp_nudge"
    B2B_EMAIL_CHASER = "b2b_email_chaser"
    ESCALATE = "escalate"
    STOP = "stop"

class ActionStatus(str, Enum):
    APPROVED = "approved"
    REJECTED = "rejected"
    EXECUTED = "executed"
    RECOVERED = "recovered"
    FAILED = "failed"
    ESCALATED = "escalated"
    PROMISE_TO_PAY = "promise_to_pay"

class TransactionData(BaseModel):
    transaction_id: str
    merchant_id: str
    merchant_name: str
    customer_id: str
    amount: float
    payment_method: str
    bank: str
    failure_type: FailureReason
    customer_success_rate: float
    previous_payments: int
    retry_count: int
    timestamp: datetime
    risk_score: float

class Diagnosis(BaseModel):
    transaction_id: str
    root_cause: FailureReason
    evidence: List[str]

class Prediction(BaseModel):
    transaction_id: str
    recovery_probability: float
    expected_recovery_value: float
    confidence: str
    risk_level: str

class Decision(BaseModel):
    transaction_id: str
    recommended_action: PaymentAction
    reasoning: str

class PolicyResult(BaseModel):
    transaction_id: str
    action: PaymentAction
    is_approved: bool
    rejection_reason: Optional[str] = None
    checks_passed: List[str]

class AuditEvent(BaseModel):
    event_id: str
    transaction_id: str
    timestamp: datetime
    diagnosis: str
    evidence: List[str]
    recovery_probability: float
    expected_recovery_value: float
    selected_action: str
    policy_approved: bool
    policy_checks: List[str]
    execution_result: str
    recovered_amount: float
    final_status: str
    transcript: Optional[List[Dict[str, str]]] = None

class DashboardMetrics(BaseModel):
    revenue_at_risk: float
    baseline_recovery: float
    ai_recovered: float
    incremental_recovery: float
    recovery_rate: float
    total_failed: int
    total_recovered: int
    total_escalated: int
    total_stopped: int
    total_failed_interventions: int
