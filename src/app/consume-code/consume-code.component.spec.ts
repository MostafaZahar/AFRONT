import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumeCodeComponent } from './consume-code.component';

describe('ConsumeCodeComponent', () => {
  let component: ConsumeCodeComponent;
  let fixture: ComponentFixture<ConsumeCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumeCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsumeCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
