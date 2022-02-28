import { ApiService } from './services/api.service';
import { DialogComponent } from './dialog/dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'AngularCrud';
  displayedColumns: string[] = ['productName', 'catagory', 'date', 'freshness', 'price', 'comment', 'Action'];
  dataSource !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(public dialog: MatDialog,
    private api : ApiService) {}

  ngOnInit(): void {
      this.getAllProducts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  openDialog() {
    this.dialog.open(DialogComponent, {
     width:'35%'
    }).afterClosed().subscribe(val=>{
      if(val == "save"){
        this.getAllProducts();
      }
    })
  }

  getAllProducts(){
    this.api.getProduct()
    .subscribe({
      next:(res) => {
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err) => {
        alert(err);
      }
    })
  }

  editProduct(row:any){
    this.dialog.open(DialogComponent, {
      width:'35%',
      data:row
     }).afterClosed().subscribe(val=>{
      if(val == "update"){
        this.getAllProducts();
      }
    })
  }

  deleteProduct(id:number){
    this.api.deleteProduct(id)
    .subscribe({
      next:(res)=>{
        alert("delete success");
        this.getAllProducts();
      },error:()=>{
        alert("delete Fail");
      }
    })
  }
}
