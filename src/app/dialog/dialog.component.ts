import { ApiService } from './../services/api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  flist = ["Brand New","Second Hand","Refurbished"];
  productForm !: FormGroup;
  actionButton : string = "Save"
  constructor(private formBuilder: FormBuilder,
              private api: ApiService,
              private dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public editData : any ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName : ['',Validators.required],
      catagory : ['',Validators.required],
      freshness : ['',Validators.required],
      price : ['',Validators.required],
      comment : ['',Validators.required],
      date : ['',Validators.required]
    })

    if(this.editData){
      this.actionButton = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['catagory'].setValue(this.editData.catagory);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);

    }
  }

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        console.log(this.productForm.value)
        this.api.postProduct(this.productForm.value)
          .subscribe({
            next: (res) => {
              alert("Product Added SuccessFully")
              this.productForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              alert("Error while Adding product")
            }
          })
      }
    }else{
      this.updateProduct();
    }
  }

  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res) => {
        alert("Update Successful");
        this.productForm.reset();
        this.dialogRef.close('update');
      },error:() =>{
        alert("Error !");
      }
    })
  }

}
