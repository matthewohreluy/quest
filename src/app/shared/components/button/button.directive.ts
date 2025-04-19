import { Directive, ElementRef, Input, OnChanges, Renderer2, inject } from "@angular/core";
import { ButtonVariants } from "./button.model";

@Directive({
  selector: 'button[qBtn], a[qBtn]'
})
export class QBtnDirective implements OnChanges{
  @Input('qBtn') type: ButtonVariants= 'primary';
  @Input() customClass: string = ''
  @Input() disabled: boolean = false;

  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);

  ngOnChanges(): void {
      const baseClass = 'p-3 rounded-md text-sm font-semibold flex items-center justify-center gap-2';
      const typeClass = this.getTypeClass();
      const disabledClass = this.disabled ? this.getDisabledClass() : '';

      const finalClass = [
        this.customClass,
        baseClass,
        typeClass,
        disabledClass
      ].join(' ');

      this.renderer.setAttribute(this.elementRef.nativeElement, 'class', finalClass);
      this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', this.disabled);
  }

  getDisabledClass(){
    return 'bg-gray-300! opacity-50! text-gray-500! cursor-default! disabled:shadow'
  }

  getTypeClass(){
    switch(this.type){
      case 'primary':
        return 'bg-sky-600 text-sky-50 cursor-pointer hover:bg-sky-700 hover:text-sky-100 transition-colors duration-300 shadow';
      case 'secondary':
        return;
      case 'tertiary':
        return;
      case 'warn':
        return;
      case 'danger':
        return;
      case 'info':
        return;
      case 'transparent':
        return ' sm:w-50 font-medium flex text-sm text-gray-700  items-center justify-center gap-x-2 py-2 px-6 h-11  border border-gray-300 rounded-md bg-white hover:bg-gray-50 hover:text-sky-700 transition-colors duration-300';
    }
  }
}
