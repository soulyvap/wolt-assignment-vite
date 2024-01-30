interface ThreeDotsAnimationProps {
  animate: boolean;
}

const ThreeDotsAnimation = (props: ThreeDotsAnimationProps) => {
  const dotClassName = "h-2 w-2 bg-wolt-blue rounded-full";

  return (
    <div className="flex flex-row gap-2">
      <div
        className={dotClassName + (props.animate ? " animate-bounce" : "")}
      />
      <div
        className={
          dotClassName + (props.animate ? " animate-bounce-delay-1" : "")
        }
      />
      <div
        className={
          dotClassName + (props.animate ? " animate-bounce-delay-2" : "")
        }
      />
    </div>
  );
};

export default ThreeDotsAnimation;
