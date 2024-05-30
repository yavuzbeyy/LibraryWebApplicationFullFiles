import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksByCategoryIdComponent } from './books-by-category-id.component';

describe('BooksByCategoryIdComponent', () => {
  let component: BooksByCategoryIdComponent;
  let fixture: ComponentFixture<BooksByCategoryIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BooksByCategoryIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BooksByCategoryIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
