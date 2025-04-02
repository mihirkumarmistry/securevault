 import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { IconService } from '@ant-design/icons-angular';
import { CloudUploadOutline, DeleteOutline, DownloadOutline, EyeOutline, ShareAltOutline } from '@ant-design/icons-angular/icons';
import { FileShare, FileView, UserFile } from '@model/file.model';
import { UserResp } from '@model/user.model';
import { NgbModal, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiErrorService } from '@service/api-error.service';
import { ApiService } from '@service/api.service';
import { FilterPipe } from '@shared/pipes/filter.pipe';
import { SharedModule } from '@shared/shared.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [FormsModule, SharedModule, NgbPaginationModule, NgbTypeaheadModule, PdfViewerModule],
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  @ViewChild('fileview') fileview!: TemplateRef<any>;
  @ViewChild('fileshare') fileshare!: TemplateRef<any>;

  private modalService = inject(NgbModal);
  protected selectedFile: File | null = null;
  protected filesBackup: Array<UserFile> = [];
  protected filesTemp: Array<UserFile> = [];
  protected files: Array<UserFile> = [];
  protected searchText: string = "";
  protected fileDelete: UserFile | null = null;
  protected fileToView: FileView = { fileData: null, type: 'OTHER' };

  protected allUsers: UserResp[] = [];
  protected fileToShare: UserFile;
  protected fileShare: FileShare = {
    id: 0,
    users: [
      {
        user_id: 0,
        access_id: 0
      }
    ]
  };

  // Pagination
  page = 1;
  pageSize = 8;
  collectionSize = 0;

  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private iconService: IconService,
    private apiErrorService: ApiErrorService,
  ) {
    this.iconService.addIcon(EyeOutline, DeleteOutline, ShareAltOutline, DownloadOutline, CloudUploadOutline);
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllFiles();
  }

  protected getAllUsers(): void {
    this.apiService.getAllUser().subscribe({
      next: (resp) => {
        this.allUsers = resp;
      }
    });
  }

  protected getAllFiles(): void {
    this.apiService.getAllFile().subscribe({
      next: (resp: Array<UserFile>) => {
        this.filesBackup = this.filesTemp = [...resp];
        this.collectionSize = this.filesBackup.length;
        this.refreshFiles();
      },
      error: () => this.apiErrorService.toastMessage('Error', 'Failed to get files', 'Error')
    });
  }

  protected onFileSelected(event: any): void {
    this.selectedFile = event.target.files?.[0] || null;
  }

  protected uploadFile(): void {
    if (!this.selectedFile) {
      return this.apiErrorService.toastMessage('Warning', 'Please select a file', 'Warning');
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.apiService.postFileUpload(formData).subscribe({
      next: () => {
        this.getAllFiles();
        this.selectedFile = null;
        this.modalService.dismissAll();
        this.apiErrorService.toastMessage('Success', 'File uploaded successfully', 'Success');
      },
      error: () => this.apiErrorService.toastMessage('Error', 'Failed to upload a file', 'Error')
    });
  }

  protected downloadFile(file: UserFile): void {
    this.apiService.downloadFile(file.file_link).subscribe({
      next: (resp: any) => this.download(resp, file.file_name),
      error: () => this.apiErrorService.toastMessage('Error', 'Failed to download a file', 'Error')
    });
  }

  protected deleteFile(): void {
    if (!this.fileDelete) return;

    this.apiService.deleteFile(this.fileDelete.file_link).subscribe({
      next: () => {
        this.fileDelete = null;
        this.modalService.dismissAll();
        this.getAllFiles();
        this.apiErrorService.toastMessage('Success', 'File deleted successfully', 'Success');
      },
      error: () => this.apiErrorService.toastMessage('Error', 'Failed to delete the file', 'Error')
    });
  }

  private download(data: Blob, fileName: string): void {
    const blob = new Blob([data], { type: data.type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  protected openFileUploadModel(content: TemplateRef<any>): void {
    this.selectedFile = null;
    this.modalService.open(content, { centered: true });
  }

  protected openFileDeleteModel(content: TemplateRef<any>, file: UserFile): void {
    this.fileDelete = file;
    this.modalService.open(content, { centered: true });
  }

  // Filter Records
  protected onSearchChange(): void {
    const filterPipe = new FilterPipe();
    this.filesTemp = this.searchText ? filterPipe.transform(this.filesBackup, this.searchText) : [...this.filesBackup];
    this.collectionSize = this.filesTemp.length;
    this.page = 1;
    this.refreshFiles();
  }

  // Pagination
  protected refreshFiles(): void {
    this.files = this.filesTemp.map((file, i) => ({ id: i + 1, ...file }))
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  // View File
  protected getFileByName(file: UserFile): void {
    this.apiService.downloadFile(file.file_link).subscribe({
      next: (resp: Blob) => this.manageFileView(file, resp),
      error: () => this.apiErrorService.toastMessage('Error', 'Failed to download a file', 'Error')
    });
  }

  private manageFileView(fileObj: UserFile, fileData: Blob): void {
    this.fileToView.type = fileObj.type;
    switch (fileObj.type) {
      case 'PDF':
        this.fileToView.fileData = URL.createObjectURL(fileData);
        break;
      case 'SVG':
        this.readFile(fileData, (result: string) => {
          this.fileToView.fileData = this.sanitizer.bypassSecurityTrustHtml(result);
        });
        break;
      case 'PNG':
      case 'JPEG':
        const objectURL = URL.createObjectURL(fileData);
        this.fileToView.fileData = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
        break;
      case 'PLAIN':
        this.readFile(fileData, (result: string) => {
          this.fileToView.fileData = result;
        });
        break;
      case 'ZIP':
        break;
      default:
        break;
    }
    this.modalService.open(this.fileview, { size: 'xl' });
  }

  private readFile(fileData: Blob, onLoad: (result: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => onLoad(reader.result as string);
    reader.readAsText(fileData);
  }

  protected onShareFile(file: UserFile): void {
    this.fileToShare = file;
    this.fileShare.id = file.id;
    this.modalService.open(this.fileshare);
  }

  protected shareAddUser(): void {
    this.fileShare.users.push({ user_id: 0, access_id: 0 });
  }

  protected onCloseShareModel(): void {
    this.fileToShare = null;
    this.fileShare = {
      id: 0,
      users: [{ user_id: 0, access_id: 0 }]
    };
    this.modalService.dismissAll();
  }

  protected saveShareFile(): void {
    this.apiService.postFileShare(this.fileShare).subscribe({
      next: (resp) => {
        console.log(resp);
        this.onCloseShareModel();
        this.apiErrorService.toastMessage('Success', 'File shared successfully', 'Success');
      },
      error: () => this.apiErrorService.toastMessage('Error', 'Failed to share the file', 'Error')
    });
  }
}
