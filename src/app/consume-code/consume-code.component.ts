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
  selector: 'app-consume-code',
  standalone: true,
  templateUrl: './consume-code.component.html',
  styleUrls: ['./consume-code.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class ConsumeCodeComponent implements OnInit, AfterViewInit {
  totalCount = 0;
  pageNumber = 0;
  pageSize = 5;
  totalPages = 0;
  searchTermName: string = '';
  searchTermCode: string = '';
  clients: Client[] = [];
  dataSource = new MatTableDataSource<Client>(this.clients);
  searchControlName = new FormControl();
  searchControlCode = new FormControl();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataCharge: boolean = false;

  displayedColumns: string[] = ['name', 'prenom', 'email', 'telephone', 'status', 'actions'];

  constructor(private clientService: ClientService, private toast: NgToastService) {}

  ngOnInit(): void {
    this.getAllClients();

    this.searchControlName.valueChanges.subscribe(search => {
      this.searchTermName = search;
      this.onSearch();
    });

    this.searchControlCode.valueChanges.subscribe(search => {
      this.searchTermCode = search;
      this.onSearch();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSearch() {
    if (this.searchTermName || this.searchTermCode) {
      this.getClients();
    } else {
      this.getAllClients();
    }
  }

  getAllClients() {
    this.dataCharge = true;
    this.clientService.getClients(this.pageNumber + 1, this.pageSize).subscribe({
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
    this.clientService.getClients(this.pageNumber + 1, this.pageSize, this.searchTermName, '', this.searchTermCode).subscribe({
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

  consumeCode(clientName: string) {
    this.clientService.consumeCode(clientName).subscribe({
      next: () => {
        this.toast.success("Code consommé avec succès.");
        this.onSearch(); // Refresh the client list
      },
      error: (err) => {
        console.log(err);
        this.toast.danger("Problème lors de la consommation du code, merci de vérifier.");
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
