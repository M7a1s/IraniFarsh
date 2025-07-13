import React, { useState, useEffect, Suspense } from "react";

const Map = React.lazy(() => import("./Map"));

const ClientOnlyMap = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <Map />
    </Suspense>
  );
};

export default ClientOnlyMap;
