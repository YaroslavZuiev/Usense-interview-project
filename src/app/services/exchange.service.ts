import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";

import {CurrencyModel} from "../models/currency.model";

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private url = `/exchange?json`
  private http = inject(HttpClient);

  public getAllCurrencies(data: string): Observable<CurrencyModel[]> {
    return this.http.get<CurrencyModel[]>(`${this.url}&date=${data}`);
  }
}
