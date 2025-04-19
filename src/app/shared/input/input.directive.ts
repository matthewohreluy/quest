import { Directive, ElementRef, Input, OnChanges, Renderer2, inject } from "@angular/core";

@Directive({
  selector: 'input[qInput]'
})
export class QInputDirective implements OnChanges{
  @Input() state: string = '';
  @Input() disabled: boolean = false;
  @Input() hasError: boolean = false;
  @Input() customClass: string = '';

  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);

  ngOnChanges(): void {
    const baseClass = 'p-3 border border-gray-300 rounded-md text-sm text-gray-600 placeholder:text-gray-500 placeholder:font-medium focus:border-gray-400 focus-visible:outline-none focus:placeholder:text-gray-600';
    const disabledClass = this.disabled ? this.getDisabledClass() : '';
    const errorClass = this.hasError ? this.getErrorClass() : '';

    const finalClass = [
      this.customClass,
      baseClass,
      disabledClass,
      errorClass
    ].join(' ');

    this.renderer.setAttribute(this.elementRef.nativeElement, 'class', finalClass);
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', this.disabled);
  }

  getErrorClass(){
    return 'border-red-500! placeholder:text-red-500!';
  }

  getDisabledClass(){
    return 'bg-gray-200 opacity-50';
  }
}
