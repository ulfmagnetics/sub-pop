# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sub Pop is a personal subscription tracking application built with Vue.js 3 + TypeScript frontend and AWS serverless backend. Users can track recurring subscriptions, view spending analytics, and manage renewal dates.

## Common Development Commands

### Frontend Development
```bash
# Install dependencies
npm install

# Development server with hot reload
npm run serve

# Production build
npm run build

# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

### Infrastructure Development
```bash
# Navigate to infrastructure directory
cd infrastructure/

# Install dependencies
npm install

# Compile TypeScript
npm run build

# Run tests
npm run test

# Watch mode for TypeScript
npm run watch

# CDK commands
npm run cdk <command>
```

## Code Architecture

### Frontend Structure (`/src/`)
- **Vue 3 with Composition API** and TypeScript
- **Pinia store** for state management (`/src/stores/SubscriptionStore.ts`)
- **Service layer pattern** for API calls (`/src/services/`)
- **Strong TypeScript models** (`/src/models/Subscription.ts`)
- **Vue Router 4** with hash-based routing for GitHub Pages compatibility

### Backend Structure (`/infrastructure/`)
- **AWS CDK** for Infrastructure as Code
- **Lambda functions** in `/infrastructure/lambda/` for CRUD operations
- **DynamoDB** with GSIs for efficient querying
- **API Gateway** with Cognito authorization
- **EventBridge** scheduled rule for renewal date updates

### Key Components
- `SubscriptionManager.vue` - Main CRUD interface
- `DashboardView.vue` - Analytics and overview
- `SubscriptionStore.ts` - Centralized state with reactive getters
- `subscription-service.ts` - API integration layer

## Database Schema (DynamoDB)

**Primary Table**: `SubscriptionsTable`
- Partition Key: `userId` (STRING)
- Sort Key: `subscriptionId` (STRING)

**Global Secondary Indexes**:
- `serviceName-index`: userId + serviceName
- `nextRenewal-index`: userId + nextRenewal  
- `cost-index`: userId + cost

## API Endpoints

All endpoints require Cognito authentication:
- `GET /subscriptions` - List user subscriptions
- `POST /subscriptions` - Create subscription
- `PUT /subscriptions/{id}` - Update subscription
- `DELETE /subscriptions/{id}` - Delete subscription

## Development Workflow

1. **Frontend changes**: Work in `/src/` directory using Vue SFC patterns
2. **Backend changes**: Modify Lambda functions in `/infrastructure/lambda/`
3. **Infrastructure changes**: Update CDK stack in `/infrastructure/lib/subscription-stack.ts`
4. **Always run linting** before committing: `npm run lint`
5. **Test infrastructure changes**: `cd infrastructure && npm run test`

## Environment Configuration

Frontend environment variables (`.env`):
- `VUE_APP_API_URL` - API Gateway URL
- `VUE_APP_COGNITO_REGION` - AWS region
- `VUE_APP_COGNITO_USER_POOL_ID` - Cognito User Pool ID
- `VUE_APP_COGNITO_CLIENT_ID` - Cognito Client ID

## Deployment

- **Frontend**: GitHub Actions deploys to GitHub Pages on `master` branch pushes
- **Infrastructure**: Manual CDK deployment using AWS CLI
- **Branch**: `master` is the main branch for production deployments

## Testing

- **Infrastructure tests**: Jest with ts-jest in `/infrastructure/test/`
- **Frontend**: Currently uses ESLint for static analysis (unit tests needed)
- Run infrastructure tests: `cd infrastructure && npm run test`

## Code Patterns

- Use **Pinia actions** for async operations, not direct API calls in components
- **Service layer** handles all HTTP requests and error handling
- **TypeScript models** with validation methods for data integrity
- **Reactive getters** in store for computed data (sorting, filtering)
- **Hash-based routing** for GitHub Pages compatibility