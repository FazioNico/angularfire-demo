import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, merge, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsListStateService {

  private _displayIsSelected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  displayIsSelected$ = this._displayIsSelected$.asObservable();

  private _productsList$ = new BehaviorSubject([]);
  public productsList$ = this._productsList$.asObservable();

  constructor(private _fireStore: AngularFirestore) {
    this._fireStore
      .collection<any[]>('productsList')
      .stateChanges(['added', 'modified'])
      .pipe(
        map(actions => actions.map(a => {
          const key = a.payload.doc.id;
          const data = a.payload.doc.data();
          return {key, ...data};
        }))
      )
      .subscribe(
        newData => {
          const currentState = this._productsList$.value.filter(
            product => !newData.find(newP => newP.key === product.key)
          );
          const newState = [
            ...currentState,
            ...newData
          ];
          this._productsList$.next(newState);
        }
      );
  }

  getItem$(): Observable<any[]> {
    return combineLatest([
      this.displayIsSelected$,
      this.productsList$
    ]).pipe(
      map(([displayIsSelected, productsList]) => {
        console.log('--->', displayIsSelected, productsList);
        return productsList.filter(
          product => product.isSelected === displayIsSelected
        );
      })
    );
  }

  async addItem(name: string, quantity: number): Promise<void> {
    await this._fireStore.collection<any>('productsList').add({
      name,
      quantity,
      isSelected: false
    });
  }

  async selectItem(item) {
    this._fireStore.collection('productsList').doc(item.key).update({
      isSelected: true
    });
  }

  toogleState(){
    this._displayIsSelected$.next(!this._displayIsSelected$.value);
  }
}
