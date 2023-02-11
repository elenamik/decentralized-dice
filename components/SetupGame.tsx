import { Button, Form, Input, Typography, Spin } from "antd";
import { useGameContext } from "contexts/gameContext";
import React from "react";
import { useContract, useProvider, useSigner } from "wagmi";
import ChessABI from "contracts/chessABI";
import { useMutation } from "react-query";
import { useWeb3LoadingContext } from "contexts/web3Loading";
const { Title } = Typography;

const SetupGame: React.FC = () => {
  const { data: signer } = useSigner();

  const { game } = useGameContext();

  const contract = useContract({
    address: game?.gameAddress,
    abi: ChessABI,
    signerOrProvider: signer,
  });

  const { isWeb3Loading, setIsWeb3Loading } = useWeb3LoadingContext();

  const { mutate, isLoading } = useMutation({
    mutationKey: `${game?.gameAddress}-move`,
    mutationFn: (args: { p1: string; p2: string }) => {
      return contract!.setUpGame(args.p1, args.p2);
    },
    onSuccess: (data) => {
      console.log("Success", data);
      setIsWeb3Loading(true);
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  const onCreateGameSubmit = async (e: { p1: string; p2: string }) => {
    mutate({ p1: e.p1, p2: e.p2 });
  };

  return (
    <div>
      <Title>Set Up Game:</Title>
      <Title type="secondary" level={5}>
        Contract address: {game.gameAddress}
      </Title>
      <Form
        name="basic"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 10 }}
        initialValues={{ remember: true }}
        onFinish={onCreateGameSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Player 1"
          name="p1"
          rules={[{ required: true, message: "Please input first player!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Player 2"
          name="p2"
          rules={[{ required: true, message: "Please input second player!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5 }}>
          <Button type="primary" htmlType="submit">
            Start Game
          </Button>
        </Form.Item>
      </Form>
      {isWeb3Loading && <Spin tip="Waiting For Block Confirmation" />}
      {isLoading && <Spin tip="Submitting Request" />}
    </div>
  );
};

export default SetupGame;
