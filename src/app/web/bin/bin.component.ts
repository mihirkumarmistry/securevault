import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconService } from '@ant-design/icons-angular';
import { DeleteOutline, RetweetOutline } from '@ant-design/icons-angular/icons';
import { UserFile } from '@model/file.model';
import { NgbModal, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiErrorService } from '@service/api-error.service';
import { ApiService } from '@service/api.service';
import { FilterPipe } from '@shared/pipes/filter.pipe';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-bin',
  standalone: true,
  imports: [FormsModule, SharedModule, NgbPaginationModule, NgbTypeaheadModule],
  templateUrl: './bin.component.html',
  styleUrl: './bin.component.scss'
})
export class BinComponent implements OnInit {
  private modalService = inject(NgbModal);
  protected searchText: string = '';
  protected filesBackup: Array<UserFile> = [];
  protected filesTemp: Array<UserFile> = [];
  protected files: Array<UserFile> = [];
  protected fileDelete: UserFile | null = null;

  // Pagination 
  page = 1;
  pageSize = 8;
  collectionSize = 0;

  constructor(
    private apiService: ApiService,
    private iconService: IconService,
    private apiErrorService: ApiErrorService,
  ) {
    this.iconService.addIcon(
      ...[
        RetweetOutline,
        DeleteOutline,
      ]
    );
  }

  ngOnInit(): void {
    this.getAllBinFiles();
  }

  // Get all bin files
  protected getAllBinFiles(): void {
    this.apiService.getBinFiles().subscribe({
      next: (resp: Array<UserFile>) => {
        this.filesBackup = this.filesTemp = JSON.parse(JSON.stringify(resp));
        this.collectionSize = this.filesBackup.length;
        this.refreshFiles();
      },
      error: () => {
        this.apiErrorService.toastMessage('Error', 'Failed to get files', 'Error');

      }
    })
  }

  // Filter Records
  protected onSearchChange(event: any): void {
    if (this.searchText.length == 0) {
      this.filesTemp = JSON.parse(JSON.stringify(this.filesBackup));
    } else {
      const filterPipe = new FilterPipe();
      this.filesTemp = filterPipe.transform(this.filesBackup, this.searchText);
    }
    this.collectionSize = this.filesTemp.length;
    this.page = 1;
    this.refreshFiles();
  }

  protected downloadFile(file: UserFile): void {
    this.apiService.downloadFile(file.file_link).subscribe({
      next: (resp: any) => {
        this.download(resp, file.file_name);
      },
      error: () => {
        this.apiErrorService.toastMessage('Error', 'Failed to download a file', 'Error');
      }
    });
  }

  private download(data: Blob, fileName: string) {
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

  // Pagination
  protected refreshFiles() {
    this.files = this.filesTemp.map((file, i) => ({ id: i + 1, ...file })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  protected openFileDeleteModel(content: TemplateRef<any>, file: UserFile) {
    this.fileDelete = file;
    this.modalService.open(content, { centered: true });
  }

  protected deleteFile(): void {
    this.apiService.deleteBinFile(this.fileDelete.file_link).subscribe({
      next: (resp : any) => {
        this.fileDelete = null;
        this.modalService.dismissAll();
        this.getAllBinFiles();
        this.apiErrorService.toastMessage('Success', 'File deleted successfully', 'Success');
      },
      error: () => {
        this.apiErrorService.toastMessage('Error', 'Failed to download a file', 'Error');
      }
    });
  }
}
