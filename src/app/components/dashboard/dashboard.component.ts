import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { DeadlineService } from '../../services/deadline.service';
import { Unsubscribe } from '@angular/fire/auth';
import { Deadline } from '../../interfaces/deadline.interface';
import { DeadlineSoonComponent } from '../deadline-soon/deadline-soon.component';
import { DeadlineLaterComponent } from '../deadline-later/deadline-later.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { User } from '../../interfaces/user.interface';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DeadlineSoonComponent, DeadlineLaterComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private deadlineService: DeadlineService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
    this.iconRegistry.addSvgIcon('star', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/star.svg'));
  }

  commonDeadlines: Deadline[] = [];
  personalDeadlines: Deadline[] = [];

  deadlinesSoon: Deadline[] = [];
  deadlinesLater: Deadline[] = [];

  private user: User | null = null;
  private sub = new Subscription();
  private unsubs: { [key: string]: Unsubscribe } = {};

  ngOnInit(): void {
    this.sub = this.authService.userData.subscribe((user) => {
      this.user = user;
      this.getDeadlines();
    });
  }

  getDeadlines(): void {
    if (!this.user) return;
    this.unsubs['common'] = this.deadlineService.getCommonDeadlinesRealtime((deadlines) => {
      this.commonDeadlines = deadlines;
      this.sortDeadlines();
    });

    this.unsubs['personal'] = this.deadlineService.getPersonalDeadlinesRealtime(this.user, (deadlines) => {
      this.personalDeadlines = deadlines;
      this.sortDeadlines();
    });
  }

  sortDeadlines(): void {
    const deadlines = [...this.commonDeadlines, ...this.personalDeadlines];
    deadlines.sort((a, b) => b.severity - a.severity);
    this.deadlinesSoon = deadlines.sort((a, b) => a.date.toMillis() - b.date.toMillis()).slice(0, 3);
    this.deadlinesLater = deadlines.sort((a, b) => a.date.toMillis() - b.date.toMillis()).slice(3);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    Object.values(this.unsubs).forEach((unsub) => unsub());
  }
}
