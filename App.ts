import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-nested-form',
  templateUrl: './nested-form.component.html',
})
export class NestedFormComponent {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      parentArray: this.fb.array([]), // Top-level FormArray
    });

    // Add initial nested structures
    this.addParent();
  }

  get parentArray(): FormArray {
    return this.formGroup.get('parentArray') as FormArray;
  }

  // Add a parent FormGroup with a nested FormArray
  addParent(): void {
    const parent = this.fb.group({
      childArray: this.fb.array([
        this.fb.group({
          name: [''],
          email: [''],
        }),
      ]),
    });
    this.parentArray.push(parent);
  }

  // Add a child FormGroup to a specific parent
  addChild(parentIndex: number): void {
    const childArray = this.parentArray
      .at(parentIndex)
      .get('childArray') as FormArray;

    childArray.push(
      this.fb.group({
        name: [''],
        email: [''],
      })
    );
  }

  // Reset the entire nested structure
  resetForm(): void {
    this.resetNestedForm(this.formGroup);
  }

  // Recursive function to reset nested structures
  resetNestedForm(form: FormGroup | FormArray): void {
    if (form instanceof FormGroup) {
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control instanceof FormGroup || control instanceof FormArray) {
          this.resetNestedForm(control); // Recursively reset
        } else {
          control.reset(); // Reset simple controls
        }
      });
    } else if (form instanceof FormArray) {
      form.controls.forEach(control => {
        if (control instanceof FormGroup || control instanceof FormArray) {
          this.resetNestedForm(control); // Recursively reset
        } else {
          control.reset(); // Reset simple controls
        }
      });
    }
  }

  // Clear the entire nested structure
  clearForm(): void {
    this.clearNestedFormArray(this.parentArray);
  }

  // Recursive function to clear nested FormArrays
  clearNestedFormArray(formArray: FormArray): void {
    formArray.controls.forEach(control => {
      if (control instanceof FormArray) {
        this.clearNestedFormArray(control); // Recursively clear nested arrays
      }
    });
    formArray.clear(); // Clear the current array
  }
}
