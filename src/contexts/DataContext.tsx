import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WorkOrder, Customer, Car, Invoice, ChatMessage, SMSTemplate, Part, PartRequest, PartQuote, TeamMember, ActivityLogEntry, TodoTask } from '../types';

interface DataContextType {
  workOrders: WorkOrder[];
  customers: Customer[];
  cars: Car[];
  invoices: Invoice[];
  chatMessages: ChatMessage[];
  smsTemplates: SMSTemplate[];
  parts: Part[];
  partRequests: PartRequest[];
  partQuotes: PartQuote[];
  teamMembers: TeamMember[];
  activityLog: ActivityLogEntry[];
  todoTasks: TodoTask[];
  addWorkOrder: (workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addCar: (car: Omit<Car, 'id'>) => void;
  updateCar: (id: string, updates: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  addPart: (part: Omit<Part, 'id'>) => void;
  updatePart: (id: string, updates: Partial<Part>) => void;
  deletePart: (id: string) => void;
  addPartRequest: (request: Omit<PartRequest, 'id' | 'createdAt'>) => void;
  updatePartRequest: (id: string, updates: Partial<PartRequest>) => void;
  addPartQuote: (quote: Omit<PartQuote, 'id' | 'createdAt'>) => void;
  updatePartQuote: (id: string, updates: Partial<PartQuote>) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  generateInvoice: (workOrderId: string) => Invoice;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt'>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  addTodoTask: (task: Omit<TodoTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodoTask: (id: string, updates: Partial<TodoTask>) => void;
  deleteTodoTask: (id: string) => void;
  logActivity: (activity: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
}

const DataContext = createContext<DataContextType | null>(null);

// Mock data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'James Murphy',
    phone: '+353 85 123 4567',
    email: 'james@email.com',
    address: '123 Main Street, Dublin',
    cars: [],
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    name: 'Mary O\'Connor',
    phone: '+353 85 123 4568',
    email: 'mary@email.com',
    address: '456 Oak Avenue, Cork',
    cars: [],
    createdAt: new Date('2024-01-15')
  }
];

const mockCars: Car[] = [
  {
    id: '1',
    registration: '24-D-12345',
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    customerId: '1',
    nctExpiry: new Date('2025-03-15'),
    serviceHistory: []
  },
  {
    id: '2',
    registration: '23-C-67890',
    make: 'Volkswagen',
    model: 'Golf',
    year: 2019,
    customerId: '2',
    nctExpiry: new Date('2025-01-20'),
    serviceHistory: []
  }
];

const mockParts: Part[] = [
  {
    id: '1',
    name: 'Engine Oil 5W-30',
    partNumber: 'EO-5W30-5L',
    description: 'High quality synthetic engine oil',
    quantity: 25,
    minQuantity: 5,
    unitPrice: 8.50,
    supplier: 'AutoParts Ltd',
    status: 'in_stock'
  },
  {
    id: '2',
    name: 'Oil Filter',
    partNumber: 'OF-TOY-001',
    description: 'Oil filter for Toyota vehicles',
    quantity: 3,
    minQuantity: 5,
    unitPrice: 15.00,
    supplier: 'Toyota Parts',
    status: 'low_stock'
  },
  {
    id: '3',
    name: 'Front Brake Pads',
    partNumber: 'BP-VW-001',
    description: 'Front brake pads for VW Golf',
    quantity: 0,
    minQuantity: 2,
    unitPrice: 45.00,
    supplier: 'Brake Masters',
    status: 'out_of_stock'
  },
  {
    id: '4',
    name: 'Air Filter',
    partNumber: 'AF-UNI-001',
    description: 'Universal air filter',
    quantity: 15,
    minQuantity: 3,
    unitPrice: 12.00,
    supplier: 'Filter Pro',
    status: 'in_stock'
  }
];

const mockPartRequests: PartRequest[] = [
  {
    id: '1',
    partId: '3',
    workOrderId: '1',
    garageId: 'garage-1',
    garageName: 'FIXWIZE Main',
    quantity: 2,
    urgency: 'high',
    description: 'Front brake pads for VW Golf 2019 - Customer waiting',
    maxPrice: 50.00,
    requestedDate: new Date('2024-12-18'),
    neededBy: new Date('2024-12-20'),
    status: 'open',
    quotes: [],
    createdAt: new Date('2024-12-18')
  },
  {
    id: '2',
    partId: '2',
    workOrderId: '2',
    garageId: 'garage-1',
    garageName: 'FIXWIZE Main',
    quantity: 5,
    urgency: 'medium',
    description: 'Oil filters for Toyota vehicles - Stock replenishment',
    maxPrice: 20.00,
    requestedDate: new Date('2024-12-17'),
    neededBy: new Date('2024-12-25'),
    status: 'open',
    quotes: [],
    createdAt: new Date('2024-12-17')
  }
];

const mockPartQuotes: PartQuote[] = [
  {
    id: '1',
    requestId: '1',
    supplierId: 'supplier-1',
    supplierName: 'Premium Auto Parts',
    partName: 'Front Brake Pads',
    partNumber: 'BP-VW-001-PREM',
    quantity: 2,
    unitPrice: 42.00,
    totalPrice: 84.00,
    availability: 'In Stock',
    deliveryTime: '24 hours',
    warranty: '2 years',
    notes: 'Premium quality brake pads with ceramic compound',
    validUntil: new Date('2024-12-25'),
    status: 'pending',
    createdAt: new Date('2024-12-18')
  }
];

const mockWorkOrders: WorkOrder[] = [
  {
    id: '1',
    carId: '1',
    customerId: '1',
    assignedTo: '2',
    dueDate: new Date('2024-12-20'),
    status: 'in_progress',
    description: 'Oil change and brake inspection',
    priority: 'medium',
    estimatedCost: 150,
    actualCost: 145,
    parts: [
      {
        id: '1',
        name: 'Engine Oil',
        quantity: 5,
        unitPrice: 8,
        status: 'delivered'
      },
      {
        id: '2',
        name: 'Oil Filter',
        quantity: 1,
        unitPrice: 15,
        status: 'delivered'
      }
    ],
    images: [],
    notes: ['Customer reported slight brake noise'],
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-16')
  },
  {
    id: '2',
    carId: '2',
    customerId: '2',
    dueDate: new Date('2024-12-22'),
    status: 'pending',
    description: 'Annual service and NCT preparation',
    priority: 'high',
    estimatedCost: 300,
    parts: [],
    images: [],
    notes: [],
    createdAt: new Date('2024-12-16'),
    updatedAt: new Date('2024-12-16')
  }
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    workOrderId: '1',
    invoiceNumber: 'INV-2024-001',
    customerId: '1',
    issueDate: new Date('2024-12-16'),
    dueDate: new Date('2025-01-15'),
    items: [
      {
        description: 'Oil change and brake inspection',
        quantity: 1,
        unitPrice: 145,
        total: 145
      },
      {
        description: 'Engine Oil (5L)',
        quantity: 1,
        unitPrice: 40,
        total: 40
      },
      {
        description: 'Oil Filter',
        quantity: 1,
        unitPrice: 15,
        total: 15
      }
    ],
    subtotal: 200,
    tax: 46,
    total: 246,
    status: 'sent'
  }
];

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Smith',
    message: 'Good morning team! Remember we have the Toyota Corolla service today.',
    timestamp: new Date('2024-12-16T08:00:00'),
    type: 'text'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Mike Johnson',
    message: 'Already on it! The parts arrived this morning.',
    timestamp: new Date('2024-12-16T08:05:00'),
    type: 'text'
  }
];

