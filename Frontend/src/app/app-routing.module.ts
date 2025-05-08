import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TailorHomeComponent } from './pages/tailor-home/tailor-home.component';
import { TailorDashboardComponent } from './pages/tailor-dashboard/tailor-dashboard.component';
import { TailorProfileComponent } from './pages/tailor-profile/tailor-profile.component';
import { TailorLayoutComponent } from './shared/tailor-layout/tailor-layout.component';
import { UserLayoutComponent } from './shared/user-layout/user-layout.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { UserMyordersComponent } from './pages/user-myorders/user-myorders.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
{ path: '', component: IndexComponent },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },
{
path: '',
component: TailorLayoutComponent, // Use tailor-layout as a wrapper
children: [
{ path: 'tailor-home', component: TailorHomeComponent, canActivate: [AuthGuard] },
{ path: 'tailor-dashboard', component: TailorDashboardComponent, canActivate: [AuthGuard] },
{ path: 'tailor-profile', component: TailorProfileComponent, canActivate: [AuthGuard] },
],
},
{
path: '',
component: UserLayoutComponent, // Use tailor-layout as a wrapper
children: [
{ path: 'user-home', component: UserHomeComponent, canActivate: [AuthGuard] },
{ path: 'user-myorders', component: UserMyordersComponent, canActivate: [AuthGuard] },
{ path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
],
},
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
