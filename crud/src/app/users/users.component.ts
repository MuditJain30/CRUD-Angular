import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  userForm: any;
  employeeArray:any[]=[];
  isResultLoaded=false;
  isUpdateFormActive=false;

  emp_id: number =0;
  emp_name: string="";
  email: string="";
  age: number =0;
  currentEmployeeID: number | null=null;
  sortOrder: string ='ASC';
  searchEmpId: string = '';
  
  constructor(public fb:FormBuilder, private http: HttpClient){
    this.userForm=this.fb.group({
      emp_id: [""],
      emp_name: [""],
      email: [""],
      age: [""]
    });
    //this.getAllEmployees();
  }

  /*constructor( private http: HttpClient){
    this.getAllEmployees();};*/
  

  ngOnInit(): void {
    
    this.getAllEmployees();

    
  }


  getAllEmployees(){
    console.log("==getemployee==");
    this.http.get(`http://localhost:8080/employees?order=${this.sortOrder}`)
    .subscribe((res: any)=>{
      this.isResultLoaded=true;
      console.log(res,"resultData");
      this.employeeArray = res;
    });
  }


  searchEmployee() {
    //this.searchEmpId=data.searchEmpId;
    if (this.searchEmpId) {
      console.log("if");
      this.http.get("http://localhost:8080/employees/"+ this.searchEmpId)
        .subscribe((res: any) =>{
          this.isResultLoaded = true;
          console.log(res);
          this.employeeArray = res;
        }, error => {
          console.error("Error fetching data", error);
          this.employeeArray = [];
        });
    } else {
      console.log("else");
      this.getAllEmployees();
    }
  }


  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    this.getAllEmployees();
  }



  register(){
    let bodyData = {
      "emp_id" : this.userForm.value.emp_id,
      "emp_name" : this.userForm.value.emp_name,
      "email" : this.userForm.value.email,
      "age" : this.userForm.value.age
    };
    console.log(bodyData);
    this.http.post("http://localhost:8080/employees/add",bodyData)
    .subscribe((res: any)=>
    {
        console.log(res);
        alert("Employee Registered Successfully")
        this.getAllEmployees();
        this.userForm.reset();
    });
  }


  setUpdate(data: any){ 
    this.userForm.setValue({
      emp_id : data.emp_id,
      emp_name : data.emp_name,
      email : data.email,
      age : data.age});
  this.currentEmployeeID = data.emp_id;
  }
  UpdateRecords()
  {
    
    //console.log(this.userForm.value) ;
    let bodyData = 
    {
      //"emp_id" : this.userForm.value.emp_id,
      emp_name : this.userForm.value.emp_name,
      email : this.userForm.value.email,
      age : this.userForm.value.age
    };
    
    this.http.put("http://localhost:8080/employees/update/"+ this.currentEmployeeID,bodyData)
    .subscribe((res: any)=>
    {
        console.log(res);
        alert("Employee Update Successfull")
        this.getAllEmployees();
        this.userForm.reset();
        this.currentEmployeeID=null;
      
    });
  }


  save(){
    if(this.currentEmployeeID === null)
    {
        this.register();
    }
      else
      {
       this.UpdateRecords();
      }   
  }

  setDelete(data: any){
    this.http.delete("http://localhost:8080/employees/delete/"+ data.emp_id)
    .subscribe((res: any)=>{
        console.log(res);
        alert("Employee Deleted");
        this.getAllEmployees();
    });
  }

  SubmitForm(){
    console.log(this.userForm.value) ;
  }
}