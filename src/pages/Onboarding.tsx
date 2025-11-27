import { useNavigate } from "react-router-dom";
import { authenticatedFetch } from "../utils/auth";

export function Onboarding() {
  const navigate = useNavigate();

  const handleClick = () => {
    async function completeOnboarding() {
      try {
        const response = await authenticatedFetch(
          `${import.meta.env.VITE_API_URL}/auth/complete-onboarding`,
          {
            method: "POST",
          }
        );
        if (response.ok) {
            navigate("/");
        } else {
          alert("Failed to complete onboarding.");
        }
      } catch (error) {
        console.log("Error completing onboarding:", error);
        alert("An error occurred. Please try again.");
      }
    }
    completeOnboarding();
    navigate("/");
  };

  return (
    <div className="flex w-full h-screen items-center flex-col overflow-hidden">
      <div className="flex w-full h-[60vh] bg-blue-500"></div>
      <div className="flex w-full h-min flex-col text-left px-5">
        <p className="text-3xl font-bold mt-6">Manage What To Do</p>
        <p className="mt-4 text-xl text-[#717171]">
          The best way to manage what you have to do, don't forget your plans
        </p>
        <button
          className="mt-25 px-6 py-3 bg-blue-600 text-white rounded-full flex w-full justify-center items-center"
          onClick={handleClick}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
