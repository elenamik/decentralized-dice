import { DownOutlined, UpOutlined } from "@ant-design/icons";
import React from "react";

export const NumberSelector: React.FC<{
  text: string;
  canEdit?: boolean;
  value: string;
}> = ({ text, canEdit = true, value }) => {
  return (
    <div className="my-4 flex w-[240px] flex-col items-center">
      <div className="mb-4 text-center text-xs">{text}</div>
      <div className="flex justify-around align-top">
        <div className="my-auto w-[140px] text-center text-xl font-bold text-black-1">
          {value}
        </div>
        {canEdit && <UpDownButtons />}
      </div>
      {canEdit && <div className="mb-4 h-[2px] w-full bg-black-1"></div>}
    </div>
  );
};
export default NumberSelector;

const UpDownButtons = () => {
  const style = {
    width: "14px",
    textAlign: "center",
    fontSize: "9px",
    color: "#939292",
    borderColor: "#939292",
    borderStyle: "solid",
    borderWidth: "1px",
    padding: "2px",
    margin: "2px",
  };
  return (
    <div className="my-2 flex flex-col">
      <UpOutlined style={style} />
      <DownOutlined style={style} />
    </div>
  );
};
