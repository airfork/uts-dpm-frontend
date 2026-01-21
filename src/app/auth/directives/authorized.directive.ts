import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Roles } from '../roles.types';

@Directive({
  selector: '[appAuthorized]',
  standalone: true,
})
export class AuthorizedDirective implements OnInit {
  @Input('appAuthorized') roles: Roles[] = [];

  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);

  ngOnInit() {
    const role = this.authService.userData.role as Roles;
    if (this.roles.includes(role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