const mockSMSTemplates: SMSTemplate[] = [
  {
    id: '1',
    name: 'Work Order Confirmation',
    type: 'confirmation',
    content: 'Hi {customerName}, your car {carReg} is booked for service on {date}. We\'ll see you at {time}. - FIXWIZE Garage',
    isActive: true
  },
  {
    id: '2',
    name: 'Service Reminder',
    type: 'reminder',
    content: 'Reminder: Your car {carReg} has a service appointment tomorrow at {time}. Please bring your keys and any relevant documents. - FIXWIZE',
    isActive: true
  },
  {
    id: '3',
    name: 'NCT Reminder',
    type: 'nct_reminder',
    content: 'Hi {customerName}, your NCT expires on {nctDate} for {carReg}. Book your NCT test soon! - FIXWIZE',
    isActive: true
  }
];

const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm1',
    organizationId: '1',
    name: 'Sarah Connor',
    username: 'sarahc',
    phone: '+353 85 111 2222',
    email: 'sarah@fixwize.ie',
    role: 'manager',
    status: 'active',
    permissions: ['manage_customers', 'manage_work_orders', 'manage_invoices', 'view_reports', 'manage_parts'],
    lastActive: new Date(),
    createdAt: new Date('2024-11-01')
  },
  {
    id: 'tm2',
    organizationId: '1',
    name: 'Tom Wilson',
    username: 'tomw',
    phone: '+353 85 333 4444',
    email: 'tom@fixwize.ie',
    role: 'technician',
    status: 'active',
    permissions: ['view_customers', 'manage_work_orders', 'view_parts', 'update_work_status'],
    lastActive: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    createdAt: new Date('2024-11-15')
  }
];

