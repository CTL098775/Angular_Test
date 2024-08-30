import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitTestExampleRoutingModule } from './unit-test-example-routing.module';
import { UnitTestExampleComponent } from './pages/unit-test-example.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UnitTestExampleComponent],
  imports: [CommonModule, UnitTestExampleRoutingModule, ReactiveFormsModule],
})
export class UnitTestExampleModule {}
