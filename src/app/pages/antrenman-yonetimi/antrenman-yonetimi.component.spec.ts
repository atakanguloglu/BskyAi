import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntrenmanYonetimiComponent } from './antrenman-yonetimi.component';

describe('AntrenmanYonetimiComponent', () => {
  let component: AntrenmanYonetimiComponent;
  let fixture: ComponentFixture<AntrenmanYonetimiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntrenmanYonetimiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AntrenmanYonetimiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
