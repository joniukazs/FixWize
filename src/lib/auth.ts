export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
  userType?: 'admin' | 'customer' | 'parts_supplier';
}

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  phone: string | null;
  role: 'admin' | 'manager' | 'technician' | 'receptionist' | 'parts_manager' | 'customer' | 'parts_supplier';
  permissions: string[];
  organizationId: string | null;
  organizationName?: string;
  organizationType?: 'garage' | 'parts_supplier';
  isActive: boolean;
  lastLogin: string | null;
}

// Mock users for demo mode - this will be updated dynamically
let mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@fixwize.ie',
    name: 'John Smith',
    username: 'johnsmith',
    phone: '+1234567890',
    role: 'admin',
    permissions: ['manage_team', 'manage_customers', 'manage_work_orders', 'manage_invoices', 'manage_parts', 'view_reports', 'manage_settings'],
    organizationId: '1',
    organizationName: 'FIXWIZE Main Garage',
    organizationType: 'garage',
    isActive: true,
    lastLogin: null
  },
  {
    id: '2',
    email: 'mike@fixwize.ie',
    name: 'Mike Johnson',
    username: 'mikejohnson',
    phone: '+1234567891',
    role: 'technician',
    permissions: ['view_customers', 'manage_work_orders', 'view_parts', 'update_work_status'],
    organizationId: '1',
    organizationName: 'FIXWIZE Main Garage',
    organizationType: 'garage',
    isActive: true,
    lastLogin: null
  },
  {
    id: '3',
    email: 'james@email.com',
    name: 'James Murphy',
    username: 'jamesmurphy',
    phone: '+353 85 123 4567',
    role: 'customer',
    permissions: ['view_own_data'],
    organizationId: null,
    isActive: true,
    lastLogin: null
  },
  {
    id: '4',
    email: 'mary@email.com',
    name: 'Mary O\'Connor',
    username: 'maryoconnor',
    phone: '+353 85 123 4568',
    role: 'customer',
    permissions: ['view_own_data'],
    organizationId: null,
    isActive: true,
    lastLogin: null
  },
  {
    id: '5',
    email: 'supplier@premiumautoparts.ie',
    name: 'Premium Auto Parts',
    username: 'premiumautoparts',
    phone: '+353155501234',
    role: 'parts_supplier',
    permissions: ['manage_team', 'manage_parts', 'manage_quotes', 'view_reports'],
    organizationId: '2',
    organizationName: 'Premium Auto Parts Ltd',
    organizationType: 'parts_supplier',
    isActive: true,
    lastLogin: null
  },
  // Add your user here
  {
    id: '6',
    email: 'joniukazs2x2@gmail.com',
    name: 'Jonas Kazlauskas',
    username: 'joniukazs2x2',
    phone: '+370 600 12345',
    role: 'admin',
    permissions: ['manage_team', 'manage_customers', 'manage_work_orders', 'manage_invoices', 'manage_parts', 'view_reports', 'manage_settings'],
    organizationId: '1',
    organizationName: 'FIXWIZE Main Garage',
    organizationType: 'garage',
    isActive: true,
    lastLogin: null
  }
];

