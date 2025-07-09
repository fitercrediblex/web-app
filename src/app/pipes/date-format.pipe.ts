import { Pipe, PipeTransform } from '@angular/core';
import { SettingsService } from 'app/settings/settings.service';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  constructor(private settingsService: SettingsService) {}

  transform(value: any, dateFormat?: string): any {
    const defaultDateFormat = this.settingsService.dateFormat.replace('dd', 'DD').replace('yyyy', 'YYYY');

    if (typeof value === 'undefined' || value === null) {
      return '';
    }

    moment.locale(this.settingsService.language.code);

    let dateVal;
    if (Array.isArray(value)) {
      dateVal = moment(value.join('-'), 'YYYY-MM-DD');
    } else if (typeof value === 'number') {
      dateVal = moment(value * 1000);
    } else {
      dateVal = moment(value);
    }

    if (!dateVal.isValid()) {
      return '';
    }

    return dateVal.format(dateFormat || defaultDateFormat);
  }
}
