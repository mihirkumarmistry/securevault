import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { IconService } from '@ant-design/icons-angular';
import { DeleteOutline, DownloadOutline, EyeOutline } from '@ant-design/icons-angular/icons';
import { FileView, UserFile } from '@model/file.model';
import { NgbModal, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiErrorService } from '@service/api-error.service';
import { ApiService } from '@service/api.service';
import { FilterPipe } from '@shared/pipes/filter.pipe';
import { SharedModule } from '@shared/shared.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-shared-with-me',
  standalone: true,
  imports: [FormsModule, SharedModule, NgbPaginationModule, NgbTypeaheadModule, PdfViewerModule],
  templateUrl: './shared-with-me.component.html',
  styleUrl: './shared-with-me.component.scss'
})
export class SharedWithMeComponent implements OnInit {
  @ViewChild('fileview') fileview!: TemplateRef<any>;
  
  private modalService = inject(NgbModal);
  protected searchText: string = '';
  protected filesBackup: Array<UserFile> = [];
  protected filesTemp: Array<UserFile> = [];
  protected files: Array<UserFile> = [];
  protected fileToView: FileView = { fileData: null, type: 'OTHER' };

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
    this.iconService.addIcon(
      ...[
        EyeOutline,
        DeleteOutline,
        DownloadOutline,
      ]
    );
  }

  ngOnInit(): void {
    this.getAllFiles();
  }

  protected getAllFiles(): void {
    this.apiService.getAllSharedFile().subscribe({
      next: (resp: Array<UserFile>) => {
        this.filesBackup = this.filesTemp = [...resp];
        this.collectionSize = this.filesBackup.length;
        this.refreshFiles();
      },
      error: () => this.apiErrorService.toastMessage('Error', 'Failed to get shared files', 'Error')
    });
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
    this.modalService.open(this.fileview);
  }

  private readFile(fileData: Blob, onLoad: (result: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => onLoad(reader.result as string);
    reader.readAsText(fileData);
  }

}
