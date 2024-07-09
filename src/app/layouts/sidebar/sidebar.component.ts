import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CoreMenu, CoreMenuItem } from '../../models/sidebar-menu';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router';
import { User } from '../../models/session-data';
import { AuthService } from "../../../@core/auth/auth.service";

@Component({
  selector: 'fthr-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input({ required: true }) collapsedSidebar?: boolean;
  @Input() user?: User | null;
  userRole = localStorage.getItem('role') as "admin" | "user"

  public sidebarService = inject(SidebarService);
  public router = inject(Router);

  public openedRootId?: string;
  public activeItemId?: string;
  public animating?: boolean;

  constructor(private _authService: AuthService) {}

  public menu: CoreMenu = {
    children: [
      {
        id: '1',
        title: 'Accueil',
        url: 'accueil',
        type: 'item',
        icon: 'house',
        role: ['user']
      },
      {
        id: '2',
        title: 'Clients',
        type: 'item',
        url: 'client',
        icon: 'database-fill',
      },
      {
        id: '3',
        title: 'Importer une Liste des clients',
        url: 'uploadData',
        type: 'item',
        icon: 'file-earmark-text',
        role: ['user']
      },
      {
        id: '4',
        title: 'Consommer Codes',
        url: 'consume-code',
        type: 'item',
        icon: 'key-fill',
        role: ['user']
      },
      {
        id: '5',
        title: 'Fichiers Uploadés',
        url: 'uploaded-files',
        type: 'item',
        icon: 'folder2-open', // Update icon if necessary
        role: ['user']
      }
    ]
  }

  ngOnInit(): void {
    const currentUser = this._authService.getCurrentUser()
    if (currentUser === 'admin') {
      if (this.menu && this.menu.children) {
        this.menu.children.splice(1, 0, {
          id: '6',
          title: 'Users',
          type: 'item',
          url: 'users',
          icon: 'person'
        });
      }
    }
  }

  menuRootClicked(item: CoreMenuItem) {
    this.openedRootId = (this.openedRootId == item.id) ? undefined : item.id

    if (item.url && item.type == 'item') {
      this.router.navigate([item.url])
    }
  }

  menuItemClicked(item: CoreMenuItem) {
    this.activeItemId = item.id;

    if (item.url && item.type == 'item') {
      this.router.navigate([item.url])
    }
  }

  toggleSidebar() {
    this.animating = true;
    const timeOut = setTimeout(() => {
      this.animating = false;
      clearTimeout(timeOut);
    }, 300);

    this.sidebarService.isCollapsed.update(collapsed => !collapsed);
  }
}
