import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showMenu = false;
   @Output() toggleSidebar = new EventEmitter<void>()

  constructor(private router: Router, 
              private authService: AuthService
  ) { }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  @HostListener('document:click')
  hideMenu() {
    this.showMenu = false;
  }
    handleToggleSidebar(){
        this.toggleSidebar.emit();
    }
  logout() {
    this.authService.removeToken(); 

    this.router.navigate(['/home']);
  }
}