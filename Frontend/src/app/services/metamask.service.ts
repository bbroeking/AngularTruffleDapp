import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  
  public account: BehaviorSubject<string>;
  constructor() {
    this.account = new BehaviorSubject<string>('');
  }

  async connectAccount() {
    const { ethereum } = window as any;
    try {
      let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      this.account.next(accounts[0]);
    } catch (error) {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Please connect to MetaMask.');
      } else {
        console.error(error);
      }
    }
  }

  async getConnectedAccount() {
    try {
      const { ethereum } = window as any;
      let account: string[] = await ethereum.request({ method: 'eth_accounts' });
      return account[0];  
    } catch(err) {
      console.error(err);
      return '';
    }
  }

  async setConnectedAccount() {
    let account: string = await this.getConnectedAccount();
    this.account.next(account);
  }
  
  async isMetaMaskConnected() {
    let account: string = await this.getConnectedAccount();
    return account ? true : false;
  }
}
