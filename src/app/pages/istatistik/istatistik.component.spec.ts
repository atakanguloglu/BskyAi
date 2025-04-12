import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IstatistikComponent } from './istatistik.component';
import { before, describe, it } from 'node:test';

describe('IstatistikComponent', () => {
  let component: IstatistikComponent;
  let fixture: ComponentFixture<IstatistikComponent>;

  before(async () => {
    await TestBed.configureTestingModule({
      imports: [IstatistikComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IstatistikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {

  });
});
