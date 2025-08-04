# uno-dashboard-ux

A comprehensive React component library for building modern dashboard interfaces, developed by Unosquare. Built with TypeScript, Tailwind CSS, and powered by Recharts for data visualization.

[![npm version](https://badge.fury.io/js/uno-dashboard-ux.svg)](https://badge.fury.io/js/uno-dashboard-ux)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **Modern Design System** - Clean, consistent UI components with light/dark theme support
- 📊 **Data Visualization** - Rich charting components built on Recharts
- 🔧 **TypeScript First** - Full TypeScript support with comprehensive type definitions
- 🎯 **Accessibility** - Components built with accessibility in mind
- 📱 **Responsive** - Mobile-first responsive design
- 🚀 **Performance** - Optimized for fast loading and smooth interactions
- 🌙 **Dark Mode** - Built-in dark mode support
- 📦 **Tree Shakeable** - Import only what you need

## Installation

```bash
npm install uno-dashboard-ux
```

```bash
yarn add uno-dashboard-ux
```

```bash
pnpm add uno-dashboard-ux
```

## Quick Start

```tsx
import React from 'react';
import { Card, Button, Text, ChartBar, Grid, Col } from 'uno-dashboard-ux';

function App() {
  return (
    <Grid numItems={2} className="gap-6">
      <Col>
        <Card>
          <Text>Welcome to uno-dashboard-ux</Text>
          <Button>Get Started</Button>
        </Card>
      </Col>
      <Col>
        <Card>
          <ChartBar
            data={[
              { name: 'Jan', value: 100 },
              { name: 'Feb', value: 200 },
              { name: 'Mar', value: 150 }
            ]}
          />
        </Card>
      </Col>
    </Grid>
  );
}
```

## Components

### Layout & Structure
- **Card** - Container component with optional decorations
- **Grid / Col** - Responsive grid system
- **Flex** - Flexible layout component
- **UnoContainer** - Main application container
- **Accordion** - Collapsible content sections

### Data Display
- **Table** - Feature-rich data tables with sorting, searching, and CSV export
- **List** - Simple list component
- **Metric / AwaitableMetric** - Display key metrics and KPIs
- **Badge / BadgeDelta** - Status indicators and change indicators
- **ProgressBar / ProgressCircle** - Progress indicators

### Charts & Visualization
- **ChartBar** - Bar charts for categorical data
- **ChartFunnel** - Funnel charts for conversion tracking
- **ComposedLineChart** - Multi-axis line charts
- **DataChart** - Flexible line charts
- **PieChart** - Circular data representation
- **Legend** - Chart legends with interactive features
- **BarList** - Horizontal bar lists with values

### Forms & Inputs
- **Form** - Dynamic form builder
- **ReadOnlyForm** - Read-only form display
- **TextInput** - Text input fields
- **NumberInput** - Numeric input fields
- **TextArea** - Multi-line text input
- **Select / MultiSelect** - Dropdown selections
- **SearchSelect / VirtualSelect** - Advanced select components
- **DatePicker / DateRangePicker** - Date selection
- **Calendar** - Full calendar component
- **SearchBox** - Search input with clear functionality

### Navigation & Interaction
- **Button** - Various button styles and sizes
- **Tab / TabGroup** - Tabbed interfaces
- **NavBar** - Navigation header
- **Menu** - Dropdown and context menus
- **Dialog** - Modal dialogs
- **InfoDialog** - Information dialogs
- **Tooltip** - Contextual tooltips

### Feedback & Status
- **Alert** - Toast notifications and alerts
- **NoData** - Empty state component
- **CardLoading** - Loading indicators
- **ErrorBoundary** - Error handling wrapper
- **Blur** - Backdrop blur overlay

### Utilities
- **Icon** - Icon wrapper component
- **ThemeSwitcher** - Dark/light mode toggle
- **Footer** - Application footer
- **Toolbar / BasicToolbar / PageToolbar** - Action bars
- **HorizontalSelector** - Horizontal selection component

## Styling

The library uses Tailwind CSS for styling. Make sure to include the Tailwind configuration:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/uno-dashboard-ux/**/*.{js,ts,jsx,tsx}"
  ],
  // ... your other config
}
```

### Dark Mode

Components automatically support dark mode through Tailwind's dark mode classes:

```tsx
import { ThemeSwitcher } from 'uno-dashboard-ux';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ThemeSwitcher />
      {/* Your app content */}
    </div>
  );
}
```

## Advanced Usage

### Custom Styling

All components accept `className` props for custom styling:

```tsx
<Card className="shadow-lg border-2 border-blue-200">
  <Text className="text-2xl font-bold text-blue-600">
    Custom Styled Card
  </Text>
</Card>
```

### Data Tables

The Table component provides powerful data management features:

```tsx
<Table
  columns={[
    { label: 'Name', key: 'name' },
    { label: 'Value', key: 'value', type: 'number' }
  ]}
  rawData={data}
  searchable
  sortable
  exportCsv
/>
```

### Form Builder

Create dynamic forms with validation:

```tsx
<Form
  columns={[
    { label: 'Email', key: 'email', type: 'email', required: true },
    { label: 'Age', key: 'age', type: 'number' }
  ]}
  onSave={(data) => console.log(data)}
  saveLabel="Submit"
/>
```

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Setup

```bash
git clone https://github.com/unosquare/uno-dashboard-ux.git
cd uno-dashboard-ux
pnpm install
```

### Development Server

```bash
pnpm start
```

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
```

### Linting

```bash
pnpm lint
pnpm lint:fix
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: [support@unosquare.com](mailto:support@unosquare.com)
- 🐛 Issues: [GitHub Issues](https://github.com/unosquare/uno-dashboard-ux/issues)
- 📖 Documentation: [GitHub Pages](https://github.com/unosquare/uno-dashboard-ux#readme)

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Fluent UI](https://developer.microsoft.com/en-us/fluentui)
- Form handling with [React Hook Form](https://react-hook-form.com/)

---

Made with ❤️ by [Unosquare](https://unosquare.com)
