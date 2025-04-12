import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchPredictionComponent } from './match-prediction.component';

describe('MatchPredictionComponent', () => {
  let component: MatchPredictionComponent;
  let fixture: ComponentFixture<MatchPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchPredictionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
