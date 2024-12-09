export interface Analyst {
  id?: string;
  name: string;
  email: string;
  team: string;
}

export interface Support {
  id?: string;
  name: string;
  analystId: string;
}

export interface Reason {
  id?: string;
  description: string;
}

export interface Ticket {
  id?: string;
  supportId: string;
  reasonId: string;
  analystId: string;
  observation: string;
  date: string;
}