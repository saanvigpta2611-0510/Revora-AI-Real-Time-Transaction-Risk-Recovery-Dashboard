# Revora AI – Real‑Time Transaction Risk & Recovery Dashboard

**Revora AI** is an end‑to‑end demo application that showcases how an autonomous AI‑driven workflow can detect, prioritize, and recover failed payment transactions in real time. The system ingests a stream of synthetic (or live) transactions, runs a risk‑assessment model, and presents actionable recovery metrics on an interactive dashboard.

---

## Key Features
- **Live risk scoring** – shows Revenue At Risk, total failures, and potential incremental recovery.
- **Simulation mode** – inject a manual transaction and instantly re‑run the AI batch to see the impact.
- **Agentic decision flow** – AI diagnoses failure root‑cause, predicts recovery value, and selects the optimal intervention while respecting strict policy guardrails.
- **Audit trail** – every simulation run writes a row to a `metrics` table, providing a full history of KPIs and decisions.
- **Cache‑buster implementation** – all frontend API calls include a timestamp query parameter, guaranteeing fresh data on each reload.

---

## Architecture Overview
- **Backend**: FastAPI (Python) + SQLite. Modules are organized into Simulator, Policy Engine, Recovery Engine, and Agent Workflow.
- **Frontend**: React + Vite, styled with TailwindCSS and visualised via Recharts. All data is fetched through Axios with cache‑busting query strings.
- **Data**: 10 000 synthetic transactions generated on startup; can be swapped for real webhook payloads in production.

---

## Getting Started
1. **Clone the repo** and install dependencies.
   ```bash
   git clone <repo‑url>
   cd revora-ai
   # Backend
   cd backend && python -m venv .venv && .\.venv\Scripts\activate && pip install -r requirements.txt
   # Frontend
   cd ../frontend && npm install
   ```
2. **Run the services** (two terminals):
   - Backend: `python -m uvicorn main:app --port 8000 --reload`
   - Frontend: `npm run dev`
3. Open `http://localhost:5173` in a browser.
4. Click **"Run AI Recovery"** to start the batch simulation. Use **"Inject Transaction"** to add a custom record and observe the metrics update instantly.

---

## Demo Flow
1. Dashboard loads with empty KPIs.
2. Press **Run AI Recovery** – the agent processes 10 000 failed transactions.
3. KPI cards update to show total failures, revenue at risk, and incremental recovery.
4. Click any transaction in the audit log to view the AI’s reasoning and any policy‑blocked actions.
5. Use **Inject Transaction** to add a test case; the dashboard refreshes with the new totals.

---

## Contributing
Feel free to open issues or submit pull requests. Follow the standard GitHub workflow:
1. Fork the repo.
2. Create a feature branch.
3. Ensure `npm run lint` and `pytest` (backend) pass.
4. Open a PR describing the change.

---

## License
This project is licensed under the MIT License.

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
