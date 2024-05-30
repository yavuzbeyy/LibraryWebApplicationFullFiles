import { Component } from '@angular/core';
import { DataService } from '../../../Shared/services/DataService'; 
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../AuthService';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  forgotPassword: boolean = false;
  resetPasswordUsername: string = '';
  
  constructor(
    private dataService: DataService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    
  ) { }

  onSubmit(): void {
    if (this.username && this.password) {
      this.dataService.login(this.username, this.password).subscribe(
        response => {
          console.log(response.message);
          if (response.success) {
            const token = response.message;

            localStorage.setItem('token', token);
            this.authService.login();

            this.toastr.success("Yönlendiriliyor...", 'Başarılı', {
              positionClass: 'toast-top-right' 
            });

            setTimeout(() => {
              this.router.navigate(['/book']).then(() => {
                window.location.reload(); 
              });
            }, 1000); //1 Saniye bekletip gidelim çünkü uyarı gözükmüyordu
          } else {
            this.toastr.error("Kullanıcı adı veya şifre hatalı", 'Başarısız', {
              positionClass: 'toast-top-right' 
            });
          }
        },
        error => {
          this.errorMessage = 'Giriş yaparken bir hata oluştu. Lütfen tekrar deneyin.';
          this.toastr.error("Kullanıcı adı veya şifre hatalı", 'Başarısız', {
            positionClass: 'toast-top-right' 
          });
        }
      );
    } else {
      this.errorMessage = 'Lütfen kullanıcı adı ve şifreyi girin.';
    }
  }


  onForgotPassword(): void {
    this.forgotPassword = !this.forgotPassword;
  }
  

onResetPassword() {
  if (this.resetPasswordUsername) {
    this.dataService.resetPassword(this.resetPasswordUsername).subscribe(
      response => {
        this.dataService.showSuccessMessage(response);
      },
      error => {
        this.dataService.showFailMessage(error);
      }
    );
  } else {
    this.toastr.error("Lütfen kullanıcı adınızı giriniz", 'Başarısız', {
      positionClass: 'toast-top-right' 
    });
  }
}

}
