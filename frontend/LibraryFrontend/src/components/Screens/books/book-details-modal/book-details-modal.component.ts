import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../Shared/services/DataService';
import { RequestBookModel } from '../../../Shared/Models/RequestBookModel';
import { AuthService } from '../../Auth/AuthService';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-details-modal',
  templateUrl: './book-details-modal.component.html',
  styleUrls: ['./book-details-modal.component.scss']
})
export class BookDetailsModalComponent {
  @Input() book: any;
  borrowDate: string = ''; 
  returnDate: string = ''; 
  decodedToken: any = null; 

  constructor(public activeModal: NgbActiveModal, private dataService: DataService,private authService: AuthService,private toastr: ToastrService) { }

  closeModal() {
    this.activeModal.dismiss();
  }

  orderBook() {
    if (this.borrowDate && this.returnDate) {
      const requestModel = new RequestBookModel();
      requestModel.bookId = this.book.id;
      requestModel.userId = this.authService.getUserId();
      requestModel.createdDate = new Date(this.borrowDate);
      requestModel.returnDate = new Date(this.returnDate);
      requestModel.isApproved = false; 

      this.dataService.createBookRequest(requestModel).subscribe(
        (response) => {
          console.log('Kitap siparişi başarıyla oluşturuldu.', response);
          this.activeModal.dismiss();
          this.showSuccessMessage(response);
        },
        (error) => {
          console.error('Kitap siparişi oluşturulamadı.', error);
          this.showFailMessage(error);
        }
      );
    } else {
      alert('Lütfen alış ve geri veriş tarihlerini seçin.');
    }
  }

  private showSuccessMessage(response: any): void {
    console.log('Başarılı:', response);
    this.toastr.success('Kitap siparişi başarıyla oluşturuldu.', 'Başarılı');
  }

  private showFailMessage(error: any): void {
    console.error('Hata:', error);
     this.toastr.error('Kitap siparişi oluşturulamadı.', 'Hata');
  }
}
