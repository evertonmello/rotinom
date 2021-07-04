import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-home-template',
  templateUrl: './home-template.component.html',
  styleUrls: ['./home-template.component.scss']
})
export class HomeTemplateComponent implements OnInit {

  showSideMenu = false;
  isBoraBoraUser = false;
  isSupportUser = false;
  constructor(private auth: AuthService) { 
    this.isBoraBoraUser = this.auth.boraboraUser;
    this.isSupportUser = this.auth.isSupportUser;
  }

  ngOnInit() {
  }
  setMenuView() {
    this.showSideMenu = !this.showSideMenu;
  }

  logout(){
    this.auth.logout();
  }

}
