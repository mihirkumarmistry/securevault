// angular import
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// project import
import { SharedModule } from '@shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { CloudServerOutline, FallOutline, FileImageOutline, FileOutline, FilePdfOutline, FileTextOutline, FileWordOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { NgxSpinnerService } from 'ngx-spinner';

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
export class DefaultComponent {
  recentLogs = [
    {
      id: "84564564",
      name: "Camera Lens",
      type: "Pdf",
      action: "Delete",
      status_type: "bg-danger",
      time: "2025-03-15 10:30"
    },
    {
      id: "84564786",
      name: "Laptop",
      type: "Image",
      action: "Read",
      status_type: "bg-warning",
      time: "2025-03-15 10:31"
    },
    {
      id: "84564522",
      name: "Mobile",
      type: "Doc",
      action: "Upload",
      status_type: "bg-success",
      time: "2025-03-15 10:31"
    },
    {
      id: "84564564",
      name: "Camera Lens",
      type: "Txt",
      action: "Delete",
      status_type: "bg-danger",
      time: "2025-03-15 10:31"
    },
    {
      id: "84564786",
      name: "Laptop",
      type: "Image",
      action: "Read",
      status_type: "bg-warning",
      time: "2025-03-15 10:31"
    },
    {
      id: "84564522",
      name: "Mobile",
      type: "Image",
      action: "Upload",
      status_type: "bg-success",
      time: "2025-03-15 10:31"
    }
  ];

  files = [
    {
      background: 'text-danger bg-light-danger',
      icon: 'file-pdf',
      title: 'PDF',
      time: 'Total PDF Files',
      amount: '50',
      percentage: '50%'
    },
    {
      background: 'text-success bg-light-success',
      icon: 'file-image',
      title: 'Image',
      time: 'Total Image Files',
      amount: '30 ',
      percentage: '30%'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'file-word',
      title: 'Word',
      time: 'Total Word Files',
      amount: '10',
      percentage: '10%'
    },
    {
      background: 'text-info bg-light-info',
      icon: 'file-text',
      title: 'Text',
      time: 'Total Text Files',
      amount: '10',
      percentage: '10%'
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
      number: '53%',
      message: 'of the 15GB is occupied'
    },
    {
      title: 'Shared With Me',
      icon: 'assets/images/icons/shared.svg',
      color: 'text-primary card-num-primary',
      number: 110,
      message: 'files are shared with me'
    },
    {
      title: 'Total Files',
      icon: 'assets/images/icons/files.svg',
      color: 'text-primary card-num-primary',
      number: '100',
      message: 'files are in your storage'
    },
    {
      title: 'Total In Bin',
      icon: 'assets/images/icons/bin.svg',
      color: 'text-danger card-num-danger',
      number: '10',
      message: 'files are in the Bin'
    }
  ];

  // constructor
  constructor(private iconService: IconService, private spinner: NgxSpinnerService) {
    this.iconService.addIcon(...[FileOutline, FileTextOutline, FileImageOutline, FileWordOutline, FilePdfOutline, CloudServerOutline, RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }

}
