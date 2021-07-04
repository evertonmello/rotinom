import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NewsletterService } from 'src/app/shared/services/newsletter.service';

@Component({
  selector: 'app-login-template',
  templateUrl: './login-template.component.html',
  styleUrls: ['./login-template.component.scss']
})
export class LoginTemplateComponent implements OnInit {

  readonly VAPID_PUBLIC_KEY = "BKay1FqzBZpZdJIRWB880047r40wpd2zSm7yMAReuqwEtw0pUW5_l80zpNdQwR3Vr3xBTHnPwMcby3Nb0yZoHcE";

  public form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  public restSenha: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    celular: new FormControl('', Validators.required),
  });
  public passWordType = 'password';
  public showLoader = false;
  public resetPass = false;
  constructor(
    private authService: AuthService,
    private newsletterService: NewsletterService) { }

  ngOnInit() {

  }

  setPasswordView() {
    this.passWordType = this.passWordType == 'text' ? 'password' : 'text';
  }



  login() {
    this.showLoader = true;
    this.authService
      .login({
        login: this.form.controls.email.value,
        password: this.form.controls.password.value,
      })
      .subscribe(
        (data) => {
          this.showLoader = false;
        },
        (error) => {
          this.showLoader = false;
          this.authService.login(this.form.value);
        }
      );
  }

}
