import {Component, OnDestroy, OnInit} from '@angular/core';
import {firstValueFrom, map, Observable, Subscription, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AsyncPipe, CommonModule} from '@angular/common';
import {environment} from '../../environments/environment';

interface DeadlineResponse {
  secondsLeft: number
}

@Component({
  selector: 'app-deadline-counter',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './deadline-counter.component.html',
  styleUrl: './deadline-counter.component.css'
})
export class DeadlineCounterComponent implements OnInit, OnDestroy {
  private initialSecondsSubscription: Subscription | null = null;
  private countdownSubscription: Subscription | null = null;
  secondsLeft$: Observable<number> | null = null;
  error: boolean = false;
  loading: boolean = false;

  constructor(private http: HttpClient) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      const initialSeconds = await this.fetchInitialSeconds();
      this.loading = false;
      this.setupCountdown(initialSeconds);
    } catch (err) {
      this.error = true;
      console.error('Failed to fetch deadline:', err);
    }
  }

  ngOnDestroy(): void {
    this.initialSecondsSubscription?.unsubscribe();
    this.countdownSubscription?.unsubscribe();
  }

  private async fetchInitialSeconds(): Promise<number> {
    const apiUrl = `${environment.apiUrl}/company/deadline`;
    const response: DeadlineResponse = await firstValueFrom(this.http.get<DeadlineResponse>(apiUrl));
    return response.secondsLeft;
  }

  private setupCountdown(initialSeconds: number): void {
    // Create an observable that emits every second and decrements the count
    this.secondsLeft$ = timer(0, 1000).pipe(
      map(tick => {
        return Math.max(0, initialSeconds - tick);
      })
    );
  }
}
