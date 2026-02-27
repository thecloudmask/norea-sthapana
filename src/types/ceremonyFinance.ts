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
  | 'food'
  | 'transport'
  | 'venue'
  | 'materials'
  | 'service'
  | 'monks'
  | 'music'
  | 'other'

// តារាងទិន្នន័យចំណូល-ចំណាយ និងគ្រប់គ្រងស្តុក
export interface OfferingItem {
  id?: string
  name: string
  quantity: number
  estimatedValue?: number // តម្លៃប៉ាន់ស្មានបើដឹង (ជាការស្ម័គ្រចិត្ត)
}

// Ceremony Income (ចំណូល)
export interface CeremonyIncome {
  id: string
  receiptNumber: string // Auto-generated: "INC-0001", "INC-0002"...
  
  ceremonyId: string
  
  // អ្នកផ្តល់ចំណូល (Donor Information)
  donorName: string
  donorPhone?: string
  donorAddress?: string
  
  // ហិរញ្ញវត្ថុ (Financial - អាចជា 0 បើចូលតែវត្ថុ)
  amount: number
  currency: Currency
  
  // វត្ថុទាន (Offering Items - អាចអត់មានបើចូលតែបច្ច័យ)
  items?: OfferingItem[]
  
  // វិធីបង់ប្រាក់ (Payment Method)
  paymentMethod: PaymentMethod
  paymentMethodOther?: string // Used when paymentMethod = 'other'
  
  // បរិយាយ (Description)
  description?: string
  receiptUrl?: string // រូបភាពបង្កាន់ដៃ
  
  // Metadata
  createdAt: any
  createdBy: string // Admin user ID
  updatedAt?: any
  updatedBy?: string
}

// Ceremony Expense (ចំណាយ)
export interface CeremonyExpense {
  id: string
  expenseNumber: string // Auto-generated: "EXP-0001", "EXP-0002"...
  
  // ប្រភេទចំណាយ (isInventoryPurchase = ទិញវត្ថុបញ្ចូលស្តុកវិញ)
  isInventoryPurchase?: boolean
  
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
  createdAt: any
  createdBy: string
  updatedAt?: any
  updatedBy?: string
}

// Inventory Summary
export interface InventorySummary {
  [itemName: string]: {
    donatedQuantity: number
    purchasedQuantity: number
    totalQuantity: number
  }
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
  inventory: InventorySummary
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
  items?: OfferingItem[]
  paymentMethod: PaymentMethod
  paymentMethodOther?: string
  description?: string
  receiptUrl?: string
}

export interface ExpenseFormData {
  itemName: string
  category: ExpenseCategory
  isInventoryPurchase?: boolean
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
