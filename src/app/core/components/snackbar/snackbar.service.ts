import { Injectable, computed, inject } from "@angular/core";
import { SnackbarStore } from "./snackbar.store";
import { DurationType, Snackbar, SnackbarRequest } from "./snackbar.model";

@Injectable({
  providedIn: 'root'
})
export class SnackBarService{

  private store = inject(SnackbarStore);
  readonly snackBar = computed(() => this.store.snackBar());
  readonly hasLoaded = computed(()=> this.store.hasLoaded())
  private uniqueId = 0;

  show(data: SnackbarRequest){
    const id = ++this.uniqueId;
    const snackbarItem: Snackbar = {
      id: id,
      isClosed: false,
      iconType: data.iconType,
      headingText: data.headingText,
      messageText: data.messageText,
      isSliding: false,
      timer: setTimeout(()=>{
          this.close(id);
      },this.getSnackbarDuration(data.durationType))
    }
    this.store.addSnackbar(snackbarItem, this.uniqueId);
  }

  close(id: number){
    this.store.setIsClosedFalseSnackbar(id);
  }

  setHasLoaded(flag: boolean){
    this.store.setHasLoaded(flag);
  }

  private getSnackbarDuration(durationType: DurationType): number{
    switch(durationType){
      case 'long':
        return 15000;
      case 'medium':
        return 10000;
      case 'short':
        return 5000;
      default:
        return this.getSnackbarDuration('medium');
    }
  }
}
