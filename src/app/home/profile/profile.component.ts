import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SmallerProductCardComponent } from '../../widgets/smaller-product-card/smaller-product-card.component';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/getuserid.service';
interface Tool {
  productimage: string;
  productname: string;
  userid: string;
  productid: string;
  productcategory: string;
  productusecase: string[];
  showDropdown?: boolean; // optional property for dropdown toggle
}
interface Review {
  profileImg: string;
  username: string;
  date: Date;
  comment: string;
  showDropdown?: boolean;
}
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule,SmallerProductCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  @ViewChildren('formField') formFields!: QueryList<ElementRef>;
  
  activeTab: string = 'Profile';
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  productAddingForm!: FormGroup;
  showDeleteConfirm: boolean = false;
  isaddingnewproduct: boolean = false;
  selectedProductImage: string | null = null;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  APIURL = environment.APIURL;
  idforauthafteruserloggedin = environment.idforauthafteruserloggedin;
  selectedProductFile: File | null = null;
  userInitials: string = "";
  isEditMode: boolean = false;

 toolsArray: Tool[] = [];

  reviewsArray: Review[] = [
  {
    profileImg: '../../../assets/images/12.png',
    username: 'John Doe',
    date: new Date('2025-08-01'),
    comment: 'Great product, really helped me improve my workflow!',
  },
  {
    profileImg: '../../../assets/images/12.png',
    username: 'Jane Smith',
    date: new Date('2025-08-05'),
    comment: 'Excellent support and features.',
  }
];
useCasesArray: string[] = [
  'Customer Support',
  'Lead Generation',
  'Marketing Automation',
  'Content Creation',
  'Sales Outreach',
  'Data Analysis',
  'Fraud Detection',
  'Recommendation Engine',
  'Speech Recognition',
  'Image Classification'
];
  filteredUseCases: string[] = [];
  selectedUseCases: string[] = [];
  useCaseInput: string = '';
  selectedImage: string | ArrayBuffer | null = null;
  userid: string = '';
  curruntpassword: string = '';
  message: string = '';
  messageClass: string = '';
  curruntemailaddress: string = '';
  updatingproductid: string = '';
  messageVisible: boolean = false;
  submitButtonText: string = 'Submit Product';




  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService:AuthService
  ) {}

  ngOnInit(): void {


this.productAddingForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      license: ['', Validators.required],
      technology: ['', Validators.required],  // fixed to string (dropdown)
      website: ['', Validators.required],
      fundingStage: ['', Validators.required],
      productdescription: ['', Validators.required],

      founders: this.fb.array([this.fb.control('', Validators.required)]),
      baseModels: this.fb.array([this.fb.control('', Validators.required)]),
      useCases: this.fb.array([]),
      
      deployments: this.fb.array([this.fb.control('', Validators.required)]),

      mediaPreviews: this.fb.array([this.fb.control(null)]),

      productfb: [''],
      productlinkedin: ['']
    });
 
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      linkedin: ['', Validators.required],
      facebook: ['', Validators.required],
      designation: ['', Validators.required],
      about: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });


      this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    // Check query param for active tab
    this.route.queryParams.subscribe((params: any) => {
  const tab = params['tab'];
  const action = params['action'];
  const productId = params['productid']; // get productid from query string

  if (tab) this.activeTab = tab;

  // Open Add Product form if action=add_product and tab=Your Tools
  if (tab === 'Your Tools' && action === 'add_product') {
    this.isaddingnewproduct = true;
    
    
    if (productId) {
      this.isEditMode = true;
      this.getProductDetailsToUpdate(productId);
      this.submitButtonText = 'Update Product';
      this.updatingproductid = productId;
      
    }
  } else {
    this.isEditMode = false;
    this.resetProductForm();
    this.submitButtonText = 'Submit Product';
    this.isaddingnewproduct = false;
  }
});


 this.userid=this.authService.getUserid()!;
    if (this.userid) { 
      this.getProductDetails(this.userid);
      this.getUserDetails(this.userid);
    }
  }



