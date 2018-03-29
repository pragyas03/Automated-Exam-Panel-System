import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { HttpModule, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ExaminerService } from '../services/examiner.service';
import * as XLSX from 'xlsx';
import { ExaminerItem } from '../services/examiner.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-examiners',
  templateUrl: './examiners.component.html',
  styleUrls: ['./examiners.component.css']
})
export class ExaminersComponent implements OnInit {

private examiners: ExaminerItem[];

  examiner = {
    id : '',
    name : '',
    subject_code : '',
    address: '',
    department: '',
    type: '',
    email: '',
    contact: '',
  };

  public searchString: string;

  // File Reader---
  arrayBuffer: any;
  file: File;
  incomingfile(event) {
  this.file = event.target.files[0];
  }
  //
  constructor(private http: HttpClient, private router: RouterModule, private examinerService: ExaminerService) {
  }

  ngOnInit() {
    // Fetch All Examiners
    this.getExaminers();
  }

  getExaminers() {
    this.examinerService.getExaminers().subscribe(res => this.examiners = res);
    // console.log(this.examiners);
  }
// Modal Window functions
 openAddWindow() {
  this.examiner.id = '';
  this.examiner.name = '';
  this.examiner.subject_code = '';
  this.examiner.address = '';
  this.examiner.department = '';
  this.examiner.type = '';
  this.examiner.email = '';
  this.examiner.contact = '';

  $('#entry').val('Add');
  $('.modal_form').toggleClass('modal_form_on');
  $('.overlay').toggleClass('overlay_on');

  }

  closex() {
    $('.modal_form').toggleClass('modal_form_on');
    $('.overlay').toggleClass('overlay_on');
  }


  openEditWindow(examiner) {
    this.examiner.id = examiner.id,
    this.examiner.name = examiner.name;
    this.examiner.subject_code = examiner.subject_code,
    this.examiner.address = examiner.address;
    this.examiner.department = examiner.department;
    this.examiner.type = examiner.type;
    $('#entry').val('Update');
    $('.modal_form').toggleClass('modal_form_on');
    $('.overlay').toggleClass('overlay_on');
  }

  deleteExaminer(code) {
    this.examinerService.deleteExaminer(code).subscribe(res => {
      console.log(res);
      this.getExaminers();
    });
  }

  addDetail() {
    if ($('#entry').val() === 'Add') {
      this.addExaminer();
    }
    if ($('#entry').val() === 'Update') {
      this.editExaminer();
    }
  }

  addExaminer() {
    this.examinerService.addExaminer(this.examiner).subscribe(res => {
      console.log(res);
      this.getExaminers();
    });
    this.closex();
  }

  editExaminer() {
    this.examinerService.updateExaminer(this.examiner).subscribe(res => {
      console.log(res);
      this.getExaminers();
    });
    this.closex();

  }

  Upload() {
    const fileReader = new FileReader();
      fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          const data = new Uint8Array(this.arrayBuffer);
          const arr = new Array();
          for ( let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
          const bstr = arr.join('');
          const workbook = XLSX.read(bstr, {type: 'binary'});
          const first_sheet_name = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[first_sheet_name];
          // console.log(worksheet);
          // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
          const myFile = XLSX.utils.sheet_to_json(worksheet, { raw: true });
          this.examinerService.uploadFile(myFile);
      };
      fileReader.readAsArrayBuffer(this.file);
    }

    doit(type, fn, dl) {
      const json = this.examiners;
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['ExaminerSheet'] };
      XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'});
      XLSX.writeFile(wb, fn || ('Examiners.' + (type || 'xlsx')));
  }

}
