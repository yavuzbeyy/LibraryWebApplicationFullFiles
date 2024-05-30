import { Component } from '@angular/core';
import { DataService } from '../../../Shared/services/DataService';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { BookUpdateModel } from '../../../Shared/Models/BookUpdateModel';
import { AlertService } from '../../../Shared/Alert/alert.service';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrl: './update-book.component.scss'
})
export class UpdateBookComponent {
  book: BookUpdateModel = new BookUpdateModel();
  authors: any[] = [];
  categories: any[] = [];
  selectedFile: File | undefined;
  bookId!: number;

  constructor(private dataService: DataService, private toastr: ToastrService,private route: ActivatedRoute,private alertService: AlertService) {}

  ngOnInit() { 
    this.route.params.subscribe(params => {
    this.bookId = params['id'];
    if (this.bookId) {
      this.loadBookDetails();
    }
  });
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  loadBookDetails() {
    this.dataService.getBookById(this.bookId).subscribe(
      (data: any) => {
       // console.log(data)
        if (data && Array.isArray(data.data)) {
          const bookData = data.data[0]; 
          this.book.id = bookData.id;
          this.book.title = bookData.title;
          this.book.description = bookData.description;
          this.book.publicationYear = bookData.publicationYear;;
          this.book.numberOfPages = bookData.numberOfPages;
          this.book.isAvailable = bookData.isAvailable;
          this.book.fileKey = bookData.filekey;
          this.book.authorId = bookData.authorId;
          this.book.categoryId = bookData.categoryId;
        } else {
          console.error('Book details not found.');
        }
      },
      (error) => {
        this.toastr.error('Error fetching category details.');
      }
    );
  }

  updateBook() {
    this.alertService.acceptOrDecline('Kitabı Güncelle', 'Bu kitabı güncellemek istediğinizden emin misiniz?', 'warning')
      .then((result) => {
        if (result) {
          // Kullanıcı işlemi onayladıysa kitabı güncelle
          this.dataService.updateBook(this.book).subscribe(
            (response) => {
              this.dataService.showSuccessMessage(response);
              // this.router.navigate(['/books']);
            },
            (error) => {
              this.dataService.showFailMessage(error);     
            }
          );
        } else {
          // Kullanıcı işlemi iptal etti
          console.log('Kitap güncelleme işlemi iptal edildi.');
        }
      });
  }
  

  setAuthorId() {
    const selectedAuthorName = this.book.authorName;
    const selectedAuthor = this.authors.find(author => author.name === selectedAuthorName);
    if (selectedAuthor) {
      this.book.authorId = selectedAuthor.id;
    }
  }
  
  setCategoryId() {
    const selectedCategoryName = this.book.categoryName;
    const selectedCategory = this.categories.find(category => category.name === selectedCategoryName);
    if (selectedCategory) {
      this.book.categoryId = selectedCategory.id;
    }
  }
  
}
