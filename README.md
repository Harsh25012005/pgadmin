# PG Admin - Complete PG Management Solution 🏠

A comprehensive React Native application built with Expo for managing Paying Guest (PG) accommodations. This app provides a complete solution for PG owners to manage tenants, payments, rooms, complaints, and announcements with both light and dark mode support.

## ✨ Features

### 🏠 **Dashboard Overview**
- Real-time statistics and analytics
- Quick action buttons for common tasks
- Recent activity feed
- Payment alerts and notifications

### 👥 **Tenant Management**
- Complete tenant profiles with contact information
- Room assignment and status tracking
- Deposit and payment history
- Active/inactive status management

### 💳 **Payment Tracking**
- Record rent, deposit, and maintenance payments
- Payment status tracking (paid, pending, overdue)
- Payment history and receipts
- Automated payment reminders

### 🏨 **Room Management**
- Room inventory with detailed information
- Occupancy status (occupied, vacant, maintenance)
- Facility management and room types
- Floor-wise organization

### 📋 **Complaint Management**
- Tenant complaint submission and tracking
- Priority levels and category classification
- Status updates and resolution tracking
- Communication history

### 📢 **Announcements**
- Broadcast important notices to tenants
- Category-based announcements (maintenance, events, rules)
- Expiry date management
- Active/inactive status control

### 🎨 **Theme Support**
- Light and dark mode toggle
- System theme detection
- Consistent color scheme across all screens
- Accessibility-friendly design

### 📊 **Reports & Analytics**
- Revenue tracking and financial reports
- Occupancy statistics
- Payment collection reports
- Complaint resolution metrics

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pgadmin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional required packages**
   ```bash
   npm install @react-native-async-storage/async-storage@^2.1.0
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your preferred platform**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app for physical device

## 📱 App Structure

```
app/
├── (tabs)/                 # Tab navigation screens
│   ├── index.tsx          # Home/Dashboard
│   ├── tenants.tsx        # Tenant list
│   ├── payments.tsx       # Payment list
│   ├── rooms.tsx          # Room list
│   └── more.tsx           # More options
├── tenants/
│   └── add.tsx            # Add tenant form
├── payments/
│   └── add.tsx            # Add payment form
├── rooms/
│   └── add.tsx            # Add room form
└── _layout.tsx            # Root layout

components/
├── ui/                    # Reusable UI components
│   ├── Card.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   └── StatusBadge.tsx
└── ...

contexts/
├── ThemeContext.tsx       # Theme management
└── DataContext.tsx        # Data management

utils/
└── sampleData.ts          # Sample data for testing
```

## 🎯 Key Features Implemented

### ✅ **Completed Features**
- ✅ Light/Dark theme support with system detection
- ✅ Complete navigation structure with tab-based layout
- ✅ Dashboard with real-time statistics and quick actions
- ✅ Tenant management (list, add forms)
- ✅ Payment tracking (list, add forms)
- ✅ Room management (list, add forms)
- ✅ Data persistence with AsyncStorage
- ✅ Sample data initialization for testing
- ✅ Responsive UI components
- ✅ Form validation and error handling

### 🔄 **In Progress**
- Edit forms for tenants, payments, and rooms
- Detail view pages for individual records
- Complaint management system
- Announcement management
- Report generation

### 📋 **Planned Features**
- Data export/import functionality
- Push notifications
- Advanced filtering and search
- Backup and restore
- Multi-language support

## 🎨 Design System

### **Color Scheme**
- **Light Mode**: Clean, professional appearance with blue primary colors
- **Dark Mode**: Easy on the eyes with consistent contrast ratios
- **Status Colors**: Green (success), Orange (warning), Red (error), Blue (info)

### **Typography**
- Clear hierarchy with consistent font sizes
- Accessible text contrast ratios
- Responsive text scaling

### **Components**
- Consistent card-based layout
- Intuitive navigation patterns
- Touch-friendly button sizes
- Clear visual feedback

## 📊 Sample Data

The app comes pre-loaded with sample data including:
- **4 Sample Tenants** with different statuses
- **6 Sample Rooms** with various configurations
- **6 Sample Payments** showing different payment types and statuses
- **4 Sample Complaints** with different priorities and statuses
- **5 Sample Announcements** for different scenarios

## 🔧 Configuration

### **Theme Configuration**
The app automatically detects system theme preference and allows manual override:
```typescript
// Available themes: 'light', 'dark', 'system'
const { theme, setTheme, isDark } = useTheme();
```

### **Data Management**
All data is stored locally using AsyncStorage and automatically synced:
```typescript
const { tenants, addTenant, updateTenant, deleteTenant } = useData();
```

## 🚀 Deployment

### **Development Build**
```bash
npx expo run:android
npx expo run:ios
```

### **Production Build**
```bash
npx expo build:android
npx expo build:ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- UI components inspired by modern design principles
- Icons provided by [Ionicons](https://ionic.io/ionicons)

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the sample code and comments

---

**Happy PG Management! 🏠✨**
