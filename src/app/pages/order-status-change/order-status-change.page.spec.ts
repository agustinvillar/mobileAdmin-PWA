import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderStatusChangePage } from './order-status-change.page';

describe('OrderStatusChangePage', () => {
  let component: OrderStatusChangePage;
  let fixture: ComponentFixture<OrderStatusChangePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderStatusChangePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStatusChangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
