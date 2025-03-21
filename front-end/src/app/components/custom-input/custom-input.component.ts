import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { IonInput } from '@ionic/angular/standalone';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule, FormsModule, IonInput],
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() label: string = '';

  private _value: any = '';
  private onChange: Function = () => {};
  private onTouched: Function = () => {};

  // getter and setter for the value
  get value(): any {
    return this._value;
  }

  set value(val: any) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  // Methods for ControlValueAccessor
  writeValue(value: any): void {
    if (value !== undefined) {
      this._value = value;
    }
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implementation for disabled state if needed
  }
}
