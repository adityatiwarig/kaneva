import {Mosaic} from "react-loading-indicators"

const Loading = () => {
  return (
    <div className="flex flex-col items-center animate-fade-in pt-16">
      
      <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} />    

    </div>
  );
};

export default Loading;