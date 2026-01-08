import { ReactNode } from "react";

type NewsProps = {
  title: string;
  children: ReactNode;
};

export default function NewsItem({ title, children }: NewsProps) {
  return (
    <div className="text-center newsInfoContainer">
      <div className="newsHeader">
        <h3>{title}</h3>
      </div>
      <div className="newsBody"> {children}</div>
    </div>
  );
}
