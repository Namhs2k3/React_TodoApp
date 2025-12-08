# Fullstack Training Demo - Task Management

A fullstack demo project with Angular frontend and .NET Core backend, implementing Clean Architecture and Mediator pattern.

## Description

A simple task management application with the following features:
- **List View**: Display a table of existing records
- **CRUD Actions**: Add, Edit, and Delete actions to manage records
- **Error Handling**: Show user-friendly error messages for API failures
- **Responsive Layout**: Support mobile view

## Architecture

### Backend
- **.NET Core 8.0** with Clean Architecture
- **MediatR** for CQRS pattern
- **Entity Framework Core** (InMemory database for demo)
- **AutoMapper** for DTO mapping
- **FluentValidation** for validation
- **xUnit, FluentAssertions** for unit testing

### Frontend
- **Angular 17**
- **Bootstrap 5** for UI
- **RxJS** with Observables
- **Template-Driven Forms**
- **Playwright** for E2E testing

## Project Structure

```
fullstack-training-demo/
├── Backend/                    # .NET Core Backend
│   ├── STRUCTURE.md           # Detailed folder structure
│   ├── EXAMPLE_FILES.md       # Example code for important files
│   └── DEPENDENCIES.md        # NuGet packages list
│
├── Frontend/                   # Angular Frontend
│   ├── STRUCTURE.md           # Detailed folder structure
│   ├── EXAMPLE_FILES.md       # Example code for important files
│   └── DEPENDENCIES.md        # NPM packages list
│
└── README.md                   # This file
```

## Getting Started

### Backend Setup

1. **Create solution and projects**:
   ```bash
   cd Backend
   # See details in Backend/DEPENDENCIES.md
   ```

2. **Install dependencies**:
   ```bash
   dotnet restore
   ```

3. **Run backend**:
   ```bash
   cd src/TaskManagement.API
   dotnet run
   ```
   Backend will run at `https://localhost:61315` or `http://localhost:61316`

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd Frontend
   npm install
   ```

2. **Run frontend**:
   ```bash
   ng serve
   ```
   or 
   ```bash
   npm start
   ```
   Frontend will run at `http://localhost:4200`

## Detailed Documentation

- **Backend Structure**: See `Backend/STRUCTURE.md`
- **Frontend Structure**: See `Frontend/STRUCTURE.md`
- **Backend Dependencies**: See `Backend/DEPENDENCIES.md`
- **Frontend Dependencies**: See `Frontend/DEPENDENCIES.md`
- **Code Examples**: See `Backend/EXAMPLE_FILES.md` and `Frontend/EXAMPLE_FILES.md`

## Requirements Checklist

### Frontend - Angular
- [x] Lifecycle Hooks (ngOnInit, ngOnDestroy, ngAfterViewInit)
- [x] Routing (standard + lazy-loaded module)
- [x] RxJS & Observables (operators, subscription management, combine observables)
- [x] Directives & Pipes (built-in + custom directive + custom pipe)
- [x] Share data between components
- [x] Template-Driven Forms
- [x] HTTP Integration
- [x] Bootstrap 5
- [x] Unit Tests
- [x] E2E Tests (Playwright)

### Backend - .NET Core
- [x] CRUD APIs
- [x] Clean Architecture
- [x] Mediator Pattern (MediatR)
- [x] Unit Tests

## Testing

### Backend Unit Tests
```bash
cd Backend
dotnet test
```

### Frontend Unit Tests
```bash
cd Frontend
ng test
```

### Frontend E2E Tests
```bash
cd Frontend
npm run e2e
```

## Notes

- Backend uses InMemory database for demo purposes
- Frontend needs to configure `environment.ts` with backend API URL
- CORS is configured to allow frontend to call API

## Author

Phạm Ngọc Nam - Training Demo Project
