import { ReloadOutlined } from "@ant-design/icons";
import { Button, Spin, Table, Typography } from "antd";
import React, { useEffect } from "react";
import { Game } from "types/game";
import { useBlockNumber } from "wagmi";
import { useQuery } from "react-query";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

const GRAPH_API_URL =
  "https://api.studio.thegraph.com/query/42265/decentralized-dice-2/0.0.2";

const graphQLClient = new ApolloClient({
  uri: GRAPH_API_URL,
  cache: new InMemoryCache(),
});

const GET_GAMES_GQL = `
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

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const RecentGames: React.FC = () => {
  const { data, isLoading, refetch } = useQuery<{
    data: {
      games: Game[];
    };
  }>("games", {
    onError: (error) => console.log(error),
    queryFn: () =>
      graphQLClient.query({
        query: gql`
          ${GET_GAMES_GQL}
        `,
      }),
  });
  const { blocknumber } = useBlockNumber({
    watch: true,
  });

  useEffect(() => {
    console.log("refetching");
    refetch();
  }, [blocknumber]);

  const makeRows = (data: Game[]) => {
    if (!data || data.length === 0) return [];
    return data.map((game) => {
      const date = new Date(parseInt(game.blockTimestamp) * 1000);
      return {
        key: game.id,
        win: truncateAddress(game.win),
        loss: truncateAddress(game.loss),
        timestamp: date.toLocaleString(),
        number: game.blockNumber,
      };
    });
  };

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 20,
    },
    {
      title: "Block Number",
      dataIndex: "number",
      key: "number",
      width: 10,
    },

    {
      title: "Win",
      dataIndex: "win",
      key: "win",
      width: 10,
    },
    {
      title: "Loss",
      dataIndex: "loss",
      key: "loss",
      width: 10,
    },
  ];

  const rows = makeRows(data?.data.games);

  return (
    <div>
      <Typography.Title level={3}>
        Recent Games
        {isLoading && <Spin />}
        <Button
          disabled={isLoading}
          onClick={() => {
            console.log("refetching");
            refetch();
          }}
          icon={<ReloadOutlined />}
        ></Button>
      </Typography.Title>

      <Table dataSource={rows} columns={columns} />
    </div>
  );
};

export default RecentGames;
