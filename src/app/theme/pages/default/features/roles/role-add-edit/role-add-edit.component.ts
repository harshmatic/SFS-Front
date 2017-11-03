/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash/index';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { RoleService, FeatureService, PermissionService } from '../../../_services/index';
import { Role } from "../../../_models/Role";

/** Component Declaration */
@Component({
    selector: 'app-role-add-edit',
    templateUrl: './role-add-edit.component.html',
})

export class RoleAddEditComponent implements OnInit {
    errorMessage: any;
    params: number;
    permissionList: any;
    filteredPermissionList: any;
    selectedPermission: any;
    rolePermissionList: any;
    roleForm: FormGroup;
    roleName: string;
    featureList: any;

    constructor(
        private formBuilder: FormBuilder,
        private roleService: RoleService,
        private featureService: FeatureService,
        private permissionService: PermissionService,
        private route: ActivatedRoute,
        private router: Router,
        private globalErrorHandler: GlobalErrorHandler,
        private messageService: MessageService) {
    }
    ngOnInit() {
        this.filteredPermissionList = [];
        this.permissionList = [];
        this.roleForm = this.formBuilder.group({
            id: [],
            name: ['', [Validators.required]],
            description: [''],
        });
        this.route.params.forEach((params: Params) => {
            this.params = params['roleId'];
            if (this.params) {
                this.roleService.getRoleById(this.params)
                    .subscribe((results: Role) => {
                        this.getAllFeatures();
                        this.getPermissionsByRole();
                        this.roleName = results.name;
                        this.roleForm.setValue({
                            id: results.id,
                            name: results.name,
                            description: 'Test'
                        });
                    }, error => {
                        this.globalErrorHandler.handleError(error);
                    })
            }
        });
    }

    onSubmit({ value, valid }: { value: Role, valid: boolean }) {
        if (this.params) {
            this.roleService.updateRole(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
                    this.router.navigate(['/features/roles/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        } else {
            this.roleService.createRole(value)
                .subscribe(
                results => {
                    this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
                    this.router.navigate(['/features/roles/list']);
                },
                error => {
                    this.globalErrorHandler.handleError(error);
                });
        }
    }

    onAddPermission() {
        let params = {
            permission: this.selectedPermission.key,
            principalName: this.roleName,
            principalId: this.params
        }
        this.permissionService.addPermissionToRole(params)
            .subscribe(
            results => {
                this.getPermissionsByRole();
                //this.getfilteredPermissions();
                this.selectedPermission = null;
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Permission Added' });
            });
    }

    // filterPermission(event: any) {
    //     let query = event.query;
    //     this.filteredPermissionList = [];
    //     for (let i = 0; i < this.permissionList.length; i++) {
    //         let permission = this.permissionList[i];
    //         let rolePermissionData = _.find(this.rolePermissionList, { permission: permission.Key })
    //         if (rolePermissionData == null) {
    //             if (permission.Text.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
    //                 this.filteredPermissionList.push(permission);
    //             }
    //         }
    //     }
    // }
    revokePermission(permission: any) {
        this.permissionService.revokePermission(permission.id).subscribe(
            results => {
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'permission Deleted Successfully' });
                this.getPermissionsByRole();
            },
            error => {
                this.globalErrorHandler.handleError(error);
            })
    }
    onCancel() {
        this.router.navigate(['/features/roles/list']);
    }
    private getPermissionsByRole() {
        this.permissionService.getPermissionsByRole(this.params).subscribe(
            results => {
                this.rolePermissionList = results.permissions ? results.permissions : [];
                this.updatePermissionList(this.rolePermissionList);
                this.featureList = this.getFilteredFeatureList();
                this.getfilteredPermissions()
            },
            error => {
                this.globalErrorHandler.handleError(error);
            })
    }

    private updatePermissionList(rolePermissionList) {
        for (let i = 0; i < rolePermissionList.length; i++) {
            let rolePermission = rolePermissionList[i];
            let permission = rolePermission.permission.split(".");
            if (permission.length > 1) {
                rolePermission.text = "Can " + permission[1] + " " + rolePermission.featureName;
            }
        }
    }

    private getAllFeatures() {
        this.featureService.getAllFeatures()
            .subscribe(
            results => {
                this.featureList = results;
            },
            error => {
                this.globalErrorHandler.handleError(error);
            });
    }

    private getFilteredFeatureList() {
        let featureList = [];
        for (var index = 0; index < this.featureList.length; index++) {
            let count = _.filter(this.rolePermissionList, { featureName: this.featureList[index].FeatureName }).length;
            if (count != 4) {
                featureList.push(this.featureList[index]);
            }
        }
        return featureList;
    }

    getFeaturePermissions(feature) {
        let permissionsList = [];
        permissionsList.push({
            key: feature.ModelName + ".Create",
            text: "Can Create " + feature.FeatureName
        });
        permissionsList.push({
            key: feature.ModelName + ".Read",
            text: "Can Read " + feature.FeatureName
        });
        permissionsList.push({
            key: feature.ModelName + ".Update",
            text: "Can Update " + feature.FeatureName
        });
        permissionsList.push({
            key: feature.ModelName + ".Delete",
            text: "Can Delete " + feature.FeatureName
        })
        this.permissionList = permissionsList;
        this.getfilteredPermissions()
    }

    private getfilteredPermissions(){
        this.filteredPermissionList = [];
        for (let i = 0; i < this.permissionList.length; i++) {
            let permission = this.permissionList[i];
            let rolePermissionData = _.find(this.rolePermissionList, { permission: permission.key })
            if (rolePermissionData == null) {
                this.filteredPermissionList.push(permission);
            }
        }
    }
}
