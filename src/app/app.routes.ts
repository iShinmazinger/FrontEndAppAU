import { Routes } from '@angular/router';
import { Onboarding } from './components/onboarding/onboarding';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Chat } from './components/chat/chat';
import { Perfil } from './components/perfil/perfil';
import { Crop } from './components/crop/crop';
import { CropUpdate } from './components/crop-update/crop-update';
import { Home } from './components/home/home';

export const routes: Routes = [
  { path: '', component: Onboarding },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'chat', component: Chat },
  { path: 'perfil', component: Perfil },
  { path: 'home', component: Home },
  { path: 'cultivos', component: Crop },
  { path: 'crop-updates/:id', component: CropUpdate },
  { path: '**', redirectTo: '' }
];