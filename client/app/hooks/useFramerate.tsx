import { useEffect, useState } from "react";

export function useFramerate(fps: number) {
  const [triggerRender, setTriggerRender] = useState(true);
  
  useEffect(() => {
    const forceRender = () => {
      setTriggerRender(!triggerRender);
    };

    const interval = setInterval(forceRender, 1000 / fps);

    return () => clearInterval(interval);
  }, [triggerRender])

  return { triggerRender };
}
