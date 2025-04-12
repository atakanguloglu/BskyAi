import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutbolcuOnerileriComponent } from './futbolcu-onerileri.component';

describe('FutbolcuOnerileriComponent', () => {
  let component: FutbolcuOnerileriComponent;
  let fixture: ComponentFixture<FutbolcuOnerileriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FutbolcuOnerileriComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FutbolcuOnerileriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
