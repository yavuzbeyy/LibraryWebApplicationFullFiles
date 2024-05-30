import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../Screens/Auth/AuthService';
import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { AlertService } from '../Alert/alert.service';
import { faSquareXmark,faArrowLeftLong,faRightFromBracket,faPencil,faBookAtlas,faPenToSquare,faPaperclip ,faCoffee} from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../Shared/services/DataService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit , AfterViewInit{

  username: string | any = '';
  adminSentToHim: string  = '';
  decodedToken: any = null; 
  role: number | any = null;
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  showUserList: boolean = false;
  isGroupMessage: boolean | any = null;
  faCoffee = faCoffee;
  paperclip = faPaperclip;
  penToSquare = faPenToSquare;
  bookAtlas = faBookAtlas;
  pencil = faPencil;
  logoutIcon = faRightFromBracket;  
  faSquareXmark = faSquareXmark;
  faArrowLeftLong=faArrowLeftLong;
  users: any[] = [];


  constructor(
    private router: Router,
    public authService: AuthService,
    private hubConnection: HubConnection,
    private alertService: AlertService,
    private dataService: DataService
  ) {}

  ngAfterViewInit(): void {
    this.startSignalRConnection(); 
  }

  ngOnInit(): void {

    if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.login();
      this.isLoggedIn = this.authService.userIsLogin();
      this.decodeToken(token);
      this.isAdmin = this.authService.isAdmin(token);
      //this.getAllUsers();
    } else {
      console.log('Token not found');
      this.router.navigate(['/login']);
    }
  } else {
    console.log('localStorage is not available');
  }


  }

   startSignalRConnection() {
    //console.log("Signal R startConnection başında Giriş Yaptin mi:", this.authService.userIsLogin());
    const connectionOptions = {
       withUrl: 'http://localhost:5062/connectServerHub',
      skipNegotiation: true,
       transport: HttpTransportType.WebSockets

    };
    
     const startConnection = () => {
       this.hubConnection = new HubConnectionBuilder()
        .withUrl(connectionOptions.withUrl, { ...connectionOptions })
        .build();
  
       this.hubConnection.start()
        .then(() => {
          console.log("SignalR Bağlantısı Kuruldu");
         this.hubConnection.invoke("BroadcastMessageToAllClient", "Merhabalar !");
         this.hubConnection.invoke("sendWelcomeMessage");
        })
        .then(() => {
          //console.log("Mesaj sunucuya gönderildi.");
        })
        .catch(error => {
          console.error("Error while establishing connection or invoking method:", error);
         setTimeout(startConnection, 5000); 
     });
     
      //Hoşgeldiniz mesajı
         this.hubConnection.on("ReceiveMesasgesForAllClients", (message) => {
         this.showReceivedMessage(message);
       })

       //Hoşheldiniz Mesajı
        this.hubConnection.on("WelcomeMessage", (message) => {
         console.log("Hoşgeldin Mesajı : " + message);
        this.showReceivedMessage(message);
       })

       //Kullanıcının mesajı
        this.hubConnection.on("MessageSentFromClient", (message,username) => {
         console.log("Kullanıcının ilettiği mesaj : " + message,username);
         this.showReceivedMessage(message);
       })

       this.hubConnection.on("ShowMessageToAdmin", (message, username) => {
        console.log("Admin'e gösterilecek mesaj:", message, "Gönderen:", username);
        this.showMessageToAdmin(message, username);
      });

      this.hubConnection.on("ShowAdminMessageToUser", (message) => {
        console.log("Admin'den kullanıcıya gösterilecek mesaj:", message);
        this.showAdminMessageToUser(message);
      });

      // SignalRdan Gelen Eski Mesajlar
      this.hubConnection.on("ShowPreviousMessages", (messages) => {
      console.log("Previous messages:", messages);
      messages.forEach((message: any) => { // Her bir mesaj için forEach döngüsü
      this.showPreviousChatMessage(message.message,message.username,message.isAdminMessage); //message.selectedusername kalktı
  });
});
     };
     startConnection(); 
   }
  
 
   showReceivedMessage(message: string): void {
    const chatElement = document.getElementById('liveChatMessages');
    if (chatElement) {
      const chatMessageElement = document.createElement('div');
      chatMessageElement.classList.add('chat-message', 'p-3');
      chatMessageElement.innerHTML = `
      <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width="30" height="30"> <h5>Yönetici</h5>
      <div class="chat ml-2 p-3" style="border: 1px solid #fd0000;
      font-size: 15px;
      font-family: 'Roboto', sans-serif;
      border-radius: 20px;
      " >${message}</div>`;
      chatElement.appendChild(chatMessageElement);
       // Otomatik olarak en aşağıya kaydır
     chatElement.scrollTop = chatElement.scrollHeight;
    }
  }

  showPreviousChatMessage(message: string, username:string,isAdminMessage:boolean): void {
    const chatElement = document.getElementById('liveChatMessages');
    //normal kullanıcının mesajııysa
    if (chatElement && isAdminMessage === false) {
      this.showUserImmage(chatElement,message,username)
    }
    //admin kullanıcı ise
    else if (chatElement && isAdminMessage === true) {
      const chatMessageElement = document.createElement('div');
      chatMessageElement.classList.add('chat-message', 'p-3');
      chatMessageElement.innerHTML = `
      <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width="30" height="30" > <h5>Yönetici</h5>
      <div class="chat ml-2 p-3" style="border: 1px solid #fd0000;
      font-size: 15px;
      font-family: 'Roboto', sans-serif;
      border-radius: 20px;
      ">${message}</div>`;
      chatElement.appendChild(chatMessageElement);
       // Otomatik olarak en aşağıya kaydır
     chatElement.scrollTop = chatElement.scrollHeight;
      
    }
  }

    //Yeni mesaj gönderme butonu
  sendChatMessage(message: string, username:string,role:string): void {
    console.log("Rol bu : " + typeof(role))
    const chatElement = document.getElementById('liveChatMessages');
       //normal kullanıcının mesajııysa
       if (chatElement && role ==="2" ) {
        this.showUserImmage(chatElement,message,this.username)
      }
      //admin kullanıcı ise
     /* else if (chatElement && role === "1") {
        const chatMessageElement = document.createElement('div');
        chatMessageElement.classList.add('chat-message', 'p-3');
        chatMessageElement.innerHTML = `
          <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width="30" height="30"> <h5>Yönetici</h5>
          <div class="message-content">${message}</div>`;
        chatElement.appendChild(chatMessageElement);
      }*/
  
    console.log(message, username,role)
    // SignalR üzerinden mesajı gönder
    this.hubConnection.invoke("SendChatMessageClientOnly", message, username,role,this.adminSentToHim,this.isGroupMessage)
      .then(() => {
        console.log("Mesaj gönderildi:", message);
      })
      .catch(error => {
        console.error("Error while sending message:", error);
      });
  }

  getPreviousMessages() {
    this.hubConnection.invoke("GetPreviousMessages", this.username)
      .then(() => {
        console.log("Bu kullanıcıların geçmiş mesajlarını görme isteği: " + this.username);
      })
      .catch(error => {
        console.error("Error while getting previous messages:", error);
      });
  }

  getPreviousMessagesBySelectedUsername(selectedUsername:string) {

    this.adminSentToHim =  selectedUsername;
    this.isGroupMessage = false;

    const chatElement = document.getElementById('liveChatMessages');
    if (!chatElement) {
      console.error('liveChatMessages elementi bulunamadı.');
      return;
    }
  
    chatElement.innerHTML = '';

    console.log("selected username : ", selectedUsername);
    this.hubConnection.invoke("GetPreviousMessages", selectedUsername)
      .then(() => {
        console.log("Bu kullanıcıların geçmiş mesajlarını görme isteği: " + selectedUsername);
      })
      .catch(error => {
        console.error("Error while getting previous messages:", error);
      });
  }

  getPreviousMessagesByGroupname(groupName:string) {

    this.adminSentToHim =  groupName;
    this.isGroupMessage = true;

    const chatElement = document.getElementById('liveChatMessages');
    if (!chatElement) {
      console.error('liveChatMessages elementi bulunamadı.');
      return;
    }
  
    chatElement.innerHTML = '';

    this.hubConnection.invoke("GetPreviousMessagesFromGroups", groupName)
      .then(() => {
      })
      .catch(error => {
        console.error("Error while getting previous messages:", error);
      });
  }

  showMessageToAdmin(message: string, username: string): void {
    const chatElement = document.getElementById('liveChatMessages');
    if (chatElement && this.isAdmin) { 
      this.showUserImmage(chatElement,message,username)
    }
  }

  showAdminMessageToUser(message: string): void {
    const chatElement = document.getElementById('liveChatMessages');
    if (chatElement) {
      this.showAdminImage(message,chatElement)
    }
  }

  showUserImmage(chatElement: any , message:string,username:any){
    const chatMessageElement = document.createElement('div');
    chatMessageElement.classList.add('chat-message', 'p-3');
    chatMessageElement.innerHTML = `
      <img src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-7.png" width="30" height="30"> <h5>${username}</h5>
      <div class="bg-white mr-2 p-3" style="border: 1px solid #cf82c5;
      font-size: 15px;
      font-family: 'Roboto', sans-serif;
      border-radius: 20px;">${message}</div>`;
    chatElement.appendChild(chatMessageElement);
     // Otomatik olarak en aşağıya kaydır
     chatElement.scrollTop = chatElement.scrollHeight;
  }

  showAdminImage(message:string,chatElement:any){
    const chatMessageElement = document.createElement('div');
    chatMessageElement.classList.add('chat-message', 'p-3');
    chatMessageElement.innerHTML = `
      <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width="30" height="30"> <h5>Yönetici</h5>
      <div class="chat ml-2 p-3" style="border: 1px solid #fd0000;
      font-size: 15px;
      font-family: 'Roboto', sans-serif;
      border-radius: 20px;">${message}</div>`;
    chatElement.appendChild(chatMessageElement);
     chatElement.scrollTop = chatElement.scrollHeight;
  }
  
  decodeToken(token: string): void {
    try {
      this.decodedToken = jwtDecode(token);
      this.username = this.decodedToken.username;
      this.role = this.decodedToken.roles;
      this.router.navigate(['/book']);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.router.navigate(['/login']);
    }
    
  }

  logout(): void {
    this.alertService.acceptOrDecline('Çıkış Yap', 'Çıkış yapmak istediğinizden emin misiniz?', 'warning')
      .then((result: boolean) => { // result parametresinin türü belirtiliyor
        if (result) {
          // Kullanıcı onayladıysa çıkış işlemini gerçekleştir
          this.authService.logout();
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });
        }
      });
  }

  closeUserList(){
    this.showUserList = false;
  }

  listUsersToChatScreen(event: Event): void {
    event.stopPropagation();
    this.showUserList = true;

    // Mevcut chat ekranını temizle

    const chatElement = document.getElementById('liveChatMessages');
    if (!chatElement) {
      console.error('liveChatMessages elementi bulunamadı.');
      return;
    }
  
    chatElement.innerHTML = '';
  
    this.dataService.getAllUser().subscribe(
      (data: any) => {
        if (data && data.data && Array.isArray(data.data)) {
          this.users = data.data; // Kullanıcıları diziye at
          console.log(this.users); // Kullanıcıları konsola yazdır
    
          // Her bir kullanıcı için döngü
      /*    this.users.forEach(user => {
            const chatMessageElement = document.createElement('div');
            chatMessageElement.classList.add('chat-message', 'p-3');
            chatMessageElement.innerHTML = `
              <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width="30" height="30"> 
              <div class="chat ml-2 p-3" style="border: 1px solid #fd0000;
              font-size: 10px;
              font-family: 'Roboto', sans-serif;
              border-radius: 0px;" onclick="getPreviousMessagesBySelectedUsername('${user.username}')"> Kullanıcı : ${user.username}</div>`;
            chatElement.appendChild(chatMessageElement);
          });*/
        }
      },
      error => {
        console.error('Kullanıcı bilgilerini alma hatası:', error);
      }
    );
  }

  selectedUser(selectedUser:string){
    this.adminSentToHim =  selectedUser
  }

 
}
