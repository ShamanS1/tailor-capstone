import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
selector: 'app-category-popup',
templateUrl: './category-popup.component.html',
styleUrls: ['./category-popup.component.css'],
})
export class CategoryPopupComponent {
selectedCategories: string[] = [];

constructor(
    public dialogRef: MatDialogRef<CategoryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedCategories = data.acceptedCategories; // Pre-select accepted categories
  }

  // Toggle category selection
  toggleCategory(category: string) {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter((cat) => cat !== category);
    } else {
      this.selectedCategories.push(category);
    }
  }

  // Close the dialog and return selected categories
  saveSelection() {
    this.dialogRef.close({ selectedCategories: this.selectedCategories });
  }

  // Close the dialog without saving
  cancel() {
    this.dialogRef.close();
  }
}
