import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectStorePage } from './select-store.page';

describe('SelectStorePage', () => {
  let component: SelectStorePage;
  let fixture: ComponentFixture<SelectStorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectStorePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectStorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
