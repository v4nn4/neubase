export type Slot = {
  date: string; // format: 'YYYY-MM-DD'
  user: {
    name: string;
    email: string;
    comment?: string;
  };
};
