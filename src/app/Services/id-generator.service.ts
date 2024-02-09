import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class IdGeneratorService {
    generatedId:number=0;
    constructor() { 
        this.generatedId=+localStorage.getItem("id");
    }
    getId(){
       this.generatedId++;
       this.setId(this.generatedId);
       return this.generatedId;
      
    }

    setId(id:number){
        localStorage.setItem("id",id.toString());
    }
}