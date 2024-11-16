import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeadlineService } from '../../services/deadline.service';
import { Unsubscribe } from '@angular/fire/auth';
import { Deadline } from '../../interfaces/deadline.interface';
import { Timestamp } from '@angular/fire/firestore';
import { DeadlineSoonComponent } from '../deadline-soon/deadline-soon.component';
import { DeadlineLaterComponent } from '../deadline-later/deadline-later.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DeadlineSoonComponent, DeadlineLaterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private router: Router,
    private deadlineService: DeadlineService,
  ) {}

  deadlinesSoon: Deadline[] = [];
  deadlinesLater: Deadline[] = [];

  private sub = new Subscription();
  private unsubscribe: Unsubscribe = () => {};

  ngOnInit(): void {
    this.sub = this.authService.userData.subscribe((user) => {
      console.log(user);
    });

    this.unsubscribe = this.deadlineService.getDeadlinesRealtime((deadlines) => {
      this.deadlinesSoon = deadlines.sort((a, b) => a.date.toMillis() - b.date.toMillis()).slice(0, 3);
      this.deadlinesLater = deadlines.sort((a, b) => b.date.toMillis() - a.date.toMillis()).slice(3);
    });
  }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

  randomDeadline(): void {
    const deadline: Deadline = {
      title: 'Random deadline',
      date: Timestamp.now(),
      description: 'This is a random deadline',
      id: '',
      isCompleted: false,
      type: 'exam',
    };

    this.deadlineService.addDeadline(deadline).subscribe(() => {
      console.log('Deadline added');
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.unsubscribe();
  }
}
