import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RakipAnaliziComponent } from './rakip-analizi.component';

describe('RakipAnaliziComponent', () => {
  let component: RakipAnaliziComponent;
  let fixture: ComponentFixture<RakipAnaliziComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RakipAnaliziComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RakipAnaliziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
