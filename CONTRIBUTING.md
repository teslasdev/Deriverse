# Contributing to Deriverse Analytics

First off, thank you for considering contributing to Deriverse Analytics! It's people like you that make this tool better for everyone.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, browser, wallet, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **A clear and descriptive title**
- **A detailed description of the proposed feature**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Run tests** if applicable
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

## Development Setup

1. **Clone your fork**

   ```bash
   git clone https://github.com/your-username/deriverse-analytics.git
   cd deriverse-analytics
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Make changes and test**
   ```bash
   npm run type-check
   npm run lint
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types, avoid `any` when possible
- Use interfaces for object shapes
- Export types that might be reused

### React

- Use functional components with hooks
- Use `useMemo` and `useCallback` appropriately
- Keep components focused and single-purpose
- Avoid prop drilling - use context when needed

### Styling

- Use Tailwind CSS utility classes
- Follow the existing color scheme
- Ensure dark mode compatibility
- Make components responsive

### Code Organization

```typescript
// 1. Imports
import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'

// 2. Types/Interfaces
interface Props {
  value: number
}

// 3. Component
export default function Component({ value }: Props) {
  // 4. State
  const [state, setState] = useState()

  // 5. Derived values
  const formatted = formatCurrency(value)

  // 6. Effects
  useEffect(() => {}, [])

  // 7. Handlers
  const handleClick = () => {}

  // 8. Render
  return <div>{formatted}</div>
}

// 9. Helper components (if needed)
function Helper() {}
```

### Naming Conventions

- **Components**: PascalCase (`Dashboard.tsx`)
- **Files**: camelCase or PascalCase
- **Variables**: camelCase (`totalPnL`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_TRADES`)
- **Types/Interfaces**: PascalCase (`TradeStats`)

## Git Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests after the first line

Examples:

```
Add portfolio analysis time-of-day chart

- Implement hourly performance breakdown
- Add bar chart visualization
- Include win rate per hour
- Fix #123
```

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Component renders without errors
- [ ] Feature works as expected
- [ ] Dark mode looks correct
- [ ] Mobile responsive
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Performance is acceptable

### Automated Testing (Future)

When tests are implemented:

```bash
npm test
npm run test:coverage
```

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments to functions
- Update TECHNICAL.md for architecture changes
- Include code examples for new features

## Review Process

1. **Automated checks** must pass
2. **Code review** by maintainer
3. **Testing** on preview deployment
4. **Approval** and merge

## Questions?

Feel free to open an issue with the "question" label or reach out to the maintainers.

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing! 🎉
