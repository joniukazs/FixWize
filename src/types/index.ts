export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'technician' | 'parts_supplier' | 'customer';
  isActive: boolean;
  joinedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  cars: Car[];
  createdAt: Date;
}

export interface Car {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: number;
  customerId: string;
  nctExpiry?: Date;
  serviceHistory: ServiceRecord[];
}

export interface WorkOrder {
  id: string;
  carId: string;
  customerId: string;
  assignedTo?: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedCost?: number;
  actualCost?: number;
  parts: Part[];
  images: string[];
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceRecord {
  id: string;
  workOrderId: string;
  date: Date;
  description: string;
  cost: number;
  mileage?: number;
  parts: Part[];
  technician: string;
}

export interface Part {
  id: string;
  name: string;
  partNumber?: string;
  description?: string;
  quantity: number;
  minQuantity: number;
  unitPrice: number;
  supplier?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'ordered' | 'requested' | 'delivered' | 'installed';
}

export interface PartRequest {
  id: string;
  partId: string;
  workOrderId: string;
  garageId: string;
  garageName: string;
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
  description: string;
  maxPrice?: number;
  requestedDate: Date;
  neededBy: Date;
  status: 'open' | 'quoted' | 'accepted' | 'rejected' | 'fulfilled';
  quotes: PartQuote[];
  createdAt: Date;
}

export interface PartQuote {
  id: string;
  requestId: string;
  supplierId: string;
  supplierName: string;
  partName: string;
  partNumber?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  availability: string;
  deliveryTime: string;
  warranty?: string;
  notes?: string;
  validUntil: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
}

export interface Invoice {
  id: string;
  workOrderId: string;
  invoiceNumber: string;
  customerId: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface SMSTemplate {
  id: string;
  name: string;
  type: 'confirmation' | 'reminder' | 'nct_reminder' | 'custom';
  content: string;
  isActive: boolean;
}

export interface TeamMember {
  id: string;
  organizationId: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  role: 'admin' | 'manager' | 'technician' | 'receptionist' | 'parts_manager';
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
  lastActive?: Date;
  createdAt: Date;
}

export interface ActivityLogEntry {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  resource: string;
  resourceId?: string;
  description: string;
  details?: string;
  timestamp: Date;
}

export interface TodoTask {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate?: Date;
  reminderTime?: Date;
  category: 'general' | 'customer' | 'parts' | 'maintenance' | 'follow_up' | 'order';
  relatedCustomerId?: string;
  relatedWorkOrderId?: string;
  relatedCarId?: string;
  tags: string[];
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}