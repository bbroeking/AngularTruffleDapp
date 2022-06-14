import { Injectable } from '@angular/core';
import { Contract } from 'ethers';
import { environment } from 'src/environments/environment';
import * as tokenAbi from '../../../../floot/abi/Floot.json';
import { Web3Provider } from './web3-provider';

@Injectable({ providedIn: 'root' })
export class SignedFlootContractService extends Contract {
  constructor(provider: Web3Provider) {
    const abi = JSON.parse(JSON.stringify(tokenAbi)).default;
    super(environment.contract, abi, provider.getSigner());
  }
}