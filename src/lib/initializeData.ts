import { dataStore, InventoryItem, MenuItem, StaffMember, Order, Expense } from './dataStore';

export function initializeDataIfNeeded() {
  // Check if data already exists
  if (dataStore.getOrders().length > 0) {
    return; // Data already initialized
  }

  console.log('Initializing sample data...');

  // Initialize Inventory
  const inventory: Omit<InventoryItem, 'id'>[] = [
    { name: "Chicken Breast", category: "Meat", quantity: 15, unit: "kg", minLevel: 10, supplier: "Fresh Meats Co.", supplierContact: "+230 5xxx 1111", cost: 180, usagePerDay: 2.5 },
    { name: "Ground Beef", category: "Meat", quantity: 12, unit: "kg", minLevel: 5, supplier: "Fresh Meats Co.", supplierContact: "+230 5xxx 1111", cost: 220, usagePerDay: 1.8 },
    { name: "Rice", category: "Grains", quantity: 50, unit: "kg", minLevel: 20, supplier: "Rice Traders Inc.", supplierContact: "+230 5xxx 2222", cost: 40, usagePerDay: 8.0 },
    { name: "Noodles", category: "Grains", quantity: 25, unit: "kg", minLevel: 15, supplier: "Noodle Distributors", supplierContact: "+230 5xxx 3333", cost: 65, usagePerDay: 4.5 },
    { name: "Cooking Oil", category: "Spices", quantity: 8, unit: "L", minLevel: 5, supplier: "Golden Oil Supplier", supplierContact: "+230 5xxx 4444", cost: 150, usagePerDay: 1.2 },
    { name: "Soy Sauce", category: "Spices", quantity: 15, unit: "bottles", minLevel: 10, supplier: "Spice World", supplierContact: "+230 5xxx 5555", cost: 45, usagePerDay: 0.8 },
    { name: "Salt", category: "Spices", quantity: 10, unit: "kg", minLevel: 5, supplier: "Spice World", supplierContact: "+230 5xxx 5555", cost: 20, usagePerDay: 0.3 },
    { name: "Pepper", category: "Spices", quantity: 18, unit: "kg", minLevel: 3, supplier: "Spice World", supplierContact: "+230 5xxx 5555", cost: 180, usagePerDay: 0.2 },
    { name: "Flour", category: "Grains", quantity: 20, unit: "kg", minLevel: 10, supplier: "Grain Masters", supplierContact: "+230 5xxx 6666", cost: 35, usagePerDay: 2.0 },
    { name: "Eggs", category: "Dairy", quantity: 100, unit: "pcs", minLevel: 50, supplier: "Farm Fresh", supplierContact: "+230 5xxx 7777", cost: 6, usagePerDay: 15 },
    { name: "Vegetables Mix", category: "Vegetables", quantity: 12, unit: "kg", minLevel: 8, supplier: "Veggie Market", supplierContact: "+230 5xxx 8888", cost: 55, usagePerDay: 3.5 },
    { name: "Takeout Containers", category: "Packaging", quantity: 200, unit: "pcs", minLevel: 100, supplier: "Pack Plus", supplierContact: "+230 5xxx 9999", cost: 8, usagePerDay: 25 },
    { name: "Plastic Bags", category: "Packaging", quantity: 350, unit: "pcs", minLevel: 200, supplier: "Pack Plus", supplierContact: "+230 5xxx 9999", cost: 2, usagePerDay: 40 },
    { name: "Soft Drinks", category: "Beverages", quantity: 60, unit: "bottles", minLevel: 30, supplier: "Beverage Hub", supplierContact: "+230 5xxx 0000", cost: 25, usagePerDay: 12 },
    { name: "Tea Leaves", category: "Beverages", quantity: 5, unit: "kg", minLevel: 3, supplier: "Tea Imports", supplierContact: "+230 5xxx 1112", cost: 450, usagePerDay: 0.5 },
    { name: "Lemons", category: "Vegetables", quantity: 80, unit: "pcs", minLevel: 40, supplier: "Veggie Market", supplierContact: "+230 5xxx 8888", cost: 3, usagePerDay: 15 },
  ];

  inventory.forEach((item, index) => {
    const inventoryItem: InventoryItem = {
      ...item,
      id: index + 1,
      lastRestocked: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    };
    dataStore.getInventory().push(inventoryItem);
  });
  dataStore.saveInventory(dataStore.getInventory());

  // Initialize Menu
  const menu: Omit<MenuItem, 'id'>[] = [
    { name: "Crispy Fried Chicken", category: "Chicken", price: 200, image: "https://images.unsplash.com/photo-1694853651800-3e9b4aa96a42?w=400", available: true, preparationTime: 15, cost: 80, soldToday: 12, soldThisWeek: 45, ingredients: [{ name: "Chicken Breast", quantity: 0.2 }, { name: "Flour", quantity: 0.1 }, { name: "Cooking Oil", quantity: 0.05 }] },
    { name: "Chicken Fried Rice", category: "Fried Rice", price: 150, image: "https://images.unsplash.com/photo-1646340916384-9845d7686e2e?w=400", available: true, preparationTime: 10, cost: 55, soldToday: 18, soldThisWeek: 72, ingredients: [{ name: "Rice", quantity: 0.3 }, { name: "Chicken Breast", quantity: 0.1 }, { name: "Eggs", quantity: 1 }, { name: "Vegetables Mix", quantity: 0.1 }] },
    { name: "Pancit Canton", category: "Fried Noodles", price: 130, image: "https://images.unsplash.com/photo-1635685296916-95acaf58471f?w=400", available: true, preparationTime: 12, cost: 50, soldToday: 15, soldThisWeek: 58, ingredients: [{ name: "Noodles", quantity: 0.25 }, { name: "Vegetables Mix", quantity: 0.15 }, { name: "Soy Sauce", quantity: 0.05 }] },
    { name: "Spring Rolls (5pcs)", category: "Snacks", price: 100, image: "https://images.unsplash.com/photo-1762305195963-735f8bf9cad1?w=400", available: true, preparationTime: 8, cost: 35, soldToday: 22, soldThisWeek: 95, ingredients: [{ name: "Vegetables Mix", quantity: 0.1 }, { name: "Ground Beef", quantity: 0.08 }, { name: "Cooking Oil", quantity: 0.03 }] },
    { name: "Chicken Soup", category: "Soups", price: 110, image: "https://images.unsplash.com/photo-1701109876066-7fc0c08da447?w=400", available: true, preparationTime: 20, cost: 40, soldToday: 8, soldThisWeek: 34, ingredients: [{ name: "Chicken Breast", quantity: 0.15 }, { name: "Vegetables Mix", quantity: 0.1 }] },
    { name: "Lemon Iced Tea", category: "Drinks", price: 60, image: "https://images.unsplash.com/photo-1716925539259-ce0115263d37?w=400", available: true, preparationTime: 3, cost: 15, soldToday: 28, soldThisWeek: 156, ingredients: [{ name: "Tea Leaves", quantity: 0.01 }, { name: "Lemons", quantity: 1 }] },
    { name: "Burger Steak", category: "Snacks", price: 180, image: "https://images.unsplash.com/photo-1722125680299-783f98369451?w=400", available: true, preparationTime: 15, cost: 75, soldToday: 10, soldThisWeek: 42, ingredients: [{ name: "Ground Beef", quantity: 0.2 }, { name: "Cooking Oil", quantity: 0.04 }] },
    { name: "French Fries", category: "Snacks", price: 80, image: "https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=400", available: true, preparationTime: 10, cost: 25, soldToday: 25, soldThisWeek: 110, ingredients: [{ name: "Cooking Oil", quantity: 0.1 }] },
    { name: "Garlic Fried Rice", category: "Fried Rice", price: 70, image: "https://images.unsplash.com/photo-1646340916384-9845d7686e2e?w=400", available: true, preparationTime: 8, cost: 30, soldToday: 14, soldThisWeek: 68, ingredients: [{ name: "Rice", quantity: 0.25 }, { name: "Cooking Oil", quantity: 0.03 }] },
    { name: "Beef Noodles", category: "Fried Noodles", price: 170, image: "https://images.unsplash.com/photo-1635685296916-95acaf58471f?w=400", available: true, preparationTime: 12, cost: 68, soldToday: 11, soldThisWeek: 48, ingredients: [{ name: "Noodles", quantity: 0.3 }, { name: "Ground Beef", quantity: 0.15 }] },
    { name: "Chicken Wings (6pcs)", category: "Chicken", price: 220, image: "https://images.unsplash.com/photo-1694853651800-3e9b4aa96a42?w=400", available: true, preparationTime: 18, cost: 95, soldToday: 9, soldThisWeek: 38, ingredients: [{ name: "Chicken Breast", quantity: 0.25 }, { name: "Cooking Oil", quantity: 0.08 }] },
    { name: "Mango Juice", category: "Drinks", price: 65, image: "https://images.unsplash.com/photo-1716925539259-ce0115263d37?w=400", available: true, preparationTime: 3, cost: 20, soldToday: 16, soldThisWeek: 74, ingredients: [] },
  ];

  menu.forEach((item, index) => {
    dataStore.getMenu().push({ ...item, id: index + 1 });
  });
  dataStore.saveMenu(dataStore.getMenu());

  // Initialize Staff
  const staff: Omit<StaffMember, 'id'>[] = [
    { name: "Admin User", role: "Manager", email: "admin@jervis.mu", phone: "+230 5xxx 0001", hourlyRate: 150, status: "active", totalSales: 0, ordersCompleted: 0 },
    { name: "Sarah Johnson", role: "Cashier", email: "sarah@jervis.mu", phone: "+230 5xxx 0002", hourlyRate: 80, status: "active", totalSales: 0, ordersCompleted: 0 },
    { name: "Mike Chen", role: "Chef", email: "mike@jervis.mu", phone: "+230 5xxx 0003", hourlyRate: 120, status: "active", totalSales: 0, ordersCompleted: 0 },
    { name: "Lisa Wong", role: "Cashier", email: "lisa@jervis.mu", phone: "+230 5xxx 0004", hourlyRate: 80, status: "active", totalSales: 0, ordersCompleted: 0 },
  ];

  staff.forEach((member, index) => {
    dataStore.getStaff().push({ ...member, id: index + 1 });
  });
  dataStore.saveStaff(dataStore.getStaff());

  // Initialize sample orders for past 7 days
  const now = new Date();
  for (let day = 6; day >= 0; day--) {
    const ordersPerDay = Math.floor(Math.random() * 15) + 10;
    for (let i = 0; i < ordersPerDay; i++) {
      const orderDate = new Date(now);
      orderDate.setDate(orderDate.getDate() - day);
      orderDate.setHours(Math.floor(Math.random() * 12) + 8); // 8 AM to 8 PM
      orderDate.setMinutes(Math.floor(Math.random() * 60));

      const numItems = Math.floor(Math.random() * 3) + 1;
      const orderItems = [];
      const selectedMenuItems = [...menu].sort(() => 0.5 - Math.random()).slice(0, numItems);
      
      for (const menuItem of selectedMenuItems) {
        orderItems.push({
          id: menuItem.id || 0,
          name: menuItem.name,
          quantity: Math.floor(Math.random() * 2) + 1,
          price: menuItem.price,
          category: menuItem.category,
        });
      }

      const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discount = Math.random() < 0.2 ? Math.floor(subtotal * 0.1) : 0;
      const total = subtotal - discount;

      const prepStartTime = new Date(orderDate);
      prepStartTime.setMinutes(prepStartTime.getMinutes() + 2);
      const prepEndTime = new Date(prepStartTime);
      prepEndTime.setMinutes(prepEndTime.getMinutes() + Math.floor(Math.random() * 15) + 5);

      const order: Order = {
        id: Date.now() + Math.random(),
        orderNumber: `#${String(i + 1).padStart(3, '0')}`,
        items: orderItems,
        status: 'completed',
        timestamp: orderDate,
        table: Math.random() < 0.6 ? `Table ${Math.floor(Math.random() * 12) + 1}` : 'Takeout',
        cashier: staff[Math.floor(Math.random() * 2) + 1].name,
        paymentMethod: ['cash', 'card', 'mobile'][Math.floor(Math.random() * 3)] as any,
        total,
        discount,
        prepStartTime,
        prepEndTime,
        customerName: Math.random() < 0.5 ? ['John', 'Sarah', 'Mike', 'Lisa', 'Alex', 'Maria'][Math.floor(Math.random() * 6)] : undefined,
      };

      dataStore.getOrders().push(order);
    }
  }
  dataStore.saveOrders(dataStore.getOrders());

  // Initialize sample expenses
  const expenseCategories = ['Utilities', 'Supplies', 'Maintenance', 'Salaries', 'Marketing'];
  for (let day = 6; day >= 0; day--) {
    if (Math.random() < 0.6) {
      const expenseDate = new Date(now);
      expenseDate.setDate(expenseDate.getDate() - day);
      
      const expense: Expense = {
        id: Date.now() + Math.random(),
        category: expenseCategories[Math.floor(Math.random() * expenseCategories.length)],
        description: 'Sample expense',
        amount: Math.floor(Math.random() * 2000) + 500,
        date: expenseDate,
        paymentMethod: ['Cash', 'Bank Transfer'][Math.floor(Math.random() * 2)],
      };
      
      dataStore.getExpenses().push(expense);
    }
  }
  dataStore.saveExpenses(dataStore.getExpenses());

  // Log initialization
  dataStore.logActivity('System', 'Data Initialized', 'Sample data loaded successfully');

  console.log('Sample data initialized successfully!');
}
