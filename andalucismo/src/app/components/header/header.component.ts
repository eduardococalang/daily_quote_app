import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { SocialUser } from '@abacritt/angularx-social-login';
import { SocialAuthService } from '@abacritt/angularx-social-login';


@Component({
  selector: 'app-header',
  imports: [LoginComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user: SocialUser | null = null;
  isLogged: boolean = false;

  constructor(private authService: SocialAuthService) {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.isLogged = !!user;
    });
  }

  signOut(): void {
    this.authService.signOut();
  }




}
