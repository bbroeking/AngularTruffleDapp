import { Injectable } from '@angular/core';
import { parse } from 'svg-parser';
import { EtherealSVG } from './ethereal';

@Injectable({
  providedIn: 'root'
})
export class NftParserService {

  constructor() { }

  parseNFT(data: string): EtherealSVG {
    // const parsed = parse(atob(data.slice(26)));
    let ethereal: EtherealSVG = {
      hp: 0,
      attack: 0,
      defense: 0,
      spattack: 0,
      spdefense: 0,
      speed: 0,
      typeOne: '',
      typeTwo: '',
      moveOne: '',
      moveOneType: '',
      moveTwo: '',
      moveTwoType: '',
      moveThree: '',
      moveThreeType: '',
      moveFour: '',
      moveFourType: ''
    };
    var values = ['hp', 'attack', 'defense', 'spattack', 'spdefense', 'speed', 'moveOne', 'moveTwo', 'moveThree', 'moveFour'];
    var colors = ['typeOne', 'typeTwo', 'moveOneType', 'moveTwoType', 'moveThreeType', 'moveFourType'];

    const temp = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48c3R5bGU+cmVjdC5tb3ZlIHtzdHJva2U6d2hpdGU7IHN0cm9rZS13aWR0aDoxcHg7fSByZWN0LnNxdWFyZSB7c3Ryb2tlOndoaXRlOyBzdHJva2Utd2lkdGg6MXB4O308L3N0eWxlPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxNTAiIGhlaWdodD0iNTAiIHJ4PSIxMCIgcnk9IjEwIiBmaWxsPSIjMDAwMDAwIiBjbGFzcz0ic3F1YXJlIi8+PHRleHQgeD0iMjUiIHk9IjI1IiBjbGFzcz0iaHAiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj42PC90ZXh0PjxyZWN0IHg9IjUwIiB5PSIwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHJ4PSIxMCIgcnk9IjEwIiBmaWxsPSIjMCIgY2xhc3M9InNxdWFyZSIvPjx0ZXh0IHg9Ijc1IiB5PSIyNSIgY2xhc3M9ImF0dGFjayIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPjg8L3RleHQ+PHJlY3QgeD0iMTAwIiB5PSIwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHJ4PSIxMCIgcnk9IjEwIiBmaWxsPSIjMCIgY2xhc3M9InNxdWFyZSIvPjx0ZXh0IHg9IjEyNSIgeT0iMjUiIGNsYXNzPSJkZWZlbnNlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+ODwvdGV4dD48cmVjdCB4PSIxNTAiIHk9IjAiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcng9IjEwIiByeT0iMTAiIGZpbGw9IiM2NzkwZjAiIGNsYXNzPSJzcXVhcmUgdHlwZU9uZSIvPjxyZWN0IHg9IjIwMCIgeT0iMCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTAiIHJ5PSIxMCIgZmlsbD0iI2Y4Y2YzMCIgY2xhc3M9InNxdWFyZSB0eXBlVHdvIi8+PHJlY3QgeD0iMjUwIiB5PSIwIiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjUwIiByeD0iMTAiIHJ5PSIxMCIgZmlsbD0iIzAiIGNsYXNzPSJzcXVhcmUiLz48cmVjdCB4PSIyNTAiIHk9IjAiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcng9IjEwIiByeT0iMTAiIGZpbGw9IjAiIGNsYXNzPSJzcXVhcmUiLz48dGV4dCB4PSIyNzUiIHk9IjI1IiBjbGFzcz0ic3BhdHRhY2siIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj44PC90ZXh0PjxyZWN0IHg9IjMwMCIgeT0iMCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTAiIHJ5PSIxMCIgZmlsbD0iIzAiIGNsYXNzPSJzcXVhcmUiLz48dGV4dCB4PSIzMjUiIHk9IjI1IiBjbGFzcz0ic3BkZWZlbnNlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+ODwvdGV4dD48dGV4dCBjbGFzcz0ic3BlZWQiIHg9IjM3NSIgeT0iMjUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj43PC90ZXh0PjxyZWN0IGNsYXNzPSJtb3ZlT25lVHlwZSIgeD0iMCIgeT0iNTAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIHJ5PSIxMCIgZmlsbD0iI2Y4Y2YzMCIvPjx0ZXh0IGNsYXNzPSJtb3ZlT25lIiB4PSIxMDAiIHk9IjEwMCIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPlRodW5kZXJib2x0PC90ZXh0PjxyZWN0IGNsYXNzPSJtb3ZlVHdvVHlwZSIgeD0iMjAwIiB5PSI1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMCIgcnk9IjEwIiBmaWxsPSIjOWY0MDlmIi8+PHRleHQgY2xhc3M9Im1vdmVUd28iIHg9IjMwMCIgeT0iMTAwIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+U2x1ZGdlPC90ZXh0PjxyZWN0IGNsYXNzPSJtb3ZlVGhyZWVUeXBlIiB4PSIwIiB5PSIxNTAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIHJ5PSIxMCIgZmlsbD0iIzY3OTBmMCIvPjx0ZXh0IHg9IjEwMCIgeT0iMjAwIiBjbGFzcz0ibW92ZVRocmVlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+Q2xhbXA8L3RleHQ+PHJlY3QgY2xhc3M9Im1vdmVGb3VyVHlwZSIgeD0iMjAwIiB5PSIxNTAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIHJ5PSIxMCIgZmlsbD0iI2E4YTg3NyIvPjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiBjbGFzcz0ibW92ZUZvdXIiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj5UcmkgQXR0YWNrPC90ZXh0Pjwvc3ZnPg=="
    const parsed = parse(atob(temp.slice(26)));
    const nodes: any[] = parsed.children[0].children
    console.log(nodes);
    for (let i = 0; i < nodes.length; i++) {
      const classNames = nodes[i].properties.class;
      if (classNames){
        const splitClassNames = classNames.split(" ");
        for (let j = 0; j < splitClassNames.length; j++){
          const compareClass = splitClassNames[j];
          if(values.includes(compareClass)){
            ethereal[compareClass] = nodes[i].children[0].value;
          }
          if(colors.includes(compareClass)){
            ethereal[compareClass] = nodes[i].properties.fill;
          }
        }
      }
    }
    return ethereal
  }
}
