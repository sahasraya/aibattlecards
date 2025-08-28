import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {
 showReviewForm: boolean = false;
  showPaidRating: boolean = false;

  reviewForm!: FormGroup;
  ratings: number[] = [1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      isPaid: ['', Validators.required],
      ispaidtogglecommercialorpersonal: ['', Validators.required],
      usageDuration: ['', Validators.required],
      experienceRating: [1, Validators.required],
      efficiencyRating: [1, Validators.required],
      documentationRating: [1, Validators.required],
      paidVersionRating: [1],
      paidtogglecommercialorpersonal: [3],
      additionalComments: ['']
    });
  }

 togglePaidRating(show: boolean) {
    this.showPaidRating = show;
    if (!show) {
      this.reviewForm.get('paidVersionRating')?.setValue(null);
    }
  }

  
 togglecommercialorpersonal(show: boolean) {
   this.reviewForm.get('paidtogglecommercialorpersonal')?.setValue(null);
  }


  setRating(controlName: string, value: number) {
    this.reviewForm.get(controlName)?.setValue(value);
  }

  submitReview() {
    if (this.reviewForm.valid) {
      console.log('Review Submitted:', this.reviewForm.value);
      this.reviewForm.reset({ experienceRating: 5, efficiencyRating: 5, documentationRating: 5 });
      this.showReviewForm = false;
      this.showPaidRating = false;
    }
  }
 toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm;
  }
}
