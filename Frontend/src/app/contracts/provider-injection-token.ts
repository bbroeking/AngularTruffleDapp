import { InjectionToken } from '@angular/core';
import { getDefaultProvider, providers } from 'ethers';
import { environment } from 'src/environments/environment';

export const PROVIDER = new InjectionToken<providers.BaseProvider>('Ethereum Provider', {
  providedIn: 'root',
  factory: () => getDefaultProvider(environment.network, {
    alchemy: environment.alchemy
  })
});