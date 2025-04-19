import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Snackbar } from "./snackbar.model";

type SnackbarState = {
  snackBar: Snackbar[],
  hasLoaded: boolean;
};

const initialState: SnackbarState = {
  snackBar: [],
  hasLoaded: false
};

export const SnackbarStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store)=>({
    setHasLoaded(hasLoaded: boolean):void{
      patchState(store,{hasLoaded:hasLoaded})
    },
    addSnackbar(data:Snackbar,id: number):void{
      patchState(store, {
        snackBar: [...store.snackBar(),{...data,isSliding: true}]
        })
        setTimeout(()=>this.setIsSlidingFalseSnackbar(id), 1000)
      },
      setIsSlidingFalseSnackbar(id: number):void{
        const updatedSnackbar = store.snackBar().map((snackbar)=> snackbar.id === id ? {...snackbar, isSliding: false}: snackbar);
        patchState(store,{
          snackBar: updatedSnackbar
        })
      },
      setIsClosedFalseSnackbar(id: number):void{
        const updatedSnackbar = store.snackBar().map((snackbar)=> snackbar.id === id ? {...snackbar, isClosed: true}: snackbar);
        patchState(store,{
          snackBar: updatedSnackbar
        })
        setTimeout(()=>this.removeSnackbar(id),1000)
      },
      removeSnackbar(id:number):void{
         const snackbar  = store.snackBar().find(snackbar => snackbar.id === id);
         if(snackbar) clearTimeout(snackbar.timer as number);

        const updatedSnackbar = store.snackBar().filter((snackbar)=> snackbar.id !== id);
        patchState(store, {
          snackBar: updatedSnackbar
        })
      }
    }
  ))
);
