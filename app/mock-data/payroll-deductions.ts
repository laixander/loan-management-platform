import type { PayrollDeduction } from "~/types";

export const mockPayrollDeductions: PayrollDeduction[] = [
    {
        "id": 1,
        "employeeId": 1,
        "employeeName": "John Doe",
        "loanRef": "LN-2026-001",
        "repaymentScheduleId": 2,
        "installmentNumber": 2,
        "payrollCycle": "2026-05-B",
        "cutoffDate": "2026-05-30T00:00:00Z",
        "deductionAmount": 4416.67,
        "status": "Scheduled",
        "processedDate": null
    },
    {
        "id": 2,
        "employeeId": 2,
        "employeeName": "Jane Smith",
        "loanRef": "LN-2026-002",
        "repaymentScheduleId": 4,
        "installmentNumber": 1,
        "payrollCycle": "2026-05-B",
        "cutoffDate": "2026-05-30T00:00:00Z",
        "deductionAmount": 3433.33,
        "status": "Scheduled",
        "processedDate": null
    }
]
;
