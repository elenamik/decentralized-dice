import { Game as GameEvent } from "../generated/PlayDice/PlayDice";
import { Game } from "../generated/schema";

export function handleGame(event: GameEvent): void {
  let entity = new Game(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.win = event.params.win;
  entity.loss = event.params.loss;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
