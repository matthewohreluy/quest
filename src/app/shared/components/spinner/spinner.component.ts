import { Component, Input } from '@angular/core';
import { SpinnerColor, SpinnerSize } from './spinner.model';

@Component({
  selector: 'quest-spinner',
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  @Input() color: SpinnerColor = 'text-white';
  @Input() size: SpinnerSize = 'size-5';
}
