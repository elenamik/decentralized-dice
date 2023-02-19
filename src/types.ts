export type Game = {
  __typename: string;
  id: string;
  win: string;
  loss: string;
  blockTimestamp: string;
  blockNumber: string;
};

export type Player = {
  __typename: string;
  id: string;
  wins: string;
  losses: string;
};
