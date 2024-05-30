import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../../Shared/services/DataService';

@Component({
  selector: 'app-books-by-author-id',
  templateUrl: './books-by-author-id.component.html',
  styleUrl: './books-by-author-id.component.scss'
})
export class BooksByAuthorIdComponent implements OnInit {

  @Input() authorId?: number;
  books: any[] = [];
  isOpen = true; // Varsayılan olarak bileşen açık olsun

  constructor(private dataService: DataService) { }

  ngOnInit() {
    if (this.authorId !== undefined) {
      this.fetchBooksByAuthorId(this.authorId);
    }
  }

  fetchBooksByAuthorId(authorId: number) {
    this.dataService.fetchBooksByAuthorId(authorId).subscribe(
      (data: any) => {
        if (data && data.data && Array.isArray(data.data)) {
          this.books = data.data;
        } else {
          console.error('Error fetching books for category:', data.message || 'Invalid data format');
        }
      },
      (error) => {
        console.error('Error fetching books for category:', error);
      }
    );
  }

  closeComponent() {
    this.isOpen = false; // Bileşeni kapat
  }
}
