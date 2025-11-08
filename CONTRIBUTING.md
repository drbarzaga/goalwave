# Contributing to Goalwave

Thank you for your interest in contributing to Goalwave! We welcome contributions from the community and are grateful for your help in making this project better.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots (if applicable)
- Your environment (OS, Node.js version, browser)

### Suggesting Features

We love feature suggestions! Please open an issue with:

- A clear description of the feature
- Use cases and examples
- Why this feature would be valuable

### Pull Requests

1. **Fork the repository**

   ```bash
   git clone https://github.com/your-username/goalwave.git
   cd goalwave
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up the development environment**

   ```bash
   npm install
   cp .env.example .env       # Configure your environment variables
   npx drizzle-kit push       # Set up the database
   ```

4. **Make your changes**

   - Write clean, maintainable code
   - Follow the existing code style
   - Add comments where necessary
   - Update documentation if needed

5. **Test your changes**

   ```bash
   npm run dev        # Test locally
   npm run lint       # Check for linting errors
   npm run build      # Ensure it builds successfully
   ```

6. **Commit your changes**

   ```bash
   git commit -m "Add: description of your changes"
   ```

   Use clear, descriptive commit messages following conventional commits:

   - `feat:` for new features
   - `fix:` for bug fixes
   - `update:` for updates to existing features
   - `refactor:` for code refactoring
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `test:` for adding or updating tests
   - `chore:` for build process, tooling, dependencies

7. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**
   - Use our [PR template](.github/pull_request_template.md)
   - Provide a clear description of your changes
   - Reference any related issues
   - Wait for review and feedback

## 📋 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting (ESLint configuration)
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for complex functions

### Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── features/    # Feature-specific components
│   ├── layout/      # Layout components
│   ├── shared/      # Shared components
│   └── ui/          # UI primitives
├── lib/             # Utilities and configurations
├── db/              # Database schema and migrations
└── types/           # TypeScript type definitions
```

### Component Guidelines

- Use functional components with TypeScript
- Prefer client components only when necessary (use `"use client"` directive)
- Keep components focused and reusable
- Extract complex logic into custom hooks
- Use the UI components from `components/ui/` when possible

### Database Changes

- Always create migrations for schema changes
- Use Drizzle ORM for database operations
- Test migrations before submitting PRs
- Document any breaking changes

### Testing

- Test your changes locally before submitting
- Ensure the application builds successfully
- Test in different browsers if UI changes are involved
- Verify database migrations work correctly

## 🎯 Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage
- 🌐 Internationalization
- ♿ Accessibility improvements

## 📝 Code Review Process

1. All PRs require at least one review before merging
2. Maintainers will review your code and provide feedback
3. Address any requested changes
4. Once approved, your PR will be merged

## ❓ Questions?

- Open a [Discussion](https://github.com/drbarzaga/goalwave/discussions) for questions
- Check existing [Issues](https://github.com/drbarzaga/goalwave/issues) for similar questions
- Reach out to maintainers if needed

## 🙏 Thank You!

Your contributions make Goalwave better for everyone. We appreciate your time and effort!

---

**Note:** By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).
