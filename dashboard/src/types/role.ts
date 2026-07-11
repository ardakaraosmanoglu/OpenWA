// Role types for RBAC
export type UserRole = 'admin' | 'operator' | 'viewer' | 'customer';

export interface RoleContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  isAdmin: boolean;
  isOperator: boolean;
  isViewer: boolean;
  isCustomer: boolean;
  canWrite: boolean;
}
