// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  network: "rinkeby",  // need to deploy this on a test network for now TODO
  alchemy: '1L1v1ISJBZ6akeAuL8BMnJSxY0Nq4DIL',
  contract: '0x6DDAb8578fDa4F900EC463E1966Bd3061BAf5A89',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
