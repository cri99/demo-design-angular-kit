import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  reactiveFormGroup!: FormGroup;
  constructor(private _formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.reactiveFormGroup = this._formBuilder.group({
      fullname: ['', Validators.required],
      email: ['test+123@test.it', [Validators.required, Validators.email]],
      age: [12, [Validators.min(10), Validators.max(100)]],
      sex: ['M', Validators.required],
      school: ['', Validators.required],
      acceptPrivacyPolicy: [false, Validators.requiredTrue],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    })
  }

  onSubmit() {
    console.log("Valore della form: ", this.reactiveFormGroup.value)
  }
}
