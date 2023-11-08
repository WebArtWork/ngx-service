import { Component } from '@angular/core';
import { HttpService } from 'wacom';
import {
    ServiceService,
    Service
} from 'src/app/modules/service/services/service.service';

@Component({
    selector: 'app-services-template',
    templateUrl: './services-template.component.html',
    styleUrls: ['./services-template.component.scss']
})
export class ServicesTemplateComponent {

    utilities: any = [];

    constructor(private _http: HttpService, private _as: ServiceService) {
        _http.get('/api/service/getutilities', (resp) => {
			this.
			utilities = resp;
    });
}
create(utility: Service) {
    utility = JSON.parse(JSON.stringify(utility));
    utility.template = utility._id as string;
    delete utility._id;
    utility.isTemplate = false;
    this._as.create(utility);
}
}