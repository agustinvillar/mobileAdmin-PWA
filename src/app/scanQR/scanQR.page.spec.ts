import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScanQRPage } from './scanQR.page';

describe('ScanQRPage', () => {
  let component: ScanQRPage;
  let fixture: ComponentFixture<ScanQRPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScanQRPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanQRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
