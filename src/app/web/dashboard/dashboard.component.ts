// angular import
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { IconService } from '@ant-design/icons-angular';
import { CloudServerOutline, FallOutline, FileImageOutline, FileOutline, FilePdfOutline, FileTextOutline, FileWordOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { Dashboard } from '@model/dashboard.model';
import { ApiService } from '@service/api.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DefaultComponent implements OnInit {
  recentLogs = [];

  files = [
    {
      background: 'text-danger bg-light-danger',
      icon: 'file-pdf',
      title: 'PDF',
      time: 'Total PDF Files',
      amount: '0',
      percentage: '0%'
    },
    {
      background: 'text-success bg-light-success',
      icon: 'file-image',
      title: 'Image',
      time: 'Total Image Files',
      amount: '0 ',
      percentage: '0%'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'file-word',
      title: 'Word',
      time: 'Total Word Files',
      amount: '0',
      percentage: '0%'
    },
    {
      background: 'text-info bg-light-info',
      icon: 'file-text',
      title: 'Text',
      time: 'Total Text Files',
      amount: '0',
      percentage: '0%'
    },
    {
      background: 'text-warning bg-light-warning',
      icon: 'file',
      title: 'Other',
      time: 'Total Other Files',
      amount: '0',
      percentage: '0%'
    }
  ];

  AnalyticEcommerce = [
    {
      title: 'Storage',
      icon: 'assets/images/icons/storage.svg',
      color: 'text-primary card-num-primary',
      number: '',
      message: 'of the 2GB is used'
    },
    {
      title: 'Shared With Me',
      icon: 'assets/images/icons/shared.svg',
      color: 'text-primary card-num-primary',
      number: '',
      message: 'files are shared with me'
    },
    {
      title: 'Total Files',
      icon: 'assets/images/icons/files.svg',
      color: 'text-primary card-num-primary',
      number: '',
      message: 'files are in your storage'
    },
    {
      title: 'Total In Bin',
      icon: 'assets/images/icons/bin.svg',
      color: 'text-danger card-num-danger',
      number: '',
      message: 'files are in the Bin'
    }
  ];

  // constructor
  constructor(
    private iconService: IconService,
    private apiService: ApiService
  ) {
    this.iconService.addIcon(...[FileOutline, FileTextOutline, FileImageOutline, FileWordOutline, FilePdfOutline, CloudServerOutline, RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }

  ngOnInit(): void {
    this.getDashboard();
  }

  protected getDashboard(): void {
    this.apiService.getDashboard().subscribe({
      next: (resp: Dashboard) => {
        this.recentLogs = resp.recent_logs;

        this.AnalyticEcommerce.forEach((item) => {
          switch (item.title) {
            case 'Storage':
              item.number = resp.total_size
              break;
            case 'Shared With Me':
              item.number = resp.shared_count.toString()
              break;
            case 'Total Files':
              item.number = resp.file.toString()
              break;
            case 'Total In Bin':
              item.number = resp.bin.toString()
              break;
            default:
              break;
          }
        });

        this.files.forEach((item) => {
          switch (item.title) {
            case 'PDF':
              const pdfCount = resp.files.find(d => d.type == 'PDF')?.count;
              item.amount = pdfCount.toString() ?? '0';
              item.percentage = `${((pdfCount*100)/resp.file).toFixed(2)}%`;
              break;

            case 'Text':
              const plainCount = resp.files.find(d => d.type == 'PLAIN')?.count;
              item.amount = plainCount.toString() ?? '0';
              item.percentage = `${((plainCount*100)/resp.file).toFixed(2)}%`;
              break;

            case 'Word':
              const docxCount = resp.files.find(d => d.type == 'DOCX')?.count;
              item.amount = docxCount.toString() ?? '0';
              item.percentage = `${((docxCount*100)/resp.file).toFixed(2)}%`;
              break;

            case 'Other':
              const otherCount = resp.files.find(d => d.type == 'ZIP')?.count;
              item.amount = otherCount.toString() ?? '0';
              item.percentage = `${((otherCount*100)/resp.file).toFixed(2)}%`;
              break;

            case 'Image':
              let ImageCount = resp.files.find(d => d.type == 'PNG') ? resp.files.find(d => d.type == 'PNG').count : 0;
              ImageCount += resp.files.find(d => d.type == 'SVG') ? resp.files.find(d => d.type == 'SVG').count : 0;
              ImageCount += resp.files.find(d => d.type == 'JPEG') ? resp.files.find(d => d.type == 'JPEG').count : 0;
              item.amount = ImageCount.toString() ?? '0';
              item.percentage = `${((ImageCount*100)/resp.file).toFixed(2)}%`;
              break;
          
            default:
              break;
          }
        });
      }
    });
  }

}
