import { Component, OnInit } from '@angular/core';
import { DataService } from '../../Shared/services/DataService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../Auth/AuthService';
import { AlertService } from '../../Shared/Alert/alert.service';


@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent implements OnInit {

  authors: any[] = [];
  selectedAuthorId: number | null = null;
  isAdmin : boolean = false;
  filterText: string = '';

  constructor(private dataService: DataService,private toastr: ToastrService,private router: Router,private authService: AuthService,private alertService: AlertService) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if(token){ 
      this.isAdmin = this.authService.isAdmin(token);
    }
    this.fetchAuthors();
  }

  fetchAuthors() {
   
    this.dataService.fetchAuthors().subscribe(
      (data: any) => {
        if (data && data.data && Array.isArray(data.data)) {
          this.authors = data.data;
          this.loadAuthorImages()
        } else {
          console.error('Error fetching authors: Invalid data format');
        }
      },
      (error) => {
        console.error('Error fetching authors:', error);
      }
    );
  }

  applyFilter() {
    if (!this.filterText) {
      this.fetchAuthors();
    } else {
      this.authors= this.authors.filter(author =>
        author.name.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }
  }

  deleteAuthor(authorId: number) {
    this.alertService.acceptOrDecline('Yazarı Sil', 'Bu yazarı silmek istediğinizden emin misiniz?', 'warning')
      .then((result) => {
        if (result) {
          this.dataService.deleteAuthor(authorId).subscribe(
            (response) => {
              this.authors = this.authors.filter(a => a.id !== authorId);
              this.fetchAuthors();
              this.dataService.showSuccessMessage(response);
            },
            (error) => {
              this.dataService.showFailMessage(error);
            }
          );
        } else {
          console.log('Yazar silme işlemi iptal edildi.');
        }
      });
  }

  loadAuthorImages() {
    this.authors.forEach(author => {
      this.dataService.fetchImagesFromRedis(author.fotoKey).subscribe(
        (imageBlob: Blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const imageDataUrl = reader.result as string;
            author.imageUrl = imageDataUrl;
          };
          reader.readAsDataURL(imageBlob);
        },
        (error) => {
          console.error(`Error loading image for book ${author.id}:`, error);
        }
      );
    });
  }

  showAuthorBooks(authorId: number) {
    this.selectedAuthorId = authorId; 
  }

  goToUpdateAuthor(authorId: number) {
    this.router.navigate(['/update-author', authorId]); 
  }

}
