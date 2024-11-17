import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatTabsModule, LoginComponent, RegisterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit, OnDestroy {
  listener: any;
  enabled = false;

  @HostBinding('class.easter-egg') easterEgg = false;

  ngOnInit(): void {
    this.listener = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.getModifierState('Control')) {
        e.preventDefault();
        this.easterEgg = !this.easterEgg;
      }
    };
    window.addEventListener('keydown', this.listener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.listener);
  }
}
