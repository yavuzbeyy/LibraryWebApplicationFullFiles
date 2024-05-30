import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BooksComponent } from '../../Screens/books/books.component';
import { DataService } from '../services/DataService';
import { AuthorComponent } from '../../Screens/author/author.component';
import { CategoryComponent } from '../../Screens/category/category.component';
import { AddCategoryComponent } from '../../Screens/admin/add-category/add-category.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddAuthorComponent } from '../../Screens/admin/add-author/add-author.component';
import { AddBookComponent } from '../../Screens/admin/add-book/add-book.component';
import { BooksByCategoryIdComponent } from '../../Screens/books/books-by-category-id/books-by-category-id.component';
import { BooksByAuthorIdComponent } from '../../Screens/books/books-by-author-id/books-by-author-id.component';
import { LoginComponent } from '../../Screens/Auth/login/login.component';
import { RegisterComponent } from '../../Screens/Auth/register/register.component';
import { UpdateAuthorComponent } from '../../Screens/admin/update-author/update-author.component';
import { UpdateBookComponent } from '../../Screens/admin/update-book/update-book.component';
import { UpdateCategoryComponent } from '../../Screens/admin/update-category/update-category.component';
import { RequestBooksComponent } from '../../Screens/request-books/request-books.component';
import { BookDetailsModalComponent } from '../../Screens/books/book-details-modal/book-details-modal.component';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChatUsersComponent } from '../../Screens/chat-users/chat-users.component';
import { ApiAuthenticationService } from '../services/BackendAuthentication/api-authentication.service';


@NgModule({
  declarations: [
    AppComponent,
    BooksComponent,
    AuthorComponent,
    CategoryComponent,
    AddCategoryComponent,
    AddAuthorComponent,
    AddBookComponent,
    BooksByCategoryIdComponent,
    BooksByAuthorIdComponent,
    LoginComponent,
    RegisterComponent,
    UpdateAuthorComponent,
    UpdateBookComponent,
    UpdateCategoryComponent,
    RequestBooksComponent,
    BookDetailsModalComponent,
    ChatUsersComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right' 
    }),
    BrowserAnimationsModule,
    NgbModule,
    FontAwesomeModule,
    
  ],
  providers: [
    provideClientHydration(),
    DataService,
    {
      provide: HubConnection,
      useValue: new HubConnectionBuilder()
        .withUrl('https://localhost:5062/connectServerHub')
        .build()
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiAuthenticationService,
      multi: true
    }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
