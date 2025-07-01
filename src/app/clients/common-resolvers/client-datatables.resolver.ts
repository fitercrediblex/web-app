/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { ClientsService } from '../clients.service';
import { map } from 'rxjs/operators';

/**
 * Client datatables resolver.
 */
@Injectable()
export class ClientDatatablesResolver implements Resolve<Object> {
  /**
   * @param {ClientsService} ClientsService Clients service.
   */
  constructor(private clientsService: ClientsService) {}

  private convertSnakeToPascalCase(snakeCase: string): string {
    return snakeCase
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private transformDatatableLabel(datatable: any): string {
    const separator = '_';
    // format: dt_client_data_table_name
    const [
      dt,
      entityName,
      ...actualTableNameParts
    ] = datatable.registeredTableName.split(separator);

    // transform snake case "actualTableName" to pascal case
    const tableName = actualTableNameParts.join(separator);
    return this.convertSnakeToPascalCase(tableName);
  }

  /**
   * Returns the Client datatables.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.clientsService.getClientDatatables().pipe(
      map((data: any) => {
        return data.map((datatable: any) => {
          return {
            ...datatable,
            viewLabel: this.transformDatatableLabel(datatable)
          };
        });
      })
    );
  }
}
