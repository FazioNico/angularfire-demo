import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsListService {

  private _displayIsSelected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  displayIsSelected$ = this._displayIsSelected$.asObservable();

  constructor(private _fireStore: AngularFirestore) {}

  getItem$(): Observable<any[]> {
    return this.displayIsSelected$.pipe(
      switchMap(displayIsSelected => {
        return this._fireStore.collection<any[]>(
          'productsList',
          ref => {
            return ref.where('isSelected', '==', displayIsSelected)
          }
        ).valueChanges({idField: 'key'});
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
