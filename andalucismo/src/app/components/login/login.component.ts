import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleLoginProvider, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  imports: [CommonModule, GoogleSigninButtonModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authService: any;
  user: SocialUser | null = null;
  isLogged: boolean = false;

  
  signOut(): void {
    this.authService.signOut();
  }
}
