import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from '../../Screens/books/books.component';
import { AuthorComponent } from '../../Screens/author/author.component';
import { CategoryComponent } from '../../Screens/category/category.component';
import { LoginComponent } from '../../Screens/Auth/login/login.component';
import { RegisterComponent } from '../../Screens/Auth/register/register.component';
import { AddAuthorComponent } from '../../Screens/admin/add-author/add-author.component';
import { AddBookComponent } from '../../Screens/admin/add-book/add-book.component';
import { AddCategoryComponent } from '../../Screens/admin/add-category/add-category.component';
import { UpdateAuthorComponent } from '../../Screens/admin/update-author/update-author.component';
import { UpdateCategoryComponent } from '../../Screens/admin/update-category/update-category.component';
import { UpdateBookComponent } from '../../Screens/admin/update-book/update-book.component';
import { RequestBooksComponent} from '../../Screens/request-books/request-books.component';
import { AuthGuard } from '../../Screens/Auth/AuthGuard';
import { ChatUsersComponent } from '../../Screens/chat-users/chat-users.component';

const routes: Routes = [
 
  { path: 'book', component: BooksComponent },
  { path: 'author', component: AuthorComponent,canActivate: [AuthGuard] },
  { path: 'category', component: CategoryComponent ,canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'add-category', component: AddCategoryComponent ,canActivate: [AuthGuard]},
  { path: 'add-book', component: AddBookComponent ,canActivate: [AuthGuard]},
  { path: 'add-author', component: AddAuthorComponent ,canActivate: [AuthGuard]},
  { path: 'update-author/:id', component: UpdateAuthorComponent ,canActivate: [AuthGuard]},
  { path: 'update-category/:id', component: UpdateCategoryComponent ,canActivate: [AuthGuard]},
  { path: 'update-book/:id', component: UpdateBookComponent ,canActivate: [AuthGuard]},
  { path: 'book-requests', component: RequestBooksComponent},
  { path: 'chat-users', component: ChatUsersComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
