import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorizedDirective } from './authorized.directive';
import { AuthService } from '../../services/auth.service';

@Component({
  template: `
    <div *appAuthorized="allowedRoles" data-testid="protected-content">Protected Content</div>
  `,
  imports: [AuthorizedDirective],
})
class TestHostComponent {
  allowedRoles: string[] = ['ADMIN'];
}

describe('AuthorizedDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  function createTestBed(role: string, allowedRoles: string[] = ['ADMIN']) {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      userData: {
        role,
        token: 'test-token',
        exp: 9999999999,
        username: 'test@example.com',
      },
    });

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    // Set allowedRoles BEFORE first detectChanges to avoid NG0100
    component.allowedRoles = allowedRoles;
    fixture.detectChanges();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should show content when user has allowed role', () => {
    createTestBed('ADMIN', ['ADMIN']);

    const content = fixture.nativeElement.querySelector('[data-testid="protected-content"]');
    expect(content).toBeTruthy();
    expect(content.textContent).toContain('Protected Content');
  });

  it('should hide content when user does not have allowed role', () => {
    createTestBed('DRIVER', ['ADMIN']);

    const content = fixture.nativeElement.querySelector('[data-testid="protected-content"]');
    expect(content).toBeFalsy();
  });

  it('should show content when user has one of multiple allowed roles', () => {
    createTestBed('MANAGER', ['ADMIN', 'MANAGER', 'SUPERVISOR']);

    const content = fixture.nativeElement.querySelector('[data-testid="protected-content"]');
    expect(content).toBeTruthy();
  });

  it('should hide content for empty allowed roles', () => {
    createTestBed('ADMIN', []);

    const content = fixture.nativeElement.querySelector('[data-testid="protected-content"]');
    expect(content).toBeFalsy();
  });
});
