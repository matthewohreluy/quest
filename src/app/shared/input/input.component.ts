import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, forwardRef, inject } from '@angular/core';
import { InputTypes } from './input.model';
import { QInputDirective } from './input.directive';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'quest-input',
  imports: [QInputDirective],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(()=> InputComponent),
    multi: true
  }]
})
export class InputComponent implements ControlValueAccessor {
  @Input() customClass: string = '';
  @Input() placeholder: string = '';
  @Input() type: InputTypes = 'text';
  @Input() hasError: boolean = false;
  @Input() disabled: boolean = false;

  cd = inject(ChangeDetectorRef);

  _value: string | number | null = null;
  onChanged: any = () => {};
  onTouched: any = () => {};

  onInputChange(evt: Event){
    const input = (evt.target as HTMLInputElement).value;
    this.onTouched();
    this.onChanged(input);
    this.cd.detectChanges()
  }

  // Required Methods
  writeValue(val: any): void {this._value = val;this.cd.markForCheck();}
  registerOnChange(fn: any): void {this.onChanged = fn;}
  registerOnTouched(fn: any): void {this.onTouched = fn;}
  setDisabledState?(isDisabled: boolean): void {this.disabled = isDisabled; this.cd.markForCheck();}

}
