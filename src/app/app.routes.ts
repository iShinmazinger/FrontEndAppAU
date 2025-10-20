import { Routes } from '@angular/router';
import { Onboarding } from './components/onboarding/onboarding';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Chat } from './components/chat/chat';
import { Perfil } from './components/perfil/perfil';
import { Crop } from './components/crop/crop';

export const routes: Routes = [
  { path: '', component: Onboarding },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'chat', component: Chat },
  { path: 'perfil', component: Perfil },
  { path: 'cultivos', component: Crop },
  { path: '**', redirectTo: '' }];
