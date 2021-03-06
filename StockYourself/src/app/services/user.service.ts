import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { FetchService } from './fetch.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loggedInUser: User;
  authHeaders = {'Content-type':'application/json','Token':''};
  regHeaders = {'Content-type':'application/json'};

  constructor(private url:FetchService) { }

  async checkLogin() {
    let token = localStorage.getItem('Token');
    if (token) {
      let resp = await fetch(this.url.url + 'users/' + token + '/auth');
      if (resp.status===200) {
        this.loggedInUser = await resp.json();
      }
    }
  }

  async logIn(username:string,password:string): Promise<void> {
    let credentials = {
      'username':username,
      'password':password
      
    };
    console.log('username');
    let resp = await fetch(this.url.url + 'users/auth', {method:'POST',body:JSON.stringify(credentials),
    headers:this.regHeaders});

    if(resp.status===200) {
      let token = await resp.json();
      localStorage.setItem('Token',token);
    }
  }

  logOut(): void {
    localStorage.clear();
    this.loggedInUser = null;
  }

  async register(user:User): Promise<void> {
    let resp = await fetch(this.url.url + 'users', {method:'POST',body:JSON.stringify(user)});
    if (resp.status===200 || resp.status===201) {
      // TODO
    }
  }

  async updateUser(user:User): Promise<void> {
    if (user.id===this.loggedInUser.id) {
      let resp = await fetch(this.url.url + 'users/' + user.id, {method:'PUT',body:JSON.stringify(user)});
      if (resp.status===200) {
        this.loggedInUser = await resp.json();
      }
    }
  }  
}
