// ============================================================================
// Types Definition
// ============================================================================
// Contains all global interfaces and types used across the application.

/**
 * Represents a system user.
 */
export interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive'
  baseSalary: number
  hireDate: string
}

/**
 * Represents an actionable item in headers.
 */
export interface HeaderAction {
  label: string
  icon: string
  event?: string
  color?: string
  variant?: string
  size?: string
}

/**
 * Represents an application log entry.
 */
export interface AppLog {
  id: string
  message: string
  state: string
  level: 'success' | 'info' | 'warn' | 'error'
  timestamp: string
}

export * from './loan-type'
export * from './loan-application'
export * from './repayment'
export * from './approval'
export * from './payroll'

import type { ApprovalRole } from './approval'
export type SystemRole = ApprovalRole | 'Employee'
