import type { Exhibit } from '../types';

// Facts and demo image URLs from https://emint.com/outerspace/ . Replace remote
// images with approved local assets, and verify physical locations before launch.
export const exhibits: Exhibit[] = [
  {id:'moon-rocket',title:'Moon Rocket XM-12',description:'Made by Yonezawa Toys in Japan. The rocket has two pilots under a clear canopy and a nose wheel in its cockpit.',imageUrl:'https://emint.com/wp-content/uploads/2023/12/Moon-Rocket-XM-12-1.png',tags:['Outerspace','Japan']},
  {id:'robot-dalek',title:'Robot Action Dalek',description:'Made by Louis Marx and Company in the United Kingdom. The museum describes a yellow battery toy dating to around 1974.',imageUrl:'https://emint.com/wp-content/uploads/2023/12/Robot-Dalek-1.png',tags:['Outerspace','United Kingdom']},
  {id:'aqua-jet',title:'Lone Star Aqua Jet',description:'Made by Lone Star Products in the United Kingdom. It was first released as the Dan Dare Aqua Jet.',imageUrl:'https://emint.com/wp-content/uploads/2023/12/Lone-Star-Aqua-Jet-1.png',tags:['Outerspace','United Kingdom']},
  {id:'comet-rover',title:'Demo Comet Rover',description:'Demo exhibit. A six-wheel blue rover built by the MINT Demo Workshop. It carries a yellow sample container.',imageUrl:'/toys/demo-comet-rover.svg',tags:['Outerspace','Demo'],isDemo:true},
  {id:'orbit-scout',title:'Demo Orbit Scout Ship',description:'Demo exhibit. A silver toy spacecraft built by the MINT Demo Workshop. Two astronauts sit in its cockpit beneath red wings.',imageUrl:'/toys/demo-orbit-scout.svg',tags:['Outerspace','Demo'],isDemo:true},
];
