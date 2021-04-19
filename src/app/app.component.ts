import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FireDemo';
  items$: Observable<any[]>;

  constructor(
    private _fireStore: AngularFirestore
  ) {
    this.items$ = this._fireStore.collection<any>(
      'productsList', // nomdelacollection
      // ref => ref.where('xxxx', '==', 'yyyyy') // systeme de query
    )
    .valueChanges({idField: 'key'}) // récupération 
    .pipe(
      tap(data => console.log(data))
    );
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
    await this._fireStore.collection<any>('productsList').add({
      name: inputElement?.value,
      quantity: +quantityElement.value
    });
    inputElement.value = '';
    quantityElement.value = '';
    console.log('data save inside firebase');
  }
}
