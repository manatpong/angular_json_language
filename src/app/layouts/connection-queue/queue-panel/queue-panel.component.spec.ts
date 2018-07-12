import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuePanelComponent } from './queue-panel.component';

describe('QueuePanelComponent', () => {
  let component: QueuePanelComponent;
  let fixture: ComponentFixture<QueuePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueuePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueuePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
