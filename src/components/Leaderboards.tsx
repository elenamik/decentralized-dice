import { Spin, Table, Typography } from "antd";
import React from "react";
import { useBlockNumber } from "wagmi";
import { useQuery } from "react-query";
import { gql } from "@apollo/client";
import { graphQLClient } from "../graph";
import { Player } from "../types";

const GET_WINNERS_GQL = `
  query getWinners  {
    players (first:100, orderBy: wins, orderDirection: desc) {
      id
      wins
      losses
    }
  }
`;

export const Leaderboards: React.FC = () => {
  // for data refreshing
  const { data: blockNumber } = useBlockNumber({
    watch: true,
  });

  const { data, isLoading } = useQuery<{
    data: {
      players: Player[];
    };
  }>({
    onError: (error) => console.log(error),
    queryKey: ["players", blockNumber], // re-queries on each block update
    queryFn: () =>
      graphQLClient.query({
        fetchPolicy: "no-cache",
        query: gql`
          ${GET_WINNERS_GQL}
        `,
      }),
  });

  const makeRows = (data?: Player[]) => {
    if (!data || data.length === 0) return [];
    return data.map((player) => {
      return {
        key: player.id,
        address: player.id,
        wins: player.wins,
        losses: player.losses,
      };
    });
  };

  const columns = [
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Total wins",
      dataIndex: "wins",
      key: "wins",
    },

    {
      title: "Total losses",
      dataIndex: "losses",
      key: "losses",
    },
  ];

  const rows = makeRows(data?.data.players);

  return (
    <div>
      <Typography.Title level={3}>
        Leaderboards
        {isLoading && <Spin />}
      </Typography.Title>

      <Table dataSource={rows} columns={columns} />
    </div>
  );
};

export default Leaderboards;
