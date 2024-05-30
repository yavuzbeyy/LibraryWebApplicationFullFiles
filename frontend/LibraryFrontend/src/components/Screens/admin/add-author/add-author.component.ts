// AddAuthorComponent.ts

import { Component } from '@angular/core';
import { DataService } from '../../../Shared/services/DataService';
import { AuthorModel } from '../../../Shared/Models/AuthorModel';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AlertService } from '../../../Shared/Alert/alert.service';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.scss']
})
export class AddAuthorComponent {
  author: AuthorModel = new AuthorModel();
  selectedFile: File | undefined;

  constructor(
    private dataService: DataService, 
    private toastr: ToastrService,
    private router: Router,
    private alertService: AlertService
  ) {}

  submitForm() {
    if (this.selectedFile) {
      this.dataService.uploadImage(this.selectedFile).subscribe(
        (response: any) => {
          this.author.fotoKey = response; // Assigning the returned file key to author's imageFileKey field
          this.createAuthor(); // Proceed to create author after image upload
        },
        (uploadError) => {
          this.toastr.error('Error uploading image', 'Error');
        }
      );
    } else {
      this.toastr.error('Please select an image for the author.', 'Error');
    }
  }

  createAuthor() {
    this.alertService.acceptOrDecline('Yazarı Ekle', 'Bu yazarı eklemek istediğinizden emin misiniz?', 'warning')
      .then((result) => {
        if (result) {
          this.dataService.createAuthor(this.author).subscribe(
            (response) => {
              this.dataService.showSuccessMessage(response);
              // this.router.navigate(['/authors']);
            },
            (error) => {
              this.dataService.showFailMessage(error);
            }
          );
        } else {
          console.log('Yazar ekleme işlemi iptal edildi.');
        }
      });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }
}
