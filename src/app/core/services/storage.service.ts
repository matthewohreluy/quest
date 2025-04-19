import { Injectable } from "@angular/core";

@Injectable({
  'providedIn': 'root'
})
export class StorageService{

  localStorageSet(name: string,object: any){
    const stringifyObject = JSON.stringify(object);
    localStorage.setItem(name, stringifyObject);
  }

  localStorageGet(name: string): any{
   const object = localStorage.getItem(name)
   if(!object) return '';
   return JSON.parse(object);
  }

  localStorageRemove(name: string){
    localStorage.removeItem(name);
  }
}
