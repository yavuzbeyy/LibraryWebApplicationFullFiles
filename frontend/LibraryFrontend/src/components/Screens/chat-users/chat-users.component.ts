import { Component, OnInit } from '@angular/core';
import { DataService } from '../../Shared/services/DataService';
import { AppComponent } from '../../Shared/app/app.component';

@Component({
  selector: 'app-chat-users',
  templateUrl: './chat-users.component.html',
  styleUrls: ['./chat-users.component.scss']
})
export class ChatUsersComponent implements OnInit {

  users: any[] = [];
  groups: any[] = [];
  adminSentToHim: string = '';
  username: string | null = '';

  constructor(private dataService: DataService, public appComponent: AppComponent) { }

  ngOnInit(): void {
    this.groupApiRequest();
    this.username = this.appComponent.username;
  }

  loadGroups() {
    // Admin ise tüm grupları yükle
    if (this.appComponent.isAdmin) {
      this.dataService.getAllGroups().subscribe(
        (data: any) => {
          if (data && data.data && Array.isArray(data.data)) {
            this.groups = data.data;
          }
        },
        error => {
          console.error('Grup bilgilerini alma hatası:', error);
        }
      );
    } else {
      // Admin değilse sadece kullanıcının üye olduğu grupları filtrele
      this.groups = this.groups.filter(group => group.usernames.includes(this.username));
    }
  }

  addNewGroup() {
    const groupName = prompt("Yeni grup adını girin:");
    if (groupName) {
      this.dataService.createGroup(groupName).subscribe(
        (response: any) => {
          this.groups.push(response.data);
          console.log('Yeni grup oluşturuldu:', response);
        },
        error => {
          console.error('Yeni grup oluşturma hatası:', error);
        }
      );
    }
  }

  deleteGroup(groupId: number) {
    if (confirm("Bu grubu silmek istediğinizden emin misiniz?")) {
      this.dataService.deleteGroupRequest(groupId).subscribe(
        (response: any) => {
          this.groups = this.groups.filter(group => group.id !== groupId);
          console.log('Grup silindi:', response);
        },
        error => {
          console.error('Grup silme hatası:', error);
        }
      );
    }
  }

  selectedUser(selectedUser: string) {
    console.log("selected user : ", selectedUser);
  }

  addUserToGroup(groupId: number) {
    const username = prompt("Kullanıcı adını girin:");
    if (username) {
      this.dataService.addUserToGroup(username, groupId).subscribe(
        (response: any) => {
          const groupIndex = this.groups.findIndex(group => group.id === groupId);
          if (groupIndex !== -1) {
            this.groups[groupIndex].usernames.push(username);
          }
          console.log('Kullanıcı gruba eklendi:', response);
        },
        error => {
          console.error('Kullanıcı ekleme hatası:', error);
        }
      );
    }
  }

  groupApiRequest() {
    this.dataService.getAllUser().subscribe(
      (data: any) => {
        if (data && data.data && Array.isArray(data.data)) {
          this.users = data.data;
        }
      },
      error => {
        console.error('Kullanıcı bilgilerini alma hatası:', error);
      }
    );

    // Tüm grupları yükle
    this.dataService.getAllGroups().subscribe(
      (data: any) => {
        if (data && data.data && Array.isArray(data.data)) {
          this.groups = data.data;
          this.loadGroups();
        }
      },
      error => {
        console.error('Grup bilgilerini alma hatası:', error);
      }
    );
  }
}
