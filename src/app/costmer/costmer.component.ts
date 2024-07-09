import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgToastService } from "ng-angular-popup";
import { Client } from "../models/Client.model";
import { ClientService } from "../services/client.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-costmer',
  standalone: true,
  templateUrl: './costmer.component.html',
  styleUrls: ['./costmer.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class CostmerComponent implements OnInit, AfterViewInit {
  totalCount = 0;
  pageNumber = 0;
  pageSize = 5;
  totalPages = 0;
  searchTermName: string = '';
  searchTermMatricule: string = '';
  clients: Client[] = [];
  dataSource = new MatTableDataSource<Client>(this.clients);
  searchControlName = new FormControl();
  searchControlMatricule = new FormControl();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataCharge: boolean = false;

  displayedColumns: string[] = ['matricule', 'name', 'prenom', 'telephone', 'email', 'code', 'status'];

  constructor(private _clientService: ClientService, private toast: NgToastService) {}

  ngOnInit(): void {
    this.getAllClients();

    this.searchControlName.valueChanges.subscribe(search => {
      this.searchTermName = search;
      this.onSearch();
    });

    this.searchControlMatricule.valueChanges.subscribe(search => {
      this.searchTermMatricule = search;
      this.onSearch();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSearch() {
    if (this.searchTermName || this.searchTermMatricule) {
      this.getClients();
    } else {
      this.getAllClients();
    }
  }

  getAllClients() {
    this.dataCharge = true;
    this._clientService.getClients(this.pageNumber + 1, this.pageSize).subscribe({
      next: (response) => {
        this.clients = response.clients;
        this.dataSource.data = this.clients;
        this.dataCharge = false;
        this.totalCount = response.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      },
      error: (err) => {
        console.log(err);
        this.dataCharge = false;
        this.toast.danger("Problème lors du chargement des fichiers, merci de vérifier.");
      }
    });
  }

  getClients() {
    this.dataCharge = true;
    this._clientService.getClients(this.pageNumber + 1, this.pageSize, this.searchTermName, this.searchTermMatricule).subscribe({
      next: (response) => {
        this.clients = response.clients;
        this.dataSource.data = this.clients;
        this.dataCharge = false;
        this.totalCount = response.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      },
      error: (err) => {
        console.log(err);
        this.dataCharge = false;
        this.toast.danger("Problème lors du chargement des fichiers, merci de vérifier.");
      }
    });
  }

  goToPreviousPage() {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.onSearch();
    }
  }

  goToNextPage() {
    if (this.pageNumber < this.totalPages - 1) {
      this.pageNumber++;
      this.onSearch();
    }
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.onSearch();
  }
}
