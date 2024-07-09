import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './user-component.component.html',
  styleUrls: ['./user-component.component.scss']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  searchTerm = '';
  dataSource = new MatTableDataSource<User>(this.users);
  displayedColumns: string[] = ['userName', 'email', 'status', 'actions'];

  constructor(private userService: UserService, private toast: NgToastService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (response: any) => {
        console.log('Données reçues:', response); // Log les données reçues
        this.users = response.users;
        this.dataSource.data = this.users;
      },
      error => this.toast.danger("Erreur lors du chargement des utilisateurs")
    );
  }

  activateAccount(userId: string): void {
    this.userService.activateAccount(userId).subscribe(
      () => {
        this.toast.success("Compte activé avec succès");
        this.getUsers();
      },
      error => this.toast.danger("Erreur lors de l'activation du compte")
    );
  }

  deactivateAccount(userId: string): void {
    this.userService.deactivateAccount(userId).subscribe(
      () => {
        this.toast.success("Compte désactivé avec succès");
        this.getUsers();
      },
      error => this.toast.danger("Erreur lors de la désactivation du compte")
    );
  }
}
