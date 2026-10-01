import type { TrailQuestion, TrailStop } from '../types';

const questionFormats: Record<string, Omit<TrailQuestion, 'id' | 'exhibitId'>[]> = {
  'moon-rocket': [
    {type:'find',prompt:'Find the Moon Rocket XM-12 and scan its code.'},
    {type:'name',prompt:'What is the name of this toy?',answers:['Moon Rocket XM-12','Moon Rocket XM12']},
    {type:'blank',prompt:'Fill in the missing fact.',sentence:'The Moon Rocket XM-12 was made in ____.',answers:['Japan']},
    {type:'multiple-choice',prompt:'Which company made the Moon Rocket XM-12?',choices:['Yonezawa Toys','Louis Marx and Company','Lone Star Products'],answers:['Yonezawa Toys']},
  ],
  'robot-dalek': [
    {type:'find',prompt:'Find the Robot Action Dalek and scan its code.'},
    {type:'name',prompt:'What is the name of this toy?',answers:['Robot Action Dalek']},
    {type:'blank',prompt:'Fill in the missing fact.',sentence:'The Robot Action Dalek dates to around ____.',answers:['1974','c.1974']},
    {type:'multiple-choice',prompt:'What color was the museum\'s battery Dalek?',choices:['Yellow','Blue','Green'],answers:['Yellow']},
  ],
  'aqua-jet': [
    {type:'find',prompt:'Find the Lone Star Aqua Jet and scan its code.'},
    {type:'name',prompt:'What is the name of this toy?',answers:['Lone Star Aqua Jet']},
    {type:'blank',prompt:'Fill in the missing fact.',sentence:'The Aqua Jet was first released as the ____.',answers:['Dan Dare Aqua Jet']},
    {type:'multiple-choice',prompt:'Which company made the Lone Star Aqua Jet?',choices:['Yonezawa Toys','Louis Marx and Company','Lone Star Products'],answers:['Lone Star Products']},
  ],
  'comet-rover': [
    {type:'find',prompt:'Find the Demo Comet Rover and scan its code.'},
    {type:'name',prompt:'What is the name of this demo toy?',answers:['Demo Comet Rover']},
    {type:'blank',prompt:'Fill in the missing demo fact.',sentence:'The Demo Comet Rover has ____ wheels.',answers:['6','six']},
    {type:'multiple-choice',prompt:'How many wheels does the Demo Comet Rover have?',choices:['Four','Six','Eight'],answers:['Six']},
  ],
  'orbit-scout': [
    {type:'find',prompt:'Find the Demo Orbit Scout Ship and scan its code.'},
    {type:'name',prompt:'What is the name of this demo toy?',answers:['Demo Orbit Scout Ship']},
    {type:'blank',prompt:'Fill in the missing demo fact.',sentence:'The Demo Orbit Scout Ship carries ____ astronauts.',answers:['2','two']},
    {type:'multiple-choice',prompt:'What color are the Demo Orbit Scout Ship\'s wings?',choices:['Red','Blue','Yellow'],answers:['Red']},
  ],
};

const missionDetails = [
  {id:'launch',order:1,stampId:'launch',challenge:'Restore the launch dial.',storyIntro:'The Toy Time Machine is silent. Solve five toy clues to bring back its power.',storySuccess:'The launch dial glows again. The machine can start!'},
  {id:'direction',order:2,stampId:'direction',challenge:'Restore the direction dial.',storyIntro:'The machine has power, but it needs a direction. Solve five more toy clues.',storySuccess:'The direction dial is set. One more dial to go!'},
  {id:'home',order:3,stampId:'home',challenge:'Restore the home dial.',storyIntro:'The final dial will let the toys return home. Solve the last five toy clues.',storySuccess:'All three dials are restored. The Toy Time Machine is ready!'},
];

export const trailStops: TrailStop[] = missionDetails.map(mission => ({
  ...mission,
  collection:'Outerspace',
  questions:Object.entries(questionFormats).flatMap(([exhibitId, formats]) => formats.map(question => ({
    ...question,
    id:`${mission.id}-${exhibitId}-${question.type}`,
    exhibitId,
  }))),
}));
