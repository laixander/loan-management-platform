import type { ApprovalStep } from "~/types";

export const mockApprovals: ApprovalStep[] = [
    {
        "id": 7,
        "loanApplicationId": 1,
        "loanRef": "LN-2026-001",
        "employeeName": "Liam Naguit",
        "requestedAmount": 50000,
        "stepOrder": 1,
        "role": "Supervisor",
        "approverId": null,
        "status": "Pending",
        "comments": null,
        "actionDate": null
    },
    {
        "id": 8,
        "loanApplicationId": 1,
        "loanRef": "LN-2026-001",
        "employeeName": "Liam Naguit",
        "requestedAmount": 50000,
        "stepOrder": 2,
        "role": "HR",
        "approverId": null,
        "status": "Pending",
        "comments": null,
        "actionDate": null
    },

    {
        "id": 1,
        "loanApplicationId": 4,
        "loanRef": "LN-2026-004",
        "employeeName": "Amara Okafor",
        "requestedAmount": 15000,
        "stepOrder": 1,
        "role": "Supervisor",
        "approverId": null,
        "status": "Pending",
        "comments": null,
        "actionDate": null
    },
    {
        "id": 2,
        "loanApplicationId": 4,
        "loanRef": "LN-2026-004",
        "employeeName": "Amara Okafor",
        "requestedAmount": 15000,
        "stepOrder": 2,
        "role": "HR",
        "approverId": null,
        "status": "Pending",
        "comments": null,
        "actionDate": null
    },
    {
        "id": 3,
        "loanApplicationId": 4,
        "loanRef": "LN-2026-004",
        "employeeName": "Amara Okafor",
        "requestedAmount": 15000,
        "stepOrder": 3,
        "role": "Finance",
        "approverId": null,
        "status": "Pending",
        "comments": null,
        "actionDate": null
    },
    {
        "id": 4,
        "loanApplicationId": 5,
        "loanRef": "LN-2026-005",
        "employeeName": "Kenji Tanaka",
        "requestedAmount": 20000,
        "stepOrder": 1,
        "role": "Supervisor",
        "approverId": 1,
        "status": "Approved",
        "comments": "Looks good.",
        "actionDate": "2026-05-20T10:00:00Z"
    },
    {
        "id": 5,
        "loanApplicationId": 5,
        "loanRef": "LN-2026-005",
        "employeeName": "Kenji Tanaka",
        "requestedAmount": 20000,
        "stepOrder": 2,
        "role": "HR",
        "approverId": null,
        "status": "Pending",
        "comments": null,
        "actionDate": null
    },
    {
        "id": 6,
        "loanApplicationId": 5,
        "loanRef": "LN-2026-005",
        "employeeName": "Kenji Tanaka",
        "requestedAmount": 20000,
        "stepOrder": 3,
        "role": "Finance",
        "approverId": null,
        "status": "Pending",
        "comments": null,
        "actionDate": null
    }
]
;
