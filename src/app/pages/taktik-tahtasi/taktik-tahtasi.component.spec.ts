import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaktikTahtasiComponent } from './taktik-tahtasi.component';

describe('TaktikTahtasiComponent', () => {
  let component: TaktikTahtasiComponent;
  let fixture: ComponentFixture<TaktikTahtasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaktikTahtasiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaktikTahtasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
