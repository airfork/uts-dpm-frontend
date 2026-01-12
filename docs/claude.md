# UTS DPM - AI Agent Context

This file provides context for AI coding assistants (Claude, GitHub Copilot, etc.) working on the UTS DPM project.

## Project Overview

**UTS DPM** is a Driver Performance Management system for University of Virginia's Transit Service. It tracks driver actions (DPMs - Driver Performance Markers) with a point-based system across 5 user roles.

**Key Domain Concept:** A "DPM" is a single recordable action by a driver (e.g., being late, picking up a block/shift, passing safety inspection). Each DPM has a point value (-100 to +100) that affects the driver's total score.

## Tech Stack Summary

- **Framework:** Angular 21 (standalone components, signals, inject())
- **UI:** PrimeNG 21 + DaisyUI 5 + Tailwind CSS 4
- **Backend:** Spring Boot (separate repo on Heroku)
- **Auth:** JWT tokens in localStorage
- **Hosting:** Firebase Hosting with GitHub Actions CI/CD

## Code Patterns & Conventions

### Component Pattern (Angular 21 Standalone)

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, FormsModule, /* other deps */],
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  // Use inject() for DI
  private service = inject(ExampleService);
  private router = inject(Router);

  // Use signals for reactive state
  data = signal<DataType[]>([]);
  loading = signal(false);

  // Or convert observables to signals
  items = toSignal(this.service.getItems(), { initialValue: [] });
}
```

### Template Syntax (Modern Control Flow)

```html
<!-- Use @if instead of *ngIf -->
@if (loading()) {
  <app-loading></app-loading>
} @else {
  <div>{{ data() }}</div>
}

<!-- Use @for instead of *ngFor -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```

### Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class ExampleService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getData(): Observable<DataType[]> {
    return this.http.get<DataType[]>(`${this.apiUrl}/endpoint`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
```

### Routing (Lazy Loading)

```typescript
export const EXAMPLE_ROUTES: Routes = [
  {
    path: '',
    component: ExampleLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'MANAGER'] as Roles[] },
    children: [/* child routes */]
  }
];
```

## File Organization

### Where Things Live

- **Components:** `/src/app/{feature}/{component-name}/`
- **Services:** `/src/app/services/{service-name}.service.ts`
- **Models/DTOs:** `/src/app/models/{model-name}.ts`
- **Guards:** `/src/app/auth/auth.guard.ts`
- **Pipes:** `/src/app/shared/pipes/{pipe-name}.pipe.ts`
- **Routes:** Feature-specific `{feature}.routes.ts` files

### Naming Conventions

- **Components:** `example-detail.component.ts`
- **Services:** `example.service.ts`
- **Models:** `example-dto.ts` or `example.ts`
- **Guards:** `auth.guard.ts`
- **Pipes:** `example.pipe.ts`

## Key Services

### AuthService (`/src/app/services/auth.service.ts`)

Manages authentication state:
- `userData: UserData` - Current user (token, role, username, exp)
- `login(username, password)` - Authenticate user
- `logout()` - Clear session
- `isAuthenticated()` - Check if token valid
- Stores JWT in localStorage

### DpmService (`/src/app/services/dpm.service.ts`)

Handles DPM CRUD operations:
- `getCurrentDpms()` - Get current user's DPMs
- `create(dpm: PostDpmDto)` - Create new DPM
- `getAllForUser(id, page, size)` - Get user's DPM history (paginated)
- `getDpmGroups()` - Get all DPM type groups
- `updateDpmGroups(groups)` - Update DPM type configuration

### UserService (`/src/app/services/user.service.ts`)

User management:
- `getUserNames()` - Get list for autocomplete
- `getUser(id)` - Get user details
- `createUser(dto)` - Create new user
- `updateUser(dto, id)` - Update user
- `resetPointBalances()` - Reset all user points (admin)

### ApprovalsService (`/src/app/services/approvals.service.ts`)

DPM approval workflow:
- `getApprovalDpms(page, size)` - Get pending DPMs
- `approveDpm(id)` - Approve DPM
- `denyDpm(id)` - Deny DPM
- `updatePoints(id, points)` - Edit points before approval

