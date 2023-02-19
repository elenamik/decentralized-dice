import { Game as GameEvent } from "../generated/PlayDice/PlayDice";
import { Game, Player } from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

const updatePlayer = (player: Player, win: boolean, value: BigInt): void => {
  if (win) {
    player.wins = player.wins + 1;
    player.winValue = player.winValue.plus(value);
  } else {
    player.losses = player.losses + 1;
    player.lossValue = player.lossValue.plus(value);
  }
  player.save();
};

// eslint-disable-next-line no-undef
const newPlayer = (id: Bytes): Player => {
  const player = new Player(id);
  player.wins = 0;
  player.losses = 0;
  player.winValue = BigInt.fromString("0");
  player.lossValue = BigInt.fromString("0");
  return player;
};

export function handleGame(event: GameEvent): void {
  let game = new Game(event.transaction.hash.concatI32(event.logIndex.toI32()));
  game.win = event.params.win;
  game.loss = event.params.loss;

  game.blockNumber = event.block.number;
  game.blockTimestamp = event.block.timestamp;
  game.transactionHash = event.transaction.hash;
  game.save();

  const winnerId = event.params.win;
  let winner = Player.load(winnerId);
  if (winner == null) {
    winner = newPlayer(winnerId);
  }
  updatePlayer(winner, true, event.params.value);

  const loserId = event.params.loss;
  let loser = Player.load(loserId);
  if (loser == null) {
    loser = newPlayer(loserId);
  }
  updatePlayer(loser, false, event.params.value);
}
