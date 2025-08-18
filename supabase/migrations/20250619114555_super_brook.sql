/*
  # Demo Data for FIXWIZE System

  1. Demo Organizations
  2. Demo Users with different roles
  3. Demo Customers and Cars
  4. Demo Work Orders and Parts
*/

-- Insert demo organizations
INSERT INTO organizations (id, name, type, email, phone, address, vat_number, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'FIXWIZE Main Garage', 'garage', 'info@fixwize.ie', '+353 1 234 5678', '123 Main Street, Dublin, Ireland', 'IE1234567T', true),
('550e8400-e29b-41d4-a716-446655440001', 'Premium Auto Parts Ltd', 'parts_supplier', 'sales@premiumautoparts.ie', '+353 1 555 0123', 'Industrial Estate, Unit 15, Dublin 12, Ireland', 'IE9876543Z', true);

-- Insert demo users
INSERT INTO users (id, organization_id, email, password_hash, name, username, phone, role, permissions, is_active, email_verified) VALUES
-- FIXWIZE Garage Users
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'admin@fixwize.ie', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Smith', 'johnsmith', '+1234567890', 'admin', 
 ARRAY['manage_team', 'manage_customers', 'manage_work_orders', 'manage_invoices', 'manage_parts', 'view_reports', 'manage_settings'], true, true),

('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'mike@fixwize.ie', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mike Johnson', 'mikejohnson', '+1234567891', 'technician',
 ARRAY['view_customers', 'manage_work_orders', 'view_parts', 'update_work_status'], true, true),

('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'sarah@fixwize.ie', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Connor', 'sarahconnor', '+353 85 111 2222', 'manager',
 ARRAY['manage_customers', 'manage_work_orders', 'manage_invoices', 'view_reports', 'manage_parts'], true, true),

-- Parts Supplier Users
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 'manager@premiumautoparts.ie', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Premium Auto Parts Manager', 'premiummanager', '+353155501234', 'admin',
 ARRAY['manage_team', 'manage_parts', 'manage_quotes', 'view_reports'], true, true),

-- Customer Users
('550e8400-e29b-41d4-a716-446655440030', NULL, 'james@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'James Murphy', 'jamesmurphy', '+353 85 123 4567', 'customer',
 ARRAY['view_own_data'], true, true),

('550e8400-e29b-41d4-a716-446655440031', NULL, 'mary@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mary O''Connor', 'maryoconnor', '+353 85 123 4568', 'customer',
 ARRAY['view_own_data'], true, true);

-- Insert demo customers
INSERT INTO customers (id, organization_id, user_id, name, email, phone, address, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440030', 'James Murphy', 'james@email.com', '+353 85 123 4567', '123 Main Street, Dublin', true),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440031', 'Mary O''Connor', 'mary@email.com', '+353 85 123 4568', '456 Oak Avenue, Cork', true);

-- Insert demo cars
INSERT INTO cars (id, organization_id, customer_id, registration, make, model, year, color, nct_expiry) VALUES
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440040', '24-D-12345', 'Toyota', 'Corolla', 2020, 'Silver', '2025-03-15'),
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440041', '23-C-67890', 'Volkswagen', 'Golf', 2019, 'Blue', '2025-01-20');

-- Insert demo parts
INSERT INTO parts (id, organization_id, name, part_number, description, category, brand, supplier, quantity, min_quantity, unit_price, status) VALUES
('550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440000', 'Engine Oil 5W-30', 'EO-5W30-5L', 'High quality synthetic engine oil', 'Fluids', 'Castrol', 'AutoParts Ltd', 25, 5, 8.50, 'in_stock'),
('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440000', 'Oil Filter', 'OF-TOY-001', 'Oil filter for Toyota vehicles', 'Filters', 'Toyota', 'Toyota Parts', 3, 5, 15.00, 'low_stock'),
('550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440000', 'Front Brake Pads', 'BP-VW-001', 'Front brake pads for VW Golf', 'Brakes', 'Bosch', 'Brake Masters', 0, 2, 45.00, 'out_of_stock');

-- Insert demo work orders
INSERT INTO work_orders (id, organization_id, customer_id, car_id, assigned_to, work_order_number, title, description, status, priority, estimated_cost, due_date) VALUES
('550e8400-e29b-41d4-a716-446655440070', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440011', 'WO-2024-0001', 'Oil Change & Brake Inspection', 'Regular oil change and brake system inspection', 'in_progress', 'medium', 150.00, '2024-12-20 10:00:00'),
('550e8400-e29b-41d4-a716-446655440071', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440051', NULL, 'WO-2024-0002', 'Annual Service & NCT Prep', 'Annual service and NCT preparation', 'pending', 'high', 300.00, '2024-12-22 14:00:00');

-- Insert demo invoices
INSERT INTO invoices (id, organization_id, customer_id, work_order_id, invoice_number, issue_date, due_date, subtotal, tax_rate, tax_amount, total_amount, status) VALUES
('550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440070', 'INV-2024-0001', '2024-12-16', '2025-01-15', 200.00, 23.00, 46.00, 246.00, 'sent');

-- Insert demo invoice items
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price) VALUES
('550e8400-e29b-41d4-a716-446655440080', 'Oil change and brake inspection', 1, 145.00, 145.00),
('550e8400-e29b-41d4-a716-446655440080', 'Engine Oil (5L)', 1, 40.00, 40.00),
('550e8400-e29b-41d4-a716-446655440080', 'Oil Filter', 1, 15.00, 15.00);

-- Insert demo activity log
INSERT INTO activity_log (organization_id, user_id, action, resource_type, resource_id, description, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012', 'create', 'customer', '550e8400-e29b-41d4-a716-446655440040', 'Created new customer: James Murphy', '{"phone": "+353 85 123 4567"}'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011', 'update', 'work_order', '550e8400-e29b-41d4-a716-446655440070', 'Updated work order status to in_progress', '{"old_status": "pending", "new_status": "in_progress"}'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012', 'create', 'invoice', '550e8400-e29b-41d4-a716-446655440080', 'Generated invoice INV-2024-0001', '{"total": 246.00}');