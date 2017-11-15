import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Categories } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class CommonService {
  constructor(private http: Http) {
  }

  getGender() {
    let gender = ["Male", "Female", "Other"];
    return gender;
    //return this.http.get(AppSettings.API_ENDPOINT + 'categories', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }
  getClass() {
    //let classList = ["--select--", "1st", "2nd", "3rd"];
    //return classList;
    return this.http.get(AppSettings.API_ENDPOINT + 'Classes', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }
  getCategory() {
    //let category = ["--select--", "General", "RTE", "Management", "Staff"];
    //return category;
    return this.http.get(AppSettings.API_ENDPOINT + 'Categories', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }
  getYear() {
    //let year = ["--select--", "2000", "2001", "2002"];
    //return year;
    return this.http.get(AppSettings.API_ENDPOINT + 'Academicyears', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }
  getBoard() {
    //let board = ["--select--", "SSC", "CBSC", "ICSC"];
    //return board;
    return this.http.get(AppSettings.API_ENDPOINT + 'Boards', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }
  getBloodGroup() {
    let blooDgroup = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    return blooDgroup;
    //return this.http.get(AppSettings.API_ENDPOINT + 'categories', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }
}
