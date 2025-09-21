# Project Architecture

This document outlines the restructured architecture of the blog application, following software engineering best practices.

## 📁 Folder Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (HeroSection, ArticleSection, etc.)
│   ├── layout/          # Layout components (NavBar, Footer, Sidebars)
│   ├── ui/              # Basic UI components (Button, Input, etc.)
│   └── index.js         # Component exports
├── pages/               # Page components (full pages)
│   ├── AdminDashboard.jsx
│   ├── LoginPage.jsx
│   ├── ArticleManagement.jsx
│   └── index.js         # Page exports
├── hooks/               # Custom React hooks
│   ├── useModal.js      # Modal state management
│   ├── useCRUD.js       # CRUD operations
│   ├── useFilters.js    # Filtering and search
│   ├── useForm.js       # Form management
│   ├── usePagination.js # Pagination logic
│   └── index.js         # Hook exports
├── utils/               # Utility functions
│   ├── toast.js         # Toast notification utilities
│   ├── filters.js       # Data filtering utilities
│   ├── validation.js    # Form validation utilities
│   ├── utils.js         # General utilities (cn function)
│   └── index.js         # Utility exports
├── assets/              # Static assets (images, icons)
│   └── author-image.jpg
├── App.jsx              # Main application component
└── main.jsx             # Application entry point
```

## 🏗️ Architecture Principles

This restructure follows key software engineering principles:

### 1. **Don't Repeat Yourself (DRY)**
- **Custom Hooks**: Extracted common logic into reusable hooks
  - `useModal`: Modal state management across components
  - `useCRUD`: Common create, read, update, delete operations
  - `useFilters`: Filtering and search functionality
  - `useForm`: Form validation and state management
  - `usePagination`: Pagination logic

- **Utility Functions**: Common operations centralized
  - `toast.js`: Consistent toast notifications
  - `filters.js`: Reusable filtering functions
  - `validation.js`: Form validation utilities

### 2. **Separation of Concerns**
- **Components**: Only handle UI rendering and user interactions
- **Pages**: Compose components to create full page views
- **Hooks**: Manage state and business logic
- **Utils**: Handle pure functions and utilities

### 3. **Single Responsibility Principle**
- Each component has one clear purpose
- Hooks handle specific functionality (modals, CRUD, filtering)
- Utilities perform single, focused tasks

### 4. **Loose Coupling**
- Components don't directly depend on each other
- Shared logic is abstracted into hooks and utilities
- Clean import/export structure with index files

### 5. **Abstraction**
- Complex operations hidden behind simple interfaces
- Custom hooks abstract away implementation details
- Utility functions provide high-level APIs

## 🔧 Custom Hooks

### `useModal(initialState)`
Manages modal state with open/close functionality.

```javascript
const { isOpen, data, openModal, closeModal } = useModal();
```

### `useCRUD(initialData, options)`
Handles Create, Read, Update, Delete operations with lifecycle hooks.

```javascript
const { data, create, update, remove, loading } = useCRUD(initialData, {
  onAfterCreate: (item) => showSuccessToast("Created!", "Item created successfully"),
  onAfterDelete: (item) => showSuccessToast("Deleted!", "Item deleted successfully")
});
```

### `useFilters(data, initialFilters, config)`
Manages filtering and searching with automatic data filtering.

```javascript
const { filters, filteredData, updateFilter, resetFilters } = useFilters(
  data, 
  { search: '', category: 'all' },
  { searchField: 'title' }
);
```

### `useForm(initialValues, validationRules, onSubmit)`
Handles form state, validation, and submission.

```javascript
const { values, errors, handleChange, handleSubmit, isValid } = useForm(
  { email: '', password: '' },
  {
    email: [validateRequired, (value) => isValidEmail(value)],
    password: [validateRequired, (value) => validateMinLength(value, 8)]
  },
  async (data) => await submitForm(data)
);
```

## 🛠️ Utility Functions

### Toast Utilities
```javascript
import { showSuccessToast, showErrorToast, toastMessages } from '../utils';

showSuccessToast("Success!", "Operation completed");
showErrorToast(toastMessages.auth.loginError.title, toastMessages.auth.loginError.description);
```

### Validation Utilities
```javascript
import { validateRequired, validateEmail, validateForm } from '../utils';

const validation = validateForm(formData, {
  email: [validateRequired, validateEmail],
  password: [validateRequired, (value) => validateMinLength(value, 8)]
});
```

### Filter Utilities
```javascript
import { filterBySearch, applyMultipleFilters, truncateText } from '../utils';

const filtered = applyMultipleFilters(data, {
  search: 'react',
  category: 'tech',
  status: 'published'
});
```

## 📦 Component Organization

### Layout Components (`components/layout/`)
- `NavBar.jsx`: Navigation bar
- `Footer.jsx`: Site footer
- `AdminSidebar.jsx`: Admin navigation sidebar
- `UserSidebar.jsx`: User profile sidebar

### Common Components (`components/common/`)
- `ConfirmationModal.jsx`: Reusable confirmation dialog
- `HeroSection.jsx`: Landing page hero section
- `ArticleSection.jsx`: Article listing and filtering

### UI Components (`components/ui/`)
- Basic form components (Button, Input, Select)
- Consistent styling and behavior
- Reusable across the application

## 🚀 Benefits of This Architecture

1. **Maintainability**: Clear structure makes code easy to find and modify
2. **Reusability**: Components and hooks can be reused across the application
3. **Testability**: Isolated functions and hooks are easier to test
4. **Scalability**: New features can be added following established patterns
5. **Developer Experience**: Consistent patterns and clear separation of concerns
6. **Performance**: Smaller, focused components and optimized re-renders

## 📝 Migration Example

### Before (Original CategoryManagement)
```javascript
// Mixed concerns - UI, state management, and business logic all together
export function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  // ... lots of state and logic mixed together
  
  const handleCreateCategory = () => {
    // Direct state manipulation
    // Toast logic embedded
    // Validation logic embedded
  };
  
  return (
    // Large component with everything inline
  );
}
```

### After (Refactored with new architecture)
```javascript
// Separated concerns using custom hooks and utilities
export function CategoryManagement() {
  const { data: categories, create, update, remove } = useCRUD(initialData, {
    onAfterCreate: () => showSuccessToast(toastMessages.create.category.success)
  });
  
  const { filters, filteredData, updateFilter } = useFilters(categories);
  const createModal = useModal();
  
  // Clean, focused component logic
  return (
    // Cleaner JSX focused on UI
  );
}
```

## 🔄 Future Improvements

1. **State Management**: Consider Redux/Zustand for complex global state
2. **API Layer**: Add dedicated API service layer
3. **Error Boundaries**: Implement error handling components
4. **Performance**: Add React.memo and useMemo where appropriate
5. **Testing**: Add unit tests for hooks and utilities
6. **Documentation**: Add JSDoc comments for better developer experience

This architecture provides a solid foundation for a scalable, maintainable React application following software engineering best practices.
