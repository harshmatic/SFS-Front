import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { SchoolService } from '../../../_services/school.service';
import { School } from "../../../_models/School";

@Component({
  selector: "app-users-list",
  templateUrl: "./school-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class SchoolAddEditComponent implements OnInit {
  errorMessage: any;
  params: number;
  schoolForm: FormGroup;
  institutes: SelectItem[];

  constructor(
    private formBuilder: FormBuilder, private schoolService: SchoolService,
    private route: ActivatedRoute, private router: Router
  ) {
  }

  ngOnInit() {
    this.institutes = [];
    this.institutes.push({ label: 'Select', value: null });
    this.institutes.push({ label: 'Institute1', value: 1 });
    this.institutes.push({ label: 'Institute2', value: 2 });

    this.schoolForm = this.formBuilder.group({
      id: [],
      InstituteId : [0, [Validators.required]],
      SchoolId : [1],
      SchoolName: ['', [Validators.required]],
      SchoolCode: ['', [Validators.required]],
      SchoolEmail: ['', [Validators.required]],
      SchoolPhone: ['', [Validators.required]],
      SchoolAddress: ['', [Validators.required]],
    });

    this.route.params.forEach((params: Params) => {
        this.params = params['schoolId'];
          if (this.params) {
            this.schoolService.getSchoolById(this.params)
              .subscribe((results:School) => {
                  this.schoolForm.setValue({
                      id: results.id,
                      SchoolId: results.SchoolId,
                      InstituteId : results.InstituteId,
                      SchoolName: results.SchoolName,
                      SchoolCode: results.SchoolCode,
                      SchoolEmail: results.SchoolEmail,
                      SchoolPhone: results.SchoolPhone,
                      SchoolAddress: results.SchoolAddress
                  });
              })             
          }
      });
  }

  onSubmit({ value, valid }: { value: School, valid: boolean }) {
      if (this.params) {
          this.schoolService.updateSchool(value)
              .subscribe(
              results => {
                  this.router.navigate(['/features/school/list']);
              },
              error => this.errorMessage = <any>error);
      } else {
          this.schoolService.createSchool(value)
              .subscribe(
              results => {
                  this.router.navigate(['/features/school/list']);
              },
              error => this.errorMessage = <any>error);
      }
  }
  onCancel() {
    this.router.navigate(['/features/school/list']);
  }
}

