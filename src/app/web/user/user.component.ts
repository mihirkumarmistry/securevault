import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconService } from '@ant-design/icons-angular';
import { DeleteOutline, EditOutline } from '@ant-design/icons-angular/icons';
import { UserRole } from '@model/auth.model';
import { UserResp, UserRoleReq } from '@model/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiErrorService } from '@service/api-error.service';
import { ApiService } from '@service/api.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  private modalService = inject(NgbModal);

  protected userForm: FormGroup;
  protected userList: Array<UserResp> = [];
  protected userRoles: Array<UserRole> = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private iconService: IconService,
    private apiErrorService: ApiErrorService
  ) {
    this.iconService.addIcon(
      ...[
        EditOutline,
        DeleteOutline,
      ]
    );
  }

  ngOnInit(): void {
    this.getUserRoles();
    this.getAllUsers();

    // Init form
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      role_id: [0, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required]
    });
  }

  private getUserRoles(): void {
    this.apiService.getUserRoles().subscribe({
      next: (resp: Array<UserRole>) => {
        this.userRoles = resp;
      },
      error: () => {
        this.apiErrorService.toastMessage('Error', 'Failed to get users roles');
      }
    })
  }

  private getAllUsers(): void {
    this.apiService.getAllUser().subscribe({
      next: (resp: Array<UserResp>) => {
        this.userList = resp;
        console.log(resp);
      },
      error: () => {
        this.apiErrorService.toastMessage('Error', 'Failed to get all users');
      }
    });
  }

  protected updateUserRole(): void {
    if (this.userForm.valid) {

      const formValue = this.userForm.value;
      const param: UserRoleReq = {
        email: formValue.email,
        role_id: parseInt(formValue.role_id)
      };

      this.apiService.putUserRole(param).subscribe({
        next: () => {
          this.getAllUsers();
          this.modalService.dismissAll();
          this.apiErrorService.toastMessage('Success', 'User role updated', 'Success');
        },
        error: () => {
          this.apiErrorService.toastMessage('Error', 'Failed to update user role', 'Error');
        }
      })
    }
  }

  openEditUserModel(content: TemplateRef<any>, user: UserResp) {
    this.userForm.reset();
    this.userForm.patchValue(user);
    this.modalService.open(content, { centered: true });
  }
}
