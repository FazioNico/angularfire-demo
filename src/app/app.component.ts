import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ProductsListService } from './products-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FireDemo';
  items$: Observable<any[]>;
  displayIsSelected$ = this._productsListService.displayIsSelected$;

  constructor(
    private _productsListService: ProductsListService
  ) {
    this.items$ = this._productsListService.getItem$();
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
    await this._productsListService.addItem(
      inputElement?.value,
      +quantityElement.value
    );
    inputElement.value = '';
    quantityElement.value = '';
    console.log('data save inside firebase');
  }

  async selectItem(item) {
    await this._productsListService.selectItem(item);
  }

  toggleDisplayIsSelected() {
    this._productsListService.toogleState();
  }
}
