import { Routes } from '@angular/router';
import { Onboarding } from './components/onboarding/onboarding';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Chat } from './components/chat/chat';
import { Perfil } from './components/perfil/perfil';
import { Crop } from './components/crop/crop';
import { CropUpdate } from './components/crop-update/crop-update';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Onboarding },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'chat', component: Chat, canActivate: [authGuard] },
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'cultivos', component: Crop, canActivate: [authGuard] },
  { path: 'crop-updates/:id', component: CropUpdate, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
