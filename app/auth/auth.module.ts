import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { AngularMaterialsModule } from '../angular.materials.moduls';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
  ],
  imports: [
    FormsModule,
    AngularMaterialsModule,
    CommonModule,
    AuthRoutingModule
  ],
  exports: [
    LoginComponent,
    SignUpComponent,
  ]
})
export class AuthModule {}
