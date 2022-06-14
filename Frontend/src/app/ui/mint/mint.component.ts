import { Component, OnInit } from '@angular/core';
import { FlootContractService } from 'src/app/contracts/floot-contract.service';
import { SignedFlootContractService } from 'src/app/contracts/signed-floot-contract.service';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit {

  constructor(
    private flootContractService: FlootContractService,
    private signedFlootContractService: SignedFlootContractService 
  ) { }

  ngOnInit(): void {
  }

  async mint() {
    const rawTransaction = await this.signedFlootContractService.claim();
    console.log(rawTransaction);
  }

}
