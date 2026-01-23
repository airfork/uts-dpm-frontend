# UTS DPM - Technical Architecture

This document provides a detailed technical overview of the UTS DPM frontend architecture.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Component Hierarchy](#component-hierarchy)
- [Service Layer](#service-layer)
- [State Management](#state-management)
- [Routing Architecture](#routing-architecture)
- [Authentication Flow](#authentication-flow)
- [API Integration](#api-integration)
- [Data Flow Patterns](#data-flow-patterns)
- [Security Patterns](#security-patterns)
- [Performance Considerations](#performance-considerations)

## Architecture Overview

UTS DPM follows Angular 21's standalone component architecture with a service-based business logic layer. The app uses a traditional client-server model with JWT authentication.

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Angular 21)                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Component Layer (Standalone Components)       │  │
│  │  - Home, DPM Management, User Management, Approvals   │  │
│  └───────────────┬───────────────────────────────────────┘  │
│                  │                                            │
│  ┌───────────────▼───────────────────────────────────────┐  │
│  │              Service Layer (Injectable)               │  │
│  │  - AuthService, DpmService, UserService, etc.         │  │
│  └───────────────┬───────────────────────────────────────┘  │
│                  │                                            │
│  ┌───────────────▼───────────────────────────────────────┐  │
│  │         HTTP Layer (HttpClient + Interceptors)        │  │
│  └───────────────┬───────────────────────────────────────┘  │
└──────────────────┼──────────────────────────────────────────┘
                   │ JWT Token (Bearer)
┌──────────────────▼──────────────────────────────────────────┐
│              Backend API (Spring Boot/Heroku)                │
│  - Authentication, DPM CRUD, User Management, Approvals      │
└──────────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Standalone Components**: All components are standalone (no NgModules)
2. **Dependency Injection**: Uses `inject()` function pattern
3. **Reactive State**: Signals for local state, Observables for async operations
4. **Role-Based Access Control**: Guards and directives enforce permissions
5. **Lazy Loading**: Feature routes are lazy-loaded for performance
6. **OnPush Change Detection**: Components use OnPush strategy with signals

## Component Hierarchy

### Application Structure

```
app.component (root)
├── navbar.component (always visible)
└── router-outlet
    ├── /home → home.component
    │   ├── home-table.component
    │   └── loading.component
    ├── /dpm → dpm-layout.component
    │   ├── /create → dpm-form.component
    │   ├── /edit → dpm-edit.component
    │   └── /autogen → autogen.component
    ├── /users → users.component
    │   ├── users-table.component
    │   └── user-detail-modal.component
    ├── /approvals → approvals.component
    │   ├── approvals-table.component
    │   └── approval-modal.component
    ├── /history → history.component
    │   └── history-table.component
    └── /login → login.component
```

### Component Categories

#### **Layout Components**
- `app.component.ts` - Root component, handles global app structure
- `navbar.component.ts` - Navigation bar with role-based menu items
- `dpm-layout.component.ts` - DPM feature layout with tabs

#### **Feature Components**
- `home.component.ts` - Dashboard showing user's current DPMs
- `dpm-form.component.ts` - Create new DPM records
- `dpm-edit.component.ts` - Edit DPM types and groups (Admin only)
- `autogen.component.ts` - Bulk DPM generation from CSV
- `users.component.ts` - User management (Admin only)
- `approvals.component.ts` - DPM approval workflow (Manager/Admin)
- `history.component.ts` - User DPM history with pagination

#### **Presentation Components**
- `home-table.component.ts` - Displays current DPMs in table
- `users-table.component.ts` - User list table
- `approvals-table.component.ts` - Pending DPMs table
- `history-table.component.ts` - Historical DPMs table
- `user-detail-modal.component.ts` - User details/edit modal
- `approval-modal.component.ts` - DPM approval decision modal

#### **Shared Components**
- `loading.component.ts` - Loading spinner
- `errors/403.component.ts` - Forbidden error page
- `errors/404.component.ts` - Not found error page

### Component Communication Patterns

1. **Parent-Child (Input/Output)**
   ```typescript
   // Parent
   @Component({
     template: '<app-table [data]="items()" (rowClick)="handleClick($event)">'
   })

   // Child
   @Component({})
   export class TableComponent {
     @Input() data!: any[];
     @Output() rowClick = new EventEmitter<any>();
   }
   ```

2. **Service-Based Communication**
   ```typescript
   // Components share state via services
   export class ComponentA {
     private dpmService = inject(DpmService);

     ngOnInit() {
       this.dpmService.getCurrentDpms().subscribe(/* ... */);
     }
   }
   ```

3. **Signal-Based Reactivity**
   ```typescript
   export class ParentComponent {
     count = signal(0);

     // Child reads signal directly
     // No explicit data binding needed with signal()
   }
   ```

## Service Layer

### Service Architecture

Services are singleton providers (via `providedIn: 'root'`) that encapsulate business logic and API calls.

```
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────────┐  ┌────────────────┐                 │
│  │  AuthService   │  │  DpmService    │                 │
│  │  - login()     │  │  - create()    │                 │
│  │  - logout()    │  │  - getAll()    │                 │
│  │  - userData    │  │  - update()    │                 │
│  └────────────────┘  └────────────────┘                 │
│                                                           │
│  ┌────────────────┐  ┌────────────────┐                 │
│  │  UserService   │  │ ApprovalsService│                │
│  │  - getUsers()  │  │  - approve()   │                 │
│  │  - create()    │  │  - deny()      │                 │
│  │  - update()    │  │  - update()    │                 │
│  └────────────────┘  └────────────────┘                 │
│                                                           │
│  ┌────────────────┐  ┌────────────────┐                 │
│  │ AutogenService │  │  ErrorService  │                 │
│  │  - generate()  │  │  - handle()    │                 │
│  │  - preview()   │  │  - log()       │                 │
│  └────────────────┘  └────────────────┘                 │
│                                                           │
│  ┌────────────────┐  ┌────────────────┐                 │
│  │HistoryService  │  │ ExportService  │                 │
│  │  - getHistory()│  │  - toExcel()   │                 │
│  └────────────────┘  └────────────────┘                 │
└─────────────────────────────────────────────────────────┘
```

### Key Services

#### **AuthService** (`/src/app/services/auth.service.ts`)

**Responsibilities:**
- JWT token management
- User authentication state
- Login/logout operations
- Token expiration checking

**Key Methods:**
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  userData: UserData = {
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || '',
    username: localStorage.getItem('username') || '',
    exp: localStorage.getItem('exp') || ''
  };

  login(username: string, password: string): Observable<UserData>
  logout(): void
  isAuthenticated(): boolean
}
```

**Storage Pattern:**
- Token stored in `localStorage` (keys: token, role, username, exp)
- Persists across browser sessions
- Cleared on logout or 401 response

#### **DpmService** (`/src/app/services/dpm.service.ts`)

**Responsibilities:**
- DPM CRUD operations
- DPM type/group management
- Points calculation

**Key Methods:**
```typescript
@Injectable({ providedIn: 'root' })
export class DpmService {
  getCurrentDpms(): Observable<HomeDpmDto[]>
  create(dpm: PostDpmDto): Observable<any>
  getAllForUser(id: string, page: number, size: number): Observable<HistoryDpmPageDto>
  getDpmGroups(): Observable<DPMGroup[]>
  updateDpmGroups(groups: DPMGroup[]): Observable<any>
}
```

#### **UserService** (`/src/app/services/user.service.ts`)

**Responsibilities:**
- User management
- User autocomplete data
- Point balance operations

**Key Methods:**
```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  getUserNames(): Observable<AutocompleteUserDto[]>
  getUser(id: string): Observable<UserDetailDto>
  createUser(dto: CreateUserDto): Observable<any>
  updateUser(dto: UpdateUserDto, id: string): Observable<any>
  resetPointBalances(): Observable<any>
}
```

#### **ApprovalsService** (`/src/app/services/approvals.service.ts`)

**Responsibilities:**
- DPM approval workflow
- Points adjustment before approval
- Approval history

**Key Methods:**
```typescript
@Injectable({ providedIn: 'root' })
export class ApprovalsService {
  getApprovalDpms(page: number, size: number): Observable<ApprovalDpmPageDto>
  approveDpm(id: number): Observable<any>
  denyDpm(id: number): Observable<any>
  updatePoints(id: number, points: number): Observable<any>
}
```

### Service Design Patterns

**1. Observable-Based APIs**
```typescript
getData(): Observable<DataType[]> {
  return this.http.get<DataType[]>(`${this.apiUrl}/endpoint`).pipe(
    retry(2),
    catchError(this.handleError)
  );
}
```

**2. Error Handling**
```typescript
private handleError(error: HttpErrorResponse): Observable<never> {
  const errorService = inject(ErrorService);
  errorService.handleError(error);
  return throwError(() => error);
}
```

**3. Type Safety with DTOs**
```typescript
// All API responses are strongly typed
getCurrentDpms(): Observable<HomeDpmDto[]> {
  return this.http.get<HomeDpmDto[]>(`${this.apiUrl}/dpms/current`);
}
```

## State Management

UTS DPM uses a hybrid state management approach with **no global state store**. State is managed locally in components and services.

### State Categories

#### **1. Local Component State (Signals)**

Used for UI-specific state that doesn't need to be shared.

```typescript
export class HomeComponent {
  // Reactive state with signals
  loading = signal(false);
  selectedDpm = signal<HomeDpmDto | null>(null);

  // Derived state
  hasData = computed(() => this.dpms().length > 0);

  // Effects for side effects
  constructor() {
    effect(() => {
      console.log('Loading state changed:', this.loading());
    });
  }
}
```

**When to use:**
- UI toggles (loading, expanded, selected)
- Form state
- Temporary data

#### **2. Service State (Observables)**

Used for data fetched from APIs that may need to be cached or shared.

```typescript
export class DpmService {
  private dpmGroupsCache$ = new BehaviorSubject<DPMGroup[] | null>(null);

  getDpmGroups(): Observable<DPMGroup[]> {
    if (this.dpmGroupsCache$.value) {
      return this.dpmGroupsCache$.asObservable();
    }

    return this.http.get<DPMGroup[]>(`${this.apiUrl}/dpm-groups`).pipe(
      tap(groups => this.dpmGroupsCache$.next(groups))
    );
  }
}
```

**When to use:**
- API data that needs caching
- Data shared across multiple components
- Real-time data streams

#### **3. Session State (localStorage)**

Used only for authentication persistence.

```typescript
export class AuthService {
  login(username: string, password: string): Observable<UserData> {
    return this.http.post<UserData>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(data => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          localStorage.setItem('username', data.username);
          localStorage.setItem('exp', data.exp);
        })
      );
  }
}
```

**When to use:**
- Authentication tokens
- User session data
- Preferences that must persist across sessions

### Observable → Signal Conversion

Components convert service Observables to Signals for reactive templates:

```typescript
export class HomeComponent {
  private dpmService = inject(DpmService);

  // Option 1: toSignal (automatic subscription)
  dpms = toSignal(this.dpmService.getCurrentDpms(), { initialValue: [] });

  // Option 2: Manual subscription + signal
  manualDpms = signal<HomeDpmDto[]>([]);

  ngOnInit() {
    this.dpmService.getCurrentDpms()
      .pipe(first())
      .subscribe(dpms => this.manualDpms.set(dpms));
  }
}
```

### State Update Patterns

**1. Immutable Updates**
```typescript
// Signal updates (immutable)
this.items.update(current => [...current, newItem]);

// Avoid mutation
this.items().push(newItem); // ❌ Wrong
```

**2. Async State Management**
```typescript
async loadData() {
  this.loading.set(true);
  try {
    const data = await firstValueFrom(this.service.getData());
    this.data.set(data);
  } catch (error) {
    this.error.set(error);
  } finally {
    this.loading.set(false);
  }
}
```

## Routing Architecture

### Route Structure

Routes are organized by feature with lazy loading:

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dpm',
    loadChildren: () => import('./dpm/dpm.routes').then(m => m.DPM_ROUTES),
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'ANALYST', 'MANAGER', 'SUPERVISOR'] as Roles[] }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] as Roles[] }
  },
  {
    path: 'approvals',
    component: ApprovalsComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'MANAGER'] as Roles[] }
  },
  { path: 'errors/403', component: Error403Component },
  { path: '**', component: Error404Component }
];
```

### Lazy Loading Pattern

Feature routes are split into separate files and lazy-loaded:

```typescript
// dpm.routes.ts
export const DPM_ROUTES: Routes = [
  {
    path: '',
    component: DpmLayoutComponent,
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: DpmFormComponent },
      {
        path: 'edit',
        component: DpmEditComponent,
        data: { roles: ['ADMIN'] as Roles[] }
      },
      { path: 'autogen', component: AutogenComponent }
    ]
  }
];
```

### Route Guards

#### **authGuard** (`/src/app/auth/auth.guard.ts`)

Protects routes requiring authentication and role-based access:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check authentication
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Check role authorization
  const requiredRoles = route.data['roles'] as Roles[] | undefined;
  if (requiredRoles && !requiredRoles.includes(authService.userData.role as Roles)) {
    router.navigate(['/errors/403']);
    return false;
  }

  return true;
};
```

**Guard Logic:**
1. Check if user is authenticated (valid token)
2. If not, redirect to `/login`
3. Check if route requires specific roles
4. If user lacks required role, redirect to `/errors/403`
5. Otherwise, allow access

### Navigation Patterns

**1. Programmatic Navigation**
```typescript
export class LoginComponent {
  private router = inject(Router);

  async login() {
    // After successful login
    await this.router.navigate(['/home']);
  }
}
```

**2. Template Navigation**
```html
<a routerLink="/dpm/create" routerLinkActive="active">Create DPM</a>
```

**3. Navigation with State**
```typescript
this.router.navigate(['/history'], {
  queryParams: { userId: user.id }
});
```

## Authentication Flow

### Login Flow

```
┌──────────┐         ┌──────────────┐         ┌──────────┐
│  User    │         │  Frontend    │         │  Backend │
└────┬─────┘         └──────┬───────┘         └────┬─────┘
     │                      │                      │
     │  Enter credentials   │                      │
     ├─────────────────────>│                      │
     │                      │                      │
     │                      │  POST /auth/login    │
     │                      ├─────────────────────>│
     │                      │  {username, password}│
     │                      │                      │
     │                      │    JWT token + user  │
     │                      │<─────────────────────┤
     │                      │    {token, role, ...}│
     │                      │                      │
     │  Store in localStorage                     │
     │  ┌──────────────────┐│                      │
     │  │ token            ││                      │
     │  │ role             ││                      │
     │  │ username         ││                      │
     │  │ exp              ││                      │
     │  └──────────────────┘│                      │
     │                      │                      │
     │  Navigate to /home   │                      │
     │<─────────────────────┤                      │
     │                      │                      │
```

### Request Flow (With JWT)

```
┌──────────────┐         ┌───────────────┐         ┌──────────┐
│  Component   │         │  HTTP Client  │         │  Backend │
└──────┬───────┘         └───────┬───────┘         └────┬─────┘
       │                         │                      │
       │  service.getData()      │                      │
       ├────────────────────────>│                      │
       │                         │                      │
       │                    Interceptor:                │
       │                    Add Authorization header    │
       │                    ┌────────────────┐          │
       │                    │ Bearer <token> │          │
       │                    └────────────────┘          │
       │                         │                      │
       │                         │  GET /api/data       │
       │                         ├─────────────────────>│
       │                         │  Authorization: ...  │
       │                         │                      │
       │                         │  Validate JWT        │
       │                         │  Check permissions   │
       │                         │                      │
       │                         │    Response data     │
       │                         │<─────────────────────┤
       │                         │                      │
       │  Observable<Data>       │                      │
       │<────────────────────────┤                      │
       │                         │                      │
```

### HTTP Interceptor

The interceptor automatically adds JWT tokens to requests and handles auth errors:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Clone request and add Authorization header
  const token = authService.userData.token;
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - clear token and redirect to login
        authService.logout();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Forbidden - redirect to 403 error page
        router.navigate(['/errors/403']);
      }
      return throwError(() => error);
    })
  );
};
```

### Token Validation

Token expiration is checked before sensitive operations:

```typescript
isAuthenticated(): boolean {
  const token = this.userData.token;
  const exp = this.userData.exp;

  if (!token || !exp) {
    return false;
  }

  const expirationDate = new Date(parseInt(exp) * 1000);
  return new Date() < expirationDate;
}
```

## API Integration

### Base Configuration

API base URL is configured in environment files:

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://uts-dpm-backend.herokuapp.com'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://uts-dpm-backend.herokuapp.com'
};
```

### DTO Pattern

All API requests/responses use strongly-typed DTOs:

```typescript
// Request DTO
export interface PostDpmDto {
  driver: string;
  block: string;
  date: string;
  type: number;
  location: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

// Response DTO
export interface HomeDpmDto {
  type: string;
  points: number;
  block: string;
  location: string;
  date: string;
  time: string;
  notes?: string;
}

// Service usage
createDpm(dto: PostDpmDto): Observable<any> {
  return this.http.post(`${this.apiUrl}/dpms`, dto);
}
```

### Error Handling Strategy

Centralized error handling via `ErrorService`:

```typescript
@Injectable({ providedIn: 'root' })
export class ErrorService {
  private toastr = inject(ToastrService);

  handleError(error: HttpErrorResponse): void {
    let message: string;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      message = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      message = error.error?.message || `Error ${error.status}: ${error.statusText}`;
    }

    this.toastr.error(message, 'Error');
    console.error('API Error:', error);
  }
}
```

### Retry Logic

Transient failures are retried automatically:

```typescript
getData(): Observable<DataType[]> {
  return this.http.get<DataType[]>(`${this.apiUrl}/endpoint`).pipe(
    retry({
      count: 2,
      delay: 1000
    }),
    catchError(this.handleError)
  );
}
```

## Data Flow Patterns

### Create DPM Flow

```
┌──────────────┐    ┌───────────────┐    ┌──────────────┐    ┌──────────┐
│ DpmForm      │    │  DpmService   │    │ HTTP Client  │    │ Backend  │
│ Component    │    │               │    │              │    │   API    │
└──────┬───────┘    └───────┬───────┘    └──────┬───────┘    └────┬─────┘
       │                    │                   │                  │
       │  User fills form   │                   │                  │
       │  and clicks submit │                   │                  │
       │                    │                   │                  │
       │  createDpm(dto)    │                   │                  │
       ├───────────────────>│                   │                  │
       │                    │                   │                  │
       │                    │  POST /dpms       │                  │
       │                    ├──────────────────>│                  │
       │                    │  dto: PostDpmDto  │                  │
       │                    │                   │                  │
       │                    │                   │  POST /dpms      │
       │                    │                   ├─────────────────>│
       │                    │                   │  + JWT token     │
       │                    │                   │                  │
       │                    │                   │  Validate token  │
       │                    │                   │  Check role      │
       │                    │                   │  Create DPM      │
       │                    │                   │  Set status:     │
       │                    │                   │  PENDING         │
       │                    │                   │                  │
       │                    │                   │  Success         │
       │                    │                   │<─────────────────┤
       │                    │                   │                  │
       │                    │  Observable       │                  │
       │                    │<──────────────────┤                  │
       │                    │                   │                  │
       │  Success toast     │                   │                  │
       │  Navigate to /home │                   │                  │
       │<───────────────────┤                   │                  │
       │                    │                   │                  │
```

### Approval Flow

```
┌──────────────┐    ┌──────────────────┐    ┌──────────┐
│ Approvals    │    │ ApprovalsService │    │ Backend  │
│ Component    │    │                  │    │   API    │
└──────┬───────┘    └────────┬─────────┘    └────┬─────┘
       │                     │                    │
       │  Load pending DPMs  │                    │
       ├────────────────────>│                    │
       │                     │  GET /approvals    │
       │                     ├───────────────────>│
       │                     │  ?page=0&size=10   │
       │                     │                    │
       │                     │  DPMs with status  │
       │                     │  PENDING           │
       │                     │<───────────────────┤
       │                     │                    │
       │  Display in table   │                    │
       │<────────────────────┤                    │
       │                     │                    │
       │  Manager clicks     │                    │
       │  "Approve"          │                    │
       │                     │                    │
       │  approveDpm(id)     │                    │
       ├────────────────────>│                    │
       │                     │  PUT /approvals/id │
       │                     ├───────────────────>│
       │                     │  /approve          │
       │                     │                    │
       │                     │  Update status:    │
       │                     │  APPROVED          │
       │                     │  Add points to user│
       │                     │                    │
       │                     │  Success           │
       │                     │<───────────────────┤
       │                     │                    │
       │  Remove from table  │                    │
       │  Show success toast │                    │
       │<────────────────────┤                    │
       │                     │                    │
```

## Security Patterns

### 1. Authentication Security

- JWT tokens stored in `localStorage` (XSS risk mitigated by Content Security Policy)
- Tokens include expiration time (validated client-side)
- 401 responses automatically log out user
- No sensitive data stored client-side (only token, role, username)

### 2. Authorization Security

**Route-Level Protection:**
```typescript
{
  path: 'admin-only',
  component: AdminComponent,
  canActivate: [authGuard],
  data: { roles: ['ADMIN'] as Roles[] }
}
```

**Template-Level Protection:**
```typescript
@Directive({
  selector: '[appRemoveIfUnauthorized]'
})
export class RemoveIfUnauthorizedDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input() set appRemoveIfUnauthorized(roles: Roles[]) {
    const userRole = this.authService.userData.role as Roles;
    if (roles.includes(userRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

### 3. Input Validation

**Form Validation:**
```typescript
export class DpmFormComponent {
  form = new FormGroup({
    driver: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    type: new FormControl(null, [Validators.required]),
    points: new FormControl(0, [
      Validators.required,
      Validators.min(-100),
      Validators.max(100)
    ])
  });
}
```

### 4. XSS Prevention

Angular automatically sanitizes template bindings:
```html
<!-- Safe - Angular sanitizes automatically -->
<div>{{ userInput }}</div>

<!-- Unsafe - requires explicit trust -->
<div [innerHTML]="userHtml"></div> <!-- Only use with DomSanitizer -->
```

## Performance Considerations

### 1. Change Detection Strategy

All components use `OnPush` for performance:

```typescript
@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  // Use signals to trigger change detection
  data = signal<any[]>([]);
}
```

### 2. Lazy Loading

Feature routes are lazy-loaded to reduce initial bundle size:

```typescript
{
  path: 'dpm',
  loadChildren: () => import('./dpm/dpm.routes').then(m => m.DPM_ROUTES)
}
```

### 3. HTTP Optimization

**Retry Logic:** Automatic retry for transient failures
**Caching:** Service-level caching for frequently accessed data (DPM groups)
**Pagination:** Large lists use server-side pagination (history, approvals)

### 4. Bundle Size

Current bundle size (production):
- Main bundle: ~800KB (includes Angular, PrimeNG, DaisyUI)
- Lazy chunks: ~50-100KB per feature

**Optimization Opportunities** (future phases):
- Remove PrimeNG (~200KB savings)
- Remove DaisyUI (~50KB savings)
- Tree-shake unused Tailwind classes
- Use TanStack Table (headless, smaller bundle)

### 5. Memory Management

**Automatic Subscription Cleanup:**
```typescript
// Option 1: toSignal (auto-cleanup)
items = toSignal(this.service.getItems(), { initialValue: [] });

// Option 2: first() operator (auto-completes)
ngOnInit() {
  this.service.getData().pipe(first()).subscribe(/* ... */);
}

// Option 3: takeUntilDestroyed()
ngOnInit() {
  this.service.getData()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(/* ... */);
}
```

### 6. Rendering Optimization

**Virtual Scrolling** (future consideration for large tables):
```typescript
// Not yet implemented, but planned for Phase 3
<cdk-virtual-scroll-viewport itemSize="50">
  <div *cdkVirtualFor="let item of items">{{ item }}</div>
</cdk-virtual-scroll-viewport>
```

---

**Last Updated:** January 2026
**Angular Version:** 21.0.8
**Target Audience:** Developers working on UTS DPM frontend
