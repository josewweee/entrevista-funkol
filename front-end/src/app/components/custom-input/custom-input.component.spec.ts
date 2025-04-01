import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonInput } from '@ionic/angular/standalone';
import { CustomInputComponent } from './custom-input.component';

// Create a test host component to test the custom input in a form context
@Component({
  template: `
    <form [formGroup]="form">
      <app-custom-input
        formControlName="testInput"
        [placeholder]="placeholder"
        [type]="type"
        [label]="label"
      >
      </app-custom-input>
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, CustomInputComponent],
})
class TestHostComponent {
  form = new FormGroup({
    testInput: new FormControl(''),
  });
  placeholder = 'Test placeholder';
  type = 'text';
  label = 'Test label';
}

describe('CustomInputComponent', () => {
  let component: CustomInputComponent;
  let fixture: ComponentFixture<CustomInputComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CustomInputComponent,
        IonInput,
        TestHostComponent,
      ],
    }).compileComponents();

    // Create standalone component for basic tests
    fixture = TestBed.createComponent(CustomInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Create host component for integration tests
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input properties', () => {
    expect(component.placeholder).toBe('');
    expect(component.type).toBe('text');
    expect(component.label).toBe('');
  });

  it('should update value when writeValue is called', () => {
    component.writeValue('test value');
    expect(component.value).toBe('test value');
  });

  it('should call the registered onChange function when value changes', () => {
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    component.value = 'new value';
    expect(spy).toHaveBeenCalledWith('new value');
  });

  it('should call the registered onTouched function when value changes', () => {
    const spy = jasmine.createSpy('onTouched');
    component.registerOnTouched(spy);
    component.value = 'new value';
    expect(spy).toHaveBeenCalled();
  });

  it('should work in a form context', () => {
    // Set value in form
    hostComponent.form.get('testInput')?.setValue('form value');
    hostFixture.detectChanges();

    // Get the custom input component instance from the host fixture
    const customInputEl =
      hostFixture.nativeElement.querySelector('app-custom-input');
    expect(customInputEl).toBeTruthy();

    // Check that input properties are correctly passed from host
    expect(hostComponent.placeholder).toBe('Test placeholder');
    expect(hostComponent.type).toBe('text');
    expect(hostComponent.label).toBe('Test label');
  });
});