private resetProductForm(): void {
    // Reset the form to initial state
    this.productAddingForm.reset();
    
    // Reset form arrays to have single empty controls
    this.resetFormArray('founders');
    this.resetFormArray('baseModels');
    this.resetFormArray('deployments');
    this.resetFormArray('mediaPreviews');
    
    // Clear use cases
    this.selectedUseCases = [];
    this.useCaseInput = '';
    this.filteredUseCases = [];
    
    // Reset image
    this.selectedImage = null;
    this.selectedProductFile = null;
    this.selectedProductImage = null;
    
    // Reset form validation state
    this.productAddingForm.markAsUntouched();
    this.productAddingForm.markAsPristine();
  }

  private resetFormArray(arrayName: string): void {
    const formArray = this.productAddingForm.get(arrayName) as FormArray;
    
    // Clear all existing controls
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    
    // Add single empty control based on array type
    if (arrayName === 'mediaPreviews') {
      formArray.push(this.fb.control(null));
    } else {
      formArray.push(this.fb.control('', Validators.required));
    }
  }



  


async getProductDetailsToUpdate(productId: string): Promise<void> {
    const payload = { productid: productId };

    this.http.post(this.APIURL + 'get_product_details', payload).subscribe({
      next: (response: any) => {

        if (response.message === 'yes' && response.product) {
          this.populateProductForm(response);
        }
      },
      error: err => console.error('Error fetching product details for update:', err)
    });
  }

  private populateProductForm(response: any): void {
    const prod = response.product;

    // Patch basic form fields
    this.productAddingForm.patchValue({
      name: prod.productname || '',
      type: prod.productcategory || '',
      license: prod.productlicense || '',
      technology: prod.producttechnology || '',
      website: prod.productwebsite || '',
      fundingStage: prod.productfundingstage || '',
      productdescription: prod.productdescription || '',
      productfb: prod.productfacebook || '',
      productlinkedin: prod.productlinkedin || ''
    });

    // Handle product image if it exists
    if (prod.productimage) {
      this.selectedImage = `data:image/png;base64,${prod.productimage}`;
    }

    // Populate form arrays
    this.populateFormArray('founders', response.founders || []);
    this.populateFormArray('baseModels', response.baseModels || []);
    this.populateFormArray('deployments', response.deployments || []);
    this.populateFormArray('mediaPreviews', response.mediaPreviews || []);

    // Populate use cases
    if (response.useCases && response.useCases.length > 0) {
      this.selectedUseCases = [...response.useCases];
    }
  }

  private populateFormArray(arrayName: string, dataArray: string[]): void {
    const formArray = this.productAddingForm.get(arrayName) as FormArray;
    
    // Clear existing controls
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }

    // Add new controls with data
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(item => {
        formArray.push(this.fb.control(item, Validators.required));
      });
    } else {
      // Add at least one empty control if no data
      formArray.push(this.fb.control('', Validators.required));
    }
  }

  // Getter methods for form arrays
  get founders(): FormArray {
    return this.productAddingForm.get('founders') as FormArray;
  }

  get baseModels(): FormArray {
    return this.productAddingForm.get('baseModels') as FormArray;
  }

  get deployments(): FormArray {
    return this.productAddingForm.get('deployments') as FormArray;
  }

  get mediaPreviews(): FormArray {
    return this.productAddingForm.get('mediaPreviews') as FormArray;
  }

 







 setActiveTab(tab: string) {
  this.activeTab = tab;

  const queryParams: any = { tab };

  // If tab is "Your Tools" and we are adding a product, include action
  if (tab === 'Your Tools' && this.isaddingnewproduct) {
    queryParams.action = 'add_product';
  }

  this.router.navigate([], {
    relativeTo: this.route,
    queryParams,
    queryParamsHandling: 'merge'
  });
}




onAddProduct(): void {
  this.isaddingnewproduct = true;

  // Copy current query params and remove 'productid'
  const queryParams = { ...this.route.snapshot.queryParams };
  delete queryParams['productid'];  // remove productid if exists
  queryParams['action'] = 'add_product'; // set action

  // Navigate with updated params
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: queryParams,
    queryParamsHandling: '', // use these params explicitly
  });
}

  closeAddProduct(): void {
  this.isaddingnewproduct = false;

  // Copy current query params and remove 'action' and 'productid'
  const queryParams = { ...this.route.snapshot.queryParams };
  delete queryParams['action'];
  delete queryParams['productid'];

  // Navigate with remaining params
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: queryParams,
    queryParamsHandling: '', // replace with these params
  });
}

    
 onProductDeleted(productId: string): void {
   
    this.getProductDetails(this.userid);
  }

    
