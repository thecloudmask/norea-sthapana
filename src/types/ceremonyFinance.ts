// Ceremony Finance Types
// ប្រភេទទិន្នន័យសម្រាប់ហិរញ្ញវត្ថុកម្មវិធីបុណ្យ

export type Currency = 'USD' | 'KHR'

export type PaymentMethod = 
  | 'cash'
  | 'aba'
  | 'acleda'
  | 'wing'
  | 'truemoney'
  | 'qr'
  | 'other'

export type ExpenseCategory = 
  | 'supplies'
  | 'service'
  | 'food'
  | 'decoration'
  | 'other'

// Ceremony Income (ចំណូល)
export interface CeremonyIncome {
  id: string
  receiptNumber: string // Auto-generated: "INC-0001", "INC-0002"...
  
  ceremonyId: string
  
  // អ្នកផ្តល់ចំណូល (Donor Information)
  donorName: string
  donorPhone?: string
  donorAddress?: string
  
  // ហិរញ្ញវត្ថុ (Financial)
  amount: number
  currency: Currency
  
  // វិធីបង់ប្រាក់ (Payment Method)
  paymentMethod: PaymentMethod
  paymentMethodOther?: string // Used when paymentMethod = 'other'
  
  // បរិយាយ (Description)
  description?: string
  receiptUrl?: string // រូបភាពបង្កាន់ដៃ
  
  // Metadata
  createdAt: Date
  createdBy: string // Admin user ID
  updatedAt?: Date
  updatedBy?: string
}

// Ceremony Expense (ចំណាយ)
export interface CeremonyExpense {
  id: string
  expenseNumber: string // Auto-generated: "EXP-0001", "EXP-0002"...
  
  ceremonyId: string
  
  // ព័ត៌មានរបស់ (Item Information)
  itemName: string
  category: ExpenseCategory
  
  // ហិរញ្ញវត្ថុ (Financial)
  amount: number
  currency: Currency
  quantity?: number
  unitPrice?: number
  
  // អ្នកលក់ (Vendor)
  vendor?: string
  
  // បរិយាយ (Description)
  description?: string
  receiptUrl?: string // រូបភាពវិក្កយបត្រ
  
  // ព័ត៌មានបង់ប្រាក់ (Payment Info)
  paidBy?: string
  paidDate?: Date
  
  // Metadata
  createdAt: Date
  createdBy: string
  updatedAt?: Date
  updatedBy?: string
}

// Summary Statistics
export interface CeremonyFinanceSummary {
  totalIncome: {
    usd: number
    khr: number
  }
  totalExpense: {
    usd: number
    khr: number
  }
  balance: {
    usd: number
    khr: number
  }
  incomeCount: number
  expenseCount: number
}

// Duplicate Check Result
export interface DuplicateCheckResult {
  isDuplicate: boolean
  similarRecords: CeremonyIncome[]
  confidence: 'high' | 'medium' | 'low'
}

// Form Data Types
export interface IncomeFormData {
  donorName: string
  donorPhone?: string
  donorAddress?: string
  amount: number
  currency: Currency
  paymentMethod: PaymentMethod
  paymentMethodOther?: string
  description?: string
  receiptUrl?: string
}

export interface ExpenseFormData {
  itemName: string
  category: ExpenseCategory
  amount: number
  currency: Currency
  quantity?: number
  unitPrice?: number
  vendor?: string
  description?: string
  receiptUrl?: string
  paidBy?: string
  paidDate?: Date
}
