import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core';
import { ServicesComponent } from './services.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
	path: '',
	component: ServicesComponent
}];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CoreModule
	],
	declarations: [
		ServicesComponent
	],
	providers: []

})

export class ServicesModule { }
