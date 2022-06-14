import { Inject, Injectable } from '@angular/core';
import { FlootContractService } from '../contracts/floot-contract.service';
import { SignedFlootContractService } from '../contracts/signed-floot-contract.service';
import { ContractService } from './contract/contract.service';
import { BigNumber, Contract, ethers } from "ethers";

@Injectable({
  providedIn: 'root'
})
export class EthersService {

  private ethereum: any;

  constructor(
    @Inject(FlootContractService) private contract: Contract,
    @Inject(SignedFlootContractService) private signedContract: Contract) {
      this.ethereum = (window as any).ethereum;
    }

  async requestAccount() {
    const accounts = await this.ethereum.request({ method: 'eth_accounts' });
    return accounts[0];
  }
  async getBalanceOf(){
    const balance = await this.contract.balanceOf(await this.requestAccount());
    return balance.toNumber();
  }

  async getOwnerOf(id: number){
    try {
      const addr:string = await this.contract.ownerOf(id);
      return addr.toLowerCase();
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getTokenIdByOwner(account: string): Promise<number[]> {
    const balance: BigNumber = await this.contract.balanceOf(account);
    let tokensIds = [];
    for (let i= 0; i < balance.toNumber(); i++){
      let token = await this.contract.tokenOfOwnerByIndex(account, i);
      tokensIds.push(token.toNumber());
    }               
    return tokensIds;
  }

  async getTokenMetadataByOwner(account: string) {
    const balance: BigNumber = await this.contract.balanceOf(account);
    let tokens = [];
    for (let i= 0; i < balance.toNumber(); i++){
      let token = await this.contract.tokenOfOwnerByIndex(account, i);
      const metadata: string = await this.getTokenURI(token);
      tokens.push(metadata);
    }               
    return tokens;
  }

  async getTotalSupply(): Promise<number> {
    const totalSupply: BigNumber = await this.contract.totalSupply(); 
    return totalSupply.toNumber();
  }

  getTokenURI(tokenId: BigNumber): Promise<string> {
    return this.contract.tokenURI(tokenId);
  }
}