## Domain Models (Key DTOs)

### HomeDpmDto
Current user's DPMs displayed on home page:
```typescript
{ type: string, points: number, block: string, location: string, date: string, time: string, notes?: string }
```

### PostDpmDto
Creating a new DPM:
```typescript
{ driver: string, block: string, date: string, type: number, location: string, startTime: string, endTime: string, notes?: string }
```

### ApprovalDpmDto
DPMs awaiting approval:
```typescript
{ id: number, driver: string, createdBy: string, type: string, points: number, block: string, location: string, date: string, time: string, createdAt: string, notes?: string }
```

### DPMType & DPMGroup
Configurable DPM types:
```typescript
DPMType: { id: number, name: string, points: number, dpmColor?: { colorId: number, hexCode: string } }
DPMGroup: { id?: string, groupName: string, dpms: DPMType[] }
```

### UserDetailDto
User information:
```typescript
{ email: string, firstname: string, lastname: string, points: number, manager: string, role: string, fullTime: boolean }
```

## Role-Based Access Control

### Roles (Type: `Roles`)
```typescript
type Roles = 'ADMIN' | 'ANALYST' | 'DRIVER' | 'MANAGER' | 'SUPERVISOR';
```

### Permission Matrix

| Feature | ADMIN | ANALYST | DRIVER | MANAGER | SUPERVISOR |
|---------|-------|---------|--------|---------|------------|
| View Own DPMs | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create DPM | ✓ | ✓ | - | ✓ | ✓ |
| Approve DPMs | ✓ | - | - | ✓ | - |
| Edit DPM Types | ✓ | - | - | - | - |
| Manage Users | ✓ | - | - | - | - |
| Autogenerate | ✓ | ✓ | - | ✓ | ✓ |

### Using Guards

```typescript
// In routes
{
  path: 'admin-only',
  component: AdminComponent,
  canActivate: [authGuard],
  data: { roles: ['ADMIN'] as Roles[] }
}

// In templates (directive)
<button [appRemoveIfUnauthorized]="['ADMIN', 'MANAGER']">
  Approve
</button>
```

## Common Workflows

### Creating a New Component

1. Create component directory: `/src/app/{feature}/{component-name}/`
2. Use standalone pattern with imports
3. Use signals for state
4. Use inject() for DI
5. Use @if/@for in templates
6. Add OnPush change detection

### Adding a New Route

1. Add to appropriate `.routes.ts` file
2. Add guard if authentication needed
3. Specify roles in `data.roles` if role-restricted
4. Update navbar component if needed

### Adding a New Service Method

1. Add method to appropriate service
2. Type return value with DTO
3. Use `${this.apiUrl}/endpoint` pattern
4. Add error handling with `catchError`
5. Consider retry logic for transient failures

### Modifying DPM Types (Admin Feature)

DPM types are editable via drag-and-drop interface in `/dpm` (Edit tab):
- Groups can be reordered
- Types can be moved between groups
- Names, points, and colors are configurable
- Validation: unique names, points -100 to +100, unique colors

## State Management Patterns

### Local Component State (Signals)

```typescript
// Simple state
count = signal(0);
increment() { this.count.update(n => n + 1); }

// Derived state
doubled = computed(() => this.count() * 2);

// Effects
constructor() {
  effect(() => console.log('Count:', this.count()));
}
```

### Service State (Observable → Signal)

```typescript
// In component
items = toSignal(this.service.getItems(), { initialValue: [] });

// Or traditional subscription
ngOnInit() {
  this.service.getItems().pipe(first()).subscribe(items => {
    this.items.set(items);
  });
}
```

### LocalStorage (Session Persistence)

Used only for authentication:
```typescript
localStorage.setItem('token', token);
localStorage.setItem('role', role);
localStorage.setItem('username', username);
localStorage.setItem('exp', exp);
```

## Styling Patterns

### Utility-First (Tailwind)

