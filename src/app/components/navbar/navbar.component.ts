import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { MatDialog } from '@angular/material/dialog';
import { DeadlineEditorComponent } from '../deadline-editor/deadline-editor.component';
import { DEADLINE_EDITOR_DIALOG_WIDTH } from '../../config';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
  ) {}

  private sub = new Subscription();
  user: User | null = null;

  ngOnInit(): void {
    this.sub = this.authService.userData.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout().subscribe();
  }

  addDeadline(): void {
    if (this.dialog.openDialogs.length > 0) return;

    this.dialog.open(DeadlineEditorComponent, {
      width: `${DEADLINE_EDITOR_DIALOG_WIDTH}px`,
      data: {
        user: this.user,
      },
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
