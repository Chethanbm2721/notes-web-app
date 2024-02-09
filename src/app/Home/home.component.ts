import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotesService } from '../Services/notes.service';
import { IdGeneratorService } from '../Services/id-generator.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  id: number;
  isFavourite: boolean = false;
  noteColor: string;
  currentDate: Date;
  noteForm: FormGroup;
  openPopUp = false;
  notes: Notes[] = [];
  remove = true;
  imageUrl = '../../assets/icon-images/favourite-icon-before.png';

  addToFavourite(index: number) {
    this.notes[index].isFavourite = !this.notes[index].isFavourite;
    this.savetoLocalStorage();
  }
  savetoLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  isShowColorList: boolean = false;
  showColorList() {
    if (this.isShowColorList) this.isShowColorList = false;
    else this.isShowColorList = true;
  }

  constructor(
    private notesService: NotesService,
    private formBuilder: FormBuilder,
    private idGeneratorService: IdGeneratorService
  ) {
    if (localStorage.getItem('notes')) {
      console.log('constructor');
      this.notes = JSON.parse(localStorage.getItem('notes'));
      console.log('parsed', this.notes);
    }

    this.currentDate = new Date();

    this.noteForm = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      isFavourite: [this.isFavourite],
      color: ['#FFFFFF'],
      date: [""],
    });

    notesService.openPopup.subscribe((isOpenPopup) => {
      this.openPopUp = isOpenPopup;
    });
  }

  ngOnInit() {}
  updateNote() {
    if (this.id != null) {
      this.editNote();
    } else {
      this.addNote();
    }
  }
  editNote() {
    console.log(this.notes);
    const index = this.notes.findIndex((obj) => obj.id === this.id);
    console.log(index);
    this.notes[index] = {
      id: this.id,
      title: this.noteForm.get('title').value,
      description: this.noteForm.get('description').value,
      isFavourite: this.notes[index].isFavourite,
      date: this.currentDate,
      color: this.notes[index].color,
    };
    this.savetoLocalStorage();
    this.notesService.closePopupBox();
    this.id = null;
  }

  openPopupBox(color: string, id?: number | null) {
    this.noteForm.reset();
    console.log('open', id);
    if (id != null) {
      this.noteColor = color;
      let i = this.notes.findIndex((obj) => obj.id === id);
      this.noteForm.get('title').setValue(this.notes[i].title);
      this.noteForm.get('description').setValue(this.notes[i].description);
      this.id = id;
      console.log('id setted');
    } else {
      this.noteColor = color;
      console.log('color setted');
    }
    this.notesService.openPopupBox();
  }
  closePopupBox() {
    this.noteForm.reset();
    this.notesService.closePopupBox();
  }



deleteNote(id:number){
  let i = this.notes.findIndex((obj) => obj.id === id);
  console.log("delete",i);
  this.notes.splice(i,1);
  this.savetoLocalStorage();
}

  addNote() {
    this.noteForm.get("date").setValue(this.currentDate);
    this.noteForm.get('id').setValue(this.idGeneratorService.getId());
    this.noteForm.get('color').setValue(this.noteColor);

    const newNote = this.notesService.addNote(this.noteForm);
    this.notes.push(newNote);

    this.savetoLocalStorage();
    this.notesService.closePopupBox();
  }
}

export class Notes {
  id: number;
  title: string;
  description: string;
  isFavourite: boolean;
  color: string;
  date: Date;
}
