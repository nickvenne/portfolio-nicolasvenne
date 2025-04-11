# CLAUDE.md - Repository Guide

## Build & Development Commands
- Install: `pnpm install`
- Development: `pnpm dev`
- Build: `pnpm build`
- Start: `pnpm start`

## Project Structure
- TanStack Router project with React 19
- Tailwind CSS for styling
- UI components in `src/components/ui`
- Routes defined in `src/routes`

## Code Style Guidelines
- TypeScript for type safety
- Use named exports rather than default exports
- Component props should have explicit interfaces
- React components should follow functional pattern with hooks
- Use cn() utility for merging class names from clsx and tailwind-merge
- Follow import order: React, external libraries, internal components, hooks, utils
- Use destructuring for props and state
- Prefer arrow functions for component definitions
- Use cva for component variants

## Naming Conventions
- PascalCase for React components
- camelCase for variables, functions, methods
- Type definitions should use PascalCase with descriptive names