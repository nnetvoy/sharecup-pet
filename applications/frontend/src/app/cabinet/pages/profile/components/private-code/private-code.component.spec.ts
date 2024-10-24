import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateCodeComponent } from './private-code.component';

describe('PrivateCodeComponent', () => {
  let component: PrivateCodeComponent;
  let fixture: ComponentFixture<PrivateCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrivateCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
