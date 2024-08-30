import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitTestExampleComponent } from './pages/unit-test-example.component';

const routes: Routes = [
  {
    path: '',
    component: UnitTestExampleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnitTestExampleRoutingModule {}
