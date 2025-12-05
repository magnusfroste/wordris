const Fireplace = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-around">
      {[0, 1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="relative w-16 h-24 mb-2">
          <div className="absolute bottom-0 w-full h-12 bg-orange-600 rounded-t-full animate-[flame_2s_ease-in-out_infinite]" />
          <div className="absolute bottom-0 w-3/4 h-10 bg-orange-400 rounded-t-full left-1/2 -translate-x-1/2 animate-[flame_1.5s_ease-in-out_infinite_0.5s]" />
          <div className="absolute bottom-0 w-1/2 h-8 bg-yellow-400 rounded-t-full left-1/2 -translate-x-1/2 animate-[flame_1s_ease-in-out_infinite_1s]" />
        </div>
      ))}
    </div>
  );
};

export default Fireplace;