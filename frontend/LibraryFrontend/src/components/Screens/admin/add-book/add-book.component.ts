import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../Shared/services/DataService';
import { BookModel } from '../../../Shared/Models/BookModel';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../../Shared/Alert/alert.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {
  book: BookModel = new BookModel();
  authors: any[] = [];
  categories: any[] = [];
  selectedFile: File | undefined;

  constructor(private dataService: DataService, private toastr: ToastrService,private alertService: AlertService) {}

  ngOnInit() {
    
    this.fetchAuthors();
    this.fetchCategories();
  }

  fetchAuthors() {
    this.dataService.fetchAuthors().subscribe(
      (data: any) => {
        if (data && data.data && Array.isArray(data.data)) {
          this.authors = data.data;
        } else {
          console.error('Error fetching authors: Invalid data format');
        }
      },
      (error) => {
        console.error('Error fetching authors:', error);
      }
    );
  }

  fetchCategories() {
    this.dataService.fetchCategories().subscribe(
      (data: any) => {
        if (data && data.data && Array.isArray(data.data)) {
          this.categories = data.data;
        } else {
          console.error('Error fetching categories: Invalid data format');
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  submitForm() {
    const selectedAuthor = this.authors.find((author) => author.name === this.book.authorName);
    const selectedCategory = this.categories.find((category) => category.name === this.book.categoryName);

    if (selectedAuthor && selectedCategory && this.selectedFile) {
      this.book.authorId = selectedAuthor.id;
      this.book.categoryId = selectedCategory.id;

      this.dataService.uploadImage(this.selectedFile).subscribe(
        (response: any) => {

          this.book.fileKey = response;
          this.createBook();
        },
        (uploadError) => {
          this.toastr.error('Error uploading image', 'Error');
        }
      );
    } else {
      this.toastr.error('Invalid author, category, or file selected.', 'Error');
    }
  }

  createBook() {
    this.alertService.acceptOrDecline('Kitabı Ekle', 'Bu kitabı eklemek istediğinizden emin misiniz?', 'warning')
      .then((result) => {
        if (result) {
          // Kullanıcı işlemi onayladıysa kitabı ekle
          this.dataService.createBook(this.book).subscribe(
            (createResponse) => {
              this.toastr.success(createResponse.message, 'Başarılı');
            },
            (createError) => {
              this.toastr.error(createError.message, 'Error');
            }
          );
        } else {
          // Kullanıcı işlemi iptal etti
          console.log('Kitap ekleme işlemi iptal edildi.');
        }
      });
  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

}
