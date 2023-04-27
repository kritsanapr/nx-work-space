import { PipeTransform, Injectable } from '@nestjs/common';
@Injectable()
export class BudgetPipe implements PipeTransform {
  transform(value: any): any {
    const budget = Object.values(value.budgetMoney).map((item) => ({
      FiscalYear: Number(item['FiscalYear']),
      Budget: Number(item['Budget']),
    }));
    const project = { ...value };
    delete project.budgetMoney;
    return { budget, project };
  }
}
