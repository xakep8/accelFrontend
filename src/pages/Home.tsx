import { useEffect, useState } from "react";
import { Onboarding } from "./Onboarding";
import { authenticatedFetch } from "../utils/auth";
import TaskList from "./components/TaskList";

export default function Home() {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/auth/is-first-login`
      );
      if (result.ok) {
        const data = await result.json();
        setIsFirstVisit(data.firstLogin);
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
    <div className="flex w-full h-full flex-col justify-center items-center">
        <TaskList />
    </div>
  );
}
