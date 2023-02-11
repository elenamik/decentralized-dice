import React from "react";
import { CardData } from "types/card";

export type CardVariant = "small" | "medium" | "large";

const Card: React.FC<{ data: CardData; variant?: CardVariant }> = ({
  data,
  variant = "small",
}) => {
  const widths = {
    small: "w-[341px]",
    medium: "w-[374px]",
    large: "w-[440px]",
  };

  return (
    <div className="p-8" data-testid={`card-${variant}`}>
      <h1 className="pb-12 text-left italic">{data.subtitle}</h1>
      <div className={widths[variant] + " h-[252px] bg-grey-1 p-6"}>
        {data.content}
      </div>
    </div>
  );
};
export default Card;
