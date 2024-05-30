export class BookUpdateModel {
    id: number = 0;
    title: string = '';
    description: string = '';
    publicationYear: number = 0;
    numberOfPages: number = 0;
    isAvailable: boolean = true;
    authorId: number = 0;
    categoryId: number = 0;
    fileKey : string ='';
    authorName: string = '';
    categoryName: string = '';
  }