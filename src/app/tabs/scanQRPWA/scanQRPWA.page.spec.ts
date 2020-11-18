import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScanQRPWAPage } from './scanQRPWA.page';

describe('ScanQRPWAPage', () => {
  let component: ScanQRPWAPage;
  let fixture: ComponentFixture<ScanQRPWAPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScanQRPWAPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanQRPWAPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
