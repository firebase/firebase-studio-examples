export type Section = {
  id: string;
  value: string;
};

export type Wheel = {
  id:string;
  name: string;
  sections: Section[];
  colors: string[];
  history: string[];
};
