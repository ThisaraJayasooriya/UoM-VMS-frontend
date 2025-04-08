import { useNavigate } from "react-router-dom";


function LoginPage() {
    const navigate = useNavigate();

    const handleSecurityClick = () => {
        navigate("/security");
      };
    
      const handleHostClick = () => {
        navigate("/host");
      };
      const handleVisitorClick = () => {
        navigate("/visitor");
      };
      const handleadminClick = () => {
        navigate("/admin");
      };
        
      
  return (
    <div>
    <h1 className="text-4xl text-center mt-10 mb-10">Login Page</h1>
    <div className="flex justify-center space-x-4">
      <button
        className="bg-darkblue text-white px-4 py-2 rounded cursor-pointer"
        onClick={handleSecurityClick}
      >
        Go to Security Section
      </button>
      <button
        className="bg-darkblue text-white px-4 py-2 rounded cursor-pointer"
        onClick={handleHostClick}
      >
        Go to host Section
      </button>
      <button
        className="bg-darkblue text-white px-4 py-2 rounded cursor-pointer"
        onClick={handleadminClick}
      >
        Go to admin Section
      </button>
        
       <button
        className="bg-darkblue text-white px-4 py-2 rounded cursor-pointer"
        onClick={handleVisitorClick}
      >
        Go to visitor Section
      </button>
    </div>
    </div>
  )
}

export default LoginPage
