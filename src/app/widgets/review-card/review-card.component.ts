// review-card.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface Review {
  id: number;
  reviewid: string;
  userid: string;
  productid: string;
  commercialorpersonal: string;
  howlong: string;
  experiencerate: string;
  comment: string;
  efficiencyrate: string;
  documentationrate: string;
  paidornot: string;
  paidrate?: string;
  colorcode: string;
  username: string;
  createddate: string;
  email?: string;
}

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent {
  @Input() review!: Review;

  getStars(rating: string | number): string {
    const numRating = typeof rating === 'string' ? parseInt(rating) || 0 : rating || 0;
    const clampedRating = Math.max(0, Math.min(5, numRating));
    const fullStars = '⭐'.repeat(clampedRating);
    const emptyStars = '☆'.repeat(5 - clampedRating);
    return fullStars + emptyStars;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  }

  getUsageDurationText(duration: string): string {
    const durationMap: {[key: string]: string} = {
      '1-2 years': '1-2 years',
      '2-5 years': '2-5 years',
      '5+ years': '5+ years'
    };
    return durationMap[duration] || duration || 'Unknown duration';
  }

  getCommercialPersonalText(value: string): string {
    return value === 'yes' ? 'Commercial' : 'Personal';
  }

  getPaidVersionText(value: string): string {
    return value === 'yes' ? 'Paid' : 'Free';
  }

  getUserInitials(username: string): string {
    if (!username) return 'U';
    
    const names = username.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    
    const firstInitial = names[0].charAt(0);
    const lastInitial = names[names.length - 1].charAt(0);
    
    return (firstInitial + lastInitial).toUpperCase();
  }
}