# Walkthrough: Workflow & Approvals (Approval Queue)

I have successfully implemented the **Approval Queue** module, adding role-based workflow automation to the platform. 

## What was Accomplished

### 1. Role Simulation (Auth Switcher)
- **`useDemoAuth`**: Created a composable to manage the "Current Role" state using `useState` and local storage persistence.
- **FAB Role Switcher**: Upgraded the floating action button (bottom right) to include a dropdown menu. You can now toggle your identity seamlessly between `Supervisor`, `HR`, `Finance`, `Payroll`, and `Admin`.

### 2. Multi-Step Approval Engine
- **Data & Types**: Modeled the `ApprovalStep` entity. In `approvals.json`, I created mock workflow chains for our existing `Pending` and `Under Review` loan applications.
- **`useApprovals`**: This composable handles evaluating decisions. When you "Approve" or "Reject" a step, it updates the ledger and records an audit log.
- **Automation**: When a user rejects a step, the parent `LoanApplication` is automatically marked as `Rejected`. When a user approves the *final* step in the chain for an application, the system automatically reaches into `useLoanApplications` and updates the parent application to `Approved`!

### 3. User Interface
- **Navigation**: Added a new **Workflow & Approvals** top-level section in the sidebar, housing the Approval Queue.
- **Approval Queue Page (`/approvals`)**: A dynamic data table that filters in real-time based on your active role.
  - E.g., if you switch to `HR`, you will only see steps assigned to HR that are currently `Pending`.
  - Switching to `Admin` allows you to see all pending steps across the entire organization.
- **Decision Modal**: When you click "Review" on a step, a modal appears providing context (Applicant, Loan Ref, Amount). If you choose to Reject the application, the form uses Zod validation to strictly require a justification comment.

> [!TIP]
> **How to Test**
> 1. Ensure Demo Data is seeded (via the bottom-right FAB).
> 2. Navigate to **Workflow & Approvals > Approval Queue**.
> 3. Click the FAB in the bottom right and change your role to **HR**. Notice how the table instantly filters to show only HR-assigned pending steps.
> 4. Click **Review** on the `LN-2026-005` application step.
> 5. Select **Approve** and submit.
> 6. Because HR is not the final step for `LN-2026-005` (Finance is next), you can switch your role to **Finance** to see the subsequent step!
