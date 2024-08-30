import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitTestExampleRoutingModule } from './unit-test-example-routing.module';
import { UnitTestExampleComponent } from './pages/unit-test-example.component';

@NgModule({
  declarations: [UnitTestExampleComponent],
  imports: [CommonModule, UnitTestExampleRoutingModule],
})
export class UnitTestExampleModule {}
