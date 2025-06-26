/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Services */
import { LoansService } from '../loans.service';

/**
 * loan datatables resolver.
 */
@Injectable()
export class LoanDatatablesResolver implements Resolve<Object> {
  /**
   * @param {loansService} loansService loans service.
   */
  constructor(private loansService: LoansService) {}

  private convertSnakeToPascalCase(snakeCase: string): string {
    return snakeCase
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private transformDatatableLabel(datatable: any): string {
    const separator = '_';
    // format: dt_loan_data_table_name
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
   * Returns the loan datatables.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.loansService.getLoanDataTables().pipe(
      map((dataTables: any) => {
        return dataTables.map((datatable: any) => {
          return {
            ...datatable,
            label: this.transformDatatableLabel(datatable)
          };
        });
      })
    );
  }
}
