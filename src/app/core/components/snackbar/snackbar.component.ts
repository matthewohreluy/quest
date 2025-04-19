import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EnvironmentInjector, TemplateRef, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { SnackbarIconTypes } from './snackbar.model';
import { SnackBarService } from './snackbar.service';

@Component({
  selector: 'quest-snackbar',
  imports: [NgTemplateOutlet],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackbarComponent implements AfterViewInit{
  @ViewChild('successIcon') successIcon!: TemplateRef<any>;
  @ViewChild('infoIcon') infoIcon!: TemplateRef<any>;
  @ViewChild('warnIcon') warnIcon!: TemplateRef<any>;
  @ViewChild('dangerIcon') dangerIcon!: TemplateRef<any>;

  classes: any;
  readonly snackbarService = inject(SnackBarService);

  ngAfterViewInit(): void {
    this.classes = {
      success: {
        bg: 'bg-green-700 text-green-200',
        text: 'text-green-700',
        icon: this.successIcon
      },
      info: {
        bg: 'bg-blue-700 text-blue-200',
        text: 'text-blue-700',
        icon: this.infoIcon
      },
      warn: {
        bg: 'bg-yellow-700 text-yellow-200',
        text: 'text-yellow-700',
        icon: this.warnIcon
      },
      danger: {
        bg: 'bg-red-700 text-red-200',
        text: 'text-red-700',
        icon: this.dangerIcon
      }
    }
    this.snackbarService.setHasLoaded(true);
  }


  getIconTemplate(iconType: SnackbarIconTypes): TemplateRef<any> {
    return this.classes[iconType].icon as TemplateRef<any>;
  }

  getClass(type: 'bg' | 'text' | 'icon', iconType: SnackbarIconTypes){
    const classList = this.classes;
    return classList[iconType][type];
   }

  close(id: number){
    this.snackbarService.close(id);
  }
}


