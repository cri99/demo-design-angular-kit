import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AutoCompleteItem } from 'design-angular-kit';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private _formBuilder: FormBuilder) { }

  reactiveFormGroup!: FormGroup;

  
  get autoCompleteSchoolsData(): AutoCompleteItem[] {
    return this._autoCompleteSchoolsData;
  }
  set autoCompleteSchoolsData(value: AutoCompleteItem[]) {
    this._autoCompleteSchoolsData = value;
  }

  private _autoCompleteSchoolsData: AutoCompleteItem[] = [
    {
      value: 'Leonardo Da Vinci',
      icon: 'it-pa',
      label: 'Istituto Tenico'
    },
    {
      value: 'Galileo Galilei',
      icon: 'it-pa',
      label: 'Liceo Scientifico'
    },
    {
      value: 'Alessandro Manzoni',
      icon: 'it-pa',
      label: 'Scuola Media'
    },
    {
      value: 'Antonio Meucci',
      icon: 'it-pa',
      label: 'Istituto Tecnico'
    }
  ];

  ngOnInit(): void {
    this.reactiveFormGroup = this._formBuilder.group({
      fullname: ['', Validators.required],
      email: ['test+123@test.it', [Validators.required, Validators.email]],
      age: [12, [Validators.min(10), Validators.max(100)]],
      gender: ['M', Validators.required],
      school: ['', Validators.required],
      acceptPrivacyPolicy: [false, Validators.requiredTrue],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    console.log('Valore della form: ', this.reactiveFormGroup.value);
  }

}
