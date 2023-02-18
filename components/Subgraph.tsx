import { useBlockNumber } from "wagmi";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useQuery } from "react-query";
import { Spin, Table, Typography } from "antd";
import React from "react";

const APIURL =
  "https://api.studio.thegraph.com/query/42265/decentralized-dice-2/0.0.2";

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const GET_GAMES = `
  query getGames  {
    games (first:100, orderBy: blockNumber, orderDirection: desc) {
      id
      win
      loss
      blockTimestamp
      blockNumber
    }
  }
`;

export type Game = {
  __typename: string;
  id: string;
  win: string;
  loss: string;
  blockTimestamp: string;
  blockNumber: string;
};

export const Subgraph: React.FC = () => {
  const { data, isLoading, refetch, error } = useQuery<{
    data: {
      games: Game[];
    };
  }>("games", {
    queryFn: () =>
      client.query({
        query: gql`
          ${GET_GAMES}
        `,
      }),
  });

  if (error) console.log("graph error", error);

  useBlockNumber({ watch: true, onBlock: () => refetch() });

  const makeRows = (data: Game[]) => {
    if (!data || data.length === 0) return [];
    return data.map((game) => {
      const date = new Date(parseInt(game.blockTimestamp) * 1000);
      return {
        key: game.id,
        win: game.win,
        loss: game.loss,
        timestamp: date.toLocaleString(),
        number: game.blockNumber,
      };
    });
  };
  const rows = makeRows(data?.data.games);

  const columns = [
    {
      title: "Block Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "Win",
      dataIndex: "win",
      key: "win",
    },
    {
      title: "Loss",
      dataIndex: "loss",
      key: "loss",
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>
        Subgraph Data {isLoading && <Spin />}
      </Typography.Title>

      <Table dataSource={rows} columns={columns} />
    </div>
  );
};

export default Subgraph;
