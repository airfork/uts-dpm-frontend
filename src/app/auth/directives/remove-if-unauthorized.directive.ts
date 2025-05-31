import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';
import { Roles } from '../roles.types';
import { AuthService } from '../../services/auth.service';

@Directive({
  selector: '[appRemoveIfUnauthorized]',
})
export class RemoveIfUnauthorizedDirective implements OnInit {
  private authService = inject(AuthService);
  private el = inject(ElementRef);

  @Input('appRemoveIfUnauthorized') roles: Roles[] = [];

  ngOnInit() {
    const role = this.authService.userData.role as Roles;
    if (!this.roles.includes(role)) {
      this.el.nativeElement.remove();
    }
  }
}
