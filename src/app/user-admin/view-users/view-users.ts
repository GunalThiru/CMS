import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUsersService } from '../../services/admin-users';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-users.html',
  styleUrls: ['./view-users.css']
})
export class AdminUsersComponent implements OnInit {

  activeTab: 'staff' | 'customers' = 'staff';

  page = 1;
  pageSize = 10;
  totalPages = 1;
  q = '';

  staff: any[] = [];
  customers: any[] = [];

  loading = false;

  constructor(private adminUserService: AdminUsersService) {}

  ngOnInit() {
    this.loadStaff();
  }

  switchTab(tab: 'staff' | 'customers') {
    if (this.activeTab === tab) return;

    this.activeTab = tab;
    this.page = 1;
    this.q = '';

    if (tab === 'staff') {
      this.staff = [];
      this.loadStaff();
    } else {
      this.customers = [];
      this.loadCustomers();
    }
  }

  onSearch() {
    this.page = 1;
    if (this.activeTab === 'staff') {
      this.staff = [];
      this.loadStaff();
    } else {
      this.customers = [];
      this.loadCustomers();
    }
  }

  loadStaff() {
    this.loading = true;

    this.adminUserService.getStaff(this.page, this.pageSize, this.q)
      .subscribe((res) => {
        if (this.page === 1) this.staff = res.items;
        else this.staff = [...this.staff, ...res.items];

        this.totalPages = res.total_pages;
        this.loading = false;
      });
  }

  loadMoreStaff() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadStaff();
    }
  }

  loadCustomers() {
    this.loading = true;

    this.adminUserService.getCustomers(this.page, this.pageSize, this.q)
      .subscribe((res) => {
        if (this.page === 1) this.customers = res.items;
        else this.customers = [...this.customers, ...res.items];

        this.totalPages = res.total_pages;
        this.loading = false;
      });
  }

  loadMoreCustomers() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadCustomers();
    }
  }
}
