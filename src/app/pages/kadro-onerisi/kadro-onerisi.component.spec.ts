import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KadroOnerisiComponent } from './kadro-onerisi.component';

describe('KadroOnerisiComponent', () => {
  let component: KadroOnerisiComponent;
  let fixture: ComponentFixture<KadroOnerisiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KadroOnerisiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KadroOnerisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
