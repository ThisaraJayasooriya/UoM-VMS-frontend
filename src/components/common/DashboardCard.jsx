const DashboardCard = ({ icon, title, count }) => {
    return (
      <div className="bg-blue3 p-6 rounded-lg shadow-md flex items-center space-x-4 w-70 h-35 m-auto ml-20">
        <div className="bg-gray-600 text-white p-4 rounded-lg text-2xl">{icon}</div>
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-xl">{count}</p>
        </div>
      </div>
    );
  };
  
  export default DashboardCard;
  