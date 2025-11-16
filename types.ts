
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export enum SCORProcess {
  PLAN = 'Plan',
  SOURCE = 'Source',
  MAKE = 'Make',
  DELIVER = 'Deliver',
  ENABLE = 'Enable',
  PLAN_MAKE = 'Plan & Make',
  ENABLE_SOURCE = 'Enable & Source',
  DELIVER_ENABLE = 'Deliver & Enable',
  SOURCE_DELIVER = 'Source & Deliver',
  MAKE_ENABLE = 'Make & Enable',
}

export interface ResponseOption {
  id: string;
  text: string;
  impact: string;
  cost: number;
  time: number;
  risk: number;
}

export interface Scenario {
  id: string;
  title: string;
  scorStages: SCORProcess[];
  situation: string;
  impacts: string[];
  responses: ResponseOption[];
  feedback: string;
  difficulty: Difficulty;
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  scenarios: Scenario[];
}