```html
<div class="container mx-auto px-4 md:px-12 lg:px-20">
  <h2 class="text-3xl mb-5 font-bold">Title</h2>
  <button class="btn btn-primary w-full md:btn-wide">Submit</button>
</div>
```

### Component Libraries

**PrimeNG** (tables, complex components):
```html
<p-table [value]="data" [rows]="10" [paginator]="true">
  <ng-template pTemplate="header">...</ng-template>
  <ng-template pTemplate="body" let-item>...</ng-template>
</p-table>
```

**DaisyUI** (buttons, forms, modals):
```html
<button class="btn btn-primary">Click</button>
<dialog class="modal">
  <div class="modal-box">...</div>
</dialog>
```

### Theme System

Colors defined in `/src/styles.css` using oklch:
- Primary: Dark purple
- Secondary: Yellow
- Light/dark mode support (system preference)

## Testing Patterns

### Unit Tests (Karma + Jasmine)

```typescript
describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleComponent] // Standalone
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Common Pitfalls & Solutions

### Pitfall: Forgetting --legacy-peer-deps

**Problem:** npm install fails with peer dependency errors
**Solution:** Always use `npm install --legacy-peer-deps` (ngx-toastr is on v19, Angular is v21)

### Pitfall: Not using signals in OnPush components

**Problem:** UI doesn't update when data changes
**Solution:** Use signals or call `ChangeDetectorRef.markForCheck()`

### Pitfall: Mixing *ngIf with @if

**Problem:** Angular 21 prefers new control flow
**Solution:** Use @if/@for consistently

### Pitfall: Forgetting to unsubscribe

**Problem:** Memory leaks from subscriptions
**Solution:** Use `first()` operator or `toSignal()` or store in array and unsubscribe in ngOnDestroy

### Pitfall: Not handling 401/403 responses

**Problem:** User stuck when token expires
**Solution:** HTTP interceptor redirects to login on 401, to /errors/403 on 403

## API Integration Notes

### Base URL
Configured in `/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://uts-dpm-backend.herokuapp.com'
};
```

### Authentication Header
JWT token automatically added by HTTP interceptor:
```typescript
headers = headers.set('Authorization', `Bearer ${token}`);
```

### Error Handling
Centralized via `ErrorService`:
- Displays toast notifications
- Logs errors
- Redirects on auth failures

## Build & Deployment

### Local Development
```bash
npm start              # Dev server on :4200
npm run build          # Dev build
npm run build:prod     # Prod build
```

### CI/CD (GitHub Actions)
- **On push to main:** Auto-deploy to Firebase Hosting
- **On PR:** Build check (preview disabled due to staging costs)

### Environment Variables
Set in Firebase Hosting config or environment files:
- `apiUrl` - Backend API URL
- `production` - Production flag

## Debugging Tips

### Angular DevTools
Use Angular DevTools browser extension to:
- Inspect component state (signals)
- View dependency injection tree
- Profile change detection
- Monitor router events

### Console Logging
```typescript
// In development only
if (!environment.production) {
  console.log('Debug:', data);
}
```

### Network Tab
- Check API requests/responses
- Verify JWT token in headers
- Monitor request timing

## Future Modernization Plans

This app is undergoing modernization (Phase 0 complete - Angular 21 upgrade):
- **Phase 1:** Design system refinement
- **Phase 2:** Replace DaisyUI with custom Tailwind components
- **Phase 3:** Replace PrimeNG tables with TanStack Table
- **Phase 4:** Modernize forms (floating labels, better validation, auto-save)
- **Phase 5:** Final polish (remove PrimeNG, bundle optimization, accessibility)

## Quick Reference

### Adding a New DPM Type (Code)
Not needed - admins can do this via UI in `/dpm` Edit tab

### Adding a New Role
1. Update `Roles` type in `/src/app/auth/roles.types.ts`
2. Update permission checks in guards
3. Update backend API

### Changing Color Scheme
Edit `/src/styles.css` light/dark theme sections (oklch colors)

### Adding a New Route
Add to appropriate `.routes.ts` file with guard/roles

---

**Last Updated:** January 2026
**For:** AI agents working on UTS DPM project
