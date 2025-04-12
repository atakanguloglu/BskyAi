import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamChemistryComponent } from './team-chemistry.component';

describe('TeamChemistryComponent', () => {
  let component: TeamChemistryComponent;
  let fixture: ComponentFixture<TeamChemistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamChemistryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamChemistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
