import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
selector: 'app-change-password-dialog',
template: `
<h2 mat-dialog-title>Change Password</h2>
<mat-dialog-content>
<form [formGroup]="changePasswordForm">
<mat-form-field appearance="outline" class="full-width">
<mat-label>Current Password</mat-label>
<input
matInput
type="password"
formControlName="currentPassword"
required
/>
</mat-form-field>

<mat-form-field appearance="outline" class="full-width">
<mat-label>New Password</mat-label>
<input
matInput
type="password"
formControlName="newPassword"
required
/>
</mat-form-field>

<mat-form-field appearance="outline" class="full-width">
<mat-label>Confirm New Password</mat-label>
<input
matInput
type="password"
formControlName="confirmNewPassword"
required
/>
</mat-form-field>
</form>
</mat-dialog-content>
<mat-dialog-actions>
<button mat-button (click)="onCancel()">Cancel</button>
<button
mat-raised-button
color="primary"
(click)="onSave()"
[disabled]="changePasswordForm.invalid"
>
Save
</button>
</mat-dialog-actions>
`,
styles: [
`
.full-width {
width: 100%;
margin-bottom: 10px;
}
`,
],
})
export class ChangePasswordDialogComponent {
changePasswordForm: FormGroup;

constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>
  ) {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if new password and confirm password match
  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmNewPassword')?.value
      ? null
      : { mismatch: true };
  }

  // Save the new password
  onSave() {
    if (this.changePasswordForm.valid) {
      const formValue = this.changePasswordForm.value;
      this.dialogRef.close(formValue);
    }
  }

  // Close the dialog
  onCancel() {
    this.dialogRef.close();
  }
}
