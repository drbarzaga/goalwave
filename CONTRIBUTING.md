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

   **Important:** This project requires a Neon database. See the [Database Setup](#-database-setup) section below for detailed instructions.

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
├── app/                   # Next.js App Router (pages, layouts, API routes)
│   ├── (auth)/            # Authentication pages and routes
│       ├── login/         # Login page
│       ├── signup/        # Signup page
│       ├── forgot-password/   # Forgot password page
│       ├── reset-password/    # Reset password page
│       └── layout.tsx     # Authentication layout
│   ├── (app)/             # App pages and routes
│       ├── dashboard/     # Dashboard page
│       ├── goals/         # Goals page
│       ├── settings/      # Settings page
│       ├── layout.tsx     # App layout
│       └── page.tsx       # App page
│   └── (marketing)/       # Marketing pages and routes
│       ├── layout.tsx     # Marketing layout
│       └── page.tsx       # Marketing page
│   ├── api/               # API routes
│       └── auth/          # Authentication API routes
├── components/            # React components
│   ├── features/          # Feature-specific components
│   ├── layout/            # Layout and wrapper components
│   ├── shared/            # Shared/reusable components
│   └── ui/                # UI primitives (shadcn/ui)
├── lib/                   # Utilities, helpers, and configurations
├── db/                    # Database schema and migrations (drizzle)
└── types/                 # TypeScript type definitions
```

### Component Guidelines

- Use functional components with TypeScript
- Prefer client components only when necessary (use `"use client"` directive)
- Keep components focused and reusable
- Extract complex logic into custom hooks
- Use the UI components from `components/ui/` when possible

### Database Setup

This project uses **Neon** (a serverless PostgreSQL database) for data storage. Each contributor needs to set up their own Neon database for local development.

#### Step 1: Create a Neon Account

1. Go to [https://neon.com](https://neon.com)
2. Sign up for a free account (no credit card required for the free tier)
3. Verify your email address

#### Step 2: Create a New Project

1. Once logged in, click **"Create a project"**
2. Choose a project name (e.g., `goalwave-dev`)
3. Select a region closest to you for better performance
4. Choose **PostgreSQL** as the database engine
5. Click **"Create project"**

#### Step 3: Get Your Connection String

1. After creating the project, you'll be taken to the project dashboard
2. Look for the **"Connection string"** section
3. Copy the connection string (it should look like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`)
4. **Important:** Make sure to copy the connection string that includes your password, not the one that says "without password"

#### Step 4: Configure Environment Variables

1. Open the `.env` file and fill in the required variables:

   ```env
   # Database Configuration
   DATABASE_URL=your_neon_connection_string_here

   # Better Auth Configuration
   # Generate a random secret key using: openssl rand -base64 32
   BETTER_AUTH_SECRET=your_random_secret_key_here

   # Application URL (for development)
   BETTER_AUTH_URL=http://localhost:3000
   ```

2. **Generate a secure secret key** for `BETTER_AUTH_SECRET`:

   ```bash
   # On macOS/Linux:
   openssl rand -base64 32

   # Or use an online generator:
   # https://generate-secret.vercel.app/32
   ```

#### Step 5: Run Database Migrations

After setting up your environment variables, run the database migrations to create the necessary tables:

```bash
npx drizzle-kit push
```

This will create all the required database tables based on the schema defined in `src/db/schema.ts`.

#### Step 6: Verify Your Setup

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Visit [http://localhost:3000](http://localhost:3000)
3. Try creating an account to verify the database connection works

#### Additional Database Commands

```bash
# Generate migrations (when schema changes)
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit push

# Open Drizzle Studio (visual database browser)
npx drizzle-kit studio
```

#### Troubleshooting

- **Connection errors:** Make sure your `DATABASE_URL` includes `?sslmode=require` at the end
- **Migration errors:** Ensure you've copied the full connection string with password
- **"Database does not exist" errors:** Double-check that you're using the correct connection string from your Neon dashboard
- **Rate limiting:** The free tier has some limits; if you hit them, wait a few minutes or upgrade your Neon plan

#### Best Practices

- **Use separate databases** for development and testing if needed
- **Never commit** your `.env` file to version control
- **Keep your connection string secure** - don't share it publicly
- **Use Neon's branching feature** for testing schema changes in isolation (optional)

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