async getUserDetails(userid: string): Promise<void> {
  const payload = { userid };

  this.http.post(this.APIURL + 'get_user_details', payload).subscribe({
    next: (response: any) => {
      if (response.message === 'yes') {
        const user = response.user;

        // Patch values into profileForm
        this.profileForm.patchValue({
          name: user.username || '',
          email: user.email || '',
          linkedin: user.linkedin || '',
          facebook: user.facebook || '',
          designation: user.designation || '',
          about: user.about || ''
        });
        this.userInitials = this.generateInitials(user.username || '');
        this.curruntpassword = user.password ;
        this.curruntemailaddress = user.email ;
         
      } else {
        console.warn("No user found");
      }
    },
    error: (error) => {
      console.error('❌ Error fetching user details:', error);
    }
  });
}

   passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

onPasswordSubmit() {
  if (this.passwordForm.invalid) return;

  const oldPassword = this.passwordForm.get('oldPassword')?.value;
  const newPassword = this.passwordForm.get('newPassword')?.value;
  const confirmPassword = this.passwordForm.get('confirmPassword')?.value;

  // Old password validation
  if (oldPassword !== this.curruntpassword) {
    this.showMessage("Old password is incorrect!", "error");
    return;
  }

  // New password same as old password
  if (newPassword === oldPassword) {
    this.showMessage("New password must be different from old password!", "error");
    return;
  }

  // New password and confirm password match
  if (newPassword !== confirmPassword) {
    this.showMessage("New password and confirm password do not match!", "error");
    return;
  }

 
  this.passwordForm.reset();
  this.showMessage("Password updated successfully!", "success");
  this.router.navigate(['/auth/reset', this.idforauthafteruserloggedin]);
  sessionStorage.setItem('emailforauthafteruserloggedin', this.curruntemailaddress);
  sessionStorage.setItem('confirmPassword', confirmPassword);

}

  
  
  




private generateInitials(name: string): string {
  if (!name) return "";
  const words = name.trim().split(" ");
  const initials = words
    .slice(0, 2) // Take at most 2 words
    .map(w => w[0]?.toUpperCase() || "")
    .join("");
  return initials;
}




  onSubmitProduct(): void {
    if (this.productAddingForm.valid) {
      const formData = this.productAddingForm.value;
      formData.useCases = this.selectedUseCases;
      
      if (this.isEditMode) {
        this.updateProductDetails(formData);
      } else {

        this.createProduct();
      }
    } else {
      console.log('Form is invalid');
    }
  }

  private updateProductDetails(formData: any): void {
     const payload: any = {
    productid: this.updatingproductid,
    userid: this.userid,
    productname: formData.name,
    productcategory: formData.type,
    productlicense: formData.license,
    producttechnology: formData.technology,
    productwebsite: formData.website,
    productfundingstage: formData.fundingStage,
    productdescription: formData.productdescription,
    productfacebook: formData.productfb,
    productlinkedin: formData.productlinkedin,
    founders: formData.founders.filter((f: string) => f.trim() !== ''),
    baseModels: formData.baseModels.filter((b: string) => b.trim() !== ''),
    deployments: formData.deployments.filter((d: string) => d.trim() !== ''),
    mediaPreviews: formData.mediaPreviews.filter((m: string) => m && m.trim() !== ''),
    useCases: this.selectedUseCases
  };

    // Handle image if selected
  if (this.selectedProductFile) {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const base64String = (reader.result as string).split(',')[1];
        payload.productimage = base64String;
        this.sendUpdateRequest(payload);
      }
    };
    reader.readAsDataURL(this.selectedProductFile);
  } else {
    this.sendUpdateRequest(payload);
  }
}

  private sendUpdateRequest(payload: any): void {
    this.http.post(this.APIURL + 'update_product_details', payload).subscribe({
      next: (response: any) => {
        if (response.message === 'success') {
          this.showMessage('Product updated successfully!', 'success');
          this.showMessage("Product Is Updated","success");
          this.getProductDetails(this.userid);
          setTimeout(() => {
            this.router.navigate(['/home/user-profile'], { 
              queryParams: { tab: 'Your Tools' } 
            });
          }, 1000);
        } else {
          this.showMessage('Failed to update product', 'error');
        }
      },
      error: err => {
        console.error('Error updating product:', err);
        this.showMessage('Error updating product', 'error');
      }
    });
  }


onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    this.selectedProductFile = file; // ✅ store File

    // Create preview
    const reader = new FileReader();
    reader.onload = e => {
      this.selectedImage = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
  
async createProduct(): Promise<void> {
  const useCasesFormArray = this.productAddingForm.get('useCases') as FormArray;
  useCasesFormArray.clear();
  this.selectedUseCases.forEach(uc => useCasesFormArray.push(this.fb.control(uc)));

  if (this.productAddingForm.valid) {
    const formData = new FormData();

    // Append all form values
    formData.append('name', this.productAddingForm.get('name')?.value);
    formData.append('type', this.productAddingForm.get('type')?.value);
    formData.append('license', this.productAddingForm.get('license')?.value);
    formData.append('technology', this.productAddingForm.get('technology')?.value);
    formData.append('website', this.productAddingForm.get('website')?.value);
    formData.append('fundingStage', this.productAddingForm.get('fundingStage')?.value);
    formData.append('productdescription', this.productAddingForm.get('productdescription')?.value);
    formData.append('userid', this.userid);

    // Append array fields
    const founders = this.productAddingForm.get('founders')?.value || [];
    founders.forEach((f: string, i: number) => formData.append(`founders[${i}]`, f));

    const useCases = this.selectedUseCases || [];
    useCases.forEach((uc: string, i: number) => formData.append(`useCases[${i}]`, uc));

    const baseModels = this.productAddingForm.get('baseModels')?.value || [];
    baseModels.forEach((b: string, i: number) => formData.append(`baseModels[${i}]`, b));

    const deployments = this.productAddingForm.get('deployments')?.value || [];
    deployments.forEach((d: string, i: number) => formData.append(`deployments[${i}]`, d));

    const mediaPreviews = this.productAddingForm.get('mediaPreviews')?.value || [];
    mediaPreviews.forEach((m: string, i: number) => formData.append(`mediaPreviews[${i}]`, m));

    // Append product image as File
    const fileInput = (document.querySelector('input[type="file"]') as HTMLInputElement);
    if (fileInput?.files?.[0]) {
      formData.append('productImage', fileInput.files[0]); // ✅ send as File
    }

    // Append optional social links
    formData.append('productfb', this.productAddingForm.get('productfb')?.value || '');
    formData.append('productlinkedin', this.productAddingForm.get('productlinkedin')?.value || '');

    // --- LOG ALL FORM DATA ---
// formData.forEach((value, key) => {
//   console.log(key, value);
// });

    // Send to backend
    this.http.post(this.APIURL + 'insert_product', formData).subscribe({
      next: (response: any) => {
        if (response.message === "yes") {
          this.isaddingnewproduct = false;
          this.productAddingForm.reset();
          this.selectedUseCases = [];
          this.selectedProductImage = null;
          this.selectedImage = null;
          this.getProductDetails(this.userid);
          this.messageVisible = true;
          this.showMessage("Product Is Added","success");
       
        }
      },
      error: (error) => {
        console.error('❌ Error inserting product:', error);
      }
    });

  } else {
    this.productAddingForm.markAllAsTouched();
    console.warn('❌ Form is invalid.');
  }
}
showMessage(msg: string, type: 'success' | 'error') {
  this.message = msg;
  this.messageClass = type === 'success' ? 'green-good' : 'red-bad';
  this.messageVisible = true;

  // hide message after 3 seconds
  setTimeout(() => {
    this.messageVisible = false;
  }, 3000);
}
  
async getProductDetails(userid: string): Promise<void> {
  const payload = { userid };

  this.http.post(this.APIURL + 'get_all_product_details', payload).subscribe({
    next: (response: any) => {
      if (response.message === "yes" && response.products?.length) {
        this.toolsArray = response.products.map((prod: any) => ({
          productimage: prod.productimage 
            ? `data:image/jpeg;base64,${prod.productimage}`
            : '../../../assets/images/12.png',
          productname: prod.productname,
          userid: prod.userid,
          productid: prod.productid,
          productcategory: prod.productcategory,
          productusecase: prod.usecasenames || [],
          showDropdown: false
        }));

      } else {
        console.warn("No product found");
        this.toolsArray = [];
      }
    },
    error: (error) => {
      console.error('❌ Error fetching product details:', error);
    }
  });
}







togglePassword(field: 'old' | 'new' | 'confirm') {
  if (field === 'old') {
    this.showOldPassword = !this.showOldPassword;
  } else if (field === 'new') {
    this.showNewPassword = !this.showNewPassword;
  } else if (field === 'confirm') {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}



  

  
  onUseCaseInput(event: any) {
  const value = event.target.value.toLowerCase();
  this.useCaseInput = event.target.value;

  if (value) {
    this.filteredUseCases = this.useCasesArray.filter(usecase =>
      usecase.toLowerCase().includes(value) &&
      !this.selectedUseCases.includes(usecase)
    );
  } else {
    this.filteredUseCases = [];
  }
}

/** Select use case */
selectUseCase(usecase: string) {
  if (!this.selectedUseCases.includes(usecase)) {
    this.selectedUseCases.push(usecase);
    this.useCaseInput = '';
    this.filteredUseCases = [];
  }
}

/** Remove selected use case */
removeUseCase(usecase: string) {
  this.selectedUseCases = this.selectedUseCases.filter(u => u !== usecase);
  }
  


onProductImageSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.productAddingForm.patchValue({ productImage: file });

    // For preview
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedProductImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

onMediaSelected(event: any, index: number) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.mediaPreviews.at(index).setValue(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
}

removeMedia(index: number) {
  this.mediaPreviews.removeAt(index);
}
  
  addField(formArray: FormArray) {
    formArray.push(this.fb.control('', Validators.required));
  }

  removeField(formArray: FormArray, index: number) {
    if (formArray.length > 1) {
      formArray.removeAt(index);
    }
  }
 
 













  


  // Delete account
  onDeleteAccount() {
    console.log('Delete account confirmed');

    // TODO: Call your API to delete account
    alert('Account deleted successfully!');
    this.showDeleteConfirm = false;
  }



  
 




async onSubmit(): Promise<void> {
  const userid = this.authService.getUserid()!;
  if (!userid) {
    console.error("❌ No userid found in authService");
    return;
  }

  const payload = {
    userid,
    username: this.profileForm.get('name')?.value,
    email: this.profileForm.get('email')?.value,
    linkedin: this.profileForm.get('linkedin')?.value,
    facebook: this.profileForm.get('facebook')?.value,
    designation: this.profileForm.get('designation')?.value,
    about: this.profileForm.get('about')?.value
  };

  this.http.post(this.APIURL + 'update_user_details', payload).subscribe({
    next: (response: any) => {
      if (response.message === 'updated') {
        this.showMessage("User Details Updated","success");
        this.getUserDetails(userid);  
      } else {
        this.showMessage("Update failed","error");
        console.warn("⚠️ Update failed:", response.message);
      }
    },
    error: (error) => {
      this.showMessage("Error updating user details","error");
      console.error('❌ Error updating user details:', error);
    }
  });
}

 

  toggleDropdown(tool: Tool, event: Event) {
    event.stopPropagation();
    this.toolsArray.forEach(t => {
      if (t !== tool) t.showDropdown = false;
    });
    tool.showDropdown = !tool.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    this.toolsArray.forEach(t => t.showDropdown = false);
      this.reviewsArray.forEach(r => r.showDropdown = false);
  }

  onEditProduct(tool: Tool) {
  }

  onDeleteProduct(tool: Tool) {
  }

  toggleReviewDropdown(review: Review, event: Event) {
  event.stopPropagation();
  this.reviewsArray.forEach(r => {
    if (r !== review) r.showDropdown = false;
  });
  review.showDropdown = !review.showDropdown;
}

 
// Delete review
onDeleteReview(review: Review) {
  this.reviewsArray = this.reviewsArray.filter(r => r !== review);
  alert(`Deleted review from ${review.username}`);
  }
  
}
