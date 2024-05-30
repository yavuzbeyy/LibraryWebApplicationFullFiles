import { Component, OnInit } from '@angular/core';
import { DataService } from '../../Shared/services/DataService';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../Auth/AuthService';
import { Router } from '@angular/router';
import { BookUpdateModel } from '../../Shared/Models/BookUpdateModel';

interface BookRequest {
  id: number;
  createdDate: string;
  bookId: number; 
  userId: number;
  requestDate: string;
  returnDate: string;
  isApproved: boolean;
  bookTitle?: string; 
  userName?: string; 
}

@Component({
  selector: 'app-request-books',
  templateUrl: './request-books.component.html',
  styleUrls: ['./request-books.component.scss'],
  providers: [DatePipe]
})
export class RequestBooksComponent implements OnInit {
  bookRequests: BookRequest[] = []; 
  isAdmin: boolean = false;
  username: string | any = '';
  decodedToken: string | any = '';

  book: BookUpdateModel = new BookUpdateModel();
  selectedRequest: BookRequest | undefined;

  constructor(private dataService: DataService, private datePipe: DatePipe,private authService: AuthService,private router: Router,) { }

  ngOnInit(): void {
   
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.login();
      this.username = this.authService.getUserName();
      this.isAdmin = this.authService.isAdmin(token);

      console.log(" username bu : ", this.username)
    } else {
      console.log('Token not found');
      this.router.navigate(['/login']);
    }

    this.fetchBookRequests();
  }

  fetchBookRequests(): void {
    this.dataService.fetchBookRequests().subscribe(
      (data: any) => {
        if (data && data.data && Array.isArray(data.data)) {
          this.bookRequests = data.data.map((request: any) => ({
            id: request.id,
            createdDate: this.formatDate(request.createdDate),
            bookId: request.bookId,
            userId: request.userId,
            requestDate: this.formatDate(request.requestDate),
            returnDate: this.formatDate(request.returnDate),
            isApproved: request.isApproved
          }));

          this.bookRequests.forEach((request: BookRequest) => {
            this.fetchBookById(request.bookId).subscribe((bookData: any) => {
              if (bookData && bookData.data && bookData.data.length > 0) {
                request.bookTitle = bookData.data[0].title; 
                request.isApproved = bookData.data[0].isAvailable;
              }
            });

            this.fetchUserById(request.userId).subscribe((userData: any) => {
              if (userData && userData.data && userData.data.length > 0) {
              //  request.userName = userData.data[0].name + ' ' + userData.data[0].surname; 
              request.userName = userData.data[0].username; 
              console.log("isteklerin userNamesi :" , request.userName);
              }
            });
          });
        }
      },
      (error) => {
        console.error('Error fetching book requests:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    return this.datePipe.transform(new Date(dateString), 'dd/MM/yyyy') || ''; 
  }

  fetchBookById(bookId: number): Observable<any> {
    return this.dataService.getBookById(bookId);
  }

  fetchUserById(userId: number): Observable<any> {
    return this.dataService.getUserById(userId);
  }

  deleteRequest(requestId: number): void {
    this.dataService.deleteRequest(requestId).subscribe(
      (response) => {
        this.bookRequests = this.bookRequests.filter((request) => request.id !== requestId);
        this.dataService.showSuccessMessage(response);
      },
      (error) => {
        console.error('Error deleting request:', error);
        this.dataService.showFailMessage(error);
      }
    );
  }

  approveRequest(requestId: number): void {
    this.selectedRequest = this.bookRequests.find(request => request.id === requestId);
    console.log("kitabın idsi : " ,this.selectedRequest?.bookId)

    
    if(this.selectedRequest?.bookId){
    this.book.id = this.selectedRequest?.bookId;
    this.book.isAvailable = false;
    }

    this.dataService.updateBookIsAvailable(this.book).subscribe(
      (response) => {
        this.dataService.showSuccessMessage(response);
        this.router.navigate(['/book']); //yönlendirmeleri kitap isteklerine de yapabilirim
      },
      (error) => {
        console.error('Error updating book:', error);
        this.dataService.showFailMessage(error);
      }
    );

  }

}
