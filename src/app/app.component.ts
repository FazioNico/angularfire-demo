import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ProductsListStateService } from './products-list-state.service';
import { ProductsListService } from './products-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FireDemo';
  items$: Observable<any[]>;
  displayIsSelected$ = this._productsListStateService.displayIsSelected$;

  constructor(
    private _productsListStateService: ProductsListStateService
  ) {
    this.items$ = this._productsListStateService.getItem$();
  }
  
  async add(inputElement: HTMLInputElement, quantityElement: HTMLInputElement) {
    if (inputElement?.value?.length <= 0) {
      console.log('error: ', inputElement?.value);
      return;
    }
    if (+quantityElement?.value <= 0) {
      console.log('error: ', quantityElement?.value);
      return;
    }
    await this._productsListStateService.addItem(
      inputElement?.value,
      +quantityElement.value
    );
    inputElement.value = '';
    quantityElement.value = '';
    console.log('data save inside firebase');
  }

  async selectItem(item) {
    await this._productsListStateService.selectItem(item);
  }

  toggleDisplayIsSelected() {
    this._productsListStateService.toogleState();
  }
}
