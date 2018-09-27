import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-protectedpage',
  templateUrl: './protectedpage.component.html',
  styleUrls: ['./protectedpage.component.scss']
})
export class ProtectedpageComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  public message: string = null;

  ngOnInit() {
    this.httpClient.get<string>(`${environment.authenticationApi}/api/test`).subscribe(data => {
      this.message = data;
    })
  }
}
