const DashboardCard = ({ icon, title, count, textcolor }) => {
    return (
      <div className="bg-[linear-gradient(to_right,rgba(33,42,49,0.90),rgba(18,78,102,0.90))] flex items-center  space-x-8 p-6 rounded-xl shadow-sm border border-[#124E66] transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-white">
        <div className="bg-white text-blue p-4 rounded-lg text-4xl">{icon}</div>
        <div>
          <p className={`text-4xl font-bold ${textcolor}`}>{count}</p>
          <p className="text-lg text-blue-100 ">{title}</p>
          
        </div>
      </div>
    );
  };
  
  export default DashboardCard;
  