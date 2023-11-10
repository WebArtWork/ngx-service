import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import { ServiceService, Service } from 'src/app/modules/service/services/service.service';
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';
import { AlertService, CoreService, HttpService } from 'wacom';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { TagService } from 'src/app/modules/tag/services/tag.service';
import { ServicesTemplateComponent } from './services/services-template/services-template.component';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/modules/modal/modal.service';

@Component({
	templateUrl: './services.component.html',
	styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
	columns = ['name', 'short'];

	form: FormInterface = this._form.getForm('service', {
		formId: 'service',
		title: 'Service',
		components: [
			{
				name: 'Text',
				key: 'name',
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill service title'
					},
					{
						name: 'Label',
						value: 'Title'
					}
				]
			},
			{
				name: 'Photo',
				key: 'thumb',
				fields: [
					{
						name: 'Label',
						value: 'Header picture'
					}
				]
			},
			{
				name: 'Photos',
				key: 'thumbs',
				fields: [
					{
						name: 'Label',
						value: 'Detailed pictures'
					}
				]
			},
			{
				name: 'Text',
				key: 'short',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill service short description'
					},
					{
						name: 'Label',
						value: 'Short Description'
					}
				]
			},
			{
				name: 'Text',
				key: 'description',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill service description'
					},
					{
						name: 'Label',
						value: 'Description'
					}
				]
			},
			{
				name: 'Select',
				key: 'tag',
				fields: [
					{
						name: 'Placeholder',
						value: 'Select tag'
					},
					{
						name: 'Items',
						value: this._ts.group('service')
					}
				]
			}
		]
	});

	config = {
		create:
		this._router.url === '/admin/utilitylinks'
		? null
		: () => {
			this._form
				.modal<Service>(this.form, {
					label: 'Create',
					click: (created: unknown, close: () => void) => {
						(created as Service).isTemplate =
							this._router.url === '/admin/utilities'
								? true
								: false;
						this._ss.create(created as Service);
						close();
					}
				});
		},
		update:
		this._router.url === '/admin/utilitylinks'
		? null
		:  (doc: Service) => {
			this._form
				.modal<Service>(this.form, [], doc)
				.then((updated: Service) => {
					this._core.copy(updated, doc);
					this._ss.save(doc);
				});
		},
		delete:
		this._router.url === '/admin/utilitylinks'
		? null
		:  (doc: Service) => {
			this._alert.question({
				text: this._translate.translate(
					'Common.Are you sure you want to delete this service?'
				),
				buttons: [
					{
						text: this._translate.translate('Common.No')
					},
					{
						text: this._translate.translate('Common.Yes'),
						callback: () => {
							this._ss.delete(doc);
						}
					}
				]
			});
		},
		buttons:
		this._router.url === '/admin/utilitylinks'
		? null
		:  [
			{
				icon: 'cloud_download',
				click: (doc: Service) => {
					this._form
						.modalUnique<Service>(
							'service',
							'url',
							doc
						);
				}
			}
		],
		headerButtons: [
			{
				text: 'Add from crafts',
				click: () => {
					this._modal.show({
						component: ServicesTemplateComponent,
						class: 'forms_modal'
					});
				}
			}
		]
	};

	links: Service[] = [];

	get rows(): Service[] {
		return this._router.url === '/admin/utilities'
			? this._ss._services.isTemplate
			: this._router.url === '/admin/utilitylinks'
			? this.links
			: this._ss._services.isNotTemplate;
	}
	get title(): string {
		if (this._router.url === '/admin/utilities') {
			return 'Utilities'
		}

		if (this._router.url === '/admin/utilitylinks') {
			return 'Services Links'
		}

		return 'Services';
	}


	constructor(
		private _translate: TranslateService,
		private _alert: AlertService,
		private _ss: ServiceService,
		private _form: FormService,
		private _core: CoreService,
		private _ts: TagService,
		private _router: Router,
		private _http: HttpService,
		private _modal: ModalService
	)  {
		if (this._router.url === '/admin/utilitylinks') {
			this._http.get('/api/service/getlinks', (links: Service[]) => {
				links.forEach((service: Service)=>this.links.push(service));
			});
		} else if (this._router.url === '/admin/services') {
			this._http.get('/api/service/getadmin', (links: Service[]) => {
				links.forEach((service: Service)=>this.links.push(service));
			});
		}
	}
}
