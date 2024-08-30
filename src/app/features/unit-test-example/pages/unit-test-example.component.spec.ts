import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTestExampleComponent } from './unit-test-example.component';

describe('UnitTestExampleComponent', () => {
  let component: UnitTestExampleComponent;
  let fixture: ComponentFixture<UnitTestExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnitTestExampleComponent],
    });
    fixture = TestBed.createComponent(UnitTestExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
