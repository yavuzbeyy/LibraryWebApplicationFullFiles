import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // NgbModal'ı ekleyin
import { DataService } from '../../Shared/services/DataService';
import { AuthService } from '../Auth/AuthService';
import { Router } from '@angular/router';
import { BookDetailsModalComponent } from './book-details-modal/book-details-modal.component';
import { AlertService } from '../../Shared/Alert/alert.service';
import { BookContentModel } from '../../Shared/Models/BookContentModel';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  books: any[] = [];
  originalBooks: any[] = [];
  isAdmin: boolean = false;
  filterText: string = '';
  filterTextAi: string = '';
  bookContent : BookContentModel = new BookContentModel();
  

  constructor(private dataService: DataService, private authService: AuthService, private router: Router, private modalService: NgbModal,private alertService: AlertService) 
  {
  }

  ngOnInit() {

    const token = localStorage.getItem('token');
  
    if (token) {
      this.isAdmin = this.authService.isAdmin(token);
      console.log("book sayfası için : ", this.authService.userIsLogin())
    
  }
    this.fetchBooks();
  }

  applyFilter() {
    if (!this.filterText) {
      // Filtre metni boşsa, tüm kitapları göster
      this.fetchBooks();
    } else {
      // Filtre metni doluysa, kitapları filtreye göre filtrele
      this.books = this.books.filter(book =>
        book.title.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }
  }

  fetchBooks() {
    this.dataService.fetchData().subscribe(
      (data: any) => {
        if (data && data.data && Array.isArray(data.data)) {
          this.books = data.data;
          this.loadBookImages();
          this.originalBooks = this.books
        } else {
          console.error('Error fetching books: Invalid data format');
        }
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }

  openBookDetailsModal(book: any) {
    const modalRef = this.modalService.open(BookDetailsModalComponent, { centered: true });
    modalRef.componentInstance.book = book;
  }

  searchBooksByContent() {
    if (!this.filterTextAi) {
      this.books = this.originalBooks // Filtre metni boşsa, tüm kitapları yeniden yükle
    } else {
     this.books = this.originalBooks
     this.bookContent.bookcontent = this.filterTextAi;
     this.dataService.getBooksByContent(this.bookContent).subscribe(
        data => {
          let bookTitle = data.message; // API'den gelen kitap başlığını al
          //console.log("apiden gelen booktitle" , bookTitle)
          if (bookTitle) {
           this.books = this.books.filter(book =>
              book.title.includes(bookTitle)
            );
          }
          console.log('Books fetched by AI content search:', bookTitle);
        },
        error => {
          console.error('Error fetching books:', error);
        }
      );
    }}


  loadBookImages() {
    this.books.forEach(book => {
      this.dataService.fetchImages(book.filekey).subscribe(
        (imageBlob: Blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const imageDataUrl = reader.result as string;
            book.imageUrl = imageDataUrl;
          };
          reader.readAsDataURL(imageBlob);
        },
        (error) => {
          console.error(`Error loading image for book ${book.id}:`, error);
        }
      );
    });
  }

  goToUpdateBook(bookId: number) {
    this.router.navigate(['/update-book', bookId]);
  }

  deleteBook(bookId: number) {
    this.alertService.acceptOrDecline('Kitabı Sil', 'Bu kitabı silmek istediğinizden emin misiniz?', 'warning')
      .then((result) => {
        if (result) {
          // Kullanıcı işlemi onayladıysa kitabı sil
          this.dataService.deleteBook(bookId).subscribe(
            (response) => {
              this.books = this.books.filter(b => b.id !== bookId);
              this.fetchBooks(); 
              this.dataService.showSuccessMessage(response);
            },
            (error) => {
              this.dataService.showFailMessage(error);
            }
          );
        } else {
          console.log('Kitap silme işlemi iptal edildi.');
        }
      });
  }
}


