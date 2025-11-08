<div align="center">

# Goalwave

**Empower your financial journey – Set, track, and achieve your goals effortlessly with Goalwave.**

</div>

---

### 🎯 About Goalwave

Goalwave is a modern, open-source web application designed to help you manage and achieve your financial goals. Built with cutting-edge technologies, Goalwave provides an intuitive interface for setting financial objectives, tracking progress, and staying motivated on your path to financial success.

**Key Features:**

- 🎯 **Goal Setting** - Create and customize your financial goals with ease
- 📊 **Progress Tracking** - Visualize your progress with intuitive dashboards
- 🔐 **Secure** - Built with modern authentication and security practices
- 🚀 **Modern Stack** - Powered by Next.js, React, and TypeScript
- 💾 **Reliable** - PostgreSQL database for secure data storage

Whether you're saving for a dream vacation, planning for retirement, or working towards any financial milestone, Goalwave makes goal management simple, visual, and engaging.

---

[![GitHub stars](https://img.shields.io/github/stars/drbarzaga/goalwave?style=for-the-badge&logo=github&logoColor=white&labelColor=181717&color=FFD700)](https://github.com/drbarzaga/goalwave/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/drbarzaga/goalwave?style=for-the-badge&logo=github&logoColor=white&labelColor=181717&color=00D9FF)](https://github.com/drbarzaga/goalwave/forks)
[![GitHub issues](https://img.shields.io/github/issues/drbarzaga/goalwave?style=for-the-badge&logo=github&logoColor=white&labelColor=181717&color=FF6B6B)](https://github.com/drbarzaga/goalwave/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/drbarzaga/goalwave?style=for-the-badge&logo=github&logoColor=white&labelColor=181717&color=51CF66)](https://github.com/drbarzaga/goalwave/pulls)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&logo=github&logoColor=white&labelColor=181717&color=9775FA)](https://github.com/drbarzaga/goalwave/blob/main/LICENSE)

</div>

## 🚀 Key Features

- 🎯 **Create personalized financial goals**
- 📈 **Visual tracking of each goal's progress**
- 👥 **User account management and secure authentication**
- 💬 **Motivational notifications and reminders**
- 🌙 **Dark mode and customization settings**
- 📱 **Intuitive and mobile-friendly interface**
- 🔔 **Dashboard with progress alerts and tips**
- 🗃️ **History and analysis of achievements**

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Neon account (or any PostgreSQL database)

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/drbarzaga/goalwave.git
cd goalwave

# Install dependencies
npm install

# Set up environment variables (see Installation section for details)
cp .env.example .env.local  # If you have an example file, or create .env.local manually

# Run database migrations
npx drizzle-kit push

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/drbarzaga/goalwave.git
cd goalwave
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

```env
DATABASE_URL=your_postgresql_connection_url
BETTER_AUTH_SECRET=your_random_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

**Getting your `DATABASE_URL`:**

- If using Neon: Get your connection string from your Neon project dashboard
- Format: `postgresql://user:password@host:port/database?sslmode=require`

4. Run database migrations:

```bash
npx drizzle-kit push
```

## 🏃 Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🗄️ Database Commands

```bash
# Generate migrations
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit push

# Open Drizzle Studio (visual interface)
npx drizzle-kit studio
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request using our [PR template](.github/pull_request_template.md)

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 📝 License

This project is licensed under the MIT License.

## 🙏🏻 Contributors

Thanks to these amazing people for helping build Goalwave:

<a href="https://github.com/drbarzaga/goalwave/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=drbarzaga/goalwave" />
</a>

---

<div align="center">

## 💛 Support the Project

[![GitHub Issues](https://img.shields.io/badge/Issues-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/drbarzaga/goalwave/issues)
[![GitHub Discussions](https://img.shields.io/badge/Discussions-6e40c9?style=for-the-badge&logo=github&logoColor=white)](https://github.com/drbarzaga/goalwave/discussions)
[![Pull Requests](https://img.shields.io/badge/PRs%20Welcome-2ecc71?style=for-the-badge&logo=github&logoColor=white)](https://github.com/drbarzaga/goalwave/pulls)

### 💰 Donate & Sponsor

If you find Goalwave useful, consider supporting its development:

<a href="https://github.com/sponsors/drbarzaga" target="_blank">
  <img src="https://img.shields.io/badge/Sponsor%20on%20GitHub-ea4aaa?style=for-the-badge&logo=github-sponsors&logoColor=white" alt="GitHub Sponsors" />
</a>

---

⭐ **Star the repo to help it grow!**  
Made with ❤️ by the Goalwave community

</div>


