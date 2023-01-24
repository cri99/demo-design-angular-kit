import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  AutoCompleteItem,
  ItValidators,
  SelectControlOption,
  UploadDragDropComponent,
  UploadFileListItem
} from "design-angular-kit";
import {delay, forkJoin, interval, map, take, tap} from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isLoadingSend: boolean = false;

  reactiveFormGroup: FormGroup;

  defaultSelectOptions: Array<SelectControlOption> = [
    {value: null, text: 'Scegli una opzione', selected: true, disabled: true},
    {value: 'Valore 1', text: 'Opzione 1'},
    {value: 'Valore 2', text: 'Opzione 2'},
    {value: 'Valore 3', text: 'Opzione 3'},
    {value: 'Valore 4', text: 'Opzione 4'},
    {value: 'Valore 5', text: 'Opzione 5'}
  ]

  autoCompleteSchoolsData: Array<AutoCompleteItem> = [
    {
      value: 'Leonardo Da Vinci',
      icon: 'pa',
      label: 'Istituto Tenico'
    },
    {
      value: 'Galileo Galilei',
      icon: 'pa',
      label: 'Liceo Scientifico'
    },
    {
      value: 'Alessandro Manzoni',
      icon: 'pa',
      label: 'Scuola Media'
    },
    {
      value: 'Antonio Meucci',
      icon: 'pa',
      label: 'Istituto Tecnico'
    }
  ];


  uploadedFileList: Array<UploadFileListItem> = [];

  @ViewChild('uploadDragDropComponent') uploadDragDropComponent!: UploadDragDropComponent;

  constructor(private _formBuilder: FormBuilder) {
    this.reactiveFormGroup = this._formBuilder.group({
      name: [null, Validators.required],

      // The min/max validators can be omitted as they have been indicated on the html side,
      // so the it-input component (type=number) automatically adds these validators if not present
      age: [null, Validators.required],

      // Validate the numeric field with regex, show 'maxlength' error message (Show `invalidMessage` method inside `InputComponent`)
      // Other example: ItValidators.customPattern(/^\s*-?[0-9]{1,5}\s*$/, {invalidRegex: true})
      // Other example: Validators.pattern(/^\s*-?[0-9]{1,5}\s*$/)
      numericField: [null, [Validators.required, ItValidators.customPattern(/^\s*-?[0-9]{1,5}\s*$/, {maxlength: {requiredLength: 5}})]],

      // The email validator can be omitted,
      // the it-input component (type=email) automatically add this validator if not present
      email: [null, Validators.required],

      defaultSelect: [null, Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
      school: [null],
      isolatedCheckbox: [null, Validators.required],
      isolatedToggle: [null, Validators.required],

      group2: [null],

      // Checkbox2 is required only if Checkbox1 has no value
      checkbox1: [null],
      checkbox2: [null, ItValidators.conditional(Validators.required, () => !this.reactiveFormGroup.get('checkbox1')?.value)],
    });

    // Checkbox2 is required only if Checkbox1 has no value
    const checkbox2Form = this.reactiveFormGroup.get('checkbox2');
    this.reactiveFormGroup.get('checkbox1')?.valueChanges.subscribe(() => {
      checkbox2Form?.updateValueAndValidity(); // Update checkbox2 validity when the condition is changed
      checkbox2Form?.markAsTouched();
    });
  }

  onDragUploadStart(file: File): void {
    interval(1000).pipe( // Simulate upload of single file
      take(100),
      map(x => (x + 1) * 10) // Start from 1, end 100
    ).subscribe(progress => {
      this.uploadDragDropComponent.progress(progress);
      if (progress >= 100) {
        setTimeout(() => {
          this.uploadDragDropComponent.reset();
        }, 2000);
      }
    });
  }

  onUpdateFileList(files: FileList): void {
    const newFiles: Array<UploadFileListItem> = Array.from(files).map((file, index) => ({
      id: (index + this.uploadedFileList.length),
      file,
      removable: true
    }));

    this.uploadedFileList = [...this.uploadedFileList, ...newFiles];
    const uploadList$ = newFiles.map((fileItem, index) => {
      fileItem.removable = false;

      return interval(50).pipe( // Simulate upload of single file
        take(100),
        delay(index * 500),
        map(x => x + 1), // Start from 1, end 100
        tap(progress => {
          fileItem.progress = progress;
          if (progress >= 100 && newFiles.length > 1) { // Set error in second uploaded file
            const item = newFiles[1];
            item.progress = 0;
            item.error = true;
            item.removable = true;
          }
        })
      );
    });

    forkJoin(uploadList$).subscribe();
  }

  onDeleteFileList(item: UploadFileListItem): void {
    this.uploadedFileList = this.uploadedFileList.filter(i => i.id !== item.id);
  }

  onSubmit(): void {
    console.log('Form values: ', this.reactiveFormGroup.value);

    if (!this.reactiveFormGroup.valid) {
      this.reactiveFormGroup.markAllAsTouched(); // Show error on untouched fields
      return;
    }

    // Simulate send
    this.isLoadingSend = true;
    setTimeout(() => {
      this.isLoadingSend = false
    }, 5000);
  }

}
