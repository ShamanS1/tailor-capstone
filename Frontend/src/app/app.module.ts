import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- Add this line
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MapComponent } from './map/map.component';
import { TailorHomeComponent } from './pages/tailor-home/tailor-home.component';
import { TailorDashboardComponent } from './pages/tailor-dashboard/tailor-dashboard.component';
import { TailorProfileComponent } from './pages/tailor-profile/tailor-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TailorLayoutComponent } from './shared/tailor-layout/tailor-layout.component';
import { OrderDetailsDialogComponent } from './components/order-details-dialog/order-details-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserLayoutComponent } from './shared/user-layout/user-layout.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { UserMyordersComponent } from './pages/user-myorders/user-myorders.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { MatBadgeModule } from '@angular/material/badge';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CategoryPopupComponent } from './components/category-popup/category-popup.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from './services/toast.service';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    MapComponent,
    TailorHomeComponent,
    TailorDashboardComponent,
    TailorProfileComponent,
    TailorLayoutComponent,
    OrderDetailsDialogComponent,
    UserLayoutComponent,
    UserHomeComponent,
    UserMyordersComponent,
    UserProfileComponent,
    ChangePasswordDialogComponent,
    CategoryPopupComponent,
    ConfirmDialogComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Add HttpClientModule here
    AppRoutingModule,
    FormsModule, // <-- Add this line
    ReactiveFormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatBadgeModule,
    MatDatepickerModule, // Add this
    MatNativeDateModule, // Add this
    MatCheckboxModule,
  ],
  providers: [
    ToastService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
