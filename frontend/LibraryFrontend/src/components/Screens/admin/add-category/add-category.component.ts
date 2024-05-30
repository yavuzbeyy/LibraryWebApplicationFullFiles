import { Component } from '@angular/core';
import { DataService } from '../../../Shared/services/DataService';
import { CategoryModel } from '../../../Shared/Models/CategoryModel';
import { AlertService } from '../../../Shared/Alert/alert.service';


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {
  category: CategoryModel = new CategoryModel();

  constructor(private dataService: DataService,private alertService: AlertService) {}

  submitForm() {
    // Kategori ekleme işlemini onaylamak için AlertService'den acceptOrDecline metodunu kullanalım
    this.alertService.acceptOrDecline('Kategoriyi Ekle', 'Bu kategoriyi eklemek istediğinizden emin misiniz?', 'warning')
      .then((result) => {
        if (result) {
          // Kullanıcı işlemi onayladıysa kategoriyi ekle
          this.dataService.createCategory(this.category).subscribe(
            (response) => {
              this.dataService.showSuccessMessage(response);
            },
            (error) => {
              this.dataService.showFailMessage(error);
            }
          );
        } else {
          // Kullanıcı işlemi iptal etti
          console.log('Kategori ekleme işlemi iptal edildi.');
        }
      });
  }
}
