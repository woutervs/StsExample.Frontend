import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from "../authorization.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(private authorizationService: AuthorizationService, private router: Router) { }

  public username: string = "";
  public password: string = "";
  public message: string = "";
  public loginSuccess: boolean = false;

  ngOnInit() {
  }


  onSubmit() {
    this.authorizationService.login(this.username, this.password).subscribe(
      success => {
        if (success) {
          if (this.authorizationService.redirectUrl != null) {
            this.router.navigate([this.authorizationService.redirectUrl]);
          } else {
            this.message = "Login succesfull!";
            this.loginSuccess = true;
          }
        }
      },
      error => {
        this.message = error.error.error_description || error.message;
        this.loginSuccess = false;
      }
    );
  }

  get diagnostic() { return JSON.stringify({ username: this.username, password: this.password }); }
}
