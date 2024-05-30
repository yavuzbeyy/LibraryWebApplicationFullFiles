import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../Shared/services/DataService';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { UpdateAuthorModel } from '../../../Shared/Models/UpdateAuthorModel';
import { AlertService } from '../../../Shared/Alert/alert.service';

@Component({
  selector: 'app-update-author',
  templateUrl: './update-author.component.html',
  styleUrls: ['./update-author.component.scss']
})
export class UpdateAuthorComponent implements OnInit {

  author: UpdateAuthorModel = new UpdateAuthorModel();
  authorId!: number;
  constructor(private dataService: DataService, private toastr: ToastrService, private route: ActivatedRoute,private alertService: AlertService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.authorId = params['id']; //1 yazınca apiye isteği atıyor normalde undefined yazıyor.
      this.fetchAuthorById(this.authorId);
    });
  }

  fetchAuthorById(authorId: number) {
    this.dataService.getAuthorById(authorId).subscribe(
      (data: any) => {
        if (data && data.data) {
          this.loadAuthorDetails();
        } else {
          console.error('Error fetching author details: Invalid data format');
        }
      },
      (error) => {
        console.error('Error fetching author details:', error);
      }
    );
  }
  //TODO APİYE İKİ KEZ İSTEK ATILIYOR BURAYA BAK
  loadAuthorDetails() {
    this.dataService.getAuthorById(this.authorId).subscribe(
      (data: any) => {
        console.log(data)
        if (data && Array.isArray(data.data)) {
          const authorData = data.data[0]; 
          this.author.id = authorData.id;
          this.author.name = authorData.name;
          this.author.surname = authorData.surname;
          this.author.yearOfBirth = authorData.yearOfBirth;
          this.author.placeOfBirth = authorData.placeOfBirth;

        } else {
          console.error('Author details not found.');
        }
      },
      (error) => {
        console.error('Error fetching author details:', error);
        //this.toastr.error('Error fetching category details.');
      }
    );
  }

  
  updateAuthor() {
    // Yazar güncelleme işlemini onaylamak için AlertService'den acceptOrDecline metodunu kullanalım
    this.alertService.acceptOrDecline('Yazarı Güncelle', 'Bu yazarı güncellemek istediğinizden emin misiniz?', 'warning')
      .then((result) => {
        if (result) {
          // Kullanıcı işlemi onayladıysa yazarı güncelle
          this.dataService.updateAuthor(this.author).subscribe(
            (response) => {
              this.dataService.showSuccessMessage(response);
             // this.router.navigate(['/author']);
            },
            (error) => {
              this.dataService.showFailMessage(error);     
            }
          );
        } else {
          // Kullanıcı işlemi iptal etti
          console.log('Yazar güncelleme işlemi iptal edildi.');
        }
      });
  }


}
