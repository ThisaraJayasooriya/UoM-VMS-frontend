const DashboardCard = ({ icon, title, count, textcolor }) => {
    return (
      <div className="bg-gray-100 p-6 rounded-lg shadow-xl flex items-center space-x-4 w-70 h-35 m-auto ml-20 transition-transform duration-300 hover:-translate-y-1">
        <div className="bg-blue-200 text-blue p-4 rounded-lg text-4xl">{icon}</div>
        <div>
          <p className={`text-4xl font-bold ${textcolor}`}>{count}</p>
          <p className="text-md ">{title}</p>
          
        </div>
      </div>
    );
  };
  
  export default DashboardCard;
  