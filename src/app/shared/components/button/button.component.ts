import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, input } from '@angular/core';
import { QBtnDirective } from './button.directive';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ButtonTypes, ButtonVariants } from './button.model';

@Component({
  selector: 'quest-button',
  imports: [QBtnDirective, SpinnerComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() isLoading: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() variant: ButtonVariants = 'primary'
  @Input() type: ButtonTypes = 'button'
  @Input() customClass: string = '';
  @Input() isLoadingMessage: string = ''
  @Output() buttonClick = new EventEmitter<MouseEvent>();


  handleClick(event: MouseEvent) {
    if (!this.isLoading && !this.isDisabled) {
      this.buttonClick.emit(event);
    }
  }
}
