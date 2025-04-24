import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DeadlineCounterComponent} from './deadline-counter/deadline-counter.component';
import {Question2Component} from './question2/question2.component';

@Component({
  selector: 'app-root',
  imports: [DeadlineCounterComponent, Question2Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AngularDemo';
}
