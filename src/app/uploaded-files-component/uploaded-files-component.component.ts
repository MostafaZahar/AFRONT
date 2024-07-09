import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgToastService } from "ng-angular-popup";
import { UploadedFile } from '../models/uploaded-file.model';
import { ClientService } from '../services/client.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-uploaded-files',
  standalone: true,
  templateUrl: './uploaded-files-component.component.html',
  styleUrls: ['./uploaded-files-component.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class UploadedFilesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['fileName', 'filePath', 'uploadDate', 'status', 'userId'];
  dataSource = new MatTableDataSource<UploadedFile>();
  dataCharge: boolean = false;
  searchTermFileName: string = '';
  searchControlFileName = new FormControl();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private clientService: ClientService, private toast: NgToastService) {}

  ngOnInit(): void {
    this.getUploadedFiles();

    this.searchControlFileName.valueChanges.subscribe(search => {
      this.searchTermFileName = search;
      this.onSearch();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSearch() {
    if (this.searchTermFileName) {
      this.getFiles();
    } else {
      this.getUploadedFiles();
    }
  }

  getUploadedFiles() {
    this.dataCharge = true;
    this.clientService.getUploadedFiles().subscribe({
      next: (files) => {
        this.dataSource.data = files;
        this.dataCharge = false;
      },
      error: (err) => {
        console.log(err);
        this.dataCharge = false;
      }
    });
  }

  getFiles() {
    this.dataCharge = true;
    // Assuming the service method getUploadedFiles can accept searchTermFileName parameter
    this.clientService.getUploadedFiles(this.searchTermFileName).subscribe({
      next: (files) => {
        this.dataSource.data = files;
        this.dataCharge = false;
      },
      error: (err) => {
        console.log(err);
        this.dataCharge = false;
      }
    });
  }
}
