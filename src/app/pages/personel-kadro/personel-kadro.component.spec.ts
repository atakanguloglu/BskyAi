import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonelKadroComponent } from './personel-kadro.component';
import { FormsModule } from '@angular/forms'; // FormsModule importu

describe('PersonelKadroComponent', () => {
  let component: PersonelKadroComponent;
  let fixture: ComponentFixture<PersonelKadroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],  // FormsModule eklenmeli
      declarations: [PersonelKadroComponent], // Component buraya eklenmeli
    })
      .compileComponents();

    fixture = TestBed.createComponent(PersonelKadroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