const mockActivityLog: ActivityLogEntry[] = [
  {
    id: 'al1',
    organizationId: '1',
    userId: 'tm1',
    userName: 'Sarah Connor',
    action: 'create',
    resource: 'customer',
    resourceId: '1',
    description: 'Created new customer: James Murphy',
    details: 'Added customer with phone +353 85 123 4567',
    timestamp: new Date('2024-12-16T09:30:00')
  },
  {
    id: 'al2',
    organizationId: '1',
    userId: 'tm2',
    userName: 'Tom Wilson',
    action: 'update',
    resource: 'work_order',
    resourceId: '1',
    description: 'Updated work order status to in_progress',
    details: 'Changed status from pending to in_progress for Toyota Corolla service',
    timestamp: new Date('2024-12-16T10:15:00')
  },
  {
    id: 'al3',
    organizationId: '1',
    userId: 'tm1',
    userName: 'Sarah Connor',
    action: 'create',
    resource: 'invoice',
    resourceId: '1',
    description: 'Generated invoice INV-2024-001',
    details: 'Created invoice for work order #1 - Total: €246.00',
    timestamp: new Date('2024-12-16T11:00:00')
  }
];

const mockTodoTasks: TodoTask[] = [
  {
    id: 'todo1',
    organizationId: '1',
    userId: '1',
    userName: 'John Smith',
    title: 'Order headlight for BMW X5',
    description: 'Customer James Murphy needs a new headlight for his BMW X5. Order from BMW Parts supplier.',
    priority: 'high',
    status: 'pending',
    dueDate: new Date('2024-12-20T09:00:00'),
    reminderTime: new Date('2024-12-20T08:00:00'),
    category: 'order',
    relatedCustomerId: '1',
    relatedCarId: '1',
    tags: ['parts', 'bmw', 'urgent'],
    isRecurring: false,
    createdAt: new Date('2024-12-18T14:30:00'),
    updatedAt: new Date('2024-12-18T14:30:00')
  },
  {
    id: 'todo2',
    organizationId: '1',
    userId: '2',
    userName: 'Mike Johnson',
    title: 'Follow up with Mary about service feedback',
    description: 'Call Mary O\'Connor to get feedback on the recent service and ask about any issues.',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date('2024-12-19T15:00:00'),
    category: 'follow_up',
    relatedCustomerId: '2',
    tags: ['customer-service', 'feedback'],
    isRecurring: false,
    createdAt: new Date('2024-12-18T16:00:00'),
    updatedAt: new Date('2024-12-18T16:00:00')
  },
  {
    id: 'todo3',
    organizationId: '1',
    userId: '1',
    userName: 'John Smith',
    title: 'Weekly inventory check',
    description: 'Check all parts inventory levels and update minimum stock requirements.',
    priority: 'low',
    status: 'completed',
    dueDate: new Date('2024-12-18T10:00:00'),
    category: 'maintenance',
    tags: ['inventory', 'weekly'],
    isRecurring: true,
    recurringPattern: 'weekly',
    completedAt: new Date('2024-12-18T10:30:00'),
    createdAt: new Date('2024-12-11T10:00:00'),
    updatedAt: new Date('2024-12-18T10:30:00')
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [smsTemplates, setSmsTemplates] = useState<SMSTemplate[]>(mockSMSTemplates);
  const [parts, setParts] = useState<Part[]>(mockParts);
  const [partRequests, setPartRequests] = useState<PartRequest[]>(mockPartRequests);
  const [partQuotes, setPartQuotes] = useState<PartQuote[]>(mockPartQuotes);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(mockActivityLog);
  const [todoTasks, setTodoTasks] = useState<TodoTask[]>(mockTodoTasks);

  const logActivity = (activity: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
    const newActivity: ActivityLogEntry = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setActivityLog(prev => [newActivity, ...prev]);
  };

  const addWorkOrder = (workOrderData: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWorkOrder: WorkOrder = {
      ...workOrderData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setWorkOrders(prev => [...prev, newWorkOrder]);
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'create',
      resource: 'work_order',
      resourceId: newWorkOrder.id,
      description: `Created new work order: ${newWorkOrder.description}`,
      details: `Due date: ${newWorkOrder.dueDate.toLocaleDateString()}, Priority: ${newWorkOrder.priority}`
    });
  };

  const updateWorkOrder = (id: string, updates: Partial<WorkOrder>) => {
    setWorkOrders(prev => prev.map(wo => 
      wo.id === id ? { ...wo, ...updates, updatedAt: new Date() } : wo
    ));
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'update',
      resource: 'work_order',
      resourceId: id,
      description: `Updated work order`,
      details: `Changes: ${Object.keys(updates).join(', ')}`
    });
  };

  const deleteWorkOrder = (id: string) => {
    const workOrder = workOrders.find(wo => wo.id === id);
    setWorkOrders(prev => prev.filter(wo => wo.id !== id));
    
    if (workOrder) {
      logActivity({
        organizationId: 'current-org',
        userId: 'current-user',
        userName: 'Current User',
        action: 'delete',
        resource: 'work_order',
        resourceId: id,
        description: `Deleted work order: ${workOrder.description}`
      });
    }
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = customerData.id ? 
      { ...customerData, createdAt: customerData.createdAt || new Date() } as Customer :
      {
        ...customerData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
    setCustomers(prev => [...prev, newCustomer]);
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'create',
      resource: 'customer',
      resourceId: newCustomer.id,
      description: `Created new customer: ${newCustomer.name}`,
      details: `Phone: ${newCustomer.phone}, Email: ${newCustomer.email || 'N/A'}`
    });
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ));
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'update',
      resource: 'customer',
      resourceId: id,
      description: `Updated customer information`,
      details: `Changes: ${Object.keys(updates).join(', ')}`
    });
  };

  const deleteCustomer = (id: string) => {
    const customer = customers.find(c => c.id === id);
    setCustomers(prev => prev.filter(customer => customer.id !== id));
    setCars(prev => prev.filter(car => car.customerId !== id));
    setWorkOrders(prev => prev.filter(wo => wo.customerId !== id));
    
    if (customer) {
      logActivity({
        organizationId: 'current-org',
        userId: 'current-user',
        userName: 'Current User',
        action: 'delete',
        resource: 'customer',
        resourceId: id,
        description: `Deleted customer: ${customer.name}`
      });
    }
  };

  const addCar = (carData: Omit<Car, 'id'>) => {
    const newCar: Car = carData.id ? 
      carData as Car :
      {
        ...carData,
        id: Date.now().toString()
      };
    setCars(prev => [...prev, newCar]);
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'create',
      resource: 'car',
      resourceId: newCar.id,
      description: `Added new car: ${newCar.registration}`,
      details: `${newCar.make} ${newCar.model} (${newCar.year})`
    });
  };

  const updateCar = (id: string, updates: Partial<Car>) => {
    setCars(prev => prev.map(car => 
      car.id === id ? { ...car, ...updates } : car
    ));
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'update',
      resource: 'car',
      resourceId: id,
      description: `Updated car information`,
      details: `Changes: ${Object.keys(updates).join(', ')}`
    });
  };

  const deleteCar = (id: string) => {
    const car = cars.find(c => c.id === id);
    setCars(prev => prev.filter(car => car.id !== id));
    setWorkOrders(prev => prev.filter(wo => wo.carId !== id));
    
    if (car) {
      logActivity({
        organizationId: 'current-org',
        userId: 'current-user',
        userName: 'Current User',
        action: 'delete',
        resource: 'car',
        resourceId: id,
        description: `Deleted car: ${car.registration}`
      });
    }
  };

  const addPart = (partData: Omit<Part, 'id'>) => {
    const newPart: Part = {
      ...partData,
      id: Date.now().toString()
    };
    setParts(prev => [...prev, newPart]);
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'create',
      resource: 'part',
      resourceId: newPart.id,
      description: `Added new part: ${newPart.name}`,
      details: `Quantity: ${newPart.quantity}, Price: €${newPart.unitPrice}`
    });
  };

  const updatePart = (id: string, updates: Partial<Part>) => {
    setParts(prev => prev.map(part => 
      part.id === id ? { ...part, ...updates } : part
    ));
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'update',
      resource: 'part',
      resourceId: id,
      description: `Updated part information`,
      details: `Changes: ${Object.keys(updates).join(', ')}`
    });
  };

  const deletePart = (id: string) => {
    const part = parts.find(p => p.id === id);
    setParts(prev => prev.filter(part => part.id !== id));
    
    if (part) {
      logActivity({
        organizationId: 'current-org',
        userId: 'current-user',
        userName: 'Current User',
        action: 'delete',
        resource: 'part',
        resourceId: id,
        description: `Deleted part: ${part.name}`
      });
    }
  };

  const addPartRequest = (requestData: Omit<PartRequest, 'id' | 'createdAt'>) => {
    const newRequest: PartRequest = {
      ...requestData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setPartRequests(prev => [...prev, newRequest]);
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'create',
      resource: 'part_request',
      resourceId: newRequest.id,
      description: `Created part request: ${newRequest.description}`,
      details: `Quantity: ${newRequest.quantity}, Urgency: ${newRequest.urgency}`
    });
  };

  const updatePartRequest = (id: string, updates: Partial<PartRequest>) => {
    setPartRequests(prev => prev.map(request => 
      request.id === id ? { ...request, ...updates } : request
    ));
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'update',
      resource: 'part_request',
      resourceId: id,
      description: `Updated part request`,
      details: `Changes: ${Object.keys(updates).join(', ')}`
    });
  };

  const addPartQuote = (quoteData: Omit<PartQuote, 'id' | 'createdAt'>) => {
    const newQuote: PartQuote = {
      ...quoteData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setPartQuotes(prev => [...prev, newQuote]);
    
    // Add quote to the corresponding request
    setPartRequests(prev => prev.map(request => 
      request.id === quoteData.requestId 
        ? { ...request, quotes: [...request.quotes, newQuote] }
        : request
    ));
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'create',
      resource: 'part_quote',
      resourceId: newQuote.id,
      description: `Created part quote: ${newQuote.partName}`,
      details: `Price: €${newQuote.totalPrice}, Supplier: ${newQuote.supplierName}`
    });
  };

  const updatePartQuote = (id: string, updates: Partial<PartQuote>) => {
    setPartQuotes(prev => prev.map(quote => 
      quote.id === id ? { ...quote, ...updates } : quote
    ));
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'update',
      resource: 'part_quote',
      resourceId: id,
      description: `Updated part quote`,
      details: `Changes: ${Object.keys(updates).join(', ')}`
    });
  };

  const addChatMessage = (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString()
    };
    setInvoices(prev => [...prev, newInvoice]);
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'create',
      resource: 'invoice',
      resourceId: newInvoice.id,
      description: `Created invoice: ${newInvoice.invoiceNumber}`,
      details: `Total: €${newInvoice.total}, Status: ${newInvoice.status}`
    });
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id ? { ...invoice, ...updates } : invoice
    ));
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'update',
      resource: 'invoice',
      resourceId: id,
      description: `Updated invoice`,
      details: `Changes: ${Object.keys(updates).join(', ')}`
    });
  };

  const deleteInvoice = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    
    if (invoice) {
      logActivity({
        organizationId: 'current-org',
        userId: 'current-user',
        userName: 'Current User',
        action: 'delete',
        resource: 'invoice',
        resourceId: id,
        description: `Deleted invoice: ${invoice.invoiceNumber}`
      });
    }
  };

  const addTeamMember = (memberData: Omit<TeamMember, 'id' | 'createdAt'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTeamMembers(prev => [...prev, newMember]);
    
    logActivity({
      organizationId: memberData.organizationId,
      userId: 'current-user',
      userName: 'Current User',
      action: 'create',
      resource: 'team_member',
      resourceId: newMember.id,
      description: `Added team member: ${newMember.name}`,
      details: `Role: ${newMember.role}, Username: ${newMember.username}`
    });
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ));
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'update',
      resource: 'team_member',
      resourceId: id,
      description: `Updated team member`,
      details: `Changes: ${Object.keys(updates).join(', ')}`
    });
  };

  const deleteTeamMember = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    setTeamMembers(prev => prev.filter(member => member.id !== id));
    
    if (member) {
      logActivity({
        organizationId: member.organizationId,
        userId: 'current-user',
        userName: 'Current User',
        action: 'delete',
        resource: 'team_member',
        resourceId: id,
        description: `Removed team member: ${member.name}`
      });
    }
  };

  const addTodoTask = (taskData: Omit<TodoTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: TodoTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTodoTasks(prev => [...prev, newTask]);
    
    logActivity({
      organizationId: taskData.organizationId,
      userId: taskData.userId,
      userName: taskData.userName,
      action: 'create',
      resource: 'todo_task',
      resourceId: newTask.id,
      description: `Created task: ${newTask.title}`,
      details: `Priority: ${newTask.priority}, Due: ${newTask.dueDate?.toLocaleDateString() || 'No due date'}`
    });
  };

  const updateTodoTask = (id: string, updates: Partial<TodoTask>) => {
    setTodoTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    ));
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'update',
      resource: 'todo_task',
      resourceId: id,
      description: `Updated task`,
      details: `Changes: ${Object.keys(updates).join(', ')}`
    });
  };

  const deleteTodoTask = (id: string) => {
    const task = todoTasks.find(t => t.id === id);
    setTodoTasks(prev => prev.filter(task => task.id !== id));
    
    if (task) {
      logActivity({
        organizationId: task.organizationId,
        userId: 'current-user',
        userName: 'Current User',
        action: 'delete',
        resource: 'todo_task',
        resourceId: id,
        description: `Deleted task: ${task.title}`
      });
    }
  };

  const generateInvoice = (workOrderId: string): Invoice => {
    const workOrder = workOrders.find(wo => wo.id === workOrderId);
    if (!workOrder) throw new Error('Work order not found');

    const customer = customers.find(c => c.id === workOrder.customerId);
    if (!customer) throw new Error('Customer not found');

    const items: any[] = [
      {
        description: workOrder.description,
        quantity: 1,
        unitPrice: workOrder.actualCost || workOrder.estimatedCost || 0,
        total: workOrder.actualCost || workOrder.estimatedCost || 0
      }
    ];

    workOrder.parts.forEach(part => {
      items.push({
        description: part.name,
        quantity: part.quantity,
        unitPrice: part.unitPrice,
        total: part.quantity * part.unitPrice
      });
    });

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.23; // 23% VAT in Ireland
    const total = subtotal + tax;

    const invoice: Invoice = {
      id: Date.now().toString(),
      workOrderId,
      invoiceNumber: `INV-${Date.now()}`,
      customerId: workOrder.customerId,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      items,
      subtotal,
      tax,
      total,
      status: 'draft'
    };

    setInvoices(prev => [...prev, invoice]);
    
    logActivity({
      organizationId: 'current-org',
      userId: 'current-user',
      userName: 'Current User',
      action: 'create',
      resource: 'invoice',
      resourceId: invoice.id,
      description: `Generated invoice from work order: ${invoice.invoiceNumber}`,
      details: `Work Order: ${workOrder.description}, Total: €${total.toFixed(2)}`
    });
    
    return invoice;
  };

  return (
    <DataContext.Provider value={{
      workOrders,
      customers,
      cars,
      invoices,
      chatMessages,
      smsTemplates,
      parts,
      partRequests,
      partQuotes,
      teamMembers,
      activityLog,
      todoTasks,
      addWorkOrder,
      updateWorkOrder,
      deleteWorkOrder,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addCar,
      updateCar,
      deleteCar,
      addPart,
      updatePart,
      deletePart,
      addPartRequest,
      updatePartRequest,
      addPartQuote,
      updatePartQuote,
      addChatMessage,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      generateInvoice,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      addTodoTask,
      updateTodoTask,
      deleteTodoTask,
      logActivity
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}