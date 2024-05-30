import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryModel } from '../Models/CategoryModel';
import { AuthorModel } from '../Models/AuthorModel';
import { BookModel } from '../Models/BookModel';
import { UserCreateModel } from '../Models/UserCreateModel';
import { ToastrService } from 'ngx-toastr';
import { UpdateCategoryModel } from '../Models/UpdateCategoryModel';
import { UpdateAuthorModel } from '../Models/UpdateAuthorModel';
import { UpdateBookModel } from '../Models/UpdateBookModel';
import { RequestBookModel } from '../Models/RequestBookModel';
import  {BookContentModel } from '../Models/BookContentModel';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseApi = "http://localhost:5062/";

  constructor(private http: HttpClient,private toastr: ToastrService) { }

  showSuccessMessage(response : any){
    this.toastr.success(response.message, 'Başarılı', {
      positionClass: 'toast-top-right' 
    });
  }

  showFailMessage(response : any){
    this.toastr.error(response.message, 'Başarısız', {
      positionClass: 'toast-top-right' 
    });
  }

  login(username: string, password: string): Observable<any> {
    const url = `${this.baseApi}api/User/Login`;
    return this.http.post<any>(url, { username, password });
  }
  
    // fetch requestlerim
  fetchData(): Observable<any[]> {
    const apiUrl = this.baseApi + 'api/Book/ListAll';
    return this.http.get<any[]>(apiUrl);
  }

  fetchImages(filekey: string): Observable<Blob> {
    const imageUrl = `${this.baseApi}file/GetImageByFotokey?filekey=${filekey}`;
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  fetchImagesFromRedis(filekey: string): Observable<Blob> {
    const imageUrl = `${this.baseApi}file/GetImageByFotokeyFromRedis?filekey=${filekey}`;
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  fetchAuthors(): Observable<any[]> {
    const url = `${this.baseApi}api/Author/ListAll`;
    return this.http.get<any[]>(url);
  }

  fetchCategories(): Observable<any[]> {
    const url = `${this.baseApi}api/Category/ListAll`;
    return this.http.get<any[]>(url);
  }

  // Delete Requestlerim
  deleteCategory(categoryId: number): Observable<any> {
    const url = `${this.baseApi}api/Category/Delete?id=${categoryId}`;
    return this.http.delete(url);
  }

  deleteAuthor(authorId: number): Observable<any> {
    const url = `${this.baseApi}api/Author/Delete?id=${authorId}`;
    return this.http.delete(url);
  }

  deleteBook(bookId: number): Observable<any> {
   const url = `${this.baseApi}api/Book/Delete?id=${bookId}`;
    return this.http.delete(url);
  } 

  deleteRequest(requestId: number): Observable<any> {
    const url = `${this.baseApi}api/User/DeleteBookRequest?id=${requestId}`;
     return this.http.delete(url);
   } 
    // add requestler
    createCategory(category: CategoryModel): Observable<any> {
      const url = `${this.baseApi}api/Category/Create`;
      return this.http.post(url, category);
    }

    createAuthor(author: AuthorModel): Observable<any> {
      const url = `${this.baseApi}api/Author/Create`;
      return this.http.post(url, author);
    }

    createUser(user: UserCreateModel): Observable<any> {
      const url = `${this.baseApi}api/User/Create`;
      return this.http.post(url, user);
    }

    createBook(book: BookModel): Observable<any> {
      const url = `${this.baseApi}api/Book/Create`;
      return this.http.post(url, book);
    }

    createBookRequest(bookrequest: RequestBookModel): Observable<any> {
      const url = `${this.baseApi}api/User/CreateBookRequest`;
      return this.http.post(url, bookrequest);
    }

    fetchBooksByCategoryId(categoryId: number): Observable<any[]> {
      const apiUrl = `${this.baseApi}api/Book/ListBooksByCategoryId?categoryId=${categoryId}`;
      return this.http.get<any[]>(apiUrl);
    }

    fetchBooksByAuthorId(authorId: number): Observable<any[]> {
      const apiUrl = `${this.baseApi}api/Book/ListBooksByAuthorId?authorId=${authorId}`;
      return this.http.get<any[]>(apiUrl);
    }

    uploadImage(file: File): Observable<any> {
      const url = `${this.baseApi}file/Upload`;
      const formData = new FormData();
      formData.append('imageFile', file);
  
      const options = {
        headers: new HttpHeaders({
          'Accept': 'application/json'
        })
      };
  
      return this.http.post(url, formData, options);
    }

    getCategoryById(categoryId: number): Observable<any[]> {
      const apiUrl = `${this.baseApi}api/Category/GetCategoryById?id=${categoryId}`;
      return this.http.get<any[]>(apiUrl);
    }

    updateCategory(category: UpdateCategoryModel): Observable<any> {
      const url = `${this.baseApi}api/Category/Update`;
      return this.http.put(url, category);
    }

    getBookById(bookId: number): Observable<any[]> {
      const apiUrl = `${this.baseApi}api/Book/GetBookById?id=${bookId}`;
      return this.http.get<any[]>(apiUrl);
    }

    updateBook(book: UpdateBookModel): Observable<any> {
      const url = `${this.baseApi}api/Book/Update`;
      return this.http.put(url, book);
    }

    updateBookIsAvailable(book: UpdateBookModel): Observable<any> {
      const url = `${this.baseApi}api/Book/UpdateBookIsAvailable`;
      return this.http.put(url, book);
    }

    getAuthorById(authorId: number): Observable<any[]> {
      const apiUrl = `${this.baseApi}api/Author/GetAuthorById?id=${authorId}`;
      return this.http.get<any[]>(apiUrl);
    }

    updateAuthor(author: UpdateAuthorModel): Observable<any> {
      const url = `${this.baseApi}api/Author/Update`;
      return this.http.put(url, author);
    }

    fetchBookRequests(): Observable<any[]> {
      const url = `${this.baseApi}api/User/GetAllRequests`;
      return this.http.get<any[]>(url);
    }

    getUserById(userId: number): Observable<any[]> {
      const apiUrl = `${this.baseApi}api/User/GetUserByUserId?id=${userId}`;
      return this.http.get<any[]>(apiUrl);
    }

    getAllUser(): Observable<any[]> {
      const apiUrl = `${this.baseApi}api/User/ListAll`;
      return this.http.get<any[]>(apiUrl);
    }

    resetPassword(username : string): Observable<any> {
      const url = `${this.baseApi}api/User/ForgetPassword?username=${username}`;
      return this.http.post(url,{ username });
    }

    deleteGroupRequest(groupId: number): Observable<any> {
      const url = `${this.baseApi}api/User/DeleteGroupById?groupId=${groupId}`;
       return this.http.delete(url);
     } 

     getAllGroups(): Observable<any[]> {
      const apiUrl = `${this.baseApi}api/User/GetAllGroups`;
      return this.http.get<any[]>(apiUrl);
    }

    createGroup(groupName : string ): Observable<any> {
      const url = `${this.baseApi}api/User/CreateUserGroup?groupName=${groupName}`;
      return this.http.post(url, groupName);
    }

    addUserToGroup(username: string, groupId: number): Observable<any> {
      const url = `${this.baseApi}api/User/AddUserToGroup?username=${username}&groupId=${groupId}`;
      return this.http.post(url, null);
    }

   /* getBooksByContent(bookContentQuery:string): Observable<any> {
      const url = `${this.baseApi}api/Book/BookQueryWithAIModel?bookQueryString=${bookContentQuery}`;
      const body = { bookQueryString: bookContentQuery };
      return this.http.post<any>(url,body);
    }*/

    getBooksByContent(bookcontent: BookContentModel): Observable<any> {
      const url = `${this.baseApi}api/Book/BookQueryWithAIModel`;
      return this.http.post<any>(url, bookcontent);
    }
    
  }