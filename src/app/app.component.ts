import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { HubConnection, HubConnectionBuilder} from '@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private hubConnection: HubConnection;
  title = 'mottu-monitor';
  constructor(
    private authService: AuthService, 
    private router: Router) {

  }
  ngOnInit() {
    if (this.authService.userLogged) {
      this.router.navigate(['/home']);
    } 

  }

}
