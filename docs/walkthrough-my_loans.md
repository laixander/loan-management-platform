# Walkthrough: Employee Self-Service (My Loans)

I have successfully implemented the **My Loans** dashboard, the first module of the Employee Self-Service group! This provides a secure, restricted view for employees to track their own applications and historical data.

## What was Accomplished

### 1. Identity & Auth Simulation
I added the `Employee` role to the **Demo Control Center (FAB)** dropdown. 
When you select "Simulate Employee", the `useDemoAuth` composable instantly locks your `currentEmployeeId` to `1` (simulating Maria Santos).

### 2. Secure Data Layer
I built the `useMyLoans.ts` composable. It sits securely on top of `useLoanApplications`, `useSchedules`, and `useRepayments`. It mathematically guarantees that it will *only* return data where `employeeId === currentEmployeeId`, effectively acting as a client-side firewall for the demo.

### 3. Employee Dashboard & Details View
- **My Loans Dashboard**: A beautiful, card-based interface listing the employee's historical and active loans.
- **Security Check**: If you visit this page while simulating Admin, HR, etc., you will be blocked by a friendly "Employee Access Required" shield.
- **Detailed View**: Clicking into a specific loan opens a detailed page featuring:
  - Key financial metrics (Approved Amount, Total Paid, Outstanding Balance).
  - A tab for the **Amortization Schedule**.
  - A tab for the **Transaction Ledger** (which pulls directly from the Repayment Tracker).

> [!TIP]
> **How to Test the Employee View**
> 1. Look at the bottom right corner of your screen and open the FAB Demo Control Center.
> 2. Select **Simulate Employee**.
> 3. Notice the sidebar now has an "Employee Self-Service" section. Click **My Loans**.
> 4. You should see Maria Santos's two loans (one Pending, one Active).
> 5. Click the Active **Cash Advance** loan.
> 6. Explore the beautiful key metrics, amortization schedule, and the raw ledger pulls.
> 7. Finally, try changing your role back to **Admin** via the FAB and watch the dashboard instantly lock down!
