import { Injectable } from '@angular/core';
import { MongoService, AlertService } from 'wacom';

export interface Service {
	_id?: string;
	name: string;
	description: string;
	isTemplate: boolean;
	template: string;
}

@Injectable({
	providedIn: 'root'
})
export class ServiceService {
	services: Service[] = [];

	_services: any = {};

	new(): Service {
		return {} as Service;
	}

	constructor(
		private mongo: MongoService,
		private alert: AlertService
	) {
		this.services = mongo.get('service', {
			query: {
				isTemplate: (doc: Service) => doc.isTemplate,
				isNotTemplate: (doc: Service) => !doc.isTemplate
			}
		}, (arr: any, obj: any) => {
			this._services = obj;
		});
	}

	create(
		service: Service = this.new(),
		callback = (created: Service) => {},
		text = 'service has been created.'
	) {
		if (service._id) {
			this.save(service);
		} else {
			this.mongo.create('service', service, (created: Service) => {
				callback(created);
				this.alert.show({ text });
			});
		}
	}

	doc(serviceId: string): Service {
		if(!this._services[serviceId]){
			this._services[serviceId] = this.mongo.fetch('service', {
				query: {
					_id: serviceId
				}
			});
		}
		return this._services[serviceId];
	}

	update(
		service: Service,
		callback = (created: Service) => {},
		text = 'service has been updated.'
	): void {
		this.mongo.afterWhile(service, ()=> {
			this.save(service, callback, text);
		});
	}

	save(
		service: Service,
		callback = (created: Service) => {},
		text = 'service has been updated.'
	): void {
		this.mongo.update('service', service, () => {
			if(text) this.alert.show({ text, unique: service });
		});
	}

	delete(
		service: Service,
		callback = (created: Service) => {},
		text = 'service has been deleted.'
	): void {
		this.mongo.delete('service', service, () => {
			if(text) this.alert.show({ text });
		});
	}
}
