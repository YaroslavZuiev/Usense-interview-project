import {Component, inject, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";

import {catchError,map, throwError} from "rxjs";

import {HeaderComponent} from "../header/header.component";
import {ExchangeService} from "../../services/exchange.service";
import {CurrencyModel} from "../../models/currency.model";
import {currencies} from "../constants/currencies.const";
import {CurrenciesPipe} from "../../pipes/currencies.pipe";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    HeaderComponent,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    CurrenciesPipe
  ],
  standalone: true
})
export class DashboardComponent implements OnInit {
  public currencies: CurrencyModel[] = [];
  public currenciesForm: FormGroup;
  public selectCurrencies = currencies;

  private exchangeService = inject(ExchangeService);
  private fb = inject(FormBuilder);

  public get isCurrenciesFiltered(): boolean {
    return this.currenciesForm.get('toCurrency').value === 'UAH';
  }

  public ngOnInit(): void {
    this.initForm();
    this.getAllCurrencies();
  }

  public replaceCurrencies(): void {
    const { fromCurrency,fromTotal, toCurrency, toTotal } = this.currenciesForm.value;
    this.currenciesForm.patchValue({
      fromCurrency: toCurrency,
      fromTotal: Number(toTotal),
      toCurrency: fromCurrency,
      toTotal: Number(fromTotal)
    });
  }

  public calculateExchangeTotal(totalControlName?: string,controlToChange?: string): void {
    const fromCurrency = this.currenciesForm.get('fromCurrency').value;
    const toCurrency = this.currenciesForm.get('toCurrency').value;
    const total = this.currenciesForm.get(totalControlName).value;
    const selectedCurrency = this.currencies.find((item) => item.CurrencyCodeL === fromCurrency || item.CurrencyCodeL === toCurrency);
    let totalAfterExchange = 0
    if(totalControlName === 'fromTotal') {
      if(fromCurrency === 'UAH') {
        totalAfterExchange =  fromCurrency === 'UAH' ? total / selectedCurrency.Amount : total * selectedCurrency.Amount;
      }
    } else {
      if(toCurrency === 'UAH') {
        totalAfterExchange = toCurrency === 'UAH' ? total / selectedCurrency.Amount : total * selectedCurrency.Amount;
      }
    }
    this.currenciesForm.get(controlToChange).patchValue(totalAfterExchange.toFixed(2));
  }

  private getAllCurrencies(): void {
    const datePipe = new DatePipe('en-US');
    const currencies = ['USD', 'EUR']
    const currentDate = datePipe.transform(new Date(), 'dd.MM.yyyy');
    this.exchangeService.getAllCurrencies(currentDate).pipe(
      map((data) => data.filter((item) => currencies.includes(item.CurrencyCodeL))),
      catchError((err) => throwError(() => err))
    ).subscribe((data) => this.currencies = data);
  }

  private initForm(): void {
    this.currenciesForm = this.fb.group({
      fromCurrency: 'UAH',
      fromTotal: null,
      toCurrency: 'USD',
      toTotal: null,
    })
  }
}
