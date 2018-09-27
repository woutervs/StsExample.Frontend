import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment.prod';

import { ProtectedpageComponent } from './protectedpage/protectedpage.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LandingComponent } from './landing/landing.component';
import { AuthenticationGuard } from './authentication-guard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const appRoutes: Routes = [
    { path: 'landing', component: LandingComponent, data: { title: 'Landing' } },
    { path: '', redirectTo: '/protectedpage', pathMatch: 'full' },
    { path: 'protectedpage', component: ProtectedpageComponent, data: { title: 'VIP Only' }, canActivate: [AuthenticationGuard] },
    { path: '**', component: PagenotfoundComponent }
];

@NgModule({
    declarations: [
        LandingComponent,
        ProtectedpageComponent,
        PagenotfoundComponent
    ],
    imports: [RouterModule.forRoot(
        appRoutes, {
            enableTracing: !environment.production
        }
    ),
        CommonModule,
        FormsModule],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}