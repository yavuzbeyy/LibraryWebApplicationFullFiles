import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  // Basit bir uyarı gösteren metot
  showAlert(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') {
    Swal.fire(title, message, type);
  }

  // Onay ve iptal seçenekleri olan bir iletişim kutusu gösteren metot
  acceptOrDecline(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success'): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: message,
      icon: type,
      showCancelButton: true, // İptal butonunu göster
      confirmButtonText: 'Onayla', // Onay butonu metni
      cancelButtonText: 'İptal', // İptal butonu metni
    }).then((result) => {
      // Kullanıcı onayladıysa true, iptal ettiyse false döndür
      return result.isConfirmed;
    });
  }
}
