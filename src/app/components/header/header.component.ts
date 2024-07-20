import {Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";

import {interval} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

import {CurrencyModel} from "../../models/currency.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [
    NgIf
  ]
})
export class HeaderComponent implements OnInit {
  @Input() public currencies: CurrencyModel[];

  public currentData: CurrencyModel;

  private destroyRef = inject(DestroyRef);
  private currentDataIndex = 0;

  public ngOnInit(): void {
    this.startCurrenciesRotation();
  }

  private startCurrenciesRotation(): void {
    interval(3000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.currentDataIndex = (this.currentDataIndex + 1) % this.currencies.length;
      this.currentData = {
        CurrencyCodeL: this.currencies[this.currentDataIndex].CurrencyCodeL,
        Amount: this.currencies[this.currentDataIndex].Amount,
        Units: this.currencies[this.currentDataIndex].Units,
      };
    });
  }
}
