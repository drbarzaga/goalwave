<div align="center">

# Goalwave

<p align="center">
Empower your financial journey – Set, track, and achieve your goals effortlessly with Goalwave.
</p>

![GitHub stars](https://img.shields.io/github/stars/drbarzaga/goalwave?style=social)
![GitHub forks](https://img.shields.io/github/forks/drbarzaga/goalwave?style=social)
![GitHub issues](https://img.shields.io/github/issues/drbarzaga/goalwave)
![GitHub pull requests](https://img.shields.io/github/issues-pr/drbarzaga/goalwave)
![GitHub license](https://img.shields.io/github/license/drbarzaga/goalwave)

</div>

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Neon account (or any PostgreSQL database)

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
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

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/drbarzaga/goalwave.git`
3. **Create** a new branch: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -am 'Add some feature'`
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a pull request using our [PR template](.github/pull_request_template.md)

Please ensure your code follows the project's style guidelines and includes tests where applicable.

### Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 📜 License

This project is licensed under the MIT License.
