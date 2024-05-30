import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksByAuthorIdComponent } from './books-by-author-id.component';

describe('BooksByAuthorIdComponent', () => {
  let component: BooksByAuthorIdComponent;
  let fixture: ComponentFixture<BooksByAuthorIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BooksByAuthorIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BooksByAuthorIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
