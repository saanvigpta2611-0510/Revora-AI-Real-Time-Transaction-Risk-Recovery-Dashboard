# REVIVE AI
**Autonomous Revenue Recovery & Payment Intelligence Agent**

## The Problem
Merchants lose massive amounts of revenue daily due to failed payments. Failures can occur for reasons ranging from temporary issuer unavailability to expired cards and insufficient funds. Merchants cannot manually investigate thousands of failed transactions to figure out which are recoverable, and basic automatic retries often trigger fraud warnings or simply fail again.

## The Solution: REVIVE AI
REVIVE AI is an agentic workflow that acts as an intelligent recovery control tower. For every failed payment event, REVIVE AI observes the context, diagnoses the likely root cause, predicts recovery probability and expected value, decides on the best recovery intervention, evaluates this decision against strict policy guardrails, and executes the simulated action.

## Core Features
1. **Intelligent Diagnostics**: Classifies failure root causes based on transactional evidence.
2. **Predictive Recovery Engine**: Calculates expected recovery values and risk scores.
3. **Agentic Decision Flow**: Chooses from multiple interventions (Immediate/Delayed Retry, Payment Update, Reminder, Escalate).
4. **Deterministic Policy Engine**: Prevents risky actions. The AI does not have unrestricted authority.
5. **Action Simulator**: Simulates outcomes based on context.
6. **Detailed Audit Logs**: Complete transparency into exactly why the agent chose a specific action.

## Architecture

- **Backend**: Python (FastAPI, SQLite, Pandas). Modules separated for Simulator, Policy Engine, Recovery Engine, and Agent Workflow.
- **Frontend**: React + Vite (TailwindCSS, Recharts, Lucide Icons).
- **Current State**: Uses an internal simulated environment with 10,000 synthetic transactions to demonstrate value instantly without needing external APIs.

## How to Run

1. Open two terminals inside the `revive-ai` directory.

**Terminal 1: Backend**
```bash
cd backend
..\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```

2. Open your browser to `http://localhost:5173`

## Demo Flow

1. **Dashboard Start**: The dashboard starts empty, representing a fresh environment.
2. **"Run AI Recovery"**: Click the prominent button to initiate the agentic workflow. The agent will analyze 10,000 failed synthetic payment events.
3. **Review KPIs**: See the potential revenue at risk, baseline recovery comparison, and the new incremental revenue secured by the AI agent.
4. **Inspect Audit Log**: Click any transaction in the "Agent Activity" list to open the detailed Agent Reasoning panel.
5. **Verify Guardrails**: Observe how high-risk transactions or excessive retries are blocked by the Policy Engine or Escalated for manual review.

## Future Production Integration

In a live production environment (e.g., integrated with Razorpay infrastructure):
- The `generate_synthetic_data` pipeline would be replaced by webhooks from the payment gateway.
- The `simulate_action_outcome` would map directly to live Payment APIs (e.g., updating a subscription, dispatching an email notification via a CRM, calling Razorpay Retry API).
- AI reasoning would scale out using specialized inference models, heavily utilizing the deterministic Policy Engine to ensure safety at scale.
