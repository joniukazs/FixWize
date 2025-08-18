/*
  # Authentication and User Management Schema

  1. New Tables
    - `organizations` - Company/garage information
    - `users` - User accounts with authentication
    - `user_sessions` - Active user sessions
    - `user_permissions` - Role-based permissions
    
  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    - Secure password handling
    
  3. Features
    - Email/password authentication
    - Role-based access control
    - Organization-based data isolation
    - Session management
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('garage', 'parts_supplier')),
  email text,
  phone text,
  address text,
  vat_number text,
  website text,
  logo_url text,
  settings jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  username text UNIQUE NOT NULL,
  phone text,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'technician', 'receptionist', 'parts_manager', 'customer', 'parts_supplier')),
  permissions text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  email_verified boolean DEFAULT false,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create customers table (separate from users for better organization)
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  address text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  registration text NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  color text,
  vin text,
  nct_expiry date,
  insurance_expiry date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create work orders table
CREATE TABLE IF NOT EXISTS work_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  car_id uuid REFERENCES cars(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  work_order_number text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'on_hold', 'cancelled')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  estimated_cost decimal(10,2),
  actual_cost decimal(10,2),
  estimated_hours decimal(5,2),
  actual_hours decimal(5,2),
  due_date timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  notes text[],
  attachments jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create parts table
CREATE TABLE IF NOT EXISTS parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  part_number text,
  description text,
  category text,
  brand text,
  supplier text,
  quantity integer NOT NULL DEFAULT 0,
  min_quantity integer NOT NULL DEFAULT 0,
  unit_price decimal(10,2) NOT NULL DEFAULT 0,
  cost_price decimal(10,2),
  location text,
  barcode text,
  status text NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock', 'ordered', 'discontinued')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  work_order_id uuid REFERENCES work_orders(id) ON DELETE SET NULL,
  invoice_number text UNIQUE NOT NULL,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  tax_rate decimal(5,2) NOT NULL DEFAULT 23.00,
  tax_amount decimal(10,2) NOT NULL DEFAULT 0,
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  paid_amount decimal(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  payment_method text,
  payment_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity decimal(10,2) NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL DEFAULT 0,
  total_price decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Organizations policies
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can update their organization"
  ON organizations FOR UPDATE
  TO authenticated
  USING (id IN (
    SELECT organization_id FROM users 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  ));

-- Users policies
CREATE POLICY "Users can view users in their organization"
  ON users FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can manage users in their organization"
  ON users FOR ALL
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  ));

-- Customers policies
CREATE POLICY "Users can view customers in their organization"
  ON customers FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage customers in their organization"
  ON customers FOR ALL
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Cars policies
CREATE POLICY "Users can view cars in their organization"
  ON cars FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage cars in their organization"
  ON cars FOR ALL
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Work orders policies
CREATE POLICY "Users can view work orders in their organization"
  ON work_orders FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage work orders in their organization"
  ON work_orders FOR ALL
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Parts policies
CREATE POLICY "Users can view parts in their organization"
  ON parts FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage parts in their organization"
  ON parts FOR ALL
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Invoices policies
CREATE POLICY "Users can view invoices in their organization"
  ON invoices FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage invoices in their organization"
  ON invoices FOR ALL
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Invoice items policies
CREATE POLICY "Users can view invoice items through invoices"
  ON invoice_items FOR SELECT
  TO authenticated
  USING (invoice_id IN (
    SELECT i.id FROM invoices i
    JOIN users u ON u.organization_id = i.organization_id
    WHERE u.id = auth.uid()
  ));

CREATE POLICY "Users can manage invoice items through invoices"
  ON invoice_items FOR ALL
  TO authenticated
  USING (invoice_id IN (
    SELECT i.id FROM invoices i
    JOIN users u ON u.organization_id = i.organization_id
    WHERE u.id = auth.uid()
  ));

-- Activity log policies
CREATE POLICY "Users can view activity log in their organization"
  ON activity_log FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert activity log in their organization"
  ON activity_log FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_customers_organization_id ON customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_cars_organization_id ON cars(organization_id);
CREATE INDEX IF NOT EXISTS idx_cars_customer_id ON cars(customer_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_organization_id ON work_orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_customer_id ON work_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_car_id ON work_orders(car_id);
CREATE INDEX IF NOT EXISTS idx_parts_organization_id ON parts(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_organization_id ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_organization_id ON activity_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);

-- Create functions for common operations

-- Function to generate unique work order numbers
CREATE OR REPLACE FUNCTION generate_work_order_number(org_id uuid)
RETURNS text AS $$
DECLARE
  year_suffix text;
  sequence_num integer;
  work_order_num text;
BEGIN
  year_suffix := EXTRACT(year FROM CURRENT_DATE)::text;
  
  SELECT COALESCE(MAX(
    CASE 
      WHEN work_order_number ~ ('^WO-' || year_suffix || '-[0-9]+$')
      THEN CAST(SUBSTRING(work_order_number FROM '[0-9]+$') AS integer)
      ELSE 0
    END
  ), 0) + 1
  INTO sequence_num
  FROM work_orders 
  WHERE organization_id = org_id;
  
  work_order_num := 'WO-' || year_suffix || '-' || LPAD(sequence_num::text, 4, '0');
  
  RETURN work_order_num;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number(org_id uuid)
RETURNS text AS $$
DECLARE
  year_suffix text;
  sequence_num integer;
  invoice_num text;
BEGIN
  year_suffix := EXTRACT(year FROM CURRENT_DATE)::text;
  
  SELECT COALESCE(MAX(
    CASE 
      WHEN invoice_number ~ ('^INV-' || year_suffix || '-[0-9]+$')
      THEN CAST(SUBSTRING(invoice_number FROM '[0-9]+$') AS integer)
      ELSE 0
    END
  ), 0) + 1
  INTO sequence_num
  FROM invoices 
  WHERE organization_id = org_id;
  
  invoice_num := 'INV-' || year_suffix || '-' || LPAD(sequence_num::text, 4, '0');
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON parts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();