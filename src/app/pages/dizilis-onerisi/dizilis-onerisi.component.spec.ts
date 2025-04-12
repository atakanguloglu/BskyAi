import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DizilisOnerisiComponent } from './dizilis-onerisi.component';

describe('DizilisOnerisiComponent', () => {
  let component: DizilisOnerisiComponent;
  let fixture: ComponentFixture<DizilisOnerisiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DizilisOnerisiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DizilisOnerisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
