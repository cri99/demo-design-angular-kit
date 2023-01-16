import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItValidators, SelectControlOption, UploadDragDropComponent, UploadFileListItem} from "design-angular-kit";
import {delay, finalize, forkJoin, iif, interval, map, of, take, tap} from "rxjs";


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

  uploadedFileList: Array<UploadFileListItem> = [];

  @ViewChild('uploadDragDropComponent') uploadDragDropComponent!: UploadDragDropComponent;

  constructor(private _formBuilder: FormBuilder) {
    this.reactiveFormGroup = this._formBuilder.group({
      name: [null, Validators.required],

      // The min/max validators can be omitted as they have been indicated on the html side,
      // so the it-input component (type=number) automatically adds these validators if not present
      age: [null, Validators.required],
      numericField: [null, [Validators.required, Validators.maxLength(5)]],

      // The email validator can be omitted,
      // the it-input component (type=email) automatically add this validator if not present
      email: [null, Validators.required],

      defaultSelect: [null, Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
      isolatedCheckbox: [null, Validators.required],
      isolatedToggle: [null, Validators.required],

      group2: [null, Validators.required],

      // Checkbox2 is required only if Checkbox1 has no value
      checkbox1: [null],
      checkbox2: [null, ItValidators.conditional(Validators.required, () => !this.reactiveFormGroup.get('checkbox1')?.value)],
    });

    // Checkbox2 is required only if Checkbox1 has no value
    this.reactiveFormGroup.get('checkbox1')?.valueChanges.subscribe(() => {
      this.reactiveFormGroup.get('checkbox2')?.updateValueAndValidity();
    });
  }

  onDragUploadStart(file: File): void {
    interval(50).pipe( // Simulate upload of single file
      take(100),
      map(x => x + 1) // Start from 1, end 100
    ).subscribe(progress => {
      this.uploadDragDropComponent.progress(progress);
    });
  }

  onUpdateFileList(files: FileList): void {
    const newFiles: Array<UploadFileListItem> = Array.from(files).map((file, index) => ({
      id: (index + this.uploadedFileList.length),
      file,
      removable: true
    }));

    this.uploadedFileList = [...this.uploadedFileList, ...newFiles];
  }

  onSubmit(): void {
    console.log('Form values: ', this.reactiveFormGroup.value);

    if (!this.reactiveFormGroup.valid) {
      this.reactiveFormGroup.markAllAsTouched(); // Show error on untouched fields
      return;
    }

    const uploadList$ = this.uploadedFileList.map(fileItem => {
      fileItem.removable = false;

      return interval(50).pipe( // Simulate upload of single file
        take(100),
        map(x => x + 1), // Start from 1, end 100
        tap(progress => {
          fileItem.progress = progress;
        })
      )
    });

    // Simulate send
    this.isLoadingSend = true;
    iif(() => !!uploadList$.length, forkJoin(uploadList$), of(void 0)).pipe(
      delay(2000),
      finalize(() => this.isLoadingSend = false)
    ).subscribe();
  }

}
