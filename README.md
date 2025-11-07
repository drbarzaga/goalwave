<div align="center">

# Goalwave

<p align="center">
Empower your financial journey – Set, track, and achieve your goals effortlessly with Goalwave.
</p>

[![GitHub stars](https://img.shields.io/github/stars/drbarzaga/goalwave?style=for-the-badge&logo=github&logoColor=white&labelColor=181717&color=FFD700)](https://github.com/drbarzaga/goalwave/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/drbarzaga/goalwave?style=for-the-badge&logo=github&logoColor=white&labelColor=181717&color=00D9FF)](https://github.com/drbarzaga/goalwave/forks)
[![GitHub issues](https://img.shields.io/github/issues/drbarzaga/goalwave?style=for-the-badge&logo=github&logoColor=white&labelColor=181717&color=FF6B6B)](https://github.com/drbarzaga/goalwave/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/drbarzaga/goalwave?style=for-the-badge&logo=github&logoColor=white&labelColor=181717&color=51CF66)](https://github.com/drbarzaga/goalwave/pulls)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&logo=github&logoColor=white&labelColor=181717&color=9775FA)](https://github.com/drbarzaga/goalwave/blob/main/LICENSE)

</div>

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Neon account (or any PostgreSQL database)

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

## Database Commands

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

## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork
3. **Create** a new branch: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -am 'Add some feature'`
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a pull request using our [PR template](.github/pull_request_template.md)

Please ensure your code follows the project's style guidelines and includes tests where applicable.

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 📜 License

This project is licensed under the MIT License.

<div align="center">

## Donate & Contribute

### 🤝 Contribute to the Project

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-blue?style=for-the-badge&logo=github)](https://github.com/drbarzaga/goalwave/issues)
[![GitHub Discussions](https://img.shields.io/badge/GitHub-Discussions-purple?style=for-the-badge&logo=github)](https://github.com/drbarzaga/goalwave/discussions)
[![Pull Requests](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](https://github.com/drbarzaga/goalwave/pulls)

### 💰 Donate to Support Development

**If you find Goalwave helpful, please consider supporting its development!**

<a href="https://github.com/sponsors/drbarzaga" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-Sponsor-ea4aaa?style=for-the-badge&logo=github-sponsors&logoColor=white" alt="GitHub Sponsors">
</a>

**Every contribution helps make Goalwave better!** 🚀

**Made with ❤️ by the Goalwave community** | ⭐ **Star this repo if you find it helpful!**

</div>
