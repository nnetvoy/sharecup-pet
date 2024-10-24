import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCupsComponent } from './company-cups.component';

describe('CompanyCupsComponent', () => {
  let component: CompanyCupsComponent;
  let fixture: ComponentFixture<CompanyCupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCupsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyCupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
