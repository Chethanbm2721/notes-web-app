import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private popup = new BehaviorSubject<boolean>(false);
  openPopup = this.popup.asObservable();
  notesForm: any;

  constructor(private formBuilder: FormBuilder) {
    this.notesForm = formBuilder.group({
      notes: formBuilder.array([]),
    });
  }

  get notesFormArray(): FormArray {
    return this.notesForm.get('notes') as FormArray;
  }

 addNote(noteForm: any) {
//     console.log('Input', noteForm);
// const newNote=noteForm;
//     this.notesFormArray.push(newNote);

//     // console.log(this.notesForm);
//     console.log('call');
//     console.log(this.notesFormArray);

   
    const newNote = noteForm.value;
console.log('newnote',newNote)
         // this.notesFormArray.push(this.formBuilder.control(newNote));

       
       
          return newNote;
  }

  openPopupBox() {
    this.popup.next(true);
  }
  closePopupBox() {
    this.popup.next(false);
  }
}
