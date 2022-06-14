import { Component, OnInit } from '@angular/core';
import { EthersService } from 'src/app/services/ethers.service';
import { Metadata } from 'src/app/services/metadata';
import { MetamaskService } from 'src/app/services/metamask.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Ethereal, EtherealSVG } from 'src/app/services/colosseum/ethereal';
import { NftParserService } from 'src/app/services/colosseum/nft-parser.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dataUrl: string;
  srcData : SafeResourceUrl[] = [];
  ethereal: Ethereal;
  etherealSVG: EtherealSVG;
  constructor(
    private metamaskService: MetamaskService,
    private ethersService: EthersService,
    private sanitizer: DomSanitizer,
    private nftParser: NftParserService
    ) { }

  async ngOnInit() {
    const account = await this.metamaskService.getConnectedAccount();
    const ids = await this.ethersService.getTokenIdByOwner(account);
    const svgs = await this.ethersService.getTokenMetadataByOwner(account);
    
    for (let i = 0; i < svgs.length; i++){
      const decoded = atob(svgs[i].slice(29));
      const metadata: Metadata = JSON.parse(decoded);
      this.addToTeam(metadata);

      this.srcData.push(this.sanitizer.bypassSecurityTrustResourceUrl(metadata.image));
    }

  }

  addToTeam(metadata){
    this.etherealSVG = this.nftParser.parseNFT(metadata.image);
    this.ethereal = new Ethereal(this.etherealSVG);
    console.log(this.ethereal);
  }

}
