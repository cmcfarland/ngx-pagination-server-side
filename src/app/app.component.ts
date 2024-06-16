import { ChangeDetectionStrategy, Input, Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

interface IServerResponse {
  items: string[];
  total: number;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  name = 'Angular';
  @Input('data') meals: string[] = Array(150).fill(0).map((x, i) => i);
  asyncMeals: Observable<string[]>;
  p: number = 1;
  total: number;
  loading: boolean;

  ngOnInit() {
    this.getPage(1);
  }

  getPage(page: number) {
    console.log(page);
    this.loading = true;
    this.asyncMeals = serverCall(this.meals, page).pipe(
      tap((res) => {
        this.total = res.total;
        this.p = page;
        this.loading = false;
      }),
      map((res) => res.items)
    );
  }
}

function serverCall(
  meals: string[],
  pages: number
): Observable<IServerResponse> {
  const perPage = 20;
  const start = (pages - 1) * perPage;
  const end = start + perPage;

  return of({
    items: meals.slice(start, end),
    total: meals.length,
  }).pipe(delay(500));
}
