import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FireDemo';
  items$: Observable<any[]>;
  private _displayIsSelected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  displayIsSelected$ = this._displayIsSelected$.asObservable();

  constructor(
    private _fireStore: AngularFirestore
  ) {
    this.items$ = this.displayIsSelected$.pipe(
      switchMap(displayIsSelected => {
        return this._fireStore.collection<any[]>(
          'productsList',
          ref => {
            return ref.where('isSelected', '==', displayIsSelected)
          }
        ).valueChanges();
      })
    );
    // this.items$ = this._fireStore.collection<any>(
    //   'productsList', // nomdelacollection
    //   ref => ref.where('isSelected', '==', this.displayIsSelected) // systeme de query
    // )
    // .valueChanges({idField: 'key'}) // récupération 
    // .pipe(
    //   tap(data => console.log(data))
    // );
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
      quantity: +quantityElement.value,
      isSelected: false
    });
    inputElement.value = '';
    quantityElement.value = '';
    console.log('data save inside firebase');
  }

  async selectItem(item) {
    this._fireStore.collection('productsList').doc(item.key).update({
      isSelected: true
    });
  }

  toggleDisplayIsSelected() {
    this._displayIsSelected$.next(!this._displayIsSelected$.value);
    console.log(this._displayIsSelected$.value);
  }
}
