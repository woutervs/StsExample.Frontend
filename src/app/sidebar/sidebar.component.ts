import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../authorization.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private authorizationService: AuthorizationService) { }

  ngOnInit() {
  }

  public logOut(): void {
    this.authorizationService.logout();
  }

  public get isAuthenticated():Promise<boolean> {
    return this.authorizationService.verifyIsAuthenticated;
  }

  public get username(): string {
    return this.authorizationService.username;
  }
}
