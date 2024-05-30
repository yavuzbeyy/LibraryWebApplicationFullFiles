import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../../Shared/services/DataService';

@Component({
  selector: 'app-books-by-category-id',
  templateUrl: './books-by-category-id.component.html',
  styleUrls: ['./books-by-category-id.component.scss']
})
export class BooksByCategoryIdComponent implements OnInit {
  @Input() categoryId?: number;
  books: any[] = [];
  isOpen = true; 

  constructor(private dataService: DataService) { }

  ngOnInit() {
    if (this.categoryId !== undefined) {
      this.fetchBooksByCategoryId(this.categoryId);
    }
  }

  fetchBooksByCategoryId(categoryId: number) {
    this.dataService.fetchBooksByCategoryId(categoryId).subscribe(
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
