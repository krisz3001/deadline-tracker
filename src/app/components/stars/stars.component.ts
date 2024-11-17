import { Component, HostBinding, Input, OnChanges, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './stars.component.html',
  styleUrl: './stars.component.css',
})
export class StarsComponent implements OnChanges {
  @Input({ required: true }) count!: number;

  @Input() size: 'big' | 'small' = 'big';
  @HostBinding('class.big') get isBig() {
    return this.size === 'big';
  }

  stars: number[] = [];

  ngOnChanges(): void {
    this.stars = [...Array(this.count).keys()];
  }
}
