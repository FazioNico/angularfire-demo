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
      'pipo', // nomdelacollection
      // ref => ref.where('xxxx', '==', 'yyyyy') // systeme de query
    )
    .valueChanges({idField: 'key'}) // récupération 
    .pipe(
      tap(data => console.log(data))
    );
  }

  check(item) {
    console.log(item);
  }
  
  async add() {
    await this._fireStore.collection<any>('pipo').add({
      xxxx: 'hello'
    });
    console.log('data save inside firebase');
  }
}
