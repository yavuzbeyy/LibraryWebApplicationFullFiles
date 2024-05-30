import { Component, OnInit } from '@angular/core';
import { DataService } from '../../Shared/services/DataService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; // RouterModule ve Router modülünü ekledik
import { AuthService } from '../Auth/AuthService';
import { AlertService } from '../../Shared/Alert/alert.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: any[] = [];
  selectedCategoryId: number | null = null;
  isAdmin : boolean = false;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if(token){ 
      this.isAdmin = this.authService.isAdmin(token);
    }
    this.fetchCategories();
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

  deleteCategory(categoryId: number) {
    this.alertService.acceptOrDecline('Kategoriyi Sil', 'Bu kategoriyi silmek istediğinizden emin misiniz?', 'warning')
      .then((result) => {
        if (result) {
          // Kullanıcı işlemi onayladıysa kategoriyi sil
          this.dataService.deleteCategory(categoryId).subscribe(
            (response) => {
              this.categories = this.categories.filter(c => c.id !== categoryId);
              this.dataService.showSuccessMessage(response);
            },
            (error) => {
              console.error('Error deleting category:', error);
              this.dataService.showFailMessage(error);
            }
          );
        } else {
          console.log('Kategori silme işlemi iptal edildi.');
        }
      });
  }
  showCategoryBooks(categoryId: number) {
    this.selectedCategoryId = categoryId;
  }

  goToUpdateCategory(categoryId: number) {
    this.router.navigate(['/update-category', categoryId]); // Router üzerinden yönlendirme
  }
}