// Store user passwords separately (in real app this would be hashed in database)
const userPasswords: { [email: string]: string } = {
  'admin@fixwize.ie': 'demo123',
  'mike@fixwize.ie': 'demo123',
  'james@email.com': 'demo123',
  'mary@email.com': 'demo123',
  'supplier@premiumautoparts.ie': 'demo123',
  'joniukazs2x2@gmail.com': 'rusla020508*'
};

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      let user;

      if (credentials.email && credentials.password) {
        // Email/password login
        user = await this.loginWithEmailPassword(credentials.email, credentials.password);
      } else if (credentials.phone) {
        // Phone-only login (demo mode)
        user = await this.loginWithPhone(credentials.phone, credentials.userType);
      } else {
        throw new Error('Invalid login credentials');
      }

      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw the original error instead of creating a generic one
    }
  }

  private async loginWithEmailPassword(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Convert email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase();

    // Check if password matches
    const storedPassword = userPasswords[normalizedEmail];
    if (!storedPassword || storedPassword !== password) {
      throw new Error('Invalid email or password');
    }

    const user = mockUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    return user;
  }

  private async loginWithPhone(phone: string, userType?: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (userType === 'customer') {
      // For customer login, create a customer user
      const existingCustomer = mockUsers.find(u => u.phone === phone && u.role === 'customer');
      if (existingCustomer) {
        return existingCustomer;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email: `customer${Date.now()}@demo.com`,
        name: phone === '+353 85 123 4567' ? 'James Murphy' : 
              phone === '+353 85 123 4568' ? 'Mary O\'Connor' : 'Customer',
        username: `customer${Date.now()}`,
        phone,
        role: 'customer',
        permissions: ['view_own_data'],
        organizationId: null,
        isActive: true,
        lastLogin: null
      };
      return newUser;
    } else if (userType === 'parts_supplier') {
      // For parts supplier login
      const existingSupplier = mockUsers.find(u => u.phone === phone && u.role === 'parts_supplier');
      if (existingSupplier) {
        return existingSupplier;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email: `supplier${Date.now()}@demo.com`,
        name: 'Premium Auto Parts',
        username: `supplier${Date.now()}`,
        phone,
        role: 'parts_supplier',
        permissions: ['manage_team', 'manage_parts', 'manage_quotes', 'view_reports'],
        organizationId: '2',
        organizationName: 'Premium Auto Parts Ltd',
        organizationType: 'parts_supplier',
        isActive: true,
        lastLogin: null
      };
      return newUser;
    } else {
      const foundUser = mockUsers.find(u => u.phone === phone);
      if (foundUser) {
        return foundUser;
      } else {
        // First user becomes admin
        const newUser: User = {
          id: Date.now().toString(),
          email: `user${Date.now()}@demo.com`,
          name: 'New User',
          username: `user${Date.now()}`,
          phone,
          role: 'admin',
          permissions: ['manage_team', 'manage_customers', 'manage_work_orders', 'manage_invoices', 'manage_parts', 'view_reports', 'manage_settings'],
          organizationId: '1',
          organizationName: 'Demo Garage',
          organizationType: 'garage',
          isActive: true,
          lastLogin: null
        };
        return newUser;
      }
    }
  }

  async createTeamMember(memberData: {
    organizationId: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    password: string;
    permissions: string[];
  }): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if username/email already exists (case-insensitive for email)
    const existingUser = mockUsers.find(u => 
      u.username === memberData.username || 
      u.email.toLowerCase() === memberData.email.toLowerCase()
    );
    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: memberData.email,
      name: memberData.name,
      username: memberData.username,
      phone: memberData.phone,
      role: memberData.role as any,
      permissions: memberData.permissions,
      organizationId: memberData.organizationId,
      organizationName: this.currentUser?.organizationName,
      organizationType: this.currentUser?.organizationType,
      isActive: true,
      lastLogin: null
    };

    // Add to mock users array
    mockUsers.push(newUser);
    
    // Store password
    userPasswords[memberData.email.toLowerCase()] = memberData.password;

    return newUser;
  }

  async updateTeamMember(memberId: string, updates: Partial<{
    name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    permissions: string[];
    isActive: boolean;
  }>): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userIndex = mockUsers.findIndex(u => u.id === memberId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const oldEmail = mockUsers[userIndex].email.toLowerCase();
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates
    };

    // If email changed, update password storage
    if (updates.email && updates.email.toLowerCase() !== oldEmail) {
      const password = userPasswords[oldEmail];
      if (password) {
        userPasswords[updates.email.toLowerCase()] = password;
        delete userPasswords[oldEmail];
      }
    }
  }

  async deleteTeamMember(memberId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userIndex = mockUsers.findIndex(u => u.id === memberId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const email = mockUsers[userIndex].email.toLowerCase();
    
    // Remove from users array
    mockUsers.splice(userIndex, 1);
    
    // Remove password
    delete userPasswords[email];
  }

  async getTeamMembers(organizationId: string): Promise<User[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return mockUsers.filter(u => u.organizationId === organizationId);
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  hasPermission(permission: string): boolean {
    return this.currentUser?.permissions.includes(permission) || false;
  }

  isRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  // Method to get all users (for debugging)
  getAllUsers(): User[] {
    return mockUsers;
  }

  // Method to get all passwords (for debugging - remove in production)
  getAllPasswords(): { [email: string]: string } {
    return userPasswords;
  }
}

export const authService = AuthService.getInstance();