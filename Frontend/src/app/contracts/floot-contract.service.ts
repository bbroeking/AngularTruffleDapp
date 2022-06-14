import { Inject, Injectable } from '@angular/core';
import { Contract } from 'ethers';
import { environment } from 'src/environments/environment';
import { PROVIDER } from './provider-injection-token';
import * as tokenAbi from '../../../../floot/abi/Floot.json';

@Injectable({ providedIn: 'root' })
export class FlootContractService extends Contract {
  constructor(@Inject(PROVIDER) provider: any) {
    const abi = JSON.parse(JSON.stringify(tokenAbi)).default;
    super(environment.contract, abi, provider);
  }
}