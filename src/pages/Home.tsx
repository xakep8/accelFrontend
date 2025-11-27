import { useEffect, useState } from "react";
import { Onboarding } from "./Onboarding";

export function Home() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/is-first-login`,
        {
          credentials: "include",
        }
      );
      if (result.ok) {
        const data = await result.json();
        setIsFirstVisit(data.isFirstLogin);
      }
      setLoading(false);
    }
    fetchData();
  }, [isFirstVisit]);

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        Loading...
      </div>
    );
  }

  if (isFirstVisit) {
    return <Onboarding />;
  }

  return (
    <div>
      <div>Home Page</div>
    </div>
  );
}
