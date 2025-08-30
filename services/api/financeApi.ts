import axiosInstance from './axiosInstance';
import { 
  ApiResponse, 
  IncomeRequest, 
  IncomeResponse, 
  FinanceOverview, 
  SummarySixMonths,
  Expense,
  Obligation,
  ExpenseCategory,
  ObligationType
} from '../../types/api';

export class FinanceApi {
  /**
   * Set income for a specific month
   */
  static async setIncome(month: string, amount: number): Promise<ApiResponse<IncomeResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<IncomeResponse>>('/set-income', {
        month,
        amount,
      });
      return response.data;
    } catch (error: any) {
      console.error('Set income error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to set income',
      };
    }
  }

  /**
   * Get income for a specific month
   */
  static async getIncome(month: string): Promise<ApiResponse<IncomeResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<IncomeResponse>>(`/get-income?month=${month}`);
      return response.data;
    } catch (error: any) {
      console.error('Get income error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get income',
      };
    }
  }

  /**
   * Get finance overview for a specific month
   */
  static async getFinanceOverview(month: string): Promise<ApiResponse<FinanceOverview>> {
    try {
      const response = await axiosInstance.get<ApiResponse<FinanceOverview>>(`/finance-overview?month=${month}`);
      return response.data;
    } catch (error: any) {
      console.error('Get finance overview error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get finance overview',
      };
    }
  }

  /**
   * Get summary for the last six months
   */
  static async getSummarySixMonths(): Promise<ApiResponse<SummarySixMonths>> {
    try {
      const response = await axiosInstance.get<ApiResponse<SummarySixMonths>>('/summary-six-months');
      return response.data;
    } catch (error: any) {
      console.error('Get summary six months error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get summary',
      };
    }
  }

  // Expenses API
  /**
   * Add a new expense
   */
  static async addExpense(expense: Omit<Expense, 'id'>): Promise<ApiResponse<Expense>> {
    try {
      const response = await axiosInstance.post<ApiResponse<Expense>>('/add-expenses', expense);
      return response.data;
    } catch (error: any) {
      console.error('Add expense error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to add expense',
      };
    }
  }

  /**
   * Get all expenses
   */
  static async getAllExpenses(): Promise<ApiResponse<Expense[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<Expense[]>>('/all-expenses');
      return response.data;
    } catch (error: any) {
      console.error('Get all expenses error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get expenses',
      };
    }
  }

  /**
   * Get current month expenses
   */
  static async getCurrentMonthExpenses(): Promise<ApiResponse<Expense[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<Expense[]>>('/expenses/current-month');
      return response.data;
    } catch (error: any) {
      console.error('Get current month expenses error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get current month expenses',
      };
    }
  }

  /**
   * Update an expense
   */
  static async updateExpense(id: string, data: Partial<Expense>): Promise<ApiResponse<Expense>> {
    try {
      const response = await axiosInstance.put<ApiResponse<Expense>>(`/update-expenses/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Update expense error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update expense',
      };
    }
  }

  /**
   * Delete an expense
   */
  static async deleteExpense(id: string): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.delete<ApiResponse>(`/delete-expenses/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete expense error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete expense',
      };
    }
  }

  // Obligations API
  /**
   * Add a new obligation
   */
  static async addObligation(obligation: Omit<Obligation, 'id'>): Promise<ApiResponse<Obligation>> {
    try {
      const response = await axiosInstance.post<ApiResponse<Obligation>>('/add-obligation', obligation);
      return response.data;
    } catch (error: any) {
      console.error('Add obligation error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to add obligation',
      };
    }
  }

  /**
   * Get all obligations
   */
  static async getObligations(): Promise<ApiResponse<Obligation[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<Obligation[]>>('/get-obligations');
      return response.data;
    } catch (error: any) {
      console.error('Get obligations error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get obligations',
      };
    }
  }

  /**
   * Update an obligation
   */
  static async updateObligation(id: string, data: Partial<Obligation>): Promise<ApiResponse<Obligation>> {
    try {
      const response = await axiosInstance.put<ApiResponse<Obligation>>(`/update-obligation/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Update obligation error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update obligation',
      };
    }
  }

  /**
   * Delete an obligation
   */
  static async deleteObligation(id: string): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.delete<ApiResponse>(`/delete-obligations/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete obligation error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete obligation',
      };
    }
  }
}
