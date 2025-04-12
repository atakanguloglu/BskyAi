import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GozlemciRaporlariComponent } from './gozlemci-raporlari.component';

describe('GozlemciRaporlariComponent', () => {
  let component: GozlemciRaporlariComponent;
  let fixture: ComponentFixture<GozlemciRaporlariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GozlemciRaporlariComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GozlemciRaporlariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
