import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconService } from '@ant-design/icons-angular';
import { EyeOutline } from '@ant-design/icons-angular/icons';
import { AuditLogs } from '@model/audit.model';
import { NgbModal, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '@service/api.service';
import { FilterPipe } from '@shared/pipes/filter.pipe';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, NgbPaginationModule, NgbTypeaheadModule],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss'
})
export class AuditComponent implements OnInit {
  @ViewChild('logview') logview!: TemplateRef<any>;
  private modalService = inject(NgbModal);


  protected logs: AuditLogs[] = [];
  protected logsTemp: AuditLogs[] = [];
  protected logsBackup: AuditLogs[] = [];
  protected viewLog: AuditLogs = null;

  protected searchText: string = "";

  // Pagination
  page = 1;
  pageSize = 8;
  collectionSize = 0;

  constructor(
    private apiService: ApiService,
    private iconService: IconService,
  ) {
    this.iconService.addIcon(EyeOutline);
  }

  public ngOnInit(): void {
    this.getAllLogs();
  }

  protected getAllLogs(): void {
    this.apiService.getAuditLogs().subscribe({
      next: (resp: AuditLogs[]) => {
        this.logsBackup = this.logsTemp = [...resp];
        this.collectionSize = this.logsBackup.length;
        this.refreshFiles();
      }
    });
  }

  // Filter Records
  protected onSearchChange(): void {
    const filterPipe = new FilterPipe();
    this.logsTemp = this.searchText ? filterPipe.transform(this.logsBackup, this.searchText) : [...this.logsBackup];
    this.collectionSize = this.logsTemp.length;
    this.page = 1;
    this.refreshFiles();
  }

  // Pagination
  protected refreshFiles(): void {
    this.logs = this.logsTemp.map((file, i) => ({ id: i + 1, ...file }))
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  // On View Log
  protected onViewLog(log: AuditLogs): void {
    this.viewLog = log;
    this.modalService.open(this.logview);
  }

}
